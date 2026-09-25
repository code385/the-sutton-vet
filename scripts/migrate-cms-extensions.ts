import { createClient } from "next-sanity";
import { getCliClient } from "sanity/cli";

import {
  allSeedDocuments,
  feeCategorySeedDocuments,
  pricingPageSeedDocument,
  serviceCategorySeedDocuments,
} from "../src/sanity/lib/seedDocuments";

function resolveClient() {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hoi7uq4a";
  const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (token) {
    return createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });
  }

  return getCliClient({ apiVersion: "2025-01-01" });
}

function seedDocument(id: string) {
  const document = allSeedDocuments.find((item) => item._id === id);
  if (!document) throw new Error(`Missing seed document: ${id}`);
  return document;
}

async function run() {
  const client = resolveClient();
  const job = seedDocument("job-veterinary-nurse");
  const about = seedDocument("aboutPage");
  const careers = seedDocument("careersPage");
  const home = seedDocument("homePage");
  const cookiePolicy = seedDocument("legal-cookie-policy");
  const privacyPolicy = seedDocument("legal-privacy-policy");

  await client.createIfNotExists(job);
  await client.createIfNotExists(about);

  for (const category of serviceCategorySeedDocuments) {
    await client.createIfNotExists(category);
  }

  await client.createIfNotExists(careers);
  await client
    .patch("careersPage")
    .set({
      title: careers.title,
      description: careers.description,
      heroCtaLabel: careers.heroCtaLabel,
      heroBadgeEyebrow: careers.heroBadgeEyebrow,
      heroBadgeTitle: careers.heroBadgeTitle,
      vacanciesEyebrow: careers.vacanciesEyebrow,
      vacanciesTitle: careers.vacanciesTitle,
      hiringLabel: careers.hiringLabel,
      applyTitle: careers.applyTitle,
      applyText: careers.applyText,
      roleDetailsLabel: careers.roleDetailsLabel,
      generalEnquiryText: careers.generalEnquiryText,
      generalEnquiryLabel: careers.generalEnquiryLabel,
    })
    .commit();

  await client.createIfNotExists(home);
  await client
    .patch("homePage")
    .set({
      heroEyebrow: home.heroEyebrow,
      heroTitle: home.heroTitle,
      heroDescription: home.heroDescription,
      introEyebrow: home.introEyebrow,
      introTitle: home.introTitle,
      introParagraphs: home.introParagraphs,
      introNoteLabel: home.introNoteLabel,
      introNoteText: home.introNoteText,
      servicesEyebrow: home.servicesEyebrow,
      servicesTitle: home.servicesTitle,
      servicesDescription: home.servicesDescription,
    })
    .commit();

  await client.createIfNotExists(cookiePolicy);
  await client
    .patch("legal-cookie-policy")
    .set({
      description: cookiePolicy.description,
      sections: cookiePolicy.sections,
      inventoryItems: cookiePolicy.inventoryItems,
    })
    .commit();

  await client.createIfNotExists(privacyPolicy);
  await client
    .patch("legal-privacy-policy")
    .set({
      description: privacyPolicy.description,
      sections: privacyPolicy.sections,
    })
    .commit();

  await client.createIfNotExists(pricingPageSeedDocument);
  await client
    .patch("pricingPage")
    .set({
      eyebrow: pricingPageSeedDocument.eyebrow,
      title: pricingPageSeedDocument.title,
      description: pricingPageSeedDocument.description,
      promiseEyebrow: pricingPageSeedDocument.promiseEyebrow,
      promiseTitle: pricingPageSeedDocument.promiseTitle,
      promiseDescription: pricingPageSeedDocument.promiseDescription,
    })
    .commit();

  for (const category of feeCategorySeedDocuments) {
    await client.createIfNotExists(category);
    await client
      .patch(String(category._id))
      .set({
        title: category.title,
        eyebrow: category.eyebrow,
        description: category.description,
        sortOrder: category.sortOrder,
        items: category.items,
      })
      .commit();
  }

  console.log("CMS extension migration completed without deleting documents.");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
