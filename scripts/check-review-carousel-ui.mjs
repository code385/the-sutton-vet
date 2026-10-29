import assert from "node:assert/strict";
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Isolated browser fixture: no invented reviews are written to the CMS or website.
const bundle = await build({
  stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client';
    import {ReviewCarousel} from './src/components/reviews/ReviewCarousel';
    import styles from './src/components/reviews/Reviews.module.css';
    const root=createRoot(document.getElementById('root')); let version=0;
    window.mountReviews=(count)=>root.render(<section className={styles.section}><ReviewCarousel key={++version} reviews={Array.from({length:count},(_,i)=>({_id:String(i),reviewerName:'Test reviewer '+i,text:('Fixture review '+i+'. ').repeat(i+1),active:true}))}/></section>);
    window.mountReviews(3);`, loader: "jsx", resolveDir: process.cwd() },
  bundle: true, write: false, outdir: "carousel-test", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' },
});
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 900, height: 900 }, reducedMotion: "no-preference" });
  await page.setContent('<div style="height:80px"></div><main id="root" style="padding:16px;font-family:Segoe UI"></main><button id="outside">Outside carousel</button>');
  await page.addStyleTag({ content: bundle.outputFiles.find(file => file.path.endsWith(".css")).text });
  await page.addScriptTag({ content: bundle.outputFiles.find(file => file.path.endsWith(".js")).text });
  const active = () => page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute("aria-label");
  await page.locator('[aria-live="off"]').waitFor();
  assert.equal(await active(), "1 of 3");
  await page.waitForTimeout(1800);
  assert.equal(await active(), "1 of 3", "Do not rotate before the 3-second interval");
  await page.waitForFunction(() => document.querySelector('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label') === '2 of 3', { timeout: 5000 });
  await page.getByRole("region", { name: "Client reviews" }).hover();
  const hovered = await active();
  await page.waitForTimeout(3200);
  assert.equal(await active(), hovered, "Hover pauses autoplay");
  await page.mouse.move(0, 0);
  await page.getByRole("button", { name: "Next review" }).focus();
  await page.waitForTimeout(3200);
  assert.equal(await active(), hovered, "Keyboard focus pauses autoplay");
  await page.getByRole("button", { name: "Next review" }).click();
  assert.equal(await active(), "3 of 3");
  await page.getByRole("button", { name: "Next review" }).click();
  assert.equal(await active(), "1 of 3", "Next wraps around");
  await page.getByRole("button", { name: "Previous review" }).click();
  assert.equal(await active(), "3 of 3", "Previous wraps around");
  await page.locator("#outside").click();
  await page.waitForTimeout(3200);
  assert.equal(await active(), "3 of 3", "Manual navigation remains paused");
  await page.getByRole("button", { name: "Play review slideshow" }).click();
  await page.locator("#outside").click();
  await page.waitForFunction(() => document.querySelector('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label') === '1 of 3', { timeout: 5000 });
  await page.getByRole("button", { name: "Pause review slideshow" }).click();
  await page.locator("#outside").click();
  await page.waitForTimeout(3200);
  assert.equal(await active(), "1 of 3", "Explicit pause persists");
  console.log("PASS 3-second rotation, hover/focus pause, manual wrap and pause/play");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.mountReviews(3));
  await page.waitForTimeout(3200);
  assert.equal(await active(), "1 of 3");
  assert.equal(await page.getByRole("button", { name: /review slideshow/ }).count(), 0);
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole("button", { name: "Next review" }).click();
    const overflow = await page.getByRole("region", { name: "Client reviews" }).evaluate(el => el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().right > innerWidth);
    assert.equal(overflow, false, `Carousel bounds at ${width}px`);
    if (width === 375 || width === 1440) await page.screenshot({ path: join(tmpdir(), `sutton-carousel-${width}.png`) });
  }
  await page.evaluate(() => window.mountReviews(1));
  await page.getByText("Test reviewer 0", { exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Next review" }).count(), 0);
  await page.evaluate(() => window.mountReviews(0));
  await page.getByRole("region", { name: "Client reviews" }).waitFor({ state: "detached" });
  console.log("PASS reduced motion, four viewport widths, single review and empty state");
} finally { await browser.close(); }
