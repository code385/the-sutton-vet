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
  eyebrow: "Fees & Pricing",
  title: "Services and pricing",
  description:
    "A clearer pricing page for the services owners ask about most, with actual figures where possible and transparent guidance where an estimate is the more responsible route.",
  heroImageUrl:
    visualAssets.gingerSpanielHero,

  promiseEyebrow: "Price Promise",
  promiseTitle: "Clear fees, kinder conversations.",
  promiseDescription:
    "The Sutton Vet should feel open and straightforward about cost. Routine prices are shown clearly, while treatment that depends on clinical findings is discussed properly after an examination rather than guessed at online.",
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
      { label: "Routine consultation", price: "\u00a375.00", note: "Standard in-practice appointment" },
      { label: "Recheck consultation", price: "\u00a365.00", note: "Follow-up appointment where appropriate" },
      { label: "Written prescription", price: "\u00a320.00", note: "Issued to a pharmacy of your choosing" },
      { label: "Animal Health Certificate", price: "From \u00a3210.00", note: "Travel documentation guidance available" },
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
      { label: "Dog or puppy vaccination course", price: "\u00a3130.00" },
      { label: "Cat or kitten vaccination course", price: "\u00a3130.00" },
      { label: "Annual booster and health check", price: "\u00a390.00" },
      { label: "Kennel cough add-on", price: "\u00a335.00", note: "When added at the time of annual boosters" },
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
      { label: "Microchipping cats and dogs", price: "\u00a335.00" },
      { label: "Cat neutering", price: "From \u00a3175.00" },
      { label: "Dog neutering", price: "From \u00a3250.00" },
      { label: "Keyhole laparoscopic spay", price: "From \u00a3840.00", note: "Female dogs" },
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
      { label: "Cat dental treatment", price: "From \u00a3350.00", note: "Including x-rays" },
      { label: "Dog dental treatment", price: "From \u00a3400.00" },
      { label: "Pet surgery and procedures", price: "Estimate required", note: "Tailored after consultation and clinical review" },
      { label: "Imaging and diagnostics", price: "Estimate required", note: "Quoted according to the investigation needed" },
    ],
  },
];



