import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

export default async function PmsIntegrationPage() {
  const siteSettingsDocument = await getSiteSettingsDocument();
  const siteSettings = resolveSiteSettings(siteSettingsDocument);

  return (
    <main className="pms-page">
      <section className="shell pms-hero">
        <Reveal variant="left">
          <div className="pms-copy">
            <p className="eyebrow">Booking Portal</p>
            <h1>PMS integration needed before online booking goes live.</h1>
            <p>
              This route is reserved for the practice management system connection. Once the PMS is connected, both registration and appointment booking will open through the approved online portal.
            </p>
            <div className="pms-actions">
              <a className="button button-primary" href={siteSettings.ctas.call}>Call the clinic</a>
              <Link className="button button-muted" href="/contact">View contact details</Link>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delayMs={80}>
          <div className="pms-status-panel">
            <p className="eyebrow">Current Status</p>
            <div className="pms-status-list">
              <div>
                <span>01</span>
                <strong>Register Now</strong>
                <p>Will connect to the PMS registration journey.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Book Online</strong>
                <p>Will connect to the PMS appointment booking journey.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Health Plan</strong>
                <p>Can also be routed through the same approved portal once confirmed.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
