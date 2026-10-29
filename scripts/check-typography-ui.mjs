import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3002";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  for (const route of ["/", "/book", "/health-plan", "/fees", "/services", "/about", "/careers", "/contact", "/reviews"]) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 90000 });
    if (await page.locator(".cookie-drawer.is-open").count()) {
      await page.getByRole("button", { name: "Reject optional", exact: true }).click();
      await page.locator(".cookie-drawer.is-open").waitFor({ state: "hidden" });
    }
    const fonts = await page.locator("main h1, main h2, main h3, main p, main button, main input, .sv-header a, .sv-footer a").evaluateAll((elements) => [...new Set(elements.map((el) => getComputedStyle(el).fontFamily.split(",")[0].replaceAll('"', "").trim()))]);
    assert.deepEqual(fonts, ["Segoe UI"], `Consistent existing body family on ${route}`);
    assert.equal(await page.locator('footer a[href="/reviews"]').count(), 1);
    assert.equal(await page.locator('.sv-nav-group[data-nav-group="About"] a[href="/reviews"]').count(), 1);
    if (route === "/") {
      for (const width of [375, 1066, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.locator(".sv-home-expert-heading").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector(".sv-home-expert-heading").closest(".reveal").classList.contains("is-visible"));
        const mask = await page.locator(".sv-home-expert-reveal").evaluate((el) => ({ clip: getComputedStyle(el).clipPath, transform: getComputedStyle(el).transform }));
        assert.deepEqual(mask, { clip: "none", transform: "none" }, "Services heading must not sit inside a permanent animation mask");
        await page.locator(".sv-home-expert-heading").screenshot({ path: join(tmpdir(), `sutton-heading-fixed-${width}.png`), style: ".sv-header { visibility: hidden !important; }" });
      }
    }
    if (route === "/book") {
      for (const width of [320, 375, 768, 1066, 1280, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const size of [16, 20, 24]) {
          await page.evaluate((size) => { document.documentElement.style.fontSize = `${size}px`; }, size);
          const problems = await page.locator("main h1, main h2, main form p, main form input, main form button").evaluateAll((elements) => elements.flatMap((el) => {
            const r = el.getBoundingClientRect();
            return r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1 ? [el.tagName + ": " + el.textContent.slice(0, 30)] : [];
          }));
          assert.deepEqual(problems, [], `Booking text bounds at ${width}px / ${size}px root font`);
        }
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = "16px"; });
    }
    console.log(`PASS: ${route} uniform fonts and discoverable reviews navigation`);
  }
} finally { await browser.close(); }
