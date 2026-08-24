// Engangsskript: legger inn pageSection-innhold for Kontakt oss-siden
// (pageSlug "kontakt-oss" — allerede en gyldig verdi i skjemaet fra fase 1).
// Kjør med: node scripts/import-kontakt-page-sections.mjs
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnv();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function block(text) {
  return {
    _type: "block",
    _key: `b${Math.random().toString(36).slice(2, 9)}`,
    style: "normal",
    children: [{ _type: "span", _key: `s${Math.random().toString(36).slice(2, 9)}`, text }],
  };
}

async function upsertSection({ sectionKey, heading, paragraphs }) {
  await client.createOrReplace({
    _id: `pageSection-kontakt-oss-${sectionKey}`,
    _type: "pageSection",
    pageSlug: "kontakt-oss",
    sectionKey,
    heading,
    body: (paragraphs ?? []).map(block),
    mediaType: "ingen",
  });
  console.log(`pageSection "kontakt-oss/${sectionKey}" opprettet/oppdatert`);
}

async function run() {
  await upsertSection({
    sectionKey: "hero",
    heading: "Kontakt oss",
    paragraphs: [
      "Har du spørsmål, ønsker å bestille time, eller vil vite mer om hva vi tilbyr? Ta gjerne kontakt – vi svarer så raskt vi kan.",
    ],
  });
  await upsertSection({
    sectionKey: "skjema",
    heading: "Fyll ut skjemaet",
    paragraphs: ["Så tar vi kontakt med deg så raskt som mulig – vanligvis samme dag."],
  });
  await upsertSection({
    sectionKey: "kart",
    heading: "Slik finner du oss",
    paragraphs: [],
  });
  await upsertSection({
    sectionKey: "cta",
    heading: "Klar for å bestille time?",
    paragraphs: ["Book enkelt online, og møt oss for en trygg og skånsom behandling."],
  });
  console.log("\nFerdig! Sidetekst for Kontakt oss lagt inn i Sanity.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
