import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const base = process.env.TEST_BASE_URL || "http://localhost:3002";
  // Verify consent gating without sending a test visitor to Google.
  await page.route(/https:\/\/(www\.)?google\.com\/maps\/embed/, route => route.fulfill({ contentType: "text/html", body: "<p>Map test fixture</p>" }));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Reject optional", exact: true }).click();
  for (const route of ["/", "/contact", "/about"]) {
    await page.goto(base + route, { waitUntil: "domcontentloaded" });
    // The local Next.js dev badge shares the cookie-button corner; it is absent in production.
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    const card = page.locator(".consent-map-placeholder").first();
    await card.waitFor();
    assert.equal(await page.locator('iframe[src*="google.com/maps"]').count(), 0);
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await card.scrollIntoViewIfNeeded();
      const css = await card.evaluate(el => ({
        background: getComputedStyle(el).backgroundColor,
        image: getComputedStyle(el).backgroundImage,
        heading: getComputedStyle(el.querySelector("h3")).color,
        body: getComputedStyle(el.querySelector(".consent-embed-copy p:not(.eyebrow)")).color,
        clipped: [...el.querySelectorAll("h3, p, a, button")].some(item => item.scrollWidth > item.clientWidth + 1),
      }));
      assert.deepEqual(css, { background: "rgb(248, 248, 248)", image: "none", heading: "rgb(75, 23, 97)", body: "rgb(12, 12, 12)", clipped: false });
      if (route === "/" && width === 375) await card.screenshot({ path: join(tmpdir(), "sutton-map-consent-mobile.png") });
    }
    const directions = card.getByRole("link", { name: "Open in Google Maps" });
    assert.equal(await directions.getAttribute("target"), "_blank");
    await card.getByRole("button", { name: "Manage cookies" }).click();
    await page.getByRole("button", { name: "Accept all", exact: true }).click();
    await card.waitFor({ state: "detached" });
    assert.ok(await page.locator('iframe[src*="google.com/maps"]').count());
    await page.locator(".cookie-fab").click();
    await page.getByRole("button", { name: "Reject optional", exact: true }).click();
    await card.waitFor();
    assert.equal(await page.locator('iframe[src*="google.com/maps"]').count(), 0);
    console.log(`PASS ${route}: readable placeholder at 4 widths, directions link, consent and revocation`);
  }
} finally { await browser.close(); }
