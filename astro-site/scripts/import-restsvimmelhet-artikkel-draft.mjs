// Engangsskript: importerer artikkelen "Fortsatt svimmel etter behandling av
// krystallsyke?" (restsvimmelhet-etter-krystallsyke) som en Sanity DRAFT
// (_id prefikset "drafts.") — IKKE et publisert dokument. Innhold hentet fra
// /Users/marie/Downloads/restsvimmelhet-mockup.html (godkjent av Marie som
// både innholds- og designreferanse, siden PDF-en aldri ble sendt over).
//
// Kjør med: node scripts/import-restsvimmelhet-artikkel-draft.mjs
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

function parseInline(text) {
  const spans = [];
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of boldParts) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**")) {
      spans.push({ _type: "span", _key: key(), text: part.slice(2, -2), marks: ["strong"] });
      continue;
    }
    spans.push({ _type: "span", _key: key(), text: part, marks: [] });
  }
  return spans;
}

function block(text, style = "normal") {
  return { _type: "block", _key: key(), style, children: parseInline(text) };
}

function faqItems(pairs) {
  return pairs.map(([question, answer]) => ({ _type: "articleFaqItem", _key: key(), question, answer }));
}

function sourceItems(items) {
  return items.map(([label, url]) => ({ _type: "source", _key: key(), label, url }));
}

function relatedItems(items) {
  return items.map(([title, url]) => ({ _type: "relatedLink", _key: key(), title, url }));
}

function imageRef(assetId) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

const body = [
  block(
    "Mange opplever rask bedring etter en reposisjoneringsmanøver som Epleys manøver. Hos noen forsvinner den typiske, stillingsutløste rotasjonssvimmelheten, mens en mer diffus svimmelhet eller ustøhet blir igjen i dagene eller ukene etterpå. Dette omtales ofte som restsvimmelhet.",
  ),

  block("Hva er restsvimmelhet etter krystallsyke?", "h2"),
  block(
    "Restsvimmelhet betyr at du fortsatt kjenner svimmelhet eller ustøhet etter at den typiske krystallsyken ser ut til å være behandlet. Ved aktiv krystallsyke kommer det vanligvis korte anfall med tydelig rotasjonssvimmelhet når hodet beveges i bestemte retninger. Ved restsvimmelhet er plagene gjerne mindre intense og mer diffuse.",
  ),
  block(
    "Du kan føle deg ustø når du går, bli svimmel ved hodebevegelser eller kjenne deg sliten og uklar i hodet. Noen blir også mer følsomme for mye bevegelse rundt seg, for eksempel i butikker, folkemengder eller foran en skjerm.",
  ),
  block("Restsvimmelhet betyr ikke automatisk at krystallene fortsatt er løse.", "blockquote"),

  block("Betyr det at behandlingen ikke virket?", "h2"),
  block(
    "Ikke nødvendigvis. Det første som bør avklares, er likevel om krystallsyken faktisk er borte. Noen ganger kan det fortsatt være krystallmateriale i buegangen, en annen buegang kan være påvirket, eller krystallsyken kan ha kommet tilbake.",
  ),
  block(
    "Dersom stillingstestene er negative og den typiske karusellsvimmelheten har forsvunnet, kan symptomene skyldes at balansesystemet fortsatt er i en tilpasningsfase. Det er derfor sjelden hensiktsmessig å fortsette med gjentatte manøvre uten tydelige holdepunkter for aktiv krystallsyke.",
  ),

  block("Hvorfor kan svimmelheten vare?", "h2"),
  block(
    "Balansen avhenger av et finstemt samarbeid mellom balanseorganene i det indre øret, synet, følesansen fra kroppen og hjernen. Mens krystallsyken pågår, mottar hjernen unormale signaler fra det påvirkede balanseorganet. Når krystallene flyttes tilbake, kan hjernen trenge tid på å justere seg til normale signaler igjen. Denne prosessen kalles vestibulær kompensasjon. Lite aktivitet og frykt for å bevege hodet kan hos noen forsinke denne tilpasningen.",
    "blockquote",
  ),

  block("Kan svimmelheten skyldes noe annet?", "h2"),
  block(
    "«Restsvimmelhet» beskriver hvordan du har det etter behandlingen, men sier ikke alltid hva som forårsaker symptomene. Krystallsyken kan være behandlet samtidig som en annen tilstand bidrar til plagene.",
  ),
  block("Vestibulær migrene", "h3"),
  block(
    "Vestibulær migrene kan gi svimmelhet, bevegelsesfølsomhet, ustøhet og ubehag i visuelt krevende omgivelser. Hodepine behøver ikke være til stede ved alle anfall. Diagnosen bygger på det samlede anfallsmønsteret og migrenehistorikken – ikke bare på vedvarende svimmelhet.",
  ),
  block("Cervikogen svimmelhet", "h3"),
  block(
    "Nakkeplager kan hos enkelte være forbundet med diffus svimmelhet, ustøhet eller desorientering, særlig når symptomene opptrer sammen med nakkesmerter, stivhet eller redusert bevegelighet. Diagnosen er omdiskutert og har ingen enkeltstående sikker test. Andre årsaker bør derfor vurderes før svimmelheten tilskrives nakken.",
  ),
  block("PPPD – vedvarende postural-perseptuell svimmelhet", "h3"),
  block(
    "En episode med krystallsyke kan hos noen utløse et mer langvarig mønster med ustøhet eller ikke-roterende svimmelhet. Symptomene er ofte tydeligere når man står eller går, beveger seg eller befinner seg i omgivelser med mye synsinntrykk. For at PPPD skal være aktuelt, skal symptomene blant annet ha vært til stede de fleste dager i minst tre måneder. Noen dagers eller ukers restsvimmelhet er derfor ikke det samme som PPPD.",
  ),
  block(
    "Flere årsaker kan opptre samtidig. En person kan ha fått behandlet krystallsyken, men samtidig ha vestibulær migrene, nakkeplager eller utvikle et vedvarende svimmelhetsmønster. Derfor er en ny og bredere vurdering viktig dersom symptomene ikke gradvis avtar.",
    "blockquote",
  ),

  block("Hva kan hjelpe mot restsvimmelhet?", "h2"),
  block("Kom gradvis tilbake til normal aktivitet", "h3"),
  block(
    "Etter en vellykket behandling er det vanligvis positivt å komme tilbake til vanlige aktiviteter. Gåturer og naturlige hodebevegelser gir hjernen informasjonen den trenger for å finjustere balansen. Du behøver normalt ikke holde hodet helt i ro eller unngå alle bevegelser som gir lett, kortvarig svimmelhet.",
  ),
  block("Tilpassede vestibulære øvelser", "h3"),
  block(
    "Ved vedvarende plager kan målrettede øvelser for blikkstabilitet, balanse, gange, hodebevegelser eller visuell bevegelsesfølsomhet være nyttige. Hvilke øvelser som passer, avhenger av hva undersøkelsen viser. Det finnes derfor ikke én standardøvelse som er riktig for alle. Se øvelsesbiblioteket for eksempler på vestibulær rehabilitering.",
  ),
  block("Informasjon og trygghet", "h3"),
  block(
    "Å vite at balansesystemet kan bruke tid på å normalisere seg, kan gjøre det lettere å bevege seg naturlig igjen. Dette betyr ikke at symptomene er psykiske eller innbilte. Stress og bekymring kan likevel forsterke svimmelheten og bidra til bevegelsesunngåelse.",
  ),

  block("Når bør du undersøkes på nytt?", "h2"),
  block(
    "Bestill en ny vurdering dersom den kraftige, stillingsutløste svimmelheten fortsetter, symptomene ikke gradvis bedres, svimmelheten endrer karakter eller du får nye hørselsplager, falltendens eller tydelige migrenetrekk.",
  ),

  block("Oppsummering", "h2"),
  block(
    "Restsvimmelhet etter krystallsyke er ikke uvanlig og betyr ikke automatisk at behandlingen har mislyktes. Hos mange trenger hjernen og balansesystemet litt tid og bevegelse for å finne tilbake til normal funksjon. Ved vedvarende plager bør man kontrollere at krystallsyken er borte og vurdere andre mulige forklaringer, som vestibulær migrene, cervikogen svimmelhet eller PPPD.",
  ),
];

// Interne lenker limt inn direkte i utvalgte setninger over ville krevd
// lenker inni portable text-spans (ikke støttet av dagens enkle
// body-renderer, se src/lib/portableText.ts). De bekreftede interne
// lenkene er derfor lagt til som relatedLinks i stedet — se under.
// Umulig-å-bekrefte mål (vestibulær migrene, cervikogen svimmelhet, PPPD,
// VNG-undersøkelse som egne sider) er bevisst latt ulinket i teksten over,
// slik prompten ba om.

const doc = {
  _id: "drafts.blogPost-restsvimmelhet-etter-krystallsyke",
  _type: "blogPost",
  title: "Fortsatt svimmel etter behandling av krystallsyke?",
  slug: { _type: "slug", current: "restsvimmelhet-etter-krystallsyke" },
  category: "Krystallsyke og restsymptomer",
  metaTitle: "Fortsatt svimmel etter krystallsyke? | Restsvimmelhet",
  metaDescription:
    "Fortsatt svimmel etter behandling av krystallsyke? Les om restsvimmelhet, mulige årsaker, hva som kan hjelpe og når du bør undersøkes på nytt.",
  excerpt:
    "Den kraftige karusellfølelsen er borte, men du kjenner deg fortsatt ustø, svimmel eller «rar i hodet». Det kan være restsvimmelhet – og betyr ikke nødvendigvis at behandlingen har mislyktes.",
  body,
  warningBox:
    "Ved nye nevrologiske symptomer som dobbeltsyn, talevansker, kraftsvikt, uttalt koordinasjonssvikt eller ny og kraftig hodepine bør du søke akutt medisinsk hjelp.",
  faq: faqItems([]),
  sources: sourceItems([
    [
      "Fagfellevurdert oversiktsartikkel om restsvimmelhet etter BPPV, Frontiers in Neurology (2024), narrativ gjennomgang.",
      "https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2024.1382196/full",
    ],
  ]),
  relatedLinks: relatedItems([
    ["Hovedartikkelen om krystallsyke", "/krystallsyken/"],
    ["Epleys manøver", "/ovelsesbibliotek/bakre-buegang/"],
    ["Vestibulære øvelser og rehabilitering", "/ovelsesbibliotek/vestibular-rehab/"],
    ["Svimmel når du snur deg i sengen?", "/blogg/svimmel-nar-du-snur-deg-i-sengen/"],
  ]),
  coverImage: imageRef("image-22b644d6e466138109c17db6f59681d0fb28e566-1400x787-png"),
  author: { _type: "reference", _ref: "practitioner-marie-hermansen" },
  publishedDate: "2026-08-26",
};

async function run() {
  await client.createOrReplace(doc);
  console.log(`DRAFT opprettet: "${doc.title}" (${doc._id})`);
  console.log("Kun synlig lokalt via `npm run dev` (blogPreviewClient) — ikke publisert, ikke i produksjon.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
