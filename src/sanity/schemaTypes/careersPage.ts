import { defineField, defineType } from "sanity";

export const careersPage = defineType({
  name: "careersPage",
  title: "Careers Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Page Eyebrow", type: "string" }),
    defineField({ name: "title", title: "Page Title", type: "string" }),
    defineField({ name: "description", title: "Page Introduction", type: "text", rows: 4 }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroImageAlt", title: "Hero Image Alt Text", type: "string" }),
    defineField({ name: "heroCtaLabel", title: "Hero Button Label", type: "string" }),
    defineField({ name: "heroBadgeEyebrow", title: "Image Badge Eyebrow", type: "string" }),
    defineField({ name: "heroBadgeTitle", title: "Image Badge Title", type: "string" }),
    defineField({ name: "vacanciesEyebrow", title: "Vacancies Eyebrow", type: "string" }),
    defineField({ name: "vacanciesTitle", title: "Vacancies Heading", type: "string" }),
    defineField({ name: "hiringLabel", title: "Vacancy Status Label", type: "string" }),
    defineField({ name: "applyTitle", title: "Application Panel Title", type: "string" }),
    defineField({ name: "applyText", title: "Application Panel Text", type: "text", rows: 2 }),
    defineField({ name: "roleDetailsLabel", title: "Role Details Button Label", type: "string" }),
    defineField({
      name: "vacancies",
      title: "Legacy Embedded Vacancies",
      description: "Existing entries remain supported. Add all new roles as separate Job Vacancy records.",
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
    defineField({ name: "generalEnquiryLabel", title: "General Enquiry Button Label", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Careers Page" };
    },
  },
});
