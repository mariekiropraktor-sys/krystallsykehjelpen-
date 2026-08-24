// Engangsskript: publiserer artikkelen "Kjenner du deg igjen? Er dette
// krystallsyke?" (fra /Users/marie/Downloads/artikkel-kjenner-du-deg-igjen.md)
// som et blogPost-dokument på /blogg/er-dette-krystallsyke/.
// Kjør med: node scripts/import-blogpost-er-dette-krystallsyke.mjs
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

function key() {
  return Math.random().toString(36).slice(2, 10);
}

// Enkel markdown-inline-parser: **fet** og *kursiv* -> portable text spans
// med strong/em-marks. Håndterer ikke nøstet/overlappende markup, men det
// trengs ikke for dette innholdet.
function parseInline(text) {
  const spans = [];
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of boldParts) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**")) {
      spans.push({ _type: "span", _key: key(), text: part.slice(2, -2), marks: ["strong"] });
      continue;
    }
    const italicParts = part.split(/(\*[^*]+\*)/g);
    for (const ip of italicParts) {
      if (!ip) continue;
      if (ip.startsWith("*") && ip.endsWith("*")) {
        spans.push({ _type: "span", _key: key(), text: ip.slice(1, -1), marks: ["em"] });
      } else {
        spans.push({ _type: "span", _key: key(), text: ip, marks: [] });
      }
    }
  }
  return spans;
}

function block(text, style = "normal") {
  return { _type: "block", _key: key(), style, children: parseInline(text) };
}

function bullet(text) {
  return { _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, children: parseInline(text) };
}

const body = [
  block("Har du opplevd at rommet plutselig begynner å snurre når du snur deg i sengen, bøyer deg ned eller ser opp? Det kan kjennes skremmende der og da – men for de aller fleste er det ikke farlig. Her går vi gjennom de mest typiske tegnene på krystallsyke, slik at du får en bedre formening om hva du kjenner på."),
  block("*Denne artikkelen erstatter ikke en undersøkelse, men kan hjelpe deg å forstå hva som bør avklares videre.*"),

  block("De vanligste tegnene på krystallsyke", "h2"),
  block("Krystallsyke, eller BPPV (godartet paroksysmal posisjonsvertigo), kjennetegnes gjerne av at:"),
  bullet('Svimmelheten kommer **plutselig** og oppleves som at rommet **snurrer** (rotatorisk svimmelhet), ikke bare "ustøhet"'),
  bullet("Den utløses av en **bestemt bevegelse** – å snu seg i sengen, legge seg ned, reise seg opp, bøye seg ned eller se opp"),
  bullet("Anfallet er **kortvarig**, som regel bare **noen sekunder til under ett minutt**"),
  bullet("Det roer seg raskt av seg selv når du holder hodet stille"),
  bullet("Du kan kjenne deg lettere kvalm eller uvel etter et anfall, selv om selve snurringen har gitt seg"),
  bullet("Det kommer ofte igjen ved samme type bevegelse, gjerne flere ganger daglig i perioder"),
  block("Kjenner du igjen flere av disse punktene, er det en god grunn til å få det undersøkt nærmere."),

  block("Hva krystallsyke *ikke* pleier å være", "h2"),
  block("Det kan også være nyttig å vite hva som **ikke** er typisk for krystallsyke:"),
  bullet("Svimmelhet som varer **kontinuerlig i timer eller dager**"),
  bullet("Svimmelhet som oppstår **uten sammenheng med bevegelse**"),
  bullet("Ledsagende symptomer som talevansker, kraftsvikt, dobbeltsyn, sterk hodepine eller nummenhet"),

  block("Når bør du oppsøke hjelp raskt?", "h2"),
  block("De fleste tilfeller av krystallsyke er ufarlige, men enkelte symptomer bør vurderes av lege eller legevakt samme dag:"),
  bullet("Plutselig og kraftig hodepine du ikke har hatt maken til før"),
  bullet("Talevansker, synsforstyrrelser eller nummenhet/kraftsvikt i ansikt eller kropp"),
  bullet("Svimmelhet som ikke bedrer seg og varer sammenhengende over lang tid"),
  bullet("Bevisstløshet eller kraftig oppkast i kombinasjon med svimmelheten"),
  block("Er du usikker, er det alltid bedre å ta kontakt enn å vente."),

  block("Hva skjer videre?", "h2"),
  block("Kjenner du deg igjen i beskrivelsen over, er neste steg gjerne en klinisk undersøkelse der man med enkle posisjonstester kan bekrefte om det faktisk er krystallsyke, og eventuelt hvilken buegang og side som er involvert. Det avgjør igjen hvilken manøver som er riktig for akkurat deg."),
];

async function run() {
  await client.createOrReplace({
    _id: "blogPost-er-dette-krystallsyke",
    _type: "blogPost",
    title: "Kjenner du deg igjen? Er dette krystallsyke?",
    slug: { _type: "slug", current: "er-dette-krystallsyke" },
    publishedDate: new Date().toISOString().slice(0, 10),
    excerpt: "Plutselig snurring når du beveger hodet? Se de vanligste tegnene på krystallsyke (BPPV) – og når du bør oppsøke hjelp raskt.",
    author: { _type: "reference", _ref: "practitioner-marie-hermansen" },
    body,
  });
  console.log('blogPost "Kjenner du deg igjen? Er dette krystallsyke?" opprettet/oppdatert');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
