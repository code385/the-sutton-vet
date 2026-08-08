import { healthPlanPageSeed } from "@/lib/healthPlanSeed";
import { feeCategorySeeds, pricingPageSeed } from "@/lib/pricingSeed";
import {
  accessibilitySections,
  blogPreview,
  cookieInventory,
  cookieSections,
  founderStory,
  healthPlanTiers,
  faqPreview,
  homeHighlights,
  homeHeroStats,
  homeMedia,
  legalPageCopy,
  locationPoints,
  practiceTourPreview,
  privacySections,
  serviceDetails,
  siteConfig,
  socialPreviewCards,
  termsSections,
  trustHighlights,
  trustIntro,
  trustModules,
} from "@/lib/site";
import { fallbackTeamMembers, teamPageSeed } from "@/lib/teamSeed";
import { seededServices, servicesPageSeed } from "@/lib/servicesSeed";

type SanitySeedDocument = Record<string, unknown>;

const homePageSeedDocument: SanitySeedDocument = {
  _id: "homePage",
  _type: "homePage",
  heroEyebrow: "Independent veterinary care in Sutton",
  heroTitle: "You'll always want calm, capable care close by. We make that decision feel easier.",
  heroDescription:
    "Founder-led veterinary care with a more personal experience, clear next steps, and a smoother route into registration, booking, and urgent support.",
  heroPracticalNote: "Near Hackbridge station, with practical parking guidance surfaced early for first visits.",
  heroImageUrl: homeMedia.whyChooseImage,
  heroVideoUrl: "https://videos.pexels.com/video-files/6230151/6230151-hd_1920_1080_25fps.mp4",
  heroPrimaryCtaLabel: "Register Now",
  heroPrimaryCtaHref: siteConfig.ctas.register,
  heroSecondaryCtaLabel: "Book Online",
  heroSecondaryCtaHref: siteConfig.ctas.book,
  heroStats: homeHeroStats,
  heroLinks: [
    { label: "Services", href: "/services" },
    { label: "Health Plan", href: "/health-plan" },
    { label: "Contact", href: "/contact" },
  ],
  whyChooseEyebrow: "Why Choose The Sutton Vet",
  whyChooseTitle: "Independent, transparent, and reassuring from day one.",
  whyChooseDescription:
    "Local ownership, practical pricing clarity, and compassionate evidence-based care should all feel clear within seconds.",
  whyChooseSecondaryText:
    "The aim is to make new clients in Sutton feel informed, calmer, and more confident before they even get in touch.",
  whyChooseImageUrl: homeMedia.whyChooseImage,
  whyChooseMediaTitle: "Modern facilities",
  whyChooseMediaDescription: "Calmer, clearer clinical surroundings help first visits feel less overwhelming.",
  whyChoosePills: ["Local ownership", "Clear pricing cues", "Modern facilities"],
  whyChooseCards: homeHighlights.map((item) => ({
    title: item.title,
    description: item.description,
  })),
  founderEyebrow: founderStory.eyebrow,
  founderTitle: founderStory.title,
  founderRole: founderStory.role,
  founderQuote: founderStory.quote,
  founderPortraitKicker: "Founder portrait",
  founderPortraitBadgeText: "Professional founder photography can be replaced from the CMS later.",
  founderHighlights: founderStory.highlights,
  founderStory: founderStory.paragraphs.map((text) => ({
    _type: "block",
    children: [{ _type: "span", text }],
  })),
  founderPrimaryCtaLabel: "Register Now",
  founderPrimaryCtaHref: siteConfig.ctas.register,
  founderSecondaryCtaLabel: "Talk to our team on WhatsApp",
  founderSecondaryCtaHref: siteConfig.ctas.whatsapp,
  servicesEyebrow: "Core services",
  servicesTitle: "Practical services with clearer pathways.",
  servicesDescription:
    "The homepage should reassure first, then guide visitors into the right clinical pathway without making the site feel crowded.",
  servicesImageUrl: homeMedia.servicesImage,
  servicesVideoUrl: homeMedia.servicesVideo,
  servicesMediaKicker: "Services overview",
  servicesMediaCaption: "Use the services page for fuller clinical detail while the homepage stays clean and directional.",
  servicesMediaButtonLabel: "View Services",
  servicesMediaButtonHref: "/services",
  servicesPoints: serviceDetails.map((item) => item.title),
  healthPlanEyebrow: "Health plan",
  healthPlanTitle: "Spread routine care costs without making the page feel sales-led.",
  healthPlanDescription:
    "The homepage teaser should explain the plan simply, then let owners choose whether to go deeper into the dedicated Health Plan journey.",
  healthPlanSecondaryText:
    "This section builds trust before asking for a deeper commitment, while still giving visitors a direct route into the dedicated Health Plan page and later the approved PMS / online portal workflow.",
  healthPlanPrimaryCtaLabel: "Explore Health Plan",
  healthPlanPrimaryCtaHref: "/health-plan",
  healthPlanSecondaryCtaLabel: "Read Common Questions",
  healthPlanSecondaryCtaHref: "/contact",
  healthPlanVideoUrl: "https://videos.pexels.com/video-files/854132/854132-hd_1920_1080_25fps.mp4",
  healthPlanPosterUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1400&q=80",
  healthPlanCardEyebrow: "Plan snapshot",
  healthPlanCardTitle: "Built for dogs and cats with clear pricing logic.",
  healthPlanTiers: healthPlanTiers.map((item) => ({
    title: item.title,
    detail: item.detail,
    pricing: item.pricing,
  })),
  healthPlanBenefits: ["Different from insurance", "Predictable monthly budgeting", "Clear route to sign-up later"],
  trustEyebrow: trustIntro.eyebrow,
  trustTitle: trustIntro.title,
  trustText: trustIntro.text,
  trustImageUrl: homeMedia.trustImage,
  trustPills: ["Founder-led", "Registrations open", "CMS swappable content"],
  trustHighlights,
  trustModules: trustModules.map((item) => ({
    tag: item.tag,
    title: item.title,
    text: item.text,
  })),
  locationEyebrow: "Find us",
  locationTitle: "Exact location and directions should be clear early.",
  locationAddress: siteConfig.address,
  locationDirectionsLabel: "Get directions",
  locationDirectionsHref: "https://maps.google.com/?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS",
  locationPoints,
  locationMapImageUrl: homeMedia.trustImage,
  homepageVideoUrl: "",
  homepageVideoEyebrow: "Practice Tour",
  homepageVideoTitle: practiceTourPreview.title,
  homepageVideoDescription: practiceTourPreview.text,
  homepageVideoActionLabel: "Open on YouTube",
  adviceEyebrow: "Advice & Content",
  adviceTitle: "Latest advice",
  adviceIntroText: "Two clear recent articles are enough on the homepage. The fuller editorial browse belongs on the blog page.",
  adviceCtaLabel: "View blog",
  adviceCtaHref: "/contact",
  advicePills: ["Latest articles", "Practical pet advice", "Read more flow"],
  adviceFeaturedImageUrl: homeMedia.adviceFeaturedImage,
  adviceSecondaryImageUrl: homeMedia.adviceSecondaryImage,
  adviceArticles: blogPreview.map((item) => ({
    category: item.category,
    date: item.date,
    title: item.title,
    excerpt: item.excerpt,
    meta: item.meta,
    cta: item.cta,
    href: "/contact",
  })),
  socialEyebrow: "Social preview",
  socialTitle: "Social updates",
  socialDescription: "A lighter visual strip for Instagram and TikTok style content, with each card linking outward rather than loading heavy embeds into the homepage.",
  socialInstagramLabel: "Open Instagram",
  socialTikTokLabel: "Open TikTok",
  socialCards: socialPreviewCards.map((item) => ({
    platform: item.platform,
    title: item.title,
    caption: item.caption,
    image: item.image,
  })),
  ctaEyebrow: "Next Step",
  ctaTitle: "Ready to register or ask a question?",
  ctaText: "Every page should still end with a clear route into booking, registration, or direct contact.",
  ctaPrimaryLabel: "Register Now",
  ctaPrimaryHref: siteConfig.ctas.register,
  ctaSecondaryLabel: "Book Online",
  ctaSecondaryHref: siteConfig.ctas.book,
};

const siteSettingsSeedDocument: SanitySeedDocument = {
  _id: "siteSettings",
  _type: "siteSettings",
  practiceName: siteConfig.name,
  shortName: siteConfig.shortName,
  tagline: siteConfig.tagline,
  footerTagline: "Independent veterinary care in Sutton.",
  topbarNote: siteConfig.topbarNote,
  phone: siteConfig.phone,
  emergencyPhone: siteConfig.emergencyPhone,
  email: siteConfig.email,
  address: siteConfig.address,
  openingHours: [
    { day: "Monday", hours: "09:00am - 6:00pm" },
    { day: "Tuesday", hours: "09:00am - 6:00pm" },
    { day: "Wednesday", hours: "09:00am - 6:00pm" },
    { day: "Thursday", hours: "09:00am - 6:00pm" },
    { day: "Friday", hours: "09:00am - 6:00pm" },
    { day: "Saturday", hours: "9:00am - 12.00pm" },
    { day: "Sunday", hours: "Closed" },
  ],
  whatsappNumber: "923063892101",
  whatsappPrefillMessage: "Hi The Sutton Vet, I have a question about registering my pet.",
  lupaBookingUrl: siteConfig.ctas.book,
  lupaRegistrationUrl: siteConfig.ctas.register,
  healthPlanUrl: siteConfig.ctas.healthPlan,
  googleBusinessProfileUrl: siteConfig.googleProfile,
  googleMapEmbedUrl: "https://www.google.com/maps?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS&output=embed",
  hasMapUrl: "https://maps.google.com/?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS",
  knowsAbout: [
    "Independent veterinary care",
    "Consultations",
    "Diagnostics",
    "X-ray",
    "Ultrasound",
    "Surgery",
    "Dentistry",
    "Preventative care",
    "Health plans",
    "Sutton",
    "Hackbridge",
    "Beddington Park",
  ],
  socialLinks: siteConfig.socials.map((item) => ({
    label: item.label,
    href: item.href,
    icon: item.label,
  })),
  mainNav: siteConfig.mainNav,
  legalLinks: siteConfig.legalLinks,
  headerCtas: {
    emergencyLabel: "Emergency",
    bookLabel: "Book Online",
    registerLabel: "Register Now",
  },
  complianceLines: [
    siteConfig.compliance.registeredCompany,
    siteConfig.compliance.tradingName,
    siteConfig.compliance.vatNumber,
    "Registered office address: to be confirmed and inserted in full before go-live.",
    siteConfig.compliance.practiceAddress,
    "Premises Registration Number (RCVS/VMD): to be confirmed and inserted once issued.",
  ],
  chatSettings: {
    eyebrow: "Chat Help",
    title: "Quick help only",
    introLabel: "Approved topics only",
    introText: "Ask about hours, location, fees, Health Plan, or booking. Urgent or other topics should be called through straight away.",
    topicButtons: [
      { label: "Opening hours", query: "What are your opening hours?" },
      { label: "Parking & location", query: "Where are you located and is parking available?" },
      { label: "Fee ranges", query: "What are your basic fee ranges?" },
      { label: "Health Plan", query: "Can you explain your health plan?" },
      { label: "Register & book", query: "How do I register or book?" },
    ],
    inputPlaceholder: "Opening hours, parking, fees, health plan...",
    hoursReply: "Opening hours are Monday to Friday 09:00am to 6:00pm, Saturday 9:00am to 12.00pm, and Sunday closed.",
    locationReply: "The Sutton Vet is at 4 Spinning Wheel Way, Sutton, SM6 7DS. For parking or arrival guidance, call the team before your visit.",
    feesReply: "Basic consultation, vaccination, microchip, and neutering ranges are on the Fees page. For exact costs, please call the practice.",
    planReply: "The Health Plan is a monthly preventative-care plan for dogs and cats. It covers routine support and is different from insurance.",
    bookingReply: "Use the approved PMS / online portal route on the site for registration or booking. New clients should register before the first visit where possible.",
    fallbackReply: "This chat covers approved admin topics only. For anything urgent or outside those topics, please call the practice directly.",
    emergencyLabel: "Call now",
    emergencyReply: "If this may be urgent, call the emergency line now. This chat does not provide clinical advice.",
    emergencyButtonLabel: "Call Emergency Line",
    registerButtonLabel: "Register/Book via Online Portal",
    whatsappButtonLabel: "Talk to our team on WhatsApp",
  },
};

const emergencySettingsSeedDocument: SanitySeedDocument = {
  _id: "emergencySettings",
  _type: "emergencySettings",
  inHoursMessage: "During opening hours, call the main practice number first for urgent concerns.",
  outOfHoursMessage: "Outside practice hours, use the emergency line immediately for urgent issues.",
  emergencyPhone: siteConfig.emergencyPhone,
  keywords: [
    "bleeding",
    "blood",
    "poison",
    "poisoned",
    "breathing",
    "collapsed",
    "collapse",
    "seizure",
    "seizing",
    "fit",
    "fits",
    "unresponsive",
    "not breathing",
    "hit by car",
    "accident",
    "emergency",
    "urgent",
  ],
};

const contactPageSeedDocument: SanitySeedDocument = {
  _id: "contactPage",
  _type: "contactPage",
  heroEyebrow: "Contact & Emergency Care",
  heroTitle: "Simple contact, clear urgent routing.",
  heroDescription: "For bookings, registration, location guidance, and out-of-hours support, this page should make the next step obvious within seconds.",
  heroImageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1800&q=80",
  heroPrimaryCtaLabel: "Book Online",
  heroPrimaryCtaHref: siteConfig.ctas.book,
  heroSecondaryCtaLabel: "Register Now",
  heroSecondaryCtaHref: siteConfig.ctas.register,
  quickLinks: [
    { title: "Call us", value: siteConfig.phone, href: siteConfig.ctas.call, meta: "Fastest route for appointments and practical questions", icon: "phone" },
    { title: "Visit us", value: siteConfig.address, href: "https://maps.google.com/?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS", meta: "Directions, local travel guidance, and nearby access", icon: "pin" },
    { title: "Email us", value: siteConfig.email, href: `mailto:${siteConfig.email}`, meta: "Useful for non-urgent admin and document requests", icon: "mail" },
    { title: "Connect with us", value: "Instagram & Facebook", href: siteConfig.socials[1]?.href || "/", meta: "Follow updates and opening momentum as the practice grows", icon: "share" },
  ],
  openEyebrow: "Open Practice Hours",
  openTitle: "Book, register, or ask a practical question.",
  openDescription: "During practice hours, the quickest route is to call, book online, or use the registration flow.",
  openMetaLines: [`Phone: ${siteConfig.phone}`, `Address: ${siteConfig.address}`, `Email: ${siteConfig.email}`],
  openCtas: [
    { label: "Book Online", href: siteConfig.ctas.book, variant: "primary" },
    { label: "Register Now", href: siteConfig.ctas.register, variant: "muted" },
  ],
  emergencyEyebrow: "Out-of-Hours Emergency Care",
  emergencyTitle: "Urgent care should feel immediate and unmistakable.",
  emergencyDescription: "If the practice is closed and your pet needs urgent help, call the emergency line straight away.",
  emergencyPoints: [
    "Use the emergency number outside normal practice hours",
    "In-hours urgent cases should still call the main practice number first",
    "Emergency routing remains prominent on mobile and sticky navigation paths",
  ],
  emergencyButtonLabel: "Call Emergency Line",
  hoursEyebrow: "Opening Hours",
  hoursTitle: "When we are open",
  locationEyebrow: "Find Us",
  locationTitle: "How to find us",
  locationDescription: `The Sutton Vet is based at ${siteConfig.address}. The contact journey should reassure new clients with a clear map, straightforward access guidance, and practical next steps before the visit.`,
  locationPoints: [
    "Hackbridge and Sutton coverage surfaced clearly for local reassurance",
    "Directions and map access available without extra clicks",
    "Call first if you need help with parking or arrival guidance",
  ],
  locationButtonLabel: "Get Directions",
  locationButtonHref: "https://maps.google.com/?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS",
  locationMapEmbedUrl: "https://www.google.com/maps?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS&output=embed",
  locationMapLabelTitle: "The Sutton Vet",
  locationMapLabelText: siteConfig.address,
  socialCards: [
    { title: "Facebook", description: "Updates, launch momentum, and local practice news.", ctaLabel: "Join us", href: siteConfig.socials[0]?.href || "/", icon: "facebook" },
    { title: "Instagram", description: "Follow practice visuals, opening updates, and behind-the-scenes content.", ctaLabel: "Follow us", href: siteConfig.socials[1]?.href || "/", icon: "instagram" },
  ],
  ctaEyebrow: "Next Step",
  ctaTitle: "Need help before booking?",
  ctaText: "Call, WhatsApp, or use the online booking route if you want help choosing the right next step.",
  ctaPrimaryLabel: "WhatsApp Our Team",
  ctaPrimaryHref: siteConfig.ctas.whatsapp,
  ctaSecondaryLabel: "Book Online",
  ctaSecondaryHref: siteConfig.ctas.book,
};

const faqPageSeedDocument: SanitySeedDocument = {
  _id: "faqPage",
  _type: "faqPage",
  eyebrow: "FAQ",
  title: "Common practical questions, answered clearly.",
  description: "Clear answers around fees, first visits, parking, emergencies, and registration.",
  ctaTitle: "Still need help?",
  ctaText: "Contact, book, or call from here.",
  ctaPrimaryLabel: "Book Online",
  ctaPrimaryHref: siteConfig.ctas.book,
  ctaSecondaryLabel: "Register Now",
  ctaSecondaryHref: siteConfig.ctas.register,
};

const faqSeedDocuments: SanitySeedDocument[] = faqPreview.map((item, index) => ({
  _id: `faq-${index + 1}`,
  _type: "faq",
  question: item.question,
  answer: item.answer,
  category:
    index === 0
      ? "Registration"
      : index === 1
        ? "First Visit"
        : index === 2
          ? "Health Plan"
          : "Emergency",
  displayOrder: index + 1,
}));

const firstVisitPageSeedDocument: SanitySeedDocument = {
  _id: "firstVisitPage",
  _type: "firstVisitPage",
  eyebrow: "New Client / First Visit Guide",
  title: "A calmer first visit starts with clearer preparation.",
  description: "Simple guidance for registration, what to bring, and what to expect during the first consultation.",
  steps: [
    "Register through the online portal flow before the appointment where possible.",
    "Bring previous records, medication details, and any insurance information.",
    "Expect a calm first consultation with practical next-step guidance.",
  ],
  ctaTitle: "Ready to register first?",
  ctaText: "A simple route into the online portal starts here.",
  ctaPrimaryLabel: "Register Now",
  ctaPrimaryHref: siteConfig.ctas.register,
  ctaSecondaryLabel: "Book Online",
  ctaSecondaryHref: siteConfig.ctas.book,
};

const teamPageSeedDocument: SanitySeedDocument = {
  _id: "teamPage",
  _type: "teamPage",
  ...teamPageSeed,
  ctaTitle: "Meet us in person?",
  ctaText: "Register, contact, or book online when you're ready.",
  ctaPrimaryLabel: "Book Online",
  ctaPrimaryHref: siteConfig.ctas.book,
  ctaSecondaryLabel: "Register Now",
  ctaSecondaryHref: siteConfig.ctas.register,
};

const teamMemberSeedDocuments: SanitySeedDocument[] = fallbackTeamMembers.map((member) => ({
  _id: member.id,
  _type: "teamMember",
  name: member.name,
  role: member.role,
  category: member.category,
  qualifications: member.qualifications,
  shortBio: member.shortBio,
  bio: member.bio,
  imageUrl: member.imageUrl,
  displayOrder: member.displayOrder,
}));

const blogPageSeedDocument: SanitySeedDocument = {
  _id: "blogPage",
  _type: "blogPage",
  eyebrow: "Blog & Pet Advice",
  title: "Pet advice",
  description: "Clear, practical articles for new clients and routine pet care questions, presented in a calmer editorial layout.",
  introEyebrow: "Latest Advice",
  introTitle: "Latest reads",
  introDescription: "Short, practical reads should help owners find the next useful answer quickly, without turning the page into a crowded news feed.",
  feedbackEyebrow: "Article feedback",
  feedbackTitle: "Was this article useful?",
  feedbackDescription: "Quick feedback helps shape which advice should be clearer, shorter, or surfaced earlier across the site.",
  feedbackHelperLabel: "Contact the practice",
  feedbackHelperHref: "/contact",
  feedbackHelpfulLabel: "Helpful",
  feedbackMoreLabel: "Need more detail",
  feedbackContactLabel: "I need to speak to someone",
  feedbackHelpfulResponse: "Thanks. This signals that the article answered the question clearly.",
  feedbackMoreResponse: "Thanks. This helps highlight where future advice needs more practical detail.",
  feedbackContactResponse: "Thanks. If the issue feels urgent or specific to your pet, direct contact is the safer next step.",
  browseMoreLabel: "Browse more advice",
  browseMoreHref: "/contact",
  askDirectLabel: "Ask the team directly",
  askDirectHref: "/contact",
  ctaTitle: "Need guidance sooner?",
  ctaText: "If the question feels urgent, contact the practice directly rather than waiting to read further.",
  ctaPrimaryLabel: "Contact Us",
  ctaPrimaryHref: "/contact",
  ctaSecondaryLabel: "Book Online",
  ctaSecondaryHref: siteConfig.ctas.book,
};

const legalPageSeedDocuments: SanitySeedDocument[] = [
  {
    _id: "legal-privacy-policy",
    _type: "legalPage",
    title: "Privacy policy",
    eyebrow: "Privacy Policy",
    pageType: "Privacy Policy",
    description: legalPageCopy.privacy,
    sections: privacySections,
  },
  {
    _id: "legal-cookie-policy",
    _type: "legalPage",
    title: "Cookie policy",
    eyebrow: "Cookie Policy",
    pageType: "Cookie Policy",
    description: legalPageCopy.cookies,
    sections: [
      {
        title: "Consent principles",
        status: "Mandatory",
        body: [
          "Optional analytics, marketing pixels, and embedded social or video technologies must remain blocked until the visitor actively opts in.",
          "Accept and Reject should remain equally prominent, with no pre-ticked boxes and no background loading of optional scripts before consent.",
          "On this site, optional categories default to off and third-party embeds should remain blocked until the visitor opts in.",
        ],
      },
      ...cookieSections.map((section) => ({
        title: section.title,
        status: section.status,
        body: [section.body],
      })),
    ],
    inventoryItems: cookieInventory,
  },
  {
    _id: "legal-accessibility",
    _type: "legalPage",
    title: "Accessibility",
    eyebrow: "Accessibility Statement",
    pageType: "Accessibility Statement",
    description: legalPageCopy.accessibility,
    sections: accessibilitySections,
  },
  {
    _id: "legal-terms",
    _type: "legalPage",
    title: "Terms of business",
    eyebrow: "Terms of Business",
    pageType: "Terms of Business",
    description: legalPageCopy.terms,
    sections: termsSections,
  },
];

export const servicesPageSeedDocument: SanitySeedDocument = {
  ...servicesPageSeed,
};

export const serviceSeedDocuments: SanitySeedDocument[] = seededServices.map((service) => ({
  ...service,
}));

export const healthPlanPageSeedDocument: SanitySeedDocument = {
  _id: "healthPlanPage",
  _type: "healthPlan",
  ...healthPlanPageSeed,
};

export const pricingPageSeedDocument: SanitySeedDocument = {
  ...pricingPageSeed,
};

export const feeCategorySeedDocuments: SanitySeedDocument[] = feeCategorySeeds.map((category) => ({
  ...category,
}));

export const staleCmsDocumentTypes = ["blogPage", "blogPost", "faqPage", "faq", "firstVisitPage"];

export const staleCmsDocumentIds = [
  "blogPage",
  "firstVisitPage",
  "faqPage",
  "faq-1",
  "faq-2",
  "faq-3",
  "faq-4",
  "blog-first-visit-guide",
  "blog-preventative-care-plans",
  "blog-when-to-call-urgently",
  "blog-puppy-kitten-checks",
  "blog-early-diagnosis-matters",
  "blog-registering-before-visit",
  "blog-routine-health-checks",
  "blog-local-first-visit-planning",
];

export const allSeedDocuments: SanitySeedDocument[] = [
  siteSettingsSeedDocument,
  emergencySettingsSeedDocument,
  homePageSeedDocument,
  contactPageSeedDocument,
  teamPageSeedDocument,
  ...teamMemberSeedDocuments,
  ...legalPageSeedDocuments,
  servicesPageSeedDocument,
  ...serviceSeedDocuments,
  healthPlanPageSeedDocument,
  pricingPageSeedDocument,
  ...feeCategorySeedDocuments,
];

export function getSeedDocumentsByType(type: string) {
  return allSeedDocuments.filter((document) => document._type === type);
}





