import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "practiceName", title: "Practice Name", type: "string" }),
    defineField({ name: "shortName", title: "Short Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "text", rows: 3 }),
    defineField({ name: "footerTagline", title: "Footer Tagline", type: "string" }),
    defineField({ name: "topbarNote", title: "Top Bar Note", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "emergencyPhone", title: "Emergency Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "day", title: "Day", type: "string" }),
            defineField({ name: "hours", title: "Hours", type: "string" }),
          ],
          preview: {
            select: {
              title: "day",
              subtitle: "hours",
            },
          },
        }),
      ],
    }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number", type: "string" }),
    defineField({ name: "whatsappPrefillMessage", title: "WhatsApp Prefill Message", type: "text", rows: 2 }),
    defineField({ name: "lupaBookingUrl", title: "Lupa Booking URL", type: "url" }),
    defineField({ name: "lupaRegistrationUrl", title: "Lupa Registration URL", type: "url" }),
    defineField({ name: "healthPlanUrl", title: "Health Plan URL", type: "url" }),
    defineField({ name: "googleBusinessProfileUrl", title: "Google Business Profile URL", type: "url" }),
    defineField({ name: "googleMapEmbedUrl", title: "Google Map Embed URL", type: "url" }),
    defineField({ name: "hasMapUrl", title: "Public Map URL", type: "url" }),
    defineField({ name: "latitude", title: "Latitude", type: "number" }),
    defineField({ name: "longitude", title: "Longitude", type: "number" }),
    defineField({
      name: "knowsAbout",
      title: "Local SEO / Knows About",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Href", type: "url" }),
            defineField({ name: "icon", title: "Icon Key", type: "string" }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "mainNav",
      title: "Main Navigation",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Href", type: "string" }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Href", type: "string" }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "headerCtas",
      title: "Header CTA Labels",
      type: "object",
      fields: [
        defineField({ name: "emergencyLabel", title: "Emergency Label", type: "string" }),
        defineField({ name: "bookLabel", title: "Book Label", type: "string" }),
        defineField({ name: "registerLabel", title: "Register Label", type: "string" }),
      ],
    }),
    defineField({
      name: "complianceLines",
      title: "Footer Compliance Lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "chatSettings",
      title: "Chat Widget Settings",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "introLabel", title: "Intro Label", type: "string" }),
        defineField({ name: "introText", title: "Intro Text", type: "text", rows: 3 }),
        defineField({
          name: "topicButtons",
          title: "Topic Buttons",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "query", title: "Query", type: "string" }),
              ],
              preview: {
                select: {
                  title: "label",
                  subtitle: "query",
                },
              },
            }),
          ],
        }),
        defineField({ name: "inputPlaceholder", title: "Input Placeholder", type: "string" }),
        defineField({ name: "hoursReply", title: "Hours Reply", type: "text", rows: 3 }),
        defineField({ name: "locationReply", title: "Location Reply", type: "text", rows: 3 }),
        defineField({ name: "feesReply", title: "Fees Reply", type: "text", rows: 3 }),
        defineField({ name: "planReply", title: "Health Plan Reply", type: "text", rows: 3 }),
        defineField({ name: "bookingReply", title: "Booking Reply", type: "text", rows: 3 }),
        defineField({ name: "fallbackReply", title: "Fallback Reply", type: "text", rows: 3 }),
        defineField({ name: "emergencyLabel", title: "Emergency Label", type: "string" }),
        defineField({ name: "emergencyReply", title: "Emergency Reply", type: "text", rows: 3 }),
        defineField({ name: "emergencyButtonLabel", title: "Emergency Button Label", type: "string" }),
        defineField({ name: "registerButtonLabel", title: "Register Button Label", type: "string" }),
        defineField({ name: "whatsappButtonLabel", title: "WhatsApp Button Label", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
