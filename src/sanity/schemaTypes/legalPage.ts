import { defineArrayMember, defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "For additional compliance pages, click Generate. The website address will be /legal/your-slug. Add that address in Site Settings > Legal Links after publishing.",
      validation: (Rule) => Rule.custom((value, context) => {
        if (context.document?.pageType !== "Additional Compliance Page") return true;
        return value?.current && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
          ? true : "Generate a slug using lowercase letters, numbers, and hyphens.";
      }),
    }),
    defineField({
      name: "pageType",
      title: "Page Type",
      type: "string",
      options: {
        list: ["Privacy Policy", "Cookie Policy", "Accessibility Statement", "Terms of Business", "Additional Compliance Page"],
      },
      description: "Choose Additional Compliance Page for a new policy. Existing policy types keep their current website addresses.",
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
