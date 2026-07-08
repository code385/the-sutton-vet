import { defineArrayMember, defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 3 }),
    defineField({ name: "heroImageUrl", title: "Hero Image URL", type: "url" }),
    defineField({ name: "heroPrimaryCtaLabel", title: "Hero Primary CTA Label", type: "string" }),
    defineField({ name: "heroPrimaryCtaHref", title: "Hero Primary CTA Href", type: "string" }),
    defineField({ name: "heroSecondaryCtaLabel", title: "Hero Secondary CTA Label", type: "string" }),
    defineField({ name: "heroSecondaryCtaHref", title: "Hero Secondary CTA Href", type: "string" }),

    defineField({
      name: "quickLinks",
      title: "Quick Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({ name: "href", title: "Href", type: "string" }),
            defineField({ name: "meta", title: "Meta", type: "text", rows: 2 }),
            defineField({ name: "icon", title: "Icon Key", type: "string" }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "value",
            },
          },
        }),
      ],
    }),

    defineField({ name: "openEyebrow", title: "Open Hours Eyebrow", type: "string" }),
    defineField({ name: "openTitle", title: "Open Hours Title", type: "string" }),
    defineField({ name: "openDescription", title: "Open Hours Description", type: "text", rows: 3 }),
    defineField({
      name: "openMetaLines",
      title: "Open Hours Meta Lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "openCtas",
      title: "Open Panel CTAs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Href", type: "string" }),
            defineField({ name: "variant", title: "Variant", type: "string" }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
    }),

    defineField({ name: "emergencyEyebrow", title: "Emergency Eyebrow", type: "string" }),
    defineField({ name: "emergencyTitle", title: "Emergency Title", type: "string" }),
    defineField({ name: "emergencyDescription", title: "Emergency Description", type: "text", rows: 3 }),
    defineField({
      name: "emergencyPoints",
      title: "Emergency Points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "emergencyButtonLabel", title: "Emergency Button Label", type: "string" }),

    defineField({ name: "hoursEyebrow", title: "Hours Eyebrow", type: "string" }),
    defineField({ name: "hoursTitle", title: "Hours Title", type: "string" }),

    defineField({ name: "locationEyebrow", title: "Location Eyebrow", type: "string" }),
    defineField({ name: "locationTitle", title: "Location Title", type: "string" }),
    defineField({ name: "locationDescription", title: "Location Description", type: "text", rows: 3 }),
    defineField({
      name: "locationPoints",
      title: "Location Points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "locationButtonLabel", title: "Location Button Label", type: "string" }),
    defineField({ name: "locationButtonHref", title: "Location Button Href", type: "string" }),
    defineField({ name: "locationMapEmbedUrl", title: "Location Map Embed URL", type: "url" }),
    defineField({ name: "locationMapLabelTitle", title: "Map Label Title", type: "string" }),
    defineField({ name: "locationMapLabelText", title: "Map Label Text", type: "string" }),

    defineField({
      name: "socialCards",
      title: "Social Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
            defineField({ name: "href", title: "Href", type: "string" }),
            defineField({ name: "icon", title: "Icon Key", type: "string" }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "ctaLabel",
            },
          },
        }),
      ],
    }),

    defineField({ name: "ctaEyebrow", title: "Bottom CTA Eyebrow", type: "string" }),
    defineField({ name: "ctaTitle", title: "Bottom CTA Title", type: "string" }),
    defineField({ name: "ctaText", title: "Bottom CTA Text", type: "text", rows: 3 }),
    defineField({ name: "ctaPrimaryLabel", title: "Bottom CTA Primary Label", type: "string" }),
    defineField({ name: "ctaPrimaryHref", title: "Bottom CTA Primary Href", type: "string" }),
    defineField({ name: "ctaSecondaryLabel", title: "Bottom CTA Secondary Label", type: "string" }),
    defineField({ name: "ctaSecondaryHref", title: "Bottom CTA Secondary Href", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
