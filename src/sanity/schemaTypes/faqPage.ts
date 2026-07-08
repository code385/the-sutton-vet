import { defineField, defineType } from "sanity";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "ctaTitle", title: "CTA Title", type: "string" }),
    defineField({ name: "ctaText", title: "CTA Text", type: "text", rows: 3 }),
    defineField({ name: "ctaPrimaryLabel", title: "CTA Primary Label", type: "string" }),
    defineField({ name: "ctaPrimaryHref", title: "CTA Primary Href", type: "string" }),
    defineField({ name: "ctaSecondaryLabel", title: "CTA Secondary Label", type: "string" }),
    defineField({ name: "ctaSecondaryHref", title: "CTA Secondary Href", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "FAQ Page" };
    },
  },
});
