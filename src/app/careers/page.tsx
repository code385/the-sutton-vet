import type { Metadata } from "next";
import Image from "next/image";
import { careersPageDefaults, defaultVacancy } from "@/lib/careersContent";
import { visualAssets } from "@/lib/visualAssets";
import { getCareersPageDocument } from "@/sanity/lib/careers";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

export const metadata: Metadata = {
  title: "Careers | The Sutton Vet",
  description: "Join The Sutton Vet in Hackbridge, Sutton. Explore our current veterinary vacancies.",
};

export default async function CareersPage() {
  const [careersDocument, siteSettingsDocument] = await Promise.all([
    getCareersPageDocument(),
    getSiteSettingsDocument(),
  ]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const vacancies = (careersDocument?.vacancies ?? [defaultVacancy]).filter((vacancy) => vacancy.active !== false);

  return (
    <main className="careers-page">
      <section className="careers-hero full-bleed-section" aria-labelledby="careers-title">
        <div className="shell careers-hero-shell">
          <div className="careers-hero-copy">
            <p className="eyebrow">{careersDocument?.eyebrow || careersPageDefaults.eyebrow}</p>
            <h1 id="careers-title">{careersDocument?.title || careersPageDefaults.title}</h1>
            <p>{careersDocument?.description || careersPageDefaults.description}</p>
            <a className="button button-primary" href="#vacancies">
              {vacancies.length ? "View vacancies" : "Get in touch"}
            </a>
          </div>
          <div className="careers-hero-media">
            <Image src={visualAssets.vetDoctorWithPet} alt="Gentle care for a cat at the veterinary practice"
              fill sizes="(max-width: 760px) 100vw, 46vw" priority />
          </div>
        </div>
      </section>

      <section id="vacancies" className="shell careers-vacancies" aria-label="Current vacancies">
        {vacancies.length ? vacancies.map((vacancy, vacancyIndex) => {
          const email = vacancy.applicationEmail || siteSettings.email;
          const subject = encodeURIComponent(`${vacancy.title || "Career"} application - The Sutton Vet`);
          const detailGroups = [
            { title: "The role", items: vacancy.responsibilities },
            { title: "About you", items: vacancy.requirements },
            { title: "Working with us", items: vacancy.benefits },
          ].filter((group) => group.items?.length);

          return (
            <article key={vacancy._key || vacancy.title || vacancyIndex} className="careers-role">
              <div className="careers-role-header">
                <div className="careers-role-copy">
                  <p className="careers-hiring-label"><span aria-hidden="true" />Now hiring</p>
                  <h2>{vacancy.title || "Veterinary Nurse"}</h2>
                  {vacancy.summary ? <p>{vacancy.summary}</p> : null}
                  <dl className="careers-role-meta">
                    <div><dt>Location</dt><dd>{vacancy.location || "Hackbridge, Sutton"}</dd></div>
                    {vacancy.employmentType ? <div><dt>Hours</dt><dd>{vacancy.employmentType}</dd></div> : null}
                    {vacancy.salary ? <div><dt>Salary</dt><dd>{vacancy.salary}</dd></div> : null}
                    {vacancy.applicationDeadline ? <div><dt>Apply by</dt><dd>{vacancy.applicationDeadline}</dd></div> : null}
                  </dl>
                </div>
                <div className="careers-apply">
                  <h3>Interested?</h3>
                  <p>Send your CV and a short introduction.</p>
                  <a className="button button-primary" href={`mailto:${email}?subject=${subject}`}>
                    {vacancy.applicationLabel || "Apply by email"}
                  </a>
                  <a className="careers-email" href={`mailto:${email}?subject=${subject}`}>{email}</a>
                </div>
              </div>
              {detailGroups.length ? (
                <details className="careers-role-details">
                  <summary>About this role</summary>
                  <div className="careers-role-columns">
                    {detailGroups.map((group) => (
                      <div key={group.title}>
                        <h3>{group.title}</h3>
                        <ul>{group.items?.map((item, index) => <li key={index}>{item}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </article>
          );
        }) : (
          <div className="careers-empty">
            <h2>No current vacancies</h2>
            <p>{careersDocument?.generalEnquiryText || "Interested in joining us? We'd love to hear from you."}</p>
            <a className="button button-primary" href={`mailto:${siteSettings.email}?subject=Careers%20enquiry`}>Email the team</a>
          </div>
        )}
      </section>
    </main>
  );
}
