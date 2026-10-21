// Run against a LOCAL server started with LUPA_CLIENT_BOOKING_ENABLED=true.
// All booking API responses are intercepted; no real emails or bookings are sent.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const base = process.env.TEST_BASE_URL || "http://localhost:3002";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Use a local test server only");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "msedge", headless: true });

try {
  for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    let verified = false;
    let missing = false;
    let sendFailure = false;
    let bookingFailure = false;
    const writes = [];
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/api/client-booking*", async (route) => {
      const request = route.request();
      const input = request.method() === "POST" ? request.postDataJSON() : {};
      const action = input.action || new URL(request.url()).searchParams.get("action");
      let status = 200;
      let body = { ok: true };
      if (action === "request-code") {
        if (sendFailure) { status = 503; body = { ok: false, error: "We could not send a code. Please try later." }; }
      } else if (action === "verify-code") {
        if (input.code !== "123456") { status = 400; body = { ok: false, error: "The code is invalid or expired." }; }
        else verified = true;
      } else if (action === "logout") verified = false;
      else if (!verified) { status = 401; body = { ok: false, error: "Please verify your email to continue." }; }
      else if (action === "pets") body = { ok: true, state: missing ? "not_registered" : "ready", pets: missing ? [] : [{ id: "pet-1", name: "Test pet", species: "Dog" }] };
      else if (action === "types") body = { ok: true, types: [{ id: "type-1", name: "Consultation", duration: 30 }] };
      else if (action === "slots") body = { ok: true, slots: [{ start: "2027-01-10T10:00:00Z", end: "2027-01-10T10:30:00Z", choice: "signed-test-choice" }] };
      else if (action === "book") {
        writes.push(input);
        if (bookingFailure) { status = 409; body = { ok: false, error: "We could not confirm whether this request reached the clinic." }; }
        else body = { ok: true, message: "Your appointment request has been sent." };
      } else throw new Error(`Unexpected test action: ${action}`);
      await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    });

    async function enabled(name) {
      const button = page.getByRole("button", { name, exact: true });
      await button.waitFor();
      await page.waitForFunction((label) => [...document.querySelectorAll("button")].some((item) => item.textContent === label && !item.disabled), name);
      return button;
    }
    async function login() {
      await page.getByLabel("Email address", { exact: true }).fill("test@example.com");
      await (await enabled("Send verification code")).click();
      await page.getByLabel("Verification code", { exact: true }).fill("123456");
      await (await enabled("Verify email")).click();
      await page.getByRole("heading", { name: "Your appointment request" }).waitFor();
    }
    async function selectSlot() {
      await page.getByLabel("Your pet", { exact: true }).selectOption("pet-1");
      await page.getByLabel("Appointment type", { exact: true }).selectOption("type-1");
      await (await enabled("Check available times")).click();
      await page.getByLabel("Available time (London time)", { exact: true }).selectOption("signed-test-choice");
    }
    async function noOverflow() {
      assert.equal(await page.locator("main").evaluate((element) => element.scrollWidth > element.clientWidth + 1), false, `${width}px page overflow`);
    }

    await page.goto(`${base}/book`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.getByRole("heading", { name: "Let's start with your email" }).waitFor();
    const reject = page.getByRole("button", { name: "Reject optional", exact: true });
    if (await reject.isVisible()) await reject.click();
    assert.equal(await page.locator("main iframe").count(), 0);
    await noOverflow();
    console.log(`${width}px: email form loaded`);
    await page.getByLabel("Email address", { exact: true }).fill("test@example.com");
    sendFailure = true;
    await (await enabled("Send verification code")).click();
    await page.getByRole("status").filter({ hasText: "could not send" }).waitFor();
    console.log(`${width}px: delivery failure handled`);
    sendFailure = false;
    await (await enabled("Send verification code")).click();
    await page.getByLabel("Verification code", { exact: true }).fill("000000");
    await (await enabled("Verify email")).click();
    await page.getByRole("status").filter({ hasText: "invalid or expired" }).waitFor();
    assert.equal(await page.getByLabel("Your pet", { exact: true }).count(), 0);
    assert.equal(await page.getByRole("button", { name: /^Resend in/ }).isDisabled(), true);
    await page.getByLabel("Verification code", { exact: true }).fill("123456");
    await (await enabled("Verify email")).click();
    await selectSlot();
    console.log(`${width}px: verified pet and slot selected`);
    await noOverflow();
    if (process.env.UI_SCREENSHOT) await page.screenshot({ path: `${process.env.UI_SCREENSHOT}-${width}.png`, fullPage: true });
    await (await enabled("Send appointment request")).click();
    await page.getByRole("heading", { name: "Request sent", exact: true }).waitFor();
    assert.deepEqual(writes, [{ action: "book", petId: "pet-1", choice: "signed-test-choice", notes: "" }]);
    await (await enabled("Sign out")).click();

    missing = true;
    await login();
    await page.getByRole("link", { name: "Register with the practice", exact: true }).waitFor();
    assert.equal(await page.getByLabel("Your pet", { exact: true }).count(), 0);
    await (await enabled("Sign out")).click();
    missing = false;
    await login();
    await selectSlot();
    bookingFailure = true;
    await (await enabled("Send appointment request")).click();
    await page.getByRole("status").filter({ hasText: "could not confirm" }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Send appointment request", exact: true }).isDisabled(), true);
    assert.equal(writes.length, 2);
    await (await enabled("Sign out")).click();

    await login();
    verified = false;
    await page.getByLabel("Your pet", { exact: true }).selectOption("pet-1");
    await page.getByLabel("Appointment type", { exact: true }).selectOption("type-1");
    await (await enabled("Check available times")).click();
    await page.getByRole("heading", { name: "Let's start with your email" }).waitFor();
    assert.equal(await page.getByLabel("Your pet", { exact: true }).count(), 0);
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: OTP, wrong code, provider failure, pet/time selection, booking, uncertain write, registration fallback, session expiry`);
    await context.close();
  }
} catch (error) {
  for (const context of browser.contexts()) {
    for (const page of context.pages()) {
      console.error((await page.locator("main").innerText()).slice(0, 4000));
      if (process.env.UI_SCREENSHOT) await page.screenshot({ path: `${process.env.UI_SCREENSHOT}-failure.png`, fullPage: true });
    }
  }
  throw error;
} finally { await browser.close(); }
