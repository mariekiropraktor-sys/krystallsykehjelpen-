import { createClient, type SanityClient } from "@sanity/client";
import { loadEnv } from "vite";
import { sanityClient as publicClient } from "sanity:client";

// Kun for lokal forhåndsvisning av upubliserte blogPost-utkast (Sanity
// drafts.*-dokumenter). Den vanlige `sanity:client` er uautentisert og ser
// derfor aldri drafts — riktig og trygt i produksjon, siden Sanity→Vercel-
// webhooken trigger deploy på publisering, ikke på draft-endringer.
//
// Denne klienten aktiveres KUN når `npm run dev` kjører OG en skrivetoken
// finnes lokalt i .env (SANITY_API_WRITE_TOKEN, aldri committet, aldri satt
// på Vercel) — så en faktisk build/deploy bruker alltid den vanlige,
// upubliserte offentlige klienten.
//
// SANITY_API_WRITE_TOKEN har ingen PUBLIC_-prefiks og eksponeres derfor ikke
// via import.meta.env (Astro/Vite sin envPrefix-restriksjon) — OG Vite
// populerer heller ikke process.env fra .env automatisk for SSR-moduler.
// Leses derfor eksplisitt med Vite sin egen loadEnv() (samme mønster som
// astro.config.mjs bruker for PUBLIC_SANITY_PROJECT_ID), med tom prefiks
// (tredje argument) som fjerner PUBLIC_-restriksjonen.
const env = loadEnv(import.meta.env.MODE, process.cwd(), "");
const writeToken = env.SANITY_API_WRITE_TOKEN;
const canPreviewDrafts = import.meta.env.DEV && Boolean(writeToken);

const draftAwareClient: SanityClient | null = canPreviewDrafts
  ? createClient({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET,
      token: writeToken,
      apiVersion: "2024-01-01",
      useCdn: false,
      perspective: "drafts",
    })
  : null;

export const blogPreviewClient = draftAwareClient ?? publicClient;
export const isPreviewingDrafts = canPreviewDrafts;
