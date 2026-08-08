"use client";

import Link from "next/link";
import { homeHeroStats, siteConfig } from "@/lib/site";
import { visualAssets } from "@/lib/visualAssets";

type HomeHeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  practicalNote?: string;
  imageUrl?: string;
  videoUrl?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  stats?: string[];
  links?: { label?: string; href?: string }[];
  registerHref?: string;
  bookHref?: string;
};

const fallbackHeroImage = visualAssets.gingerSpanielHero;

export function HomeHero({
  eyebrow,
  title,
  description,
  practicalNote,
  imageUrl,
  videoUrl,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  stats,
  links,
  registerHref,
  bookHref,
}: HomeHeroProps) {
  const heroLinks = links?.filter((item) => item.label && item.href) || [];
  const heroStats = stats?.filter(Boolean).length ? stats.filter(Boolean) : homeHeroStats;


  return (
    <section className="home-hero full-bleed-section">
      <div className="home-hero-shell">
        <div className="home-hero-media">
          <div
            className="home-hero-image-layer"
            style={{ backgroundImage: `url(${imageUrl || fallbackHeroImage})` }}
          />

          <div className="home-hero-overlay" />
        </div>

        <div className="shell home-hero-content">
          <p className="eyebrow">{eyebrow || "Independent Veterinary Care In Sutton"}</p>
          <h1>{title || "You'll always want calm, capable care close by. We make that decision feel easier."}</h1>
          <p className="home-hero-copy">
            {description ||
              "Founder-led veterinary care with a more personal experience, clear next steps, and a smoother route into registration, booking, and urgent support."}
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href={primaryCtaHref || registerHref || siteConfig.ctas.register}>
              {primaryCtaLabel || "Register Now"}
            </a>
            <a className="button button-muted hero-button-light" href={secondaryCtaHref || bookHref || siteConfig.ctas.book}>
              {secondaryCtaLabel || "Book Online"}
            </a>
          </div>

          <div className="hero-stat-row">
            {heroStats.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="home-hero-bar">
        <div className="shell home-hero-bar-shell">
          <p>
            {practicalNote ||
              "Near Hackbridge station, with practical parking guidance surfaced early so first visits feel easier from the start."}
          </p>
          <div className="home-hero-links">
            {(heroLinks.length
              ? heroLinks
              : [
                  { label: "Services", href: "/services" },
                  { label: "Pricing", href: "/fees" },
                  { label: "Health Plan", href: "/health-plan" },
                ]
            ).map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href || "/"}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
