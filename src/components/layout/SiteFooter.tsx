import Image from "next/image";
import Link from "next/link";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";

type SiteFooterProps = {
  siteSettings: ResolvedSiteSettings;
};

const careLinks = [
  { label: "Our Services", href: "/services" },
  { label: "Services & Pricing", href: "/fees" },
  { label: "Health Plan", href: "/health-plan" },
];

const resourceLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Business", href: "/terms" },
];

function SocialIcon({ label }: { label: string }) {
  const key = label.trim().toLowerCase();

  if (key.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5H16V5a14 14 0 0 0-2.1-.2c-2.1 0-3.6 1.3-3.6 3.8V11H8v3h2.3v7h3.2Z"
        />
      </svg>
    );
  }

  if (key.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.6" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.2" cy="6.9" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (key.includes("tiktok")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M14.8 4c.5 1.3 1.5 2.4 2.8 3.1.9.5 1.7.7 2.4.8v2.8c-1.3 0-2.7-.4-4-1.1v5.4a5 5 0 1 1-5-5c.4 0 .8 0 1.2.1v2.9a2.6 2.6 0 1 0 1.4 2.3V4h1.2Z"
        />
      </svg>
    );
  }

  if (key.includes("youtube")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M21 8.6a3 3 0 0 0-2.1-2.1C17 6 12 6 12 6s-5 0-6.9.5A3 3 0 0 0 3 8.6 31 31 0 0 0 2.5 12c0 1.2.1 2.4.5 3.4a3 3 0 0 0 2.1 2.1C7 18 12 18 12 18s5 0 6.9-.5a3 3 0 0 0 2.1-2.1c.4-1 .5-2.2.5-3.4s-.1-2.4-.5-3.4ZM10.3 14.9V9.1l5 2.9-5 2.9Z"
        />
      </svg>
    );
  }

  if (key.includes("google")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20.3 12.2c0-.6-.1-1.1-.2-1.6H12v3h4.6a4 4 0 0 1-1.7 2.6v2.2h2.8c1.7-1.5 2.6-3.8 2.6-6.2Z"
        />
        <path
          fill="currentColor"
          d="M12 20.5c2.3 0 4.2-.8 5.6-2.1l-2.8-2.2c-.8.5-1.7.9-2.8.9-2.1 0-3.9-1.4-4.5-3.4H4.6v2.3A8.5 8.5 0 0 0 12 20.5Z"
        />
        <path
          fill="currentColor"
          d="M7.5 13.7A5.1 5.1 0 0 1 7.2 12c0-.6.1-1.2.3-1.7V8H4.6a8.5 8.5 0 0 0 0 8l2.9-2.3Z"
        />
        <path
          fill="currentColor"
          d="M12 6.9c1.2 0 2.3.4 3.2 1.2l2.4-2.4A8.2 8.2 0 0 0 12 3.5 8.5 8.5 0 0 0 4.6 8l2.9 2.3c.6-2 2.4-3.4 4.5-3.4Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SiteFooter({ siteSettings }: SiteFooterProps) {
  return (
    <footer className="sv-footer sv-footer-expanded">
      <div className="shell sv-footer-top-v2">
        <div className="sv-footer-brand-column">
          <Link className="sv-footer-brand" href="/" aria-label="The Sutton Vet home">
            <Image src="/Sutton_vet_logo_aw.png" alt="The Sutton Vet logo" width={1269} height={698} />
          </Link>
          <p className="sv-footer-intro">{siteSettings.footerTagline || siteSettings.tagline}</p>

          <div className="sv-footer-quick-contact">
            <a href={siteSettings.ctas.call}>{siteSettings.phone}</a>
            <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
          </div>

          <div className="sv-footer-socials-v2" aria-label="Social links">
            {siteSettings.socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                <SocialIcon label={item.icon || item.label} />
              </a>
            ))}
          </div>
        </div>

        <div className="sv-footer-column">
          <h3>Contact Us</h3>
          <a href={siteSettings.ctas.call}>Call us</a>
          <a href={`mailto:${siteSettings.email}`}>Email us</a>
          <a href="/contact">Opening times</a>
          <p>{siteSettings.address}</p>
        </div>

        <div className="sv-footer-column">
          <h3>Company</h3>
          <Link href="/about">About Us</Link>
          <Link href="/meet-the-team">Meet The Team</Link>
          <Link href="/terms">Terms</Link>
          <a href={siteSettings.ctas.register}>Register Now</a>
        </div>

        <div className="sv-footer-column">
          <h3>Get Care</h3>
          {careLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="sv-footer-column">
          <h3>Resources</h3>
          {resourceLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="shell sv-footer-bottom-v2">
        <div className="sv-footer-legal-links-v2">
          {siteSettings.legalLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <p className="sv-footer-copyright-v2">(c) {new Date().getFullYear()} {siteSettings.practiceName}. All rights reserved.</p>
      </div>
    </footer>
  );
}

