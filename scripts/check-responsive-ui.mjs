// Run against a local dev server with Playwright installed separately:
// PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/check-responsive-ui.mjs
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
  : "playwright");
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "msedge",
  headless: true,
});

try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(`${process.env.TEST_BASE_URL || "http://localhost:3000"}/fees`, {
    waitUntil: "domcontentloaded", timeout: 90000,
  });
  await page.locator(".sv-header-container").waitFor();
  await page.getByRole("button", { name: "Reject optional", exact: true }).click();
  await page.locator(".cookie-drawer.is-open").waitFor({ state: "hidden" });
  await page.evaluate(() => document.fonts.ready);
  const widths = [320, 375, 480, 768, 1024, 1080, 1120, 1152, 1200, 1280,
    1320, 1366, 1440, 1480, 1536, 1600, 1920, 2560];
  let checked = 0;

  // Browser zoom changes the CSS viewport; larger root text is checked too.
  for (const fontSize of [16, 20, 24]) {
    await page.evaluate((size) => { document.documentElement.style.fontSize = `${size}px`; }, fontSize);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const result = await page.evaluate(() => {
        const visible = (element) => element.getBoundingClientRect().width > 0
          && element.getBoundingClientRect().height > 0;
        const elements = [...document.querySelectorAll(
          ".sv-header-brand-clean, .sv-nav-clean > .sv-nav-group, .sv-header-actions-clean > a, .sv-menu-toggle"
        )].filter(visible);
        const rects = elements.map((element) => ({
          label: element.getAttribute("aria-label") || element.textContent.trim(),
          ...element.getBoundingClientRect().toJSON(),
        }));
        const problems = [];
        for (const [index, rect] of rects.entries()) {
          if (rect.left < -1 || rect.right > innerWidth + 1) problems.push(`Overflow: ${rect.label}`);
          for (const other of rects.slice(index + 1)) {
            if (Math.min(rect.right, other.right) - Math.max(rect.left, other.left) > 1
              && Math.min(rect.bottom, other.bottom) - Math.max(rect.top, other.top) > 1) {
              problems.push(`Overlap: ${rect.label} / ${other.label}`);
            }
          }
        }
        return { problems, compact: visible(document.querySelector(".sv-menu-toggle")) };
      });
      assert.deepEqual(result.problems, [], `${width}px / ${fontSize}px text`);
      if (fontSize === 16 && width >= 1200) assert.equal(result.compact, false, "Desktop navigation should remain visible");
      if (result.compact) {
        await page.locator(".sv-menu-toggle").click();
        assert.equal(await page.locator(".sv-menu-toggle").getAttribute("aria-expanded"), "true");
        assert.ok(await page.locator('#sv-mobile-menu a[href="/careers"]').isVisible());
        assert.equal(await page.locator("#sv-mobile-menu .sv-mobile-actions-simple a").count(), 2);
        const overflow = await page.locator("#sv-mobile-menu").evaluate((menu) =>
          menu.scrollWidth > menu.clientWidth + 1);
        assert.equal(overflow, false, `Mobile menu overflow at ${width}px / ${fontSize}px text`);
        await page.locator(".sv-menu-toggle").click();
      }
      checked++;
    }
    console.log(`PASS: header widths 320-2560px with ${fontSize}px root text`);
  }

  await page.evaluate(() => { document.documentElement.style.fontSize = "16px"; });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.sv-nav-group[data-nav-group="Services"] > button').hover();
  await page.locator('.sv-nav-group[data-nav-group="Services"] .sv-nav-dropdown').waitFor({ state: "visible" });
  const dropdownBounds = await page.locator('.sv-nav-group[data-nav-group="Services"] .sv-nav-dropdown').boundingBox();
  assert.ok(dropdownBounds.x >= 0 && dropdownBounds.x + dropdownBounds.width <= 1441, "Services dropdown stays inside the viewport");
  await page.mouse.move(0, 500);
  await page.locator('.sv-nav-group[data-nav-group="Services"].is-open').waitFor({ state: "hidden" });
  if (process.env.UI_SCREENSHOT) {
    await page.screenshot({ path: process.env.UI_SCREENSHOT.replace(/\.png$/, "-header.png") });
  }
  const links = page.locator(".pricing-v3-mini-link");
  const linkCount = await links.count();
  assert.ok(linkCount > 0, "Pricing fixture must contain at least one quote prompt");
  for (const link of await links.all()) {
    for (const state of ["normal", "hover", "focus"]) {
      if (state === "hover") await link.hover();
      if (state === "focus") await link.focus();
      const style = await link.evaluate((element) => {
        const css = getComputedStyle(element);
        return { background: css.backgroundColor, weight: Number(css.fontWeight), color: css.color };
      });
      assert.equal(style.background, "rgba(0, 0, 0, 0)", `Quote ${state} background`);
      assert.ok(style.weight >= 700, `Quote ${state} weight`);
      assert.notEqual(style.color, "rgb(255, 255, 255)");
    }
  }
  console.log(`PASS: ${checked} header layouts, compact-menu toggles, and ${linkCount} quote links (normal/hover/focus).`);
  if (process.env.UI_SCREENSHOT) {
    await links.last().evaluate((element) => element.closest(".pricing-v3-panel").scrollIntoView({ block: "center" }));
    await page.waitForFunction(() => {
      const prompts = document.querySelectorAll(".pricing-v3-mini-link");
      const reveal = prompts[prompts.length - 1].closest(".reveal");
      return !reveal || getComputedStyle(reveal).opacity === "1";
    });
    await page.screenshot({ path: process.env.UI_SCREENSHOT });
  }

  await page.goto(`${process.env.TEST_BASE_URL || "http://localhost:3000"}/health-plan`, { waitUntil: "domcontentloaded" });
  const planButtons = page.locator(".hp-v2-hero .button-primary, .hp-v2-puppy-note .button-primary, .hp-v2-final .button-primary");
  assert.equal(await planButtons.count(), 3);
  const destination = await planButtons.first().getAttribute("href");
  assert.notEqual(destination, "/health-plan");
  for (const button of await planButtons.all()) assert.equal(await button.getAttribute("href"), destination);
  if (destination === "/contact#health-plan-enquiry") {
    await planButtons.first().click();
    await page.waitForURL("**/contact#health-plan-enquiry");
    const enquiry = page.locator("#health-plan-enquiry");
    await enquiry.getByRole("link", { name: "Email About a Health Plan" }).waitFor();
    await page.waitForFunction(() => {
      const top = document.querySelector("#health-plan-enquiry").getBoundingClientRect().top;
      const headerBottom = document.querySelector(".sv-header").getBoundingClientRect().bottom;
      return top >= headerBottom - 2 && top < innerHeight / 2;
    });
    assert.match(await enquiry.getByRole("link", { name: "Email About a Health Plan" }).getAttribute("href"), /^mailto:.+\?subject=Health%20Plan%20Enquiry$/);
    assert.ok(await enquiry.getByRole("link", { name: /^Call / }).isVisible());
    if (process.env.UI_SCREENSHOT) await page.screenshot({ path: process.env.UI_SCREENSHOT.replace(/\.png$/, "-enquiry.png") });
  }
  await page.goto(`${process.env.TEST_BASE_URL || "http://localhost:3000"}/`, { waitUntil: "domcontentloaded" });
  const location = await page.locator(".sv-home-location-copy").innerText();
  assert.doesNotMatch(location, /Exact location and directions should be clear early|Hyper-local reassurance|Google Business Profile alignment required/);
  console.log("PASS: health-plan button destinations, enquiry actions, and published home location copy.");
} finally {
  await browser.close();
}
