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
  eyebrow: "GP & Services",
  title: "Thoughtful veterinary care, organised around what owners need most.",
  description:
    "Appointments, daytime urgent care, preventative care, procedures, diagnostics, surgery, and endoscopy are listed in one simple guide.",
  introNote: "Each service block below can be edited from Sanity, including title, copy, image, and CTA.",
  primaryCtaLabel: "Book Online",
  primaryCtaHref: siteConfig.ctas.book,
  secondaryCtaLabel: "Register Now",
  secondaryCtaHref: siteConfig.ctas.register,
  closingEyebrow: "Next Step",
  closingTitle: "Need help choosing the right appointment?",
  closingText:
    "Tell us what is happening and we will guide you to the right appointment or estimate.",
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
            text: "If another provider is more suitable, we will guide you honestly.",
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
    _id: "service-service-soft-tissue",
    _type: "service",
    sortOrder: 11,
    eyebrow: "Service",
    title: "Soft tissue surgery",
    slug: { current: "soft-tissue-surgery" },
    shortDescription: "Soft tissue surgery for suitable cases.",
    lead: "Soft tissue surgery is explained clearly before treatment is planned.",
    imageUrl:
      visualAssets.gingerSpanielHero,
    alt: "Veterinary surgeon preparing for a procedure",
    ctaLabel: "Ask about soft tissue surgery",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Selected soft tissue procedures are available for suitable cases.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The focus is clear planning, suitability, and careful aftercare.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-service-orthopaedic",
    _type: "service",
    sortOrder: 12,
    eyebrow: "Service",
    title: "Orthopaedic surgery",
    slug: { current: "orthopaedic-surgery" },
    shortDescription: "Orthopaedic surgery for suitable cases.",
    lead: "Orthopaedic surgery is assessed carefully before treatment is planned.",
    imageUrl:
      visualAssets.gingerCatHero,
    alt: "Dog being supported by veterinary staff during orthopaedic care",
    ctaLabel: "Discuss orthopaedic surgery",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Orthopaedic procedures are planned around the individual patient.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The service list stays clear about what is available now.",
          },
        ],
      },
    ],
  },
  {
    _id: "service-service-endoscopy",
    _type: "service",
    sortOrder: 13,
    eyebrow: "Service",
    title: "Endoscopy",
    slug: { current: "endoscopy" },
    shortDescription: "Endoscopy for suitable diagnostic or procedural cases.",
    lead: "Endoscopy is listed clearly as part of the current service offer.",
    imageUrl:
      visualAssets.goldenDogWarm,
    alt: "Veterinary team working in a clean clinical environment",
    ctaLabel: "Ask about endoscopy",
    ctaHref: "/contact",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Endoscopy is available for suitable cases.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The team can explain suitability before booking.",
          },
        ],
      },
    ],
  },
];



seededServices.push(
  {
    _id: "service-pet-club-preventative-care",
    _type: "service",
    sortOrder: 14,
    eyebrow: "Preventative Care",
    title: "Pet Club preventative care",
    slug: { current: "pet-club-preventative-care" },
    shortDescription: "Preventative care benefits including vaccines, parasite support, nurse checks, and routine savings.",
    lead: "Pet Club content should feel helpful and simple while final plan pricing and terms are confirmed.",
    imageUrl: visualAssets.goldenDogCare,
    alt: "Happy dog receiving gentle preventative veterinary care",
    ctaLabel: "Ask about Pet Club",
    ctaHref: "/health-plan",
    content: [
      { _type: "block", children: [{ _type: "span", text: "The Pet Club service list includes annual vaccines, flea and worming support, quarterly health checks, home delivery of preventative medicines, nail clips, anal gland support, urine dipstick checks, and practical nurse-led preventative care." }] },
      { _type: "block", children: [{ _type: "span", text: "Final inclusions and pricing can be confirmed later, but the website now makes the preventative-care offer visible and easy to understand." }] },
    ],
  },
  {
    _id: "service-nurse-clinics",
    _type: "service",
    sortOrder: 15,
    eyebrow: "Clinical Service",
    title: "Nurse clinics",
    slug: { current: "nurse-clinics" },
    shortDescription: "Nurse-led support for routine checks, preventative care, nail trims, anal glands, and practical follow-up guidance.",
    lead: "Nurse clinics help owners access smaller but important care moments without making the journey feel complicated.",
    imageUrl: visualAssets.warmPetOwner,
    alt: "Veterinary nurse supporting a pet owner during a calm clinic appointment",
    ctaLabel: "Book a nurse clinic",
    ctaHref: siteConfig.ctas.book,
    content: [
      { _type: "block", children: [{ _type: "span", text: "Nurse appointments can support preventative healthcare checks, weight monitoring, nail trims, anal gland expression, and practical routine-care conversations." }] },
      { _type: "block", children: [{ _type: "span", text: "These appointments are useful when owners need clear, gentle guidance without waiting until a concern becomes more stressful." }] },
    ],
  },
  {
    _id: "service-hospitalisation-and-day-care",
    _type: "service",
    sortOrder: 16,
    eyebrow: "Clinical Service",
    title: "Hospitalisation and day care",
    slug: { current: "hospitalisation-and-day-care" },
    shortDescription: "Day-patient monitoring and hospitalisation support when pets need closer observation during clinic hours.",
    lead: "Hospitalisation language should reassure owners that their pet will be monitored with calm, practical attention.",
    imageUrl: visualAssets.softVetCare,
    alt: "Calm veterinary clinical area prepared for patient monitoring",
    ctaLabel: "Ask about hospitalisation",
    ctaHref: "/contact",
    content: [
      { _type: "block", children: [{ _type: "span", text: "Hospitalisation and day care are available where a pet needs observation, treatment, recovery time, or closer monitoring during the clinical day." }] },
      { _type: "block", children: [{ _type: "span", text: "The team can explain what monitoring is needed, how updates will be shared, and what owners should expect before discharge." }] },
    ],
  },
  {
    _id: "service-exotic-pet-care",
    _type: "service",
    sortOrder: 17,
    eyebrow: "Clinical Service",
    title: "Exotic pet care",
    slug: { current: "exotic-pet-care" },
    shortDescription: "Support for selected exotic pets, with suitability confirmed before booking.",
    lead: "Exotic pet enquiries should be routed carefully so owners know whether the practice is the right place to start.",
    imageUrl: visualAssets.gingerCatCare,
    alt: "Small pet receiving calm veterinary support",
    ctaLabel: "Ask about exotic care",
    ctaHref: "/contact",
    content: [
      { _type: "block", children: [{ _type: "span", text: "The services list includes exotic pet care. Because exotic species can need very specific equipment and handling, owners should contact the team first so suitability can be confirmed." }] },
      { _type: "block", children: [{ _type: "span", text: "If another route is more appropriate, the team can help point owners in the right direction with clarity and kindness." }] },
    ],
  },
  {
    _id: "service-cremation-arrangements",
    _type: "service",
    sortOrder: 18,
    eyebrow: "End of Life Care",
    title: "Cremation arrangements",
    slug: { current: "cremation-arrangements" },
    shortDescription: "Cremation-only arrangements and aftercare support handled with sensitivity and clear guidance.",
    lead: "Aftercare needs to feel quiet, respectful, and easy to understand at a difficult time.",
    imageUrl: visualAssets.warmClinicDog,
    alt: "Peaceful dog resting in a warm home setting",
    ctaLabel: "Talk to us about aftercare",
    ctaHref: "/contact",
    content: [
      { _type: "block", children: [{ _type: "span", text: "Cremation arrangements can be discussed separately from euthanasia care, with options explained plainly and without pressure." }] },
      { _type: "block", children: [{ _type: "span", text: "The aim is to make aftercare decisions feel supported, respectful, and as straightforward as possible." }] },
    ],
  },
  {
    _id: "service-dental-scale-and-polish",
    _type: "service",
    sortOrder: 19,
    eyebrow: "Dental Care",
    title: "Scale and polish",
    slug: { current: "scale-and-polish" },
    shortDescription: "Dental scale and polish appointments, with dental X-rays and extractions discussed where needed.",
    lead: "Dental treatment should be clear about what is routine and what may need a more detailed estimate.",
    imageUrl: visualAssets.gingerCatPortrait,
    alt: "Cat sitting calmly before dental care",
    ctaLabel: "Ask about dental care",
    ctaHref: siteConfig.ctas.book,
    content: [
      { _type: "block", children: [{ _type: "span", text: "The dental services list includes scale and polish care, dental X-rays, extractions where clinically needed, and post-dental support." }] },
      { _type: "block", children: [{ _type: "span", text: "Exact pricing can be added later or confirmed by quote, because dental treatment depends on the mouth, X-ray findings, and the level of care required." }] },
    ],
  },
  {
    _id: "service-laparoscopic-procedures",
    _type: "service",
    sortOrder: 20,
    eyebrow: "Keyhole Procedures",
    title: "Laparoscopic procedures",
    slug: { current: "laparoscopic-procedures" },
    shortDescription: "Keyhole spays and selected laparoscopic procedures including gastropexy and liver biopsy where appropriate.",
    lead: "Keyhole procedures should be presented as carefully selected options, not as something every patient automatically needs.",
    imageUrl: visualAssets.vetDoctorWithPet,
    alt: "Veterinary doctor preparing for a calm procedural appointment",
    ctaLabel: "Ask about keyhole options",
    ctaHref: "/contact",
    content: [
      { _type: "block", children: [{ _type: "span", text: "The procedure list includes laparoscopic spays, laparoscopic-assisted gastropexy, gastropexy add-ons where suitable, and laparoscopic liver biopsies." }] },
      { _type: "block", children: [{ _type: "span", text: "Suitability depends on the patient and procedure, so owners can call for advice or a quote before planning treatment." }] },
    ],
  },
  {
    _id: "service-pre-operative-consults",
    _type: "service",
    sortOrder: 21,
    eyebrow: "Procedure Planning",
    title: "Pre-operative consultations",
    slug: { current: "pre-operative-consultations" },
    shortDescription: "Pre-operative consultations to plan procedures, risks, recovery, estimates, and owner questions.",
    lead: "Pre-operative planning helps make bigger decisions feel calmer, clearer, and more manageable.",
    imageUrl: visualAssets.friendlyDogPortrait,
    alt: "Friendly dog during a calm veterinary planning appointment",
    ctaLabel: "Book a pre-op consult",
    ctaHref: siteConfig.ctas.book,
    content: [
      { _type: "block", children: [{ _type: "span", text: "Pre-operative consultations are available before procedures so the team can explain suitability, preparation, estimate ranges, recovery, and aftercare." }] },
      { _type: "block", children: [{ _type: "span", text: "This gives owners a clearer route into treatment before committing to a surgical or care pathway." }] },
    ],
  },
);

export const masterServiceGroups = [
  {
    title: "Pet Club and preventative care",
    description: "Benefits and routine support from the master list, with final prices to be confirmed.",
    items: ["Annual vaccines", "Preventative flea and worming medicines", "Microchip guidance", "Quarterly health checks", "Home delivery of preventative medicines", "Preventative nurse consultations", "Nail clips", "Anal gland support", "Urine dipstick and USG testing", "Insurance and direct claim administration", "Routine health plan savings"],
  },
  {
    title: "Vaccinations and routine procedures",
    description: "Everyday cat and dog services owners usually need first.",
    items: ["Cat vaccinations", "Dog vaccinations", "Primary vaccination courses", "Cat neutering", "Dog castration", "Dog spays", "Keyhole spays", "Laparoscopic-assisted gastropexy", "Laparoscopic liver biopsies", "Pre-operative consultations", "Nurse clinics", "Hospitalisation and day care"],
  },
  {
    title: "Dentistry, imaging, and diagnostics",
    description: "Clinical investigation and dental care, with quote-led pricing where needed.",
    items: ["Dental scale and polish", "Dental X-rays", "Dental extractions", "Post-dental packs", "Laboratory testing", "X-rays", "Ultrasound", "Urine testing", "Radiology report support", "Diagnostic imaging discussions"],
  },
  {
    title: "Soft tissue procedures",
    description: "Selected soft tissue procedures, where appropriate.",
    items: ["Total ear canal ablation", "Anal sacculectomy", "Forequarter amputation", "Perineal hernia repair", "Soft tissue mass removal", "Complex mass removal with flap", "Thyroidectomy", "Perineal urethrostomy", "Mammary strip surgery", "Tieback surgery", "Exploratory coeliotomy", "Screw tail surgery", "Salivary mucoele surgery", "BOAS surgery", "Diaphragmatic rupture or hernia repair", "Enterectomy", "Entropion surgery", "Cherry eye surgery", "Gall bladder removal", "Inguinal hernia repair", "Liver lobectomy", "Nephrectomy", "Ovarian remnant surgery", "Scrotal urethrostomy", "Sialoadenectomy", "Bloat and GDV surgery", "Foreign body removal", "Splenectomy", "Gastrotomy", "Enterotomy"],
  },
  {
    title: "Orthopaedic procedures",
    description: "Orthopaedic procedures are assessed carefully around each patient.",
    items: ["TPLO", "TPLO with patellar luxation", "Patellar luxation surgery", "Implant removal", "Femoral head and neck excision", "Arthrodesis", "Elbow arthroscopy", "Simple fracture repair", "Moderate fracture plating", "Complex fracture repair", "Shoulder OCD fragment removal", "Hip toggle", "Extra-capsular suture", "Bone graft substitute support"],
  },
  {
    title: "Endoscopy and sensitive care",
    description: "Endoscopy, end-of-life support, and services that need a careful conversation first.",
    items: ["Rigid endoscopy", "Flexible endoscopy", "Bronchoscopy", "Cystoscopy", "Rhinoscopy", "Endoscopic biopsies", "Endoscopic foreign body removal", "BAL support", "Euthanasia care", "Sedation surcharge guidance", "Cremation arrangements", "Exotic pet care"],
  },
];

export const publicServiceSlugs = new Set([
  "gp-consultations",
  "daytime-urgent-care",
  "dental-care",
  "vaccinations",
  "neutering-and-keyhole-spays",
  "in-house-diagnostics",
  "surgery-and-procedures",
  "end-of-life-care",
  "soft-tissue-surgery",
  "orthopaedic-surgery",
  "endoscopy",
  "pet-club-preventative-care",
  "nurse-clinics",
  "hospitalisation-and-day-care",
  "exotic-pet-care",
  "cremation-arrangements",
  "scale-and-polish",
  "laparoscopic-procedures",
  "pre-operative-consultations",
]);
