// Engangsskript for å legge inn plassholderinnhold i Sanity (fase 1).
// Kjør med: node scripts/seed.mjs
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

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function run() {
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    phone: "+47 46384492",
    email: "mariekiropraktor@gmail.com",
    address: "Garderbakken 1, Fetsund",
    bookingUrl: "https://pasientsky.no/timebestilling/krystallsykehjelpen",
  });
  console.log("siteSettings opprettet/oppdatert");

  const categories = [
    {
      title: "Bakre buegang",
      order: 1,
      description: "Den vanligste buegangen ved krystallsyke (BPPV). [Fyll inn faktisk klinisk beskrivelse].",
    },
    {
      title: "Horisontale buegang",
      order: 2,
      description: "En mindre vanlig, men velkjent variant av krystallsyke. [Fyll inn faktisk klinisk beskrivelse].",
    },
    {
      title: "Øvre buegang",
      order: 3,
      description: "Den sjeldneste formen for krystallsyke. [Fyll inn faktisk klinisk beskrivelse].",
    },
  ];

  const categoryIds = {};
  for (const cat of categories) {
    const slug = slugify(cat.title);
    const doc = await client.createOrReplace({
      _id: `exerciseCategory-${slug}`,
      _type: "exerciseCategory",
      title: cat.title,
      slug: { _type: "slug", current: slug },
      order: cat.order,
      description: [
        {
          _type: "block",
          _key: "b1",
          style: "normal",
          children: [{ _type: "span", _key: "s1", text: cat.description }],
        },
      ],
    });
    categoryIds[cat.title] = doc._id;
    console.log(`exerciseCategory "${cat.title}" opprettet/oppdatert`);
  }

  const exercises = [
    {
      title: "Epley-manøver",
      category: "Bakre buegang",
    },
    {
      title: "Lempert-manøver",
      category: "Horisontale buegang",
    },
    {
      title: "Yacovino-manøver",
      category: "Øvre buegang",
    },
  ];

  for (const ex of exercises) {
    const slug = slugify(ex.title);
    await client.createOrReplace({
      _id: `exercise-${slug}`,
      _type: "exercise",
      title: ex.title,
      slug: { _type: "slug", current: slug },
      category: { _type: "reference", _ref: categoryIds[ex.category] },
      steps: [
        "[Fyll inn faktisk steg 1 — klinisk innhold]",
        "[Fyll inn faktisk steg 2 — klinisk innhold]",
        "[Fyll inn faktisk steg 3 — klinisk innhold]",
      ],
      order: 1,
    });
    console.log(`exercise "${ex.title}" opprettet/oppdatert`);
  }

  await client.createOrReplace({
    _id: "blogPost-eksempel-blogginnlegg",
    _type: "blogPost",
    title: "Eksempel blogginnlegg",
    slug: { _type: "slug", current: "eksempel-blogginnlegg" },
    publishedDate: new Date().toISOString().slice(0, 10),
    excerpt: "[Plassholder-ingress — fyll inn faktisk tekst]",
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "[Plassholder-brødtekst — fyll inn faktisk tekst]" }],
      },
    ],
  });
  console.log("blogPost \"Eksempel blogginnlegg\" opprettet/oppdatert");

  console.log("\nFerdig! Plassholderinnhold lagt inn i Sanity.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
