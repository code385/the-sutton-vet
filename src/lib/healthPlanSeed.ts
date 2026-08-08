import { siteConfig } from "./site";
import { visualAssets } from "./visualAssets";

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
  title: "Preventative care with a gentler monthly rhythm.",
  description:
    "A clear monthly plan for dogs and cats, designed to make routine preventative care easier to budget for and easier to stay on top of.",
  heroImageUrl:
    visualAssets.gingerSpanielHero,
  heroPrimaryCtaLabel: "Book Online",
  heroPrimaryCtaHref: siteConfig.ctas.healthPlan,
  heroSecondaryCtaLabel: "Ask a Question",
  heroSecondaryCtaHref: "/contact",

  introEyebrow: "Proactive Routine Care",
  introTitle: "Helping routine care feel more manageable",
  introDescription:
    "The Sutton Vet Health Plan helps spread the cost of routine preventative care across the year. It is designed for owners who want clearer monthly budgeting for boosters, parasite protection, routine health checks, and practical ongoing support. This launch version can be refined further as final plan details are confirmed.",

  featureEyebrow: "For Dogs & Cats",
  featureTitle: "Built for everyday health, not just unexpected moments",
  featureDescription:
    "The aim is simple: keep core preventative care visible, consistent, and easier to manage through the year, with fewer missed treatments and fewer avoidable surprises.",
  featureImageUrl:
    visualAssets.gingerCatHero,
  featureCtaLabel: "Book Online",
  featureCtaHref: siteConfig.ctas.healthPlan,

  planTiers: [
    {
      species: "Dogs",
      iconKey: "dog",
      summary:
        "Built for routine dog care with weight-based pricing and year-round preventative support.",
      includedBenefits: [
        "Annual booster",
        "Prescription flea, tick, and worming treatment",
        "Routine nurse-led checks where appropriate",
        "Helpful reminders through the year",
        "Selected practice savings",
      ],
      pricingStructure: "Tiered by weight class",
    },
    {
      species: "Cats",
      iconKey: "cat",
      summary:
        "A simpler flat-fee plan for ongoing preventative feline care and practical budgeting.",
      includedBenefits: [
        "Annual booster",
        "Prescription flea and worming control",
        "Routine nurse-led checks where appropriate",
        "Helpful reminders through the year",
        "Selected practice savings",
      ],
      pricingStructure: "Flat monthly fee",
    },
  ] satisfies HealthPlanTierSeed[],

  benefitsEyebrow: "What's Included",
  benefitsTitle: "The essentials, explained simply.",
  benefitsDescription:
    "Owners should be able to understand the day-to-day value of the plan quickly, without having to work through heavy sales language.",
  benefitCards: [
    {
      title: "Annual boosters",
      description: "Routine vaccination cover stays visible from the start, with a proper health check built into the conversation.",
      iconKey: "syringe",
    },
    {
      title: "Parasite protection",
      description: "Prescription-strength parasite support helps owners stay consistent through the year.",
      iconKey: "shield",
    },
    {
      title: "Routine checks",
      description: "Routine monitoring supports continuity instead of last-minute catch-up care.",
      iconKey: "stethoscope",
    },
    {
      title: "Helpful reminders",
      description: "The plan supports a steadier care rhythm, so it is easier to know what is due and when.",
      iconKey: "chip",
    },
    {
      title: "Selected savings",
      description: "Useful savings can sit alongside preventative cover without making the plan feel cluttered or confusing.",
      iconKey: "badge",
    },
  ] satisfies HealthPlanBenefitCardSeed[],

  pricingEyebrow: "Pricing Structure",
  pricingTitle: "Monthly pricing that stays easy to follow.",
  pricingDescription:
    "The page structure is ready for the final launch figures. Until those details are confirmed, the logic below keeps the offer easy to understand.",
  pricingCards: [
    {
      title: "Dogs",
      iconKey: "dog",
      priceSummary: "Weight-based monthly plans",
      supportingText: "Dogs join the plan according to their expected adult weight.",
      lines: ["Small", "Medium", "Large", "Giant"],
    },
    {
      title: "Cats",
      iconKey: "cat",
      priceSummary: "Flat monthly fee",
      supportingText: "Cats stay on one simpler monthly structure.",
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
        "Preventative products and routine items are supplied in line with the plan schedule recommended by the practice. Final delivery or collection details can be adjusted once the launch version of the plan is fully confirmed.",
    },
    {
      question: "What happens if I need to cancel?",
      answer:
        "Cancellation rules, notice periods, and plan terms should always be reviewed before sign-up. Those final details can be surfaced more explicitly once the live plan workflow is in place.",
    },
  ] satisfies HealthPlanFaqSeed[],

  ctaEyebrow: "Join The Plan",
  ctaTitle: "Ready to make routine care feel more settled?",
  ctaText:
    "Use the sign-up route when the final launch details are in place, or contact the team if you want to understand how the plan is expected to work.",
  ctaImageUrl:
    visualAssets.goldenDogWarm,
  ctaPrimaryLabel: "Book Online",
  ctaPrimaryHref: siteConfig.ctas.healthPlan,
  ctaSecondaryLabel: "Ask a Question",
  ctaSecondaryHref: "/contact",
};


