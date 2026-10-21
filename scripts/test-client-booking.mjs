import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { test, beforeEach, afterEach } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");
const root = resolve(import.meta.dirname, "..");
const clientId = "11111111-1111-4111-8111-111111111111";
const petId = "22222222-2222-4222-8222-222222222222";
const typeId = "33333333-3333-4333-8333-333333333333";
const employeeId = "44444444-4444-4444-8444-444444444444";
const otherId = "55555555-5555-4555-8555-555555555555";
const env = {
  NODE_ENV: "production", LUPA_CLIENT_BOOKING_ENABLED: "true", NEXT_PUBLIC_SITE_URL: "https://clinic.example",
  RESEND_API_KEY: "test-key", RESEND_FROM_EMAIL: "Test Clinic <book@test.example>", RESEND_REPLY_TO: "reply@test.example",
  BOOKING_AUTH_SECRET: "test-only-secret-not-used-in-any-deployment-1234567890",
  UPSTASH_REDIS_REST_URL: "https://redis.example", UPSTASH_REDIS_REST_TOKEN: "test-token",
  LUPA_API_KEY: "test-lupa-key", LUPA_COMPANY_ID: "test-company", LUPA_STORE_ID: "test-store",
  LUPA_API_BASE_URL: "https://lupa.example/api/external",
};
let savedEnv, originalFetch, originalNow, fixture;

function makeFixture() {
  const modules = new Map();
  function load(path) {
    const filename = resolve(root, path);
    if (modules.has(filename)) return modules.get(filename).exports;
    const module = { exports: {} };
    modules.set(filename, module);
    const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText;
    new Function("require", "module", "exports", compiled)((name) => {
      if (name.startsWith("@/")) return load(`src/${name.slice(2)}.ts`);
      if (name.startsWith(".")) return load(resolve(dirname(filename), `${name}.ts`));
      return require(name);
    }, module, module.exports);
    return module.exports;
  }
  const store = new Map();
  const f = { store, emails: [], calls: [], writes: [], now: originalNow(), failEmail: false, failRedis: false, failWrite: false, partialOnly: false, duplicateClients: false, petsHasMore: false };
  const get = (key) => {
    const item = store.get(key);
    if (!item || item.expires <= f.now) { store.delete(key); return null; }
    return item.value;
  };
  const put = (key, value, seconds) => store.set(key, { value, expires: f.now + seconds * 1000 });
  const scripts = load("src/lib/bookingStore.ts");
  // A deterministic REST/TTL model; deployment acceptance still tests actual Redis Lua execution.
  function redis(command) {
    const [operation, ...args] = command;
    if (operation === "GET") return get(args[0]);
    if (operation === "DEL") return Number(store.delete(args[0]));
    if (operation === "SET") {
      if (args.includes("NX") && get(args[0]) !== null) return null;
      put(args[0], args[1], Number(args[args.indexOf("EX") + 1]));
      return "OK";
    }
    assert.equal(operation, "EVAL");
    if (args[0] === scripts.rateScript) {
      const key = args[2];
      const value = Number(get(key) || 0) + 1;
      if (value === 1) put(key, String(value), Number(args[3]));
      else store.get(key).value = String(value);
      return value;
    }
    assert.equal(args[0], scripts.verifyScript);
    const [, , challengeKey, sessionKey, digest, ttl] = args;
    const raw = get(challengeKey);
    if (!raw) return 0;
    const challenge = JSON.parse(raw);
    if (challenge.digest !== digest) {
      challenge.attempts++;
      if (challenge.attempts >= 5) store.delete(challengeKey);
      else store.get(challengeKey).value = JSON.stringify(challenge);
      return 0;
    }
    put(sessionKey, challenge.email, Number(ttl)); store.delete(challengeKey); return 1;
  }
  f.fetch = async (input, init = {}) => {
    const url = new URL(input);
    const body = init.body ? JSON.parse(init.body) : null;
    f.calls.push({ url, body, init });
    if (url.hostname === "redis.example") {
      if (f.failRedis) throw new Error("Simulated storage outage");
      assert.equal(init.headers.Authorization, "Bearer test-token");
      return Response.json({ result: redis(body) });
    }
    if (url.hostname === "api.resend.com") {
      f.emails.push(body);
      return f.failEmail ? Response.json({ message: "Simulated rejection" }, { status: 503 }) : Response.json({ id: "mock-email-id" });
    }
    assert.equal(url.hostname, "lupa.example", "No real network requests are allowed in this test");
    assert.equal(init.headers.Authorization, "Bearer test-lupa-key");
    if (url.pathname.endsWith("/clients/search")) {
      assert.deepEqual(body.filter, { email: { eq: "owner@example.com" } });
      const clients = [{ id: otherId, email: "other-owner@example.com" }];
      if (!f.partialOnly) clients.push({ id: clientId, email: "Owner@Example.com" });
      if (f.duplicateClients) clients.push({ id: otherId, email: "owner@example.com" });
      return Response.json({ data: clients, hasMore: false });
    }
    if (url.pathname.endsWith("/pets")) {
      assert.equal(url.searchParams.get("clientId"), clientId);
      assert.equal(url.searchParams.get("companyId"), "test-company");
      assert.equal(url.searchParams.get("storeIds"), "test-store");
      return Response.json({ data: [
        { id: petId, clientId, name: "Test Pet", species: "Dog", secretMedicalField: "must not leak" },
        { id: otherId, clientId: otherId, name: "Other owner's pet" },
        { id: employeeId, clientId, name: "Archived pet", isArchived: true },
      ], hasMore: f.petsHasMore, nextCursor: f.petsHasMore ? "repeated-cursor" : undefined });
    }
    if (url.pathname.endsWith("/appointment-types")) return Response.json({ data: [
      { id: typeId, name: "Consultation", duration: 30, isPublic: true, isArchived: false, onlineBookingOrder: 2 },
      { id: otherId, name: "Hidden", duration: 30, isPublic: false, isArchived: false },
      { id: employeeId, name: "Archived", duration: 30, isPublic: true, isArchived: true },
    ] });
    if (url.pathname.endsWith("/get-available-slots")) {
      assert.equal(url.searchParams.get("visitTypeId"), typeId);
      assert.equal(url.searchParams.get("duration"), "30");
      assert.equal(url.searchParams.get("storeId"), "test-store");
      const start = new Date(f.now + 86400000).toISOString();
      const end = new Date(f.now + 88200000).toISOString();
      return Response.json({ data: { slots: [{ start, end, employeeId }, { start, end, employeeId }] } });
    }
    assert.ok(url.pathname.endsWith("/appointments"));
    f.writes.push(body);
    if (f.failWrite) throw new Error("Simulated ambiguous upstream timeout");
    return Response.json(otherId);
  };
  f.auth = load("src/lib/bookingAuth.ts");
  f.booking = load("src/lib/clientBooking.ts");
  f.route = load("src/app/api/client-booking/route.ts");
  f.request = (body, cookies = {}, origin = "https://clinic.example") => new NextRequest("https://clinic.example/api/client-booking", {
    method: "POST", headers: { origin, "Content-Type": "application/json", Cookie: Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join("; ") }, body: typeof body === "string" ? body : JSON.stringify(body),
  });
  f.verify = async () => {
    const challenge = await f.auth.requestBookingCode(" Owner@Example.com ", "test-ip");
    const code = f.emails.at(-1).text.match(/\b\d{6}\b/)[0];
    const token = await f.auth.verifyBookingCode(challenge, code, "test-ip");
    return f.auth.getBookingSession(token);
  };
  return f;
}

beforeEach(() => {
  savedEnv = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  Object.assign(process.env, env); originalFetch = globalThis.fetch; originalNow = Date.now;
  fixture = makeFixture(); globalThis.fetch = fixture.fetch; Date.now = () => fixture.now;
});
afterEach(() => {
  globalThis.fetch = originalFetch; Date.now = originalNow;
  for (const [key, value] of Object.entries(savedEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
});

test("disabled or placeholder configuration fails closed without network calls", async () => {
  process.env.LUPA_CLIENT_BOOKING_ENABLED = "false";
  await assert.rejects(fixture.auth.requestBookingCode("owner@example.com", "ip"), { status: 503 });
  process.env.LUPA_CLIENT_BOOKING_ENABLED = "true";
  process.env.RESEND_FROM_EMAIL = "Clinic <booking@YOUR_VERIFIED_DOMAIN>";
  await assert.rejects(fixture.auth.requestBookingCode("owner@example.com", "ip"), { status: 503 });
  assert.equal(fixture.calls.length, 0);
});

test("OTP is hashed, private, single-use; session expires and can be revoked", async () => {
  const challenge = await fixture.auth.requestBookingCode("owner@example.com", "ip");
  const code = fixture.emails[0].text.match(/\b\d{6}\b/)[0];
  assert.ok(!JSON.stringify([...fixture.store.values()]).includes(code));
  assert.equal(fixture.calls.filter((call) => call.url.hostname === "lupa.example").length, 0);
  const token = await fixture.auth.verifyBookingCode(challenge, code, "ip");
  assert.equal((await fixture.auth.getBookingSession(token)).email, "owner@example.com");
  await assert.rejects(fixture.auth.verifyBookingCode(challenge, code, "ip"), { status: 400 });
  fixture.now += 1801000;
  await assert.rejects(fixture.auth.getBookingSession(token), { status: 401 });
});

test("five failed attempts burn a code and ten-minute expiry is enforced", async () => {
  const challenge = await fixture.auth.requestBookingCode("owner@example.com", "ip");
  const code = fixture.emails[0].text.match(/\b\d{6}\b/)[0];
  for (let i = 0; i < 5; i++) await assert.rejects(fixture.auth.verifyBookingCode(challenge, "000000", "ip"), { status: 400 });
  await assert.rejects(fixture.auth.verifyBookingCode(challenge, code, "ip"), { status: 400 });
  fixture.now += 61000;
  const next = await fixture.auth.requestBookingCode("owner@example.com", "ip");
  fixture.now += 600001;
  await assert.rejects(fixture.auth.verifyBookingCode(next, fixture.emails.at(-1).text.match(/\b\d{6}\b/)[0], "ip"), { status: 400 });
});

test("resend cooldown, hourly limit, provider outage and storage outage fail safely", async () => {
  await fixture.auth.requestBookingCode("owner@example.com", "ip");
  await assert.rejects(fixture.auth.requestBookingCode("owner@example.com", "ip"), { status: 429 });
  for (let i = 0; i < 3; i++) { fixture.now += 61000; await fixture.auth.requestBookingCode("owner@example.com", "ip"); }
  fixture.now += 61000;
  await assert.rejects(fixture.auth.requestBookingCode("owner@example.com", "ip"), { status: 429 });
  fixture.failEmail = true;
  await assert.rejects(fixture.auth.requestBookingCode("new@example.com", "ip"), { status: 503 });
  assert.ok(![...fixture.store.values()].some((entry) => entry.value.includes?.('"email":"new@example.com"')));
  fixture.failRedis = true;
  await assert.rejects(fixture.auth.requestBookingCode("another@example.com", "ip"));
});

test("matching is exact, pets are minimized and checked for ownership, ambiguous clients fail", async () => {
  const session = await fixture.verify();
  assert.deepEqual(await fixture.booking.getVerifiedPets(session), { state: "ready", pets: [{ id: petId, name: "Test Pet", species: "Dog" }] });
  fixture.partialOnly = true;
  assert.deepEqual(await fixture.booking.getVerifiedPets(session), { state: "not_registered", pets: [] });
  fixture.partialOnly = false; fixture.duplicateClients = true;
  await assert.rejects(fixture.booking.getVerifiedPets(session), { status: 409 });
  fixture.duplicateClients = false; fixture.petsHasMore = true;
  await assert.rejects(fixture.booking.getVerifiedPets(session), { status: 503 });
});

test("only public active types are cached and slots are signed against the verified session", async () => {
  const session = await fixture.verify();
  const types = await fixture.booking.getPublicVisitTypes();
  assert.deepEqual(types.map((type) => type.id), [typeId]);
  await fixture.booking.getPublicVisitTypes();
  assert.equal(fixture.calls.filter((call) => call.url.pathname.endsWith("/appointment-types")).length, 1);
  const slots = await fixture.booking.getVerifiedSlots(session, typeId, new Date(fixture.now).toISOString().slice(0, 7));
  assert.equal(slots.length, 1);
  const token = slots[0].choice;
  assert.equal(fixture.auth.readBookingChoice(token, session.token).employeeId, employeeId);
  assert.throws(() => fixture.auth.readBookingChoice(`${token}x`, session.token), { status: 400 });
  assert.throws(() => fixture.auth.readBookingChoice(token, "other-session"), { status: 400 });
  fixture.now += 600001;
  assert.throws(() => fixture.auth.readBookingChoice(token, session.token), { status: 400 });
});

test("booking rejects foreign pets, deduplicates repeated writes, and never creates clients", async () => {
  const session = await fixture.verify();
  const [slot] = await fixture.booking.getVerifiedSlots(session, typeId, new Date(fixture.now).toISOString().slice(0, 7));
  const input = { petId, choice: slot.choice, notes: "Test only" };
  await assert.rejects(fixture.booking.bookForVerifiedClient(session, { ...input, petId: otherId }), { status: 403 });
  const result = await fixture.booking.bookForVerifiedClient(session, input);
  assert.match(result.message, /not yet a confirmed booking/);
  assert.deepEqual(await fixture.booking.bookForVerifiedClient(session, input), result);
  assert.equal(fixture.writes.length, 1);
  assert.equal(fixture.writes[0].petId, petId);
  assert.equal(fixture.writes[0].status, "requested");
  assert.deepEqual(fixture.writes[0].storeIds, ["test-store"]);
  assert.equal(fixture.calls.some((call) => call.url.pathname.endsWith("/clients/create")), false);
  const write = fixture.calls.find((call) => call.url.pathname.endsWith("/appointments"));
  assert.match(write.init.headers["Idempotency-Key"], /^website-[a-f0-9]{64}$/);
});

test("uncertain upstream writes stay locked against accidental resubmission", async () => {
  const session = await fixture.verify();
  const [slot] = await fixture.booking.getVerifiedSlots(session, typeId, new Date(fixture.now).toISOString().slice(0, 7));
  const input = { petId, choice: slot.choice, notes: "" };
  fixture.failWrite = true;
  await assert.rejects(fixture.booking.bookForVerifiedClient(session, input), { status: 409 });
  await assert.rejects(fixture.booking.bookForVerifiedClient(session, input), { status: 409 });
  assert.equal(fixture.writes.length, 1);
});

test("a failed receipt email does not fail or repeat a successful booking", async () => {
  const session = await fixture.verify();
  const [slot] = await fixture.booking.getVerifiedSlots(session, typeId, new Date(fixture.now).toISOString().slice(0, 7));
  const input = { petId, choice: slot.choice, notes: "" };
  fixture.failEmail = true;
  const result = await fixture.booking.bookForVerifiedClient(session, input);
  assert.equal(result.emailSent, false);
  assert.match(result.message, /not yet a confirmed booking/);
  assert.match(fixture.emails.at(-1).text, /not a confirmed appointment/);
  assert.deepEqual(await fixture.booking.bookForVerifiedClient(session, input), result);
  assert.equal(fixture.writes.length, 1);
});

test("route rejects cross-origin, malformed, oversized and unauthenticated requests", async () => {
  assert.equal((await fixture.route.POST(fixture.request({ action: "request-code", email: "owner@example.com" }, {}, "https://attacker.example"))).status, 403);
  assert.equal((await fixture.route.POST(fixture.request("not-json"))).status, 400);
  assert.equal((await fixture.route.POST(fixture.request({ action: "request-code", email: "x".repeat(9000) }))).status, 413);
  const response = await fixture.route.GET(new NextRequest("https://clinic.example/api/client-booking?action=pets"));
  assert.equal(response.status, 401);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.equal(fixture.calls.length, 0);
});

test("route issues secure cookies, never returns code/session secrets in JSON, and logout revokes", async () => {
  const sent = await fixture.route.POST(fixture.request({ action: "request-code", email: "owner@example.com" }));
  const challenge = sent.cookies.get(fixture.auth.challengeCookie).value;
  const code = fixture.emails[0].text.match(/\b\d{6}\b/)[0];
  const responseText = await sent.text();
  assert.ok(!responseText.includes(code) && !responseText.includes(challenge));
  assert.match(sent.headers.get("set-cookie"), /HttpOnly/);
  assert.match(sent.headers.get("set-cookie"), /Secure/);
  assert.match(sent.headers.get("set-cookie"), /SameSite=strict/i);
  const verified = await fixture.route.POST(fixture.request({ action: "verify-code", code }, { [fixture.auth.challengeCookie]: challenge }));
  assert.equal(verified.status, 200);
  const session = verified.cookies.get(fixture.auth.sessionCookie).value;
  assert.deepEqual(await verified.json(), { ok: true });
  const cookies = { [fixture.auth.sessionCookie]: session };
  assert.equal((await fixture.auth.getBookingSession(session)).email, "owner@example.com");
  assert.equal((await fixture.route.POST(fixture.request({ action: "logout" }, cookies))).status, 200);
  await assert.rejects(fixture.auth.getBookingSession(session), { status: 401 });
});
