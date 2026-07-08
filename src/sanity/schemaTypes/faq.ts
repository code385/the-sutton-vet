import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string" }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 5 }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number" }),
  ],
});
