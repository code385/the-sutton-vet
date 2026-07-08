import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

type LinkItem = {
  label?: string;
  href?: string;
  variant?: string;
};

type QuickLink = {
  title?: string;
  value?: string;
  href?: string;
  meta?: string;
  icon?: string;
};

type SocialCard = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  href?: string;
  icon?: string;
};

type LegalSection = {
  title?: string;
  status?: string;
  body?: string[];
};

type InventoryItem = {
  name?: string;
  provider?: string;
  purpose?: string;
  duration?: string;
};

export type ContactPageDocument = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  quickLinks?: QuickLink[];
  openEyebrow?: string;
  openTitle?: string;
  openDescription?: string;
  openMetaLines?: string[];
  openCtas?: LinkItem[];
  emergencyEyebrow?: string;
  emergencyTitle?: string;
  emergencyDescription?: string;
  emergencyPoints?: string[];
  emergencyButtonLabel?: string;
  hoursEyebrow?: string;
  hoursTitle?: string;
  locationEyebrow?: string;
  locationTitle?: string;
  locationDescription?: string;
  locationPoints?: string[];
  locationButtonLabel?: string;
  locationButtonHref?: string;
  locationMapEmbedUrl?: string;
  locationMapLabelTitle?: string;
  locationMapLabelText?: string;
  socialCards?: SocialCard[];
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

export type SimplePageDocument = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  steps?: string[];
};

export type TeamPageDocument = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  introEyebrow?: string;
  introTitle?: string;
  introDescription?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

export type BlogPageDocument = {
  eyebrow?: string;
  title?: string;
  description?: string;
  introEyebrow?: string;
  introTitle?: string;
  introDescription?: string;
  feedbackEyebrow?: string;
  feedbackTitle?: string;
  feedbackDescription?: string;
  feedbackHelperLabel?: string;
  feedbackHelperHref?: string;
  feedbackHelpfulLabel?: string;
  feedbackMoreLabel?: string;
  feedbackContactLabel?: string;
  feedbackHelpfulResponse?: string;
  feedbackMoreResponse?: string;
  feedbackContactResponse?: string;
  browseMoreLabel?: string;
  browseMoreHref?: string;
  askDirectLabel?: string;
  askDirectHref?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

export type LegalPageDocument = {
  title?: string;
  eyebrow?: string;
  description?: string;
  sections?: LegalSection[];
  inventoryItems?: InventoryItem[];
};

export type FaqItemDocument = {
  _id: string;
  question?: string;
  answer?: string;
  category?: string;
  displayOrder?: number;
};

const contactPageQuery = groq`*[_type == "contactPage"][0]{..., quickLinks[], openCtas[], socialCards[]}`;
const faqPageQuery = groq`*[_type == "faqPage"][0]`;
const firstVisitPageQuery = groq`*[_type == "firstVisitPage"][0]`;
const teamPageQuery = groq`*[_type == "teamPage"][0]`;
const blogPageQuery = groq`*[_type == "blogPage"][0]`;
const faqItemsQuery = groq`*[_type == "faq"] | order(displayOrder asc, _createdAt asc){ _id, question, answer, category, displayOrder }`;
const legalPageByTypeQuery = groq`
  *[_type == "legalPage" && pageType == $pageType][0]{
    title,
    eyebrow,
    description,
    sections,
    inventoryItems
  }
`;

export async function getContactPageDocument() {
  return safeSanityFetch<ContactPageDocument | null>(contactPageQuery, undefined, null);
}

export async function getFaqPageDocument() {
  return safeSanityFetch<SimplePageDocument | null>(faqPageQuery, undefined, null);
}

export async function getFirstVisitPageDocument() {
  return safeSanityFetch<SimplePageDocument | null>(firstVisitPageQuery, undefined, null);
}

export async function getTeamPageDocument() {
  return safeSanityFetch<TeamPageDocument | null>(teamPageQuery, undefined, null);
}

export async function getBlogPageDocument() {
  return safeSanityFetch<BlogPageDocument | null>(blogPageQuery, undefined, null);
}

export async function getFaqItems() {
  return safeSanityFetch<FaqItemDocument[]>(faqItemsQuery, undefined, []);
}

export async function getLegalPageByType(pageType: string) {
  return safeSanityFetch<LegalPageDocument | null>(legalPageByTypeQuery, { pageType }, null);
}
