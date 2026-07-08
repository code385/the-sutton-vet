import { defineField, defineType } from "sanity";

export const emergencySettings = defineType({
  name: "emergencySettings",
  title: "Emergency Settings",
  type: "document",
  fields: [
    defineField({ name: "inHoursMessage", title: "In-Hours Message", type: "text", rows: 3 }),
    defineField({ name: "outOfHoursMessage", title: "Out-of-Hours Message", type: "text", rows: 3 }),
    defineField({ name: "emergencyPhone", title: "Emergency Phone", type: "string" }),
    defineField({
      name: "keywords",
      title: "Emergency Keywords",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
