import { NextResponse } from "next/server";

import { getLupaIntegrationStatus } from "@/lib/lupa";

export async function GET() {
  return NextResponse.json(getLupaIntegrationStatus());
}
