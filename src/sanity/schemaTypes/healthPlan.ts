import { defineArrayMember, defineField, defineType } from "sanity";

export const healthPlan = defineType({
  name: "healthPlan",
  title: "Health Plan Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Hero Title", type: "string" }),
    defineField({ name: "description", title: "Hero Description", type: "text", rows: 3 }),
    defineField({ name: "heroImageUrl", title: "Hero Image URL", type: "url" }),
    defineField({ name: "heroPrimaryCtaLabel", title: "Hero Primary CTA Label", type: "string" }),
    defineField({ name: "heroPrimaryCtaHref", title: "Hero Primary CTA Href", type: "string" }),
    defineField({ name: "heroSecondaryCtaLabel", title: "Hero Secondary CTA Label", type: "string" }),
    defineField({ name: "heroSecondaryCtaHref", title: "Hero Secondary CTA Href", type: "string" }),

    defineField({ name: "introEyebrow", title: "Intro Eyebrow", type: "string" }),
    defineField({ name: "introTitle", title: "Intro Title", type: "string" }),
    defineField({ name: "introDescription", title: "Intro Description", type: "text", rows: 4 }),

    defineField({ name: "featureEyebrow", title: "Feature Banner Eyebrow", type: "string" }),
    defineField({ name: "featureTitle", title: "Feature Banner Title", type: "string" }),
    defineField({ name: "featureDescription", title: "Feature Banner Description", type: "text", rows: 3 }),
    defineField({ name: "featureImageUrl", title: "Feature Banner Image URL", type: "url" }),
    defineField({ name: "featureCtaLabel", title: "Feature Banner CTA Label", type: "string" }),
    defineField({ name: "featureCtaHref", title: "Feature Banner CTA Href", type: "string" }),

    defineField({
      name: "planTiers",
      title: "Plan Tiers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "species", title: "Species", type: "string" }),
            defineField({ name: "iconKey", title: "Icon Key", type: "string" }),
            defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
            defineField({
              name: "includedBenefits",
              title: "Included Benefits",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({ name: "pricingStructure", title: "Pricing Structure", type: "string" }),
          ],
          preview: {
            select: {
              title: "species",
              subtitle: "pricingStructure",
            },
          },
        }),
      ],
    }),

    defineField({ name: "benefitsEyebrow", title: "Benefits Eyebrow", type: "string" }),
    defineField({ name: "benefitsTitle", title: "Benefits Title", type: "string" }),
    defineField({ name: "benefitsDescription", title: "Benefits Description", type: "text", rows: 3 }),
    defineField({
      name: "benefitCards",
      title: "Benefit Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "iconKey", title: "Icon Key", type: "string" }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
    }),

    defineField({ name: "pricingEyebrow", title: "Pricing Eyebrow", type: "string" }),
    defineField({ name: "pricingTitle", title: "Pricing Title", type: "string" }),
    defineField({ name: "pricingDescription", title: "Pricing Description", type: "text", rows: 3 }),
    defineField({
      name: "pricingCards",
      title: "Pricing Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "iconKey", title: "Icon Key", type: "string" }),
            defineField({ name: "priceSummary", title: "Price Summary", type: "string" }),
            defineField({ name: "supportingText", title: "Supporting Text", type: "text", rows: 2 }),
            defineField({
              name: "lines",
              title: "Lines",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "priceSummary",
            },
          },
        }),
      ],
    }),

    defineField({ name: "faqEyebrow", title: "FAQ Eyebrow", type: "string" }),
    defineField({ name: "faqTitle", title: "FAQ Title", type: "string" }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
          },
        }),
      ],
    }),

    defineField({ name: "ctaEyebrow", title: "CTA Eyebrow", type: "string" }),
    defineField({ name: "ctaTitle", title: "CTA Title", type: "string" }),
    defineField({ name: "ctaText", title: "CTA Text", type: "text", rows: 3 }),
    defineField({ name: "ctaImageUrl", title: "CTA Image URL", type: "url" }),
    defineField({ name: "ctaPrimaryLabel", title: "CTA Primary Label", type: "string" }),
    defineField({ name: "ctaPrimaryHref", title: "CTA Primary Href", type: "string" }),
    defineField({ name: "ctaSecondaryLabel", title: "CTA Secondary Label", type: "string" }),
    defineField({ name: "ctaSecondaryHref", title: "CTA Secondary Href", type: "string" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Health Plan Page",
      };
    },
  },
});
