import { visualAssets } from "./visualAssets";

const pmsBookingUrl = process.env.NEXT_PUBLIC_LUPA_BOOKING_URL || process.env.NEXT_PUBLIC_PMS_BOOKING_URL || "/pms-integration?flow=book";
const pmsRegistrationUrl = process.env.NEXT_PUBLIC_LUPA_REGISTRATION_URL || process.env.NEXT_PUBLIC_PMS_REGISTRATION_URL || "/pms-integration?flow=register";
const pmsHealthPlanUrl = process.env.NEXT_PUBLIC_LUPA_HEALTHPLAN_URL || process.env.NEXT_PUBLIC_PMS_HEALTH_PLAN_URL || "/health-plan";

export const siteConfig = {
  name: "The Sutton Vet",
  shortName: "Sutton Vet",
  tagline: "PASSIONATE ABOUT ANIMALS AND OUR COMMUNITY",
  phone: "07440278373",
  emergencyPhone: "07440278373",
  email: "info@thesuttonvet.co.uk",
  whatsappLabel: "WhatsApp Our Team",
  address: "4 Spinning Wheel Way, Hackbridge, SM6 7DS",
  topbarNote: "Coming Soon Early Autumn 2026 to The New Mill Quarters Development near Hackbridge Rail Station.",
  googleProfile: "https://share.google/tGtrjzs7yPvqXlLfE",
  openingHours: [
    "Mon-Fri: 09:00am - 6:00pm",
    "Sat: 9:00am - 12.00pm",
    "Sun: Closed",
  ],
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61587599521550" },
    { label: "Instagram", href: "https://www.instagram.com/thesuttonvet/" },
    { label: "TikTok", href: "https://www.tiktok.com/@the.sutton.vet" },
    { label: "Google", href: "https://share.google/tGtrjzs7yPvqXlLfE" },
  ],
  mainNav: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/fees" },
    { label: "Health Plan", href: "/health-plan" },
    { label: "Terms", href: "/terms" },
  ],
  secondaryNav: [
    { label: "Services & Pricing", href: "/fees" },
    { label: "Find Us", href: "/contact#find-us" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Terms of Business", href: "/terms" },
  ],
  ctas: {
    register: pmsRegistrationUrl,
    book: pmsBookingUrl,
    healthPlan: pmsHealthPlanUrl,
    emergency: "tel:07440278373",
    call: "tel:07440278373",
    whatsapp: "https://wa.me/447440278373?text=Hi%20The%20Sutton%20Vet%2C%20I%20have%20a%20question%20about%20registering%20my%20pet.",
  },
  compliance: {
    registeredCompany: "The Sutton Vet is the trading name of Vet ER Ltd.",
    tradingName: "Trading name: The Sutton Vet.",
    vatNumber: "VAT Registration Number: 520 9633 01.",
    registeredOffice: "Registered office address: to be confirmed before go-live.",
    practiceAddress: "Practice / trading address: 4 Spinning Wheel Way, Hackbridge, SM6 7DS.",
    premisesNumber: "Premises Registration Number (RCVS/VMD): to be confirmed before go-live.",
  },
};

export const homeHeroStats = [
  "Independent and family-owned",
  "Transparent services and pricing",
  "Gentle local care",
];

export const homeHighlights = [
  {
    title: "Independent by design",
    description: "A smaller, family-owned practice with warmer communication and a more personal feel.",
  },
  {
    title: "Clear and fair options",
    description: "Treatment routes explained carefully, from best-care options to more practical next steps.",
  },
  {
    title: "Modern but calm",
    description: "Care presented in a grounded, reassuring way rather than a noisy corporate style.",
  },
  {
    title: "Built around real journeys",
    description: "Services, pricing, parking, and health-plan information are surfaced where owners actually need them.",
  },
];

export const homeMedia = {
  whyChooseImage:
    visualAssets.gingerSpanielHero,
  servicesVideo: "",
  servicesImage:
    visualAssets.gingerCatHero,
  trustImage:
    visualAssets.goldenDogWarm,
  trustVideo: "",
  adviceFeaturedImage:
    visualAssets.gingerCatCare,
  adviceSecondaryImage:
    visualAssets.goldenDogCare,
  ctaImage:
    visualAssets.warmPetOwner,
};

export const trustIntro = {
  eyebrow: "Trust & Community",
  title: "Independent trust signals now, stronger social proof later.",
  text:
    "Founder-led independence, professional standards, and clear opening momentum should be visible from day one.",
};

export const trustHighlights = [
  "Independent ownership and founder-led care surfaced early",
  "Professional memberships, credentials, and practice standards ready for launch",
  "CMS-ready space for reviews, testimonials, awards, or press coverage later",
];

export const trustModules = [
  {
    tag: "Now Accepting",
    title: "Opening momentum without filler claims",
    text: "Use this area for opening soon, now accepting registrations, and launch-phase confidence messages that can be updated from the CMS later.",
  },
  {
    tag: "Credentials",
    title: "Professional standards and qualifications",
    text: "A modular slot for memberships, qualifications, accreditations, and other factual trust signals once confirmed by the practice.",
  },
  {
    tag: "Future Social Proof",
    title: "Ready for reviews, awards, or press mentions",
    text: "Verified Google Reviews, testimonials, awards, and local press coverage can later replace or extend this panel without redevelopment.",
  },
];

export const founderStory = {
  eyebrow: "Founder Story",
  title: "A more personal practice, built on clearer care.",
  role: "Founder / Clinical Lead",
  paragraphs: [
    "The Sutton Vet was created for owners who want clearer advice and a genuinely independent clinical experience.",
    "The aim is to build long-term relationships and make each visit feel more personal from the start.",
  ],
  highlights: ["Founder-led care", "Independent ownership", "Long-term patient relationships"],
  quote: "Independent care should feel calmer, clearer, and more personal from the very first visit.",
  image:
    visualAssets.warmClinicDog,
};

export const serviceGroups = [
  {
    title: "Consultations",
    summary: "Routine appointments and clear treatment planning.",
  },
  {
    title: "Diagnostics",
    summary: "X-ray, ultrasound, and practical diagnostics.",
  },
  {
    title: "Surgery",
    summary: "General surgical care with a calm, safety-first tone.",
  },
  {
    title: "Dentistry",
    summary: "Dental advice and treatment support made straightforward.",
  },
  {
    title: "Preventative Clinics",
    summary: "Vaccinations, parasite care, and nurse-led support.",
  },
];

export const serviceDetails = [
  {
    title: "Consultations",
    text: "For first appointments, follow-ups, and day-to-day clinical concerns, this page will lead clients toward the right booking route without clutter.",
  },
  {
    title: "Diagnostics",
    text: "Diagnostic content should reassure owners about capability while keeping claims factual and grounded.",
  },
  {
    title: "Surgery",
    text: "Surgical information should feel clear, responsible, and practical rather than dramatic or promotional.",
  },
  {
    title: "Dentistry",
    text: "Dental care copy should explain routine oral health support and when treatment may be recommended.",
  },
  {
    title: "Nurse-led Preventative Clinics",
    text: "This section supports long-term client value through wellness, checks, and preventative care touchpoints.",
  },
];

export const feePreview = [
  { label: "Consultation", price: "GBP --", note: "CMS-managed placeholder" },
  { label: "Primary Vaccinations", price: "GBP --", note: "Species-specific pricing" },
  { label: "Microchipping", price: "GBP --", note: "Visible fee guidance" },
  { label: "Neutering", price: "GBP --", note: "Tiered placeholder structure" },
];

export const healthPlanTiers = [
  {
    title: "Dogs",
    detail: "Annual booster, parasite prevention, routine health checks, microchip support, and core discounts.",
    pricing: "Tiered by weight class",
  },
  {
    title: "Cats",
    detail: "Annual booster, parasite control, routine checks, and preventative support.",
    pricing: "Flat monthly fee",
  },
];

export const planBenefits = [
  "Different from insurance",
  "Predictable monthly budgeting",
  "Clear route to sign-up later",
];

export const teamCategories = [
  {
    title: "Veterinary Surgeons",
    description: "Clinical leadership and continuity-led treatment.",
  },
  {
    title: "RVNs",
    description: "Nurse-led preventative and in-practice support.",
  },
  {
    title: "Client Care & Reception",
    description: "Warm first-contact communication and practical guidance.",
  },
];

export const blogPreview = [
  {
    title: "What to expect at your first visit",
    category: "New Clients",
    excerpt: "Registration, consultation flow, and what to bring.",
    meta: "First visit guide",
    date: "July 2026",
    cta: "Read article",
  },
  {
    title: "Understanding preventative care plans",
    category: "Health Plan",
    excerpt: "How the plan supports predictable care costs.",
    meta: "Explainer",
    date: "July 2026",
    cta: "Read article",
  },
  {
    title: "When to call urgently",
    category: "Emergency",
    excerpt: "Urgent contact triggers and out-of-hours direction.",
    meta: "Urgent support",
    date: "July 2026",
    cta: "Read article",
  },
];

export const socialPreviewCards = [
  {
    platform: "Instagram",
    title: "Clinic calm",
    caption: "Short visual updates from routine care and behind-the-scenes preparation.",
    image:
      visualAssets.softVetCare,
  },
  {
    platform: "TikTok",
    title: "First visit tips",
    caption: "Quick guidance clips for registrations, practical prep, and arrival reassurance.",
    image:
      visualAssets.friendlyDogPortrait,
  },
  {
    platform: "Instagram",
    title: "Meet the team",
    caption: "Gentle introductions to the people behind the practice before opening day.",
    image:
      visualAssets.gingerSpanielHero,
  },
  {
    platform: "TikTok",
    title: "Preventative care",
    caption: "Short explainers on boosters, parasite cover, and routine health planning.",
    image:
      visualAssets.gingerCatHero,
  },
  {
    platform: "Instagram",
    title: "Local practice",
    caption: "Visual posts focused on Sutton, Hackbridge, and the feel of an independent clinic.",
    image:
      visualAssets.goldenDogWarm,
  },
  {
    platform: "TikTok",
    title: "Booking help",
    caption: "Simple clips answering what to do next when owners are unsure which route to take.",
    image:
      visualAssets.gingerCatCare,
  },
  {
    platform: "Instagram",
    title: "Patient moments",
    caption: "Warm, owner-friendly moments that keep the brand human without feeling noisy.",
    image:
      visualAssets.goldenDogCare,
  },
  {
    platform: "TikTok",
    title: "Urgent guidance",
    caption: "Fast reminders about when to call promptly and how out-of-hours support works.",
    image:
      visualAssets.warmPetOwner,
  },
  {
    platform: "Instagram",
    title: "Practice details",
    caption: "Parking notes, route guidance, and launch updates in a lighter visual format.",
    image:
      visualAssets.warmClinicDog,
  },
  {
    platform: "TikTok",
    title: "Health plan clips",
    caption: "Short, repeatable content around routine care budgeting and preventative support.",
    image:
      visualAssets.softVetCare,
  },
];

export const faqPreview = [
  {
    question: "How do I register with The Sutton Vet?",
    answer: "Registration will route to the approved PMS / online portal workflow, with supporting guidance kept on-site.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer: "We will surface practical checklists such as previous records, medication details, and insurance information.",
  },
  {
    question: "Is the Health Plan the same as insurance?",
    answer: "No. The plan is preventative care and budgeting support, not emergency or illness insurance cover.",
  },
  {
    question: "How do out-of-hours emergencies work?",
    answer: "The site must show a clear split between open-hours contact and out-of-hours instructions, especially on mobile.",
  },
];

export const locationPoints = [
  "Hyper-local reassurance near Sutton and Hackbridge",
  "Google map and local travel guidance built into the contact journey",
  "Google Business Profile alignment required before go-live",
];

export const practiceTourPreview = {
  title: "Future practice tour video slot",
  text: "A CMS-driven YouTube embed can later be added here to give owners a calm first look at the practice before their visit.",
};

export const legalPageCopy = {
  privacy:
    "This page explains what website data is processed, why it is processed, how long it is retained, and how visitors can exercise their rights.",
  cookies:
    "This page records which website technologies are active, which stay blocked until consent is given, and how visitors can change their choices.",
  accessibility:
    "This statement explains the accessibility standards targeted for launch, how the site supports assistive technology, and where visitors can report issues.",
  terms:
    "This page sets out the practice terms for appointments, payments, cancellations, emergencies, and client responsibilities in a factual, non-promotional format.",
};

export const privacySections = [
  {
    title: "Who controls your information",
    body: [
      "The Sutton Vet website is operated for the practice trading as The Sutton Vet. The live site footer and final legal pages must show the confirmed company details, trading address, and the correct contact route for privacy-related questions.",
      "Before go-live, the practice should confirm the registered office address and privacy contact details so no placeholder information remains on the public website.",
    ],
  },
  {
    title: "What information may be collected",
    body: [
      "The website may process contact details submitted through enquiries, technical data required for security and accessibility, and usage data where the visitor has explicitly accepted analytics cookies.",
      "If a visitor follows a link to the PMS / online portal, WhatsApp, or another third-party service, that interaction may then be governed by the privacy terms of that third party as well as this website.",
    ],
  },
  {
    title: "Why the information is used",
    body: [
      "Information is used to respond to enquiries, support registration and booking journeys, maintain security, improve site performance where consent has been provided, and meet applicable legal or regulatory obligations.",
      "Non-essential analytics, marketing tools, and embedded social or video technologies must remain blocked until the visitor actively opts in.",
    ],
  },
  {
    title: "Lawful basis",
    body: [
      "Depending on the interaction, the lawful basis may include legitimate interests for core website operation, consent for optional cookies and analytics, and steps taken at the user's request before a service relationship begins.",
      "Where consent is relied upon, visitors must be able to reject optional cookies as easily as they can accept them.",
    ],
  },
  {
    title: "How long information is kept",
    body: [
      "The final live policy should confirm retention periods for website enquiries, consent preferences, and any optional analytics data. These retention periods should be approved by the practice before launch.",
      "Consent records should only be retained for as long as reasonably necessary to evidence the visitor's choice and manage repeat visits.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Visitors should be informed that they may request access to their information, correction, erasure, restriction, objection, or data portability where applicable, and may withdraw optional cookie consent at any time.",
      "The final page should also explain how a concern can be raised with the Information Commissioner's Office if a visitor believes their information has been handled improperly.",
    ],
  },
  {
    title: "ICO registration",
    body: [
      "The project scope notes that ICO registration should be confirmed by the practice because client and patient data is processed electronically. That confirmation is a practice responsibility separate from the website build itself.",
    ],
  },
];

export const cookieSections = [
  {
    title: "Necessary cookies",
    body: "These support essential site functions such as accessibility, security, network stability, and saving the visitor's cookie choices. They cannot be switched off through the consent tool because the website depends on them.",
    status: "Always active",
  },
  {
    title: "Preference cookies",
    body: "These remember optional interface choices and similar convenience settings. They should remain off unless the visitor actively enables them.",
    status: "Optional",
  },
  {
    title: "Analytics cookies",
    body: "These measure website usage, performance, and CTA activity. Under the scope, tools such as Google Analytics must not load until the visitor has given clear consent.",
    status: "Optional",
  },
  {
    title: "Marketing and embedded media",
    body: "This category covers marketing pixels and third-party embeds such as social feeds or future video widgets that may place cookies or similar tracking technologies. They must remain blocked until the visitor opts in.",
    status: "Optional",
  },
];

export const cookieInventory = [
  {
    name: "cookie_consent",
    provider: "The Sutton Vet website",
    purpose: "Stores the visitor's consent preferences for necessary, preferences, analytics, and marketing categories.",
    duration: "Up to 6 months or until changed",
  },
  {
    name: "Future analytics cookies",
    provider: "To be confirmed if analytics is enabled",
    purpose: "Would measure visits, page performance, and CTA events only after consent has been granted.",
    duration: "To be confirmed before launch",
  },
  {
    name: "Future embedded media cookies",
    provider: "YouTube, Instagram, TikTok, or other approved providers",
    purpose: "Would support embedded video or social content if those features are activated and the visitor has opted in.",
    duration: "Controlled by the relevant third party",
  },
];

export const accessibilitySections = [
  {
    title: "Accessibility approach",
    body: [
      "The Sutton Vet website is intended to be usable across desktop, tablet, and mobile devices, with clear navigation, readable contrast, and straightforward content structure.",
      "Accessibility work is treated as part of overall product quality rather than an isolated legal add-on.",
    ],
  },
  {
    title: "Supported access features",
    body: [
      "The site is designed to support keyboard navigation, visible focus states, responsive layouts, descriptive link text, image alternative text, and content that remains understandable without relying on animation alone.",
      "Typography, spacing, and colour contrast should remain practical for general readability rather than using decorative choices that reduce clarity.",
    ],
  },
  {
    title: "Third-party and consent-controlled content",
    body: [
      "Some third-party features such as embedded maps or future video content may remain blocked until optional cookie consent has been given. Where possible, a direct external link should still be offered as a fallback route.",
      "This helps balance privacy compliance with practical access to important information such as directions or video content.",
    ],
  },
  {
    title: "Reporting an issue",
    body: [
      "If a visitor experiences an accessibility barrier, the practice should provide a clear contact route so that the issue can be reported and reviewed.",
      "Before go-live, the preferred accessibility contact details should be confirmed and inserted into this page.",
    ],
  },
];

export const termsSections = [
  {
    title: "Appointments and booking",
    body: [
      "Appointments, registrations, and first-visit enquiries should follow the approved booking routes provided by the practice, including any linked third-party booking workflow.",
      "Clients should provide accurate contact details and practical information relevant to the appointment at the time of booking where possible.",
    ],
  },
  {
    title: "Fees and payment",
    body: [
      "Website pricing should be treated as guidance unless confirmed otherwise by the practice. Any treatment, procedure, or diagnostic work requiring a tailored estimate should be discussed directly before commitment.",
      "Payments, deposits, and account handling rules should be confirmed by the practice and reflected here before launch.",
    ],
  },
  {
    title: "Cancellations and missed appointments",
    body: [
      "The live terms should explain the notice expected for cancellations, any missed-appointment policy, and whether deposits may be retained in certain circumstances.",
      "This wording should remain factual, proportionate, and aligned with the practice's approved policy.",
    ],
  },
  {
    title: "Emergency and out-of-hours care",
    body: [
      "Emergency routing information on the website must guide clients toward the correct in-hours or out-of-hours route, but the final live terms should clarify that clinical triage and service availability are subject to the practice's operational arrangements.",
      "The website should not promise outcomes or imply guaranteed treatment access beyond what the practice can verify.",
    ],
  },
  {
    title: "Professional and advertising standards",
    body: [
      "All website content should remain accurate, factual, and consistent with RCVS advertising expectations. Pricing, qualifications, and treatment claims should be verifiable and should avoid exaggerated or sales-heavy language.",
      "Named prescription-only medicines should not be promoted directly to consumers on the website or in embedded content.",
    ],
  },
  {
    title: "Client images and case material",
    body: [
      "Any client, patient, or case-related material used in website or social content should only be published where the necessary permissions have been obtained and recorded separately by the practice.",
      "This includes photos, videos, testimonials, and any case details that could identify a client or patient.",
    ],
  },
];
