"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { homeHeroStats, siteConfig } from "@/lib/site";

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

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80";

const fallbackHeroVideo = "/hero-demo.mp4";

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
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(videoUrl || fallbackHeroVideo);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroLinks = links?.filter((item) => item.label && item.href) || [];
  const heroStats = stats?.filter(Boolean).length ? stats.filter(Boolean) : homeHeroStats;

  useEffect(() => {
    setCurrentVideoSrc(videoUrl || fallbackHeroVideo);
  }, [videoUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowVideo(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showVideo || !videoRef.current) {
      return;
    }

    void videoRef.current.play().catch(() => {
      if (currentVideoSrc !== fallbackHeroVideo) {
        setCurrentVideoSrc(fallbackHeroVideo);
      }
    });
  }, [showVideo, currentVideoSrc]);

  return (
    <section className="home-hero full-bleed-section">
      <div className="home-hero-shell">
        <div className="home-hero-media">
          <div
            className={`home-hero-image-layer${showVideo ? " is-hidden" : ""}`}
            style={{ backgroundImage: `url(${imageUrl || fallbackHeroImage})` }}
          />
          <video
            ref={videoRef}
            className={`home-hero-video${showVideo ? " is-visible" : ""}`}
            src={currentVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={imageUrl || fallbackHeroImage}
            aria-hidden="true"
            onError={() => {
              if (currentVideoSrc !== fallbackHeroVideo) {
                setCurrentVideoSrc(fallbackHeroVideo);
              }
            }}
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
                  { label: "First Visit", href: "/first-visit" },
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
