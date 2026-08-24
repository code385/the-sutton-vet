import { NextRequest, NextResponse } from "next/server";

import { getLupaErrorState, lupaConfig, lupaFetch } from "@/lib/lupa";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  const duration = Number(request.nextUrl.searchParams.get("duration") || "30");
  const visitTypeId = request.nextUrl.searchParams.get("visitTypeId");

  if (!month || !/^\d{4}-\d{2}$/.test(month) || !Number.isFinite(duration) || duration < 5 || duration > 480) {
    return NextResponse.json({ available: false, items: [], error: "Choose a valid month and appointment length." }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ month, duration: String(duration) });
    if (visitTypeId) params.set("visitTypeId", visitTypeId);
    const data = await lupaFetch<Record<string, unknown>>(`/v1/companies/store/${lupaConfig.storeId}/available-slots?${params}`);
    return NextResponse.json({ available: true, source: "lupa", data });
  } catch (error) {
    return NextResponse.json({
      available: false,
      source: "fallback",
      state: getLupaErrorState(error),
      items: [],
      error: "Live appointment slots are not available at the moment. Please call the clinic and the team will help you find a suitable time.",
    });
  }
}
