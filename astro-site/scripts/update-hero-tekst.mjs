// Engangsskript: fjerner heading + body fra hero-seksjonen på forsiden
// ("hjem") i Sanity, slik at siden faller tilbake til hardkodet
// standardtekst i index.astro (som allerede inneholder den nye,
// ønskede teksten — inkl. kursivert "plutselig snurrer" med ekte <em>,
// noe heading-feltet i Sanity ikke støtter siden det er ren tekst uten
// rik formatering). Bruker patch().unset() (ikke createOrReplace) for å
// bevare andre felt (mediaAsset, mediaType) på dokumentet uendret.
// Kjør med: node scripts/update-hero-tekst.mjs
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

async function run() {
  await client
    .patch("pageSection-hjem-hero")
    .unset(["heading", "body"])
    .commit();
  console.log("pageSection-hjem-hero oppdatert — heading og body fjernet, siden faller nå tilbake til standardteksten i index.astro.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
