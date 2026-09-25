import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

export type Vacancy = {
  _id?: string;
  _key?: string;
  title?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  summary?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  applicationDeadline?: string;
  applicationEmail?: string;
  applicationLabel?: string;
  active?: boolean;
  displayOrder?: number;
};

export type CareersPageDocument = {
  eyebrow?: string;
  title?: string;
  description?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroCtaLabel?: string;
  heroBadgeEyebrow?: string;
  heroBadgeTitle?: string;
  vacanciesEyebrow?: string;
  vacanciesTitle?: string;
  hiringLabel?: string;
  applyTitle?: string;
  applyText?: string;
  roleDetailsLabel?: string;
  vacancies?: Vacancy[];
  cultureEyebrow?: string;
  cultureTitle?: string;
  cultureText?: string;
  generalEnquiryText?: string;
  generalEnquiryLabel?: string;
};

const careersPageQuery = groq`
  *[_type == "careersPage"][0]{
    eyebrow,
    title,
    description,
    "heroImageUrl": heroImage.asset->url,
    heroImageAlt,
    heroCtaLabel,
    heroBadgeEyebrow,
    heroBadgeTitle,
    vacanciesEyebrow,
    vacanciesTitle,
    hiringLabel,
    applyTitle,
    applyText,
    roleDetailsLabel,
    vacancies[]{
      _key,
      title,
      location,
      employmentType,
      salary,
      summary,
      responsibilities,
      requirements,
      benefits,
      applicationDeadline,
      applicationEmail,
      applicationLabel,
      active
    },
    cultureEyebrow,
    cultureTitle,
    cultureText,
    generalEnquiryText,
    generalEnquiryLabel
  }
`;

const vacanciesQuery = groq`
  *[_type == "jobVacancy" && active != false] | order(displayOrder asc, _createdAt desc){
    _id,
    title,
    location,
    employmentType,
    salary,
    summary,
    responsibilities,
    requirements,
    benefits,
    applicationDeadline,
    applicationEmail,
    applicationLabel,
    active,
    displayOrder
  }
`;

export async function getCareersPageDocument() {
  return safeSanityFetch<CareersPageDocument | null>(careersPageQuery, undefined, null);
}

export async function getJobVacancies() {
  return safeSanityFetch<Vacancy[]>(vacanciesQuery, undefined, []);
}
