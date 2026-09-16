import { defineField, defineType } from "sanity";

export const careersPage = defineType({
  name: "careersPage",
  title: "Careers Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Page Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Page Title", type: "string" }),
    defineField({ name: "description", title: "Page Introduction", type: "text", rows: 4 }),
    defineField({
      name: "vacancies",
      title: "Vacancies",
      type: "array",
      of: [
        {
          name: "vacancy",
          title: "Vacancy",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Job Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "location", title: "Location", type: "string" }),
            defineField({ name: "employmentType", title: "Employment Type", type: "string" }),
            defineField({ name: "salary", title: "Salary / Package", type: "string" }),
            defineField({ name: "summary", title: "Role Summary", type: "text", rows: 4 }),
            defineField({ name: "responsibilities", title: "Role Responsibilities", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "requirements", title: "What We Are Looking For", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "benefits", title: "What We Offer", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "applicationDeadline", title: "Application Deadline", type: "string" }),
            defineField({ name: "applicationEmail", title: "Application Email", type: "email" }),
            defineField({ name: "applicationLabel", title: "Application Button Label", type: "string" }),
            defineField({ name: "active", title: "Currently Hiring", type: "boolean", initialValue: true }),
          ],
          preview: {
            select: { title: "title", subtitle: "employmentType" },
          },
        },
      ],
    }),
    defineField({ name: "cultureEyebrow", title: "Culture Eyebrow", type: "string" }),
    defineField({ name: "cultureTitle", title: "Culture Title", type: "string" }),
    defineField({ name: "cultureText", title: "Culture Text", type: "text", rows: 4 }),
    defineField({ name: "generalEnquiryText", title: "General Careers Enquiry Text", type: "text", rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: "Careers Page" };
    },
  },
});
