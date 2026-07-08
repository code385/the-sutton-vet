import { defineArrayMember, defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 } }),
    defineField({
      name: "pageType",
      title: "Page Type",
      type: "string",
      options: {
        list: ["Privacy Policy", "Cookie Policy", "Accessibility Statement", "Terms of Business"],
      },
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "status", title: "Status", type: "string" }),
            defineField({
              name: "body",
              title: "Body Paragraphs",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "status",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "inventoryItems",
      title: "Cookie Inventory Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "provider", title: "Provider", type: "string" }),
            defineField({ name: "purpose", title: "Purpose", type: "text", rows: 3 }),
            defineField({ name: "duration", title: "Duration", type: "string" }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "provider",
            },
          },
        }),
      ],
    }),
  ],
});
