import { NextRequest, NextResponse } from "next/server";

import { getLupaErrorState, getLupaRecordId, lupaFetch, withLupaScope } from "@/lib/lupa";

type RegistrationInput = { firstName?: string; lastName?: string; email?: string; phone?: string; petName?: string; species?: string; breed?: string; sex?: string; gdprOptIn?: boolean };
const clean = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: NextRequest) {
  let input: RegistrationInput;
  try { input = await request.json() as RegistrationInput; } catch { return NextResponse.json({ ok: false, error: "Please complete the form and try again." }, { status: 400 }); }
  const firstName = clean(input.firstName, 80); const lastName = clean(input.lastName, 80); const email = clean(input.email, 160); const phone = clean(input.phone, 40); const petName = clean(input.petName, 80);
  if (!firstName || !lastName || !email.includes("@") || !phone || !petName) return NextResponse.json({ ok: false, error: "Please provide your name, email, phone number, and your pet's name." }, { status: 400 });
  try {
    const client = await lupaFetch<Record<string, unknown>>("/v1/clients/create", { method: "POST", body: JSON.stringify(withLupaScope({ firstName, lastName, email, phone, gdprOptIn: Boolean(input.gdprOptIn) })) });
    const clientId = getLupaRecordId(client); if (!clientId) throw new Error("Lupa did not return a client ID.");
    await lupaFetch<Record<string, unknown>>("/v1/pets/create", { method: "POST", body: JSON.stringify(withLupaScope({ clientId, name: petName, species: clean(input.species, 50) || "Dog", breed: clean(input.breed, 100) || "Unknown", sex: clean(input.sex, 20) || "Unknown", neutered: false, deceased: false })) });
    return NextResponse.json({ ok: true, message: "Thank you. Your registration has been sent to The Sutton Vet." });
  } catch (error) { return NextResponse.json({ ok: false, state: getLupaErrorState(error), error: "Online registration is temporarily unavailable. Please call the clinic and the team will register you directly." }, { status: 503 }); }
}
