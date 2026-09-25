import { groq } from "next-sanity";

import { siteConfig } from "@/lib/site";

import { safeSanityFetch } from "./client";

type LinkItem = {
  label?: string;
  href?: string;
  icon?: string;
};

type OpeningHourItem = {
  day?: string;
  hours?: string;
};

type ChatTopicButton = {
  label?: string;
  query?: string;
};

type ChatSettings = {
  eyebrow?: string;
  title?: string;
  introLabel?: string;
  introText?: string;
  topicButtons?: ChatTopicButton[];
  inputPlaceholder?: string;
  hoursReply?: string;
  locationReply?: string;
  feesReply?: string;
  planReply?: string;
  bookingReply?: string;
  servicesReply?: string;
  careersReply?: string;
  contactReply?: string;
  paymentsReply?: string;
  fallbackReply?: string;
  emergencyLabel?: string;
  emergencyReply?: string;
  emergencyButtonLabel?: string;
  registerButtonLabel?: string;
  whatsappButtonLabel?: string;
};

export type SiteSettingsDocument = {
  practiceName?: string;
  shortName?: string;
  tagline?: string;
  footerTagline?: string;
  topbarNote?: string;
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  address?: string;
  openingHours?: OpeningHourItem[];
  whatsappNumber?: string;
  whatsappPrefillMessage?: string;
  lupaBookingUrl?: string;
  lupaRegistrationUrl?: string;
  healthPlanUrl?: string;
  googleBusinessProfileUrl?: string;
  googleMapEmbedUrl?: string;
  hasMapUrl?: string;
  latitude?: number;
  longitude?: number;
  knowsAbout?: string[];
  socialLinks?: LinkItem[];
  mainNav?: LinkItem[];
  legalLinks?: LinkItem[];
  headerCtas?: {
    emergencyLabel?: string;
    bookLabel?: string;
    registerLabel?: string;
  };
  complianceLines?: string[];
  chatSettings?: ChatSettings;
};

export type ResolvedSiteSettings = {
  practiceName: string;
  shortName: string;
  tagline: string;
  footerTagline: string;
  topbarNote: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  address: string;
  openingHours: { day: string; hours: string }[];
  socialLinks: { label: string; href: string; icon: string }[];
  mainNav: { label: string; href: string }[];
  legalLinks: { label: string; href: string }[];
  googleBusinessProfileUrl: string;
  googleMapEmbedUrl: string;
  hasMapUrl: string;
  latitude?: number;
  longitude?: number;
  knowsAbout: string[];
  complianceLines: string[];
  headerCtas: {
    emergencyLabel: string;
    bookLabel: string;
    registerLabel: string;
  };
  ctas: {
    call: string;
    emergency: string;
    book: string;
    register: string;
    healthPlan: string;
    whatsapp: string;
  };
  chatSettings: {
    eyebrow: string;
    title: string;
    introLabel: string;
    introText: string;
    topicButtons: { label: string; query: string }[];
    inputPlaceholder: string;
    hoursReply: string;
    locationReply: string;
    feesReply: string;
    planReply: string;
    bookingReply: string;
    servicesReply: string;
    careersReply: string;
    contactReply: string;
    paymentsReply: string;
    fallbackReply: string;
    emergencyLabel: string;
    emergencyReply: string;
    emergencyButtonLabel: string;
    registerButtonLabel: string;
    whatsappButtonLabel: string;
  };
};

const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    practiceName,
    shortName,
    tagline,
    footerTagline,
    topbarNote,
    phone,
    emergencyPhone,
    email,
    address,
    openingHours,
    whatsappNumber,
    whatsappPrefillMessage,
    lupaBookingUrl,
    lupaRegistrationUrl,
    healthPlanUrl,
    googleBusinessProfileUrl,
    googleMapEmbedUrl,
    hasMapUrl,
    latitude,
    longitude,
    knowsAbout,
    socialLinks,
    mainNav,
    legalLinks,
    headerCtas,
    complianceLines,
    chatSettings
  }
`;

export async function getSiteSettingsDocument() {
  return safeSanityFetch<SiteSettingsDocument | null>(siteSettingsQuery, undefined, null);
}

function cleanPhoneNumber(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function buildTelHref(value: string) {
  return `tel:${cleanPhoneNumber(value)}`;
}

function buildWhatsappHref(number: string, message: string) {
  const cleanedNumber = cleanPhoneNumber(number).replace(/^\+/, "");
  return `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
}

function resolvePmsUrl(value: string | undefined, fallback: string) {
  if (
    !value ||
    value === "/contact#book" ||
    value === "/contact#register" ||
    value.startsWith("/pms-integration")
  ) {
    return fallback;
  }

  return value;
}


const canonicalContactDetails = {
  phone: "07440278373",
  email: "info@thesuttonvet.co.uk",
};
const canonicalSocialLinks: Record<string, string> = {
  facebook: "https://www.facebook.com/profile.php?id=61587599521550",
  instagram: "https://www.instagram.com/thesuttonvet/",
  tiktok: "https://www.tiktok.com/@the.sutton.vet",
};

function resolveSocialHref(item: LinkItem) {
  const key = `${item.label || item.icon || ""}`.toLowerCase().replace(/\s+/g, "");
  return canonicalSocialLinks[key] || item.href || "/";
}
function fallbackChatSettings(): ResolvedSiteSettings["chatSettings"] {
  return {
    eyebrow: "Chat Help",
    title: "How can we help?",
    introLabel: "Practice information",
    introText: "Ask about services, opening hours, location, pricing, Health Plans, careers, registration, or booking. For urgent concerns, please call the practice.",
    topicButtons: [
      { label: "Services", query: "What services do you offer?" },
      { label: "Opening hours", query: "What are your opening hours?" },
      { label: "Parking & location", query: "Where are you located and is parking available?" },
      { label: "Pricing", query: "How does pricing work?" },
      { label: "Health Plan", query: "Can you explain the Health Plan?" },
      { label: "Careers", query: "Are you currently hiring?" },
      { label: "Register & book", query: "How do I register or book?" },
    ],
    inputPlaceholder: "Services, hours, pricing, careers, booking...",
    hoursReply: "The practice is open Monday to Friday, 9:00am to 6:00pm, and Saturday, 9:00am to 12:00pm. Sunday is closed. Please call for urgent guidance.",
    locationReply: "The Sutton Vet is at 4 Spinning Wheel Way, Hackbridge, Sutton, SM6 7DS. Nearby parking and step-free access information is available on the Contact page.",
    feesReply: "Services are listed on the website. Where a final price depends on assessment, patient size, or the procedure, the team will provide a quote before treatment.",
    planReply: "The Health Plan is currently presented as information only while the final provider and sign-up process are confirmed. Plan details can be updated on the website as soon as they are available.",
    bookingReply: "Online registration and booking are being connected through Lupa. If the online journey is unavailable, please call or message the practice and the team will help directly.",
    servicesReply: "The practice offers consultations, daytime urgent care, preventative care, vaccinations, dentistry, diagnostics, surgery, orthopaedic procedures, endoscopy, home visits, and sensitive end-of-life support. Open the Services menu for full details.",
    careersReply: "The Sutton Vet is currently advertising a Veterinary Nurse opportunity. Visit the Careers page for the role overview and application email.",
    contactReply: "Call 07440 278373 or email info@thesuttonvet.co.uk. You can also use the Contact page for directions, parking, and opening times.",
    paymentsReply: "There is no Lupa Pay integration planned. Please contact the practice for current payment arrangements and any available options.",
    fallbackReply: "I can help with practice information only. Ask about services, hours, location, pricing, Health Plans, careers, registration, or booking. For clinical advice or urgent concerns, please call the practice.",
    emergencyLabel: "Urgent help",
    emergencyReply: "This chat cannot provide clinical advice. If you are worried your pet may need urgent care, please call the practice now.",
    emergencyButtonLabel: "Call the practice",
    registerButtonLabel: "Register Online",
    whatsappButtonLabel: "Message the team",
  };
}

export function resolveSiteSettings(document?: SiteSettingsDocument | null): ResolvedSiteSettings {
  const whatsappMessage =
    document?.whatsappPrefillMessage ||
    "Hi The Sutton Vet, I have a question about registering my pet.";
  const chat = document?.chatSettings || {};
  const fallbackChat = fallbackChatSettings();

  return {
    practiceName: document?.practiceName || siteConfig.name,
    shortName: document?.shortName || siteConfig.shortName,
    tagline: document?.tagline || siteConfig.tagline,
    footerTagline: document?.footerTagline || "Independent veterinary care in Sutton.",
    topbarNote: document?.topbarNote || siteConfig.topbarNote,
    phone: canonicalContactDetails.phone,
    emergencyPhone: canonicalContactDetails.phone,
    email: canonicalContactDetails.email,
    address: document?.address || siteConfig.address,
    openingHours:
      document?.openingHours?.filter((item) => item?.day && item?.hours).length
        ? document.openingHours
            .filter((item) => item?.day && item?.hours)
            .map((item) => ({
              day: item.day || "",
              hours: item.hours || "",
            }))
        : [
        { day: "Monday", hours: "09:00am - 6:00pm" },
        { day: "Tuesday", hours: "09:00am - 6:00pm" },
        { day: "Wednesday", hours: "09:00am - 6:00pm" },
        { day: "Thursday", hours: "09:00am - 6:00pm" },
        { day: "Friday", hours: "09:00am - 6:00pm" },
        { day: "Saturday", hours: "9:00am - 12.00pm" },
        { day: "Sunday", hours: "Closed" },
      ],
    socialLinks:
      document?.socialLinks?.filter((item) => item?.label && item?.href).length
        ? document.socialLinks
            .filter((item) => item?.label && item?.href)
            .map((item) => ({
              label: item.label || "",
              href: resolveSocialHref(item),
              icon: item.icon || item.label || "",
            }))
        : siteConfig.socials.map((item) => ({
            label: item.label,
            href: resolveSocialHref(item),
            icon: item.label,
          })),
    mainNav:
      document?.mainNav?.filter((item) => item?.label && item?.href).length
        ? document.mainNav
            .filter((item) => item?.label && item?.href)
            .map((item) => ({
              label: item.label || "",
              href: item.href || "/",
            }))
        : siteConfig.mainNav,
    legalLinks:
      document?.legalLinks?.filter((item) => item?.label && item?.href).length
        ? document.legalLinks
            .filter((item) => item?.label && item?.href)
            .map((item) => ({
              label: item.label || "",
              href: item.href || "/",
            }))
        : siteConfig.legalLinks,
    googleBusinessProfileUrl: document?.googleBusinessProfileUrl || siteConfig.googleProfile,
    googleMapEmbedUrl:
      document?.googleMapEmbedUrl ||
      "https://www.google.com/maps?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS&output=embed",
    hasMapUrl:
      document?.hasMapUrl || "https://maps.google.com/?q=4%20Spinning%20Wheel%20Way%2C%20Sutton%2C%20SM6%207DS",
    latitude: document?.latitude,
    longitude: document?.longitude,
    knowsAbout:
      document?.knowsAbout?.filter(Boolean) || [
        "Independent veterinary care",
        "Consultations",
        "Diagnostics",
        "Surgery",
        "Dentistry",
        "Preventative care",
        "Health plans",
        "Sutton",
        "Hackbridge",
      ],
    complianceLines:
      document?.complianceLines?.filter(Boolean).length ? document.complianceLines.filter(Boolean) : [
        siteConfig.compliance.registeredCompany,
        siteConfig.compliance.tradingName,
        siteConfig.compliance.vatNumber,
        siteConfig.compliance.registeredOffice,
        siteConfig.compliance.practiceAddress,
        siteConfig.compliance.premisesNumber,
      ],
    headerCtas: {
      emergencyLabel: document?.headerCtas?.emergencyLabel || "Emergency",
      bookLabel: document?.headerCtas?.bookLabel || "Book Online",
      registerLabel: document?.headerCtas?.registerLabel || "Register Now",
    },
    ctas: {
      call: buildTelHref(canonicalContactDetails.phone),
      emergency: buildTelHref(canonicalContactDetails.phone),
      book: resolvePmsUrl(document?.lupaBookingUrl, siteConfig.ctas.book),
      register: resolvePmsUrl(document?.lupaRegistrationUrl, siteConfig.ctas.register),
      healthPlan: resolvePmsUrl(document?.healthPlanUrl, siteConfig.ctas.healthPlan),
      whatsapp: buildWhatsappHref(document?.whatsappNumber || "923063892101", whatsappMessage),
    },
    chatSettings: {
      eyebrow: chat.eyebrow || fallbackChat.eyebrow,
      title: chat.title || fallbackChat.title,
      introLabel: chat.introLabel || fallbackChat.introLabel,
      introText: chat.introText || fallbackChat.introText,
      topicButtons:
        chat.topicButtons?.filter((item) => item?.label && item?.query).length
          ? chat.topicButtons
              .filter((item) => item?.label && item?.query)
              .map((item) => ({
                label: item.label || "",
                query: item.query || "",
              }))
          : fallbackChat.topicButtons,
      inputPlaceholder: chat.inputPlaceholder || fallbackChat.inputPlaceholder,
      hoursReply: chat.hoursReply || fallbackChat.hoursReply,
      locationReply: chat.locationReply || fallbackChat.locationReply,
      feesReply: chat.feesReply || fallbackChat.feesReply,
      planReply: chat.planReply || fallbackChat.planReply,
      bookingReply: chat.bookingReply || fallbackChat.bookingReply,
      servicesReply: chat.servicesReply || fallbackChat.servicesReply,
      careersReply: chat.careersReply || fallbackChat.careersReply,
      contactReply: chat.contactReply || fallbackChat.contactReply,
      paymentsReply: chat.paymentsReply || fallbackChat.paymentsReply,
      fallbackReply: chat.fallbackReply || fallbackChat.fallbackReply,
      emergencyLabel: chat.emergencyLabel || fallbackChat.emergencyLabel,
      emergencyReply: chat.emergencyReply || fallbackChat.emergencyReply,
      emergencyButtonLabel: chat.emergencyButtonLabel || fallbackChat.emergencyButtonLabel,
      registerButtonLabel: chat.registerButtonLabel || fallbackChat.registerButtonLabel,
      whatsappButtonLabel: chat.whatsappButtonLabel || fallbackChat.whatsappButtonLabel,
    },
  };
}







