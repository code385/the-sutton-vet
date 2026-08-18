import { NextResponse } from "next/server";

import { lupaFetch } from "@/lib/lupa";

export async function GET() {
  try {
    const data = await lupaFetch("/v1/services?limit=100&direction=asc");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Lupa services are not available yet. Check server-side Lupa environment variables." },
      { status: 503 },
    );
  }
}
