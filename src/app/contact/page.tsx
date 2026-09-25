import { Reveal } from "@/components/shared/Reveal";
import { ConsentManagedMap } from "@/components/shared/ConsentManagedMap";
import { getContactPageDocument } from "@/sanity/lib/contentPages";
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
  { label: "Telephone", value: "0203 603 0298", href: "tel:02036030298" },
  { label: "Email", value: "info@thesuttonvet.co.uk", href: "mailto:info@thesuttonvet.co.uk" },
  { label: "Online Booking", value: "24/7 online portal available via our website." },
];

export default async function ContactPage() {
  const [siteSettingsDocument, contactPage] = await Promise.all([getSiteSettingsDocument(), getContactPageDocument()]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const cmsSummaryPoints = contactPage?.quickLinks?.map((item) => item.meta || item.value || item.title || "").filter(Boolean) || [];
  const summaryPoints = cmsSummaryPoints.length ? cmsSummaryPoints : overviewPoints;
  const arrivalNotes = contactPage?.locationPoints?.length ? contactPage.locationPoints : parkingNotes;
  const hours = siteSettings.openingHours.length ? siteSettings.openingHours : clinicHours;
  const cmsDetails = contactPage?.quickLinks?.filter((item) => item.title && item.value).map((item) => ({ label: item.title || "Contact", value: item.value || "", href: item.href })) || [];
  const details = cmsDetails.length ? cmsDetails : contactDetails;

  return (
    <>
      <section className="shell contact-page-v2-hero">
        <Reveal variant="left">
          <div className="contact-page-v2-copy">
            <p className="eyebrow">{contactPage?.heroEyebrow || "About"}</p>
            <h1>{contactPage?.heroTitle || "Independent veterinary care in Sutton, designed to feel calm, clear, and personal."}</h1>
            <p>{contactPage?.heroDescription || "A smaller independent practice where practical information is easy to find and each visit can be planned with confidence."}</p>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={40}>
          <div className="contact-page-v2-summary">
            <p className="eyebrow">{contactPage?.summaryEyebrow || "At A Glance"}</p>
            <ul>
              {summaryPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="shell contact-page-v2-grid">
        <Reveal variant="left">
          <div className="contact-page-v2-panel" id="opening-times">
            <p className="eyebrow">{contactPage?.openEyebrow || "Clinic Hours"}</p>
            <h2>{contactPage?.openTitle || "Visit times kept simple."}</h2>
            <div className="contact-page-v2-hours">
              {hours.map((item) => (
                <div key={item.day}>
                  <span>{item.day}</span>
                  <strong>{item.hours}</strong>
                </div>
              ))}
            </div>
            <p>{contactPage?.openDescription || "Appointments can be requested through the website at any time."}</p>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div className="contact-page-v2-panel contact-page-v2-panel-soft" id="parking-access">
            <p className="eyebrow">{contactPage?.parkingEyebrow || "Parking & Access"}</p>
            <h2>{contactPage?.parkingTitle || "Arrival guidance for a calmer first visit."}</h2>
            <div className="contact-page-v2-notes">
              {arrivalNotes.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>


      <section className="shell contact-page-v2-community">
        <Reveal variant="left">
          <div className="contact-page-v2-community-copy">
            <p className="eyebrow">{contactPage?.communityEyebrow || "Community"}</p>
            <h2>{contactPage?.communityTitle || "Passionate about animals and our community."}</h2>
            <p>{contactPage?.communityText || "We are more than a veterinary surgery: a local practice supporting pet education, animal welfare, and neighbourhood connection."}</p>
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
            <p className="eyebrow">{contactPage?.detailsEyebrow || "Contact Details"}</p>
            <h2>{contactPage?.detailsTitle || "Everything important, in one place."}</h2>
            <div className="contact-page-v2-detail-list">
              {details.map((item) => (
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
            <p className="eyebrow">{contactPage?.locationEyebrow || "Find Us"}</p>
            <h2>{contactPage?.locationTitle || siteSettings.address}</h2>
            <p>{contactPage?.locationDescription || "Located near Hackbridge Rail Station, with nearby parking and step-free access."}</p>
            <div className="contact-page-v2-actions">
              <a className="button button-primary" href={siteSettings.hasMapUrl}>
                {contactPage?.locationButtonLabel || "Get Directions"}
              </a>
              <a className="button button-muted" href={siteSettings.googleBusinessProfileUrl} target="_blank" rel="noreferrer">
                Google Profile
              </a>
              <a className="button button-muted" href={siteSettings.ctas.call}>
                Call {siteSettings.phone}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={50}>
          <div className="contact-page-v2-map">
            <ConsentManagedMap
              src={contactPage?.locationMapEmbedUrl || siteSettings.googleMapEmbedUrl}
              title={`${siteSettings.practiceName} map`}
              actionHref={siteSettings.hasMapUrl}
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}



