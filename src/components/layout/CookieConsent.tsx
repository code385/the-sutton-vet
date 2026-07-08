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
    }

    setIsOpen(true);

    function handleOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, handleOpenRequest);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, handleOpenRequest);
  }, []);

  const optionalSummary = useMemo(() => {
    const enabled = Object.entries(preferences)
      .filter(([key, value]) => key !== "necessary" && value)
      .map(([key]) => key);

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

  function togglePreference(key: "preferences" | "analytics" | "marketing") {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  const canDismiss = hasSavedChoice;

  return (
    <>
      <button className="cookie-fab" type="button" onClick={() => setIsOpen(true)} aria-label="Manage cookie settings">
        Cookie Settings
      </button>

      {isOpen ? <div className="cookie-backdrop" aria-hidden="true" onClick={() => (canDismiss ? setIsOpen(false) : undefined)} /> : null}

      <aside className={`cookie-drawer${isOpen ? " is-open" : ""}`} aria-label="Cookie consent panel">
        <div className="cookie-drawer-scroll">
          <div className="cookie-drawer-header">
            <p className="eyebrow">Cookie Consent</p>
            <h2>Privacy choices should be clear, balanced, and easy to change.</h2>
            <p>
              We use necessary technologies to keep the site secure and accessible. Optional analytics, marketing, and
              embedded media stay blocked until you choose to allow them.
            </p>
            <p>
              Under the project scope, <strong>Accept</strong> and <strong>Reject</strong> must be presented with equal
              prominence, and no optional category should be pre-enabled.
            </p>
            {!hasSavedChoice ? <p className="cookie-required-note">A choice is required before optional technologies can load.</p> : null}
          </div>

          <div className="cookie-actions">
            <button
              className="button button-primary cookie-action-button"
              type="button"
              onClick={() =>
                applyConsent({
                  necessary: true,
                  preferences: true,
                  analytics: true,
                  marketing: true,
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
                  preferences: false,
                  analytics: false,
                  marketing: false,
                })
              }
            >
              Reject all
            </button>
          </div>

          <div className="cookie-policy-link">
            <Link href="/cookie-policy">Read the Cookie Policy</Link>
            <Link href="/privacy-policy">Read the Privacy Policy</Link>
            <Link href="/accessibility">Read the Accessibility Statement</Link>
            <Link href="/terms">Read the Terms of Business</Link>
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
                  <h3>Preference cookies</h3>
                  <span className="cookie-status">Optional</span>
                </div>
                <button
                  className={`cookie-toggle${preferences.preferences ? " is-on" : ""}`}
                  type="button"
                  onClick={() => togglePreference("preferences")}
                  aria-pressed={preferences.preferences}
                >
                  <span />
                  {preferences.preferences ? "On" : "Off"}
                </button>
              </div>
              <p>These remember optional interface choices and similar convenience settings for returning visitors.</p>
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
                  <h3>Marketing and embedded media</h3>
                  <span className="cookie-status">Optional</span>
                </div>
                <button
                  className={`cookie-toggle${preferences.marketing ? " is-on" : ""}`}
                  type="button"
                  onClick={() => togglePreference("marketing")}
                  aria-pressed={preferences.marketing}
                >
                  <span />
                  {preferences.marketing ? "On" : "Off"}
                </button>
              </div>
              <p>
                This category covers marketing pixels plus social or video embeds that may place tracking technologies.
                They stay off until you opt in.
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
