import { siteConfig } from "./site";
import { visualAssets } from "./visualAssets";

export type SeededService = {
  _id: string;
  _type: "service";
  sortOrder: number;
  eyebrow: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  lead: string;
  imageUrl: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  content: { _type: "block"; children: { _type: "span"; text: string }[] }[];
};

export const servicesPageSeed = {
  _id: "servicesPage",
  _type: "servicesPage",
  eyebrow: "GP & Referral Care",
  title: "Thoughtful veterinary care, organised around what owners need most.",
  description:
    "The Sutton Vet should feel warm, clinically confident, and easy to navigate. This page brings together everyday GP support, daytime urgent care, preventative care, and selected referral services in a format that is simple to scan without feeling impersonal.",
  introNote: "Each service block below can be edited from Sanity, including title, copy, image, and CTA.",
  primaryCtaLabel: "Book Online",
  primaryCtaHref: siteConfig.ctas.book,
  secondaryCtaLabel: "Register Now",
  secondaryCtaHref: siteConfig.ctas.register,
  closingEyebrow: "Next Step",
  closingTitle: "Need help choosing the right appointment?",
  closingText:
    "Tell us what is happening and we will guide you towards the right appointment, procedure discussion, or referral route.",
  closingPrimaryLabel: "Book Online",
  closingPrimaryHref: siteConfig.ctas.book,
  closingSecondaryLabel: "Contact Us",
  closingSecondaryHref: "/contact",
};

export const seededServices: SeededService[] = [
  {
    _id: "service-gp-consultations",
    _type: "service",
    sortOrder: 1,
    eyebrow: "GP Services",
    title: "GP consultations",
    slug: { current: "gp-consultations" },
    shortDescription: "First appointments, follow-ups, second opinions, and clear day-to-day clinical guidance.",
    lead: "Appointments should feel unhurried, kind, and clinically clear from the first conversation onward.",
    imageUrl:
      visualAssets.warmGpConsult,
    alt: "Veterinarian examining a dog during a consultation",
    ctaLabel: "Book a consultation",
    ctaHref: siteConfig.ctas.book,
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "We offer first consultations, rechecks, preventative appointments, and thoughtful second opinions for owners who want a calmer, more personal experience.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Where further tests or treatment are needed, the next step is explained in gentle, plain language so owners can make decisions with confidence.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-daytime-urgent-care",
    _type: "service",
    sortOrder: 2,
    eyebrow: "Urgent Care",
    title: "Daytime urgent care",
    slug: { current: "daytime-urgent-care" },
    shortDescription: "Same-day daytime support for urgent concerns during clinic hours, with clear triage and next-step guidance.",
    lead: "When something feels urgent during the day, owners need calm, practical help without feeling rushed or unsure where to turn.",
    imageUrl: visualAssets.vetDoctorWithPet,
    alt: "Veterinary doctor supporting a dog and cat during a daytime urgent care visit",
    ctaLabel: "Call about urgent care",
    ctaHref: siteConfig.ctas.call,
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Daytime urgent care is for concerns that cannot comfortably wait for a routine appointment, such as sudden illness, pain, wounds, vomiting, eye problems, breathing worries, or a pet that seems rapidly unwell.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "This is an in-hours service during clinic opening times. The team will help assess urgency, explain the safest next step, and direct out-of-hours emergencies to the appropriate provider when the clinic is closed.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-dental-care",
    _type: "service",
    sortOrder: 2,
    eyebrow: "GP Services",
    title: "Dental care",
    slug: { current: "dental-care" },
    shortDescription: "Routine oral health checks, dental treatment planning, and practical guidance around ongoing care.",
    lead: "Dental care works best when it is explained clearly and early, before discomfort becomes something a pet has quietly been living with.",
    imageUrl:
      visualAssets.gingerCatHero,
    alt: "Clean veterinary treatment room for dentistry and procedures",
    ctaLabel: "Ask about dental care",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "From routine dental assessments to treatment recommendations under anaesthetic, we guide owners through what is being seen, why treatment may be helpful, and what aftercare is likely to involve.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The aim is not simply to list procedures, but to help owners understand how oral health supports comfort, appetite, and long-term wellbeing.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-vaccinations",
    _type: "service",
    sortOrder: 3,
    eyebrow: "GP Services",
    title: "Vaccinations",
    slug: { current: "vaccinations" },
    shortDescription: "Puppy, kitten, and annual booster care supported by a proper health check.",
    lead: "Preventative medicine should feel straightforward, not like something owners have to decode on their own.",
    imageUrl:
      visualAssets.goldenDogWarm,
    alt: "Veterinary nurse holding a cat in clinic",
    ctaLabel: "Book vaccinations",
    ctaHref: siteConfig.ctas.book,
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Vaccination appointments include more than an injection alone. They are also a chance to review general health, answer practical questions, and keep preventative care on track.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Whether your pet is starting their course or attending for an annual booster, care should feel reassuring, efficient, and tailored to their stage of life.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-neutering-keyhole",
    _type: "service",
    sortOrder: 4,
    eyebrow: "GP Services",
    title: "Neutering and keyhole spays",
    slug: { current: "neutering-and-keyhole-spays" },
    shortDescription: "Routine neutering with clear advice before surgery, including laparoscopic options where appropriate.",
    lead: "Owners often want practical reassurance around timing, benefits, recovery, and whether keyhole surgery is the right option.",
    imageUrl:
      visualAssets.gingerCatCare,
    alt: "Veterinary team caring for a dog",
    ctaLabel: "Ask about neutering",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "We provide routine neutering and can discuss keyhole spays for suitable patients, with a focus on comfort, recovery, and helping owners understand the practical differences between options.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Before any procedure goes ahead, the team explains preparation, expected recovery, and what support will be available once your pet returns home.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-pet-behaviour",
    _type: "service",
    sortOrder: 5,
    eyebrow: "GP Services",
    title: "Pet behaviour",
    slug: { current: "pet-behaviour" },
    shortDescription: "Sensitive support for behavioural concerns, stress, and changes that affect life at home.",
    lead: "Behaviour concerns often come with worry, guilt, or uncertainty, so the tone here needs to feel especially kind and non-judgemental.",
    imageUrl:
      visualAssets.goldenDogCare,
    alt: "Dog looking calmly toward owner and clinician",
    ctaLabel: "Talk to us about behaviour",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Where behaviour has changed or a long-standing concern is affecting daily life, we take time to understand the full picture and guide you toward the right form of support.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "That may include ruling out medical causes first, then discussing practical behaviour-focused next steps in a measured, compassionate way.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-travel-certificate",
    _type: "service",
    sortOrder: 6,
    eyebrow: "GP Services",
    title: "Pet travel health certificates",
    slug: { current: "pet-travel-health-certificates" },
    shortDescription: "Travel paperwork and preparation support for owners planning journeys with their pets.",
    lead: "Travel certificates can feel admin-heavy, so the website should make this service feel calm, structured, and easy to start.",
    imageUrl:
      visualAssets.warmPetOwner,
    alt: "Dog in front of diagnostic imaging",
    ctaLabel: "Ask about travel documents",
    ctaHref: siteConfig.ctas.book,
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "If you are travelling with your pet, we can advise on certificates, timing, and the appointments needed so plans can be made with fewer last-minute surprises.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Because travel rules can change, the right route is always confirmed during the booking process rather than assumed online.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-in-house-diagnostics",
    _type: "service",
    sortOrder: 7,
    eyebrow: "GP Services",
    title: "In-house diagnostics",
    slug: { current: "in-house-diagnostics" },
    shortDescription: "Practical diagnostics including laboratory work, X-ray, ultrasound, and same-journey clinical investigation.",
    lead: "Good diagnostics do not just show capability. They reduce uncertainty and help owners understand why the next step is being recommended.",
    imageUrl:
      visualAssets.warmClinicDog,
    alt: "Diagnostic imaging environment in a veterinary setting",
    ctaLabel: "Ask about diagnostics",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Our GP diagnostics pathway can include blood testing, imaging, and further investigation where this helps build a clearer picture of your pet's condition.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "This does not include a CT scanner on site, but it does allow many concerns to be assessed promptly and explained with care.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-surgery-procedures",
    _type: "service",
    sortOrder: 8,
    eyebrow: "GP Services",
    title: "Surgery and procedures",
    slug: { current: "surgery-and-procedures" },
    shortDescription: "Routine and soft tissue procedures delivered with careful planning and clear aftercare advice.",
    lead: "Surgery content should reassure without becoming dramatic, and should always make space for informed decision-making.",
    imageUrl:
      visualAssets.softVetCare,
    alt: "Veterinary surgery team preparing equipment",
    ctaLabel: "Discuss a procedure",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "We provide a range of procedures and soft tissue surgical care, with treatment plans built around what is clinically appropriate and clearly discussed in advance.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Where your pet would benefit from care outside our current scope, we will guide you honestly toward the right referral pathway.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-end-of-life-care",
    _type: "service",
    sortOrder: 9,
    eyebrow: "GP Services",
    title: "End of life care",
    slug: { current: "end-of-life-care" },
    shortDescription: "Compassionate support when comfort, dignity, and kind guidance matter most.",
    lead: "This section should feel especially gentle, steady, and human in its language.",
    imageUrl:
      visualAssets.friendlyDogPortrait,
    alt: "Owner comforting a dog during a quiet moment",
    ctaLabel: "Speak to the team",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "When a pet is approaching the final stage of life, owners deserve calm advice, time to ask questions, and support that protects comfort and dignity.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "We aim to make these conversations feel personal, respectful, and as gentle as possible at every step.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-home-visits",
    _type: "service",
    sortOrder: 10,
    eyebrow: "Gentle Home Care",
    title: "Home visits",
    slug: { current: "home-visits" },
    shortDescription: "Scheduled home visits for routine checks, senior care, mobility concerns, and peaceful end-of-life support where appropriate.",
    lead: "For some pets and owners, care feels calmer at home. Home visits offer a gentle extension of the clinic when travel would create unnecessary stress.",
    imageUrl:
      visualAssets.warmPetOwner,
    alt: "Veterinary care offered in a calm home setting",
    ctaLabel: "Ask about home visits",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Home visits may be suitable for anxious cats, elderly dogs with mobility challenges, multi-pet households, routine wellness checks, vaccinations, senior care assessments, or peaceful end-of-life farewells.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "For complex medical workups, surgical procedures, or urgent emergencies, the fully equipped day clinic remains the safest and most appropriate environment. We will always advise on the best location for your pet's needs.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-referral-soft-tissue",
    _type: "service",
    sortOrder: 11,
    eyebrow: "Referral Services",
    title: "Soft tissue surgery referrals",
    slug: { current: "soft-tissue-surgery-referrals" },
    shortDescription: "Referral-only soft tissue surgery for cases that need a more advanced procedural pathway.",
    lead: "Referral messaging needs to feel clinically capable while being very clear about scope and route of access.",
    imageUrl:
      visualAssets.gingerSpanielHero,
    alt: "Veterinary surgeon preparing for a referral procedure",
    ctaLabel: "Refer a case",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Selected soft tissue procedures are available on a referral basis. This allows us to support appropriate cases while keeping the website honest about how that service is accessed.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "For owners and referring practices alike, the emphasis should be on clarity, suitability, and a well-managed pathway into treatment.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-referral-orthopaedic",
    _type: "service",
    sortOrder: 12,
    eyebrow: "Referral Services",
    title: "Orthopaedic surgery referrals",
    slug: { current: "orthopaedic-surgery-referrals" },
    shortDescription: "Referral-only orthopaedic surgery for selected cases requiring specialist procedural care.",
    lead: "Orthopaedic referral copy should feel expert and measured, without promising services beyond the current offering.",
    imageUrl:
      visualAssets.gingerCatHero,
    alt: "Dog being supported by veterinary staff during orthopaedic care",
    ctaLabel: "Discuss an orthopaedic referral",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Orthopaedic procedures are offered on a referral basis only, with assessment and planning shaped around the individual case rather than one-size-fits-all promises.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The site should make clear that referral work is available, while avoiding mention of services such as neuro surgery or other areas that are not currently offered.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-referral-endoscopy",
    _type: "service",
    sortOrder: 13,
    eyebrow: "Referral Services",
    title: "Endoscopy referrals",
    slug: { current: "endoscopy-referrals" },
    shortDescription: "Referral-only endoscopy for cases that benefit from a minimally invasive diagnostic or procedural approach.",
    lead: "Endoscopy is one of the differentiating referral services the client specifically wants surfaced in a professional way.",
    imageUrl:
      visualAssets.goldenDogWarm,
    alt: "Veterinary team working in a clean clinical environment",
    ctaLabel: "Ask about endoscopy referrals",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Endoscopy referrals are available for suitable cases and should be presented as part of a careful, modern clinical offering rather than as a broad catch-all service.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "This keeps Sutton Vet distinctive while still remaining truthful about what is available now and what may be introduced later.",
          },
        ],
      },
    ],
  },
];


