import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { seededServices } from "@/lib/servicesSeed";
import { visualAssets } from "@/lib/visualAssets";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const homeCards = [
  "service-gp-consultations",
  "service-dental-care",
  "service-vaccinations",
  "service-neutering-keyhole",
  "service-in-house-diagnostics",
  "service-home-visits",
  "service-referral-endoscopy",
]
  .map((id) => seededServices.find((service) => service._id === id))
  .filter((service): service is NonNullable<typeof service> => Boolean(service));

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
    title: "In-house surgical and referral services",
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

const clinicHours = [
  { day: "Monday - Friday", hours: "09:00am - 6:00pm" },
  { day: "Saturday", hours: "9:00am - 12.00pm" },
];

export default async function Home() {
  const siteSettingsDocument = await getSiteSettingsDocument();
  const siteSettings = resolveSiteSettings(siteSettingsDocument);

  return (
    <>
      <section className="sv-home-hero full-bleed-section">
        <div
          className="sv-home-hero-image"
          style={{ backgroundImage: `url(${visualAssets.gingerSpanielHero})` }}
          aria-hidden="true"
        />
        <div className="sv-home-hero-overlay" />

        <div className="shell sv-home-hero-shell">
          <Reveal variant="left">
            <div className="sv-home-hero-copy sv-home-hero-copy-minimal">
              <p className="eyebrow">{siteSettings.tagline}</p>
              <h1>
                <span className="sv-hero-line sv-hero-line-first">Calm, independent</span>
                <span className="sv-hero-line">
                  vet care in <span className="sv-hero-word-white">Sutton.</span>
                </span>
              </h1>
              <p>Convenient, affordable, advanced care with a gentle and more personal approach.</p>
              <div className="cta-actions">
                <a className="button button-primary" href={siteSettings.ctas.register}>
                  Register Now
                </a>
                <a className="button button-muted" href="/services">
                  View Services
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell sv-home-intro-v3">
        <Reveal variant="left">
          <div className="sv-home-intro-panel">
            <p className="eyebrow">Independent Care</p>
            <h2><span className="sv-home-intro-line"><span className="sv-home-intro-soft">A calmer structure </span></span><span className="sv-home-intro-line"><span className="sv-home-intro-soft">for </span><span className="sv-home-intro-emphasis">everyday appointments </span></span><span className="sv-home-intro-line"><span className="sv-home-intro-soft">referral pathways</span><span className="sv-home-intro-soft"> and </span><span className="sv-home-intro-emphasis">practical </span></span><span className="sv-home-intro-line"><span className="sv-home-intro-emphasis">next steps.</span></span></h2>
            <Link className="sv-home-inline-link" href="/services">
              See our veterinary services
            </Link>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={40}>
          <div className="sv-home-intro-copy">
            <p>
              The Sutton Vet is being shaped as an independent practice with a gentle voice, clear guidance, and modern clinical standards. The aim is to make each part of the website feel easier to understand, from first appointments to referral-only services.
            </p>
            <p>
              Everyday GP care sits alongside selected referral work in soft tissue surgery, orthopaedic surgery, and endoscopy, while pricing and visit information are presented more openly so owners can make decisions with confidence.
            </p>
            <div className="sv-home-intro-note">
              <span>Referral only</span>
              <p>Soft tissue surgery, orthopaedic surgery, and endoscopy are available on a referral basis.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal variant="mask" className="sv-home-expert-reveal"><section className="shell sv-home-expert-v3">
        <Reveal variant="left">
          <div className="sv-home-expert-heading">
            <p className="eyebrow">Care Overview</p>
            <h2>A clearer view of everyday care, diagnostics, procedures, home visits, and referral support.</h2>
            <p>
              A simple overview of the main clinical services, presented with a calmer structure and a more refined visual rhythm.
            </p>
          </div>
        </Reveal>

        <div className="sv-home-expert-grid">
          {homeCards.map((service, index) => (
            <Reveal key={service._id} variant="up" delayMs={index * 35}>
              <Link className="sv-home-expert-card" href={`/services/${service.slug.current}`}>
                <div
                  className="sv-home-expert-card-media"
                  style={{ backgroundImage: `url("${service.imageUrl}")` }}
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
            <p className="eyebrow">Why Choose The Sutton Vet</p>
            <h2>
              <span className="sv-home-why-line">Why pet owners choose</span>
              <span className="sv-home-why-line sv-home-why-brand">The Sutton Vet</span>
            </h2>
            <div
              className="sv-home-why-video-frame sv-home-why-image-frame"
              style={{ backgroundImage: `url(${visualAssets.gingerCatHero})` }}
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
          {whyChoosePoints.map((item, index) => (
            <Reveal key={item.number} variant="up" delayMs={index * 35}>
              <article className="sv-home-why-v4-item">
                <span>{item.number}</span>
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
            <p className="eyebrow">Find Us</p>
            <h2>Visit planning made simple.</h2>
            <p>4 Spinning Wheel Way, Hackbridge, SM6 7DS</p>
            <p>Ample parking and step-free access.</p>
            <div className="sv-home-location-hours">
              {clinicHours.map((item) => (
                <div key={item.day}>
                  <span>{item.day}</span>
                  <strong>{item.hours}</strong>
                </div>
              ))}
            </div>
            <p>Free parking at Lidl&apos;s across the road (90 minutes) and parking at Hackbridge Rail Station.</p>
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
            <iframe
              src={siteSettings.googleMapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteSettings.practiceName} map`}
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
