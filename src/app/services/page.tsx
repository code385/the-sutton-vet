import { Reveal } from "@/components/shared/Reveal";
import { visualAssets } from "@/lib/visualAssets";
import { SectionCta } from "@/components/shared/SectionCta";
import { masterServiceGroups, servicesPageSeed } from "@/lib/servicesSeed";
import { resolveServiceCollection } from "@/lib/resolveServices";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import { getServiceDocuments, getServicesPageDocument, portableTextToParagraphs } from "@/sanity/lib/services";

const fallbackServiceImage = visualAssets.gingerSpanielHero;

export default async function ServicesPage() {
  const [servicesPage, services, siteSettingsDocument] = await Promise.all([
    getServicesPageDocument(),
    getServiceDocuments(),
    getSiteSettingsDocument(),
  ]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const resolvedServicesPage = servicesPage || servicesPageSeed;
  const primaryCtaHref = resolvedServicesPage.primaryCtaHref === "/contact#book" ? siteSettings.ctas.book : resolvedServicesPage.primaryCtaHref || siteSettings.ctas.book;
  const secondaryCtaHref = resolvedServicesPage.secondaryCtaHref === "/contact#register" ? siteSettings.ctas.register : resolvedServicesPage.secondaryCtaHref || siteSettings.ctas.register;
  const closingPrimaryHref = resolvedServicesPage.closingPrimaryHref === "/contact#book" ? siteSettings.ctas.book : resolvedServicesPage.closingPrimaryHref || siteSettings.ctas.book;
  const closingSecondaryHref = resolvedServicesPage.closingSecondaryHref === "/contact#register" ? siteSettings.ctas.register : resolvedServicesPage.closingSecondaryHref || siteSettings.ctas.register;
  const resolvedServices = resolveServiceCollection(services);

  const serviceCards = resolvedServices
    .map((service) => {
      const paragraphs = portableTextToParagraphs(service.content);
      const detailParagraphs = paragraphs.length ? paragraphs : service.shortDescription ? [service.shortDescription] : [];
      const imageUrl =
        ("image" in service ? service.image?.asset?.url : undefined) || service.imageUrl || fallbackServiceImage;
      const slug = service.slug?.current || "";
      const title = service.title || "";
      const eyebrow = service.eyebrow || "";
      const isReferral =
        slug.includes("referral") || title.toLowerCase().includes("referral") || eyebrow.toLowerCase().includes("referral");

      return {
        id: service._id,
        eyebrow: isReferral ? "Referral only" : "Clinical service",
        title,
        shortDescription: service.shortDescription,
        lead: service.lead,
        detailParagraphs,
        imageUrl,
        alt: service.alt || title,
        ctaHref: slug ? `/services/${slug}` : siteSettings.ctas.book,
        ctaLabel: "View details",
        isReferral,
      };
    })
    .sort((a, b) => {
      if (a.isReferral === b.isReferral) return 0;
      return a.isReferral ? 1 : -1;
    });

  return (
    <>
      <section className="services-page-hero full-bleed-section">
        <Reveal variant="up" className="services-page-hero-reveal">
          <div className="services-page-banner">
            <div className="shell services-page-banner-shell">
              <p className="eyebrow">Our Services</p>
              <h1>Care we offer</h1>
              <p className="services-page-banner-copy">
                A calm, practical guide to everyday appointments, diagnostics, procedures, and referral-only support.
              </p>
              <div className="services-page-banner-actions">
                <a className="button button-primary" href={primaryCtaHref}>
                  {resolvedServicesPage.primaryCtaLabel || "Book Online"}
                </a>
                <a className="button button-muted" href={secondaryCtaHref}>
                  {resolvedServicesPage.secondaryCtaLabel || "Register Now"}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell services-page-intro">
        <Reveal variant="up">
          <div className="services-page-intro-card">
            <div className="services-page-intro-copy">
              <p className="eyebrow">Service Overview</p>
              <h2>A clearer way to browse care, procedures, and referral support.</h2>
              <p>
                Start with the area of care, then open the detail page for next steps. Where a service is referral only, that is shown clearly without making the page feel complicated.
              </p>
            </div>

            <div className="services-page-intro-points">
              <article>
                <strong>Easy to scan</strong>
                <p>Short labels, clear routes, and simple next steps.</p>
              </article>
              <article>
                <strong>Referral clarity</strong>
                <p>Soft tissue, orthopaedic, and endoscopy referrals are marked clearly.</p>
              </article>
              <article>
                <strong>Quote where needed</strong>
                <p>Some procedures need an assessment before pricing is confirmed.</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell services-group">
        <Reveal variant="up">
          <div className="services-group-heading">
            <p className="eyebrow">Care We Offer</p>
            <h2>Services listed simply, with detail pages when you need more.</h2>
            <p>
              Browse the main service areas first. Prices can be added later, or the team can provide a quote where the cost depends on the patient and clinical findings.
            </p>
          </div>
        </Reveal>

        <div className="services-card-grid services-card-grid-image-led">
          {serviceCards.map((service, index) => (
            <Reveal key={service.id} variant="up" delayMs={index * 35}>
              <a className={`service-card-v3${service.isReferral ? " service-card-v3-referral" : ""}`} href={service.ctaHref} aria-label={`${service.title} details`}>
                <div className="service-card-v3-media" style={{ backgroundImage: `url(${service.imageUrl})` }} aria-hidden="true">
                  <div className="service-card-v3-overlay">
                    <div className="service-card-v3-copy">
                      <span>{service.eyebrow}</span>
                      <h3>{service.title}</h3>
                      <strong>{service.ctaLabel}</strong>
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell services-master-list">
        <Reveal variant="up">
          <div className="services-master-heading">
            <p className="eyebrow">Full Service Directory</p>
            <h2>Full service list, grouped without clutter.</h2>
            <p>
              This directory keeps the wider service list visible while pricing is being finalised. Owners can ask for a quote where assessment, patient size, or clinical findings affect the final cost.
            </p>
          </div>
        </Reveal>

        <div className="services-master-grid">
          {masterServiceGroups.map((group, index) => (
            <Reveal key={group.title} variant="up" delayMs={index * 35}>
              <article className="services-master-group">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <div className="services-master-chips">
                  {group.items.map((item) => (
                    <a key={item} href="/contact" aria-label={`Ask about ${item}`}>
                      {item}
                    </a>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <SectionCta
        eyebrow={resolvedServicesPage.closingEyebrow || "Next Step"}
        title={resolvedServicesPage.closingTitle || "Need something specific?"}
        text={resolvedServicesPage.closingText || "Move from information to booking with less friction."}
        primaryLabel={resolvedServicesPage.closingPrimaryLabel}
        primaryHref={closingPrimaryHref}
        secondaryLabel={resolvedServicesPage.closingSecondaryLabel}
        secondaryHref={closingSecondaryHref}
      />
    </>
  );
}




