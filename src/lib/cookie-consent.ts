export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  externalMedia: boolean;
};

export const COOKIE_CONSENT_STORAGE_KEY = "cookie_consent";
export const COOKIE_CONSENT_OPEN_EVENT = "open-cookie-consent";
export const COOKIE_CONSENT_UPDATED_EVENT = "cookie-consent-updated";
export const COOKIE_CONSENT_VERSION = 2;
const COOKIE_CONSENT_LIFETIME_DAYS = 180;

export const defaultCookiePreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  externalMedia: false,
};

type StoredCookieConsent = CookiePreferences & {
  version: number;
  savedAt: string;
  expiresAt: string;
};

function clearKnownOptionalCookies() {
  const optionalCookieName = /^(_ga|_gid|_gat|_gcl|_fbp|_clck|_clsk)/i;
  const hostname = window.location.hostname;
  const domains = [hostname, hostname.startsWith("www.") ? hostname.slice(4) : `.${hostname}`];

  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (!name || !optionalCookieName.test(name)) return;

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    });
  });
}

function updateGoogleConsentMode(value: CookiePreferences) {
  const consentWindow = window as Window & { dataLayer?: unknown[] };
  if (!Array.isArray(consentWindow.dataLayer)) return;

  consentWindow.dataLayer.push([
    "consent",
    "update",
    {
      analytics_storage: value.analytics ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      personalization_storage: "denied",
    },
  ]);
}

export function readCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredCookieConsent>;
    const isExpired = !parsed.expiresAt || Date.parse(parsed.expiresAt) <= Date.now();
    const isCurrentVersion = parsed.version === COOKIE_CONSENT_VERSION;

    if (isExpired || !isCurrentVersion) {
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      return null;
    }

    return {
      necessary: true,
      analytics: parsed.analytics === true,
      externalMedia: parsed.externalMedia === true,
    };
  } catch {
    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    return null;
  }
}

export function saveCookieConsent(value: CookiePreferences) {
  const savedAt = new Date();
  const expiresAt = new Date(savedAt);
  expiresAt.setDate(expiresAt.getDate() + COOKIE_CONSENT_LIFETIME_DAYS);
  const storedValue: StoredCookieConsent = {
    ...value,
    necessary: true,
    version: COOKIE_CONSENT_VERSION,
    savedAt: savedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(storedValue));
  updateGoogleConsentMode(value);
  if (!value.analytics) clearKnownOptionalCookies();
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: value }));
}

export function requestCookieConsentPanel() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_OPEN_EVENT));
}
