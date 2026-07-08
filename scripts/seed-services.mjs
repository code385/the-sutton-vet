import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hoi7uq4a";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing. Add it to your env before running the seed.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const servicesPageSeed = {
  _id: "servicesPage",
  _type: "servicesPage",
  eyebrow: "Clinical & Diagnostic Services",
  title: "Services designed to feel clear, calm, and easy to scan.",
  description:
    "A clean overview of consultations, diagnostics, surgery, dentistry, and nurse-led preventative care, presented in a simple format that feels informative rather than crowded.",
  introNote: "Each service block below can be edited from Sanity, including title, copy, image, and CTA.",
  primaryCtaLabel: "Book Online",
  primaryCtaHref: "/contact#book",
  secondaryCtaLabel: "Register Now",
  secondaryCtaHref: "/contact#register",
  closingEyebrow: "Next Step",
  closingTitle: "Need help choosing the right appointment?",
  closingText: "If you're not sure which route is right, the team can guide you toward the most appropriate next step.",
  closingPrimaryLabel: "Book Online",
  closingPrimaryHref: "/contact#book",
  closingSecondaryLabel: "Contact Us",
  closingSecondaryHref: "/contact",
};

const seededServices = [
  {
    _id: "service-consultations",
    _type: "service",
    sortOrder: 1,
    eyebrow: "Core Service",
    title: "Consultations",
    slug: { _type: "slug", current: "consultations" },
    shortDescription: "Clear first appointments, follow-ups, and day-to-day clinical advice.",
    lead: "Routine consultations should feel calm, practical, and easy to understand from the very first conversation.",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
    alt: "Veterinarian examining a dog during a consultation",
    ctaLabel: "Book a consultation",
    ctaHref: "/contact#book",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Consultations cover first visits, routine appointments, follow-up reviews, and practical discussions about symptoms, behaviour, or changes in your pet's health.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The goal is to make each visit feel clear and unhurried, with sensible next steps explained in plain language and a strong focus on continuity of care.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-diagnostics",
    _type: "service",
    sortOrder: 2,
    eyebrow: "Clinical Imaging",
    title: "Diagnostics",
    slug: { _type: "slug", current: "diagnostics" },
    shortDescription: "Practical diagnostics including X-ray and ultrasound-guided assessment.",
    lead: "Diagnostic services should reassure owners about capability while keeping the information calm, factual, and easy to follow.",
    imageUrl:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1600&q=80",
    alt: "Dog in front of diagnostic imaging",
    ctaLabel: "Ask about diagnostics",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Diagnostics may include imaging such as X-ray and ultrasound, alongside clinical examination and other investigations that help build a clearer picture of what is happening.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "These tools support more confident decision-making, helping the practice explain findings clearly and guide treatment planning with less uncertainty.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-surgery",
    _type: "service",
    sortOrder: 3,
    eyebrow: "Procedures",
    title: "Surgery",
    slug: { _type: "slug", current: "surgery" },
    shortDescription: "General surgical care presented with a calm, responsible tone.",
    lead: "Surgical information should feel reassuring and well-structured, not dramatic or sales-led.",
    imageUrl:
      "https://images.unsplash.com/photo-1583337130417-3346a1d3d4d9?auto=format&fit=crop&w=1600&q=80",
    alt: "Veterinary team caring for a dog",
    ctaLabel: "Contact about surgery",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Where surgery is recommended, owners should understand why it is being advised, what the procedure involves, and how aftercare will be managed.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "This section can be used to explain surgical pathways in a straightforward way, supporting informed decisions and confidence before treatment takes place.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-dentistry",
    _type: "service",
    sortOrder: 4,
    eyebrow: "Oral Health",
    title: "Dentistry",
    slug: { _type: "slug", current: "dentistry" },
    shortDescription: "Dental advice and treatment support made easier to understand.",
    lead: "Dental care should be explained as part of overall wellbeing, with clear guidance around routine checks and treatment planning.",
    imageUrl:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1600&q=80",
    alt: "Clean veterinary treatment room for dentistry and procedures",
    ctaLabel: "Ask about dental care",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Dental care may include oral examinations, discussions about plaque and gum disease, and advice on when a more involved dental procedure may be appropriate.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The aim is to make oral health feel less confusing, with practical information that helps owners understand both preventative care and treatment options.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-preventative-clinics",
    _type: "service",
    sortOrder: 5,
    eyebrow: "Preventative Care",
    title: "Nurse-led Preventative Clinics",
    slug: { _type: "slug", current: "nurse-led-preventative-clinics" },
    shortDescription: "Vaccinations, parasite support, wellbeing checks, and practical long-term care.",
    lead: "Preventative clinics should highlight everyday support that helps owners stay ahead of avoidable problems.",
    imageUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=80",
    alt: "Veterinary nurse holding a cat in clinic",
    ctaLabel: "Book preventative care",
    ctaHref: "/contact#book",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Nurse-led preventative clinics can cover vaccinations, weight and wellbeing checks, parasite guidance, and practical support that helps owners feel more confident about routine care.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "This area supports long-term patient care by turning preventative medicine into a clearer, more approachable part of the client journey.",
          },
        ],
      },
    ],
  },
];

async function run() {
  await client.createOrReplace(servicesPageSeed);

  for (const item of seededServices) {
    await client.createOrReplace(item);
  }

  console.log(`Seeded ${seededServices.length} services and 1 services page document.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
