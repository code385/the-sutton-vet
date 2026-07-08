import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

type PortableTextChild = {
  text?: string;
};

type PortableTextBlock = {
  _type?: string;
  children?: PortableTextChild[];
};

type SanityImageAsset = {
  url?: string;
};

type SanityImage = {
  asset?: SanityImageAsset;
};

type LinkItem = {
  label?: string;
  href?: string;
};

type TitleTextItem = {
  title?: string;
  description?: string;
};

type ServiceCardItem = {
  title?: string;
  summary?: string;
};

type HealthPlanTierItem = {
  title?: string;
  detail?: string;
  pricing?: string;
};

type TrustModuleItem = {
  tag?: string;
  title?: string;
  text?: string;
};

type AdviceArticleItem = {
  category?: string;
  date?: string;
  title?: string;
  excerpt?: string;
  meta?: string;
  cta?: string;
  href?: string;
};

type SocialPreviewCardItem = {
  platform?: string;
  title?: string;
  caption?: string;
  image?: string;
};

export type HomePageDocument = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroPracticalNote?: string;
  heroImageUrl?: string;
  heroVideoUrl?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  heroStats?: string[];
  heroLinks?: LinkItem[];
  whyChooseEyebrow?: string;
  whyChooseTitle?: string;
  whyChooseDescription?: string;
  whyChooseSecondaryText?: string;
  whyChooseImageUrl?: string;
  whyChooseMediaTitle?: string;
  whyChooseMediaDescription?: string;
  whyChoosePills?: string[];
  whyChooseCards?: TitleTextItem[];
  founderEyebrow?: string;
  founderTitle?: string;
  founderRole?: string;
  founderQuote?: string;
  founderPortrait?: SanityImage;
  founderPortraitKicker?: string;
  founderPortraitBadgeText?: string;
  founderHighlights?: string[];
  founderStory?: PortableTextBlock[];
  founderPrimaryCtaLabel?: string;
  founderPrimaryCtaHref?: string;
  founderSecondaryCtaLabel?: string;
  founderSecondaryCtaHref?: string;
  servicesEyebrow?: string;
  servicesTitle?: string;
  servicesDescription?: string;
  servicesImageUrl?: string;
  servicesVideoUrl?: string;
  servicesMediaKicker?: string;
  servicesMediaCaption?: string;
  servicesMediaButtonLabel?: string;
  servicesMediaButtonHref?: string;
  servicesPoints?: string[];
  serviceCards?: ServiceCardItem[];
  healthPlanEyebrow?: string;
  healthPlanTitle?: string;
  healthPlanDescription?: string;
  healthPlanSecondaryText?: string;
  healthPlanPrimaryCtaLabel?: string;
  healthPlanPrimaryCtaHref?: string;
  healthPlanSecondaryCtaLabel?: string;
  healthPlanSecondaryCtaHref?: string;
  healthPlanVideoUrl?: string;
  healthPlanPosterUrl?: string;
  healthPlanCardEyebrow?: string;
  healthPlanCardTitle?: string;
  healthPlanTiers?: HealthPlanTierItem[];
  healthPlanBenefits?: string[];
  trustEyebrow?: string;
  trustTitle?: string;
  trustText?: string;
  trustImageUrl?: string;
  trustPills?: string[];
  trustHighlights?: string[];
  trustModules?: TrustModuleItem[];
  locationEyebrow?: string;
  locationTitle?: string;
  locationAddress?: string;
  locationDirectionsLabel?: string;
  locationDirectionsHref?: string;
  locationPoints?: string[];
  locationMapImageUrl?: string;
  homepageVideoUrl?: string;
  homepageVideoEyebrow?: string;
  homepageVideoTitle?: string;
  homepageVideoDescription?: string;
  homepageVideoActionLabel?: string;
  adviceEyebrow?: string;
  adviceTitle?: string;
  adviceIntroText?: string;
  adviceCtaLabel?: string;
  adviceCtaHref?: string;
  advicePills?: string[];
  adviceFeaturedImageUrl?: string;
  adviceSecondaryImageUrl?: string;
  adviceArticles?: AdviceArticleItem[];
  socialEyebrow?: string;
  socialTitle?: string;
  socialDescription?: string;
  socialInstagramLabel?: string;
  socialTikTokLabel?: string;
  socialCards?: SocialPreviewCardItem[];
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

const homePageQuery = groq`
  *[_type == "homePage"][0]{
    heroEyebrow,
    heroTitle,
    heroDescription,
    heroPracticalNote,
    heroImageUrl,
    heroVideoUrl,
    heroPrimaryCtaLabel,
    heroPrimaryCtaHref,
    heroSecondaryCtaLabel,
    heroSecondaryCtaHref,
    heroStats,
    heroLinks,
    whyChooseEyebrow,
    whyChooseTitle,
    whyChooseDescription,
    whyChooseSecondaryText,
    whyChooseImageUrl,
    whyChooseMediaTitle,
    whyChooseMediaDescription,
    whyChoosePills,
    whyChooseCards,
    founderEyebrow,
    founderTitle,
    founderRole,
    founderQuote,
    founderPortrait{
      asset->{
        url
      }
    },
    founderPortraitKicker,
    founderPortraitBadgeText,
    founderHighlights,
    founderStory[]{
      _type,
      children[]{
        text
      }
    },
    founderPrimaryCtaLabel,
    founderPrimaryCtaHref,
    founderSecondaryCtaLabel,
    founderSecondaryCtaHref,
    servicesEyebrow,
    servicesTitle,
    servicesDescription,
    servicesImageUrl,
    servicesVideoUrl,
    servicesMediaKicker,
    servicesMediaCaption,
    servicesMediaButtonLabel,
    servicesMediaButtonHref,
    servicesPoints,
    serviceCards,
    healthPlanEyebrow,
    healthPlanTitle,
    healthPlanDescription,
    healthPlanSecondaryText,
    healthPlanPrimaryCtaLabel,
    healthPlanPrimaryCtaHref,
    healthPlanSecondaryCtaLabel,
    healthPlanSecondaryCtaHref,
    healthPlanVideoUrl,
    healthPlanPosterUrl,
    healthPlanCardEyebrow,
    healthPlanCardTitle,
    healthPlanTiers,
    healthPlanBenefits,
    trustEyebrow,
    trustTitle,
    trustText,
    trustImageUrl,
    trustPills,
    trustHighlights,
    trustModules,
    locationEyebrow,
    locationTitle,
    locationAddress,
    locationDirectionsLabel,
    locationDirectionsHref,
    locationPoints,
    locationMapImageUrl,
    homepageVideoUrl,
    homepageVideoEyebrow,
    homepageVideoTitle,
    homepageVideoDescription,
    homepageVideoActionLabel,
    adviceEyebrow,
    adviceTitle,
    adviceIntroText,
    adviceCtaLabel,
    adviceCtaHref,
    advicePills,
    adviceFeaturedImageUrl,
    adviceSecondaryImageUrl,
    adviceArticles,
    socialEyebrow,
    socialTitle,
    socialDescription,
    socialInstagramLabel,
    socialTikTokLabel,
    socialCards,
    ctaEyebrow,
    ctaTitle,
    ctaText,
    ctaPrimaryLabel,
    ctaPrimaryHref,
    ctaSecondaryLabel,
    ctaSecondaryHref
  }
`;

export async function getHomePageDocument() {
  return safeSanityFetch<HomePageDocument | null>(homePageQuery, undefined, null);
}

export function portableTextToParagraphs(blocks?: PortableTextBlock[]) {
  if (!blocks?.length) {
    return [];
  }

  return blocks
    .map((block) =>
      (block.children || [])
        .map((child) => child.text || "")
        .join("")
        .trim(),
    )
    .filter(Boolean);
}
