import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as react from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { homepageReviews, visibleReviews } from "../src/lib/reviews.ts";

function load(relative, dependencies = {}) {
  const source = readFileSync(new URL(relative, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const styles = new Proxy({}, { get: (_, key) => String(key) });
  const defaults = {
    react,
    "react/jsx-runtime": jsxRuntime,
    "next/link": { default: ({ children, ...props }) => react.createElement("a", props, children) },
    "./Reviews.module.css": { default: styles },
    "@/components/reviews/Reviews.module.css": { default: styles },
    "@/lib/reviews": { homepageReviews, visibleReviews },
  };
  const result = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => {
    const dep = { ...defaults, ...dependencies };
    assert.ok(Object.hasOwn(dep, name), `Unexpected dependency: ${name}`);
    return dep[name];
  }, result, result.exports);
  return result.exports;
}

const cards = load("../src/components/reviews/ReviewCards.tsx");
const carousel = load("../src/components/reviews/ReviewCarousel.tsx", { "./ReviewCards": cards });
const { HomeReviews } = load("../src/components/reviews/HomeReviews.tsx", { "./ReviewCarousel": carousel });
const review = (id, extra = {}) => ({ _id: id, reviewerName: "Test reviewer", text: "Test feedback", active: true, ...extra });
const html = (Component, props) => renderToStaticMarkup(react.createElement(Component, props));

test("hidden, draft and incomplete reviews never appear", () => {
  assert.deepEqual(visibleReviews([review("ok"), review("hidden", { active: false }), review("unset", { active: undefined }), review("drafts.test"), review("blank", { text: "  " }), review("no-name", { reviewerName: "" })]).map((r) => r._id), ["ok"]);
});

test("homepage prioritises featured reviews and fills at most three places", () => {
  const reviews = [review("1"), review("2"), review("3", { featured: true }), review("4", { featured: true })];
  assert.deepEqual(homepageReviews(reviews).map((r) => r._id), ["3", "4", "1"]);
  assert.equal(homepageReviews([review("1")]).length, 1);
});

test("empty homepage emits no heading, whitespace wrapper or reviews link", () => {
  assert.equal(html(HomeReviews, { reviews: [] }), "");
  assert.equal(html(HomeReviews, { reviews: [review("hidden", { active: false })] }), "");
});

test("homepage links to all reviews and displays real text without inventing ratings", () => {
  const output = html(HomeReviews, { reviews: [review("1", { text: "<script>unsafe</script>\nKind team." })] });
  assert.match(output, /href="\/reviews"/);
  assert.match(output, /&lt;script&gt;/);
  assert.doesNotMatch(output, /<script>|out of 5 stars/);
});

test("cards show supplied rating, attribution and optional date, with safe text", () => {
  const output = html(cards.ReviewCards, { reviews: [review("1", { rating: 4, source: "Client feedback", reviewDate: "2026-10-01" })] });
  assert.match(output, /4 out of 5 stars/);
  assert.match(output, /Client feedback/);
  assert.match(output, /October 2026/);
  assert.doesNotMatch(html(cards.ReviewCards, { reviews: [review("2", { rating: 8, reviewDate: "invalid" })] }), /out of 5 stars|<time/);
});

test("homepage carousel exposes only its first slide and omits controls for one review", () => {
  const output = html(HomeReviews, { reviews: [review("1"), review("2")] });
  assert.match(output, /aria-roledescription="carousel"/);
  assert.equal((output.match(/aria-hidden="false"/g) || []).length, 1);
  assert.match(output, /Next review/);
  assert.doesNotMatch(html(HomeReviews, { reviews: [review("1")] }), /Next review|Previous review|Pause review/);
});

function page(reviews) {
  return load("../src/app/reviews/page.tsx", {
    "@/sanity/lib/reviews": { getClientReviews: async () => reviews },
    "@/components/reviews/ReviewCards": cards,
  });
}

test("reviews page shows all entries rather than the homepage limit", async () => {
  const module = page(Array.from({ length: 7 }, (_, i) => review(String(i))));
  assert.equal((renderToStaticMarkup(await module.default()).match(/<figure/g) || []).length, 7);
  assert.equal((await module.generateMetadata()).robots, undefined);
});

test("empty reviews page is useful, unindexed and contains no fake testimonials", async () => {
  const module = page([]);
  assert.match(renderToStaticMarkup(await module.default()), /There are no reviews to share just yet/);
  assert.deepEqual((await module.generateMetadata()).robots, { index: false, follow: true });
});

test("fetch reads published content without caching, filters invalid entries and has empty fallback", async () => {
  let connected = false;
  const module = load("../src/sanity/lib/reviews.ts", {
    react: { cache: (fn) => fn },
    "next/server": { connection: async () => { connected = true; } },
    "next-sanity": { groq: (parts) => parts.join("") },
    "./client": { safeSanityFetch: async (query, params, fallback, options) => {
      assert.ok(connected);
      assert.match(query, /active == true/);
      assert.match(query, /drafts/);
      assert.match(query, /displayOrder/);
      assert.deepEqual(fallback, []);
      assert.deepEqual(options, { cache: "no-store", perspective: "published" });
      return [review("ok"), review("invalid", { text: "" })];
    } },
  });
  assert.deepEqual((await module.getClientReviews()).map((r) => r._id), ["ok"]);
});
