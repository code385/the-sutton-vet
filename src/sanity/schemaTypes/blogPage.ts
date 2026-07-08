import { defineField, defineType } from "sanity";

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "introEyebrow", title: "Intro Eyebrow", type: "string" }),
    defineField({ name: "introTitle", title: "Intro Title", type: "string" }),
    defineField({ name: "introDescription", title: "Intro Description", type: "text", rows: 3 }),
    defineField({ name: "feedbackEyebrow", title: "Feedback Eyebrow", type: "string" }),
    defineField({ name: "feedbackTitle", title: "Feedback Title", type: "string" }),
    defineField({ name: "feedbackDescription", title: "Feedback Description", type: "text", rows: 3 }),
    defineField({ name: "feedbackHelperLabel", title: "Feedback Helper Label", type: "string" }),
    defineField({ name: "feedbackHelperHref", title: "Feedback Helper Href", type: "string" }),
    defineField({ name: "feedbackHelpfulLabel", title: "Helpful Button Label", type: "string" }),
    defineField({ name: "feedbackMoreLabel", title: "More Detail Button Label", type: "string" }),
    defineField({ name: "feedbackContactLabel", title: "Speak To Someone Button Label", type: "string" }),
    defineField({ name: "feedbackHelpfulResponse", title: "Helpful Response", type: "text", rows: 2 }),
    defineField({ name: "feedbackMoreResponse", title: "More Detail Response", type: "text", rows: 2 }),
    defineField({ name: "feedbackContactResponse", title: "Contact Response", type: "text", rows: 2 }),
    defineField({ name: "browseMoreLabel", title: "Browse More Label", type: "string" }),
    defineField({ name: "browseMoreHref", title: "Browse More Href", type: "string" }),
    defineField({ name: "askDirectLabel", title: "Ask Direct Label", type: "string" }),
    defineField({ name: "askDirectHref", title: "Ask Direct Href", type: "string" }),
    defineField({ name: "ctaTitle", title: "Bottom CTA Title", type: "string" }),
    defineField({ name: "ctaText", title: "Bottom CTA Text", type: "text", rows: 3 }),
    defineField({ name: "ctaPrimaryLabel", title: "Bottom CTA Primary Label", type: "string" }),
    defineField({ name: "ctaPrimaryHref", title: "Bottom CTA Primary Href", type: "string" }),
    defineField({ name: "ctaSecondaryLabel", title: "Bottom CTA Secondary Label", type: "string" }),
    defineField({ name: "ctaSecondaryHref", title: "Bottom CTA Secondary Href", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Blog Page" };
    },
  },
});
