export type HealthPlanTierSeed = {
  species: string;
  iconKey: string;
  summary: string;
  includedBenefits: string[];
  pricingStructure: string;
};

export type HealthPlanBenefitCardSeed = {
  title: string;
  description: string;
  iconKey: string;
};

export type HealthPlanPricingCardSeed = {
  title: string;
  iconKey: string;
  priceSummary: string;
  supportingText: string;
  lines: string[];
};

export type HealthPlanFaqSeed = {
  question: string;
  answer: string;
};

export const healthPlanPageSeed = {
  eyebrow: "The Sutton Vet Health Plan",
  title: "Preventative care that feels easier to plan for.",
  description:
    "A clear monthly plan for dogs and cats, built around routine preventative care rather than reactive surprises.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1800&q=80",
  heroPrimaryCtaLabel: "Book Online",
  heroPrimaryCtaHref: "/contact#book",
  heroSecondaryCtaLabel: "Ask a Question",
  heroSecondaryCtaHref: "/faq",

  introEyebrow: "Proactive Routine Care",
  introTitle: "Keeping your pet healthier for longer",
  introDescription:
    "The Sutton Vet Health Plan helps spread the cost of routine preventative care across the year. It is designed for owners who want clearer monthly budgeting for boosters, parasite protection, routine health checks, and practical ongoing support.",

  featureEyebrow: "For Dogs & Cats",
  featureTitle: "Looking after your pet's health and wellbeing",
  featureDescription:
    "Book online, then manage preventative care with a calmer, more predictable route into boosters, parasite treatment, and routine checks.",
  featureImageUrl:
    "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=1800&q=80",
  featureCtaLabel: "Book Online",
  featureCtaHref: "/contact#book",

  planTiers: [
    {
      species: "Dogs",
      iconKey: "dog",
      summary:
        "Built for routine dog care with weight-based pricing and year-round preventative support.",
      includedBenefits: [
        "Annual booster",
        "12 months flea, tick, and worming treatment",
        "Regular health checks",
        "Microchip support",
        "Core clinical discounts",
      ],
      pricingStructure: "Tiered by weight class: Small, Medium, Large, Giant",
    },
    {
      species: "Cats",
      iconKey: "cat",
      summary:
        "A simpler flat-fee plan for ongoing preventative feline care and practical budgeting.",
      includedBenefits: [
        "Annual booster",
        "12 months flea, tick, and worming control",
        "Routine health checks",
        "Clinical discounts",
      ],
      pricingStructure: "Flat monthly fee",
    },
  ] satisfies HealthPlanTierSeed[],

  benefitsEyebrow: "What's Included",
  benefitsTitle: "Core preventative support, surfaced clearly.",
  benefitsDescription:
    "The page should explain practical benefits quickly, without drifting into generic sales copy.",
  benefitCards: [
    {
      title: "Annual boosters",
      description: "Routine vaccination cover stays visible from the start.",
      iconKey: "syringe",
    },
    {
      title: "Parasite protection",
      description: "Year-round flea, tick, and worming support for the relevant species.",
      iconKey: "shield",
    },
    {
      title: "Routine checks",
      description: "Regular monitoring supports continuity rather than last-minute catch-up care.",
      iconKey: "stethoscope",
    },
    {
      title: "Microchip support",
      description: "Microchip cover or support remains part of the preventative care story.",
      iconKey: "chip",
    },
    {
      title: "Core discounts",
      description: "Useful clinical savings can be explained without making the page feel cluttered.",
      iconKey: "badge",
    },
  ] satisfies HealthPlanBenefitCardSeed[],

  pricingEyebrow: "Pricing Structure",
  pricingTitle: "Simple plan logic for each species.",
  pricingDescription:
    "The landing page can explain the structure now, while exact monthly figures stay editable through the CMS.",
  pricingCards: [
    {
      title: "Dogs",
      iconKey: "dog",
      priceSummary: "Tiered monthly pricing",
      supportingText: "Choose the correct dog band by weight class.",
      lines: ["Small", "Medium", "Large", "Giant"],
    },
    {
      title: "Cats",
      iconKey: "cat",
      priceSummary: "Flat monthly fee",
      supportingText: "A simpler single-fee structure for feline preventative care.",
      lines: ["One monthly plan", "Routine preventative support included"],
    },
  ] satisfies HealthPlanPricingCardSeed[],

  faqEyebrow: "Common Questions",
  faqTitle: "Important distinctions should be easy to understand.",
  faqItems: [
    {
      question: "Is the Health Plan the same as pet insurance?",
      answer:
        "No. The Health Plan is for routine preventative care and more predictable monthly budgeting. It does not replace insurance for accidents, illness, or unexpected treatment costs.",
    },
    {
      question: "How are treatments collected through the year?",
      answer:
        "Preventative products and routine items are collected in line with the plan schedule recommended by the practice. This keeps treatment cadence practical rather than leaving owners to guess what is due next.",
    },
    {
      question: "What happens if I need to cancel?",
      answer:
        "Cancellation rules, notice periods, and any related plan terms should be reviewed before sign-up. The final live sign-up journey can surface those details directly alongside the Lupa workflow.",
    },
  ] satisfies HealthPlanFaqSeed[],

  ctaEyebrow: "Join The Plan",
  ctaTitle: "Ready to set up routine care more clearly?",
  ctaText:
    "Use the dedicated sign-up route when you are ready, or review the FAQ first if you want to understand how the plan works before joining.",
  ctaImageUrl:
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1800&q=80",
  ctaPrimaryLabel: "Book Online",
  ctaPrimaryHref: "/contact#book",
  ctaSecondaryLabel: "Read FAQ",
  ctaSecondaryHref: "/faq",
};
