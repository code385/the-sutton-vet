const defaultLupaApiBaseUrl = "https://api.lupapets.com/api/external";

function resolveJourneyUrl(value: string | undefined, fallback: string) {
  return !value || value.startsWith("/pms-integration") ? fallback : value;
}

export type LupaIntegrationStatus = {
  apiBaseUrl: string;
  hasApiKey: boolean;
  hasCompanyId: boolean;
  hasStoreId: boolean;
  bookingUrl: string;
  registrationUrl: string;
  healthPlanUrl: string;
  paymentsStatus: "pending" | "configured";
  healthPlanStatus: "pending" | "configured";
};

export type LupaAccessState = "ready" | "missing_config" | "forbidden" | "unauthorized" | "unavailable";

export type LupaDiagnosticResult = {
  method: string;
  endpoint: string;
  requestUrl: string;
  companyIdIncluded: boolean;
  storeIdIncluded: boolean;
  authorization: "Bearer [REDACTED]";
  status: number | null;
  ok: boolean;
  state: LupaAccessState;
};

export class LupaIntegrationError extends Error {
  status?: number;
  state: LupaAccessState;
  validationFields: string[];

  constructor(message: string, state: LupaAccessState, status?: number, validationFields: string[] = []) {
    super(message);
    this.name = "LupaIntegrationError";
    this.state = state;
    this.status = status;
    this.validationFields = validationFields;
  }
}

export const lupaConfig = {
  apiBaseUrl: (process.env.LUPA_API_BASE_URL || defaultLupaApiBaseUrl).replace(/\/$/, ""),
  apiKey: process.env.LUPA_API_KEY || "",
  companyId: process.env.LUPA_COMPANY_ID || "",
  storeId: process.env.LUPA_STORE_ID || "",
  bookingUrl: resolveJourneyUrl(process.env.NEXT_PUBLIC_LUPA_BOOKING_URL || process.env.NEXT_PUBLIC_PMS_BOOKING_URL, "/book"),
  registrationUrl: resolveJourneyUrl(process.env.NEXT_PUBLIC_LUPA_REGISTRATION_URL || process.env.NEXT_PUBLIC_PMS_REGISTRATION_URL, "/register"),
  healthPlanUrl: process.env.NEXT_PUBLIC_LUPA_HEALTHPLAN_URL || process.env.NEXT_PUBLIC_PMS_HEALTH_PLAN_URL || "/health-plan",
  paymentsEnabled: process.env.LUPA_PAY_ENABLED === "true",
  healthPlanEnabled: process.env.LUPA_HEALTH_PLAN_ENABLED === "true",
};

export function getLupaIntegrationStatus(): LupaIntegrationStatus {
  return {
    apiBaseUrl: lupaConfig.apiBaseUrl,
    hasApiKey: Boolean(lupaConfig.apiKey),
    hasCompanyId: Boolean(lupaConfig.companyId),
    hasStoreId: Boolean(lupaConfig.storeId),
    bookingUrl: lupaConfig.bookingUrl,
    registrationUrl: lupaConfig.registrationUrl,
    healthPlanUrl: lupaConfig.healthPlanUrl,
    paymentsStatus: lupaConfig.paymentsEnabled ? "configured" : "pending",
    healthPlanStatus: lupaConfig.healthPlanEnabled ? "configured" : "pending",
  };
}

function assertLupaServerConfig() {
  const missing = [
    ["LUPA_API_KEY", lupaConfig.apiKey],
    ["LUPA_COMPANY_ID", lupaConfig.companyId],
    ["LUPA_STORE_ID", lupaConfig.storeId],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new LupaIntegrationError(`Missing Lupa environment variables: ${missing.join(", ")}`, "missing_config");
  }
}

export function getLupaErrorState(error: unknown): LupaAccessState {
  if (error instanceof LupaIntegrationError) return error.state;
  return "unavailable";
}

export async function lupaFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  assertLupaServerConfig();

  const url = new URL(`${lupaConfig.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`);
  if (init.method === undefined || init.method.toUpperCase() === "GET") {
    if (!url.searchParams.has("companyId")) url.searchParams.set("companyId", lupaConfig.companyId);
    if (!url.searchParams.has("storeIds")) url.searchParams.set("storeIds", lupaConfig.storeId);
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${lupaConfig.apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const validationFields: string[] = [];
    if (response.status === 400 || response.status === 422) {
      const body: unknown = await response.json().catch(() => null);
      if (body && typeof body === "object" && "issues" in body && Array.isArray(body.issues)) {
        for (const issue of body.issues) {
          const field: unknown = issue?.path?.[0];
          if (typeof field === "string" && ["phone", "email", "firstName", "lastName"].includes(field)) {
            validationFields.push(field);
          }
        }
      }
    }
    // Keep upstream failures visible without logging credentials or client details.
    console.error("[Lupa request failed]", { method: init.method || "GET", endpoint: url.pathname, status: response.status, validationFields });
    if (response.status === 401) {
      throw new LupaIntegrationError("Lupa API request failed with 401", "unauthorized", response.status);
    }
    if (response.status === 403) {
      throw new LupaIntegrationError("Lupa API request failed with 403", "forbidden", response.status);
    }
    throw new LupaIntegrationError(`Lupa API request failed with ${response.status}`, "unavailable", response.status, validationFields);
  }

  return response.json() as Promise<T>;
}

export async function diagnoseLupaRequest(path: string, init: RequestInit = {}): Promise<LupaDiagnosticResult> {
  assertLupaServerConfig();

  const method = init.method?.toUpperCase() || "GET";
  const url = new URL(`${lupaConfig.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`);
  if (method === "GET") {
    if (!url.searchParams.has("companyId")) url.searchParams.set("companyId", lupaConfig.companyId);
    if (!url.searchParams.has("storeIds")) url.searchParams.set("storeIds", lupaConfig.storeId);
  }

  try {
    const response = await fetch(url, {
      ...init,
      method,
      headers: {
        Authorization: `Bearer ${lupaConfig.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
      cache: "no-store",
    });
    const state: LupaAccessState = response.ok
      ? "ready"
      : response.status === 401
        ? "unauthorized"
        : response.status === 403
          ? "forbidden"
          : "unavailable";
    const result: LupaDiagnosticResult = {
      method,
      endpoint: url.pathname,
      requestUrl: url.toString(),
      companyIdIncluded: url.searchParams.get("companyId") === lupaConfig.companyId,
      storeIdIncluded: url.pathname.includes(lupaConfig.storeId) || url.searchParams.get("storeIds") === lupaConfig.storeId,
      authorization: "Bearer [REDACTED]",
      status: response.status,
      ok: response.ok,
      state,
    };
    console.info("[Lupa diagnostic]", result);
    return result;
  } catch {
    const result: LupaDiagnosticResult = {
      method,
      endpoint: url.pathname,
      requestUrl: url.toString(),
      companyIdIncluded: url.searchParams.get("companyId") === lupaConfig.companyId,
      storeIdIncluded: url.pathname.includes(lupaConfig.storeId) || url.searchParams.get("storeIds") === lupaConfig.storeId,
      authorization: "Bearer [REDACTED]",
      status: null,
      ok: false,
      state: "unavailable",
    };
    console.info("[Lupa diagnostic]", result);
    return result;
  }
}
export function withLupaScope<T extends Record<string, unknown>>(payload: T, endpoint: "client" | "pet" | "booking" = "pet") {
  return {
    companyId: lupaConfig.companyId,
    ...(endpoint !== "client" ? { storeIds: [lupaConfig.storeId] } : {}),
    ...(endpoint !== "booking" ? { storeId: lupaConfig.storeId } : {}),
    ...payload,
  };
}

export function getLupaRecordId(payload: unknown): string | undefined {
  if (typeof payload === "string" && payload) return payload;
  if (!payload || typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;
  if (typeof record.id === "string") return record.id;
  if (record.data && typeof record.data === "object") {
    const data = record.data as Record<string, unknown>;
    if (typeof data.id === "string") return data.id;
  }

  return undefined;
}
