import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

import { getFeePrice } from "../src/lib/feePrice.ts";

test("missing, blank and legacy quote values use the quote link", () => {
  for (const value of [undefined, null, "", "   ", "Quote", " QUOTE ", "Call for quote", "call  for a quote", "POA", "TBC", "-"]) {
    assert.equal(getFeePrice(value), null);
  }
});

test("published display prices replace the quote link without changing the amount", () => {
  for (const value of ["\u00a365", "\u00a365.50", "From \u00a3120", "\u00a365 - \u00a395", "Free", "\u00a30", "0", "GBP 65", "From \u00a365 (final quote after assessment)"]) {
    assert.equal(getFeePrice(`  ${value}  `), value);
  }
});

test("editing and clearing a price switches between the two display states", () => {
  assert.equal(getFeePrice("Quote"), null);
  assert.equal(getFeePrice("\u00a365"), "\u00a365");
  assert.equal(getFeePrice(""), null);
});

// Render the real page with fixture CMS data; tests never read or mutate live prices.
async function renderFees(items) {
  const source = readFileSync(new URL("../src/app/fees/page.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const dependencies = {
    "react/jsx-runtime": jsxRuntime,
    "next/link": ({ children, ...props }) => createElement("a", props, children),
    "@/components/shared/Reveal": { Reveal: ({ children }) => children },
    "@/components/shared/SectionCta": { SectionCta: () => null },
    "@/lib/feePrice": { getFeePrice },
    "@/lib/servicesSeed": { masterServiceGroups: [] },
    "@/sanity/lib/pricing": {
      getFeeCategories: async () => [{ _id: "dental", title: "Dental care", items }],
      getPricingPageDocument: async () => null,
    },
    "@/sanity/lib/siteSettings": {
      getSiteSettingsDocument: async () => null,
      resolveSiteSettings: () => ({ ctas: { book: "/book" } }),
    },
  };
  const pageModule = { exports: {} };
  const requireFixture = (name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected page dependency: ${name}`);
    return dependencies[name];
  };
  new Function("require", "module", "exports", compiled)(requireFixture, pageModule, pageModule.exports);
  return renderToStaticMarkup(await pageModule.exports.default());
}

test("mixed CMS prices render a non-linked amount and a link only for the unpriced item", async () => {
  const html = await renderFees([
    { label: "Cat dental treatment", price: "From \u00a3120", note: "Includes assessment" },
    { label: "Dog dental treatment", price: "Quote" },
  ]);
  assert.equal((html.match(/<div class="pricing-quote-item pricing-fee-priced"/g) || []).length, 1);
  assert.equal((html.match(/<a\b[^>]*class="pricing-quote-item"/g) || []).length, 1);
  assert.match(html, /<strong>From \u00a3120<\/strong>/);
  assert.match(html, /Includes assessment/);
  assert.match(html, /aria-label="Request a quote for Dog dental treatment"/);
  assert.doesNotMatch(html, /aria-label="Request a quote for Cat dental treatment"/);
  assert.match(html, /<strong>Published<\/strong>/);
});

test("a fully priced category has no quote rows or category quote CTA", async () => {
  const html = await renderFees([{ label: "Consultation", price: "\u00a365" }]);
  assert.doesNotMatch(html, /<a\b[^>]*class="pricing-quote-item"/);
  assert.doesNotMatch(html, /Ask about services without a listed price/);
});

test("clearing a CMS price restores its accessible quote link", async () => {
  const html = await renderFees([{ label: "Consultation", price: "   " }]);
  assert.match(html, /aria-label="Request a quote for Consultation"/);
  assert.match(html, /<strong>Quote<\/strong>/);
  assert.match(html, /<strong>On request<\/strong>/);
  assert.doesNotMatch(html, /pricing-fee-priced/);
});
