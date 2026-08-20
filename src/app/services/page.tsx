import { Reveal } from "@/components/shared/Reveal";
import { visualAssets } from "@/lib/visualAssets";
import { SectionCta } from "@/components/shared/SectionCta";
import { masterServiceGroups, servicesPageSeed } from "@/lib/servicesSeed";
import { resolveServiceCollection } from "@/lib/resolveServices";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import { getServiceDocuments, getServicesPageDocument, portableTextToParagraphs } from "@/sanity/lib/services";

const fallbackServiceImage = visualAssets.gingerSpanielHero;
const visibleServiceCount = 9;

function directoryAnchor(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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
      const imageUrl = ("image" in service ? service.image?.asset?.url : undefined) || service.imageUrl || fallbackServiceImage;
      const slug = service.slug?.current || "";
      const title = service.title || "";
      const eyebrow = service.eyebrow || "";
      const isReferral = slug.includes("referral") || title.toLowerCase().includes("referral") || eyebrow.toLowerCase().includes("referral");

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
      <section className="services-page-hero services-page-hero-v2 full-bleed-section">
        <Reveal variant="up" className="services-page-hero-reveal">
          <div className="services-page-banner">
            <div className="shell services-page-banner-shell">
              <div className="services-page-hero-copy-v2">
                <p className="eyebrow">Our Services</p>
                <h1>Services with clear next steps.</h1>
                <p className="services-page-banner-copy">
                  Browse care areas first, then open the detail page when you need more.
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

              <div className="services-page-hero-index" aria-label="Service groups">
                <span>Start with a group</span>
                {masterServiceGroups.slice(0, 6).map((group) => (
                  <a key={group.title} href={`#${directoryAnchor(group.title)}`}>
                    {group.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell services-master-list services-master-list-v2">
        <Reveal variant="up">
          <div className="services-master-heading">
            <p className="eyebrow">Service Directory</p>
            <h2>Choose a care area, then scan what is included.</h2>
            <p>
              A simpler directory for the services supplied. Prices can be added later, or quoted where assessment affects the final cost.
            </p>
          </div>
        </Reveal>

        <div className="services-master-flow">
          {masterServiceGroups.map((group, index) => (
            <Reveal key={group.title} variant="up" delayMs={index * 35}>
              <article className="services-master-flow-group" id={directoryAnchor(group.title)}>
                <div className="services-master-flow-title">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{group.title}</h3>
                </div>
                <p>{group.description}</p>
                <div className="services-master-flow-links">
                  {group.items.slice(0, 6).map((item) => (
                    <a key={item} href="/contact" aria-label={`Ask about ${item}`}>
                      {item}
                    </a>
                  ))}
                  {group.items.length > 6 ? (
                    <details className="services-master-more">
                      <summary>Show full list</summary>
                      <div>
                        {group.items.slice(6).map((item) => (
                          <a key={item} href="/contact" aria-label={`Ask about ${item}`}>
                            {item}
                          </a>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell services-page-intro services-page-intro-minimal">
        <Reveal variant="up">
          <div className="services-page-intro-card">
            <div className="services-page-intro-copy">
              <p className="eyebrow">How to use this page</p>
              <h2>Start simple. Ask when a quote is needed.</h2>
              <p>
                Referral-only routes stay clearly marked. Procedure costs can be confirmed after assessment.
              </p>
            </div>

            <div className="services-page-intro-points">
              <article>
                <strong>Easy to scan</strong>
                <p>Groups first, detail pages second.</p>
              </article>
              <article>
                <strong>Referral clarity</strong>
                <p>Soft tissue, orthopaedic, and endoscopy routes stay clear.</p>
              </article>
              <article>
                <strong>Quote where needed</strong>
                <p>Clinical assessment can shape the final estimate.</p>
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

        <input className="services-more-toggle" type="checkbox" id="services-more-toggle" />
        <div className="services-card-grid services-card-grid-image-led services-card-grid-collapsible">
          {serviceCards.map((service, index) => (
            <Reveal key={service.id} variant="up" delayMs={Math.min(index, visibleServiceCount - 1) * 35} className={index >= visibleServiceCount ? "service-card-extra" : undefined}>
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
        {serviceCards.length > visibleServiceCount ? (
          <label className="services-see-more" htmlFor="services-more-toggle">
            <span className="services-see-more-open">See more services</span>
            <span className="services-see-more-close">Show fewer services</span>
            <b aria-hidden="true">+</b>
          </label>
        ) : null}
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