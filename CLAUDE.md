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

- **Prosjekt-ID / dataset:** se `astro-site/.env` (`PUBLIC_SANITY_PROJECT_ID`,
  `PUBLIC_SANITY_DATASET=production`). Ikke hardkodet i kildekoden.
- **Config:** `astro-site/sanity.config.ts` (schema + structure),
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
- Bilder hentes som `mediaUrl` (rå Sanity CDN-URL via GROQ
  `mediaAsset.asset->url`) og brukes direkte som `src`, med samme fallback-
  mønster.
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
  sin hero-seksjon refererer til `/hero-home.jpg`, som ikke finnes i
  `public/`. Bildet vises derfor ikke — dette er ikke noe jeg har endret,
  bare noe jeg oppdaget. Si fra til Marie om hun vil ha et ekte bilde her.
- **Migreringsskript** (kjørt én gang, kan kjøres på nytt — de er
  idempotente og bruker faste dokument-ID-er):
  `astro-site/scripts/migrate-page-sections.mjs`.

## Fremtidig visjon (ikke prioritert ennå)
Terapeut-katalog med flere behandlere, AI-assistent-integrasjon, og
flerspråklig støtte. Ikke bygg dette med mindre Marie eksplisitt ber om det —
fokuser på kjernesiden.
