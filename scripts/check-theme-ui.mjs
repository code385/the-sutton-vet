import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3002";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
function luminance(rgb) {
  const values = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
function contrast(a, b) { const values = [luminance(a), luminance(b)].sort((a, b) => b - a); return (values[0] + .05) / (values[1] + .05); }

try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const route of ["/", "/fees", "/services", "/about", "/health-plan", "/contact", "/book", "/reviews"]) {
    const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    assert.equal(response.status(), 200, route);
    await page.locator(".sv-header").waitFor();
    await page.evaluate(() => document.fonts.ready);
    const reject = page.getByRole("button", { name: "Reject optional", exact: true });
    if (await page.locator(".cookie-drawer.is-open").count()) {
      await reject.click();
      await page.locator(".cookie-drawer.is-open").waitFor({ state: "hidden" });
    }
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForFunction(() => {
        const title = document.querySelector("main h1");
        const reveal = title?.closest(".reveal");
        return title && (!reveal || getComputedStyle(reveal).opacity === "1");
      });
      const palette = await page.evaluate(() => {
        const style = (selector) => { const s = getComputedStyle(document.querySelector(selector)); return { color: s.color, background: s.backgroundColor }; };
        const footer = style(".sv-footer");
        const footerLink = style(".sv-footer-legal-links-v2 a");
        const primary = style(".sv-header-actions-clean .button-primary");
        return { footer, footerLink, primary, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      });
      assert.equal(palette.overflow, false, `${route} at ${width}px`);
      assert.equal(palette.footer.background, "rgb(75, 23, 97)");
      assert.equal(palette.primary.background, "rgb(175, 130, 47)");
      assert.ok(contrast(palette.primary.color, palette.primary.background) >= 4.5, "Primary button contrast");
      assert.ok(contrast(palette.footerLink.color, palette.footer.background) >= 4.5, "Footer link contrast");
      if (["/", "/fees", "/reviews"].includes(route)) {
        await page.screenshot({ path: join(tmpdir(), `sutton-theme-${route === "/" ? "home" : route.slice(1)}-${width}.png`) });
        if (route === "/fees" && width === 1440) await page.locator(".sv-footer").screenshot({ path: join(tmpdir(), "sutton-theme-footer.png"), style: ".sv-header { visibility: hidden !important; }" });
      }
    }
    console.log(`PASS: ${route}, reference colours, contrast and mobile/desktop overflow`);
  }
} finally { await browser.close(); }
