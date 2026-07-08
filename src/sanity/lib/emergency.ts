import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

export type EmergencySettingsDocument = {
  inHoursMessage?: string;
  outOfHoursMessage?: string;
  emergencyPhone?: string;
  keywords?: string[];
};

const emergencySettingsQuery = groq`
  *[_type == "emergencySettings"][0]{
    inHoursMessage,
    outOfHoursMessage,
    emergencyPhone,
    keywords
  }
`;

export async function getEmergencySettingsDocument() {
  return safeSanityFetch<EmergencySettingsDocument | null>(emergencySettingsQuery, undefined, null);
}

export function resolveEmergencyKeywords(document?: EmergencySettingsDocument | null) {
  return document?.keywords?.filter(Boolean) || [
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
  ];
}
