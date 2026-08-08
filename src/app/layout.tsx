import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { bodyFont, headingFont } from "@/lib/brand";
import { getEmergencySettingsDocument, resolveEmergencyKeywords } from "@/sanity/lib/emergency";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import "./theme.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Sutton Vet",
  description: "Independent veterinary care in Sutton with a mindful, gentle, and clearly structured digital experience.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettingsDocument, emergencySettingsDocument] = await Promise.all([
    getSiteSettingsDocument(),
    getEmergencySettingsDocument(),
  ]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const emergencyKeywords = resolveEmergencyKeywords(emergencySettingsDocument);
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "VeterinaryCare"],
    name: siteSettings.practiceName,
    telephone: siteSettings.phone,
    email: siteSettings.email,
    url: "https://thesuttonvet.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.address,
      addressLocality: "Sutton",
      addressCountry: "GB",
    },
    hasMap: siteSettings.hasMapUrl,
    sameAs: [
      siteSettings.googleBusinessProfileUrl,
      ...siteSettings.socialLinks.map((item) => item.href),
    ].filter(Boolean),
    knowsAbout: siteSettings.knowsAbout,
    openingHoursSpecification: siteSettings.openingHours.map((item) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: item.day,
      opens: item.hours.toLowerCase().includes("closed") ? undefined : item.hours.split("-")[0]?.trim(),
      closes: item.hours.toLowerCase().includes("closed") ? undefined : item.hours.split("-")[1]?.trim(),
    })),
    geo:
      typeof siteSettings.latitude === "number" && typeof siteSettings.longitude === "number"
        ? {
            "@type": "GeoCoordinates",
            latitude: siteSettings.latitude,
            longitude: siteSettings.longitude,
          }
        : undefined,
  };

  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <SiteChrome siteSettings={siteSettings} emergencyKeywords={emergencyKeywords}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
