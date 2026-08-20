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
      const isSpecialist = ["soft-tissue", "orthopaedic", "endoscopy"].some((term) => slug.includes(term));

      return {
        id: service._id,
        eyebrow: isSpecialist ? "Service offered" : "Clinical service",
        title,
        shortDescription: service.shortDescription,
        lead: service.lead,
        detailParagraphs,
        imageUrl,
        alt: service.alt || title,
        ctaHref: slug ? `/services/${slug}` : siteSettings.ctas.book,
        ctaLabel: "View details",
        isSpecialist,
      };
    })
    .sort((a, b) => {
      if (a.isSpecialist === b.isSpecialist) return 0;
      return a.isSpecialist ? 1 : -1;
    });

  return (
    <>
      <section className="services-page-hero services-page-hero-v2 full-bleed-section">
        <Reveal variant="up" className="services-page-hero-reveal">
          <div className="services-page-banner">
            <div className="shell services-page-banner-shell">
              <div className="services-page-hero-copy-v2">
                <p className="eyebrow">Our Services</p>
                <h1>Care we offer.</h1>
                <p className="services-page-banner-copy">
                  A simple guide to appointments, diagnostics, procedures, and daytime urgent care.
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
            <p className="eyebrow">Service List</p>
            <h2>Browse services before prices are finalised.</h2>
            <p>
              Use this directory to see what is available. Where a cost depends on assessment, the team can provide a quote before booking.
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
                    <span key={item} className="services-master-chip">
                      {item}
                    </span>
                  ))}
                  {group.items.length > 6 ? (
                    <details className="services-master-more">
                      <summary>Show full list</summary>
                      <div>
                        {group.items.slice(6).map((item) => (
                          <span key={item} className="services-master-chip">
                            {item}
                          </span>
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
              <h2>Need help choosing?</h2>
              <p>
                The list is for browsing. The cards below open the main detail pages.
              </p>
            </div>

            <div className="services-page-intro-points">
              <article>
                <strong>Browse first</strong>
                <p>See the full range without leaving the page.</p>
              </article>
              <article>
                <strong>Open details</strong>
                <p>Main service cards link to dedicated pages.</p>
              </article>
              <article>
                <strong>Ask for a quote</strong>
                <p>Some costs depend on the patient and procedure.</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell services-group">
        <Reveal variant="up">
          <div className="services-group-heading">
            <p className="eyebrow">Care We Offer</p>
            <h2>Browse care areas, then open what you need.</h2>
            <p>
              Short cards first. Detail pages second.
            </p>
          </div>
        </Reveal>

        <input className="services-more-toggle" type="checkbox" id="services-more-toggle" />
        <div className="services-card-grid services-card-grid-image-led services-card-grid-collapsible">
          {serviceCards.map((service, index) => (
            <Reveal key={service.id} variant="up" delayMs={Math.min(index, visibleServiceCount - 1) * 35} className={index >= visibleServiceCount ? "service-card-extra" : undefined}>
              <a className={`service-card-v3${service.isSpecialist ? " service-card-v3-specialist" : ""}`} href={service.ctaHref} aria-label={`${service.title} details`}>
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