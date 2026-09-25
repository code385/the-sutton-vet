import { defineField, defineType } from "sanity";

export const serviceCategory = defineType({
  name: "serviceCategory",
  title: "Service Directory Group",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Group Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Short Description", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "featuredService", title: "Linked Detail Page", type: "reference", to: [{ type: "service" }], validation: (rule) => rule.required() }),
    defineField({ name: "highlights", title: "Services Included", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(1) }),
    defineField({ name: "sortOrder", title: "Display Order", type: "number", initialValue: 10 }),
    defineField({ name: "active", title: "Show In Directory", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "featuredService.title", active: "active" },
    prepare({ title, subtitle, active }) {
      return { title: `${active === false ? "Hidden: " : ""}${title || "Untitled group"}`, subtitle };
    },
  },
});
