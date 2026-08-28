// Engangsskript: importerer 65 behandlere fra practitioner-seed-data.json
// (research fra offentlig tilgjengelige kilder) som Sanity DRAFTS — IKKE
// publiserte dokumenter, uansett hva `published`-feltet i kilde-JSON-en
// sier. Alle settes med reviewStatus "pending" og skal gjennomgås manuelt
// av Marie i /admin (bekrefte navn/samtykke og publisere) før de vises
// offentlig på /finn-behandler/.
//
// Rører ikke eksisterende practitioner-dokumenter (f.eks.
// practitioner-marie-hermansen) — bruker en egen, stabil ID-serie
// ("practitioner-seed-<løpenummer>") som ikke kolliderer med dem.
//
// Kjør med: node scripts/import-practitioners.mjs
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

const seedPath = path.resolve(process.env.HOME, "Downloads", "practitioner-seed-data.json");
const rows = JSON.parse(fs.readFileSync(seedPath, "utf8"));

async function run() {
  let i = 0;
  for (const row of rows) {
    i++;
    const id = `drafts.practitioner-seed-${String(i).padStart(2, "0")}`;
    const { published, ...fields } = row;
    await client.createOrReplace({
      _id: id,
      ...fields,
      reviewStatus: "pending",
    });
    console.log(`DRAFT opprettet: "${row.name}" – ${row.clinic} (${id})`);
  }
  console.log(`\nFerdig! ${rows.length} behandlere importert som Sanity-drafts (upubliserte, reviewStatus: pending).`);
  console.log("Åpne /admin for å bekrefte hver enkelt og publisere når klinikkene er kontaktet.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
