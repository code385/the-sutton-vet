export type CookiePreferences = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_STORAGE_KEY = "cookie_consent";
export const COOKIE_CONSENT_OPEN_EVENT = "open-cookie-consent";
export const COOKIE_CONSENT_UPDATED_EVENT = "cookie-consent-updated";

export const defaultCookiePreferences: CookiePreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export function readCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveCookieConsent(value: CookiePreferences) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: value }));
}

export function requestCookieConsentPanel() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_OPEN_EVENT));
}
