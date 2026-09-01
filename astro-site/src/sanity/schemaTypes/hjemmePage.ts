import { defineField, defineType } from "sanity";

// Singleton-dokument for alle pasientrettede tekster i fase 3 av /hjemme/
// (oppfølgingsspørsmål, restsvimmelhet, rehabilitering, hjelp-seksjonen).
// Samme mønster som siteSettings.ts (ett fast dokument, ingen liste).
// initialValue er satt til Maries godkjente tekst fra
// hjemme-fase3-prompt.md, slik at siden viser riktig innhold selv om dette
// dokumentet aldri opprettes/publiseres i Studio — se safeFetch-fallback i
// src/pages/hjemme/index.astro, som bruker nøyaktig samme tekst.

function panelField(name, title, defaults) {
  return defineField({
    name,
    title,
    type: "object",
    group: "oppfolging",
    fields: [
      defineField({ name: "optionLabel", title: "Svaralternativ – overskrift", type: "string", initialValue: defaults.optionLabel }),
      defineField({ name: "optionSublabel", title: "Svaralternativ – undertekst", type: "string", initialValue: defaults.optionSublabel }),
      defineField({ name: "panelHeading", title: "Panel – overskrift", type: "string", initialValue: defaults.panelHeading }),
      defineField({ name: "panelBody", title: "Panel – tekst", type: "text", rows: 4, initialValue: defaults.panelBody }),
      defineField({ name: "button1Label", title: "Knapp 1 – tekst (la stå tom for ingen knapp)", type: "string", initialValue: defaults.button1Label }),
      defineField({ name: "button2Label", title: "Knapp 2 – tekst (la stå tom for ingen knapp)", type: "string", initialValue: defaults.button2Label }),
    ],
    preview: { select: { title: "optionLabel" } },
  });
}

export default defineType({
  name: "hjemmePage",
  title: "Hjemme-siden (fase 3-innhold)",
  type: "document",
  groups: [
    { name: "oppfolging", title: "1. Oppfølgingsspørsmål", default: true },
    { name: "restsvimmelhet", title: "2. Restsvimmelhet" },
    { name: "rehab", title: "3. Rehabilitering" },
    { name: "hjelp", title: "4. Hjelp-seksjonen" },
  ],
  fields: [
    // --- Del 1: Oppfølgingsspørsmålet ---
    defineField({ name: "followUpEyebrow", title: "Eyebrow", type: "string", group: "oppfolging", initialValue: "Etter behandlingen" }),
    defineField({ name: "followUpHeading", title: "Overskrift", type: "string", group: "oppfolging", initialValue: "Hva skjer nå?" }),
    defineField({
      name: "followUpIntro",
      title: "Ingress",
      type: "text",
      rows: 3,
      group: "oppfolging",
      initialValue:
        "Det er ikke uvanlig å kjenne seg litt annerledes etter behandling av krystallsyke. Noen blir raskt bedre, mens andre kan være ustø eller lettere svimle en periode.",
    }),
    defineField({ name: "followUpQuestion", title: "Spørsmål", type: "string", group: "oppfolging", initialValue: "Hvordan har du det nå?" }),
    defineField({ name: "followUpDivider", title: "Ledetekst før femte alternativ", type: "string", group: "oppfolging", initialValue: "eller kjenner du deg igjen i dette?" }),

    panelField("panelMuchBetter", "Panel: Mye bedre", {
      optionLabel: "Mye bedre",
      optionSublabel: "Svimmelheten er borte eller nesten borte",
      panelHeading: "Så bra at det går riktig vei",
      panelBody:
        "Når svimmelheten gir seg etter behandling, er det et godt tegn. Noen kjenner seg helt bra med én gang, mens andre kan merke litt ustøhet eller uvanthet en periode etterpå. Det betyr ikke nødvendigvis at noe er galt.",
      button1Label: "Hva kan jeg forvente etter behandling?",
      button2Label: "",
    }),
    panelField("panelSlightlyBetter", "Panel: Litt bedre", {
      optionLabel: "Litt bedre",
      optionSublabel: "Noe bedring, men fortsatt tydelige symptomer",
      panelHeading: "Det tyder på at manøveren virket",
      panelBody:
        "Delvis bedring er et godt tegn. Symptomene trenger ikke å forsvinne med én gang.\n\nEr du ikke helt bra dagen etter, kan du gjøre manøveren på nytt.",
      button1Label: "Gjør manøveren på nytt",
      button2Label: "Hva kan jeg forvente?",
    }),
    panelField("panelNoChange", "Panel: Ingen forskjell", {
      optionLabel: "Ingen forskjell",
      optionSublabel: "Symptomene er omtrent som før behandlingen",
      panelHeading: "Noen kjenner ikke bedring med én gang",
      panelBody:
        "Det er ikke uvanlig at det ikke merkes forskjell etter første forsøk. Manøveren må ofte gjentas før krystallene kommer på plass.\n\nDu kan gjenta den morgen og kveld i to til tre dager. Hvis du fortsatt ikke merker bedring etter det, kan en ny vurdering være lurt.",
      button1Label: "Gjør manøveren på nytt",
      button2Label: "Få en ny vurdering",
    }),
    panelField("panelWorse", "Panel: Verre", {
      optionLabel: "Verre",
      optionSublabel: "Symptomene har økt eller endret seg",
      panelHeading: "Det er ikke uvanlig å kjenne seg verre rett etter en manøver",
      panelBody:
        "Når krystallene flytter på seg, forstyrrer det balansesystemet før det faller til ro igjen. Mange kjenner seg mer svimle eller ustø den første tiden etter en manøver. Det betyr ikke i seg selv at noe har gått galt.\n\nHvis det ikke gir seg, eller svimmelheten kjennes annerledes enn den du kjenner igjen fra krystallsyken, bør du ikke fortsette med flere manøvrer på egen hånd. Da er en ny vurdering bedre.",
      button1Label: "Få hjelp",
      button2Label: "",
    }),
    panelField("panelStillUnsteady", "Panel: Fortsatt ustø", {
      optionLabel: "Fortsatt ustø",
      optionSublabel: "Den kraftige svimmelheten er borte, men jeg er fortsatt ustø",
      panelHeading: "Dette er en vanlig opplevelse",
      panelBody:
        "At den kraftige, kortvarige svimmelheten er borte mens en mer generell ustøhet blir igjen, er noe mange kjenner igjen etter behandling.\n\nUnder finner du rehabiliterings- og habitueringsøvelser du kan gjøre hjemme.",
      button1Label: "Se øvelsene",
      button2Label: "",
    }),

    defineField({ name: "acuteWarningHeading", title: "Akuttvarsel – overskrift", type: "string", group: "oppfolging", initialValue: "Noen symptomer krever øyeblikkelig hjelp" }),
    defineField({
      name: "acuteWarningIntro",
      title: "Akuttvarsel – ingress",
      type: "text",
      rows: 2,
      group: "oppfolging",
      initialValue: "Svimmelhet sammen med noen av disse tegnene kan skyldes noe annet enn krystallsyke, og kan være symptomer på hjerneslag:",
    }),
    defineField({
      name: "acuteWarningList",
      title: "Akuttvarsel – tegn",
      type: "array",
      group: "oppfolging",
      of: [{ type: "string" }],
      initialValue: [
        "Lammelse eller kraftsvikt i ansikt, arm eller bein",
        "Problemer med å snakke eller forstå det andre sier",
        "Plutselige synsforstyrrelser eller dobbeltsyn",
        "Uvanlig kraftig hodepine",
        "Nummenhet i ansiktet eller på én side av kroppen",
      ],
    }),
    defineField({
      name: "acuteWarningCheck",
      title: "Akuttvarsel – prate/smile/løfte-linje",
      type: "text",
      rows: 2,
      group: "oppfolging",
      initialValue: "Klarer personen å prate, smile og løfte begge armene? Svikter noe av dette — ring 113.",
    }),

    // --- Del 2: Restsvimmelhet ---
    defineField({ name: "restsvimmelhetEyebrow", title: "Eyebrow", type: "string", group: "restsvimmelhet", initialValue: "Restsvimmelhet" }),
    defineField({
      name: "restsvimmelhetHeading",
      title: "Overskrift",
      type: "string",
      group: "restsvimmelhet",
      initialValue: "Krystallsyken er bedre – men jeg føler meg fortsatt ustø",
    }),
    defineField({
      name: "restsvimmelhetIntro",
      title: "Ingress",
      type: "text",
      rows: 3,
      group: "restsvimmelhet",
      initialValue:
        "Dette er en vanlig opplevelse etter behandling. Restsvimmelhet kan blant annet kjennes som ustøhet, bevegelsesfølsomhet eller en følelse av at balansen ikke er helt som før.",
    }),
    defineField({
      name: "restsvimmelhetCards",
      title: "Kort (lenker til rehabiliteringsseksjonen)",
      type: "array",
      group: "restsvimmelhet",
      of: [
        {
          type: "object",
          name: "restsvimmelhetCard",
          fields: [
            defineField({ name: "heading", title: "Overskrift", type: "string" }),
            defineField({ name: "body", title: "Tekst", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "heading" } },
        },
      ],
      initialValue: [
        {
          heading: "Jeg blir svimmel når jeg beveger hodet",
          body: "Mange kjenner at raske hodebevegelser gir en kort følelse av at omgivelsene henger etter. Det er noe man ofte kan trene seg gradvis ut av.",
        },
        {
          heading: "Jeg føler meg ustø når jeg går",
          body: "Det kan kjennes som at underlaget er ujevnt, eller at du må konsentrere deg mer enn før for å gå trygt. Dette bedrer seg for mange gradvis.",
        },
        {
          heading: "Jeg blir verre i butikker og steder med mye synsinntrykk",
          body: "Store rom med mye bevegelse, mønstre og lys kan oppleves overveldende når balansesystemet er ute av vane. Gradvis eksponering er ofte en del av opptreningen.",
        },
      ],
    }),
    defineField({ name: "restsvimmelhetCard4Heading", title: "Fjerde kort (full bredde) – overskrift", type: "string", group: "restsvimmelhet", initialValue: "Jeg føler meg utrygg når jeg ligger eller beveger meg raskt" }),
    defineField({
      name: "restsvimmelhetCard4Body",
      title: "Fjerde kort – tekst",
      type: "text",
      rows: 4,
      group: "restsvimmelhet",
      initialValue:
        "Svimmelhet som kommer når du legger deg ned eller snur deg i sengen, er typisk for krystallsyke. Det kan bety at krystallene ikke har kommet helt på plass ennå.\n\nManøveren kan gjentas morgen og kveld i to til tre dager. Hvis du ikke merker bedring i løpet av den tiden, kan en ny vurdering være lurt.",
    }),
    defineField({ name: "restsvimmelhetCard4Button1", title: "Fjerde kort – knapp 1", type: "string", group: "restsvimmelhet", initialValue: "Gjør manøveren på nytt" }),
    defineField({ name: "restsvimmelhetCard4Button2", title: "Fjerde kort – knapp 2", type: "string", group: "restsvimmelhet", initialValue: "Få en ny vurdering" }),

    // --- Del 3: Vestibulær rehabilitering ---
    defineField({ name: "rehabEyebrow", title: "Eyebrow", type: "string", group: "rehab", initialValue: "Vestibulær rehabilitering" }),
    defineField({ name: "rehabHeading", title: "Overskrift", type: "string", group: "rehab", initialValue: "Når balansen trenger litt tid" }),
    defineField({
      name: "rehabIntro",
      title: "Ingress",
      type: "text",
      rows: 3,
      group: "rehab",
      initialValue: "Etter at krystallsyken er behandlet, kan noen ha nytte av gradvis trening av balanse, hodebevegelser og bevegelsestoleranse.",
    }),
    defineField({
      name: "rehabLead",
      title: "Ledetekst (halvfet)",
      type: "text",
      rows: 2,
      group: "rehab",
      initialValue: "Velg øvelsene som kjennes ubehagelige å gjøre. Det er de bevegelsene kroppen trenger å bli vant til igjen.",
    }),
    defineField({ name: "rehabCtaHeading", title: "CTA-boks – overskrift", type: "string", group: "rehab", initialValue: "Usikker på hvilke øvelser som passer for deg?" }),
    defineField({
      name: "rehabCtaBody",
      title: "CTA-boks – tekst",
      type: "text",
      rows: 3,
      group: "rehab",
      initialValue: "I en videokonsultasjon kan øvelsene tilpasses situasjonen din, og du får veiledning i hvordan de skal gjøres.",
    }),
    defineField({ name: "rehabCtaButton", title: "CTA-boks – knappetekst", type: "string", group: "rehab", initialValue: "Bestill videokonsultasjon" }),

    // --- Del 4: Hjelp-seksjonen ---
    defineField({ name: "hjelpEyebrow", title: "Eyebrow", type: "string", group: "hjelp", initialValue: "Trenger du hjelp?" }),
    defineField({ name: "hjelpHeading", title: "Overskrift", type: "string", group: "hjelp", initialValue: "Usikker på hva som er riktig neste steg?" }),
    defineField({
      name: "hjelpText1",
      title: "Tekst 1",
      type: "text",
      rows: 3,
      group: "hjelp",
      initialValue:
        "Hvis du ikke vet hvilken buegang som er påvirket, hvilken manøver du skal gjøre, eller symptomene dine har endret seg, kan det være bedre med en ny vurdering enn å prøve flere øvelser på egen hånd.",
    }),
    defineField({
      name: "hjelpText2",
      title: "Tekst 2",
      type: "text",
      rows: 2,
      group: "hjelp",
      initialValue: "Videokonsultasjon kan brukes til spørsmål, usikkerhet og veiledning av øvelser og manøvrer.",
    }),
    defineField({ name: "hjelpButton1", title: "Knapp 1 (→ videokonsultasjon)", type: "string", group: "hjelp", initialValue: "Bestill videokonsultasjon" }),
    defineField({ name: "hjelpButton2", title: "Knapp 2 (→ få hjelp)", type: "string", group: "hjelp", initialValue: "Se alle måter å få hjelp på" }),
    defineField({
      name: "attributionText",
      title: "Faglig avsender (liten tekst før footer)",
      type: "text",
      rows: 2,
      group: "hjelp",
      initialValue: "Krystallsykehjelpen er utviklet for å gjøre kunnskap om svimmelhet og krystallsyke lettere tilgjengelig.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Hjemme-siden (fase 3-innhold)" };
    },
  },
});
