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
  title: "Prices",
  description:
    "Clear guidance on common fees, practical next steps, and how preventative care can make routine costs easier to plan for.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1800&q=80",

  promiseEyebrow: "Price Promise",
  promiseTitle: "Clear fees, calmer decisions.",
  promiseDescription:
    "As an independent practice, The Sutton Vet should explain costs plainly and early. Routine fees can be surfaced here, while more tailored treatment estimates remain part of a proper clinical conversation rather than a vague surprise later.",
  promiseSecondary:
    "This page is designed to answer the most common cost questions first: consultations, vaccinations, microchipping, neutering, and the value of the Health Plan.",

  healthPlanEyebrow: "Routine Care Savings",
  healthPlanTitle: "Pet Health Plan",
  healthPlanDescription:
    "If you want more predictable monthly budgeting for boosters, parasite treatment, and routine support, the Health Plan page explains the structure in more detail.",
  healthPlanImageUrl:
    "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=1600&q=80",
  healthPlanCtaLabel: "View Health Plan",
  healthPlanCtaHref: "/health-plan",

  calculatorEyebrow: "Savings Calculator",
  calculatorTitle: "Compare plan savings.",
  calculatorDescription:
    "Select species and weight band to compare estimated annual pay-as-you-go preventative costs with the monthly Health Plan route.",
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
    "If you are unsure whether you need a consultation, preventative care, or a more tailored estimate, contact the team and we will point you in the right direction.",
  ctaImageUrl:
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80",
  ctaPrimaryLabel: "Book Online",
  ctaPrimaryHref: "/contact#book",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};

export const feeCategorySeeds: FeeCategorySeed[] = [
  {
    _id: "fee-category-consultations",
    _type: "feeCategory",
    title: "Consultation Fees",
    eyebrow: "Everyday Appointments",
    description: "Common first-step fees for routine consultations and day-to-day clinical support.",
    sortOrder: 1,
    items: [
      { label: "Routine consultation", price: "£75.00", note: "Standard in-practice appointment" },
      { label: "Recheck consultation", price: "£65.00", note: "Follow-up appointment where appropriate" },
      { label: "Written prescription", price: "£20.00", note: "Issued to a pharmacy of your choosing" },
      { label: "Animal Health Certificate", price: "From £210.00", note: "Travel documentation guidance available" },
    ],
  },
  {
    _id: "fee-category-vaccinations",
    _type: "feeCategory",
    title: "Vaccinations",
    eyebrow: "Preventative Care",
    description: "Vaccination fees can stay clearly visible while tailored advice is still given case by case.",
    sortOrder: 2,
    items: [
      { label: "Dog or puppy vaccination course", price: "£130.00" },
      { label: "Cat or kitten vaccination course", price: "£130.00" },
      { label: "Annual booster and health check", price: "£90.00" },
      { label: "Kennel cough add-on", price: "£35.00", note: "When added at the time of annual boosters" },
    ],
  },
  {
    _id: "fee-category-microchip-neutering",
    _type: "feeCategory",
    title: "Microchipping & Neutering",
    eyebrow: "Core Procedures",
    description: "Useful baseline pricing for core procedures that owners frequently ask about before registering.",
    sortOrder: 3,
    items: [
      { label: "Microchipping cats and dogs", price: "£35.00" },
      { label: "Cat neutering", price: "From £175.00" },
      { label: "Dog neutering", price: "From £250.00" },
      { label: "Keyhole laparoscopic spay", price: "From £840.00", note: "Female dogs" },
    ],
  },
  {
    _id: "fee-category-dental-surgery",
    _type: "feeCategory",
    title: "Dental & Procedure Guide",
    eyebrow: "Further Treatment",
    description: "Surgical and dental treatment is discussed with proper clinical context before anything proceeds.",
    sortOrder: 4,
    items: [
      { label: "Cat dental treatment", price: "From £350.00", note: "Including x-rays" },
      { label: "Dog dental treatment", price: "From £400.00" },
      { label: "Pet surgery and procedures", price: "Estimate required", note: "Tailored after consultation and clinical review" },
      { label: "Out-of-hours emergency appointment", price: "Emergency rates apply", note: "Guidance confirmed when routing care" },
    ],
  },
];
