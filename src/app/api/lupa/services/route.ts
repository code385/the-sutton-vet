import { NextResponse } from "next/server";

import { getLupaErrorState, lupaFetch } from "@/lib/lupa";

export async function GET() {
  try {
    const data = await lupaFetch<Record<string, unknown>>("/v1/services?limit=100&direction=asc");
    return NextResponse.json({ available: true, source: "lupa", data });
  } catch (error) {
    return NextResponse.json({
      available: false,
      source: "fallback",
      state: getLupaErrorState(error),
      items: [],
      error: "Lupa services are not available yet. The website will keep using the local services content until sandbox API access is confirmed.",
    });
  }
}