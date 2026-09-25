"use client";

import { requestCookieConsentPanel } from "@/lib/cookie-consent";

export function CookieSettingsButton() {
  return (
    <button className="sv-footer-cookie-settings" type="button" onClick={requestCookieConsentPanel}>
      Cookie settings
    </button>
  );
}
