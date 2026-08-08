import { Reveal } from "@/components/shared/Reveal";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const overviewPoints = [
  "Independent veterinary care in Sutton.",
  "A family-owned practice with a warmer, more personal approach.",
  "Objective and fair options explained with kindness.",
];

const parkingNotes = [
  "Ample parking and step-free access.",
  "Free parking at Lidl's across the road (90 minutes).",
  "Parking available at Hackbridge Rail Station.",
];

const clinicHours = [
  { day: "Monday - Friday", hours: "09:00am - 6:00pm" },
  { day: "Saturday", hours: "9:00am - 12.00pm" },
];

const contactDetails = [
  { label: "Telephone", value: "07440278373", href: "tel:07440278373" },
  { label: "Email", value: "info@thesuttonvet.co.uk", href: "mailto:info@thesuttonvet.co.uk" },
  { label: "Online Booking", value: "24/7 online portal available via our website." },
];

export default async function ContactPage() {
  const siteSettingsDocument = await getSiteSettingsDocument();
  const siteSettings = resolveSiteSettings(siteSettingsDocument);

  return (
    <>
      <section className="shell contact-page-v2-hero">
        <Reveal variant="left">
          <div className="contact-page-v2-copy">
            <p className="eyebrow">About</p>
            <h1>Independent veterinary care in Sutton, designed to feel calm, clear, and personal.</h1>
            <p>
              The Sutton Vet is being shaped as a smaller independent practice where care feels more considered, practical information is easier to find, and each visit can be planned with more confidence.
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={40}>
          <div className="contact-page-v2-summary">
            <p className="eyebrow">At A Glance</p>
            <ul>
              {overviewPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="shell contact-page-v2-grid">
        <Reveal variant="left">
          <div className="contact-page-v2-panel" id="opening-times">
            <p className="eyebrow">Clinic Hours</p>
            <h2>Visit times kept simple.</h2>
            <div className="contact-page-v2-hours">
              {clinicHours.map((item) => (
                <div key={item.day}>
                  <span>{item.day}</span>
                  <strong>{item.hours}</strong>
                </div>
              ))}
            </div>
            <p>Appointments can still be requested through the website at any time using the online booking portal.</p>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div className="contact-page-v2-panel contact-page-v2-panel-soft" id="parking-access">
            <p className="eyebrow">Parking & Access</p>
            <h2>Arrival guidance for a calmer first visit.</h2>
            <div className="contact-page-v2-notes">
              {parkingNotes.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>


      <section className="shell contact-page-v2-community">
        <Reveal variant="left">
          <div className="contact-page-v2-community-copy">
            <p className="eyebrow">Community</p>
            <h2>Passionate about animals and our community.</h2>
            <p>
              We are more than a veterinary surgery. The Sutton Vet is being built as a local practice that supports pet education, local animal welfare, and neighbourhood connection as the clinic grows.
            </p>
          </div>
        </Reveal>
        <Reveal variant="right" delayMs={40}>
          <div className="contact-page-v2-social-links">
            {siteSettings.socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="shell contact-page-v2-details">
        <Reveal variant="left">
          <div className="contact-page-v2-panel">
            <p className="eyebrow">Contact Details</p>
            <h2>Everything important, in one place.</h2>
            <div className="contact-page-v2-detail-list">
              {contactDetails.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  {item.href ? (
                    <a href={item.href}>{item.value}</a>
                  ) : (
                    <strong>{item.value}</strong>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell contact-page-v2-location" id="find-us">
        <Reveal variant="left">
          <div className="contact-page-v2-location-copy">
            <p className="eyebrow">Find Us</p>
            <h2>4 Spinning Wheel Way, Hackbridge, SM6 7DS</h2>
            <p>
              Located near Hackbridge Rail Station, with free nearby parking options and step-free access to help visits feel easier from the moment you arrive.
            </p>
            <div className="contact-page-v2-actions">
              <a className="button button-primary" href={siteSettings.hasMapUrl}>
                Get Directions
              </a>
              <a className="button button-muted" href={siteSettings.googleBusinessProfileUrl} target="_blank" rel="noreferrer">
                Google Profile
              </a>
              <a className="button button-muted" href="tel:07440278373">
                Call 07440278373
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={50}>
          <div className="contact-page-v2-map">
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



