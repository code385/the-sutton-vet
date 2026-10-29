import { defineField, defineType } from "sanity";

export const clientReview = defineType({
  name: "clientReview",
  title: "Client Review",
  type: "document",
  fields: [
    defineField({ name: "reviewerName", title: "Reviewer Display Name", type: "string", description: "Use the name or initials the reviewer has agreed to share publicly.", validation: (rule) => rule.required().max(100) }),
    defineField({ name: "text", title: "Review Text", type: "text", rows: 6, description: "Add a genuine review you have permission to publish. Plain text only; do not include private contact or medical details.", validation: (rule) => rule.required().max(4000) }),
    defineField({ name: "rating", title: "Star Rating (Optional)", type: "number", description: "Only enter a rating if the reviewer supplied one. Leave blank for text-only reviews.", validation: (rule) => rule.integer().min(1).max(5) }),
    defineField({ name: "source", title: "Source (Optional)", type: "string", description: "For example, Google or Client feedback. Only name the actual source.", validation: (rule) => rule.max(100) }),
    defineField({ name: "reviewDate", title: "Review Date (Optional)", type: "date" }),
    defineField({ name: "active", title: "Show On Website", type: "boolean", initialValue: true, description: "Turn ON and Publish to show this review on the website. Publishing while OFF keeps it hidden from both the homepage and reviews page. Replace any sample text with genuine feedback first." }),
    defineField({ name: "featured", title: "Prioritise On Homepage", type: "boolean", initialValue: false, description: "The homepage shows up to 3 reviews, with these first. Remaining spaces use other visible reviews." }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 10, description: "Lower numbers appear first. Homepage priority takes precedence on the homepage.", validation: (rule) => rule.integer().min(0) }),
  ],
  orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: {
    select: { name: "reviewerName", text: "text", active: "active" },
    prepare({ name, text, active }) {
      return { title: `${active === true ? "" : "Hidden: "}${name || "New review"}`, subtitle: text };
    },
  },
});
