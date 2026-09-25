import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { visualAssets } from "@/lib/visualAssets";
import { getTeamPageDocument } from "@/sanity/lib/contentPages";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";
import { getTeamMembers } from "@/sanity/lib/teamMembers";

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
  const [siteSettingsDocument, teamPage, cmsMembers] = await Promise.all([getSiteSettingsDocument(), getTeamPageDocument(), getTeamMembers()]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const teamRows = cmsMembers.length ? cmsMembers.map((member) => ({
    id: member._id,
    role: member.name || member.role || "Team member",
    note: member.shortBio || member.bio || "Profile details coming soon.",
    focus: [member.role, member.qualifications].filter(Boolean).join(" ? ") || member.category || "The Sutton Vet team",
    image: member.image?.asset?.url || member.imageUrl,
  })) : teamPlaceholders.map((member) => ({ ...member, id: member.role, image: undefined }));
  const teamValues = teamPage?.values?.length ? teamPage.values : values;
  return (
    <>
      <section className="team-studio-hero full-bleed-section">
        <div className="shell team-studio-hero-shell">
          <Reveal variant="left">
            <div className="team-studio-hero-copy">
              <p className="eyebrow">{teamPage?.heroEyebrow || "Meet The Team"}</p>
              <h1>{teamPage?.heroTitle || "Meet the people behind your pet's care."}</h1>
              <p>{teamPage?.heroDescription || "Names, qualifications, portraits, and biographies can be added as the team grows."}</p>
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
              <div className="team-studio-image team-studio-image-large" style={{ backgroundImage: `url(${teamPage?.heroImageUrl || visualAssets.vetDoctorWithPet})` }} />
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
            <p className="eyebrow">{teamPage?.introEyebrow || "Our people"}</p>
            <h2>{teamPage?.introTitle || "Clear roles and genuine introductions."}</h2>
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={80}>
          <p>{teamPage?.introDescription || "Each profile can include a portrait, qualifications, clinical interests, and a short biography."}</p>
        </Reveal>
      </section>

      <section className="shell team-studio-roster" aria-label="Team placeholders">
        <div className="team-studio-roster-heading">
          <p className="eyebrow">Team Structure</p>
          <h2>Role spaces ready for real introductions.</h2>
        </div>

        <div className="team-studio-role-list">
          {teamRows.map((member, index) => (
            <Reveal key={member.id} variant="up" delayMs={index * 55}>
              <article className="team-studio-role-row">
                <div className="team-studio-role-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="team-studio-role-main">
                  <span>{member.focus}</span>
                  <h3>{member.role}</h3>
                  <p>{member.note}</p>
                </div>
                <div className="team-studio-role-slot" style={member.image ? { backgroundImage: `url(${member.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} aria-hidden="true">
                  {!member.image ? <span>Profile</span> : null}
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
              <p className="eyebrow">{teamPage?.promiseEyebrow || "Team Promise"}</p>
              <h2>{teamPage?.promiseTitle || "Care should feel clear before, during, and after the appointment."}</h2>
            </div>
          </Reveal>

          <div className="team-studio-values">
            {teamValues.map((value, index) => (
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
