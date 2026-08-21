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
(konseptet — ny side), Krystallsyken (med FAQ-accordion), Øvelsesbibliotek,
Kontakt, Behandlere/Finn behandler (med Leaflet-kart og terapeutprofiler).

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
