import { defineField, defineType } from "sanity";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "introNote", title: "Intro Note", type: "string" }),
    defineField({ name: "primaryCtaLabel", title: "Primary CTA Label", type: "string" }),
    defineField({ name: "primaryCtaHref", title: "Primary CTA Href", type: "string" }),
    defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string" }),
    defineField({ name: "secondaryCtaHref", title: "Secondary CTA Href", type: "string" }),
    defineField({ name: "closingEyebrow", title: "Closing Eyebrow", type: "string" }),
    defineField({ name: "closingTitle", title: "Closing Title", type: "string" }),
    defineField({ name: "closingText", title: "Closing Text", type: "text", rows: 3 }),
    defineField({ name: "closingPrimaryLabel", title: "Closing Primary Label", type: "string" }),
    defineField({ name: "closingPrimaryHref", title: "Closing Primary Href", type: "string" }),
    defineField({ name: "closingSecondaryLabel", title: "Closing Secondary Label", type: "string" }),
    defineField({ name: "closingSecondaryHref", title: "Closing Secondary Href", type: "string" }),
  ],
});
