# Krystallsykehjelpen — prosjektkontekst

## Om prosjektet
Nettside for Krystallsykehjelpen, en klinikk i Fetsund drevet av kiropraktor
Marie Hermansen, spesialisert utelukkende på krystallsyke (BPPV) og svimmelhet
— ikke generell kiropraktikk. Marie er nybegynner innen webutvikling, så
forklar endringer enkelt og steg for steg når hun spør om noe teknisk.

Tre konsultasjonstyper er kjernen i tjenestetilbudet:
- Klinikkbesøk
- Videokonsultasjon
- Hjemmebesøk

Språk: All kode-kommentarer og UI-tekst skal være på **norsk** (bokmål).
Kommuniser med Marie på norsk.

## Tech stack
- **Astro** (framework)
- **Vercel** (deployment via GitHub-integrasjon, automatisk ved push til main)
- **GitHub Desktop** for versjonskontroll (ikke ren git CLI med mindre nødvendig)
- **Leaflet** for interaktivt kart på Behandlere/Finn behandler-siden
- Booking skjer via ekstern **Pasientsky**-URL (ikke bygg egen booking-logikk)

## Prosjektstruktur
```
astro-site/
├── public/          # bilder: hero-home.jpg, marie-portrait.jpg, ear-diagram.jpg, logo.png
├── src/
│   ├── components/
│   ├── layouts/      # Layout.astro (hoved-layout)
│   ├── pages/         # hver side som egen .astro-fil eller undermappe/index.astro
│   └── styles/
```

Eksisterende sider: Hjem, Om oss (Marie personlig), Om Krystallsykehjelpen
(konseptet), Krystallsyken (med FAQ-accordion), Kontakt, Øvelsesbibliotek
(oversikt + kategori- + øvelsesside, Sanity-drevet), Blogg (oversikt +
enkeltinnlegg, Sanity-drevet), FAQ (egen side på `/faq/`, Sanity-drevet),
Finn behandler (med Leaflet-kart og terapeutprofiler, Sanity-drevet).

## Designsystem — "helsenettside-blå"
Navy/turkis-palett. IKKE bruk mørkegrønn/minimalistisk stil — det ble forkastet
tidlig i prosjektet til fordel for denne paletten.

**Farger:**
- `--navy`: #163875
- `--navy-2`: #1e4c96
- `--sky`: #eff4fb
- `--accent`: #2f79c9
- `--beige`: #f4eee3

**Fonter:**
- Fraunces (display/overskrifter)
- Public Sans (brødtekst)

**Motiver/komponenter som går igjen:**
- Wave-shaped hero-dividere mellom seksjoner
- Sirkulære ikonmotiver
- Kortkomponenter med skygge
- Beige CTA-bånd nederst på sider

Når du bygger noe nytt: se alltid på en eksisterende side (f.eks.
krystallsyken.astro) og gjenbruk klassenavn/komponenter i stedet for å finne
opp nye stilkonvensjoner.

## Kontaktinfo (til bruk i CTA-er, footer, kontaktskjema)
- E-post: mariekiropraktor@gmail.com
- Telefon: +47 46384492
- Adresse: Garderbakken 1, Fetsund

## Viktige arbeidsvaner
- Gjenbruk alltid eksisterende Header.astro og Footer.astro — ikke dupliser.
- Ny side skal legges i src/pages/ og navigasjonslenke legges til i
  Header.astro (og Footer.astro der det er naturlig).
- Kjør gjerne en rask sjekk for syntaksfeil i endrede/nye .astro-filer før du
  sier deg ferdig.
- Marie foretrekker at du forklarer i klartekst hva som er endret/opprettet
  (f.eks. en kort liste) fremfor bare å vise diff.
- Live URL: krystallsykehjelpen-3934.vercel.app — en eldre Vercel-deploy
  (krystallsykehjelpen-i3ij.vercel.app) er utdatert og skal etter hvert slettes.

## Sanity CMS (fase 1 — oppsett fullført)
Sanity er satt opp som headless CMS, embeddet på `/admin`-ruten i Astro-
prosjektet (ikke egen app/port). Studio kjører som en React-øy via
`@sanity/astro` + `@astrojs/react` (låst til `@astrojs/react@3.6.2` — v4+
krever Astro 5 og gir kompileringsfeil på denne Astro 4-versjonen).

- **Prosjekt-ID / dataset:** `b1cmdslc` / `production`. Ligger i
  `astro-site/.env` (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`) for
  Astro/Vite-siden, **og** hardkodet i `astro-site/sanity.config.ts` og
  `astro-site/sanity.cli.ts` (se fase 3-notatet under for hvorfor — dette er
  ikke hemmeligheter, de bakes uansett inn i klientkoden).
- **Config:** `astro-site/sanity.config.ts` (schema + structure),
  `astro-site/sanity.cli.ts` (brukes av Sanity CLI, f.eks. `sanity deploy`),
  `astro-site/src/sanity/schemaTypes/` (ett skjema per fil),
  `astro-site/src/sanity/structure.ts` (menygruppering i Studio).
- **Skjemaer:** `siteSettings` (singleton), `pageSection`, `exerciseCategory`,
  `exercise`, `blogPost`, `faqItem`, `practitioner`.
- **Seed-skript:** `astro-site/scripts/seed.mjs` (kjør med `npm run seed`)
  legger inn plassholderinnhold — brukes `SANITY_API_WRITE_TOKEN` fra `.env`
  (kun server-side, aldri eksponert til klienten).
## Sanity CMS (fase 2 — Hjem, Om Krystallsykehjelpen og Krystallsyken koblet til)
Sidetekst (overskrift + brødtekst + hovedbilde) på **Hjem**, **Om
Krystallsykehjelpen** og **Krystallsyken** hentes nå fra Sanity sine
`pageSection`-dokumenter i stedet for å være hardkodet.

- **Hvordan det henger sammen:** hver `.astro`-side kaller
  `getPageSections(pageSlug)` fra `astro-site/src/lib/pageSections.ts` i
  frontmatter. Den returnerer et objekt nøkkelet på `sectionKey`
  (`sections["hero"]`, `sections["cta"]`, osv.). I malen brukes
  `sections.hero?.heading ?? "fallback-tekst"` — **fallback-teksten i koden
  er identisk med det som ligger i Sanity ved migreringen**, så hvis et
  dokument mangler eller Sanity er utilgjengelig, vises siden akkurat som før
  i stedet for å krasje eller vise tomt innhold.
- Brødtekst er portable text (for å støtte fet/kursiv), rendret med
  `inlineHtmlFromBlock()` fra `astro-site/src/lib/portableText.ts` — en liten
  egenskrevet renderer (ingen ekstern avhengighet), som output­er inline
  HTML uten å legge til noen ekstra wrapper-elementer i DOM-en.
- **Bilder — riktig mønster (se fase 2.1-notatet under for full historikk):**
  hent det rå `mediaAsset`-feltet fra GROQ (ikke dereferer det med `->`), og
  bygg URL-en med `urlForImage(source, width)` fra
  `astro-site/src/lib/sanityImage.ts` (wrapper rundt `@sanity/image-url`).
  Gir automatisk størrelsesbegrensning + moderne bildeformat. Samme
  fallback-mønster: `urlForImage(...) ?? "/lokalt-fallback-bilde.jpg"`.
- **Nytt innhold legges til slik:** lag et nytt `pageSection`-dokument i
  Studio med riktig `pageSlug` + `sectionKey`, så plukkes det automatisk opp
  — ingen kodeendring nødvendig, så lenge `sectionKey` matcher det siden ser
  etter.
- **Bevisste avgrensninger** (ikke migrert til Sanity, fortsatt hardkodet i
  koden — dette er components/spesialstrukturer, ikke ren sidetekst):
  - FAQ-spørsmålene på Hjem (egen `faq`-array i `index.astro`) og
    symptomkortene + rødt-flagg-boksen på Krystallsyken.
  - De tre hjelpe-kortene (Undersøkelse/Hjemmebesøk/Video) på Hjem, og
    konsultasjons­kortene på Om Krystallsykehjelpen.
  - Hero-videoen på Krystallsyken (`/videos/krystallsyke animasjon.mp4`) —
    bevisst IKKE koblet til Sanity, kun heading/body-teksten ved siden av.
    Video-attributter (autoplay/muted/loop) er urørt.
- **Kjent, ikke-relatert feil (fantes før fase 2):** Om Krystallsykehjelpen
  sin hero-seksjon har ingen lokal fallback — `/hero-home.jpg` finnes ikke i
  `public/`. Koden er nå koblet til Sanity (se fase 2.1 under), så bildet
  vises så snart et bilde er lastet opp der i Studio. Inntil da er den ene
  gjenværende broken image-en på siden.
- **Migreringsskript** (kjørt én gang, kan kjøres på nytt — de er
  idempotente og bruker faste dokument-ID-er):
  `astro-site/scripts/migrate-page-sections.mjs`.

## Sanity CMS (fase 2.1 — bilder fra Sanity, feilsøking og fiks)
Etter fase 2 viste tekst seg korrekt, men bilder gjorde det ikke overalt. To
reelle bugs ble funnet og fikset:

1. **Om Krystallsykehjelpen sin hero-seksjon var aldri koblet til Sanity for
   bilde** — `<img>`-taggen var hardkodet til `/hero-home.jpg` (en fil som
   ikke finnes), en glipp fra fase 2 siden originalsiden ikke hadde noe gyldig
   lokalt bilde å migrere. Nå bruker den `urlForImage(sections.hero?.mediaAsset, 1200)`
   som resten av sidene.
2. **`hjem`/øvelser-seksjonen** hadde et opplastet bilde i Sanity, men koden
   rendret alltid en hardkodet plassholder-`<div>` ("Øvelsesbilde") — aldri et
   `<img>`. Nå vises et ekte bilde når et er satt, ellers samme plassholder
   som før.

**Standard bildemønster innført** (bruk dette i fase 3 for Øvelsesbibliotek/
Blogg også):
- GROQ: hent `mediaAsset` rått — ikke `mediaAsset.asset->url`.
- Rendring: `urlForImage(section?.mediaAsset, bredde) ?? "fallback"`, fra
  `astro-site/src/lib/sanityImage.ts`. `bredde` bør matche ca. 2x den faktiske
  CSS-visningsstørrelsen (retina). `@sanity/image-url` er en direkte
  avhengighet nå (brukes med named export `createImageUrlBuilder`, ikke
  default-export — default er deprecated).
- **Studio-fallgruve å vite om:** `mediaAsset`-feltet er skjult i Studio helt
  til `mediaType` er satt til "Bilde" (se `pageSection.ts`-skjemaet). Hvis et
  bilde "ikke lar seg laste opp" — sjekk at Medietype er endret til "Bilde"
  først, feltet dukker opp automatisk etter det.

## Sanity CMS (fase 3 — Øvelsesbibliotek, Blogg, FAQ, Finn behandler bygget)
De fire gjenstående sidene er bygget og koblet til Sanity-innholdet fra
fase 1 (`exerciseCategory`, `exercise`, `blogPost`, `faqItem`, `practitioner`).

**Nye ruter:**
- `/ovelsesbibliotek/` → `/ovelsesbibliotek/[kategori-slug]/` →
  `/ovelsesbibliotek/[kategori-slug]/[øvelse-slug]/` (to nivåer nøstet
  dynamisk routing via `getStaticPaths()`).
- `/blogg/` → `/blogg/[slug]/`.
- `/faq/` — egen side (se under for hvorfor).
- `/finn-behandler/` — behandlerkort + Leaflet-kart.

**Gjenbrukte mønstre** (samme som fase 2 — se over): `getPageSections()` for
hero-seksjoner (gyldig for `ovelsesbibliotek`, `blogg`, `finn-behandler` —
disse pageSlug-verdiene fantes allerede i skjemaet), `inlineHtmlFromBlock()`
for portable text, `urlForImage()` for bilder. Ny delt hjelper:
`astro-site/src/lib/safeFetch.ts` — samme try/catch-fallback-mønster som
`getPageSections()`, brukt av alle nye siders egne GROQ-spørringer.

**FAQ er et unntak fra hero-mønsteret:** `pageSection` sin `pageSlug`-liste
har ingen `"faq"`-verdi (og skjemaet skal ikke utvides), så `/faq/` har en
enkel hardkodet `<h1>` — selve spørsmålene kommer fortsatt fra `faqItem`.

**Ny render-mønster: fil-type media med MIME-sjekk** (kun `exercise.mediaFile`
— omdøpt fra `videoOrImage` i fase 3.1, se under — siden det er en generisk
`file`-type, ikke `image`) — hent `mediaFile{ asset->{ url, mimeType } }` i
GROQ (ikke `urlForImage()`, den virker bare på `image`-typede felt), og
grener i malen på `mimeType?.startsWith("video/")` for å vise `<video>` vs.
`<img>`. **Denne noten gjelder fortsatt fase 3.1 sitt reviderte skjema —
øvelsesinnholdet beskrevet i resten av dette fase 3-avsnittet (3 enkle
plassholderøvelser) er erstattet, se fase 3.1.**

**Ny navigasjon:** "Ressurser"-dropdown i Header.astro (FAQ + Blogg, hover +
klikk + `:focus-within` på desktop, kun klikk under 860px) — nøstet inni
eksisterende `#nav-links`, rører ikke hamburger-toggle-logikken. Footer.astro
har 4 kolonner nå (ny "Ressurser"-kolonne). Finn behandler har egen topplenke
i begge.

**Leaflet-kartet på Finn behandler** (`npm install leaflet`, vanlig JS — ikke
`react-leaflet`, matcher kodebasens vanilla-JS-konvensjon):
- CSS importeres i frontmatter: `import "leaflet/dist/leaflet.css"`.
- JS-import (`import L from "leaflet"`) må ligge i en ekte `<script>`-tag,
  IKKE i en `define:vars`-script — da bundler ikke Vite `import`-setningen.
- Behandler-koordinater sendes til scriptet via en `data-points`-attributt
  (JSON, `JSON.parse`'es i scriptet) — ikke via `define:vars`.
- Egendefinert SVG-markørikon (data-URL, navy/turkis) i stedet for Leaflets
  standardikon — unngår et kjent bundler-stiproblem med standardikonet.
- `.map`-containeren MÅ ha eksplisitt CSS-høyde, ellers renders ingenting.
- Bruker `tile.openstreetmap.org` (gratis demo-lag) — fint for lav trafikk nå,
  men bør byttes til en ordentlig tile-leverandør (f.eks. MapTiler/Stadia
  Maps) hvis trafikken vokser.

**Seed-skript:** `astro-site/scripts/seed-faq-og-behandler.mjs` — la inn 6
`faqItem`-plassholdere (pris og henvisningskrav er bevisst ikke fylt inn,
disse faktaene finnes ikke noe sted i prosjektet ennå) og ett
`practitioner`-dokument for Marie (gjenbruker godkjent bio-tekst fra
`pageSection-om-krystallsykehjelpen-moet-marie` og det allerede opplastede
`marie-portrait.jpg`-bildet — ingen ny tekst/bilde diktet opp).

**Viktig å sjekke:** `practitioner`-dokumentets `latitude`/`longitude`
(59.9281068, 11.1614349) er geokodet for "Garderbakken 1, Fetsund" via
OpenStreetMap Nominatim og uavhengig verifisert under bygging (husnivå-
presisjon) — men se selv på kartet på `/finn-behandler/` og bekreft at nålen
treffer riktig bygg.

## Sanity CMS (fase 3.1 — øvelsesdetaljsider: reponering vs. habituering)
Øvelsesbiblioteket fikk en betydelig større datamodell og to distinkte
sidemaler, basert på ekte øvelsesinnhold Marie selv har forfattet (16
øvelser, ikke plassholdere) og to godkjente HTML-mockuper.

**Strukturen er to hovedgrener, ikke tre-kategorier-pluss-en-fjerde:**
- **Reponeringsøvelser** — de tre buegang-kategoriene som før
  (`exerciseCategory`-referanse: Bakre/Horisontale/Øvre buegang — merk:
  JSON-kildedataen kaller den tredje "fremre", samme buegang som "Øvre" i
  skjemaet, bevisst forskjellig terminologi, samme anatomiske struktur).
- **Habitueringsøvelser** — buegang-uavhengige (`canal`/`category` er tomme
  for disse), delt i to seksjoner: "Vestibulær rehabilitering" (Brandt-
  Daroff, Cawthorne-Cooksey, Blikkstabilisering) og "Balansetrening og råd"
  (Balansetrening stående, Gradvis eksponering, Gode vaner, Fallforebygging).
  Seksjonene er **ikke egne Sanity-dokumenter** — kun en fast verdiliste
  (`habitueringSeksjon`-feltet), definert ett sted:
  `astro-site/src/lib/habitueringSections.ts`, importert av alle tre
  Øvelsesbibliotek-sidene (unngår tre kopier av samme data).

**`exercise`-skjemaet er betydelig utvidet** (`astro-site/src/sanity/schemaTypes/exercise.ts`):
`exerciseType` (reponering/habituering), `format` (steps/read — styrer hvilken
mal siden rendres med), `category` + `canal` (nå **betinget påkrevd**, kun for
`exerciseType: "reponering"`, via `Rule.custom` — ikke `Rule.required()`,
siden habitueringsøvelser bevisst skal stå uten), `side`, `habitueringSeksjon`
(motsatt betinget krav), `duration`, `stepCount`, `mediaType` (beskrivende,
styrer ikke selve filen), `lead`, `safetyNote`, `steps` (**nå objekter** —
`{title, description, holdTime, image}` — ikke lenger rene strings), `aftercare`,
`content` (heading+text-par, for les-format), `adviceList` (title+description,
for les-format), `tip`, `relatedExercises` (referanser til andre `exercise`-
dokumenter), `mediaFile` (omdøpt fra `videoOrImage`). Feltene er gruppert i
Studio (Grunnleggende/Steg-innhold/Lesestoff) siden dokumentet har mange felt.

**To sidemaler i samme fil** (`[categorySlug]/[exerciseSlug]/index.astro`),
grenet på `exercise.format`:
- **`"steps"`** (reponeringsmanøvre + noen habitueringsøvelser): sikkerhets-
  boks → nummererte trinn (holdetid-badge + valgfritt per-trinn-bilde) →
  "etter øvelsen"-boks.
- **`"read"`** (rene råd-artikler): innholdsblokker (overskrift+tekst) →
  rådliste (ikon+tittel+beskrivelse) → tips-boks.

Begge deler: brødsmulesti, hero med badges (type/gruppe/side, SVG-ikoner —
**ikke emoji**, bevisst avklart med Marie siden emoji ikke passer tonen på et
helsenettsted) + meta-rad, relatert-grid, og en **konturert/avrundet CTA-boks
begrenset til lesebredden** (680–760px) — **bevisst IKKE full bredde** som
CTA-seksjonene ellers på siten, siden disse er artikkelsider, ikke
landingsside-seksjoner. Media-fallback: steg-format viser alltid
`MediaPlaceholder` hvis `mediaFile` mangler; les-format viser ingenting
(bildeboksen der er valgfri, ikke et fast element).

**Kjent Astro-fallgruve:** `getStaticPaths()` kan ikke pålitelig lukke over
en top-level `const` deklarert i samme `.astro`-fil (kjøres isolert fra
resten av modulen). Løsning: flytt delt statisk data til en egen `.ts`-modul
og importer den — se `habitueringSections.ts`-mønsteret over.

**Importskript:** `astro-site/scripts/import-ovelser.mjs` — leser
`/Users/marie/Downloads/ovelse-detaljsider-seed-data.json`, sletter de 3
tynne fase-1-plassholderne (gamle Epley/Lempert/Yacovino-ID-er) og oppretter
alle 16 nye dokumenter. **To runder** for `relatedExercises`: første runde
oppretter alle dokumenter UTEN relasjoner, andre runde patcher inn
referansene — nødvendig fordi Sanity håndhever referanseintegritet, og
søsken-dokumenter som refererer til hverandre ikke kan opprettes i én
sekvensiell omgang.

## Sanity CMS (fase 3.2 — rike fagartikler + draft-forhåndsvisning)
**VIKTIG: Sanity→Vercel-deploywebhook finnes.** Å opprette et *publisert*
Sanity-dokument trigger automatisk en live Vercel-deploy — ikke bare
`git push`. Dette prosjektet har derfor en egen mekanisme for å bygge og
forhåndsvise innhold LOKALT før noe blir publisert/live.

**`blogPost`-skjemaet utvidet** med felt som trengs for fagartikler:
`category` (fritekst-badge), `shortSummary` ("Kort fortalt"-boks, adskilt
fra `excerpt`), `warningBox` (rød faresignalboks, samme stil som
`.red-flag` på Krystallsyken-siden), `faq` (array av spørsmål/svar —
per-artikkel, ikke det globale `faqItem`), `sources` (kildeliste med
URL), `relatedLinks` (array av `{title, url}` — **kun manuelt kuraterte,
reelle interne URL-er**, ikke Sanity-referanser, siden mål kan være enten
andre `blogPost`-er eller helt andre sidetyper som `/ovelsesbibliotek/...`),
`metaTitle`/`metaDescription` (SEO-overstyring, faller tilbake til
`title`/`excerpt` hvis tomme).

**Draft-forhåndsvisning** (`astro-site/src/lib/blogPreviewClient.ts`):
- Upublisert innhold opprettes som Sanity **drafts** (`_id` prefikset
  `"drafts."`, via `client.createOrReplace`) — usynlige for det vanlige
  offentlige API-et (`sanity:client`, ingen auth-token) og trigger derfor
  IKKE deploy-webhooken.
- `blogPreviewClient` er en egen, autentisert klient med
  `perspective: "drafts"`, som **kun aktiveres når `import.meta.env.DEV`
  er sann OG `SANITY_API_WRITE_TOKEN` finnes lokalt** — ellers faller den
  tilbake til den vanlige offentlige klienten. Siden skrivetokenet kun
  finnes i `.env` (aldri committet, aldri satt på Vercel), ser en faktisk
  build/deploy alltid kun publiserte dokumenter — verifisert direkte med
  `npm run build` (drafts genererte ingen sider).
- **Kjent fallgruve løst:** tokenet må leses med Vite sin `loadEnv()`
  (samme mønster som i `astro.config.mjs`), IKKE `process.env` direkte —
  Vite populerer *ikke* `process.env` fra `.env` automatisk for
  SSR-moduler, kun `import.meta.env` for `PUBLIC_`-prefikserte variabler.
- Både `blogg/index.astro` og `blogg/[slug]/index.astro` bruker
  `blogPreviewClient` (også i `getStaticPaths()`, ellers får ikke
  draft-artiklene noen rute i det hele tatt) og viser et gult
  "Forhåndsvisning"-bånd øverst når drafts vises.
- **Slik publiserer du en artikkel:** i Sanity Studio, åpne dokumentet og
  trykk "Publish" — det flytter det fra `drafts.xxx` til `xxx` og gjør det
  synlig for det offentlige API-et (trigger webhooken/deploy). Ikke gjør
  dette før artikkelen er godkjent i lokal forhåndsvisning.

**Nye `portableText.ts`-hjelpere:** `blocksToHtml()` setter nå `id`
(slugifisert) på h2/h3 for ankerlenker; `extractHeadings()` bygger en
innholdsfortegnelse fra body sine h2-er (driver den sticky TOC-en på
desktop); `estimateReadingTime()` regner ut lesetid fra ordantall
(~200 ord/min) — lagres ikke som eget felt.

**5 fagartikler importert som drafts**
(`astro-site/scripts/import-blogg-5-artikler-drafts.mjs`), fra
`Krystallsykehjelpen-blogg-prompt-KLAR.md`. **Bilder mangler** — den
lovede assets-mappen fantes ikke i overføringen, `coverImage` står tomt
og `MediaPlaceholder` vises. Koble på ekte bilder når Marie ettersender
dem. **Ca. halvparten av kildepromptens "Relaterte artikler"-lenker pekte
til sider som ikke finnes** (Restsvimmelhet, VNG-undersøkelse, egen
PPPD-/vestibulær migrene-forklaringsside, "Hvorfor blir man svimmel?") —
disse ble bevisst droppet (ikke gjettet URL-er), og erstattet med
kryss-lenker mellom de 5 nye artiklene + reelle eksisterende sider
(`/krystallsyken/`, `/ovelsesbibliotek/bakre-buegang/`,
`/ovelsesbibliotek/horisontale-buegang/`, `/ovelsesbibliotek/vestibular-rehab/`).
Disse 5 manglende sidene er en reell innholds-gap å vurdere for en senere
runde.

## Kontakt oss-siden (`/kontakt/`) bygget
Hero + 3 kontaktkort (fra `siteSettings` — telefon/e-post/adresse, gjenbruk,
ingen nye Sanity-felt) + to-kolonne skjema/kart + beige CTA-bånd med
krystall-signatur-SVG. Sidetekst (hero/skjema/kart/cta) er `pageSection`-
dokumenter på `pageSlug: "kontakt-oss"`.

- **Kart:** gjenbruker samme Leaflet/OpenStreetMap-mønster som
  `/finn-behandler/` (samme geokodede posisjon for Garderbakken 1) — bevisst
  valgt fremfor Google Maps-embed (som prompten opprinnelig ba om), siden det
  unngår en ny API-nøkkel-avhengighet og allerede er verifisert fungerende.
- **Skjema:** Web3Forms, ingen egen backend. Krever
  `PUBLIC_WEB3FORMS_KEY` i `.env` — **Marie må selv opprette gratis konto på
  web3forms.com og legge inn nøkkelen**. Så lenge feltet er tomt viser
  skjemaet en tydelig melding i stedet for å feile stille.
- **`.env.example` lagt til** (fantes ikke fra før) — dokumenterer alle
  env-variabler prosjektet bruker, uten faktiske verdier. `.gitignore` hadde
  allerede riktig `!.env.example`-unntak fra fase 1.
- E-post i `siteSettings` (`mariekiropraktor@gmail.com`) beholdt som den var
  — en oppdatert kontakt-oss-prompt foreslo `admin@krystallsykehjelpen.no`,
  men Marie bekreftet at gjeldende adresse er riktig.

## Sanity Studio — to steder å redigere innhold
Studio finnes nå to steder, med samme innhold (samme prosjekt/dataset):

- **Lokalt på `/admin`** — krever at `npm run dev` kjører på Maries egen
  maskin. Embeddet i Astro-prosjektet, se fase 1-notatet over.
- **Hostet på https://krystallsykehjelpen.sanity.studio** — fungerer alltid,
  uavhengig av om dev-serveren kjører. Åpnes i nettleseren og ber om innlogging
  med samme Sanity-konto (Google) som ble brukt ved oppsett. Deployet med
  `npx sanity deploy` fra `astro-site/`-mappen; app-ID og prosjekt-ID ligger i
  `astro-site/sanity.cli.ts`.
- **Hvorfor `sanity.config.ts` nå har hardkodet projectId/dataset:**
  `sanity deploy` laster `sanity.config.ts` direkte (utenom Vite), så
  `import.meta.env.PUBLIC_*` var `undefined` i den konteksten og feilet
  schema-verifiseringen. Hardkoding løser det uten å påvirke `/admin`
  (som fortsatt fungerer via Vite/Astro som før).
- For å deploye på nytt etter skjemaendringer: `npx sanity deploy` fra
  `astro-site/`.

## Fremtidig visjon (ikke prioritert ennå)
Terapeut-katalog med flere behandlere, AI-assistent-integrasjon, og
flerspråklig støtte. Ikke bygg dette med mindre Marie eksplisitt ber om det —
fokuser på kjernesiden.
