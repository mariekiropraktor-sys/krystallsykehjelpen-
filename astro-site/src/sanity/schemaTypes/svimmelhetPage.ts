import { defineField, defineType } from "sanity";

// Singleton for oversiktssiden /svimmelhet/. Samme mønster som
// hjemmePage.ts: ett fast dokument, initialValue satt til Maries godkjente
// utkasttekst (Svimmelhet-innhold-utkast.md, seksjon 1), slik at siden viser
// riktig innhold selv om dokumentet aldri publiseres. Se
// src/pages/svimmelhet/[[page]].astro for kode-fallback og
// synlighetslogikk (visible + faktisk publisert, se den filen for hvorfor).

function titleTextPair(name) {
  return {
    type: "object",
    name,
    fields: [
      defineField({ name: "title", title: "Tittel", type: "string" }),
      defineField({ name: "text", title: "Tekst", type: "text", rows: 3 }),
    ],
    preview: { select: { title: "title" } },
  };
}

export default defineType({
  name: "svimmelhetPage",
  title: "Svimmelhet-oversikten",
  type: "document",
  fields: [
    defineField({
      name: "visible",
      title: "Vis siden",
      description: "Slå på når oversiktssiden skal vises på nettsiden.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "seoTitle", title: "SEO-tittel", type: "string", initialValue: "Svimmelhet: årsaker, typer og behandling | Krystallsykehjelpen" }),
    defineField({
      name: "seoDescription",
      title: "Metabeskrivelse",
      type: "text",
      rows: 2,
      initialValue: "Snurrer det, gynger det eller er du ustø? Få oversikt over de vanligste formene for svimmelhet og finn ut hva som hjelper.",
    }),

    defineField({ name: "heroEyebrow", title: "Hero — eyebrow", type: "string", initialValue: "Svimmelhet" }),
    defineField({ name: "heroHeading", title: "Hero — H1", type: "string", initialValue: "Svimmelhet: finn ut hva som skjer, og hva som hjelper" }),
    defineField({
      name: "heroLead",
      title: "Hero — ingress",
      type: "text",
      rows: 4,
      initialValue:
        "Svimmelhet er et symptom, ikke en diagnose. Det kan kjennes som at rommet snurrer, at du gynger, eller at du er ustø på beina. Årsaken avgjør hvilken behandling som hjelper. Her får du oversikt over de vanligste formene.",
    }),

    defineField({ name: "safetyHeading", title: "Sikkerhetsboks — overskrift", type: "string", initialValue: "Ring 113 ved plutselig svimmelhet sammen med andre nye symptomer" }),
    defineField({
      name: "safetyText",
      title: "Sikkerhetsboks — tekst",
      type: "text",
      rows: 3,
      initialValue:
        "Det gjelder for eksempel lammelser eller nummenhet, skjev munn, talevansker, dobbeltsyn, store problemer med å stå eller gå, eller plutselig, kraftig hodepine. Ved plutselig hørselstap på ett øre: kontakt fastlege eller legevakt (116 117) samme dag.",
    }),

    defineField({ name: "wizardHeading", title: "Veiviser — overskrift", type: "string", initialValue: "Hvordan kjennes svimmelheten?" }),
    defineField({
      name: "wizardIntro",
      title: "Veiviser — ingress",
      type: "text",
      rows: 2,
      initialValue: "Velg beskrivelsen som ligner mest på det du opplever. Dette er ikke en diagnose, men et godt sted å begynne å lese.",
    }),
    defineField({
      name: "wizardFooterText",
      title: "Veiviser — tekst under kortene",
      type: "string",
      initialValue: "Kjenner du deg ikke igjen, eller er det flere som passer? Få hjelp med å finne ut av det",
    }),

    defineField({ name: "diagnosesHeading", title: "Diagnosekort — overskrift", type: "string", initialValue: "De vanligste formene for svimmelhet" }),

    defineField({ name: "balanceHeading", title: "Balansesystem — overskrift", type: "string", initialValue: "Hvorfor blir man svimmel?" }),
    defineField({
      name: "balanceIntro",
      title: "Balansesystem — ingress",
      type: "text",
      rows: 3,
      initialValue:
        "Hjernen bygger opp balansen din av signaler fra flere kilder samtidig. Når én av dem sender feil informasjon, eller signalene ikke stemmer overens, oppstår svimmelhet.",
    }),
    defineField({
      name: "balanceItems",
      title: "Balansesystem — punkter",
      type: "array",
      of: [titleTextPair("balanceItem")],
      initialValue: [
        { title: "Det indre øret", text: "registrerer hodebevegelser og tyngdekraft." },
        { title: "Øynene", text: "forteller hvor du er i rommet." },
        { title: "Nakke og kropp", text: "melder om stilling og underlag." },
        { title: "Hjernen", text: "setter alt sammen og justerer." },
      ],
    }),

    defineField({ name: "otherCausesHeading", title: "Andre årsaker — overskrift", type: "string", initialValue: "Svimmelhet kan også ha andre årsaker" }),
    defineField({
      name: "otherCausesIntro",
      title: "Andre årsaker — ingress",
      type: "text",
      rows: 2,
      initialValue: "Noen årsaker hører hjemme hos fastlegen eller øre-nese-hals-lege. Er du usikker, er fastlegen alltid et godt første sted.",
    }),
    defineField({
      name: "otherCausesItems",
      title: "Andre årsaker — punkter",
      type: "array",
      of: [titleTextPair("otherCauseItem")],
      initialValue: [
        { title: "Vestibulær nevritt", text: "Betennelse i balansenerven. Gir kraftig svimmelhet som varer i dager, ofte etter en virusinfeksjon." },
        { title: "Ménières sykdom", text: "Anfall av svimmelhet i timer, med sus, tetthet og nedsatt hørsel på ett øre." },
        { title: "Blodtrykk og sirkulasjon", text: "Ørhet når du reiser deg raskt, ofte uten at rommet snurrer." },
        { title: "Legemidler", text: "Flere vanlige medisiner kan gi svimmelhet som bivirkning." },
        { title: "Angst og stress", text: "Kan gi og forsterke svimmelhet, og henger ofte sammen med PPPD." },
        { title: "Syn", text: "Nye briller eller synsforandringer kan gi en følelse av ustøhet." },
      ],
    }),

    defineField({
      name: "faq",
      title: "Spørsmål og svar",
      type: "array",
      of: [
        {
          type: "object",
          name: "svimmelhetFaqItem",
          fields: [
            defineField({ name: "question", title: "Spørsmål", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Svar", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
      initialValue: [
        {
          question: "Er svimmelhet farlig?",
          answer:
            "De fleste former for svimmelhet er ufarlige, selv om de kan oppleves skremmende. Plutselig svimmelhet sammen med nevrologiske symptomer som lammelser, talevansker eller dobbeltsyn skal alltid behandles som akutt. Ring 113.",
        },
        {
          question: "Hva er forskjellen på svimmelhet og ørhet?",
          answer:
            "Svimmelhet brukes om mange ulike opplevelser. Snurring peker ofte mot det indre øret. Ørhet og en følelse av å skulle besvime har oftere med blodtrykk eller sirkulasjon å gjøre.",
        },
        {
          question: "Når bør jeg oppsøke behandler?",
          answer: "Hvis svimmelheten kommer igjen, varer lenge eller påvirker hverdagen din. Mange former kan undersøkes og behandles effektivt.",
        },
        {
          question: "Kan man ha flere typer svimmelhet samtidig?",
          answer:
            "Ja. Det er for eksempel vanlig å kjenne seg ustø en periode etter at krystallsyke er behandlet, og noen utvikler PPPD etter en svimmelhetsepisode.",
        },
      ],
    }),

    defineField({ name: "ctaHeading", title: "CTA — overskrift", type: "string", initialValue: "Usikker på hva slags svimmelhet du har?" }),
    defineField({ name: "ctaText", title: "CTA — tekst", type: "text", rows: 2, initialValue: "En grundig undersøkelse gir svar på hva som skjer, og hva som hjelper." }),
  ],
  preview: {
    select: { visible: "visible" },
    prepare({ visible }) {
      return { title: "Svimmelhet-oversikten", subtitle: visible ? "Synlig på siden" : "Skjult (utkast)" };
    },
  },
});
