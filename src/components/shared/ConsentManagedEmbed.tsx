"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import {
  type CookiePreferences,
  COOKIE_CONSENT_UPDATED_EVENT,
  defaultCookiePreferences,
  readCookieConsent,
  requestCookieConsentPanel,
} from "@/lib/cookie-consent";

type ConsentManagedEmbedProps = {
  category: "preferences" | "marketing";
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  placeholderLabel?: string;
  backgroundImageUrl?: string;
  className?: string;
  hideWhenBlocked?: boolean;
  children: ReactNode;
};

export function ConsentManagedEmbed({
  category,
  title,
  description,
  actionHref,
  actionLabel,
  placeholderLabel,
  backgroundImageUrl,
  className,
  hideWhenBlocked,
  children,
}: ConsentManagedEmbedProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultCookiePreferences);
  const [hasLoadedConsent, setHasLoadedConsent] = useState(false);

  useEffect(() => {
    const existing = readCookieConsent();

    if (existing) {
      setPreferences(existing);
    }

    setHasLoadedConsent(true);

    function handleConsentUpdate(event: Event) {
      const detail = (event as CustomEvent<CookiePreferences>).detail;
      if (detail) {
        setPreferences(detail);
      } else {
        const latest = readCookieConsent();
        if (latest) {
          setPreferences(latest);
        }
      }
    }

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleConsentUpdate);
    return () => window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleConsentUpdate);
  }, []);

  const isAllowed = hasLoadedConsent && preferences[category];
  const placeholderStyle = useMemo(
    () =>
      backgroundImageUrl
        ? {
            backgroundImage: `linear-gradient(135deg, rgba(18, 28, 42, 0.72), rgba(85, 32, 111, 0.52)), url(${backgroundImageUrl})`,
          }
        : undefined,
    [backgroundImageUrl],
  );

  if (isAllowed) {
    return <>{children}</>;
  }

  if (hideWhenBlocked) {
    return null;
  }

  return (
    <div className={`consent-embed-block${className ? ` ${className}` : ""}`} style={placeholderStyle}>
      <div className="consent-embed-copy">
        <p className="eyebrow">{placeholderLabel || "Consent required"}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="consent-embed-actions">
        <button className="button button-primary" type="button" onClick={requestCookieConsentPanel}>
          Manage cookies
        </button>
        <a className="button button-muted" href={actionHref} target="_blank" rel="noreferrer">
          {actionLabel}
        </a>
      </div>
    </div>
  );
}
