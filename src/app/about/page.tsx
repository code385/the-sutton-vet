import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { visualAssets } from "@/lib/visualAssets";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const carePillars = [
  {
    label: "Character",
    text: "Honesty, patience, and consistency when cases are complex or answers are not immediate.",
  },
  {
    label: "Duty",
    text: "Continuity through every life stage, from puppy or kittenhood through to senior care.",
  },
  {
    label: "Conscience",
    text: "Recommendations guided by what is right for this animal at this moment in their life.",
  },
];

const differencePoints = [
  "Not rushed",
  "Fear-free handling",
  "See the same people",
  "Independent and locally vet-owned",
  "Transparent pricing",
  "Advanced care without compromise",
  "Small enough to know you, big enough to serve you",
];

const visitDetails = [
  { label: "Address", value: "4 Spinning Wheel Way, Hackbridge, SM6 7DS" },
  { label: "Access", value: "Ample parking and step-free access" },
  { label: "Monday - Friday", value: "09:00am - 6:00pm" },
  { label: "Saturday", value: "9:00am - 12.00pm" },
  { label: "Parking", value: "Free parking at Lidl's across the road for 90 minutes, with parking also available at Hackbridge Rail Station." },
];

export default async function AboutPage() {
  const siteSettingsDocument = await getSiteSettingsDocument();
  const siteSettings = resolveSiteSettings(siteSettingsDocument);

  return (
    <>
      <section className="shell about-page-hero">
        <Reveal variant="left">
          <div className="about-page-hero-copy">
            <p className="eyebrow">About The Sutton Vet</p>
            <h1>Independent, family-owned, and rooted in Sutton.</h1>
            <p>
              Amidst larger corporate veterinary groups, The Sutton Vet is being shaped as a small independent practice offering gentle, advanced veterinary care at fair prices.
            </p>
            <div className="about-page-hero-actions">
              <a className="button button-primary" href={siteSettings.ctas.register}>
                Register Now
              </a>
              <Link className="button button-muted" href="#opening-times">
                Plan Your Visit
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delayMs={40}>
          <div className="about-page-hero-media about-page-hero-image" style={{ backgroundImage: `url(${visualAssets.gingerSpanielHero})` }} aria-hidden="true" />
        </Reveal>
      </section>

      <section className="shell about-page-intro" id="overview">
        <Reveal variant="up">
          <div className="about-page-intro-heading">
            <p className="eyebrow">Our Approach</p>
            <h2>Care that feels warm, thoughtful, and clear.</h2>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={40}>
          <div className="about-page-intro-copy">
            <p>
              We offer a personalised, friendly, and caring service. We listen to your concerns, talk things through clearly, and give objective options from best care to what is reasonable, so you can choose what suits your pet and you best.
            </p>
            <p>
              Despite being small, we are mighty in the services we offer. We draw on a team with different areas of expertise and keep decisions guided by kindness, clinical standards, and fairness.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="about-page-story-band">
        <div className="shell about-page-story">
          <Reveal variant="left">
            <div className="about-page-story-copy">
              <p className="eyebrow">Our Story</p>
              <h2>Born from values, not from a business model.</h2>
              <p>
                After years in veterinary medicine, the team wanted to practise in a way that placed animals, families, and ethical decision-making first. The Sutton Vet exists to provide that bridge: independent, locally vet-owned, and guided by conscience rather than convenience.
              </p>
            </div>
          </Reveal>

          <Reveal variant="right" delayMs={60}>
            <div className="about-page-values">
              {carePillars.map((item, index) => (
                <article key={item.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell about-page-difference">
        <Reveal variant="left">
          <div className="about-page-difference-media">
            <Image src="/dropdown-pets-art.png" alt="" width={420} height={250} />
          </div>
        </Reveal>
        <Reveal variant="right" delayMs={40}>
          <div className="about-page-difference-copy">
            <p className="eyebrow">A Different Kind Of Veterinary Service</p>
            <h2>Small enough to know you, big enough to serve you.</h2>
            <div className="about-page-difference-list">
              {differencePoints.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell about-page-visit" id="opening-times">
        <Reveal variant="left">
          <div className="about-page-visit-copy">
            <p className="eyebrow">Visit Information</p>
            <h2>Opening times, parking, and access in one simple place.</h2>
            <p id="parking-access">
              The clinic is based near Hackbridge Rail Station, with step-free access and nearby parking options to help the first visit feel easier.
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={40}>
          <div className="about-page-visit-list" id="find-us">
            {visitDetails.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
            <div>
              <span>Telephone</span>
              <a href="tel:07440278373">07440278373</a>
            </div>
            <div>
              <span>Email</span>
              <a href="mailto:info@thesuttonvet.co.uk">info@thesuttonvet.co.uk</a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell about-page-map">
        <Reveal variant="up">
          <div className="about-page-map-actions">
            <a className="button button-primary" href={siteSettings.googleBusinessProfileUrl} target="_blank" rel="noreferrer">
              View Google Profile
            </a>
            <a className="button button-muted" href={siteSettings.hasMapUrl}>
              Get Directions
            </a>
          </div>
          <iframe
            src={siteSettings.googleMapEmbedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={`${siteSettings.practiceName} map`}
          />
        </Reveal>
      </section>
    </>
  );
}

