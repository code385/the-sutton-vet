import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionCta } from "@/components/shared/SectionCta";
import { visualAssets } from "@/lib/visualAssets";
import { servicesPageSeed } from "@/lib/servicesSeed";
import { resolveServiceCollection } from "@/lib/resolveServices";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import { getServiceDocuments, portableTextToParagraphs } from "@/sanity/lib/services";

const fallbackServiceImage = visualAssets.gingerSpanielHero;

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await getServiceDocuments();
  const resolvedServices = resolveServiceCollection(services);

  return resolvedServices
    .map((service) => service.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [services, siteSettingsDocument] = await Promise.all([getServiceDocuments(), getSiteSettingsDocument()]);

  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const resolvedServices = resolveServiceCollection(services);
  const service = resolvedServices.find((item) => item.slug?.current === slug);

  if (!service) {
    notFound();
  }

  const paragraphs = portableTextToParagraphs(service.content);
  const body = paragraphs.length ? paragraphs : service.shortDescription ? [service.shortDescription] : [];
  const imageUrl = ("image" in service ? service.image?.asset?.url : undefined) || service.imageUrl || fallbackServiceImage;
  const serviceCtaHref = service.ctaHref === "/contact#register" ? siteSettings.ctas.register : service.ctaHref === "/contact#book" ? siteSettings.ctas.book : service.ctaHref || siteSettings.ctas.book;
  const relatedServices = resolvedServices.filter((item) => item._id !== service._id).slice(0, 3);

  return (
    <>
      <section className="service-detail-hero full-bleed-section">
        <div className="shell service-detail-hero-shell">
          <div className="service-detail-hero-copy">
            <p className="eyebrow">Service Detail</p>
            <h1>{service.title}</h1>
            {service.lead ? <p className="service-detail-lead">{service.lead}</p> : null}
            <div className="service-detail-actions">
              <a className="button button-primary" href={serviceCtaHref}>
                {service.ctaLabel || "Book Online"}
              </a>
              <Link className="button button-muted" href="/services">
                Back to Services
              </Link>
            </div>
          </div>

          <div className="service-detail-hero-media">
            <Image src={imageUrl} alt={service.alt || service.title || "Service image"} fill sizes="(max-width: 1080px) 100vw, 44vw" />
          </div>
        </div>
      </section>

      <section className="shell service-detail-content">
        <div className="service-detail-main">
          {service.shortDescription ? <p className="service-detail-summary">{service.shortDescription}</p> : null}
          <div className="service-detail-body">
            {body.slice(0, 3).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className="service-detail-side">
          <div className="service-detail-side-block">
            <span>Next Step</span>
            <p>If you are unsure whether this is the right appointment or pathway, the team can guide you before booking.</p>
            <a className="text-link" href={serviceCtaHref}>
              {service.ctaLabel || "Book Online"}
            </a>
          </div>
        </aside>
      </section>

      <section className="shell service-detail-related">
        <div className="service-detail-related-heading">
          <p className="eyebrow">More Services</p>
          <h2>Related areas of care</h2>
        </div>

        <div className="service-detail-related-grid">
          {relatedServices.map((item) => {
            const relatedImage = ("image" in item ? item.image?.asset?.url : undefined) || item.imageUrl || fallbackServiceImage;
            return (
              <Link key={item._id} className="service-detail-related-card" href={`/services/${item.slug?.current || ""}`}>
                <div className="service-detail-related-media">
                  <Image src={relatedImage} alt={item.alt || item.title || "Related service image"} fill sizes="(max-width: 720px) 100vw, 30vw" />
                </div>
                <h3>{item.title}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      <SectionCta
        eyebrow={servicesPageSeed.closingEyebrow || "Next Step"}
        title={servicesPageSeed.closingTitle || "Need something specific?"}
        text={servicesPageSeed.closingText || "Move from information to booking with less friction."}
        primaryLabel={servicesPageSeed.closingPrimaryLabel}
        primaryHref={servicesPageSeed.closingPrimaryHref}
        secondaryLabel={servicesPageSeed.closingSecondaryLabel}
        secondaryHref={servicesPageSeed.closingSecondaryHref}
      />
    </>
  );
}

