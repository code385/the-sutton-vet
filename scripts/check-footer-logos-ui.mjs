import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Exercise the real footer and CSS without calling Sanity or the live website.
const bundle = await build({
  stdin: {
    contents: `
      import React from 'react';
      import {createRoot} from 'react-dom/client';
      import {SiteFooter} from './src/components/layout/SiteFooter';
      const siteSettings = {
        practiceName: 'The Sutton Vet', tagline: 'Passionate about Animals and Our Local Community',
        footerTagline: 'Passionate about Animals and Our Local Community',
        phone: '0203 603 0298', email: 'info@thesuttonvet.co.uk', address: 'Sutton, London',
        ctas: {call: 'tel:02036030298', register: '/register'},
        socialLinks: [{label: 'Instagram', href: 'https://example.com/instagram'}],
        legalLinks: [{label: 'Privacy', href: '/privacy'}, {label: 'Terms', href: '/terms'}],
      };
      createRoot(document.getElementById('root')).render(<SiteFooter siteSettings={siteSettings}/>);
    `,
    loader: "jsx",
    resolveDir: process.cwd(),
  },
  plugins: [{
    name: "next-fixtures",
    setup(plugin) {
      plugin.onResolve({ filter: /^next\/(image|link)$/ }, args => ({ path: args.path, namespace: "next-fixtures" }));
      plugin.onLoad({ filter: /.*/, namespace: "next-fixtures" }, args => ({
        loader: "jsx",
        resolveDir: process.cwd(),
        contents: args.path === "next/image"
          ? "import React from 'react'; export default function Image(props) {return <img {...props}/>;}"
          : "import React from 'react'; export default function Link(props) {return <a {...props}/>;}",
      }));
    },
  }],
  bundle: true, write: false, outdir: "footer-test", jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
});

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  const unavailable = new Set();
  page.on("pageerror", error => errors.push(error.message));
  await page.route("https://footer.test/**", route => {
    const path = new URL(route.request().url()).pathname;
    if (unavailable.has(path)) return route.fulfill({ status: 404, body: "Not found" });
    if (path === "/Sutton_vet_logo_aw.png") {
      return route.fulfill({ contentType: "image/png", body: readFileSync("public/Sutton_vet_logo_aw.png") });
    }
    if (path.startsWith("/images/footer/")) {
      return route.fulfill({
        contentType: "image/png",
        body: readFileSync("public" + path),
      });
    }
    return route.fulfill({ contentType: "text/html", body: '<div id="root"></div>' });
  });

  async function mount() {
    await page.goto("https://footer.test/");
    for (const file of ["theme.css", "globals.css", "reference-theme.css"]) {
      await page.addStyleTag({ content: readFileSync("src/app/" + file, "utf8") });
    }
    await page.addStyleTag({ content: bundle.outputFiles.find(file => file.path.endsWith(".css")).text });
    await page.addScriptTag({ content: bundle.outputFiles.find(file => file.path.endsWith(".js")).text });
    await page.getByRole("contentinfo").waitFor();
  }

  await mount();
  const strip = page.getByRole("list", { name: "Professional organisation logos" });
  await page.getByAltText("AO VET", { exact: true }).waitFor();
  await strip.locator("img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
  assert.equal(await page.locator(".sv-footer-intro").textContent(), "Passionate about Animals and Our Local Community");
  for (const width of [320, 375, 640, 768, 1024, 1180, 1181, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await strip.scrollIntoViewIfNeeded();
    const items = await strip.locator("li").all();
    assert.equal(items.length, 3);
    const boxes = await Promise.all(items.map(item => item.boundingBox()));
    assert(boxes.every(box => box.x >= 0 && box.x + box.width <= width + 1), `Logo overflow at ${width}px`);
    assert.equal(await strip.evaluate(element => getComputedStyle(element).backgroundColor), "rgba(0, 0, 0, 0)", "No shared white strip");
    for (const item of items) assert.equal(await item.evaluate(element => getComputedStyle(element).backgroundColor), "rgb(255, 255, 255)", "Each logo has its own readable background");
    if (width > 640) assert(boxes.every(box => Math.abs(box.y - boxes[0].y) < 1), "Desktop logos share a row");
    else assert(boxes[1].y >= boxes[0].y + boxes[0].height, "Mobile logos stack");
    if (width > 1180) {
      for (const [index, heading] of ["Company", "Get Care", "Resources"].entries()) {
        const column = await page.getByRole("heading", { name: heading, exact: true }).locator("..").boundingBox();
        assert(Math.abs(boxes[index].x - column.x) < 1, `${heading} logo aligns with its column at ${width}px`);
        assert(boxes[index].y >= column.y + column.height, "Logos sit below the navigation links");
      }
    }
    const legal = await page.locator(".sv-footer-bottom-v2").boundingBox();
    assert(boxes.every(box => box.y + box.height <= legal.y + 1), "Logos remain above legal links");
    for (const logo of await strip.locator("img").all()) {
      assert.equal(await logo.evaluate(image => getComputedStyle(image).objectFit), "contain");
      assert(await logo.getAttribute("alt"), "Every mark has an accessible name");
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Footer overflow at ${width}px`);
    if ([375, 1440].includes(width)) await page.screenshot({ path: join(tmpdir(), `sutton-footer-logos-${width}.png`), fullPage: true });
  }

  unavailable.add("/images/footer/veccs.png");
  await mount();
  await page.waitForFunction(() => document.querySelectorAll('ul[aria-label="Professional organisation logos"] li').length === 2);
  assert.equal(await page.getByAltText("AO VET", { exact: true }).count(), 1, "Missing file does not hide other logos");
  const ao = await strip.locator('[data-organisation="AO VET"]').boundingBox();
  const resources = await page.getByRole("heading", { name: "Resources", exact: true }).locator("..").boundingBox();
  assert(Math.abs(ao.x - resources.x) < 1, "Missing middle logo does not move AO VET out of its desktop column");
  unavailable.add("/images/footer/rcvs.png");
  unavailable.add("/images/footer/ao-vet.png");
  await mount();
  await page.waitForFunction(() => !document.querySelector('ul[aria-label="Professional organisation logos"]'));
  assert.equal(await page.getByRole("link", { name: "Privacy", exact: true }).count(), 1, "Legal links remain when artwork is missing");
  assert.deepEqual(errors, []);
  console.log("PASS footer at nine widths, separate column-aligned badges, motto, image containment, partial/all missing artwork, preserved legal links");
} finally {
  await browser.close();
}
