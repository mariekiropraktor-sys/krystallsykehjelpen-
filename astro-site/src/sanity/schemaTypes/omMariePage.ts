import { defineField, defineType } from "sanity";

// Singleton-dokument for de biografiske/faglige tekstblokkene på
// /mott-marie/ (Om Marie-siden). Samme mønster som hjemmePage.ts: ett fast
// dokument, initialValue satt til Maries godkjente tekst, slik at siden
// viser riktig innhold selv om dokumentet aldri opprettes/publiseres i
// Studio — se safeFetch-fallback i src/pages/mott-marie/index.astro, som
// bruker nøyaktig samme tekst.
//
// Hero-overskrift, ingress, CTA-tekster og bildene (portrett, løping, hest,
// hund) forblir i kode/public/ — kun historie- og fagfelt-tekstene under er
// Sanity-styrt.

export default defineType({
  name: "omMariePage",
  title: "Om Marie-siden",
  type: "document",
  fields: [
    defineField({
      name: "storyParagraph1",
      title: "Historie — avsnitt 1",
      type: "text",
      rows: 4,
      initialValue:
        "Jeg er kiropraktor med over ti års erfaring, og driver Fetsund Kiropraktorsenter, som jeg startet i 2019. I praksisen min møter jeg hver uke pasienter med krystallsyke (BPPV), vestibulær migrene, PPPD og nakkerelatert svimmelhet — tilstander som ofte er invalidiserende, men som i de fleste tilfeller kan behandles effektivt når de blir riktig kartlagt.",
    }),
    defineField({
      name: "storyParagraph2",
      title: "Historie — avsnitt 2",
      type: "text",
      rows: 6,
      initialValue:
        "Det var gjennom min rolle i etterutdanningsutvalget til Norsk Kiropraktorforening at jeg for alvor fordypet meg i det vestibulære fagfeltet. Jo mer jeg lærte, jo tydeligere ble det for meg hvor mange som går unødvendig lenge med svimmelhet — ofte feildiagnostisert, ofte uten å vite at det finnes konkrete øvelser og manøvre som kan gi rask bedring. Krystallsykehjelpen ble til for å gjøre denne kunnskapen tilgjengelig for flere, ikke bare for pasientene som finner veien til klinikken min.",
    }),
    defineField({
      name: "storyParagraph3",
      title: "Historie — avsnitt 3",
      type: "text",
      rows: 4,
      initialValue:
        "Jeg tror på grundig kartlegging, tydelig forklaring og behandling som er forankret i det som faktisk hjelper — ikke raske løsninger. Alt medisinsk innhold på denne siden er skrevet og kvalitetssikret av meg, basert på klinisk erfaring og oppdatert kunnskap på feltet.",
    }),
    defineField({
      name: "focusAreas",
      title: "«Jeg jobber mye med» — punktliste",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "Krystallsyke (BPPV)",
        "Vestibulær migrene",
        "PPPD",
        "Nakkerelatert svimmelhet",
        "Vestibulær rehabilitering",
      ],
    }),
    defineField({
      name: "membershipLine1",
      title: "Medlemskap — linje 1",
      type: "string",
      initialValue: "Medlem av Norsk Kiropraktorforening.",
    }),
    defineField({
      name: "membershipLine2",
      title: "Medlemskap — linje 2",
      type: "string",
      initialValue: "Sitter i foreningens etterutdanningsutvalg.",
    }),
    defineField({
      name: "educationHeading",
      title: "Utdanning — overskrift",
      type: "string",
      initialValue: "Utdanning og bakgrunn",
    }),
    defineField({
      name: "educationText",
      title: "Utdanning — tekst",
      type: "text",
      rows: 4,
      initialValue:
        "Jeg er utdannet kiropraktor fra University of South Wales i 2017, og har siden den gang bygget videre kompetanse spesifikt innen vestibulær rehabilitering. Det er denne fordypningen — sammen med årene i klinikk — som ligger til grunn for alt jeg skriver og anbefaler på Krystallsykehjelpen.",
    }),
    defineField({
      name: "firstVisitHeading",
      title: "Førstetime — overskrift",
      type: "string",
      initialValue: "Hva skjer på en førstetime",
    }),
    defineField({
      name: "firstVisitText",
      title: "Førstetime — tekst",
      type: "text",
      rows: 5,
      initialValue:
        "Møter du meg for første gang, starter vi alltid med en grundig samtale om hvordan svimmelheten oppleves for deg — når den kommer, hva som utløser den, og hva du har prøvd tidligere. Deretter gjør jeg konkrete undersøkelser for å kartlegge hva som faktisk skjer i det vestibulære systemet ditt, slik at behandlingen treffer riktig fra start. Du skal alltid forlate klinikken med en klar forklaring på hva jeg fant, og en plan for veien videre.",
    }),
    defineField({
      name: "whyHeading",
      title: "Engasjement — overskrift",
      type: "string",
      initialValue: "Hvorfor dette engasjerer meg",
    }),
    defineField({
      name: "whyText",
      title: "Engasjement — tekst",
      type: "text",
      rows: 5,
      initialValue:
        "Svimmelhet er en av de tilstandene jeg møter mest frustrasjon rundt. Mange har gått i årevis med symptomer som er avfeid, feiltolket, eller aldri egentlig undersøkt — og det tar en pris, både fysisk og mentalt, å ikke stole på egen kropp. Det er den følelsen jeg ønsker å fjerne hos hver eneste pasient som kommer til meg: at noen endelig tar symptomene på alvor, forstår hva som skjer, og vet hvordan det skal behandles.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Om Marie-siden" };
    },
  },
});
