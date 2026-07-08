import { Reveal } from "@/components/shared/Reveal";
import { SectionCta } from "@/components/shared/SectionCta";
import { getContactPageDocument } from "@/sanity/lib/contentPages";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

type QuickLink = {
  title: string;
  value: string;
  href: string;
  meta: string;
  icon: string;
};

function ContactGlyph({ name }: { name: string }) {
  switch (name) {
    case "phone":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M22 15h9l3 12-6 4c3 6 8 11 14 14l4-6 12 3v9c0 3-2 5-5 5C30 56 8 34 8 11c0-3 2-5 5-5h9Z" />
        </svg>
      );
    case "pin":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 56s15-14 15-28c0-8-7-15-15-15s-15 7-15 15c0 14 15 28 15 28Z" />
          <circle cx="32" cy="28" r="6" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="10" y="16" width="44" height="32" rx="6" />
          <path d="m14 22 18 13 18-13" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="17" cy="32" r="5" />
          <circle cx="47" cy="18" r="5" />
          <circle cx="47" cy="46" r="5" />
          <path d="M22 30 42 20M22 34l20 10" />
        </svg>
      );
  }
}

export default async function ContactPage() {
  const [contactPageDocument, siteSettingsDocument] = await Promise.all([
    getContactPageDocument(),
    getSiteSettingsDocument(),
  ]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);

  const defaultQuickLinks: QuickLink[] = [
    {
      title: "Call us",
      value: siteSettings.phone,
      href: siteSettings.ctas.call,
      meta: "Fastest route for appointments and practical questions",
      icon: "phone",
    },
    {
      title: "Visit us",
      value: siteSettings.address,
      href: siteSettings.hasMapUrl,
      meta: "Directions, local travel guidance, and nearby access",
      icon: "pin",
    },
    {
      title: "Email us",
      value: siteSettings.email,
      href: `mailto:${siteSettings.email}`,
      meta: "Useful for non-urgent admin and document requests",
      icon: "mail",
    },
    {
      title: "Connect with us",
      value: "Instagram & Facebook",
      href:
        siteSettings.socialLinks.find((item) => item.label === "Instagram")?.href ||
        siteSettings.socialLinks[0]?.href ||
        "/",
      meta: "Follow updates and opening momentum as the practice grows",
      icon: "share",
    },
  ];

  const quickLinks = contactPageDocument?.quickLinks?.filter((item) => item.title && item.value && item.href).length
    ? contactPageDocument.quickLinks
        .filter((item) => item.title && item.value && item.href)
        .map((item) => ({
          title: item.title || "",
          value: item.value || "",
          href: item.href || "/",
          meta: item.meta || "",
          icon: item.icon || "share",
        }))
    : defaultQuickLinks;

  const socialCards = contactPageDocument?.socialCards?.filter((item) => item.title && item.href).length
    ? contactPageDocument.socialCards
        .filter((item) => item.title && item.href)
        .map((item) => ({
          title: item.title || "",
          description: item.description || "",
          ctaLabel: item.ctaLabel || "Open",
          href: item.href || "/",
          icon: item.icon || "share",
        }))
    : [
      {
        title: "Facebook",
        description: "Updates, launch momentum, and local practice news.",
        ctaLabel: "Join us",
        href: siteSettings.socialLinks.find((item) => item.label === "Facebook")?.href || "/",
        icon: "facebook",
      },
      {
        title: "Instagram",
        description: "Follow practice visuals, opening updates, and behind-the-scenes content.",
        ctaLabel: "Follow us",
        href: siteSettings.socialLinks.find((item) => item.label === "Instagram")?.href || "/",
        icon: "instagram",
      },
    ];

  const openingSchedule = siteSettings.openingHours;
  const openMetaLines = contactPageDocument?.openMetaLines?.length
    ? contactPageDocument.openMetaLines
    : [`Phone: ${siteSettings.phone}`, `Address: ${siteSettings.address}`, `Email: ${siteSettings.email}`];
  const openCtas =
    contactPageDocument?.openCtas?.filter((item) => item.label && item.href).length
      ? contactPageDocument.openCtas.filter((item) => item.label && item.href)
      : [
      { label: "Book Online", href: siteSettings.ctas.book, variant: "primary" },
      { label: "Register Now", href: siteSettings.ctas.register, variant: "muted" },
    ];
  const mapLabelTitle = contactPageDocument?.locationMapLabelTitle || "The Sutton Vet";
  const mapLabelText = contactPageDocument?.locationMapLabelText || siteSettings.address;
  const mapEmbedUrl = contactPageDocument?.locationMapEmbedUrl || siteSettings.googleMapEmbedUrl;

  return (
    <>
      <section
        className="contact-hero full-bleed-section"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(18, 28, 42, 0.8), rgba(18, 28, 42, 0.34)), url(${contactPageDocument?.heroImageUrl || "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1800&q=80"})`,
        }}
      >
        <div className="shell contact-hero-shell">
          <Reveal variant="left">
            <div className="contact-hero-copy">
              <p className="eyebrow">{contactPageDocument?.heroEyebrow || "Contact & Emergency Care"}</p>
              <h1>{contactPageDocument?.heroTitle || "Simple contact, clear urgent routing."}</h1>
              <p>
                {contactPageDocument?.heroDescription ||
                  "For bookings, registration, location guidance, and out-of-hours support, this page should make the next step obvious within seconds."}
              </p>
              <div className="cta-actions" id="book">
                <a
                  className="button button-primary"
                  href={contactPageDocument?.heroPrimaryCtaHref || siteSettings.ctas.book}
                >
                  {contactPageDocument?.heroPrimaryCtaLabel || "Book Online"}
                </a>
                <a
                  className="button button-muted"
                  href={contactPageDocument?.heroSecondaryCtaHref || siteSettings.ctas.register}
                  id="register"
                >
                  {contactPageDocument?.heroSecondaryCtaLabel || "Register Now"}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="contact-quick-links section-surface">
        <div className="shell contact-link-grid">
          {quickLinks.map((item, index) => (
            <Reveal key={item.title} variant="up" delayMs={index * 45}>
              <a className="contact-link-card" href={item.href}>
                <span className="contact-link-icon">
                  <ContactGlyph name={item.icon} />
                </span>
                <p className="eyebrow">{item.title}</p>
                <h2>{item.value}</h2>
                <p>{item.meta}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell two-column-panels contact-action-panels">
        <Reveal variant="left">
          <article className="panel contact-open-panel">
            <p className="eyebrow">{contactPageDocument?.openEyebrow || "Open Practice Hours"}</p>
            <h2>{contactPageDocument?.openTitle || "Book, register, or ask a practical question."}</h2>
            <p>
              {contactPageDocument?.openDescription ||
                "During practice hours, the quickest route is to call, book online, or use the registration flow. Keep first-visit questions and local access details surfaced early rather than hiding them deeper in the site."}
            </p>
            <div className="contact-meta-stack">
              {openMetaLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="cta-actions">
              {openCtas.map((item) => (
                <a
                  key={`${item.label}-${item.href}`}
                  className={`button ${item.variant === "muted" ? "button-muted" : "button-primary"}`}
                  href={item.href || "/"}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal variant="right">
          <article className="panel panel-emergency contact-emergency-panel">
            <p className="eyebrow">{contactPageDocument?.emergencyEyebrow || "Out-of-Hours Emergency Care"}</p>
            <h2>{contactPageDocument?.emergencyTitle || "Urgent care should feel immediate and unmistakable."}</h2>
            <p>
              {contactPageDocument?.emergencyDescription ||
                "If the practice is closed and your pet needs urgent help, call the emergency line straight away. Mobile users should not need to hunt for the correct route."}
            </p>
            <div className="contact-emergency-list">
              {(contactPageDocument?.emergencyPoints?.length
                ? contactPageDocument.emergencyPoints
                : [
                    "Use the emergency number outside normal practice hours",
                    "In-hours urgent cases should still call the main practice number first",
                    "Emergency routing remains prominent on mobile and sticky navigation paths",
                  ]).map((point) => (
                <div key={point} className="list-row">
                  <span className="list-dot" />
                  <p>{point}</p>
                </div>
              ))}
            </div>
            <a className="button button-emergency" href={siteSettings.ctas.emergency}>
              {contactPageDocument?.emergencyButtonLabel || "Call Emergency Line"}
            </a>
          </article>
        </Reveal>
      </section>

      <section className="contact-hours section-surface">
        <div className="shell">
          <Reveal variant="up">
            <div className="section-heading section-heading-center contact-section-heading">
              <p className="eyebrow">{contactPageDocument?.hoursEyebrow || "Opening Hours"}</p>
              <h2>{contactPageDocument?.hoursTitle || "When we are open"}</h2>
            </div>
          </Reveal>

          <div className="contact-hours-grid">
            {openingSchedule.map((item, index) => (
              <Reveal key={item.day} variant="up" delayMs={index * 25}>
                <article className="contact-hours-row">
                  <span>{item.day}</span>
                  <strong>{item.hours}</strong>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell contact-location-section">
        <Reveal variant="left">
          <article className="contact-location-copy">
            <p className="eyebrow">{contactPageDocument?.locationEyebrow || "Find Us"}</p>
            <h2>{contactPageDocument?.locationTitle || "How to find us"}</h2>
            <p>
              {contactPageDocument?.locationDescription ||
                `The Sutton Vet is based at ${siteSettings.address}. The contact journey should reassure new clients with a clear map, straightforward access guidance, and practical next steps before the visit.`}
            </p>
            <div className="contact-location-points">
              {(contactPageDocument?.locationPoints?.length
                ? contactPageDocument.locationPoints
                : [
                    "Hackbridge and Sutton coverage surfaced clearly for local reassurance",
                    "Directions and map access available without extra clicks",
                    "Call first if you need help with parking or arrival guidance",
                  ]).map((point) => (
                <div key={point} className="list-row">
                  <span className="list-dot" />
                  <p>{point}</p>
                </div>
              ))}
            </div>
            <a className="button button-primary" href={contactPageDocument?.locationButtonHref || siteSettings.hasMapUrl}>
              {contactPageDocument?.locationButtonLabel || "Get Directions"}
            </a>
          </article>
        </Reveal>

        <Reveal variant="mask">
          <div className="contact-map-frame">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title="The Sutton Vet map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="contact-map-visual" aria-label="Location preview map">
                <div className="trust-map-grid" />
                <div className="trust-map-route trust-map-route-a" />
                <div className="trust-map-route trust-map-route-b" />
                <div className="trust-map-pin trust-map-pin-primary">
                  <span />
                </div>
                <div className="trust-map-pin trust-map-pin-secondary">
                  <span />
                </div>
              </div>
            )}
            <div className="contact-map-overlay-copy">
              <p className="eyebrow">Always Visible</p>
              <h3>{mapLabelTitle}</h3>
              <p>{mapLabelText}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="contact-social-section full-bleed-section">
        <div className="shell contact-social-grid">
          {socialCards.map((card, index) => (
            <Reveal key={card.title} variant={index % 2 === 0 ? "left" : "right"}>
              <a className="contact-social-card" href={card.href}>
                <div className="contact-social-icon">
                  <span>{card.icon === "facebook" ? "f" : card.icon === "instagram" ? "◎" : "↗"}</span>
                </div>
                <div className="contact-social-copy">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <span className="text-link">{card.ctaLabel}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <SectionCta
        eyebrow={contactPageDocument?.ctaEyebrow || "Next Step"}
        title={contactPageDocument?.ctaTitle || "Need help before booking?"}
        text={contactPageDocument?.ctaText || "Call, WhatsApp, or use the online booking route if you want help choosing the right next step."}
        primaryLabel={contactPageDocument?.ctaPrimaryLabel}
        primaryHref={contactPageDocument?.ctaPrimaryHref}
        secondaryLabel={contactPageDocument?.ctaSecondaryLabel}
        secondaryHref={contactPageDocument?.ctaSecondaryHref}
      />
    </>
  );
}
