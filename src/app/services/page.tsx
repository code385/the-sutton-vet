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
              <h1>Services</h1>
              <p className="services-page-banner-copy">
                A clear overview of the care available at The Sutton Vet, presented in a simpler and more unified way.
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
              <h2>Everyday care, advanced procedures, and carefully defined referral support in one calmer presentation.</h2>
              <p>
                This page now follows a more unified layout, so owners can browse the full service offering without feeling like they are entering two different websites. Where a service is referral only, that is still clearly stated within the individual service card.
              </p>
            </div>

            <div className="services-page-intro-points">
              <article>
                <strong>Clear to scan</strong>
                <p>Services are shown in one continuous layout, with calmer wording and less visual separation.</p>
              </article>
              <article>
                <strong>Honest scope</strong>
                <p>Referral-only services remain clearly marked without overpowering the rest of the page.</p>
              </article>
              <article>
                <strong>Not currently offered</strong>
                <p>No spinal referral service, CT scanner, neuro surgery, physio, hydrotherapy, or active out-of-hours rollout yet.</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell services-group">
        <Reveal variant="up">
          <div className="services-group-heading">
            <p className="eyebrow">Care We Offer</p>
            <h2>A thoughtful service list designed to feel complete, minimal, and easier to explore.</h2>
            <p>
              The focus here is on clarity rather than category-heavy labelling, so owners can move through the service range naturally while still seeing where referral access applies.
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
            <h2>More services and procedures, kept clear until pricing is confirmed.</h2>
            <p>
              The service list below reflects the master service areas supplied for the practice. Prices can be added later, or owners can contact the team for a quote where the final cost depends on assessment, patient size, or clinical findings.
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




