import { defineField, defineType } from "sanity";

const labelTextList = (name: string, title: string) => defineField({
  name,
  title,
  type: "array",
  of: [{ type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "text", title: "Text", type: "text", rows: 3 })] }],
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 4 }),
    defineField({ name: "heroImageUrl", title: "Hero Image URL", type: "url" }),
    defineField({ name: "introEyebrow", title: "Approach Eyebrow", type: "string" }),
    defineField({ name: "introTitle", title: "Approach Title", type: "string" }),
    defineField({ name: "introParagraphs", title: "Approach Paragraphs", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "storyEyebrow", title: "Story Eyebrow", type: "string" }),
    defineField({ name: "storyTitle", title: "Story Title", type: "string" }),
    defineField({ name: "storyText", title: "Story Text", type: "text", rows: 5 }),
    labelTextList("carePillars", "Care Pillars"),
    defineField({ name: "differenceEyebrow", title: "Difference Eyebrow", type: "string" }),
    defineField({ name: "differenceTitle", title: "Difference Title", type: "string" }),
    defineField({ name: "differencePoints", title: "Difference Points", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "visitEyebrow", title: "Visit Eyebrow", type: "string" }),
    defineField({ name: "visitTitle", title: "Visit Title", type: "string" }),
    defineField({ name: "visitDescription", title: "Visit Description", type: "text", rows: 3 }),
    labelTextList("visitDetails", "Visit Details"),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
