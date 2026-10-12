import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

function loadFixtureModule(path, dependencies) {
  const compiled = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const fixture = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency: ${name}`);
    return dependencies[name];
  }, fixture, fixture.exports);
  return fixture.exports;
}

test("both pricing queries explicitly request uncached published data", async () => {
  const calls = [];
  const pricing = loadFixtureModule("../src/sanity/lib/pricing.ts", {
    "next-sanity": { groq: (strings) => strings.join("") },
    "./client": { safeSanityFetch: async (...args) => { calls.push(args); return args[2]; } },
  });
  await pricing.getPricingPageDocument();
  await pricing.getFeeCategories();
  assert.equal(calls.length, 2);
  for (const args of calls) {
    assert.deepEqual(args[3], { cache: "no-store", perspective: "published" });
  }
});

test("the shared fetch wrapper forwards cache options and fetches changed values again", async () => {
  const calls = [];
  const responses = [{ price: "Quote" }, { price: "45" }];
  const client = loadFixtureModule("../src/sanity/lib/client.ts", {
    "next-sanity": { createClient: () => ({ fetch: async (...args) => { calls.push(args); return responses.shift(); } }) },
    "../env": { sanityProjectId: "test", sanityDataset: "test", sanityApiVersion: "2025-01-01" },
  });
  const options = { cache: "no-store", perspective: "published" };
  assert.deepEqual(await client.safeSanityFetch("query", undefined, [], options), { price: "Quote" });
  assert.deepEqual(await client.safeSanityFetch("query", undefined, [], options), { price: "45" });
  assert.deepEqual(calls, [["query", {}, options], ["query", {}, options]]);
});

test("the pricing route cannot be prerendered with stale build-time fees", () => {
  const source = readFileSync(new URL("../src/app/fees/page.tsx", import.meta.url), "utf8");
  assert.match(source, /export const dynamic = "force-dynamic"/);
});
