"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";

type SiteHeaderProps = {
  siteSettings: ResolvedSiteSettings;
};

export function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`site-header${menuOpen ? " is-menu-open" : ""}`}>
      <div className="topbar">
        <div className="shell topbar-inner">
          <div className="topbar-legal-links" aria-label="Policy links">
            {siteSettings.legalLinks.map((item, index) => (
              <span key={item.label} className="topbar-legal-item">
                <Link href={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
                {index < siteSettings.legalLinks.length - 1 ? <span className="topbar-separator">|</span> : null}
              </span>
            ))}
          </div>

          <div className="topbar-contact-group">
            <div className="topbar-callout">
              <span>Call Us On</span>
              <a href={siteSettings.ctas.call}>{siteSettings.phone}</a>
            </div>

            <div className="topbar-socials" aria-label="Social links">
              {siteSettings.socialLinks.slice(0, 2).map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  {item.label === "Facebook" ? "f" : "◎"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell navbar">
        <div className="navbar-main-row">
          <Link className="brand" href="/" aria-label="The Sutton Vet home" onClick={closeMenu}>
            <Image src="/sutton-vet-logo.svg" alt="The Sutton Vet logo" width={248} height={160} priority />
          </Link>

          <nav className="nav nav-desktop" aria-label="Primary">
            {siteSettings.mainNav.map((item) => (
              <Link key={item.label} href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions header-actions-desktop">
            <a className="button button-emergency" href={siteSettings.ctas.emergency}>
              {siteSettings.headerCtas.emergencyLabel}
            </a>
            <a className="button button-muted" href={siteSettings.ctas.book}>
              {siteSettings.headerCtas.bookLabel}
            </a>
            <a className="button button-primary" href={siteSettings.ctas.register}>
              {siteSettings.headerCtas.registerLabel}
            </a>
          </div>

          <div className="mobile-header-actions">
            <a className="button button-muted mobile-quick-action" href={siteSettings.ctas.book}>
              {siteSettings.headerCtas.bookLabel.replace(" Online", "")}
            </a>
            <a className="button button-primary mobile-quick-action" href={siteSettings.ctas.register}>
              {siteSettings.headerCtas.registerLabel.replace(" Now", "")}
            </a>
            <button
              type="button"
              className={`menu-toggle${menuOpen ? " is-open" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="mobile-site-menu"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div id="mobile-site-menu" className={`mobile-menu${menuOpen ? " is-open" : ""}`}>
          <nav className="mobile-menu-nav" aria-label="Mobile primary">
            {siteSettings.mainNav.map((item) => (
              <Link key={item.label} href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-actions">
            <a className="button button-emergency" href={siteSettings.ctas.emergency}>
              {siteSettings.headerCtas.emergencyLabel}
            </a>
            <a className="button button-muted" href={siteSettings.ctas.book}>
              {siteSettings.headerCtas.bookLabel}
            </a>
            <a className="button button-primary" href={siteSettings.ctas.register}>
              {siteSettings.headerCtas.registerLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
