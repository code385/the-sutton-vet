import { NextRequest, NextResponse } from "next/server";

import { getLupaErrorState, getLupaRecordId, LupaIntegrationError, lupaFetch, withLupaScope } from "@/lib/lupa";

const clean = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";
const titleOptions = ["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Prof"];

export async function POST(request: NextRequest) {
  let input: Record<string, unknown>;
  try {
    const value: unknown = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid form");
    input = value as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Please complete the form and try again." }, { status: 400 });
  }

  const firstName = clean(input.firstName, 80);
  const lastName = clean(input.lastName, 80);
  const title = clean(input.title, 20);
  const email = clean(input.email, 160);
  const phone = clean(input.phone, 40);
  const name = clean(input.petName, 80);
  const species = clean(input.species, 50);
  const breed = clean(input.breed, 100);
  const sex = clean(input.sex, 20);
  if (!titleOptions.includes(title) || !firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || !name) {
    return NextResponse.json({ ok: false, error: "Please provide your title, name, a valid email, phone number, and your pet's name." }, { status: 400 });
  }
  if (!["Dog", "Cat", "Rabbit", "Other"].includes(species) || !breed || !["Male", "Female", "Unknown"].includes(sex)) {
    return NextResponse.json({ ok: false, error: "Please choose a species, breed, and sex from the available options." }, { status: 400 });
  }

  // The old form called essential contact consent gdprOptIn. It is not marketing consent.
  const consent = input.contactConsent ?? input.gdprOptIn;
  const allowContact = consent === true || consent === "true";
  try {
    const client = await lupaFetch<Record<string, unknown>>("/v1/clients/create", {
      method: "POST",
      body: JSON.stringify(withLupaScope({
        title, firstName, lastName, email, phone,
        marketingCommsPreferences: [],
        essentialCommsPreferences: allowContact ? ["email", "sms"] : [],
        newPets: [{ name, species, breed, sex }],
      }, "client")),
    });
    if (!getLupaRecordId(client) || !Array.isArray(client.pets) || !client.pets.some((pet) => getLupaRecordId(pet))) {
      // A successful write with an unexpected response must not invite another submission.
      console.error("[Lupa registration] Could not confirm the owner and pet IDs in the create response.");
      return NextResponse.json({ ok: false, retryable: false, error: "Your details may have been received. Please call the clinic to confirm your registration before submitting again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, message: "Thank you. You and your pet have been registered with The Sutton Vet." });
  } catch (error) {
    if (error instanceof LupaIntegrationError && error.validationFields.length) {
      const message = error.validationFields.includes("phone")
        ? "Please enter a valid phone number with its country code (for the UK, use +44 and omit the leading 0)."
        : error.validationFields.includes("email")
          ? "Please check your email address and try again."
          : "Please check your first and last name and try again.";
      return NextResponse.json({ ok: false, retryable: true, error: message }, { status: 400 });
    }
    const upstreamStatus = error instanceof LupaIntegrationError ? error.status : undefined;
    console.error("[Lupa registration]", { state: getLupaErrorState(error), upstreamStatus: upstreamStatus ?? null });
    return NextResponse.json({
      ok: false,
      state: getLupaErrorState(error),
      retryable: false,
      error: "We could not confirm your registration. Please call the clinic before trying again so we can avoid duplicate records.",
    }, { status: upstreamStatus === 400 || upstreamStatus === 422 ? 502 : 503 });
  }
}
