import Link from "next/link";

import { PricingCalculator } from "@/components/fees/PricingCalculator";
import { SectionCta } from "@/components/shared/SectionCta";
import { Reveal } from "@/components/shared/Reveal";
import { feeCategorySeeds, pricingPageSeed } from "@/lib/pricingSeed";
import { getFeeCategories, getPricingPageDocument } from "@/sanity/lib/pricing";

export default async function FeesPage() {
  const [pricingPage, feeCategories] = await Promise.all([getPricingPageDocument(), getFeeCategories()]);
  const page = pricingPage || pricingPageSeed;
  const categories = feeCategories.length ? feeCategories : feeCategorySeeds;
  const calculatorEntries = page.calculatorEntries?.length ? page.calculatorEntries : pricingPageSeed.calculatorEntries;

  return (
    <>
      <section
        className="pricing-page-hero full-bleed-section"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(18, 28, 42, 0.78), rgba(18, 28, 42, 0.34)), url(${page.heroImageUrl || pricingPageSeed.heroImageUrl})`,
        }}
      >
        <div className="shell pricing-page-hero-shell">
          <Reveal variant="left">
            <div className="pricing-page-hero-copy">
              <p className="eyebrow">{page.eyebrow || pricingPageSeed.eyebrow}</p>
              <h1>{page.title || pricingPageSeed.title}</h1>
              <p>{page.description || pricingPageSeed.description}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pricing-promise section-surface">
        <div className="shell narrow-section">
          <Reveal variant="up">
            <div className="section-heading section-heading-center">
              <p className="eyebrow">{page.promiseEyebrow || pricingPageSeed.promiseEyebrow}</p>
              <h2>{page.promiseTitle || pricingPageSeed.promiseTitle}</h2>
              <p className="section-intro-copy">{page.promiseDescription || pricingPageSeed.promiseDescription}</p>
              <p className="section-intro-copy">{page.promiseSecondary || pricingPageSeed.promiseSecondary}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell pricing-plan-teaser">
        <Reveal variant="left">
          <div className="pricing-plan-copy">
            <p className="eyebrow">{page.healthPlanEyebrow || pricingPageSeed.healthPlanEyebrow}</p>
            <h2>{page.healthPlanTitle || pricingPageSeed.healthPlanTitle}</h2>
            <p>{page.healthPlanDescription || pricingPageSeed.healthPlanDescription}</p>
            <Link className="button button-primary" href={page.healthPlanCtaHref || pricingPageSeed.healthPlanCtaHref}>
              {page.healthPlanCtaLabel || pricingPageSeed.healthPlanCtaLabel}
            </Link>
          </div>
        </Reveal>

        <Reveal variant="mask">
          <div
            className="pricing-plan-media"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(36, 52, 74, 0.12), rgba(36, 52, 74, 0.28)), url(${page.healthPlanImageUrl || pricingPageSeed.healthPlanImageUrl})`,
            }}
          />
        </Reveal>
      </section>

      <section className="shell pricing-category-grid">
        {categories.map((category, index) => (
          <Reveal key={category._id} variant={index % 2 === 0 ? "left" : "right"} delayMs={index * 40}>
            <article className="pricing-category-card">
              <div className="pricing-category-heading">
                {category.eyebrow ? <p className="eyebrow">{category.eyebrow}</p> : null}
                <h2>{category.title}</h2>
                {category.description ? <p>{category.description}</p> : null}
              </div>

              <div className="pricing-table-shell">
                <div className="pricing-table-header">
                  <span>Service</span>
                  <span>Price</span>
                </div>
                <div className="pricing-table-body">
                  {(category.items || []).map((item) => (
                    <article key={`${category._id}-${item.label}`} className="pricing-table-row">
                      <div>
                        <h3>{item.label}</h3>
                        {item.note ? <p>{item.note}</p> : null}
                      </div>
                      <strong>{item.price}</strong>
                    </article>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="pricing-calculator section-surface">
        <div className="shell">
          <div className="section-heading section-heading-center">
            <p className="eyebrow">{page.calculatorEyebrow || pricingPageSeed.calculatorEyebrow}</p>
            <h2>{page.calculatorTitle || pricingPageSeed.calculatorTitle}</h2>
            <p className="section-intro-copy">{page.calculatorDescription || pricingPageSeed.calculatorDescription}</p>
          </div>

          <PricingCalculator entries={calculatorEntries} />
        </div>
      </section>

      <SectionCta
        eyebrow={page.ctaEyebrow || pricingPageSeed.ctaEyebrow}
        title={page.ctaTitle || pricingPageSeed.ctaTitle}
        text={page.ctaText || pricingPageSeed.ctaText}
        primaryLabel={page.ctaPrimaryLabel || pricingPageSeed.ctaPrimaryLabel}
        primaryHref={page.ctaPrimaryHref || pricingPageSeed.ctaPrimaryHref}
        secondaryLabel={page.ctaSecondaryLabel || pricingPageSeed.ctaSecondaryLabel}
        secondaryHref={page.ctaSecondaryHref || pricingPageSeed.ctaSecondaryHref}
      />
    </>
  );
}
