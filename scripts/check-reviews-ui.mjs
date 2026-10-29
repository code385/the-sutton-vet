// Local visual fixtures only. No review documents are created or published.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as react from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { homepageReviews } from "../src/lib/reviews.ts";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3002";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const css = readFileSync(new URL("../src/components/reviews/Reviews.module.css", import.meta.url), "utf8");
const styles = new Proxy({}, { get: (_, key) => `reviewFixture_${String(key)}` });
function load(file, extra = {}) {
  const compiled = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const dependencies = { "react/jsx-runtime": jsxRuntime, "./Reviews.module.css": { default: styles }, "next/link": { default: ({ children, ...props }) => react.createElement("a", props, children) }, "@/lib/reviews": { homepageReviews }, ...extra };
  const result = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => { assert.ok(Object.hasOwn(dependencies, name)); return dependencies[name]; }, result, result.exports);
  return result.exports;
}
const cards = load("../src/components/reviews/ReviewCards.tsx");
const { HomeReviews } = load("../src/components/reviews/HomeReviews.tsx", { "./ReviewCards": cards });
const reviews = [
  { _id: "fixture-1", reviewerName: "Sample reviewer A", text: "Visual test content only. Clear explanations and a calm welcome made our visit feel reassuring.", rating: 5, source: "Test fixture", active: true },
  { _id: "fixture-2", reviewerName: "Sample reviewer B", text: "Visual test content only.\nA thoughtful team and helpful advice for looking after our pet at home.", active: true },
  { _id: "fixture-3", reviewerName: "Sample reviewer C", text: "Visual test content only. " + "Long feedback with more detail. ".repeat(24), rating: 4, active: true },
];
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const response = await page.goto(`${base}/reviews`, { waitUntil: "networkidle", timeout: 90000 });
  assert.equal(response.status(), 200);
  const reject = page.getByRole("button", { name: "Reject optional", exact: true });
  if (await reject.isVisible()) await reject.click();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: css.replace(/\.([A-Za-z][\w-]*)/g, ".reviewFixture_$1") });
  await page.locator("main > .shell").evaluate((element, markup) => { element.innerHTML = markup; }, renderToStaticMarkup(react.createElement(HomeReviews, { reviews })));
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    assert.equal(await page.locator("main").evaluate((el) => el.scrollWidth > el.clientWidth + 1), false, `Review overflow at ${width}px`);
    assert.equal(await page.locator("main figure").count(), 3);
    assert.equal(await page.getByRole("link", { name: "Read all reviews" }).getAttribute("href"), "/reviews");
    await page.locator(".reviewFixture_section").screenshot({ path: join(tmpdir(), `sutton-reviews-${width}.png`), style: ".sv-header, [class*=chat-widget] { visibility: hidden !important; }" });
  }
  await page.locator("main > .shell").evaluate((element, markup) => { element.innerHTML = markup; }, `<section class="reviewFixture_section">${renderToStaticMarkup(react.createElement(cards.ReviewCards, { reviews }))}</section>`);
  assert.equal(await page.locator("main blockquote").last().evaluate((el) => el.scrollHeight <= el.clientHeight + 1), true, "Full reviews are not truncated");
  console.log("PASS: review cards at 320, 375, 768 and 1440px; homepage limit, all-reviews link and full-length text.");
} finally { await browser.close(); }
