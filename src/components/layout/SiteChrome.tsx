"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { ResolvedSiteSettings } from "@/sanity/lib/siteSettings";

type SiteChromeProps = {
  children: ReactNode;
  siteSettings: ResolvedSiteSettings;
  emergencyKeywords: string[];
};

export function SiteChrome({ children, siteSettings, emergencyKeywords }: SiteChromeProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader siteSettings={siteSettings} />
      <main className="page-shell">
        <div className="shell">{children}</div>
      </main>
      <SiteFooter siteSettings={siteSettings} />
      <ChatWidget siteSettings={siteSettings} emergencyKeywords={emergencyKeywords} />
      <CookieConsent />
    </>
  );
}
