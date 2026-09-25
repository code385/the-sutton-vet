import Link from "next/link";

import { SectionCta } from "@/components/shared/SectionCta";
import { Reveal } from "@/components/shared/Reveal";
import { masterServiceGroups } from "@/lib/servicesSeed";
import { getFeeCategories, getPricingPageDocument } from "@/sanity/lib/pricing";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const fallbackQuoteSections = masterServiceGroups.map((group, index) => ({
  id: group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  number: String(index + 1).padStart(2, "0"),
  title: group.title,
  description: group.description,
  items: group.items.map((label) => ({ label, price: "Quote" })),
}));

const heroStats = [
  { label: "services", value: "Listed" },
  { label: "prices", value: "To follow" },
  { label: "quotes", value: "Ask us" },
];

export default async function FeesPage() {
  const [siteSettingsDocument, pricingPage, feeCategories] = await Promise.all([getSiteSettingsDocument(), getPricingPageDocument(), getFeeCategories()]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const quoteSections = feeCategories.length ? feeCategories.map((group, index) => ({
    id: (group._id || group.title || String(index)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    number: String(index + 1).padStart(2, "0"),
    title: group.title || "Service area",
    description: group.description || "Contact the team for current pricing.",
    items: group.items?.filter((item) => item.label) || [],
  })) : fallbackQuoteSections;

  return (
    <>
      <section className="pricing-v3-hero full-bleed-section">
        <div className="shell pricing-v3-hero-shell">
          <Reveal variant="left">
            <div className="pricing-v3-hero-copy">
              <p className="eyebrow">{pricingPage?.eyebrow || "Pricing"}</p>
              <h1>{pricingPage?.title || "Service list first. Prices added clearly when ready."}</h1>
              <p>{pricingPage?.description || "The Sutton Vet is starting with a clear list of services. Prices can be added later, or the team can provide a quote where assessment is needed."}</p>
              <div className="pricing-v3-actions">
                <Link className="button button-primary" href={siteSettings.ctas.book}>Book Online</Link>
                <Link className="button button-muted" href="/contact">Ask for a Quote</Link>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delayMs={80}>
            <div className="pricing-v3-showpiece" aria-label="Service and quote guide">
              <div className="pricing-v3-pet-card">
                <img src="/pricing-vet-ginger-pets.png" alt="Veterinarian with a ginger cat and ginger dog" />
                <span>Clear service guide</span>
              </div>
              {heroStats.map((item, index) => (
                <div key={item.label} className={`pricing-v3-float-ticket ticket-${index + 1}`}>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell pricing-v3-intro">
        <Reveal variant="up">
          <div className="pricing-v3-intro-copy">
            <p className="eyebrow">{pricingPage?.promiseEyebrow || "How to read this page"}</p>
            <h2>{pricingPage?.promiseTitle || "Browse the service, then ask for the right estimate."}</h2>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={80}>
          <p>{pricingPage?.promiseDescription || "Pricing is being finalised. Until then, services are listed clearly and quote-led procedures can be discussed before booking."}</p>
        </Reveal>
      </section>

      <nav className="shell pricing-v3-route-map" aria-label="Service price categories">
        {quoteSections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            <span>{section.number}</span>
            {section.title}
          </a>
        ))}
      </nav>

      <section className="shell pricing-v3-sections pricing-quote-sections">
        {quoteSections.map((section) => (
          <Reveal key={section.id} variant="up">
            <article className="pricing-v3-panel pricing-quote-panel" id={section.id}>
              <div className="pricing-v3-panel-intro">
                <span className="pricing-v3-number">{section.number}</span>
                <p className="eyebrow">Service Area</p>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <Link className="pricing-v3-mini-link" href="/contact">Call for quote</Link>
              </div>

              <div className="pricing-quote-list" aria-label={`${section.title} services`}>
                {section.items.map((item) => (
                  <Link key={item.label} href="/contact" className="pricing-quote-item">
                    <span>{item.label}</span>
                    <strong>{item.price || "Quote"}</strong>
                  </Link>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="shell pricing-v3-health-band">
        <div>
          <p className="eyebrow">{pricingPage?.healthPlanEyebrow || "Health Plan"}</p>
          <h2>{pricingPage?.healthPlanTitle || "Health plan pricing is being finalised."}</h2>
        </div>
        <p>{pricingPage?.healthPlanDescription || "The plan page explains the intended support. Final monthly figures can be added once confirmed."}</p>
        <Link className="button button-primary" href="/health-plan">See Health Plan</Link>
      </section>

      <SectionCta
        eyebrow={pricingPage?.ctaEyebrow || "Next Step"}
        title={pricingPage?.ctaTitle || "Need a price or care estimate?"}
        text={pricingPage?.ctaText || "Tell us what your pet needs and we will guide you to the right appointment or quote."}
        primaryLabel={pricingPage?.ctaPrimaryLabel || "Book Online"}
        primaryHref={pricingPage?.ctaPrimaryHref || siteSettings.ctas.book}
        secondaryLabel={pricingPage?.ctaSecondaryLabel || "Contact Us"}
        secondaryHref={pricingPage?.ctaSecondaryHref || "/contact"}
      />
    </>
  );
}
