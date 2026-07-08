"use client";

import { useEffect, useState } from "react";

import { Reveal } from "@/components/shared/Reveal";
import { COOKIE_CONSENT_UPDATED_EVENT, readCookieConsent, type CookiePreferences, defaultCookiePreferences } from "@/lib/cookie-consent";
import { siteConfig, socialPreviewCards } from "@/lib/site";

type SocialPreviewCard = {
  platform?: string;
  title?: string;
  caption?: string;
  image?: string;
};

type HomeSocialShowcaseProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  instagramLabel?: string;
  tikTokLabel?: string;
  cards?: SocialPreviewCard[];
  instagramHref?: string;
  tikTokHref?: string;
};

export function HomeSocialShowcase({
  eyebrow,
  title,
  description,
  instagramLabel,
  tikTokLabel,
  cards: socialCards,
  instagramHref,
  tikTokHref,
}: HomeSocialShowcaseProps) {
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

  if (!hasLoadedConsent || !preferences.marketing) {
    return null;
  }

  const previewCards = socialCards?.length ? socialCards : socialPreviewCards;
  const cards = [...previewCards, ...previewCards];

  return (
    <section className="home-social-showcase section-surface">
      <div className="home-social-heading">
        <Reveal variant="left">
          <div className="section-heading">
            <p className="eyebrow">{eyebrow || "Social Preview"}</p>
            <h2>{title || "Social updates"}</h2>
            <p className="section-intro-copy">
              {description || "A lighter, visual strip for Instagram and TikTok style content, with each card linking outward rather than loading heavy embeds into the homepage."}
            </p>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div className="home-social-actions">
            <a className="button button-primary" href={instagramHref || siteConfig.socials[1]?.href} target="_blank" rel="noreferrer">
              {instagramLabel || "Open Instagram"}
            </a>
            <a className="button button-muted" href={tikTokHref || siteConfig.socials[2]?.href} target="_blank" rel="noreferrer">
              {tikTokLabel || "Open TikTok"}
            </a>
          </div>
        </Reveal>
      </div>

      <div className="home-social-marquee" aria-label="Instagram and TikTok preview cards">
        <div className="home-social-track">
        {cards.map((card, index) => {
          const href = card.platform === "TikTok" ? tikTokHref || siteConfig.socials[2]?.href : instagramHref || siteConfig.socials[1]?.href;

          return (
            <Reveal key={`${card.platform}-${card.title}-${index}`} variant="up" delayMs={Math.min(index * 20, 160)}>
              <a
                className="home-social-card"
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(18, 28, 42, 0.06), rgba(18, 28, 42, 0.72)), url(${card.image})`,
                }}
              >
                <div className="home-social-card-top">
                  <span className="home-social-platform">{card.platform}</span>
                  <span className="home-social-play">Play</span>
                </div>

                <div className="home-social-card-copy">
                  <h3>{card.title}</h3>
                  <p>{card.caption}</p>
                  <span className="text-link">
                    {card.platform === "TikTok" ? "View TikTok" : "View Instagram"}
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
        </div>
      </div>
    </section>
  );
}
