"use client";

import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { healthPlanTiers, planBenefits } from "@/lib/site";

const healthPlanVideoUrl = "/hero-demo.mp4";
const healthPlanPosterUrl = "/hero-poster.jpg";

type HomeHealthPlanProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  secondaryText?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  videoUrl?: string;
  posterUrl?: string;
  cardEyebrow?: string;
  cardTitle?: string;
  tiers?: { title?: string; detail?: string; pricing?: string }[];
  benefits?: string[];
};

export function HomeHealthPlan({
  eyebrow,
  title,
  description,
  secondaryText,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  videoUrl,
  posterUrl,
  cardEyebrow,
  cardTitle,
  tiers,
  benefits,
}: HomeHealthPlanProps) {
  const healthPlanItems = tiers?.filter((item) => item.title && item.detail && item.pricing) || healthPlanTiers;
  const healthPlanBenefitItems = benefits?.filter(Boolean).length ? benefits.filter(Boolean) : planBenefits;

  return (
    <section className="home-health-plan full-bleed-section">
      <div className="shell home-health-plan-shell">
        <Reveal variant="left">
          <div className="home-health-plan-copy">
            <p className="eyebrow">{eyebrow || "Health Plan"}</p>
            <h2>{title || "Spread the cost of preventative care without making the page feel sales-led."}</h2>
            <p>{description || "The homepage teaser should explain practical value first: annual boosters, parasite treatment, routine health checks, and clearer monthly budgeting for cat and dog owners."}</p>
            <p>{secondaryText || "This section builds trust before asking for a deeper commitment, while still giving visitors a direct route into the dedicated Health Plan page and later the hardcoded Lupa sign-up workflow."}</p>

            <div className="home-health-plan-links">
              <Link className="button button-primary" href={primaryCtaHref || "/health-plan"}>
                {primaryCtaLabel || "Explore Health Plan"}
              </Link>
              <Link className="button button-muted" href={secondaryCtaHref || "/faq"}>
                {secondaryCtaLabel || "Read Common Questions"}
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="mask">
          <Link className="home-health-plan-visual" href={primaryCtaHref || "/health-plan"}>
            <div className="health-plan-card">
              <div className="health-plan-card-header">
                <p className="eyebrow">{cardEyebrow || "Plan Snapshot"}</p>
                <h3>{cardTitle || "Built for dogs and cats with clear pricing logic."}</h3>
              </div>

              <div className="health-plan-tier-list">
                {healthPlanItems.map((tier) => (
                  <article key={tier.title} className="health-plan-tier">
                    <h4>{tier.title}</h4>
                    <p>{tier.detail}</p>
                    <span>{tier.pricing}</span>
                  </article>
                ))}
              </div>

              <div className="health-plan-benefits">
                {healthPlanBenefitItems.map((item) => (
                  <div key={item} className="health-plan-benefit">
                    <span className="list-dot" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="health-plan-video-frame">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={posterUrl || healthPlanPosterUrl}
                aria-hidden="true"
              >
                <source src={videoUrl || healthPlanVideoUrl} type="video/mp4" />
              </video>
              <div className="health-plan-video-overlay" />
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
