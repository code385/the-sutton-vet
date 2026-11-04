import { NextRequest, NextResponse } from "next/server";

import { getLupaErrorState, getLupaRecordId, LupaIntegrationError, lupaFetch, withLupaScope } from "@/lib/lupa";
import { sendRegistrationConfirmation } from "@/lib/transactionalEmail";
import { readRegistrationInput, registrationPayload } from "@/lib/registration";

export async function POST(request: NextRequest) {
  let input: ReturnType<typeof registrationPayload>;
  try {
    input = registrationPayload(await readRegistrationInput(request));
  } catch (error) {
    return NextResponse.json({ ok: false, retryable: true, error: error instanceof Error ? error.message : "Please complete the form and try again." }, { status: 400 });
  }
  try {
    const client = await lupaFetch<Record<string, unknown>>("/v1/clients/create", {
      method: "POST",
      body: JSON.stringify(withLupaScope(input, "client")),
      signal: AbortSignal.timeout(20000),
    });
    const clientId = getLupaRecordId(client);
    const petIds = Array.isArray(client.pets) ? client.pets.map((pet) => getLupaRecordId(pet)).filter(Boolean) : [];
    if (!clientId || new Set(petIds).size !== input.newPets.length) {
      // A successful write with an unexpected response must not invite another submission.
      console.error("[Lupa registration] Could not confirm the owner and pet IDs in the create response.");
      return NextResponse.json({ ok: false, retryable: false, error: "Your details may have been received. Please call the clinic to confirm your registration before submitting again." }, { status: 502 });
    }
    let emailSent = false;
    try {
      emailSent = (await sendRegistrationConfirmation({
        email: input.email, firstName: input.firstName,
        petName: input.newPets.map(pet => pet.name).join(", "),
        reference: `${clientId}/${petIds.join("/")}`,
      })).sent;
    } catch { console.error("[Lupa registration] Registered; confirmation email unavailable."); }
    const petsLabel = input.newPets.length === 1 ? "your pet" : `your ${input.newPets.length} pets`;
    return NextResponse.json({
      ok: true,
      emailSent,
      petCount: input.newPets.length,
      message: `Thank you. You and ${petsLabel} have been registered with The Sutton Vet.${emailSent ? " We have sent a confirmation email to your inbox." : ""} This registration does not book an appointment; please use Book Online to request a time.`,
    });
  } catch (error) {
    if (error instanceof LupaIntegrationError && error.validationFields.length) {
      const message = error.validationFields.includes("phone")
        ? "Please enter a valid phone number with its country code (for the UK, use +44 and omit the leading 0)."
        : error.validationFields.includes("email")
          ? "Please check your email address and try again."
          : "Please check your name and pet details, including dates, and try again.";
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
