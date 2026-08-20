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
              The website is prepared for Lupa-managed registration, appointments, clients, pets, services, and Health Plan data. Until sandbox endpoint access is confirmed, the live website can continue using its current content and handover pages without breaking.
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
                <p>Can switch to the final Lupa registration journey as soon as the public registration URL or embedded flow is confirmed.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Book Online</strong>
                <p>Appointment-type syncing is ready in code. Until access is confirmed, booking can keep routing through the temporary handover page.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Payments and Klarna</strong>
                <p>Payment messaging can stay visible on-site, while the final online payment flow is enabled only after Lupa Pay or another gateway is confirmed.</p>
              </div>
              <div>
                <span>04</span>
                <strong>Health Plan</strong>
                <p>Health Plan API support is prepared, but sign-up and billing should remain on the current website flow until the client confirms the final setup.</p>
              </div>
            </div>
            <div className="pms-config-note">
              <strong>{isApiReady ? "Server API config detected" : "Server API config pending"}</strong>
              <p>
                {isApiReady
                  ? "The required Lupa environment variables are present. If sandbox calls still fail, the remaining step is Lupa-side endpoint permission or scope approval for this key."
                  : "Add LUPA_API_KEY, LUPA_COMPANY_ID, and LUPA_STORE_ID in Vercel before testing live API calls."}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}