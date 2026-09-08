import { NextRequest, NextResponse } from "next/server";

import { diagnoseLupaRequest, getLupaIntegrationStatus, lupaConfig } from "@/lib/lupa";

export const dynamic = "force-dynamic";

const configuredPostCalls = [
  { method: "POST", endpoint: "/v1/clients/create", purpose: "Create an owner", scopeLocation: "JSON body" },
  { method: "POST", endpoint: "/v1/pets/create", purpose: "Create the owner's pet", scopeLocation: "JSON body" },
  { method: "POST", endpoint: "/v1/request-booking", purpose: "Send an appointment request", scopeLocation: "JSON body" },
];

export async function GET(request: NextRequest) {
  const suppliedKey = request.nextUrl.searchParams.get("key");
  const diagnosticKey = process.env.LUPA_DIAGNOSTICS_KEY;
  if (!diagnosticKey || suppliedKey !== diagnosticKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const month = new Date().toISOString().slice(0, 7);
  const readOnlyChecks = await Promise.all([
    diagnoseLupaRequest("/ping"),
    diagnoseLupaRequest("/v1/services?limit=1&direction=asc"),
    diagnoseLupaRequest("/v1/appointment-types?limit=1&direction=asc"),
    diagnoseLupaRequest("/v1/health-plans?limit=1&direction=asc"),
    diagnoseLupaRequest(`/v1/companies/store/${lupaConfig.storeId}/available-slots?month=${month}&duration=30`),
  ]);
  const status = getLupaIntegrationStatus();

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    explanation: "Read-only Lupa checks. The API key is server-side and redacted. POST calls are listed but not executed to avoid creating records.",
    configuration: {
      apiBaseUrl: status.apiBaseUrl,
      companyId: lupaConfig.companyId,
      storeId: lupaConfig.storeId,
      apiKeyConfigured: status.hasApiKey,
      authorization: "Bearer [REDACTED]",
    },
    readOnlyChecks,
    configuredPostCalls,
  });
}
