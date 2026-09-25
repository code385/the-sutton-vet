"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  COOKIE_CONSENT_OPEN_EVENT,
  defaultCookiePreferences,
  readCookieConsent,
  saveCookieConsent,
  type CookiePreferences,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSavedChoice, setHasSavedChoice] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultCookiePreferences);

  useEffect(() => {
    const existing = readCookieConsent();

    if (existing) {
      setPreferences(existing);
      setHasSavedChoice(true);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }

    function handleOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, handleOpenRequest);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, handleOpenRequest);
  }, []);

  const optionalSummary = useMemo(() => {
    const enabled = Object.entries(preferences)
      .filter(([key, value]) => key !== "necessary" && value)
      .map(([key]) => key === "externalMedia" ? "external media" : key);

    if (enabled.length === 0) {
      return "Optional cookies are currently disabled.";
    }

    return `Enabled: ${enabled.join(", ")}.`;
  }, [preferences]);

  function applyConsent(next: CookiePreferences) {
    setPreferences(next);
    saveCookieConsent(next);
    setHasSavedChoice(true);
    setIsOpen(false);
  }

  function togglePreference(key: "analytics" | "externalMedia") {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <>
      <button className="cookie-fab" type="button" onClick={() => setIsOpen(true)} aria-label="Manage cookie settings">
        <span className="cookie-fab-icon" aria-hidden="true">?</span>
        <span className="sr-only">Manage cookie settings</span>
      </button>

      {isOpen ? <div className="cookie-backdrop" aria-hidden="true" onClick={() => hasSavedChoice ? setIsOpen(false) : applyConsent(defaultCookiePreferences)} /> : null}

      <aside className={`cookie-drawer${isOpen ? " is-open" : ""}`} aria-label="Cookie consent panel">
        <div className="cookie-drawer-scroll">
          <div className="cookie-drawer-header">
            <p className="eyebrow">Privacy Choices</p>
            <h2>Your cookie settings.</h2>
            <p>
              We use essential technologies to run this website. With your permission, we also use analytics and
              external media to improve your experience.
            </p>
            {!hasSavedChoice ? <p className="cookie-required-note">Optional technologies are off unless you choose to allow them.</p> : null}
          </div>

          <div className="cookie-actions">
            <button
              className="button button-primary cookie-action-button"
              type="button"
              onClick={() =>
                applyConsent({
                  necessary: true,
                  analytics: true,
                  externalMedia: true,
                })
              }
            >
              Accept all
            </button>
            <button
              className="button button-muted cookie-action-button"
              type="button"
              onClick={() =>
                applyConsent({
                  necessary: true,
                  analytics: false,
                  externalMedia: false,
                })
              }
            >
              Reject optional
            </button>
          </div>

          <div className="cookie-policy-link">
            <Link href="/cookie-policy">Read the Cookie Policy</Link>
            <Link href="/privacy-policy">Read the Privacy Policy</Link>
          </div>

          <div className="cookie-category-list">
            <section className="cookie-category">
              <div className="cookie-category-head">
                <div>
                  <h3>Necessary cookies</h3>
                  <span className="cookie-status is-required">Always on</span>
                </div>
              </div>
              <p>
                These support security, accessibility, network management, and storage of your consent choice. They
                are required for the site to function properly.
              </p>
            </section>

            <section className="cookie-category">
              <div className="cookie-category-head">
                <div>
                  <h3>Analytics cookies</h3>
                  <span className="cookie-status">Optional</span>
                </div>
                <button
                  className={`cookie-toggle${preferences.analytics ? " is-on" : ""}`}
                  type="button"
                  onClick={() => togglePreference("analytics")}
                  aria-pressed={preferences.analytics}
                >
                  <span />
                  {preferences.analytics ? "On" : "Off"}
                </button>
              </div>
              <p>
                These would support tools such as Google Analytics, but they must remain blocked until you explicitly
                allow them.
              </p>
            </section>

            <section className="cookie-category">
              <div className="cookie-category-head">
                <div>
                  <h3>External media</h3>
                  <span className="cookie-status">Optional</span>
                </div>
                <button
                  className={`cookie-toggle${preferences.externalMedia ? " is-on" : ""}`}
                  type="button"
                  onClick={() => togglePreference("externalMedia")}
                  aria-pressed={preferences.externalMedia}
                >
                  <span />
                  {preferences.externalMedia ? "On" : "Off"}
                </button>
              </div>
              <p>
                This allows embedded Google Maps, YouTube, and similar third-party media. Direct external links remain
                available when this category is off.
              </p>
            </section>
          </div>

          <div className="cookie-footer">
            <p>{optionalSummary}</p>
            <button className="button button-primary" type="button" onClick={() => applyConsent(preferences)}>
              Save and close
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
