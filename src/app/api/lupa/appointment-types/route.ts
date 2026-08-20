import { NextResponse } from "next/server";

import { getLupaErrorState, lupaFetch } from "@/lib/lupa";

export async function GET() {
  try {
    const data = await lupaFetch<Record<string, unknown>>("/v1/appointment-types?limit=100&direction=asc");
    return NextResponse.json({ available: true, source: "lupa", data });
  } catch (error) {
    return NextResponse.json({
      available: false,
      source: "fallback",
      state: getLupaErrorState(error),
      items: [],
      error: "Lupa appointment types are not available yet. Booking buttons can still route to the temporary PMS handover page until sandbox access is confirmed.",
    });
  }
}