import { NextRequest, NextResponse } from "next/server";

import { getLupaErrorState, getLupaRecordId, LupaIntegrationError, lupaFetch, withLupaScope } from "@/lib/lupa";

type BookingInput = {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  petName?: string;
  species?: string;
  breed?: string;
  sex?: string;
  visitTypeId?: string;
  start?: string;
  end?: string;
  employeeId?: string;
  notes?: string;
};

const titleOptions = ["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Prof"];
const clean = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: NextRequest) {
  let input: BookingInput;
  try {
    input = await request.json() as BookingInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Please complete the form and try again." }, { status: 400 });
  }

  const title = clean(input.title, 20);
  const firstName = clean(input.firstName, 80);
  const lastName = clean(input.lastName, 80);
  const email = clean(input.email, 160);
  const phone = clean(input.phone, 40);
  const petName = clean(input.petName, 80);
  const species = clean(input.species, 50);
  const breed = clean(input.breed, 100);
  const sex = clean(input.sex, 20);
  const visitTypeId = clean(input.visitTypeId, 100);
  const start = clean(input.start, 80);
  const end = clean(input.end, 80);
  const employeeId = clean(input.employeeId, 100);

  if (!titleOptions.includes(title) || !firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || !petName || !visitTypeId || !start || !end) {
    return NextResponse.json({ ok: false, error: "Please select an appointment type and time, then complete your title, contact, and pet details." }, { status: 400 });
  }

  if (!["Dog", "Cat", "Rabbit", "Other"].includes(species) || !breed || !["Male", "Female", "Unknown"].includes(sex)) {
    return NextResponse.json({ ok: false, error: "Please choose a species, breed, and sex from the available options." }, { status: 400 });
  }

  let clientCreated = false;
  try {
    const client = await lupaFetch<Record<string, unknown>>("/v1/clients/create", {
      method: "POST",
      body: JSON.stringify(withLupaScope({
        title,
        firstName,
        lastName,
        email,
        phone,
        marketingCommsPreferences: [],
        newPets: [{ name: petName, species, breed, sex }],
      }, "client")),
    });
    const clientId = getLupaRecordId(client);
    const pets = Array.isArray(client.pets) ? client.pets : [];
    const petId = pets.map((pet) => getLupaRecordId(pet)).find(Boolean);
    if (!clientId || !petId) throw new Error("Lupa did not return the new client and pet IDs.");
    clientCreated = true;

    await lupaFetch<string>("/v1/appointments", {
      method: "POST",
      body: JSON.stringify(withLupaScope({
        petId,
        visitTypeId,
        start,
        end,
        status: "requested",
        employeeId: employeeId || undefined,
        notes: clean(input.notes, 1000) || undefined,
      }, "booking")),
    });

    return NextResponse.json({ ok: true, message: "Thank you. Your registration and appointment request have been sent to The Sutton Vet." });
  } catch (error) {
    const upstreamStatus = error instanceof LupaIntegrationError ? error.status : undefined;
    console.error("[Lupa booking]", { state: getLupaErrorState(error), upstreamStatus: upstreamStatus ?? null, clientCreated });
    return NextResponse.json({
      ok: false,
      state: getLupaErrorState(error),
      retryable: !clientCreated,
      error: clientCreated
        ? "Your registration may have been received, but we could not confirm the appointment. Please call the clinic before trying again so we can avoid duplicate records."
        : "Online booking is temporarily unavailable. Please call the clinic and the team will help you book an appointment.",
    }, { status: 503 });
  }
}
