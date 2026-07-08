import { defineField, defineType } from "sanity";

export const teamPage = defineType({
  name: "teamPage",
  title: "Team Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
    defineField({ name: "heroImageUrl", title: "Hero Image URL", type: "url" }),
    defineField({ name: "introEyebrow", title: "Intro Eyebrow", type: "string" }),
    defineField({ name: "introTitle", title: "Intro Title", type: "string" }),
    defineField({ name: "introDescription", title: "Intro Description", type: "text", rows: 4 }),
    defineField({ name: "ctaTitle", title: "CTA Title", type: "string" }),
    defineField({ name: "ctaText", title: "CTA Text", type: "text", rows: 3 }),
    defineField({ name: "ctaPrimaryLabel", title: "CTA Primary Label", type: "string" }),
    defineField({ name: "ctaPrimaryHref", title: "CTA Primary Href", type: "string" }),
    defineField({ name: "ctaSecondaryLabel", title: "CTA Secondary Label", type: "string" }),
    defineField({ name: "ctaSecondaryHref", title: "CTA Secondary Href", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Team Page" };
    },
  },
});
