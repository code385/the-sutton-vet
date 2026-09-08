import { Reveal } from "@/components/shared/Reveal";
import { SectionCta } from "@/components/shared/SectionCta";
import { masterServiceGroups, servicesPageSeed } from "@/lib/servicesSeed";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import { getServicesPageDocument } from "@/sanity/lib/services";

const groupRoutes: Record<string, string> = {
  "Pet Club and preventative care": "/services/pet-club-preventative-care",
  "Vaccinations and routine procedures": "/services/vaccinations",
  "Dentistry, imaging, and diagnostics": "/services/in-house-diagnostics",
  "Soft tissue procedures": "/services/soft-tissue-surgery",
  "Orthopaedic procedures": "/services/orthopaedic-surgery",
  "Endoscopy and sensitive care": "/services/endoscopy",
};

function directoryAnchor(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function ServicesPage() {
  const [servicesPage, siteSettingsDocument] = await Promise.all([
    getServicesPageDocument(),
    getSiteSettingsDocument(),
  ]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const resolvedServicesPage = servicesPage || servicesPageSeed;
  const primaryCtaHref = resolvedServicesPage.primaryCtaHref === "/contact#book" ? siteSettings.ctas.book : resolvedServicesPage.primaryCtaHref || siteSettings.ctas.book;
  const secondaryCtaHref = resolvedServicesPage.secondaryCtaHref === "/contact#register" ? siteSettings.ctas.register : resolvedServicesPage.secondaryCtaHref || siteSettings.ctas.register;
  const closingPrimaryHref = resolvedServicesPage.closingPrimaryHref === "/contact#book" ? siteSettings.ctas.book : resolvedServicesPage.closingPrimaryHref || siteSettings.ctas.book;
  const closingSecondaryHref = resolvedServicesPage.closingSecondaryHref === "/contact#register" ? siteSettings.ctas.register : resolvedServicesPage.closingSecondaryHref || siteSettings.ctas.register;

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
                <span>Choose a care area</span>
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
          <div className="services-master-heading services-master-heading-wide">
            <p className="eyebrow">Service Directory</p>
            <h2>Choose a care area and explore the details.</h2>
            <p>Browse the main services here, then open the relevant page for procedures, images and next steps.</p>
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
                <div className="services-master-flow-summary">
                  <p>{group.description}</p>
                  <a className="button button-primary services-master-detail-button" href={groupRoutes[group.title] || "/contact"}>
                    View service
                  </a>
                </div>
                <div className="services-master-flow-links">
                  {group.items.slice(0, 6).map((item) => (
                    <span key={item} className="services-master-chip">{item}</span>
                  ))}
                  {group.items.length > 6 ? (
                    <details className="services-master-more">
                      <summary>Show full list</summary>
                      <div>
                        {group.items.slice(6).map((item) => (
                          <span key={item} className="services-master-chip">{item}</span>
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
