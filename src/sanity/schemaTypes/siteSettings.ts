import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "launchSettings", title: "Website Launch / Coming Soon", type: "object",
      description: "Publish to switch the homepage and navigation immediately. Coming Soon hides menus and Book Online, but does not disable direct booking URLs or the booking API.",
      fields: [
        defineField({ name: "mode", title: "Website Mode", type: "string", initialValue: "comingSoon", options: { list: [{ title: "Coming Soon - registration only navigation", value: "comingSoon" }, { title: "Full Website", value: "full" }], layout: "radio" }, validation: (rule) => rule.required() }),
        defineField({ name: "openingLabel", title: "Opening Announcement", type: "string", initialValue: "Coming Soon in February 2027" }),
        defineField({ name: "title", title: "Landing Page Heading", type: "string" }),
        defineField({ name: "description", title: "Landing Page Description", type: "text", rows: 3 }),
        defineField({ name: "image", title: "Landing Page Photo", type: "image", options: { hotspot: true } }),
        defineField({ name: "imageAlt", title: "Landing Photo Description", type: "string" }),
      ],
    }),
    defineField({
      name: "companyDetails", title: "Registered Company Details", type: "object",
      description: "Published in the footer in both modes. Enter only details confirmed by the company; do not use the clinic address as the registered office unless it is correct. Have your adviser confirm the required disclosures.",
      fields: [
        defineField({ name: "registeredName", title: "Registered Company Name", type: "string" }),
        defineField({ name: "companyNumber", title: "Company Registration Number", type: "string" }),
        defineField({ name: "registeredOffice", title: "Registered Office Address", type: "text", rows: 3 }),
        defineField({ name: "jurisdiction", title: "Registration Jurisdiction", type: "string", description: "For example, England and Wales. Use the jurisdiction on the company's registration." }),
        defineField({ name: "vatNumber", title: "VAT Registration Number (if applicable)", type: "string" }),
      ],
    }),
    defineField({
      name: "tiktokFeed", title: "Homepage TikTok Feed", type: "object",
      description: "Official creator-profile embed near the bottom of the full homepage. Loaded only after external-media consent. Not shown on the temporary coming-soon landing page.",
      fields: [
        defineField({ name: "enabled", title: "Show TikTok Feed", type: "boolean", initialValue: true }),
        defineField({ name: "username", title: "TikTok Username", type: "string", initialValue: "the.sutton.vet", description: "Username only, not a URL. The account must be public and eligible for embedding.", validation: (rule) => rule.regex(/^@?[a-zA-Z0-9._]{2,24}$/, { name: "TikTok username" }) }),
        defineField({ name: "title", title: "Section Heading", type: "string" }),
        defineField({ name: "description", title: "Section Description", type: "text", rows: 3 }),
      ],
    }),
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
    defineField({ name: "lupaBookingUrl", title: "PMS Booking URL", type: "url" }),
    defineField({ name: "lupaRegistrationUrl", title: "PMS Registration URL", type: "url" }),
    defineField({ name: "healthPlanUrl", title: "Health Plan Signup URL", type: "url", description: "Use the approved provider signup URL, not this website's /health-plan page. Leave blank until enrolment is available; visitors can contact the practice to register interest." }),
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
      description: "Links shown once in the footer. To add a compliance page, first publish it under Legal Page with Page Type Additional Compliance Page, then add its label and /legal/your-slug here. Drag links to reorder them and publish Site Settings.",
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
        defineField({ name: "servicesReply", title: "Services Reply", type: "text", rows: 3 }),
        defineField({ name: "careersReply", title: "Careers Reply", type: "text", rows: 3 }),
        defineField({ name: "contactReply", title: "Contact Reply", type: "text", rows: 3 }),
        defineField({ name: "paymentsReply", title: "Payments Reply", type: "text", rows: 3 }),
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

