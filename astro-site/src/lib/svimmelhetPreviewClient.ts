import { createClient, type SanityClient } from "@sanity/client";
import { loadEnv } from "vite";
import { sanityClient as publicClient } from "sanity:client";

// Lokal forhåndsvisning av upubliserte diagnosisPage/svimmelhetPage-utkast,
// UTEN å publisere. Samme grunnmønster som blogPreviewClient.ts, men med et
// eget, dedikert lese-token i stedet for å gjenbruke skrivetokenet — mindre
// rettigheter å ha liggende lokalt for et rent forhåndsvisningsformål.
//
// Aktiveres KUN når ALLE tre stemmer:
// 1. import.meta.env.DEV er sann (aldri i en faktisk build/deploy)
// 2. SANITY_PREVIEW_DRAFTS=true er satt i .env.local
// 3. SANITY_READ_TOKEN (et lesetoken, rollen "Viewer" i sanity.io/manage) er satt i .env.local
//
// .env.local er i .gitignore og settes aldri på Vercel — så en faktisk
// build/deploy bruker alltid den vanlige, upubliserte offentlige klienten.
//
// Merk: bruker perspective "drafts" (gjeldende korrekte verdi i
// @sanity/client) — IKKE den utdaterte "previewDrafts"-betegnelsen.
const env = loadEnv(import.meta.env.MODE, process.cwd(), "");
const readToken = env.SANITY_READ_TOKEN;
const previewFlagOn = env.SANITY_PREVIEW_DRAFTS === "true";
export const isPreviewingSvimmelhetDrafts = import.meta.env.DEV && previewFlagOn && Boolean(readToken);

const draftAwareClient: SanityClient | null = isPreviewingSvimmelhetDrafts
  ? createClient({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET,
      token: readToken,
      apiVersion: "2024-01-01",
      useCdn: false,
      perspective: "drafts",
    })
  : null;

export const svimmelhetPreviewClient = draftAwareClient ?? publicClient;
