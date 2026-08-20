// Engangsskript for fase 2: flytter eksisterende sidetekst (Hjem, Om
// Krystallsykehjelpen, Krystallsyken) inn i pageSection-dokumenter i Sanity.
// Kjør med: node scripts/migrate-page-sections.mjs
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

async function uploadImage(publicPath) {
  const filePath = path.resolve("public", publicPath);
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  return asset._id;
}

async function upsertSection({ pageSlug, sectionKey, heading, paragraphs, mediaType, imageAssetId }) {
  const doc = {
    _id: `pageSection-${pageSlug}-${sectionKey}`,
    _type: "pageSection",
    pageSlug,
    sectionKey,
    heading,
    body: (paragraphs ?? []).map(block),
    mediaType: mediaType ?? "ingen",
  };
  if (mediaType === "bilde" && imageAssetId) {
    doc.mediaAsset = { _type: "image", asset: { _type: "reference", _ref: imageAssetId } };
  }
  await client.createOrReplace(doc);
  console.log(`pageSection "${pageSlug}/${sectionKey}" opprettet/oppdatert`);
}

async function run() {
  console.log("Laster opp bilder...");
  const heroHjemImg = await uploadImage("hero-krystallsykehjelpen-finpusset.png");
  const earDiagramImg = await uploadImage("ear-diagram.jpg");
  const mariePortraitImg = await uploadImage("marie-portrait.jpg");
  console.log("Bilder lastet opp.\n");

  // --- Hjem ---
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "hero",
    heading: "Svimmel når du snur deg i sengen?",
    paragraphs: [
      "Krystallsyke (BPPV) er en av de vanligste årsakene til svimmelhet. Få grundig undersøkelse og målrettet behandling – i klinikken, hjemme hos deg, eller over telefon.",
    ],
    mediaType: "bilde",
    imageAssetId: heroHjemImg,
  });
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "hjelpe-deg",
    heading: "Slik kan vi hjelpe deg med krystallsyke",
    paragraphs: [],
  });
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "hva-skjer-i-oret",
    heading: "Hva skjer i øret?",
    paragraphs: [
      "I det indre øret har vi tre bueganger som registrerer bevegelse. I buegangene finnes det små krystaller (otolitter) som normalt sitter fast i et eget område.",
      "Når krystallene løsner og havner i en buegang, kan de gi signaler om bevegelse selv når du er i ro. Det er dette som skaper svimmelheten når du endrer stilling.",
    ],
    mediaType: "bilde",
    imageAssetId: earDiagramImg,
  });
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "ovelser",
    heading: "Les mer om våre vanligste øvelser",
    paragraphs: [
      "Vi viser eksempler på trygge og effektive øvelser du kan gjøre hjemme for å håndtere restsymptomer og forebygge tilbakefall.",
    ],
  });
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "faq",
    heading: "Vanlige spørsmål",
    paragraphs: [],
  });
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "viktig-a-vite",
    heading: "Viktig å vite",
    paragraphs: [
      "Krystallsyke gir vanligvis ikke svimmelhet når du går eller sitter i ro. Ved vedvarende svimmelhet bør andre årsaker vurderes.",
    ],
  });
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "marie-bio",
    heading: "Marie – spesialisert på svimmelhet",
    paragraphs: [
      "Kiropraktor med spesialkompetanse på utredning og behandling av svimmelhet og krystallsyke.",
    ],
    mediaType: "bilde",
    imageAssetId: mariePortraitImg,
  });
  await upsertSection({
    pageSlug: "hjem",
    sectionKey: "cta",
    heading: "Klar til å bli kvitt svimmelheten?",
    paragraphs: ["Bestill en time i dag – vi hjelper deg tilbake til en stødig hverdag."],
  });

  // --- Om Krystallsykehjelpen ---
  // NB: kildesiden refererer til "/hero-home.jpg", som ikke finnes i public/.
  // Ingen bilde lastet opp for denne seksjonen — se merknad i CLAUDE.md.
  await upsertSection({
    pageSlug: "om-krystallsykehjelpen",
    sectionKey: "hero",
    heading: "Om Krystallsykehjelpen",
    paragraphs: [
      "Vi finnes fordi svimmelhet ikke er én slags pasientgruppe. Her er fokuset smalt, behandlingen målrettet, og oppfølgingen personlig – ikke generell kiropraktikk.",
    ],
  });
  await upsertSection({
    pageSlug: "om-krystallsykehjelpen",
    sectionKey: "hvorfor-oss",
    heading: "Derfor finnes Krystallsykehjelpen",
    paragraphs: [
      "Vi er her fordi mange får feil eller for lite tydelig hjelp når svimmelhet behandles som generell kiropraktikk. Hos oss er krystallsyke og BPPV hovedfokuset, og det gir mer presis utredning og raskere bedring.",
    ],
  });
  await upsertSection({
    pageSlug: "om-krystallsykehjelpen",
    sectionKey: "slik-jobber-vi",
    heading: "Slik jobber vi",
    paragraphs: [
      "Vi tilbyr tre konsultasjonsformer som dekker behovet ditt, enten du er klar for klinikk eller trenger hjelp hjemme eller på skjerm.",
    ],
  });
  await upsertSection({
    pageSlug: "om-krystallsykehjelpen",
    sectionKey: "moet-marie",
    heading: "Personlig erfaring med svimmelhet",
    paragraphs: [
      "Marie er kiropraktor med spesialisering i utredning og behandling av krystallsyke. Hun kombinerer faglig trygghet med varme, tydelig veiledning og praktisk oppfølging.",
    ],
    mediaType: "bilde",
    imageAssetId: mariePortraitImg,
  });
  await upsertSection({
    pageSlug: "om-krystallsykehjelpen",
    sectionKey: "cta",
    heading: "Vil du vite om dette er riktig for deg?",
    paragraphs: [
      "Bestill en vurdering i dag, så får du hjelp til å finne ut om svimmelheten skyldes krystallsyke.",
    ],
  });

  // --- Krystallsyken ---
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "hero",
    heading: "Når verden plutselig snurrer",
    paragraphs: [
      "De fleste som får krystallsyke husker godt den første episoden. Kanskje snudde du deg i sengen en morgen og kjente at rommet begynte å spinne. Kanskje ble du svimmel da du så opp mot en hylle, eller bøyde deg ned for å knytte skoene. Opplevelsen kan være intens og skremmende — men krystallsyke er ufarlig, og en av de tilstandene hvor riktig behandling ofte gir rask bedring.",
    ],
    mediaType: "bilde",
    imageAssetId: earDiagramImg,
  });
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "hva-er-krystallsyken",
    heading: "Hva er krystallsyken?",
    paragraphs: [
      "Inne i det indre øret finnes små kalkkrystaller som normalt hjelper hjernen med å registrere hvordan hodet beveger seg. Hos noen løsner disse og havner i en av ørets tre buegang­er.",
      "Når du beveger hodet, sender krystallene feilsignaler til hjernen om at hodet roterer mer enn det faktisk gjør — det er dette som skaper følelsen av at rommet spinner.",
    ],
    // Video-seksjonen ved siden av er bevisst IKKE koblet til Sanity — se
    // merknad i CLAUDE.md. mediaType er derfor "ingen" her.
  });
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "hvorfor-far-man-det",
    heading: "Hvorfor får man det?",
    paragraphs: [
      "Krystallsyke kommer oftest uten noen åpenbar grunn, men noen faktorer gjør det mer sannsynlig: høy alder, hodeskader, andre øresykdommer, vitamin D-mangel og benskjørhet. Tilbakefall er vanlig, men de fleste har lange perioder uten plager mellom episodene.",
    ],
  });
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "symptomer",
    heading: "Symptomer",
    paragraphs: [
      "Krystallsyke gir gjerne kraftig, karusellaktig svimmelhet som kommer igjen ved bestemte bevegelser.",
    ],
  });
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "diagnose",
    heading: "Diagnose",
    paragraphs: [
      "Vi bruker Dix-Hallpike-testen for å avdekke nøyaktig hvilken buegang som er berørt, ved å observere øyebevegelsene dine i bestemte posisjoner.",
    ],
  });
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "behandling",
    heading: "Behandling",
    paragraphs: [
      "En spesifikk reponeringsmanøver geleider krystallene tilbake. De fleste opplever tydelig bedring etter én eller få behandlinger.",
    ],
  });
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "hvorfor-oss",
    heading: "Hvorfor Krystallsykehjelpen",
    paragraphs: [
      "Vi er spesielt interessert i nettopp krystallsyken og svimmelhet — ikke som en av mange ting vi behandler, men som vårt hovedfokus. Klinikk-, hjemme- eller telefonkonsultasjon i Fetsund.",
    ],
    mediaType: "bilde",
    imageAssetId: mariePortraitImg,
  });
  await upsertSection({
    pageSlug: "krystallsyken",
    sectionKey: "cta",
    heading: "Slipp svimmelheten",
    paragraphs: ["Klinikk-, hjemme- og telefonkonsultasjoner i Fetsund."],
  });

  console.log("\nFerdig! Sidetekst for Hjem, Om Krystallsykehjelpen og Krystallsyken er lagt inn i Sanity.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
