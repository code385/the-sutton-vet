import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { getLupaIntegrationStatus } from "@/lib/lupa";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

export default async function PmsIntegrationPage() {
  const siteSettingsDocument = await getSiteSettingsDocument();
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const lupaStatus = getLupaIntegrationStatus();
  const isApiReady = lupaStatus.hasApiKey && lupaStatus.hasCompanyId && lupaStatus.hasStoreId;

  return (
    <main className="pms-page">
      <section className="shell pms-hero">
        <Reveal variant="left">
          <div className="pms-copy">
            <p className="eyebrow">Lupa PMS</p>
            <h1>Online booking and registration are being connected through Lupa.</h1>
            <p>
              The website is now prepared for Lupa-managed registration, appointments, clients, pets, services, and Health Plan data. The API key stays server-side, while public buttons can route to the final Lupa booking and registration journeys once those client-facing URLs are confirmed.
            </p>
            <div className="pms-actions">
              <a className="button button-primary" href={siteSettings.ctas.call}>Call the clinic</a>
              <Link className="button button-muted" href="/contact">Contact details</Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={80}>
          <div className="pms-status-panel">
            <p className="eyebrow">Integration Map</p>
            <div className="pms-status-list">
              <div>
                <span>01</span>
                <strong>Register Now</strong>
                <p>Routes to Lupa for client and pet registration once the public registration URL or embedded journey is confirmed.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Book Online</strong>
                <p>Ready to use Lupa appointment types and availability. Final booking UX can be portal link or custom on-site form.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Payments and Klarna</strong>
                <p>Lupa exposes payment data. Lupa Pay and Klarna checkout should be enabled only after payment flow confirmation.</p>
              </div>
              <div>
                <span>04</span>
                <strong>Health Plan</strong>
                <p>Health Plan API endpoints are available, but sign-up/direct debit flow is still waiting on the client&apos;s final decision.</p>
              </div>
            </div>
            <div className="pms-config-note">
              <strong>{isApiReady ? "Server API config detected" : "Server API config pending"}</strong>
              <p>{isApiReady ? "The required Lupa environment variables are present." : "Add LUPA_API_KEY, LUPA_COMPANY_ID, and LUPA_STORE_ID in Vercel before testing live API calls."}</p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
