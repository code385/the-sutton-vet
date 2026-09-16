import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/shared/Reveal";
import { visualAssets } from "@/lib/visualAssets";
import { getCareersPageDocument, type Vacancy } from "@/sanity/lib/careers";
import { getSiteSettingsDocument, resolveSiteSettings } from "@/sanity/lib/siteSettings";

export const metadata: Metadata = {
  title: "Careers | The Sutton Vet",
  description: "Explore veterinary career opportunities with The Sutton Vet in Sutton.",
};

const defaultVacancy: Vacancy = {
  title: "Veterinary Nurse",
  location: "The Sutton Vet, Hackbridge",
  employmentType: "Working pattern to be discussed",
  salary: "Package discussed during the application process",
  summary: "We are looking for a veterinary nurse who shares our calm, thoughtful approach to patient care and owner communication.",
  responsibilities: [
    "Support patients throughout consultations, procedures, recovery, and routine nurse-led care.",
    "Help create a calm, organised experience for pets and their owners.",
    "Work closely with the clinical and client-care team as the practice grows.",
  ],
  requirements: [
    "A compassionate and reliable approach to patient care.",
    "Clear, reassuring communication with owners and colleagues.",
    "A commitment to professional standards and collaborative working.",
  ],
  benefits: [
    "A growing independent practice with a personal approach.",
    "A supportive environment where good ideas and careful care matter.",
    "Role details and development opportunities discussed openly during the application process.",
  ],
  applicationEmail: "info@thesuttonvet.co.uk",
  applicationLabel: "Apply by email",
  active: true,
};

export default async function CareersPage() {
  const [careersDocument, siteSettingsDocument] = await Promise.all([
    getCareersPageDocument(),
    getSiteSettingsDocument(),
  ]);
  const siteSettings = resolveSiteSettings(siteSettingsDocument);
  const vacancies = (careersDocument?.vacancies || [defaultVacancy]).filter((vacancy) => vacancy.active !== false);
  const applicationEmail = vacancies[0]?.applicationEmail || siteSettings.email;

  return (
    <main className="careers-page">
      <section className="careers-hero full-bleed-section">
        <div className="shell careers-hero-shell">
          <Reveal variant="left">
            <div className="careers-hero-copy">
              <p className="eyebrow">{careersDocument?.eyebrow || "Join The Sutton Vet"}</p>
              <h1>{careersDocument?.title || "Bring your care, confidence, and ideas to our growing team."}</h1>
              <p>{careersDocument?.description || "We are building an independent practice around thoughtful clinical care, kind communication, and a more personal experience for pets and owners."}</p>
              <a className="button button-primary" href={`mailto:${applicationEmail}?subject=Veterinary Nurse Application — The Sutton Vet`}>
                View current vacancy
              </a>
            </div>
          </Reveal>
          <Reveal variant="up" delayMs={60}>
            <div className="careers-hero-media">
              <Image src={visualAssets.vetDoctorWithPet} alt="Veterinary professional caring for a pet" fill sizes="(max-width: 900px) 100vw, 46vw" priority />
              <div className="careers-hero-note">
                <span>Now hiring</span>
                <strong>{vacancies[0]?.title || "Veterinary Nurse"}</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell careers-intro">
        <div>
          <p className="eyebrow">{careersDocument?.cultureEyebrow || "Work With Us"}</p>
          <h2>{careersDocument?.cultureTitle || "A smaller practice with room to make a real contribution."}</h2>
        </div>
        <p>{careersDocument?.cultureText || "This is an opportunity to help shape a growing team and support a standard of care that feels clear, calm, and genuinely personal."}</p>
      </section>

      <section className="shell careers-vacancies" aria-label="Current vacancies">
        {vacancies.length ? vacancies.map((vacancy, vacancyIndex) => {
          const email = vacancy.applicationEmail || siteSettings.email;
          const subject = encodeURIComponent(`${vacancy.title || "Career"} Application — The Sutton Vet`);
          return (
            <Reveal key={vacancy._key || vacancy.title || vacancyIndex} variant="up">
              <article className="careers-role">
                <header className="careers-role-header">
                  <div>
                    <p className="eyebrow">Current Vacancy</p>
                    <h2>{vacancy.title || "Veterinary Nurse"}</h2>
                    <p>{vacancy.summary}</p>
                  </div>
                  <div className="careers-role-meta">
                    <div><span>Location</span><strong>{vacancy.location || "Hackbridge, Sutton"}</strong></div>
                    <div><span>Working pattern</span><strong>{vacancy.employmentType || "To be discussed"}</strong></div>
                    <div><span>Package</span><strong>{vacancy.salary || "Discussed during application"}</strong></div>
                    {vacancy.applicationDeadline ? <div><span>Apply by</span><strong>{vacancy.applicationDeadline}</strong></div> : null}
                  </div>
                </header>

                <div className="careers-role-columns">
                  <div>
                    <span className="careers-role-number">01</span>
                    <h3>The role</h3>
                    <ul>{(vacancy.responsibilities || defaultVacancy.responsibilities || []).map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <span className="careers-role-number">02</span>
                    <h3>What we are looking for</h3>
                    <ul>{(vacancy.requirements || defaultVacancy.requirements || []).map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <span className="careers-role-number">03</span>
                    <h3>What we offer</h3>
                    <ul>{(vacancy.benefits || defaultVacancy.benefits || []).map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>

                <footer className="careers-role-footer">
                  <div>
                    <strong>Interested in joining us?</strong>
                    <p>Send your CV and a short introduction. We will respond with the full role details and next steps.</p>
                  </div>
                  <a className="button button-primary" href={`mailto:${email}?subject=${subject}`}>
                    {vacancy.applicationLabel || "Apply by email"}
                  </a>
                </footer>
              </article>
            </Reveal>
          );
        }) : (
          <div className="careers-empty">
            <h2>No current vacancies</h2>
            <p>{careersDocument?.generalEnquiryText || "We are always happy to hear from people who share our approach to veterinary care."}</p>
            <a className="button button-primary" href={`mailto:${siteSettings.email}?subject=Careers enquiry — The Sutton Vet`}>Send a careers enquiry</a>
          </div>
        )}
      </section>
    </main>
  );
}
