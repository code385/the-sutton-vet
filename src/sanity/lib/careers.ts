import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

export type Vacancy = {
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
};

export type CareersPageDocument = {
  eyebrow?: string;
  title?: string;
  description?: string;
  vacancies?: Vacancy[];
  cultureEyebrow?: string;
  cultureTitle?: string;
  cultureText?: string;
  generalEnquiryText?: string;
};

const careersPageQuery = groq`
  *[_type == "careersPage"][0]{
    eyebrow,
    title,
    description,
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
    generalEnquiryText
  }
`;

export async function getCareersPageDocument() {
  return safeSanityFetch<CareersPageDocument | null>(careersPageQuery, undefined, null);
}
