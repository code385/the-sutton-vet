import assert from "node:assert/strict";
import test from "node:test";
import { ConcreteRuleClass } from "sanity";
import { siteSettings } from "../src/sanity/schemaTypes/siteSettings.ts";

for (const name of ["lupaBookingUrl", "lupaRegistrationUrl", "healthPlanUrl"]) {
  const field = siteSettings.fields.find(field => field.name === name);
  assert.equal(typeof field.validation, "function", `${name} must explicitly allow internal paths`);
  const rule = field.validation(ConcreteRuleClass.string());
  const context = { i18n: { t: key => key } };

  test(`${name} accepts existing internal paths, full web URLs and optional empty values`, async () => {
    for (const value of [undefined, "", "/book", "/register", "/pms-integration?flow=book", "/pms-integration?flow=register", "/health-plan", "https://example.com/signup", "http://localhost:3000/register"]) {
      assert.deepEqual(await rule.validate(value, context), [], `${name}: ${String(value)}`);
    }
  });

  test(`${name} continues to reject unsafe schemes and malformed URLs`, async () => {
    for (const value of ["javascript:alert(1)", "data:text/html,test", "file:///etc/passwd", "ftp://example.com", "https://", "not a valid url", "example.com", "//example.com/redirect", "/\\example.com", "/register now"]) {
      assert((await rule.validate(value, context)).length > 0, `${name} unexpectedly accepted ${value}`);
    }
  });
}
