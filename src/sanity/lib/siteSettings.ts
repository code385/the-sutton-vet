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

function fallbackChatSettings(): ResolvedSiteSettings["chatSettings"] {
  return {
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
    hoursReply: "Mon-Fri 8:30am to 7:00pm, Sat 8:30am to 1:00pm, Sun closed. Outside these hours, use the emergency line.",
    locationReply: "The Sutton Vet is at 4 Spinning Wheel Way, Sutton, SM6 7DS. For parking or arrival guidance, call the team before your visit.",
    feesReply: "Basic consultation, vaccination, microchip, and neutering ranges are on the Fees page. For exact costs, please call the practice.",
    planReply: "The Health Plan is a monthly preventative-care plan for dogs and cats. It covers routine support and is different from insurance.",
    bookingReply: "Use the Lupa Pets route on the site for registration or booking. New clients should register before the first visit where possible.",
    fallbackReply: "This chat covers approved admin topics only. For anything urgent or outside those topics, please call the practice directly.",
    emergencyLabel: "Call now",
    emergencyReply: "If this may be urgent, call the emergency line now. This chat does not provide clinical advice.",
    emergencyButtonLabel: "Call Emergency Line",
    registerButtonLabel: "Register/Book via Lupa Pets",
    whatsappButtonLabel: "Talk to our team on WhatsApp",
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
    phone: document?.phone || siteConfig.phone,
    emergencyPhone: document?.emergencyPhone || siteConfig.emergencyPhone,
    email: document?.email || siteConfig.email,
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
        { day: "Monday", hours: "8:30am - 7:00pm" },
        { day: "Tuesday", hours: "8:30am - 7:00pm" },
        { day: "Wednesday", hours: "8:30am - 7:00pm" },
        { day: "Thursday", hours: "8:30am - 7:00pm" },
        { day: "Friday", hours: "8:30am - 7:00pm" },
        { day: "Saturday", hours: "8:30am - 1:00pm" },
        { day: "Sunday", hours: "Closed" },
      ],
    socialLinks:
      document?.socialLinks?.filter((item) => item?.label && item?.href).length
        ? document.socialLinks
            .filter((item) => item?.label && item?.href)
            .map((item) => ({
              label: item.label || "",
              href: item.href || "/",
              icon: item.icon || item.label || "",
            }))
        : siteConfig.socials.map((item) => ({
            label: item.label,
            href: item.href,
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
      call: buildTelHref(document?.phone || siteConfig.phone),
      emergency: buildTelHref(document?.emergencyPhone || siteConfig.emergencyPhone),
      book: document?.lupaBookingUrl || siteConfig.ctas.book,
      register: document?.lupaRegistrationUrl || siteConfig.ctas.register,
      healthPlan: document?.healthPlanUrl || siteConfig.ctas.healthPlan,
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
      fallbackReply: chat.fallbackReply || fallbackChat.fallbackReply,
      emergencyLabel: chat.emergencyLabel || fallbackChat.emergencyLabel,
      emergencyReply: chat.emergencyReply || fallbackChat.emergencyReply,
      emergencyButtonLabel: chat.emergencyButtonLabel || fallbackChat.emergencyButtonLabel,
      registerButtonLabel: chat.registerButtonLabel || fallbackChat.registerButtonLabel,
      whatsappButtonLabel: chat.whatsappButtonLabel || fallbackChat.whatsappButtonLabel,
    },
  };
}
