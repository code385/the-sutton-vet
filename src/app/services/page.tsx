import { Reveal } from "@/components/shared/Reveal";
import { SectionCta } from "@/components/shared/SectionCta";
import { seededServices, servicesPageSeed } from "@/lib/servicesSeed";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import { getServiceDocuments, getServicesPageDocument, portableTextToParagraphs } from "@/sanity/lib/services";

const fallbackServiceImage =
  "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1400&q=80";

export default async function ServicesPage() {
  const [servicesPage, services, siteSettingsDocument] = await Promise.all([
    getServicesPageDocument(),
    getServiceDocuments(),
    getSiteSettingsDocument(),
  ]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const resolvedServicesPage = servicesPage || servicesPageSeed;
  const resolvedServices = services.length ? services : seededServices;

  return (
    <>
      <section className="services-page-hero full-bleed-section">
        <Reveal variant="up" className="services-page-hero-reveal">
          <div className="services-page-banner">
            <div className="shell services-page-banner-shell">
              <p className="eyebrow">{resolvedServicesPage.eyebrow}</p>
              <h1>Services</h1>
              <p className="services-page-banner-copy">{resolvedServicesPage.description}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="services-page-list">
        {resolvedServices.map((service, index) => {
          const paragraphs = portableTextToParagraphs(service.content);
          const detailParagraphs = paragraphs.length ? paragraphs : service.shortDescription ? [service.shortDescription] : [];
          const imageUrl =
            ("image" in service ? service.image?.asset?.url : undefined) || service.imageUrl || fallbackServiceImage;
          const imageRight = index % 2 === 0;

          return (
            <Reveal key={service._id} variant={imageRight ? "right" : "left"} delayMs={index * 40}>
              <article className={`service-feature${imageRight ? "" : " service-feature-reverse"}`}>
                <div className="service-feature-copy">
                  {service.eyebrow ? <p className="eyebrow">{service.eyebrow}</p> : null}
                  <h2>{service.title}</h2>
                  {service.lead ? <p className="service-feature-lead">{service.lead}</p> : null}
                  <div className="service-feature-body">
                    {detailParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <a className="text-link service-feature-link" href={service.ctaHref || siteSettings.ctas.book}>
                    {service.ctaLabel || "Book this service"}
                  </a>
                </div>

                <div className="service-feature-media">
                  <div className="service-feature-image" style={{ backgroundImage: `url(${imageUrl})` }} aria-label={service.alt || service.title} />
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      <SectionCta
        eyebrow={resolvedServicesPage.closingEyebrow || "Next Step"}
        title={resolvedServicesPage.closingTitle || "Need something specific?"}
        text={resolvedServicesPage.closingText || "Move from information to booking with less friction."}
        primaryLabel={resolvedServicesPage.closingPrimaryLabel}
        primaryHref={resolvedServicesPage.closingPrimaryHref}
        secondaryLabel={resolvedServicesPage.closingSecondaryLabel}
        secondaryHref={resolvedServicesPage.closingSecondaryHref}
      />
    </>
  );
}
