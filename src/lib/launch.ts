export type LaunchSettings = {
  mode?: "comingSoon" | "full";
  openingLabel?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type CompanyDetails = {
  registeredName?: string;
  companyNumber?: string;
  registeredOffice?: string;
  jurisdiction?: string;
  vatNumber?: string;
};

export type TikTokSettings = {
  enabled?: boolean;
  username?: string;
  title?: string;
  description?: string;
};

export function resolveLaunchSettings(value?: LaunchSettings | null) {
  return {
    mode: value?.mode === "full" ? "full" as const : "comingSoon" as const,
    openingLabel: value?.openingLabel?.trim() || "Coming Soon in February 2027",
    title: value?.title?.trim() || "A new home for local pet care.",
    description: value?.description?.trim() || "Independent, family-owned veterinary care is coming to Hackbridge, Sutton. Register you and your pets ahead of opening and become part of our local community.",
    imageUrl: value?.imageUrl,
    imageAlt: value?.imageAlt?.trim() || "Gentle veterinary care for a dog",
  };
}

export function resolveCompanyLines(details?: CompanyDetails | null, practiceName = "The Sutton Vet") {
  const lines: string[] = [];
  const name = details?.registeredName?.trim();
  if (name) lines.push(`${practiceName} is a trading name of ${name}.`);
  if (details?.companyNumber?.trim()) lines.push(`Company number: ${details.companyNumber.trim()}`);
  if (details?.registeredOffice?.trim()) lines.push(`Registered office: ${details.registeredOffice.trim()}`);
  if (details?.jurisdiction?.trim()) lines.push(`Registered in ${details.jurisdiction.trim()}`);
  if (details?.vatNumber?.trim()) lines.push(`VAT registration number: ${details.vatNumber.trim()}`);
  return lines;
}

export function resolveTikTokSettings(value?: TikTokSettings | null) {
  const candidate = value?.username?.trim().replace(/^@/, "") || "the.sutton.vet";
  const username = /^[a-zA-Z0-9._]{2,24}$/.test(candidate) ? candidate : "the.sutton.vet";
  return {
    enabled: value?.enabled !== false,
    username,
    profileUrl: `https://www.tiktok.com/@${username}`,
    embedUrl: `https://www.tiktok.com/embed/@${username}?lang=en-GB&embedFrom=oembed`,
    title: value?.title?.trim() || "A little closer to life at The Sutton Vet.",
    description: value?.description?.trim() || "Meet our community, get to know the practice and catch our latest moments on TikTok.",
  };
}
