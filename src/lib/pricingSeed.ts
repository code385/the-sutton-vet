import { siteConfig } from "./site";
import { visualAssets } from "./visualAssets";

export type PricingCalculatorEntrySeed = {
  species: "Dog" | "Cat";
  weightBand?: string;
  annualPayAsYouGo: number;
  monthlyPlanCost: number;
  note?: string;
};

export type FeeCategorySeed = {
  _id: string;
  _type: "feeCategory";
  title: string;
  eyebrow: string;
  description: string;
  sortOrder: number;
  items: {
    label: string;
    price: string;
    note?: string;
  }[];
};

export const pricingPageSeed = {
  _id: "pricingPage",
  _type: "pricingPage",
  eyebrow: "Services & Quotes",
  title: "Service list first. Prices added clearly when ready.",
  description:
    "Browse the services currently offered. Confirmed prices can be published later, while assessment-led care remains available by quote.",
  heroImageUrl:
    visualAssets.gingerSpanielHero,

  promiseEyebrow: "How To Use This Page",
  promiseTitle: "Browse the service, then ask for the right estimate.",
  promiseDescription:
    "Services are listed clearly now. Prices can be added as they are confirmed, and the team can provide a quote where assessment affects the final cost.",
  promiseSecondary:
    "The focus here is on the categories owners ask about first: consultations, vaccinations, neutering, dentistry, diagnostics, and the value of the Health Plan.",

  healthPlanEyebrow: "Routine Care Savings",
  healthPlanTitle: "Pet Health Plan",
  healthPlanDescription:
    "If you would rather spread the cost of routine preventative care, the Health Plan page sets out the monthly structure and likely savings more simply.",
  healthPlanImageUrl:
    visualAssets.gingerCatHero,
  healthPlanCtaLabel: "View Health Plan",
  healthPlanCtaHref: "/health-plan",

  calculatorEyebrow: "Savings Calculator",
  calculatorTitle: "Compare plan value.",
  calculatorDescription:
    "Use this guide to compare estimated pay-as-you-go preventative spend with the monthly Health Plan route. Final health plan details can still be refined as the launch offer is confirmed.",
  calculatorEntries: [
    {
      species: "Dog",
      weightBand: "Small",
      annualPayAsYouGo: 328,
      monthlyPlanCost: 16.5,
      note: "Booster, parasite cover, routine care",
    },
    {
      species: "Dog",
      weightBand: "Medium",
      annualPayAsYouGo: 345,
      monthlyPlanCost: 18.5,
      note: "Booster, parasite cover, routine care",
    },
    {
      species: "Dog",
      weightBand: "Large",
      annualPayAsYouGo: 372,
      monthlyPlanCost: 21,
      note: "Booster, parasite cover, routine care",
    },
    {
      species: "Dog",
      weightBand: "Giant",
      annualPayAsYouGo: 404,
      monthlyPlanCost: 23.5,
      note: "Booster, parasite cover, routine care",
    },
    {
      species: "Cat",
      annualPayAsYouGo: 254,
      monthlyPlanCost: 14.5,
      note: "Booster, parasite control, routine checks",
    },
  ] satisfies PricingCalculatorEntrySeed[],

  ctaEyebrow: "Next Step",
  ctaTitle: "Need help choosing the right route?",
  ctaText:
    "If you are unsure whether you need a routine appointment, a procedure estimate, or a care conversation, the team can guide you to the most sensible next step.",
  ctaImageUrl:
    visualAssets.goldenDogWarm,
  ctaPrimaryLabel: "Book Online",
  ctaPrimaryHref: siteConfig.ctas.book,
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};

export const feeCategorySeeds: FeeCategorySeed[] = [
  {
    _id: "fee-category-consultations",
    _type: "feeCategory",
    title: "Consultation fees",
    eyebrow: "Everyday Appointments",
    description: "Common first-step fees for routine consultations, follow-ups, and practical day-to-day clinical support.",
    sortOrder: 1,
    items: [
      { label: "Routine consultation", price: "Quote", note: "Standard in-practice appointment" },
      { label: "Recheck consultation", price: "Quote", note: "Follow-up appointment where appropriate" },
      { label: "Written prescription", price: "Quote", note: "Issued to a pharmacy of your choosing" },
      { label: "Animal Health Certificate", price: "Quote", note: "Travel documentation guidance available" },
    ],
  },
  {
    _id: "fee-category-vaccinations",
    _type: "feeCategory",
    title: "Vaccinations",
    eyebrow: "Preventative Care",
    description: "Straightforward pricing for routine preventative appointments, supported by a proper health check and practical advice.",
    sortOrder: 2,
    items: [
      { label: "Dog or puppy vaccination course", price: "Quote" },
      { label: "Cat or kitten vaccination course", price: "Quote" },
      { label: "Annual booster and health check", price: "Quote" },
      { label: "Kennel cough add-on", price: "Quote", note: "When added at the time of annual boosters" },
    ],
  },
  {
    _id: "fee-category-microchip-neutering",
    _type: "feeCategory",
    title: "Microchipping & neutering",
    eyebrow: "Core Procedures",
    description: "Useful baseline pricing for core procedures that owners frequently ask about before registering or booking.",
    sortOrder: 3,
    items: [
      { label: "Microchipping cats and dogs", price: "Quote" },
      { label: "Cat neutering", price: "Quote" },
      { label: "Dog neutering", price: "Quote" },
      { label: "Keyhole laparoscopic spay", price: "Quote", note: "Female dogs" },
    ],
  },
  {
    _id: "fee-category-dental-surgery",
    _type: "feeCategory",
    title: "Dentistry, diagnostics & further treatment",
    eyebrow: "GP Care",
    description: "Some treatments can be priced clearly, while others are more responsibly confirmed once your pet has been assessed.",
    sortOrder: 4,
    items: [
      { label: "Cat dental treatment", price: "Quote", note: "Including x-rays" },
      { label: "Dog dental treatment", price: "Quote" },
      { label: "Pet surgery and procedures", price: "Quote", note: "Tailored after consultation and clinical review" },
      { label: "Imaging and diagnostics", price: "Quote", note: "Quoted according to the investigation needed" },
    ],
  },
];



