import { NextRequest, NextResponse } from "next/server";

import { getLupaErrorState, getLupaRecordId, lupaFetch, withLupaScope } from "@/lib/lupa";

type BookingInput = { firstName?: string; lastName?: string; email?: string; phone?: string; petName?: string; species?: string; breed?: string; sex?: string; visitTypeId?: string; start?: string; end?: string; notes?: string };
const clean = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: NextRequest) {
  let input: BookingInput;
  try { input = await request.json() as BookingInput; } catch { return NextResponse.json({ ok: false, error: "Please complete the form and try again." }, { status: 400 }); }
  const firstName = clean(input.firstName, 80); const lastName = clean(input.lastName, 80); const email = clean(input.email, 160); const phone = clean(input.phone, 40); const petName = clean(input.petName, 80); const visitTypeId = clean(input.visitTypeId, 100); const start = clean(input.start, 80); const end = clean(input.end, 80);
  if (!firstName || !lastName || !email.includes("@") || !phone || !petName || !visitTypeId || !start || !end) return NextResponse.json({ ok: false, error: "Please select an appointment type and time, then complete your contact and pet details." }, { status: 400 });
  try {
    const client = await lupaFetch<Record<string, unknown>>("/v1/clients/create", { method: "POST", body: JSON.stringify(withLupaScope({ firstName, lastName, email, phone, gdprOptIn: true })) });
    const clientId = getLupaRecordId(client); if (!clientId) throw new Error("Lupa did not return a client ID.");
    const pet = await lupaFetch<Record<string, unknown>>("/v1/pets/create", { method: "POST", body: JSON.stringify(withLupaScope({ clientId, name: petName, species: clean(input.species, 50) || "Dog", breed: clean(input.breed, 100) || "Unknown", sex: clean(input.sex, 20) || "Unknown", neutered: false, deceased: false })) });
    const petId = getLupaRecordId(pet); if (!petId) throw new Error("Lupa did not return a pet ID.");
    await lupaFetch<Record<string, unknown>>("/v1/request-booking", { method: "POST", body: JSON.stringify(withLupaScope({ petId, visitTypeId, start, end, notes: clean(input.notes, 1000) || undefined })) });
    return NextResponse.json({ ok: true, message: "Thank you. Your appointment request has been sent to The Sutton Vet." });
  } catch (error) { return NextResponse.json({ ok: false, state: getLupaErrorState(error), error: "Online booking is temporarily unavailable. Please call the clinic and the team will help you book an appointment." }, { status: 503 }); }
}
