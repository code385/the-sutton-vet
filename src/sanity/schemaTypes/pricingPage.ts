import { defineArrayMember, defineField, defineType } from "sanity";

export const pricingPage = defineType({
  name: "pricingPage",
  title: "Pricing Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "heroImageUrl", title: "Hero Image URL", type: "url" }),

    defineField({ name: "promiseEyebrow", title: "Promise Eyebrow", type: "string" }),
    defineField({ name: "promiseTitle", title: "Promise Title", type: "string" }),
    defineField({ name: "promiseDescription", title: "Promise Description", type: "text", rows: 4 }),
    defineField({ name: "promiseSecondary", title: "Promise Secondary Text", type: "text", rows: 3 }),

    defineField({ name: "healthPlanEyebrow", title: "Health Plan Eyebrow", type: "string" }),
    defineField({ name: "healthPlanTitle", title: "Health Plan Title", type: "string" }),
    defineField({ name: "healthPlanDescription", title: "Health Plan Description", type: "text", rows: 4 }),
    defineField({ name: "healthPlanImageUrl", title: "Health Plan Image URL", type: "url" }),
    defineField({ name: "healthPlanCtaLabel", title: "Health Plan CTA Label", type: "string" }),
    defineField({ name: "healthPlanCtaHref", title: "Health Plan CTA Href", type: "string" }),

    defineField({ name: "calculatorEyebrow", title: "Calculator Eyebrow", type: "string" }),
    defineField({ name: "calculatorTitle", title: "Calculator Title", type: "string" }),
    defineField({ name: "calculatorDescription", title: "Calculator Description", type: "text", rows: 3 }),
    defineField({
      name: "calculatorEntries",
      title: "Calculator Entries",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "species",
              title: "Species",
              type: "string",
              options: {
                list: ["Dog", "Cat"],
                layout: "radio",
              },
            }),
            defineField({ name: "weightBand", title: "Weight Band", type: "string" }),
            defineField({ name: "annualPayAsYouGo", title: "Annual Pay As You Go", type: "number" }),
            defineField({ name: "monthlyPlanCost", title: "Monthly Plan Cost", type: "number" }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
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
});
