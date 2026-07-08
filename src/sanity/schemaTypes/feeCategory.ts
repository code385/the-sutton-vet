import { defineArrayMember, defineField, defineType } from "sanity";

export const feeCategory = defineType({
  name: "feeCategory",
  title: "Fee Category",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number" }),
    defineField({
      name: "items",
      title: "Fee Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "price", title: "Price", type: "string" }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});
