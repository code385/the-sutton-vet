import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(process.env.TEST_BASE_URL || "http://localhost:3002", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Reject optional", exact: true }).click();
  const floating = page.getByRole("link", { name: "Message The Sutton Vet on WhatsApp (opens in a new tab)", exact: true });
  const whatsappHref = await floating.getAttribute("href");
  assert.match(whatsappHref, /^https:\/\/wa\.me\/\d+\?text=/);
  assert.equal(new URL(whatsappHref).pathname, "/447440278373", "Use the practice WhatsApp number confirmed by the client");
  assert.equal(await floating.getAttribute("target"), "_blank");
  assert.equal(await floating.getAttribute("rel"), "noopener noreferrer");
  for (const [width, height] of [[320, 568], [375, 812], [768, 1024], [1024, 768], [1440, 900], [812, 375]]) {
    await page.setViewportSize({ width, height });
    await page.locator(".chat-launcher").click();
    const panel = page.locator(".chat-panel");
    const whatsapp = panel.getByRole("link", { name: "WhatsApp", exact: true });
    const call = panel.getByRole("link", { name: /^Call / });
    assert.equal(await whatsapp.getAttribute("href"), whatsappHref);
    assert.match(await call.getAttribute("href"), /^tel:/);
    // Scrollable short-screen panels must keep every action reachable.
    for (const action of [whatsapp, call, panel.getByRole("button", { name: "Close chat", exact: true })]) {
      await action.scrollIntoViewIfNeeded();
      const rect = await action.boundingBox();
      assert.ok(rect && rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= width + 1 && rect.y + rect.height <= height + 1, `Contact action bounds at ${width}x${height}`);
    }
    const launcherBounds = await floating.boundingBox();
    const cookieBounds = await page.locator(".cookie-fab").boundingBox();
    assert.ok(launcherBounds.x >= cookieBounds.x + cookieBounds.width, "Floating contacts must not overlap cookie settings");
    await page.locator("#chat-query").fill("WhatsApp contact number");
    await panel.getByRole("button", { name: "Send", exact: true }).click();
    assert.match(await panel.locator(".chat-message-bot").last().innerText(), /Contact/);
    if (width === 375 || width === 1440) await page.screenshot({ path: join(tmpdir(), `sutton-whatsapp-${width}.png`) });
    await panel.getByRole("button", { name: "Close chat", exact: true }).click();
    assert.ok(await floating.isVisible());
    console.log(`PASS chat contacts and floating WhatsApp ${width}x${height}`);
  }
} finally { await browser.close(); }
