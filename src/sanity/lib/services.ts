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

export type ServicesPageDocument = {
  eyebrow?: string;
  title?: string;
  description?: string;
  introNote?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  closingEyebrow?: string;
  closingTitle?: string;
  closingText?: string;
  closingPrimaryLabel?: string;
  closingPrimaryHref?: string;
  closingSecondaryLabel?: string;
  closingSecondaryHref?: string;
};

export type ServiceDocument = {
  _id: string;
  eyebrow?: string;
  title?: string;
  slug?: { current?: string };
  shortDescription?: string;
  lead?: string;
  image?: SanityImage;
  imageUrl?: string;
  alt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sortOrder?: number;
  content?: PortableTextBlock[];
};

const servicesPageQuery = groq`
  *[_type == "servicesPage"][0]{
    eyebrow,
    title,
    description,
    introNote,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    closingEyebrow,
    closingTitle,
    closingText,
    closingPrimaryLabel,
    closingPrimaryHref,
    closingSecondaryLabel,
    closingSecondaryHref
  }
`;

const servicesListQuery = groq`
  *[_type == "service"] | order(sortOrder asc, _createdAt asc){
    _id,
    eyebrow,
    title,
    slug,
    shortDescription,
    lead,
    image{
      asset->{
        url
      }
    },
    imageUrl,
    alt,
    ctaLabel,
    ctaHref,
    sortOrder,
    content[]{
      _type,
      children[]{
        text
      }
    }
  }
`;

export async function getServicesPageDocument() {
  return safeSanityFetch<ServicesPageDocument | null>(servicesPageQuery, undefined, null);
}

export async function getServiceDocuments() {
  return safeSanityFetch<ServiceDocument[]>(servicesListQuery, undefined, []);
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
