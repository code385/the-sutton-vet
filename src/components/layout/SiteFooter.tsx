import Image from "next/image";
import Link from "next/link";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";

type SiteFooterProps = {
  siteSettings: ResolvedSiteSettings;
};

export function SiteFooter({ siteSettings }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="shell footer-minimal-top">
        <div className="footer-brand-block">
          <Link className="footer-brand" href="/" aria-label="The Sutton Vet home">
            <Image src="/sutton-vet-logo.svg" alt="The Sutton Vet logo" width={244} height={158} />
          </Link>
          <p className="footer-copy">{siteSettings.footerTagline}</p>
        </div>

        <div className="footer-contact-block">
          <p className="footer-title">Contact</p>
          <div className="footer-stack">
            <a href={siteSettings.ctas.call}>{siteSettings.phone}</a>
            <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
            <span>{siteSettings.address}</span>
          </div>
        </div>
      </div>

      <div className="shell footer-meta">
        <div className="footer-socials">
          {siteSettings.socialLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>

        <div className="footer-compliance">
          {siteSettings.complianceLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <p className="footer-copyright">
          Copyright {new Date().getFullYear()} {siteSettings.practiceName}
        </p>
      </div>
    </footer>
  );
}
