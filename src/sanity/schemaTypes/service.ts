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
    defineField({
      name: "subservices",
      title: "Subservices",
      description: "Services and procedures displayed on this detail page.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "gallery",
      title: "Clinical Gallery",
      description: "Optional image collections shown only on this service detail page.",
      type: "array",
      of: [
        {
          type: "object",
          name: "serviceGalleryItem",
          title: "Procedure Gallery",
          fields: [
            defineField({ name: "title", title: "Procedure Title", type: "string" }),
            defineField({ name: "description", title: "Short Description", type: "string" }),
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              validation: (rule) => rule.max(4),
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
                },
              ],
            }),
          ],
          preview: { select: { title: "title", media: "images.0" } },
        },
      ],
    }),
    defineField({ name: "content", title: "Content", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: false }),
  ],
});
