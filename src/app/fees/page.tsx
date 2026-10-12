import Link from "next/link";

import { SectionCta } from "@/components/shared/SectionCta";
import { Reveal } from "@/components/shared/Reveal";
import { getFeePrice } from "@/lib/feePrice";
import { masterServiceGroups } from "@/lib/servicesSeed";
import { getFeeCategories, getPricingPageDocument } from "@/sanity/lib/pricing";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const fallbackQuoteSections = masterServiceGroups.map((group, index) => ({
  id: group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  number: String(index + 1).padStart(2, "0"),
  title: group.title,
  description: group.description,
  items: group.items.map((label) => ({ label, price: "Quote", note: "" })),
}));

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
  const hasPrices = quoteSections.some((section) => section.items.some((item) => getFeePrice(item.price) !== null));
  const heroStats = [
    { label: "services", value: "Listed" },
    { label: "prices", value: hasPrices ? "Published" : "On request" },
    { label: "estimates", value: "Ask us" },
  ];

  return (
    <>
      <section className="pricing-v3-hero full-bleed-section">
        <div className="shell pricing-v3-hero-shell">
          <Reveal variant="left">
            <div className="pricing-v3-hero-copy">
              <p className="eyebrow">{pricingPage?.eyebrow || "Pricing"}</p>
              <h1>{pricingPage?.title || "Clear prices for your pet's care."}</h1>
              <p>{pricingPage?.description || "Browse our service prices below. Where treatment needs an individual assessment, contact the team for a personalised quote."}</p>
              <div className="pricing-v3-actions">
                <Link className="button button-primary" href={siteSettings.ctas.book}>Book Online</Link>
                <Link className="button button-muted" href="/contact">Ask for a Quote</Link>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delayMs={80}>
            <div className="pricing-v3-showpiece" aria-label="Service pricing guide">
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
            <h2>{pricingPage?.promiseTitle || "Published prices, with individual estimates where needed."}</h2>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={80}>
          <p>{pricingPage?.promiseDescription || "Confirmed prices appear alongside each service. A Quote link means the team will discuss your pet's needs before providing an estimate."}</p>
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
                {section.items.some((item) => getFeePrice(item.price) === null) ? (
                  <Link className="pricing-v3-mini-link" href="/contact">Ask about services without a listed price</Link>
                ) : null}
              </div>

              <div className="pricing-quote-list" aria-label={`${section.title} services`}>
                {section.items.map((item, index) => {
                  const price = getFeePrice(item.price);
                  const content = (
                    <>
                      <span className="pricing-fee-copy">
                        <span>{item.label}</span>
                        {item.note?.trim() ? <small>{item.note}</small> : null}
                      </span>
                      <strong>{price ?? "Quote"}</strong>
                    </>
                  );
                  return price !== null ? (
                    <div key={`${item.label}-${index}`} className="pricing-quote-item pricing-fee-priced">
                      {content}
                    </div>
                  ) : (
                    <Link key={`${item.label}-${index}`} href="/contact" className="pricing-quote-item" aria-label={`Request a quote for ${item.label}`}>
                      {content}
                    </Link>
                  );
                })}
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
