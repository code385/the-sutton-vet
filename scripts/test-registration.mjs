import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");
function load(path, overrides = {}) {
  const filename = resolve(path), module = { exports: {} };
  const source = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "module", "exports", source)(name => overrides[name] ?? (name.startsWith(".") ? load(resolve(dirname(filename), name + ".ts"), overrides) : require(name)), module, module.exports);
  return module.exports;
}
const { registrationPet, londonToday } = load("src/lib/registrationPet.ts");
const registration = load("src/lib/registration.ts");
const { registrationPayload, readRegistrationInput } = registration;
const now = new Date("2026-11-04T10:00:00Z");
const pet = { petName: "Test pet", species: "Dog", ageMode: "date", dateOfBirth: "2020-01-01", temperament: "Nervous at the vet", reason: "Initial health check" };
const owner = { firstName: "Test", lastName: "Owner", email: "owner@example.com", phone: "+447700900123", addressLine1: "1 Test Street", city: "Sutton", postcode: "SM1 1AA", country: "United Kingdom" };
const input = extra => ({ ...owner, pets: [{ ...pet }], ...extra });

test("optional breed, sex, neutering, weight and history remain unknown, not invented", () => {
  const p = registrationPet(pet, now);
  assert.equal(p.breed, "Unknown"); assert.equal(p.sex, "Unknown");
  for (const key of ["neutered", "neuteredDate", "weight", "microchip"]) assert.equal(p[key], undefined);
  assert.equal(p.dob, "2020-01-01T12:00:00.000Z");
});
test("native fields and owner-reported notes all map without dropping data", () => {
  const p = registrationPet({ ...pet, breed: "Unlisted breed", sex: "Female", neuterStatus: "yes", neuteredDate: "2021-01-01", weight: "12.5", microchip: "123456789012345", previousPractice: "Previous Vet, Sutton", clinicalNotes: "Previous vet says: follow up.", lastVaccinationDate: "2026-01-01", lastDewormingDate: "2026-02-01", lastFleaTickDate: "2026-03-01" }, now);
  assert.equal(p.breed, "Unlisted breed"); assert.equal(p.sex, "Female"); assert.equal(p.neutered, true);
  assert.equal(p.neuteredDate, "2021-01-01T12:00:00.000Z"); assert.equal(p.weight, 12.5); assert.equal(p.microchipped, true);
  assert.match(p.notes, /Temperament \/ handling: Nervous/);
  assert.match(p.notes, /Reason for appointment: Initial health check/);
  for (const text of ["Previous Vet, Sutton", "Previous vet says", "2026-01-01", "2026-02-01", "2026-03-01", "not verified"]) assert(p.notes.includes(text));
  assert.equal(p.primaryVet, undefined, "Previous vet must not become the new primary vet");
});
test("estimated DOB clamps month boundaries and records approximation", () => {
  const p = registrationPet({ ...pet, ageMode: "age", dateOfBirth: "", ageYears: "1", ageMonths: "1" }, new Date("2026-03-31T10:00:00Z"));
  assert.equal(p.dob, "2025-02-28T12:00:00.000Z");
  assert.match(p.notes, /estimated/);
  assert.equal(registrationPet({ ...pet, ageMode: "age", ageYears: "0", ageMonths: "0" }, now).dob, "2026-11-04T12:00:00.000Z");
  assert.equal(londonToday(new Date("2026-07-01T23:30:00Z")), "2026-07-02");
});
for (const [label, value] of [
  ["missing pet name", { petName: "" }], ["missing species", { species: "" }], ["prototype species", { species: "__proto__" }],
  ["missing temperament", { temperament: "" }], ["missing reason", { reason: "  " }],
  ["invalid sex", { sex: "Other" }], ["invalid neuter status", { neuterStatus: "maybe" }],
  ["unknown age", { ageMode: "unknown" }], ["missing DOB", { dateOfBirth: "" }],
  ["impossible date", { dateOfBirth: "2025-02-29" }], ["future date", { dateOfBirth: "2099-01-01" }],
  ["age overflow", { ageMode: "age", ageYears: "101" }], ["invalid months", { ageMode: "age", ageYears: "1", ageMonths: "12" }],
  ["negative age", { ageMode: "age", ageYears: "-1" }], ["empty age", { ageMode: "age" }],
  ["neuter date without status", { neuteredDate: "2021-01-01" }],
  ["neuter before birth", { neuterStatus: "yes", neuteredDate: "2019-01-01" }],
  ["vaccine before birth", { lastVaccinationDate: "2019-01-01" }], ["future flea prevention", { lastFleaTickDate: "2099-01-01" }],
  ["negative weight", { weight: "-1" }], ["NaN weight", { weight: "NaN" }], ["huge weight", { weight: "2001" }],
  ["overflow text", { clinicalNotes: "x".repeat(4001) }], ["non-text optional value", { microchip: {} }],
]) test("rejects " + label, () => assert.throws(() => registrationPet({ ...pet, ...value }, now)));

test("owner address/DOB/referral and multiple pets map to one Lupa create payload", () => {
  const p = registrationPayload(input({ ownerDateOfBirth: "1990-01-01", referralSource: "A friend", contactConsent: true, pets: [pet, { ...pet, petName: "Second pet", species: "Cat" }] }), now);
  assert.equal(p.address.line_1, owner.addressLine1); assert.match(p.address.formatted_address, /Sutton/);
  assert.equal(p.dob, "1990-01-01T12:00:00.000Z"); assert.equal(p.referralSource, "A friend");
  assert.equal(p.newPets.length, 2); assert.equal(p.newPets[1].name, "Second pet");
  assert.deepEqual(p.marketingCommsPreferences, []); assert.deepEqual(p.essentialCommsPreferences, ["email", "sms"]);
});
for (const key of ["firstName", "lastName", "email", "phone", "addressLine1", "city", "postcode", "country"]) {
  test("requires owner " + key, () => assert.throws(() => registrationPayload(input({ [key]: "" }), now)));
}
test("rejects malformed/oversize pet collections and unsupported files", () => {
  for (const pets of [[], Array(7).fill(pet), [null], ["pet"], [{ ...pet, clinicalFile: "base64" }]]) assert.throws(() => registrationPayload(input({ pets }), now));
});
test("bounded JSON input rejects uploads and oversized bodies, including without content-length", async () => {
  await assert.rejects(readRegistrationInput(new Request("https://test", { method: "POST", body: new FormData() })), /File uploads/);
  await assert.rejects(readRegistrationInput(new Request("https://test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: "a".repeat(70000) }) })), /too large/);
  assert.deepEqual(await readRegistrationInput(new Request("https://test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input()) })), input());
});

function fixture({ partial = false, duplicate = false, emailSent = true, emailThrows = false, writeThrows = false } = {}) {
  const calls = [], emails = [];
  const route = load("src/app/api/lupa/registration/route.ts", {
    "@/lib/registration": registration,
    "@/lib/lupa": {
      getLupaErrorState: () => "error", LupaIntegrationError: class extends Error {},
      getLupaRecordId: record => record?.id, withLupaScope: body => ({ ...body, companyId: "fixture-company", storeId: "fixture-store" }),
      lupaFetch: async (path, options) => {
        const body = JSON.parse(options.body); calls.push({ path, body });
        if (writeThrows) throw new Error("upstream timeout");
        return { id: "owner", pets: partial ? [] : body.newPets.map((_, index) => ({ id: duplicate ? "same" : "pet-" + index })) };
      },
    },
    "@/lib/transactionalEmail": { sendRegistrationConfirmation: async input => { emails.push(input); if (emailThrows) throw new Error("email failed"); return { sent: emailSent }; } },
  });
  return { calls, emails, submit: async input => route.POST(new NextRequest("https://clinic.example/api/lupa/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) })) };
}
test("two pets create in one Lupa request and one confirmation email", async () => {
  const f = fixture(), response = await f.submit(input({ pets: [pet, { ...pet, petName: "Second pet" }] }));
  const body = await response.json();
  assert.equal(response.status, 200); assert.equal(body.petCount, 2); assert.equal(body.ok, true);
  assert.equal(f.calls.length, 1); assert.equal(f.calls[0].body.newPets.length, 2);
  assert.equal(f.emails.length, 1); assert.equal(f.emails[0].petName, "Test pet, Second pet");
  assert.match(body.message, /does not book an appointment/);
});
test("bad second pet prevents every write", async () => {
  const f = fixture(), response = await f.submit(input({ pets: [pet, { ...pet, temperament: "" }] }));
  assert.equal(response.status, 400); const body = await response.json();
  assert.match(body.error, /Pet 2/); assert.equal(body.retryable, true);
  assert.equal(f.calls.length, 0); assert.equal(f.emails.length, 0);
});
for (const options of [{ partial: true }, { duplicate: true }, { writeThrows: true }]) {
  test("uncertain create response locks retries " + JSON.stringify(options), async () => {
    const f = fixture(options), body = await (await f.submit(input({ pets: [pet, pet] }))).json();
    assert.equal(body.ok, false); assert.equal(body.retryable, false); assert.equal(f.emails.length, 0);
  });
}
for (const options of [{ emailSent: false }, { emailThrows: true }]) {
  test("email failure cannot undo registration " + JSON.stringify(options), async () => {
    const f = fixture(options), body = await (await f.submit(input())).json();
    assert.equal(body.ok, true); assert.equal(body.emailSent, false);
  });
}
