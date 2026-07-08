import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

type PortableTextChild = {
  text?: string;
};

type PortableTextBlock = {
  _type?: string;
  children?: PortableTextChild[];
};

export type BlogPostDocument = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  category?: string;
  excerpt?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  content?: PortableTextBlock[];
};

const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc, _createdAt desc){
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImageUrl,
    publishedAt,
    content[]{
      _type,
      children[]{
        text
      }
    }
  }
`;

const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImageUrl,
    publishedAt,
    content[]{
      _type,
      children[]{
        text
      }
    }
  }
`;

export async function getBlogPosts() {
  return safeSanityFetch<BlogPostDocument[]>(blogPostsQuery, undefined, []);
}

export async function getBlogPostBySlug(slug: string) {
  return safeSanityFetch<BlogPostDocument | null>(blogPostBySlugQuery, { slug }, null);
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
