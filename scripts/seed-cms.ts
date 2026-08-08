import { createClient } from "next-sanity";
import { getCliClient } from "sanity/cli";

import { allSeedDocuments, staleCmsDocumentIds } from "../src/sanity/lib/seedDocuments";

type MinimalClient = {
  createOrReplace: (document: Record<string, unknown>) => Promise<unknown>;
  delete: (id: string) => Promise<unknown>;
};

function resolveClient(): MinimalClient {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hoi7uq4a";
  const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (token) {
    return createClient({
      projectId,
      dataset,
      apiVersion: "2025-01-01",
      token,
      useCdn: false,
    });
  }

  return getCliClient({ apiVersion: "2025-01-01" });
}

async function run() {
  const client = resolveClient();

  for (const document of allSeedDocuments) {
    await client.createOrReplace(document);
    console.log(`Seeded: ${String(document._type)} :: ${String(document._id)}`);
  }

  for (const documentId of staleCmsDocumentIds) {
    await client.delete(documentId);
    console.log(`Removed stale CMS document: ${documentId}`);
  }

  console.log(`Completed CMS seed for ${allSeedDocuments.length} documents and removed ${staleCmsDocumentIds.length} stale documents.`);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("project user not found")) {
    console.error(
      "Sanity seed could not write because the current logged-in user is not a member of this project. Add your user to the project in Sanity, or set SANITY_API_WRITE_TOKEN in .env.local and run npm run seed:cms again.",
    );
  }

  console.error(error);
  process.exit(1);
});
