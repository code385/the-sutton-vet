import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { ConsentManagedMap } from "@/components/shared/ConsentManagedMap";
import { seededServices } from "@/lib/servicesSeed";
import { visualAssets } from "@/lib/visualAssets";
import { getHomePageDocument } from "@/sanity/lib/homePage";
import { getServiceDocuments } from "@/sanity/lib/services";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const homeCardIds = [
  "service-gp-consultations",
  "service-daytime-urgent-care",
  "service-dental-care",
  "service-vaccinations",
  "service-neutering-keyhole",
  "service-in-house-diagnostics",
  "service-nurse-clinics",
  "service-hospitalisation-and-day-care",
  "service-service-endoscopy",
];
const fallbackHomeCards = homeCardIds.map((id) => seededServices.find((service) => service._id === id)).filter((service): service is NonNullable<typeof service> => Boolean(service));

const whyChoosePoints = [
  {
    number: "1",
    title: "All the vet GP services and facilities you need",
  },
  {
    number: "2",
    title: "Fully equipped in-house laboratory",
  },
  {
    number: "3",
    title: "In-house surgery and diagnostics",
  },
  {
    number: "4",
    title: "We're a cat friendly clinic",
  },
  {
    number: "5",
    title: "Always great value",
  },
];

export default async function Home() {
  const [siteSettingsDocument, homePage, cmsServices] = await Promise.all([getSiteSettingsDocument(), getHomePageDocument(), getServiceDocuments()]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const selectedCmsServices = homeCardIds.map((id) => cmsServices.find((service) => service._id === id)).filter((service): service is NonNullable<typeof service> => Boolean(service));
  const homeCards = selectedCmsServices.length ? selectedCmsServices : fallbackHomeCards;
  const introParagraphs = homePage?.introParagraphs?.length ? homePage.introParagraphs : [
    "The Sutton Vet is an independent practice built around calm guidance, modern clinical standards, and clear information.",
    "From appointments to surgery, diagnostics, endoscopy, and daytime urgent care, services are listed clearly.",
  ];
  const whyChooseItems = homePage?.whyChooseCards?.length ? homePage.whyChooseCards : whyChoosePoints;

  return (
    <>
      <section className="sv-home-hero full-bleed-section">
        <div
          className="sv-home-hero-image"
          style={{ backgroundImage: `url(${homePage?.heroImageUrl || visualAssets.homeHeroClient})` }}
          aria-hidden="true"
        />
        <div className="sv-home-hero-overlay" />

        <div className="shell sv-home-hero-shell">
          <Reveal variant="left">
            <div className="sv-home-hero-copy sv-home-hero-copy-minimal">
              <p className="eyebrow">{homePage?.heroEyebrow || siteSettings.tagline}</p>
              <h1>{homePage?.heroTitle || "Calm, independent vet care in Sutton."}</h1>
              <p>{homePage?.heroDescription || "Kind, practical care with a calm personal approach."}</p>
              <div className="cta-actions">
                <a className="button button-primary" href={siteSettings.ctas.register}>
                  {homePage?.heroPrimaryCtaLabel || "Register Now"}
                </a>
                <a className="button button-muted" href="/services">
                  {homePage?.heroSecondaryCtaLabel || "View Services"}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell sv-home-intro-v3">
        <Reveal variant="left">
          <div className="sv-home-intro-panel">
            <p className="eyebrow">{homePage?.introEyebrow || "Independent Care"}</p>
            <h2>{homePage?.introTitle || "Calm care, clear services, and practical next steps."}</h2>
            <Link className="sv-home-inline-link" href="/services">
              See our veterinary services
            </Link>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={40}>
          <div className="sv-home-intro-copy">
            {introParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="sv-home-intro-note">
              <span>{homePage?.introNoteLabel || "Services available"}</span>
              <p>{homePage?.introNoteText || "Soft tissue surgery, orthopaedic surgery, and endoscopy are included."}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal variant="mask" className="sv-home-expert-reveal"><section className="shell sv-home-expert-v3">
        <Reveal variant="left">
          <div className="sv-home-expert-heading">
            <p className="eyebrow">{homePage?.servicesEyebrow || "Care Overview"}</p>
            <h2>{homePage?.servicesTitle || "Care, diagnostics, procedures, home visits, and daytime urgent support."}</h2>
            <p>{homePage?.servicesDescription || "A simple overview of the care available at The Sutton Vet."}</p>
          </div>
        </Reveal>

        <div className="sv-home-expert-grid">
          {homeCards.map((service, index) => (
            <Reveal key={service._id} variant="up" delayMs={index * 35}>
              <Link className="sv-home-expert-card" href={`/services/${service.slug?.current || service._id.replace(/^service-/, "")}`}>
                <div
                  className="sv-home-expert-card-media"
                  style={{ backgroundImage: `url("${"image" in service ? service.image?.asset?.url || service.imageUrl : service.imageUrl}")` }}
                  aria-hidden="true"
                >
                  <div className="sv-home-expert-card-overlay">
                    <div className="sv-home-expert-card-copy">
                      <h3>{service.title}</h3>
                      <span className="sv-home-expert-card-button">View Details</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal variant="up" delayMs={120}>
          <div className="sv-home-expert-cta">
            <Link className="sv-home-expert-cta-link" href="/services">
              <span>See All Services</span>
              <i aria-hidden="true">+</i>
            </Link>
          </div>
        </Reveal>
      </section></Reveal>

      <section className="shell sv-home-why-v4">
        <Reveal variant="left">
          <div className="sv-home-why-v4-intro">
            <p className="eyebrow">{homePage?.whyChooseEyebrow || "Why Choose The Sutton Vet"}</p>
            <h2>{homePage?.whyChooseTitle || "Why pet owners choose The Sutton Vet"}</h2>
            <div
              className="sv-home-why-video-frame sv-home-why-image-frame"
              style={{ backgroundImage: `url(${homePage?.whyChooseImageUrl || visualAssets.gingerCatHero})` }}
              aria-hidden="true"
            >
              <div className="sv-home-why-video-overlay" />
            </div>
            <div className="sv-home-why-v4-cta">
              <a className="button button-primary" href={siteSettings.ctas.register}>
                Register Now
              </a>
            </div>
          </div>
        </Reveal>

        <div className="sv-home-why-v4-list">
          {whyChooseItems.map((item, index) => (
            <Reveal key={`${index}-${item.title}`} variant="up" delayMs={index * 35}>
              <article className="sv-home-why-v4-item">
                <span>{String(index + 1)}</span>
                <div>
                  <h3>{item.title}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell sv-home-location-v1">
        <Reveal variant="left">
          <div className="sv-home-location-copy">
            <p className="eyebrow">{homePage?.locationEyebrow || "Find Us"}</p>
            <h2>{homePage?.locationTitle || "Visit planning made simple."}</h2>
            <p>{homePage?.locationAddress || siteSettings.address}</p>
            <p>{homePage?.locationPoints?.[0] || "Ample parking and step-free access."}</p>
            <div className="sv-home-location-hours">
              {siteSettings.openingHours.map((item) => (
                <div key={item.day}>
                  <span>{item.day}</span>
                  <strong>{item.hours}</strong>
                </div>
              ))}
            </div>
            <p>{homePage?.locationPoints?.[1] || "Free parking at Lidl's across the road (90 minutes) and parking at Hackbridge Rail Station."}</p>
            <div className="sv-home-location-actions">
              <a className="button button-primary" href={siteSettings.hasMapUrl}>
                Get Directions
              </a>
              <a className="button button-muted" href={siteSettings.googleBusinessProfileUrl} target="_blank" rel="noreferrer">
                Google Profile
              </a>
              <Link className="button button-muted" href="/contact">
                Contact Details
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={50}>
          <div className="sv-home-location-map">
            <ConsentManagedMap
              src={siteSettings.googleMapEmbedUrl}
              title={`${siteSettings.practiceName} map`}
              actionHref={siteSettings.hasMapUrl}
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
