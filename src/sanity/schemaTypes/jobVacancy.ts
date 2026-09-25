import { defineField, defineType } from "sanity";

export const jobVacancy = defineType({
  name: "jobVacancy",
  title: "Job Vacancy",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Job Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "active", title: "Show On Careers Page", type: "boolean", initialValue: true }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 10 }),
    defineField({ name: "location", title: "Location", type: "string", initialValue: "Hackbridge, Sutton", validation: (rule) => rule.required() }),
    defineField({ name: "employmentType", title: "Hours / Employment Type", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "salary", title: "Salary", description: "For example: GBP 30,000-34,000 DOE or Competitive, DOE.", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "summary", title: "Short Role Summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "responsibilities", title: "Role Responsibilities", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "requirements", title: "What We Are Looking For", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "benefits", title: "Salary Benefits / What We Offer", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(1) }),
    defineField({ name: "applicationDeadline", title: "Application Deadline", type: "date" }),
    defineField({ name: "applicationEmail", title: "Application Email", type: "email" }),
    defineField({ name: "applicationLabel", title: "Application Button Label", type: "string", initialValue: "Apply by email" }),
  ],
  orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "salary", active: "active" },
    prepare({ title, subtitle, active }) {
      return { title: `${active === false ? "Hidden: " : ""}${title || "Untitled vacancy"}`, subtitle };
    },
  },
});
