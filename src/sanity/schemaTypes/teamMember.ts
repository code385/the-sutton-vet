import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Veterinary Surgeon", "RVN", "Client Care", "Reception", "Leadership"],
      },
    }),
    defineField({ name: "qualifications", title: "Qualifications", type: "string" }),
    defineField({ name: "shortBio", title: "Short Bio", type: "text", rows: 3 }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 5 }),
    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "imageUrl", title: "Fallback Remote Image URL", type: "url" }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number" }),
  ],
});
