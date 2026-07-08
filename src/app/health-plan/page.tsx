import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { healthPlanPageSeed } from "@/lib/healthPlanSeed";
import { getHealthPlanPageDocument } from "@/sanity/lib/healthPlan";

type GlyphProps = {
  name?: string;
};

function HealthPlanGlyph({ name }: GlyphProps) {
  switch (name) {
    case "dog":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M18 40c0-8 6-14 14-14h10c4 0 7-1 10-4l3 4-3 6v8c0 6-4 10-10 10H28c-6 0-10-4-10-10Z" />
          <path d="M24 24l-4-5M49 23l4 2M22 50v5M42 50v5" />
        </svg>
      );
    case "cat":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M22 25 28 16l6 7 6-7 6 9v15c0 7-5 12-12 12h-4c-8 0-14-6-14-14Z" />
          <path d="M23 35 15 37M41 35l8 2M25 52v4M41 52v4" />
        </svg>
      );
    case "syringe":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="m42 15 7 7M19 45l17-17M15 49l8-8M23 13h9v7h-9zM38 30l8 8-5 5-8-8z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 11c7 5 15 7 20 8v13c0 12-8 20-20 25C20 52 12 44 12 32V19c5-1 13-3 20-8Z" />
          <path d="m24 33 6 6 11-13" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M21 14v12c0 6 5 11 11 11s11-5 11-11V14M17 14h8M39 14h8M43 37v6c0 6-5 11-11 11s-11-5-11-11v-3" />
          <circle cx="49" cy="37" r="5" />
        </svg>
      );
    case "chip":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="16" y="20" width="32" height="24" rx="6" />
          <path d="M24 20v-5M32 20v-5M40 20v-5M24 49v-5M32 49v-5M40 49v-5M16 28h-5M16 36h-5M53 28h-5M53 36h-5" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 15 38 19l7-1 1 7 4 7-4 7-1 7-7-1-6 4-6-4-7 1-1-7-4-7 4-7 1-7 7 1 6-4Z" />
          <path d="m26 33 4 4 8-10" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="20" />
          <path d="M32 22v20M22 32h20" />
        </svg>
      );
  }
}

export default async function HealthPlanPage() {
  const healthPlanPage = await getHealthPlanPageDocument();
  const page = healthPlanPage || healthPlanPageSeed;

  const planTiers = page.planTiers?.filter((item) => item.species && item.summary && item.pricingStructure) || healthPlanPageSeed.planTiers;
  const benefitCards = page.benefitCards?.filter((item) => item.title && item.description) || healthPlanPageSeed.benefitCards;
  const pricingCards = page.pricingCards?.filter((item) => item.title && item.priceSummary) || healthPlanPageSeed.pricingCards;
  const faqItems = page.faqItems?.filter((item) => item.question && item.answer) || healthPlanPageSeed.faqItems;

  return (
    <>
      <section
        className="health-plan-hero full-bleed-section"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 24, 37, 0.72), rgba(15, 24, 37, 0.36)), url(${page.heroImageUrl || healthPlanPageSeed.heroImageUrl})` }}
      >
        <div className="shell health-plan-hero-shell">
          <Reveal variant="left">
            <div className="health-plan-hero-copy">
              <p className="eyebrow">{page.eyebrow || healthPlanPageSeed.eyebrow}</p>
              <h1>{page.title || healthPlanPageSeed.title}</h1>
              <p>{page.description || healthPlanPageSeed.description}</p>
              <div className="cta-actions">
                <a className="button button-primary" href={page.heroPrimaryCtaHref || healthPlanPageSeed.heroPrimaryCtaHref}>
                  {page.heroPrimaryCtaLabel || healthPlanPageSeed.heroPrimaryCtaLabel}
                </a>
                <Link className="button button-muted" href={page.heroSecondaryCtaHref || healthPlanPageSeed.heroSecondaryCtaHref}>
                  {page.heroSecondaryCtaLabel || healthPlanPageSeed.heroSecondaryCtaLabel}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="health-plan-intro section-surface">
        <div className="shell narrow-section">
          <Reveal variant="up">
            <div className="section-heading section-heading-center">
              <p className="eyebrow">{page.introEyebrow || healthPlanPageSeed.introEyebrow}</p>
              <h2>{page.introTitle || healthPlanPageSeed.introTitle}</h2>
              <p className="section-intro-copy">{page.introDescription || healthPlanPageSeed.introDescription}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="health-plan-feature full-bleed-section">
        <Reveal variant="mask">
          <article
            className="health-plan-feature-banner"
            style={{ backgroundImage: `url(${page.featureImageUrl || healthPlanPageSeed.featureImageUrl})` }}
          >
            <div className="health-plan-feature-overlay" />
            <div className="shell health-plan-feature-shell">
              <div className="health-plan-feature-content">
                <p className="eyebrow">{page.featureEyebrow || healthPlanPageSeed.featureEyebrow}</p>
                <h2>{page.featureTitle || healthPlanPageSeed.featureTitle}</h2>
                <p>{page.featureDescription || healthPlanPageSeed.featureDescription}</p>
              </div>
              <a className="button button-primary health-plan-feature-cta" href={page.featureCtaHref || healthPlanPageSeed.featureCtaHref}>
                {page.featureCtaLabel || healthPlanPageSeed.featureCtaLabel}
              </a>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="health-plan-tier-section section-surface">
        <div className="shell">
          <div className="health-plan-tier-grid">
            {planTiers.map((tier, index) => (
              <Reveal key={`${tier.species}-${index}`} variant={index % 2 === 0 ? "left" : "right"} delayMs={index * 60}>
                <article className="health-plan-tier-card">
                  <div className="health-plan-icon-wrap">
                    <HealthPlanGlyph name={tier.iconKey} />
                  </div>
                  <div className="health-plan-tier-header">
                    <h3>{tier.species}</h3>
                    <span>{tier.pricingStructure}</span>
                  </div>
                  <p>{tier.summary}</p>
                  <ul className="health-plan-checklist">
                    {(tier.includedBenefits || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="health-plan-benefits shell">
        <Reveal variant="up">
          <div className="section-heading section-heading-center">
            <p className="eyebrow">{page.benefitsEyebrow || healthPlanPageSeed.benefitsEyebrow}</p>
            <h2>{page.benefitsTitle || healthPlanPageSeed.benefitsTitle}</h2>
            <p className="section-intro-copy">{page.benefitsDescription || healthPlanPageSeed.benefitsDescription}</p>
          </div>
        </Reveal>

        <div className="health-plan-benefit-grid">
          {benefitCards.map((item, index) => (
            <Reveal key={`${item.title}-${index}`} variant="up" delayMs={index * 45}>
              <article className="health-plan-benefit-card">
                <div className="health-plan-icon-wrap is-small">
                  <HealthPlanGlyph name={item.iconKey} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="health-plan-pricing section-surface">
        <div className="shell">
          <Reveal variant="up">
            <div className="section-heading section-heading-center">
              <p className="eyebrow">{page.pricingEyebrow || healthPlanPageSeed.pricingEyebrow}</p>
              <h2>{page.pricingTitle || healthPlanPageSeed.pricingTitle}</h2>
              <p className="section-intro-copy">{page.pricingDescription || healthPlanPageSeed.pricingDescription}</p>
            </div>
          </Reveal>

          <div className="health-plan-pricing-grid">
            {pricingCards.map((item, index) => (
              <Reveal key={`${item.title}-${index}`} variant={index % 2 === 0 ? "left" : "right"} delayMs={index * 50}>
                <article className="health-plan-pricing-card">
                  <div className="health-plan-pricing-top">
                    <div className="health-plan-icon-wrap is-small">
                      <HealthPlanGlyph name={item.iconKey} />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <span>{item.priceSummary}</span>
                    </div>
                  </div>
                  <p>{item.supportingText}</p>
                  <ul className="health-plan-pricing-lines">
                    {(item.lines || []).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="health-plan-faq shell">
        <Reveal variant="up">
          <div className="section-heading section-heading-center">
            <p className="eyebrow">{page.faqEyebrow || healthPlanPageSeed.faqEyebrow}</p>
            <h2>Plan FAQs</h2>
          </div>
        </Reveal>

        <div className="health-plan-faq-list">
          {faqItems.map((item, index) => (
            <Reveal key={`${item.question}-${index}`} variant="up" delayMs={index * 40}>
              <details className="health-plan-faq-item">
                <summary>
                  <span>{item.question}</span>
                  <span className="health-plan-faq-marker" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell">
        <Reveal variant="mask">
          <div
            className="health-plan-cta-panel"
            style={{ backgroundImage: `linear-gradient(90deg, rgba(17, 25, 39, 0.76), rgba(17, 25, 39, 0.46)), url(${page.ctaImageUrl || healthPlanPageSeed.ctaImageUrl})` }}
          >
            <div className="health-plan-cta-copy">
              <p className="eyebrow">{page.ctaEyebrow || healthPlanPageSeed.ctaEyebrow}</p>
              <h2>{page.ctaTitle || healthPlanPageSeed.ctaTitle}</h2>
              <p>{page.ctaText || healthPlanPageSeed.ctaText}</p>
            </div>
            <div className="cta-actions">
              <a className="button button-primary" href={page.ctaPrimaryHref || healthPlanPageSeed.ctaPrimaryHref}>
                {page.ctaPrimaryLabel || healthPlanPageSeed.ctaPrimaryLabel}
              </a>
              <Link className="button button-muted" href={page.ctaSecondaryHref || healthPlanPageSeed.ctaSecondaryHref}>
                {page.ctaSecondaryLabel || healthPlanPageSeed.ctaSecondaryLabel}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
