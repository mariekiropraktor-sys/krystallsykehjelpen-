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
- Ingen eksisterende side er koblet til Sanity-data ennå — sidene i
  `src/pages/` viser fortsatt hardkodet tekst. Det er fase 2.
- **Kjent problem:** `astro-site/node_modules/` er per i dag innsjekket i
  git (9800+ filer). Det bør ryddes opp i (legg til i `.gitignore` er gjort,
  men historiske filer må fjernes med `git rm -r --cached`) — spør Marie før
  du gjør dette, det er en stor endring.

## Fremtidig visjon (ikke prioritert ennå)
Terapeut-katalog med flere behandlere, AI-assistent-integrasjon, og
flerspråklig støtte. Ikke bygg dette med mindre Marie eksplisitt ber om det —
fokuser på kjernesiden.
