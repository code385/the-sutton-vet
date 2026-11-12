import assert from "node:assert/strict";
import test from "node:test";
import { resolveCompanyLines, resolveLaunchSettings, resolveTikTokSettings } from "../src/lib/launch.ts";

test("missing or invalid launch configuration defaults to coming soon", () => {
  assert.equal(resolveLaunchSettings().mode, "comingSoon");
  assert.equal(resolveLaunchSettings({mode: "full"}).mode, "full");
  assert.equal(resolveLaunchSettings({mode: "unknown"}).mode, "comingSoon");
  assert.equal(resolveLaunchSettings().openingLabel, "Coming Soon in February 2027");
});

test("editable launch copy trims whitespace and preserves uploaded photo", () => {
  const result = resolveLaunchSettings({title: " Our clinic ", openingLabel: " ", imageUrl: "https://cdn.sanity.io/photo.jpg"});
  assert.equal(result.title, "Our clinic");
  assert.equal(result.imageUrl, "https://cdn.sanity.io/photo.jpg");
  assert.equal(result.openingLabel, "Coming Soon in February 2027");
});

test("company disclosures contain only supplied details, with no invented numbers", () => {
  assert.deepEqual(resolveCompanyLines(), []);
  assert.deepEqual(resolveCompanyLines({registeredName: " Vet ER LTD "}), ["The Sutton Vet is a trading name of Vet ER LTD."]);
  assert.deepEqual(resolveCompanyLines({companyNumber: " 12345678 ", registeredOffice: " Office ", jurisdiction: " England and Wales ", vatNumber: " GB123 "}), ["Company number: 12345678", "Registered office: Office", "Registered in England and Wales", "VAT registration number: GB123"]);
  assert.deepEqual(resolveCompanyLines({vatNumber: " ", companyNumber: ""}), []);
});

test("TikTok handle cannot inject markup or an arbitrary embed host", () => {
  for (const username of ['"><script>alert(1)</script>', "https://evil.example", "a/b", "ab&x=1"]) {
    assert.equal(resolveTikTokSettings({username}).username, "the.sutton.vet");
  }
  assert.equal(resolveTikTokSettings({username: " @the.sutton.vet "}).profileUrl, "https://www.tiktok.com/@the.sutton.vet");
  assert.equal(resolveTikTokSettings({enabled: false}).enabled, false);
});
