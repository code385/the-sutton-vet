import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

import { externalLinkProps } from "../src/lib/linkTarget.ts";

test("web destinations open separately with opener protection", () => {
  for (const href of ["https://maps.google.com/", "https://instagram.com/clinic", "http://example.com", "//example.com", " HTTPS://example.com "]) {
    assert.deepEqual(externalLinkProps(href), { target: "_blank", rel: "noopener noreferrer", title: "Opens in a new tab" });
  }
});

test("phone, email, and internal navigation keep their normal behavior", () => {
  for (const href of ["tel:02036030298", "mailto:info@example.com", "/register", "#find-us", ""]) {
    assert.deepEqual(externalLinkProps(href), {});
  }
});

test("CMS contact links render with the correct browser targets", async () => {
  const source = readFileSync(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const dependencies = {
    "react/jsx-runtime": jsxRuntime,
    "@/components/shared/Reveal": { Reveal: ({ children }) => children },
    "@/components/shared/ConsentManagedMap": { ConsentManagedMap: () => null },
    "@/lib/linkTarget": { externalLinkProps },
    "@/sanity/lib/contentPages": {
      getContactPageDocument: async () => ({ quickLinks: [
        { title: "Visit us", value: "Clinic address", href: "https://maps.google.com/" },
        { title: "Connect with us", value: "Instagram", href: "https://instagram.com/clinic" },
        { title: "Call us", value: "0203 603 0298", href: "tel:02036030298" },
        { title: "Email us", value: "info@example.com", href: "mailto:info@example.com" },
        { title: "Registration", value: "Register", href: "/register" },
      ] }),
    },
    "@/sanity/lib/siteSettings": {
      getSiteSettingsDocument: async () => null,
      resolveSiteSettings: () => ({
        openingHours: [], socialLinks: [], practiceName: "Test clinic", address: "Clinic address",
        hasMapUrl: "https://maps.google.com/", googleBusinessProfileUrl: "https://google.com/clinic",
        ctas: { call: "tel:02036030298" }, phone: "0203 603 0298",
      }),
    },
  };
  const pageModule = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected page dependency: ${name}`);
    return dependencies[name];
  }, pageModule, pageModule.exports);
  const html = renderToStaticMarkup(await pageModule.exports.default());
  const anchors = html.match(/<a\b[^>]*>/g) || [];
  assert.ok(anchors.length >= 7);
  for (const anchor of anchors) {
    if (/href="https?:/.test(anchor)) {
      assert.match(anchor, /target="_blank"/);
      assert.match(anchor, /rel="noopener noreferrer"/);
    } else {
      assert.doesNotMatch(anchor, /target=/);
    }
  }
});
