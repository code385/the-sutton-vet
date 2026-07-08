import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 } }),
    defineField({ name: "shortDescription", title: "Short Description", type: "text", rows: 3 }),
    defineField({ name: "lead", title: "Lead Paragraph", type: "text", rows: 4 }),
    defineField({
      name: "image",
      title: "Feature Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "imageUrl", title: "External Image URL", type: "url" }),
    defineField({ name: "alt", title: "Image Alt Text", type: "string" }),
    defineField({ name: "ctaLabel", title: "Section CTA Label", type: "string" }),
    defineField({ name: "ctaHref", title: "Section CTA Href", type: "string" }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number" }),
    defineField({ name: "content", title: "Content", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: false }),
  ],
});
