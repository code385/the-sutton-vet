import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";

const bundle = await build({
  stdin: { contents: "import React from 'react'; import {createRoot} from 'react-dom/client'; import {RegistrationForm} from './src/components/pms/RegistrationForm'; const root=createRoot(document.getElementById('root')); let version=0; window.mount=()=>root.render(<RegistrationForm key={++version} clinicPhone='0203 603 0298'/>); window.mount();", loader: "jsx", resolveDir: process.cwd() },
  bundle: true, write: false, outdir: "registration-test", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' },
});
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, hasTouch: true });
  const errors = [], requests = [];
  let reply = { status: 400, json: { ok: false, retryable: true, error: "Please check pet details (fixture)." } };
  page.on("pageerror", error => errors.push(error.message));
  await page.route("https://registration.test/**", route => {
    if (route.request().method() === "POST") { requests.push(route.request().postDataJSON()); return route.fulfill(reply); }
    return route.fulfill({ contentType: "text/html", body: '<main class="page-shell" id="root"></main>' });
  });
  await page.goto("https://registration.test/");
  for (const stylesheet of ["theme.css", "globals.css", "reference-theme.css"]) await page.addStyleTag({ content: readFileSync("src/app/" + stylesheet, "utf8") });
  await page.addStyleTag({ content: bundle.outputFiles.find(file => file.path.endsWith(".css")).text });
  await page.addScriptTag({ content: bundle.outputFiles.find(file => file.path.endsWith(".js")).text });
  const field = name => page.locator('[name="' + name + '"]');
  const pet = (id, key) => field("pet-" + id + "-" + key);
  async function fillOwner() {
    for (const [key, value] of Object.entries({ firstName: "Test", lastName: "Owner", email: "owner@example.com", phone: "+447700900123", addressLine1: "1 Test Street", city: "Sutton", postcode: "SM1 1AA" })) await field(key).fill(value);
  }
  async function fillPet(id, value) {
    await pet(id, "petName").fill(value);
    await pet(id, "species").selectOption("Dog");
    await pet(id, "ageMode").selectOption("date");
    await pet(id, "dateOfBirth").fill("2020-01-01");
    await pet(id, "temperament").fill("Friendly but nervous");
    await pet(id, "reason").fill("Initial health check");
  }
  await page.getByRole("heading", { name: "A caring start." }).waitFor();
  await page.getByRole("button", { name: "Register you and your pet", exact: true }).click();
  assert.equal(requests.length, 0, "Required fields block empty submit");
  await fillOwner(); await fillPet(1, "Test pet one");
  await pet(1, "breed").fill("gold");
  await page.getByRole("option", { name: "Golden Retriever", exact: true }).waitFor();
  await pet(1, "breed").press("ArrowDown"); await pet(1, "breed").press("Enter");
  assert.equal(await pet(1, "breed").inputValue(), "Golden Retriever");
  await pet(1, "species").selectOption("Cat");
  assert.equal(await pet(1, "breed").inputValue(), "");
  await pet(1, "breed").fill("bri");
  await page.getByRole("option", { name: "British Shorthair", exact: true }).tap();
  assert.equal(await pet(1, "breed").inputValue(), "British Shorthair");
  await pet(1, "breed").fill("Custom breed");
  await pet(1, "sex").selectOption("Female");
  await pet(1, "neuterStatus").selectOption("yes");
  await pet(1, "neuteredDate").fill("2021-01-01");
  await page.getByRole("button", { name: "+ Add another pet", exact: true }).click();
  await fillPet(2, "Test pet two");
  await pet(2, "ageMode").selectOption("age");
  await pet(2, "ageYears").fill("0"); await pet(2, "ageMonths").fill("8");
  await page.getByRole("button", { name: "+ Add another pet", exact: true }).click();
  await pet(3, "petName").fill("Remove this pet");
  await page.getByRole("button", { name: "Remove pet 2", exact: true }).click();
  assert.equal(await pet(3, "petName").inputValue(), "Remove this pet", "Removing middle pet preserves stable field identities");
  await page.getByRole("button", { name: "Remove pet 2", exact: true }).click();
  await page.getByRole("button", { name: "+ Add another pet", exact: true }).click();
  await fillPet(4, "Test pet two");
  await pet(4, "ageMode").selectOption("age");
  await pet(4, "ageYears").fill("2"); await pet(4, "ageMonths").fill("3");
  await page.locator('[data-pet-card="1"] summary').click();
  for (const [key, value] of Object.entries({ weight: "12.5", previousPractice: "Previous vet", clinicalNotes: "Owner provided history", microchip: "123456789012345", lastVaccinationDate: "2026-01-01", lastDewormingDate: "2026-02-01", lastFleaTickDate: "2026-03-01" })) await pet(1, key).fill(value);
  assert.equal(await page.locator('input[type="file"]').count(), 0, "Do not offer uploads which cannot reach Lupa");
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const input of await page.locator("input:visible, select:visible, textarea:visible, button:visible").all()) {
      const b = await input.boundingBox(); assert(b.x >= 0 && b.x + b.width <= width + 1, "Field overflow at " + width);
    }
    if ([375, 1440].includes(width)) await page.screenshot({ path: join(tmpdir(), "sutton-registration-" + width + ".png"), fullPage: true });
  }
  await page.getByRole("button", { name: "Register you and 2 pets", exact: true }).click();
  await page.getByRole("alert").waitFor();
  assert.equal(requests.length, 1);
  assert.equal(await pet(1, "petName").inputValue(), "Test pet one", "Validation failure retains form");
  reply = { status: 200, json: { ok: true, message: "You and your 2 pets have been registered. This does not book an appointment." } };
  await page.getByRole("button", { name: "Register you and 2 pets", exact: true }).click();
  await page.getByRole("heading", { name: "Welcome to the practice" }).waitFor();
  assert.equal(await page.getByRole("button", { name: /Register you and/ }).count(), 0, "Success prevents duplicate resubmission");
  assert.equal(requests[1].pets.length, 2);
  assert.equal(requests[1].pets[0].breed, "Custom breed");
  assert.equal(requests[1].pets[0].clinicalNotes, "Owner provided history");
  assert.equal(requests[1].pets[0].neuteredDate, "2021-01-01");
  assert.equal(requests[1].pets[1].ageMode, "age");
  assert.equal(requests[1].pets[1].ageYears, "2");
  assert.equal(requests[1].pets[1].breed, "", "Optional breed can be omitted");
  assert.equal(requests[1].pets[1].sex, "", "Optional sex can be omitted");
  await page.evaluate(() => window.mount());
  await fillOwner(); await fillPet(1, "Uncertain pet");
  reply = { status: 502, json: { ok: false, retryable: false, error: "Call practice before retrying." } };
  await page.getByRole("button", { name: "Register you and your pet", exact: true }).click();
  await page.getByRole("alert").waitFor();
  assert.equal(await page.getByRole("button", { name: "Register you and your pet", exact: true }).isDisabled(), true);
  assert.deepEqual(errors, []);
  console.log("PASS multi-pet add/remove identity, required/optional fields, keyboard/touch breed search, five widths, complete JSON payload, retry retention, success/uncertain locks");
} finally { await browser.close(); }
