import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as react from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { resolveFooterLinks } from "../src/lib/footerLinks.ts";

test("footer keeps custom policies and lists Terms of Business only once", () => {
  assert.deepEqual(resolveFooterLinks([
    { label: "Terms", href: "/terms" },
    { label: "Terms of Business", href: "/terms/" },
    { label: "Complaints", href: "/legal/complaints" },
    { label: "Complaints", href: "/legal/complaints" },
  ]), [
    { label: "Terms of Business", href: "/terms" },
    { label: "Complaints", href: "/legal/complaints" },
  ]);
});

function loadPage(getLegalPageBySlug) {
  const source = readFileSync(new URL("../src/app/legal/[slug]/page.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const dependencies = {
    react,
    "react/jsx-runtime": jsxRuntime,
    "next/navigation": { notFound: () => { throw new Error("NOT_FOUND"); } },
    "@/components/shared/PageIntro": { PageIntro: ({ title }) => react.createElement("h1", null, title) },
    "@/sanity/lib/contentPages": { getLegalPageBySlug },
  };
  const result = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency: ${name}`);
    return dependencies[name];
  }, result, result.exports);
  return result.exports;
}

test("a published custom policy renders its content with safe text escaping", async () => {
  const page = loadPage(async (slug) => {
    assert.equal(slug, "complaints");
    return { title: "Complaints policy", description: "How to contact us", sections: [
      { title: "Contact", body: ["Speak with our team.", "<script>unsafe</script>"] },
    ] };
  });
  const props = { params: Promise.resolve({ slug: "complaints" }) };
  const html = renderToStaticMarkup(await page.default(props));
  assert.match(html, /Complaints policy/);
  assert.match(html, /Speak with our team/);
  assert.doesNotMatch(html, /<script>/);
  assert.equal((await page.generateMetadata(props)).title, "Complaints policy | The Sutton Vet");
});

test("unknown or unpublished policies return a 404 instead of default content", async () => {
  const page = loadPage(async () => null);
  await assert.rejects(page.default({ params: Promise.resolve({ slug: "missing" }) }), /NOT_FOUND/);
});
