import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ServiceClinicalGallery, type ClinicalGalleryItem } from "@/components/services/ServiceClinicalGallery";
import { SectionCta } from "@/components/shared/SectionCta";
import { visualAssets } from "@/lib/visualAssets";
import { masterServiceGroups, servicesPageSeed } from "@/lib/servicesSeed";
import { resolveServiceCollection } from "@/lib/resolveServices";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import { getServiceDocuments, portableTextToParagraphs } from "@/sanity/lib/services";

const fallbackServiceImage = visualAssets.gingerSpanielHero;

const detailGroupBySlug: Record<string, string> = {
  "pet-club-preventative-care": "Pet Club and preventative care",
  vaccinations: "Vaccinations and routine procedures",
  "neutering-and-keyhole-spays": "Vaccinations and routine procedures",
  "laparoscopic-procedures": "Vaccinations and routine procedures",
  "pre-operative-consultations": "Vaccinations and routine procedures",
  "nurse-clinics": "Vaccinations and routine procedures",
  "hospitalisation-and-day-care": "Vaccinations and routine procedures",
  "dental-care": "Dentistry, imaging, and diagnostics",
  "scale-and-polish": "Dentistry, imaging, and diagnostics",
  "in-house-diagnostics": "Dentistry, imaging, and diagnostics",
  "soft-tissue-surgery": "Soft tissue procedures",
  "surgery-and-procedures": "Soft tissue procedures",
  "orthopaedic-surgery": "Orthopaedic procedures",
  endoscopy: "Endoscopy and sensitive care",
  "end-of-life-care": "Endoscopy and sensitive care",
  "cremation-arrangements": "Endoscopy and sensitive care",
  "exotic-pet-care": "Endoscopy and sensitive care",
};

const orthopaedicGallery: ClinicalGalleryItem[] = [
  { title: "TPLO", description: "Planning and post-operative imaging.", images: [
    { src: "/images/services/orthopaedic/tplo-1.webp", alt: "TPLO clinical radiograph" },
    { src: "/images/services/orthopaedic/tplo-2.webp", alt: "TPLO post-operative radiograph" },
  ] },
  { title: "CCWO", description: "Case-led corrective osteotomy.", images: [
    { src: "/images/services/orthopaedic/ccwo-1.webp", alt: "CCWO planning image" },
    { src: "/images/services/orthopaedic/ccwo-2.webp", alt: "CCWO clinical radiograph" },
  ] },
  { title: "Lateral condylar fracture", description: "Fracture assessment and repair.", images: [
    { src: "/images/services/orthopaedic/lateral-condylar-fracture-1.webp", alt: "Lateral condylar fracture radiograph" },
    { src: "/images/services/orthopaedic/lateral-condylar-fracture-2.webp", alt: "Lateral condylar fracture repair radiograph" },
  ] },
  { title: "Pancarpal arthrodesis", description: "Stabilisation planned around the patient.", images: [
    { src: "/images/services/orthopaedic/pancarpal-arthrodesis-1.webp", alt: "Pancarpal arthrodesis radiograph" },
    { src: "/images/services/orthopaedic/pancarpal-arthrodesis-2.webp", alt: "Pancarpal arthrodesis follow-up image" },
  ] },
  { title: "Pantarsal arthrodesis", description: "Careful surgical planning and follow-up.", images: [
    { src: "/images/services/orthopaedic/pantarsal-arthrodesis-1.webp", alt: "Pantarsal arthrodesis radiograph" },
    { src: "/images/services/orthopaedic/pantarsal-arthrodesis-2.webp", alt: "Pantarsal arthrodesis follow-up radiograph" },
  ] },
  { title: "Fracture repair", description: "Repair options assessed case by case.", images: [
    { src: "/images/services/orthopaedic/fracture-repair-a-1.webp", alt: "Fracture repair clinical radiograph" },
    { src: "/images/services/orthopaedic/fracture-repair-a-2.webp", alt: "Fracture repair post-operative radiograph" },
  ] },
  { title: "Complex fracture repair", description: "Imaging-led planning for complex cases.", images: [
    { src: "/images/services/orthopaedic/fracture-repair-b-1.webp", alt: "Complex fracture clinical radiograph" },
    { src: "/images/services/orthopaedic/fracture-repair-b-2.webp", alt: "Complex fracture repair radiograph" },
  ] },
];

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

  if (!service) notFound();

  const paragraphs = portableTextToParagraphs(service.content);
  const body = paragraphs.length ? paragraphs : service.shortDescription ? [service.shortDescription] : [];
  const imageUrl = ("image" in service ? service.image?.asset?.url : undefined) || service.imageUrl || fallbackServiceImage;
  const serviceCtaHref = service.ctaHref === "/contact#register" ? siteSettings.ctas.register : service.ctaHref === "/contact#book" ? siteSettings.ctas.book : service.ctaHref || siteSettings.ctas.book;
  const relatedServices = resolvedServices.filter((item) => item._id !== service._id).slice(0, 3);
  const fallbackGroup = masterServiceGroups.find((group) => group.title === detailGroupBySlug[slug]);
  const subservices = service.subservices?.length ? service.subservices : fallbackGroup?.items || [];
  const sanityGallery: ClinicalGalleryItem[] = (service.gallery || [])
    .map((item) => ({
      title: item.title || "Clinical work",
      description: item.description,
      images: (item.images || [])
        .filter((image) => Boolean(image.asset?.url))
        .map((image, index) => ({ src: image.asset?.url || "", alt: image.alt || `${item.title || service.title} clinical image ${index + 1}` })),
    }))
    .filter((item) => item.images.length);
  const gallery = sanityGallery.length ? sanityGallery : slug === "orthopaedic-surgery" ? orthopaedicGallery : [];

  return (
    <>
      <section className="service-detail-hero full-bleed-section">
        <div className="shell service-detail-hero-shell">
          <div className="service-detail-hero-copy">
            <p className="eyebrow">Service Detail</p>
            <h1>{service.title}</h1>
            {service.lead ? <p className="service-detail-lead">{service.lead}</p> : null}
            <div className="service-detail-actions">
              <a className="button button-primary" href={serviceCtaHref}>{service.ctaLabel || "Book Online"}</a>
              <Link className="button button-muted" href="/services">Back to Services</Link>
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
            {body.slice(0, 3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <aside className="service-detail-side">
          <div className="service-detail-side-block">
            <span>Next Step</span>
            <p>The team can confirm suitability, timing and costs before booking.</p>
            <a className="text-link" href={serviceCtaHref}>{service.ctaLabel || "Book Online"}</a>
          </div>
        </aside>
      </section>

      {subservices.length ? (
        <section className="shell service-detail-subservices">
          <div className="service-detail-section-heading">
            <div>
              <p className="eyebrow">Services Available</p>
              <h2>What this care area includes.</h2>
            </div>
            <p>Every recommendation follows an individual clinical assessment.</p>
          </div>
          <div className="service-detail-subservice-list">
            {subservices.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
            ))}
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="shell service-detail-clinical">
          <div className="service-detail-section-heading">
            <div>
              <p className="eyebrow">Clinical Gallery</p>
              <h2>Selected work from this service.</h2>
            </div>
            <p>Select any image to view it closely, then use the zoom controls.</p>
          </div>
          <ServiceClinicalGallery items={gallery} />
        </section>
      ) : null}

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
