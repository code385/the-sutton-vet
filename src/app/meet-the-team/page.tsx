import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { visualAssets } from "@/lib/visualAssets";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

const teamPlaceholders = [
  {
    role: "Clinical Lead",
    note: "Founder profile, qualifications, and clinical interests to be added.",
    focus: "Clinical standards",
  },
  {
    role: "Veterinary Surgeon",
    note: "Veterinary surgeon biography and portrait placeholder.",
    focus: "Consultations and treatment planning",
  },
  {
    role: "Registered Veterinary Nurse",
    note: "Nursing team details and patient-care approach to follow.",
    focus: "Patient comfort and nurse-led care",
  },
  {
    role: "Client Care Team",
    note: "Reception and client support introductions to be added.",
    focus: "Booking, registration, and owner support",
  },
];

const values = ["Kind communication", "Clear clinical options", "A calmer visit", "Continuity of care"];

export default async function MeetTheTeamPage() {
  const siteSettings = resolveSiteSettings(await getSiteSettingsDocument());
  return (
    <>
      <section className="team-studio-hero full-bleed-section">
        <div className="shell team-studio-hero-shell">
          <Reveal variant="left">
            <div className="team-studio-hero-copy">
              <p className="eyebrow">Meet The Team</p>
              <h1>Profiles are coming soon, but the tone is already personal.</h1>
              <p>
                This page is prepared for final portraits, names, qualifications, and short biographies. Until then, it gives visitors a warm sense of the people-led care behind The Sutton Vet without inventing details.
              </p>
              <div className="team-studio-actions">
                <Link className="button button-primary" href={siteSettings.ctas.register}>
                  Register Now
                </Link>
                <Link className="button button-muted" href="/about">
                  About The Practice
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delayMs={80}>
            <div className="team-studio-portrait-board" aria-label="Warm pet care preview">
              <div className="team-studio-image team-studio-image-large" style={{ backgroundImage: `url(${visualAssets.vetDoctorWithPet})` }} />
              <div className="team-studio-image team-studio-image-small" style={{ backgroundImage: `url(${visualAssets.gingerCatHero})` }} />
              <div className="team-studio-note-card">
                <span>Team page status</span>
                <strong>Portraits and bios to follow after approval.</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell team-studio-intro">
        <Reveal variant="up">
          <div className="team-studio-intro-copy">
            <p className="eyebrow">How it will feel</p>
            <h2>A quieter team page: clear roles first, fuller stories later.</h2>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={80}>
          <p>
            The design leaves space for real people rather than filling the page with generic biographies. Each profile can later hold a portrait, qualifications, interests, and a short note in the same calm visual system.
          </p>
        </Reveal>
      </section>

      <section className="shell team-studio-roster" aria-label="Team placeholders">
        <div className="team-studio-roster-heading">
          <p className="eyebrow">Team Structure</p>
          <h2>Role spaces ready for real introductions.</h2>
        </div>

        <div className="team-studio-role-list">
          {teamPlaceholders.map((member, index) => (
            <Reveal key={member.role} variant="up" delayMs={index * 55}>
              <article className="team-studio-role-row">
                <div className="team-studio-role-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="team-studio-role-main">
                  <span>{member.focus}</span>
                  <h3>{member.role}</h3>
                  <p>{member.note}</p>
                </div>
                <div className="team-studio-role-slot" aria-hidden="true">
                  <span>Profile</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="team-studio-promise full-bleed-section">
        <div className="shell team-studio-promise-shell">
          <Reveal variant="left">
            <div className="team-studio-promise-copy">
              <p className="eyebrow">Team Promise</p>
              <h2>Care should feel clear before, during, and after the appointment.</h2>
            </div>
          </Reveal>

          <div className="team-studio-values">
            {values.map((value, index) => (
              <Reveal key={value} variant="up" delayMs={index * 45}>
                <div className="team-studio-value">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{value}</strong>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}