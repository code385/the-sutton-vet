const defaultLupaApiBaseUrl = "https://api.lupapets.com/api/external";

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

export class LupaIntegrationError extends Error {
  status?: number;
  state: LupaAccessState;

  constructor(message: string, state: LupaAccessState, status?: number) {
    super(message);
    this.name = "LupaIntegrationError";
    this.state = state;
    this.status = status;
  }
}

export const lupaConfig = {
  apiBaseUrl: (process.env.LUPA_API_BASE_URL || defaultLupaApiBaseUrl).replace(/\/$/, ""),
  apiKey: process.env.LUPA_API_KEY || "",
  companyId: process.env.LUPA_COMPANY_ID || "",
  storeId: process.env.LUPA_STORE_ID || "",
  bookingUrl: process.env.NEXT_PUBLIC_LUPA_BOOKING_URL || process.env.NEXT_PUBLIC_PMS_BOOKING_URL || "/pms-integration?flow=book",
  registrationUrl: process.env.NEXT_PUBLIC_LUPA_REGISTRATION_URL || process.env.NEXT_PUBLIC_PMS_REGISTRATION_URL || "/pms-integration?flow=register",
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
    if (response.status === 401) {
      throw new LupaIntegrationError("Lupa API request failed with 401", "unauthorized", response.status);
    }
    if (response.status === 403) {
      throw new LupaIntegrationError("Lupa API request failed with 403", "forbidden", response.status);
    }
    throw new LupaIntegrationError(`Lupa API request failed with ${response.status}`, "unavailable", response.status);
  }

  return response.json() as Promise<T>;
}
export function withLupaScope<T extends Record<string, unknown>>(payload: T) {
  return {
    companyId: lupaConfig.companyId,
    storeIds: [lupaConfig.storeId],
    storeId: lupaConfig.storeId,
    ...payload,
  };
}

export function getLupaRecordId(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;
  if (typeof record.id === "string") return record.id;
  if (record.data && typeof record.data === "object") {
    const data = record.data as Record<string, unknown>;
    if (typeof data.id === "string") return data.id;
  }

  return undefined;
}