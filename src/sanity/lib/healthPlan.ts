import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

type HealthPlanTier = {
  species?: string;
  iconKey?: string;
  summary?: string;
  includedBenefits?: string[];
  pricingStructure?: string;
};

type HealthPlanBenefitCard = {
  title?: string;
  description?: string;
  iconKey?: string;
};

type HealthPlanPricingCard = {
  title?: string;
  iconKey?: string;
  priceSummary?: string;
  supportingText?: string;
  lines?: string[];
};

type HealthPlanFaqItem = {
  question?: string;
  answer?: string;
};

export type HealthPlanPageDocument = {
  eyebrow?: string;
  title?: string;
  description?: string;
  heroImageUrl?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  introEyebrow?: string;
  introTitle?: string;
  introDescription?: string;
  featureEyebrow?: string;
  featureTitle?: string;
  featureDescription?: string;
  featureImageUrl?: string;
  featureCtaLabel?: string;
  featureCtaHref?: string;
  planTiers?: HealthPlanTier[];
  benefitsEyebrow?: string;
  benefitsTitle?: string;
  benefitsDescription?: string;
  benefitCards?: HealthPlanBenefitCard[];
  pricingEyebrow?: string;
  pricingTitle?: string;
  pricingDescription?: string;
  pricingCards?: HealthPlanPricingCard[];
  faqEyebrow?: string;
  faqTitle?: string;
  faqItems?: HealthPlanFaqItem[];
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaImageUrl?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

const healthPlanPageQuery = groq`
  *[_type == "healthPlan"][0]{
    eyebrow,
    title,
    description,
    heroImageUrl,
    heroPrimaryCtaLabel,
    heroPrimaryCtaHref,
    heroSecondaryCtaLabel,
    heroSecondaryCtaHref,
    introEyebrow,
    introTitle,
    introDescription,
    featureEyebrow,
    featureTitle,
    featureDescription,
    featureImageUrl,
    featureCtaLabel,
    featureCtaHref,
    planTiers,
    benefitsEyebrow,
    benefitsTitle,
    benefitsDescription,
    benefitCards,
    pricingEyebrow,
    pricingTitle,
    pricingDescription,
    pricingCards,
    faqEyebrow,
    faqTitle,
    faqItems,
    ctaEyebrow,
    ctaTitle,
    ctaText,
    ctaImageUrl,
    ctaPrimaryLabel,
    ctaPrimaryHref,
    ctaSecondaryLabel,
    ctaSecondaryHref
  }
`;

export async function getHealthPlanPageDocument() {
  return safeSanityFetch<HealthPlanPageDocument | null>(healthPlanPageQuery, undefined, null);
}
