import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

export type PricingCalculatorEntry = {
  species?: "Dog" | "Cat";
  weightBand?: string;
  annualPayAsYouGo?: number;
  monthlyPlanCost?: number;
  note?: string;
};

export type PricingPageDocument = {
  eyebrow?: string;
  title?: string;
  description?: string;
  heroImageUrl?: string;
  promiseEyebrow?: string;
  promiseTitle?: string;
  promiseDescription?: string;
  promiseSecondary?: string;
  healthPlanEyebrow?: string;
  healthPlanTitle?: string;
  healthPlanDescription?: string;
  healthPlanImageUrl?: string;
  healthPlanCtaLabel?: string;
  healthPlanCtaHref?: string;
  calculatorEyebrow?: string;
  calculatorTitle?: string;
  calculatorDescription?: string;
  calculatorEntries?: PricingCalculatorEntry[];
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaImageUrl?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

export type FeeCategoryDocument = {
  _id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  sortOrder?: number;
  items?: {
    label?: string;
    price?: string;
    note?: string;
  }[];
};

const pricingPageQuery = groq`
  *[_type == "pricingPage"][0]{
    eyebrow,
    title,
    description,
    heroImageUrl,
    promiseEyebrow,
    promiseTitle,
    promiseDescription,
    promiseSecondary,
    healthPlanEyebrow,
    healthPlanTitle,
    healthPlanDescription,
    healthPlanImageUrl,
    healthPlanCtaLabel,
    healthPlanCtaHref,
    calculatorEyebrow,
    calculatorTitle,
    calculatorDescription,
    calculatorEntries,
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

const feeCategoriesQuery = groq`
  *[_type == "feeCategory"] | order(sortOrder asc, _createdAt asc){
    _id,
    eyebrow,
    title,
    description,
    sortOrder,
    items[]{
      label,
      price,
      note
    }
  }
`;

export async function getPricingPageDocument() {
  return safeSanityFetch<PricingPageDocument | null>(pricingPageQuery, undefined, null);
}

export async function getFeeCategories() {
  return safeSanityFetch<FeeCategoryDocument[]>(feeCategoriesQuery, undefined, []);
}
