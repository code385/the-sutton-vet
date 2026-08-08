"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";

type SiteHeaderProps = {
  siteSettings: ResolvedSiteSettings;
};

type NavChild = {
  label: string;
  href: string;
  description?: string;
};

type NavGroup = {
  label: string;
  href?: string;
  menuTitle?: string;
  menuCopy?: string;
  illustration?: "pets" | "about";
  children?: NavChild[];
};

const navGroups: NavGroup[] = [
  {
    label: "About",
    href: "/about",
    menuTitle: "About The Sutton Vet",
    menuCopy: "Opening times, parking, local access, and the practical details owners usually need first.",
    illustration: "about",
    children: [
      { label: "Overview", href: "/about", description: "Practice vision and a calmer introduction." },
      { label: "Opening Times", href: "/about#opening-times", description: "Weekly opening hours and visit planning." },
      { label: "Parking & Access", href: "/about#parking-access", description: "Parking guidance and local access notes." },
      { label: "Find Us", href: "/about#find-us", description: "Address, directions, and contact routes." },
      { label: "Meet The Team", href: "/meet-the-team", description: "Founder-led placeholder team area." },
    ],
  },
  {
    label: "Services",
    href: "/services",
    menuTitle: "Clinical care and referral-only services",
    menuCopy: "Everyday care, procedures, diagnostics, pricing, and referral-only soft tissue, orthopaedic, and endoscopy pathways.",
    illustration: "pets",
    children: [
      { label: "GP consultations", href: "/services/gp-consultations", description: "First appointments and follow-up care." },
      { label: "Dental care", href: "/services/dental-care", description: "Oral health checks and dental treatment." },
      { label: "Vaccinations", href: "/services/vaccinations", description: "Puppy, kitten, and booster care." },
      { label: "Neutering and keyhole spays", href: "/services/neutering-and-keyhole-spays", description: "Routine and laparoscopic options." },
      { label: "Pet behaviour", href: "/services/pet-behaviour", description: "Support for common behaviour concerns." },
      { label: "Pet travel health certificates", href: "/services/pet-travel-health-certificates", description: "Travel paperwork and checks." },
      { label: "In-house diagnostics", href: "/services/in-house-diagnostics", description: "Laboratory, X-ray, and ultrasound support." },
      { label: "Surgery and procedures", href: "/services/surgery-and-procedures", description: "Planned surgical care." },
      { label: "End of life care", href: "/services/end-of-life-care", description: "Gentle support and guidance." },
      { label: "Home visits", href: "/services/home-visits", description: "Scheduled care at home where appropriate." },
      { label: "Soft tissue referrals", href: "/services/soft-tissue-surgery-referrals", description: "Referral only." },
      { label: "Orthopaedic referrals", href: "/services/orthopaedic-surgery-referrals", description: "Referral only." },
      { label: "Endoscopy referrals", href: "/services/endoscopy-referrals", description: "Referral only." },
      { label: "Services & pricing", href: "/fees", description: "Transparent fee information." },
      { label: "Health Plan", href: "/health-plan", description: "Preventative care plans." },
    ],
  },
  { label: "Pricing", href: "/fees" },
  { label: "Health Plan", href: "/health-plan" },
];

export function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const [dropdownOffsets, setDropdownOffsets] = useState<Record<string, number>>({});

  function clearDropdownCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openDropdown(label: string) {
    clearDropdownCloseTimer();
    setOpenGroup(label);
  }

  function scheduleDropdownClose() {
    clearDropdownCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenGroup(null);
      closeTimerRef.current = null;
    }, 140);
  }

  function closeAll() {
    clearDropdownCloseTimer();
    setMenuOpen(false);
    setOpenGroup(null);
    setMobileOpenGroup(null);
  }

  useEffect(() => {
    closeAll();
  }, [pathname]);

  useEffect(() => {
    function updateOffsets() {
      const navRect = navRef.current?.getBoundingClientRect();
      if (!navRect) return;

      const nextOffsets: Record<string, number> = {};
      navGroups.forEach((group) => {
        const trigger = triggerRefs.current[group.label];
        if (!trigger) return;
        const triggerRect = trigger.getBoundingClientRect();
        nextOffsets[group.label] = triggerRect.left - navRect.left + triggerRect.width / 2;
      });
      setDropdownOffsets(nextOffsets);
    }

    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

  return (
    <header className="sv-header sv-header-clean">
      <div className="shell sv-header-main sv-header-main-clean">
        <Link className="sv-header-brand sv-header-brand-clean" href="/" aria-label="The Sutton Vet home" onClick={closeAll}>
          <Image src="/Sutton_vet_logo_aw.png" alt="The Sutton Vet logo" width={1269} height={698} priority />
        </Link>

        <nav ref={navRef} className="sv-nav sv-nav-clean" aria-label="Primary">
          {navGroups.map((group) => {
            const isOpen = openGroup === group.label;
            const hasChildren = Boolean(group.children?.length);
            const dropdownStyle = hasChildren
              ? ({ "--dropdown-anchor": `${dropdownOffsets[group.label] ?? 0}px` } as CSSProperties)
              : undefined;

            return (
              <div
                key={group.label}
                className={`sv-nav-group${isOpen ? " is-open" : ""}`}
                data-nav-group={group.label}
                onMouseEnter={() => hasChildren && openDropdown(group.label)}
                onMouseLeave={() => hasChildren && scheduleDropdownClose()}
              >
                {hasChildren ? (
                  <button
                    ref={(node) => {
                      triggerRefs.current[group.label] = node;
                    }}
                    type="button"
                    className="sv-nav-trigger sv-nav-trigger-clean"
                    aria-expanded={isOpen}
                    onClick={() => (isOpen ? setOpenGroup(null) : openDropdown(group.label))}
                  >
                    <span>{group.label}</span>
                  </button>
                ) : (
                  <Link className="sv-nav-link sv-nav-link-clean" href={group.href || "/"} onClick={closeAll}>
                    {group.label}
                  </Link>
                )}

                {hasChildren ? (
                  <div
                    className="sv-nav-dropdown-wrap"
                    style={dropdownStyle}
                    onMouseEnter={() => openDropdown(group.label)}
                    onMouseLeave={scheduleDropdownClose}
                  >
                    <div className={`sv-nav-dropdown sv-nav-dropdown-${group.illustration || "pets"}`}>
                      <div className="sv-nav-dropdown-feature">
                        <div className="sv-nav-dropdown-copy">
                          <p className="eyebrow">{group.label}</p>
                          <h3>{group.menuTitle}</h3>
                          <p>{group.menuCopy}</p>
                        </div>
                        <div className="sv-nav-dropdown-art" aria-hidden="true">
                          <Image className="sv-nav-pets-art" src="/dropdown-pets-art.png" alt="" width={420} height={250} />
                        </div>
                      </div>

                      <div className="sv-nav-dropdown-links">
                        {group.children?.map((item) => (
                          <Link key={item.label} href={item.href} onClick={closeAll}>
                            <strong>{item.label}</strong>
                            <span>{item.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="sv-header-actions sv-header-actions-clean">
          <a className="button button-muted" href={siteSettings.ctas.book}>
            {siteSettings.headerCtas.bookLabel}
          </a>
          <a className="button button-primary" href={siteSettings.ctas.register}>
            {siteSettings.headerCtas.registerLabel}
          </a>
        </div>

        <button
          type="button"
          className={`sv-menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="sv-mobile-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="sv-mobile-menu" className={`shell sv-mobile-menu${menuOpen ? " is-open" : ""}`}>
        <div className="sv-mobile-menu-inner sv-mobile-menu-inner-simple">
          {navGroups.map((group) => {
            const hasChildren = Boolean(group.children?.length);
            const isMobileOpen = mobileOpenGroup === group.label;

            return (
              <div key={group.label} className="sv-mobile-group sv-mobile-group-simple">
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      className={`sv-mobile-group-link sv-mobile-group-link-simple sv-mobile-group-trigger${isMobileOpen ? " is-open" : ""}`}
                      aria-expanded={isMobileOpen}
                      onClick={() => setMobileOpenGroup(isMobileOpen ? null : group.label)}
                    >
                      <span>{group.label}</span>
                    </button>
                    <div className={`sv-mobile-submenu sv-mobile-submenu-simple${isMobileOpen ? " is-open" : ""}`}>
                      {group.children?.map((item) => (
                        <Link key={item.label} href={item.href} onClick={closeAll}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link className="sv-mobile-group-link sv-mobile-group-link-simple" href={group.href || "/"} onClick={closeAll}>
                    {group.label}
                  </Link>
                )}
              </div>
            );
          })}

          <div className="sv-mobile-actions sv-mobile-actions-simple">
            <a className="button button-primary" href={siteSettings.ctas.register}>
              {siteSettings.headerCtas.registerLabel}
            </a>
            <a className="button button-muted" href={siteSettings.ctas.book}>
              {siteSettings.headerCtas.bookLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}





