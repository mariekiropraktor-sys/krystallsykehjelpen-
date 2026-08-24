// Engangsskript: importerer full øvelsesdata (reponerings- og
// habitueringsøvelser) fra ovelse-detaljsider-seed-data.json inn i Sanity.
// Erstatter de tre tynne fase-1-plassholderne (Epley/Lempert/Yacovino) med
// 16 komplette dokumenter — gamle og nye eksisterer ikke side om side.
// Kjør med: node scripts/import-ovelser.mjs
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

const SEED_PATH = "/Users/marie/Downloads/ovelse-detaljsider-seed-data.json";

const OLD_PLACEHOLDER_IDS = [
  "exercise-epley-manover",
  "exercise-lempert-manover",
  "exercise-yacovino-manover",
];

// canal (JSON) -> eksisterende exerciseCategory-dokument
const CANAL_TO_CATEGORY_ID = {
  bakre: "exerciseCategory-bakre-buegang",
  horisontal: "exerciseCategory-horisontale-buegang",
  fremre: "exerciseCategory-ovre-buegang",
};

// habitueringSeksjon per slug (ikke i JSON-en ennå — avklart i samtale)
const HABITUERING_SEKSJON = {
  "brandt-daroff": "vestibular-rehab",
  "cawthorne-cooksey": "vestibular-rehab",
  "blikkstabilisering": "vestibular-rehab",
  "balansetrening-staende": "balanse-rad",
  "gradvis-eksponering": "balanse-rad",
  "gode-vaner": "balanse-rad",
  "fallforebygging": "balanse-rad",
};

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function toSteps(steps) {
  if (!steps) return undefined;
  return steps.map((s) => ({
    _type: "step",
    _key: key(),
    title: s.title,
    description: s.description,
    holdTime: s.holdTime,
  }));
}

function toContentBlocks(content) {
  if (!content) return undefined;
  return content.map((c) => ({
    _type: "contentBlock",
    _key: key(),
    heading: c.heading,
    text: c.text,
  }));
}

function toAdviceList(adviceList) {
  if (!adviceList) return undefined;
  return adviceList.map((a) => ({
    _type: "adviceItem",
    _key: key(),
    title: a.title,
    description: a.description,
  }));
}

function toRelated(related) {
  if (!related?.length) return undefined;
  return related.map((slug) => ({
    _type: "reference",
    _key: key(),
    _ref: `exercise-${slug}`,
  }));
}

async function run() {
  const items = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));

  console.log(`Sletter ${OLD_PLACEHOLDER_IDS.length} gamle plassholder-dokumenter...`);
  for (const id of OLD_PLACEHOLDER_IDS) {
    await client.delete(id);
  }

  const canalOrderCounters = {};
  const seksjonOrderCounters = {};

  for (const item of items) {
    const isReponering = item.exerciseType === "reponering";
    const isHabituering = item.exerciseType === "habituering";

    let category;
    let order;

    if (isReponering) {
      const categoryId = CANAL_TO_CATEGORY_ID[item.canal];
      if (!categoryId) {
        throw new Error(`Ukjent canal "${item.canal}" for øvelse "${item.slug}"`);
      }
      category = { _type: "reference", _ref: categoryId };
      canalOrderCounters[item.canal] = (canalOrderCounters[item.canal] ?? 0) + 1;
      order = canalOrderCounters[item.canal];
    }

    let habitueringSeksjon;
    if (isHabituering) {
      habitueringSeksjon = HABITUERING_SEKSJON[item.slug];
      if (!habitueringSeksjon) {
        throw new Error(`Mangler habitueringSeksjon-mapping for øvelse "${item.slug}"`);
      }
      seksjonOrderCounters[habitueringSeksjon] = (seksjonOrderCounters[habitueringSeksjon] ?? 0) + 1;
      order = seksjonOrderCounters[habitueringSeksjon];
    }

    const doc = {
      _id: `exercise-${item.slug}`,
      _type: "exercise",
      title: item.title,
      slug: { _type: "slug", current: item.slug },
      exerciseType: item.exerciseType,
      format: item.format,
      category,
      canal: isReponering ? item.canal : undefined,
      side: isReponering ? item.side ?? undefined : undefined,
      habitueringSeksjon,
      duration: item.duration,
      stepCount: item.stepCount,
      mediaType: item.mediaType,
      lead: item.lead,
      safetyNote: item.safetyNote,
      steps: toSteps(item.steps),
      aftercare: item.aftercare,
      content: toContentBlocks(item.content),
      adviceList: toAdviceList(item.adviceList),
      tip: item.tip,
      order,
    };

    // Fjern undefined-felt så vi ikke skriver tomme nøkler til Sanity
    Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);

    await client.createOrReplace(doc);
    console.log(`exercise "${item.title}" (${item.exerciseType}/${item.format}) opprettet/oppdatert`);
  }

  // Andre runde: patch inn relatedExercises nå som alle dokumentene finnes
  // (unngår "references non-existent document" for søsken-referanser).
  console.log("\nKobler relaterte øvelser...");
  for (const item of items) {
    const related = toRelated(item.related);
    if (!related) continue;
    await client.patch(`exercise-${item.slug}`).set({ relatedExercises: related }).commit();
    console.log(`exercise "${item.title}" koblet til ${related.length} relaterte øvelse(r)`);
  }

  console.log(`\nFerdig! ${items.length} øvelser importert.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
