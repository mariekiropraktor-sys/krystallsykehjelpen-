// Engangsskript for fase 3: legger inn plassholder-FAQ og behandlerprofilen
// til Marie i Sanity (faqItem + practitioner var bevisst tomme fra fase 1).
// Kjør med: node scripts/seed-faq-og-behandler.mjs
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

async function seedFaqItems() {
  const items = [
    {
      id: "faqItem-bestille-time",
      order: 1,
      question: "Hvordan bestiller jeg time?",
      answer: "Du bestiller enkelt time via bookingknappen på nettsiden, som tar deg til vår nettbaserte timebestilling (Pasientsky).",
    },
    {
      id: "faqItem-konsultasjonstyper",
      order: 2,
      question: "Tilbyr dere videokonsultasjon i tillegg til klinikkbesøk?",
      answer: "Ja. Vi tilbyr klinikkbesøk, videokonsultasjon og hjemmebesøk, slik at du kan velge det som passer best for deg.",
    },
    {
      id: "faqItem-forste-konsultasjon",
      order: 3,
      question: "Hva skjer på den første konsultasjonen?",
      answer: "[Fyll inn faktisk beskrivelse av hva som skjer på første konsultasjon]",
    },
    {
      id: "faqItem-pris",
      order: 4,
      question: "Hva koster en konsultasjon?",
      answer: "[Fyll inn faktisk pris]",
    },
    {
      id: "faqItem-avbestille",
      order: 5,
      question: "Hvordan avbestiller eller endrer jeg timen min?",
      answer: "Ta kontakt på telefon +47 46384492 eller e-post mariekiropraktor@gmail.com, så hjelper vi deg med å endre eller avbestille timen.",
    },
    {
      id: "faqItem-henvisning",
      order: 6,
      question: "Trenger jeg henvisning fra lege?",
      answer: "[Fyll inn faktisk svar — trenger pasienten henvisning fra lege?]",
    },
  ];

  for (const item of items) {
    await client.createOrReplace({
      _id: item.id,
      _type: "faqItem",
      question: item.question,
      answer: [block(item.answer)],
      order: item.order,
    });
    console.log(`faqItem "${item.question}" opprettet/oppdatert`);
  }
}

async function seedPractitioner() {
  const photoAsset = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == "marie-portrait.jpg"][0]{_id}`,
  );
  if (!photoAsset) {
    throw new Error('Fant ikke bildeasset for "marie-portrait.jpg" i Sanity.');
  }

  const bioSection = await client.fetch(
    `*[_id == "pageSection-om-krystallsykehjelpen-moet-marie"][0]{body}`,
  );
  const bio = bioSection?.body ?? [
    block("Marie er kiropraktor med spesialisering i utredning og behandling av krystallsyke."),
  ];

  await client.createOrReplace({
    _id: "practitioner-marie-hermansen",
    _type: "practitioner",
    name: "Marie Hermansen",
    title: "Kiropraktor",
    clinicName: "Krystallsykehjelpen",
    address: "Garderbakken 1, Fetsund",
    phone: "+47 46384492",
    bookingUrl: "https://psno-patient-platform-fe.svc.pasientsky.no/embedded/planner/booking?serviceProviderId=54907264-049e-11eb-8fc8-26c6f94d64b7",
    // Geokodet og verifisert mot OpenStreetMap Nominatim for "Garderbakken 1,
    // Fetsund" (husnivå-presisjon). Sjekk visuelt på /finn-behandler/ at
    // kartnålen treffer riktig bygg før dette regnes som endelig bekreftet.
    latitude: 59.9281068,
    longitude: 11.1614349,
    bio,
    photo: {
      _type: "image",
      asset: { _type: "reference", _ref: photoAsset._id },
    },
  });
  console.log("practitioner \"Marie Hermansen\" opprettet/oppdatert");
}

async function run() {
  await seedFaqItems();
  await seedPractitioner();
  console.log("\nFerdig! FAQ-plassholdere og behandlerprofil lagt inn i Sanity.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
