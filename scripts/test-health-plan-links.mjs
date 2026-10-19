import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { healthPlanEnquiryHref, resolveHealthPlanSignup } from "../src/lib/healthPlanSignup.ts";
import { defaultLocationPoints, homeLocationTitle, resolveHomeLocationCopy } from "../src/lib/homeLocation.ts";
import { externalLinkProps } from "../src/lib/linkTarget.ts";

test("unconfigured, unsafe, and self-referencing plan links use the enquiry route", () => {
  for (const value of [undefined, "", " ", "/health-plan", "/health-plan/", "/health-plan?join=1#plans",
    "#join", "not a URL", "javascript:alert(1)", "https://user:pass@example.com/join", "/pms-integration?flow=health-plan",
    "https://thesuttonvet.co.uk/health-plan", "https://www.thesuttonvet.co.uk/health-plan/",
    "https://the-sutton-vet.vercel.app/health-plan", "https://preview.example.com/health-plan", "/contact"]) {
    assert.deepEqual(resolveHealthPlanSignup(value, "https://preview.example.com"), {
      href: healthPlanEnquiryHref, canJoin: false,
    }, String(value));
  }
});

test("approved external and separate internal signup destinations are preserved", () => {
  for (const href of ["https://provider.example/join?clinic=sutton", "https://provider.example/health-plan", "/plan-enrolment"]) {
    assert.deepEqual(resolveHealthPlanSignup(` ${href} `), { href, canJoin: true });
  }
});

test("known location placeholders are replaced without overwriting custom CMS text", () => {
  assert.deepEqual(resolveHomeLocationCopy("Exact location and directions should be clear early.", [
    "Hyper-local reassurance near Sutton and Hackbridge",
    "Google map and local travel guidance built into the contact journey",
    "Google Business Profile alignment required before go-live",
  ]), { locationTitle: homeLocationTitle, locationPoints: defaultLocationPoints });
  assert.deepEqual(resolveHomeLocationCopy("Our clinic", ["Please use the side entrance."]), {
    locationTitle: "Our clinic", locationPoints: ["Please use the side entrance."],
  });
  assert.deepEqual(resolveHomeLocationCopy("", []), { locationTitle: homeLocationTitle, locationPoints: defaultLocationPoints });
});

async function renderHealthPlan(href) {
  const source = readFileSync(new URL("../src/app/health-plan/page.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const dependencies = {
    "react/jsx-runtime": jsxRuntime,
    "next/link": ({ children, ...props }) => jsxRuntime.jsx("a", { ...props, children }),
    "@/components/shared/Reveal": { Reveal: ({ children }) => children },
    "@/lib/healthPlanSeed": { healthPlanPageSeed: { faqItems: [] } },
    "@/lib/healthPlanSignup": { resolveHealthPlanSignup },
    "@/lib/linkTarget": { externalLinkProps },
    "@/lib/visualAssets": { visualAssets: {} },
    "@/sanity/lib/healthPlan": { getHealthPlanPageDocument: async () => null },
    "@/sanity/lib/siteSettings": {
      getSiteSettingsDocument: async () => null,
      resolveSiteSettings: () => ({ ctas: { healthPlan: href } }),
    },
  };
  const pageModule = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency: ${name}`);
    return dependencies[name];
  }, pageModule, pageModule.exports);
  return renderToStaticMarkup(await pageModule.exports.default());
}

test("all three unconfigured plan buttons open the enquiry section, not a booking or page loop", async () => {
  const html = await renderHealthPlan("/health-plan");
  assert.equal((html.match(/href="\/contact#health-plan-enquiry"/g) || []).length, 3);
  assert.doesNotMatch(html, /href="\/(health-plan|book)"/);
  assert.match(html, /Online enrolment is not yet available/);
});

test("all three configured signup links open the approved provider separately", async () => {
  const html = await renderHealthPlan("https://provider.example/enrol");
  const links = html.match(/<a[^>]+href="https:\/\/provider.example\/enrol"[^>]*>/g) || [];
  assert.equal(links.length, 3);
  for (const link of links) {
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
  }
  assert.doesNotMatch(html, /Online enrolment is not yet available/);
});

test("page chrome does not reset native anchor navigation to the top", () => {
  const compiled = ts.transpileModule(readFileSync(new URL("../src/components/layout/SiteChrome.tsx", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const effects = [];
  const dependencies = {
    "react/jsx-runtime": jsxRuntime,
    "next/navigation": { usePathname: () => "/contact" },
    react: { useEffect: (effect) => effects.push(effect) },
    "@/components/layout/ChatWidget": { ChatWidget: () => null },
    "@/components/layout/CookieConsent": { CookieConsent: () => null },
    "@/components/layout/SiteFooter": { SiteFooter: () => null },
    "@/components/layout/SiteHeader": { SiteHeader: () => null },
  };
  const componentModule = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => dependencies[name], componentModule, componentModule.exports);
  componentModule.exports.SiteChrome({ children: null, siteSettings: {}, emergencyKeywords: [] });
  const originalWindow = globalThis.window;
  const scrollCalls = [];
  try {
    globalThis.window = {
      location: { hash: "#health-plan-enquiry" },
      requestAnimationFrame: (callback) => { callback(); return 1; },
      cancelAnimationFrame: () => {},
      scrollTo: (options) => scrollCalls.push(options),
    };
    effects[0]();
    assert.equal(scrollCalls.length, 0);
    window.location.hash = "";
    effects[0]();
    assert.deepEqual(scrollCalls, [{ top: 0, left: 0, behavior: "auto" }]);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
