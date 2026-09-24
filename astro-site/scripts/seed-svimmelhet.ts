// Engangsskript: legger inn utkast (drafts.*) for oversiktssiden /svimmelhet/
// og de tre nye diagnosesidene (vestibulær migrene, PPPD, nakkesvimmelhet),
// pluss kun kort-/veiviserfeltene på et diagnosisPage-dokument for
// krystallsyke (som fortsatt bruker sin egen, urørte side).
//
// Kjøres fra astro-site/ med:
//   npx sanity exec scripts/seed-svimmelhet.ts --with-user-token
//
// Bruker createIfNotExists — overskriver ALDRI et dokument som allerede
// finnes (f.eks. hvis du allerede har begynt å redigere det i Studio).
// Alt legges inn som drafts.*-ID-er — INGENTING publiseres.
//
// Teksten er lagt inn ordrett fra mockups/Svimmelhet-innhold-utkast.md,
// inkludert [SJEKK: …]-merknadene — se sluttrapporten for en liste over
// de stedene der noe fortsatt må avgjøres.

import { getCliClient } from "sanity/cli";

const client = getCliClient();

function block(text: string) {
  return {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text }],
  };
}

function bulletBlock(text: string) {
  return {
    _type: "block",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", text }],
  };
}

// --- 1. Oversiktssiden /svimmelhet/ ---
const svimmelhetPage = {
  _id: "drafts.svimmelhetPage",
  _type: "svimmelhetPage",
  visible: false,
  seoTitle: "Svimmelhet: årsaker, typer og behandling | Krystallsykehjelpen",
  seoDescription:
    "Snurrer det, gynger det eller er du ustø? Få oversikt over de vanligste formene for svimmelhet og finn ut hva som hjelper.",
  heroEyebrow: "Svimmelhet",
  heroHeading: "Svimmelhet: finn ut hva som skjer, og hva som hjelper",
  heroLead:
    "Svimmelhet er et symptom, ikke en diagnose. Det kan kjennes som at rommet snurrer, at du gynger, eller at du er ustø på beina. Årsaken avgjør hvilken behandling som hjelper. Her får du oversikt over de vanligste formene.",
  safetyHeading: "Ring 113 ved plutselig svimmelhet sammen med andre nye symptomer",
  safetyText:
    "Det gjelder for eksempel lammelser eller nummenhet, skjev munn, talevansker, dobbeltsyn, store problemer med å stå eller gå, eller plutselig, kraftig hodepine. Ved plutselig hørselstap på ett øre: kontakt fastlege eller legevakt (116 117) samme dag.",
  wizardHeading: "Hvordan kjennes svimmelheten?",
  wizardIntro: "Velg beskrivelsen som ligner mest på det du opplever. Dette er ikke en diagnose, men et godt sted å begynne å lese.",
  wizardFooterText: "Kjenner du deg ikke igjen, eller er det flere som passer? Få hjelp med å finne ut av det",
  diagnosesHeading: "De vanligste formene for svimmelhet",
  balanceHeading: "Hvorfor blir man svimmel?",
  balanceIntro:
    "Hjernen bygger opp balansen din av signaler fra flere kilder samtidig. Når én av dem sender feil informasjon, eller signalene ikke stemmer overens, oppstår svimmelhet.",
  balanceItems: [
    { _type: "balanceItem", title: "Det indre øret", text: "registrerer hodebevegelser og tyngdekraft." },
    { _type: "balanceItem", title: "Øynene", text: "forteller hvor du er i rommet." },
    { _type: "balanceItem", title: "Nakke og kropp", text: "melder om stilling og underlag." },
    { _type: "balanceItem", title: "Hjernen", text: "setter alt sammen og justerer." },
  ],
  otherCausesHeading: "Svimmelhet kan også ha andre årsaker",
  otherCausesIntro: "Noen årsaker hører hjemme hos fastlegen eller øre-nese-hals-lege. Er du usikker, er fastlegen alltid et godt første sted.",
  otherCausesItems: [
    { _type: "otherCauseItem", title: "Vestibulær nevritt", text: "Betennelse i balansenerven. Gir kraftig svimmelhet som varer i dager, ofte etter en virusinfeksjon." },
    { _type: "otherCauseItem", title: "Ménières sykdom", text: "Anfall av svimmelhet i timer, med sus, tetthet og nedsatt hørsel på ett øre." },
    { _type: "otherCauseItem", title: "Blodtrykk og sirkulasjon", text: "Ørhet når du reiser deg raskt, ofte uten at rommet snurrer." },
    { _type: "otherCauseItem", title: "Legemidler", text: "Flere vanlige medisiner kan gi svimmelhet som bivirkning." },
    { _type: "otherCauseItem", title: "Angst og stress", text: "Kan gi og forsterke svimmelhet, og henger ofte sammen med PPPD." },
    { _type: "otherCauseItem", title: "Syn", text: "Nye briller eller synsforandringer kan gi en følelse av ustøhet." },
  ],
  faq: [
    {
      _type: "svimmelhetFaqItem",
      question: "Er svimmelhet farlig?",
      answer:
        "De fleste former for svimmelhet er ufarlige, selv om de kan oppleves skremmende. Plutselig svimmelhet sammen med nevrologiske symptomer som lammelser, talevansker eller dobbeltsyn skal alltid behandles som akutt. Ring 113.",
    },
    {
      _type: "svimmelhetFaqItem",
      question: "Hva er forskjellen på svimmelhet og ørhet?",
      answer:
        "Svimmelhet brukes om mange ulike opplevelser. Snurring peker ofte mot det indre øret. Ørhet og en følelse av å skulle besvime har oftere med blodtrykk eller sirkulasjon å gjøre.",
    },
    {
      _type: "svimmelhetFaqItem",
      question: "Når bør jeg oppsøke behandler?",
      answer: "Hvis svimmelheten kommer igjen, varer lenge eller påvirker hverdagen din. Mange former kan undersøkes og behandles effektivt.",
    },
    {
      _type: "svimmelhetFaqItem",
      question: "Kan man ha flere typer svimmelhet samtidig?",
      answer:
        "Ja. Det er for eksempel vanlig å kjenne seg ustø en periode etter at krystallsyke er behandlet, og noen utvikler PPPD etter en svimmelhetsepisode.",
    },
  ],
  ctaHeading: "Usikker på hva slags svimmelhet du har?",
  ctaText: "En grundig undersøkelse gir svar på hva som skjer, og hva som hjelper.",
};

// --- 2. Krystallsyke — kun kort-/veiviserfelt, egen side urørt ---
const diagnosisKrystallsyke = {
  _id: "drafts.diagnosis-krystallsyke",
  _type: "diagnosisPage",
  title: "Krystallsyke (BPPV)",
  slug: { _type: "slug", current: "krystallsyke" },
  order: 1,
  hasOwnPage: true,
  ownPagePath: "/svimmelhet/krystallsyke/",
  cardShortDescription:
    "Den vanligste årsaken til snurrende svimmelhet. Små krystaller i det indre øret har løsnet og gir korte, kraftige anfall når hodet beveges.",
  cardChips: ["Sekunder", "Utløses av hodebevegelser", "Behandles med manøver"],
  cardWizardQuote: "Rommet snurrer i noen sekunder når jeg legger meg ned, snur meg i sengen eller ser opp.",
};

// --- 3. Vestibulær migrene ---
const diagnosisVestibulaerMigrene = {
  _id: "drafts.diagnosis-vestibulaer-migrene",
  _type: "diagnosisPage",
  title: "Vestibulær migrene",
  slug: { _type: "slug", current: "vestibulaer-migrene" },
  order: 2,
  hasOwnPage: false,
  seoTitle: "Vestibulær migrene: symptomer, triggere og behandling | Krystallsykehjelpen",
  seoDescription:
    "Svimmelhetsanfall med eller uten hodepine? Vestibulær migrene er en vanlig, men ofte oversett årsak til svimmelhet. Les om symptomer, triggere og behandling.",
  cardShortDescription: "En form for migrene der svimmelhet er hovedsymptomet. Hodepine er vanlig, men ikke alltid med. Anfallene varierer mye i lengde.",
  cardChips: ["Minutter til timer", "Lys- og lydfølsomhet", "Kan komme igjen"],
  cardWizardQuote: "Jeg får anfall av svimmelhet som varer fra minutter til timer, ofte med hodepine, lys- eller lydfølsomhet.",
  heroEyebrow: "Vestibulær migrene",
  heroHeading: "Vestibulær migrene: når migrenen sitter i balansen",
  heroLead:
    "Vestibulær migrene gir anfall av svimmelhet som kan vare fra noen minutter til flere døgn, ofte uten kraftig hodepine. Det er en av de vanligste årsakene til tilbakevendende svimmelhet, men blir ofte oversett. Med riktig forståelse og behandling blir de fleste mye bedre.",
  heroFacts: [
    { _type: "heroFact", title: "Anfall", text: "Fra minutter til døgn" },
    { _type: "heroFact", title: "Hodepine", text: "Ikke alltid med" },
    { _type: "heroFact", title: "Kan behandles", text: "Triggere, rehabilitering og medisiner" },
  ],
  understandEyebrow: "01 · Forstå tilstanden",
  understandHeading: "Hva er vestibulær migrene?",
  understandBody: [
    block(
      "Migrene er en tilstand i nervesystemet, ikke bare en hodepine. Hos noen påvirker migrenen først og fremst hjernens behandling av balansesignaler. Da kan anfallene arte seg som svimmelhet, ustøhet eller bevegelsesfølsomhet, med eller uten hodepine.",
    ),
    block(
      "Det indre øret er som regel friskt ved vestibulær migrene. Det er måten hjernen tolker signalene på som endres under et anfall. Derfor kan undersøkelser som MR og hørselstest være normale, selv om plagene er tydelige.",
    ),
    block(
      "Mange har hatt migrene med hodepine tidligere i livet, og opplever at hodepinen avtar mens svimmelheten tar over. Tilstanden er vanligere hos kvinner, og kan debutere i alle aldre. [SJEKK: ønsker du å oppgi forekomst, f.eks. «rundt 1 av 100»?]",
    ),
  ],
  symptomsHeading: "Slik oppleves vestibulær migrene",
  symptomsItems: [
    { _type: "symptomItem", title: "Anfall av svimmelhet", text: "Snurring, gynging eller en følelse av at du selv eller omgivelsene beveger seg." },
    { _type: "symptomItem", title: "Varierende varighet", text: "Fra minutter til timer, noen ganger opptil flere døgn." },
    { _type: "symptomItem", title: "Migrenetrekk", text: "Hodepine, lys- eller lydfølsomhet, eller synsforstyrrelser (aura) under minst en del av anfallene." },
    { _type: "symptomItem", title: "Bevegelsesfølsomhet", text: "Mange blir verre av hodebevegelser, bilkjøring, skjermer og travle omgivelser, også mellom anfallene." },
  ],
  symptomsAfter:
    "Til forskjell fra krystallsyke er anfallene ikke bare korte, stillingsutløste snurreanfall. De varer lenger og kommer ofte uten tydelig utløsende hodebevegelse.",
  warningHeading: "Når det ikke bør forklares som migrene",
  warningIntro: "Søk akutt medisinsk hjelp (113) ved ny svimmelhet sammen med:",
  warningItems: [
    "lammelser eller tydelig kraftsvikt",
    "talevansker",
    "dobbeltsyn",
    "plutselig, kraftig hodepine («den verste noensinne»)",
    "uttalte koordinasjonsvansker eller plutselig manglende evne til å gå",
    "redusert bevissthet",
  ],
  warningAfter:
    "Kontakt lege hvis hodepinen eller anfallene endrer karakter, hvis du får aura for første gang etter 50 år, eller ved hørselstap eller øresus på ett øre. [SJEKK: aldersgrense og ordlyd]",
  backgroundHeading: "Hva utløser anfallene?",
  backgroundIntro: [
    block("Anfallene kan komme uten forvarsel, men mange kjenner igjen faste triggere:"),
    bulletBlock("For lite eller uregelmessig søvn"),
    bulletBlock("Stress, eller perioden rett etter stress («fridagsmigrene»)"),
    bulletBlock("Hormonelle svingninger, for eksempel rundt menstruasjon"),
    bulletBlock("Uregelmessige måltider og for lite væske"),
    bulletBlock("Sterkt lys, skjermer og visuelt travle omgivelser"),
    bulletBlock("Enkelte matvarer eller drikke hos noen, som rødvin"),
    block("Det finnes ingen fasit. Triggerne er individuelle, og ofte er det summen av flere faktorer som utløser et anfall."),
  ],
  examinationHeading: "Diagnosen stilles ut fra mønsteret",
  examinationIntro:
    "Det finnes ingen enkelt test for vestibulær migrene. Diagnosen stilles ut fra sykehistorien: hvordan anfallene arter seg, hvor lenge de varer, og om de henger sammen med migrenetrekk. Samtidig må andre årsaker utelukkes.",
  examinationSteps: [
    { _type: "examinationStep", title: "Sykehistorie", text: "anfallenes varighet, symptomer og triggere" },
    { _type: "examinationStep", title: "Undersøkelse av balansesystemet", text: "øyebevegelser, posisjonstester og balanse" },
    { _type: "examinationStep", title: "Utelukke andre årsaker", text: "blant annet krystallsyke og Ménière" },
    { _type: "examinationStep", title: "Plan", text: "behandling og eventuelt samarbeid med fastlege" },
  ],
  examinationAfter: "Mange har både vestibulær migrene og krystallsyke. Derfor er posisjonstester en viktig del av undersøkelsen.",
  treatmentHeading: "Behandling i tre spor",
  treatmentCards: [
    { _type: "treatmentCard", kicker: "1", title: "Kjenne og dempe triggerne", text: "Jevn søvn, regelmessige måltider, nok væske og mestring av stress er grunnmuren. En anfallsdagbok gjør det lettere å se mønstre." },
    { _type: "treatmentCard", kicker: "2", title: "Vestibulær rehabilitering", text: "Tilpassede øvelser kan redusere bevegelsesfølsomhet og ustøhet mellom anfallene. Øvelsene doseres forsiktig, fordi for mye for fort kan utløse anfall." },
    { _type: "treatmentCard", kicker: "3", title: "Medisiner ved behov", text: "Ved hyppige eller kraftige anfall kan fastlege eller nevrolog vurdere anfallsmedisin eller forebyggende behandling." },
    {
      _type: "treatmentCard",
      kicker: "[SJEKK]",
      title: "Min rolle som kiropraktor",
      text:
        "[SJEKK: hvordan vil du beskrive din rolle som kiropraktor? Forslag: «Vi undersøker balansesystemet, skiller vestibulær migrene fra krystallsyke og andre tilstander, og veileder deg gjennom rehabiliteringen, i samarbeid med fastlegen når det trengs.»]",
    },
  ],
  selfCareItems: [
    "Før anfallsdagbok i noen uker: søvn, mat, stress, syklus og anfall",
    "Hold faste døgnrytmer, også i helger og ferier",
    "Spis regelmessig og drikk nok",
    "Ta pauser fra skjerm, og demp lyset når du er sårbar",
    "Hold deg i bevegelse. Rolig, jevn fysisk aktivitet hjelper mange",
  ],
  // selfCareFeaturedExercise: ikke satt — kildeteksten lenker til en hel
  // kategori (/ovelsesbibliotek/vestibular-rehab/), ikke én enkelt øvelse.
  prognosisHeading: "Hva kan du forvente?",
  prognosisBody:
    "Vestibulær migrene er ofte en tilstand som kommer og går over tid. Med riktig behandling opplever de fleste færre og mildere anfall, og mange får god kontroll. Å forstå hva som skjer, gjør det også lettere å leve med.",
  faq: [
    { _type: "diagnosisFaqItem", question: "Kan man ha migrene uten hodepine?", answer: "Ja. Ved vestibulær migrene er svimmelheten hovedsymptomet, og mange har lite eller ingen hodepine under anfallene." },
    { _type: "diagnosisFaqItem", question: "Hvordan skiller jeg vestibulær migrene fra krystallsyke?", answer: "Krystallsyke gir korte snurreanfall, ofte under ett minutt, som utløses av bestemte hodebevegelser. Vestibulær migrene gir lengre anfall, ofte med lys- eller lydfølsomhet. Man kan ha begge deler." },
    { _type: "diagnosisFaqItem", question: "Er vestibulær migrene farlig?", answer: "Nei, men den kan være svært plagsom. Nye eller endrede symptomer bør likevel alltid vurderes." },
    { _type: "diagnosisFaqItem", question: "Går det over?", answer: "Mange får færre og mildere anfall med behandling og kjennskap til egne triggere. Hos noen avtar anfallene med alderen." },
    { _type: "diagnosisFaqItem", question: "Hjelper øvelser?", answer: "Tilpassede balanseøvelser kan redusere bevegelsesfølsomhet og ustøhet mellom anfallene, men må doseres forsiktig." },
    { _type: "diagnosisFaqItem", question: "Må jeg ta medisiner?", answer: "Ikke nødvendigvis. Mange klarer seg med triggerhåndtering og rehabilitering. Ved hyppige anfall kan medisiner vurderes av lege." },
  ],
  ctaHeading: "Få undersøkt svimmelheten",
  ctaText: "En grundig undersøkelse kan avklare om anfallene passer med vestibulær migrene, krystallsyke eller noe annet, og hvilken behandling som er riktig for deg.",
};

// --- 4. PPPD ---
const diagnosisPppd = {
  _id: "drafts.diagnosis-pppd",
  _type: "diagnosisPage",
  title: "PPPD",
  slug: { _type: "slug", current: "pppd" },
  order: 3,
  hasOwnPage: false,
  seoTitle: "PPPD: vedvarende svimmelhet og ustøhet | Krystallsykehjelpen",
  seoDescription: "Har du kjent deg ustø eller gyngende i månedsvis? PPPD er en vanlig og behandlbar årsak til langvarig svimmelhet. Les om symptomer og behandling.",
  cardShortDescription: "Vedvarende ustøhet og gynging som varer i måneder, ofte etter en annen svimmelhetsepisode. Balansesystemet har blitt værende i alarmberedskap.",
  cardChips: ["Over 3 måneder", "Verre i travle omgivelser", "Rehabilitering hjelper"],
  cardWizardQuote: "Jeg har kjent meg ustø eller gyngende nesten hver dag i flere måneder, og det er verst i butikker og foran skjermer.",
  heroEyebrow: "PPPD",
  heroHeading: "PPPD: når ustøheten ikke gir seg",
  heroLead: "PPPD (vedvarende postural-perseptuell svimmelhet) gir en daglig følelse av gynging eller ustøhet som varer i måneder. Det er en reell tilstand, ikke noe du innbiller deg, og den kan behandles.",
  heroFacts: [
    { _type: "heroFact", title: "Langvarig", text: "Tre måneder eller mer" },
    { _type: "heroFact", title: "Daglig", text: "Gynging og ustøhet" },
    { _type: "heroFact", title: "Kan behandles", text: "Med gradvis trening" },
  ],
  understandEyebrow: "01 · Forstå tilstanden",
  understandHeading: "Hva skjer ved PPPD?",
  understandPullQuote: "Selve hendelsen går over, men balansesystemet «glemmer» å slå av alarmen.",
  understandBody: [
    block("PPPD starter ofte etter en hendelse som gir svimmelhet: krystallsyke, betennelse i balansenerven, et migreneanfall, en hjernerystelse eller et panikkanfall. Selve hendelsen går over, men balansesystemet «glemmer» å slå av alarmen."),
    block("Kroppen fortsetter å bruke en forsiktig, stiv balansestrategi, og hjernen lener seg mer på synet enn på det indre øret. Mye av oppmerksomheten går til balansen, noe som gjør at vanlige bevegelser kjennes ustø. Resultatet er en vedvarende følelse av gynging, selv om ingen organer er skadet."),
    block("PPPD regnes som en funksjonell tilstand: det er måten systemet fungerer på som er forstyrret, ikke strukturen. Derfor er undersøkelser og bilder ofte normale."),
  ],
  symptomsHeading: "Slik oppleves PPPD",
  symptomsItems: [
    { _type: "symptomItem", title: "Gynging og ustøhet", text: "Følelsen av å gå på en båt eller en madrass, de fleste dager." },
    { _type: "symptomItem", title: "Verre når du står og går", text: "Bedre når du sitter eller ligger." },
    { _type: "symptomItem", title: "Verre i travle omgivelser", text: "Butikker, trafikk, mønstre, rulling på skjerm." },
    { _type: "symptomItem", title: "Verre av bevegelse", text: "Både egen bevegelse og det å bli kjørt i bil eller tog." },
  ],
  symptomsAfter: "Mange blir slitne, anspente og bekymret over plagene. Det er en naturlig reaksjon, og kan i seg selv forsterke symptomene.",
  warningHeading: "Andre årsaker må vurderes",
  warningIntro: "Søk akutt medisinsk hjelp (113) ved ny svimmelhet sammen med lammelser, talevansker, dobbeltsyn, plutselig kraftig hodepine eller plutselig manglende evne til å gå.",
  warningAfter: "PPPD er en diagnose som krever at andre årsaker er vurdert. Ustøhet som stadig forverres, nye nevrologiske symptomer, hørselstap eller fall bør alltid undersøkes av lege.",
  backgroundHeading: "Hvem får PPPD?",
  backgroundIntro: [
    block("PPPD er en av de vanligste årsakene til langvarig svimmelhet. Den rammer oftest voksne i middel alder, og noe oftere kvinner. [SJEKK: ønsker du å oppgi tall?]"),
    block("Vanlige utløsende hendelser:"),
  ],
  backgroundChips: ["Krystallsyke", "Vestibulær nevritt", "Vestibulær migrene", "Hjernerystelse", "Panikkanfall eller perioder med mye angst", "Annen akutt sykdom som ga svimmelhet"],
  backgroundAfter: "Et engstelig temperament og mye stress kan gjøre det mer sannsynlig at alarmen blir stående på. Det betyr ikke at plagene er «psykiske».",
  examinationHeading: "Diagnosen stilles ut fra mønsteret",
  examinationSteps: [
    { _type: "examinationStep", title: "Sykehistorie", text: "hva startet det, og hva gjør det bedre eller verre?" },
    { _type: "examinationStep", title: "Undersøkelse av balansesystemet", text: "øyebevegelser, posisjonstester og balanse" },
    { _type: "examinationStep", title: "Utelukke aktiv sykdom", text: "for eksempel krystallsyke som fortsatt er aktiv" },
    { _type: "examinationStep", title: "Forklaring og plan", text: "forstå tilstanden og lag en plan for opptrening" },
  ],
  examinationAfter: "Det er vanlig å ha PPPD samtidig med en annen tilstand, for eksempel krystallsyke eller vestibulær migrene. Da må begge behandles.",
  treatmentHeading: "Å skru ned alarmen, gradvis",
  treatmentCards: [
    { _type: "treatmentCard", kicker: "Grunnmur", title: "Forståelse", text: "Å vite hva PPPD er, og at det ikke er farlig, er en viktig del av behandlingen i seg selv." },
    { _type: "treatmentCard", kicker: "Kjernen", title: "Vestibulær rehabilitering", text: "Gradvis tilvenning til bevegelse og visuelle omgivelser som i dag gir plager. Målet er å trene systemet tilbake til en mer avslappet, automatisk balanse. Øvelsene skal utfordre litt, men ikke gi kraftige symptomer." },
    { _type: "treatmentCard", kicker: "Ved behov", title: "Kognitiv atferdsterapi", text: "Hjelper mange med å bryte sirkelen av oppmerksomhet, bekymring og unngåelse." },
    { _type: "treatmentCard", kicker: "Via lege", title: "Medisiner", text: "Noen får hjelp av medisiner (SSRI/SNRI) i lav dose. Dette vurderes av lege." },
  ],
  selfCareItems: [
    "Hold deg i aktivitet. Unngåelse gjør som regel plagene verre over tid",
    "Utsett deg gradvis for det som er vanskelig: kortere butikkbesøk først, så lengre",
    "Gå turer ute, gjerne på varierende underlag",
    "Pust rolig og slipp spenningen i kroppen når ustøheten kommer",
    "Regn med gode og dårlige dager. Se på utviklingen over uker, ikke dager",
  ],
  selfCareFeaturedExercise: { _type: "reference", _ref: "exercise-gradvis-eksponering" },
  prognosisHeading: "Hva kan du forvente?",
  prognosisBody: "Bedringen ved PPPD skjer ofte gradvis, over uker og måneder. De fleste blir tydelig bedre med riktig behandling, og mange blir helt eller nesten helt symptomfrie. Tålmodighet og jevn trening er nøkkelen.",
  faq: [
    { _type: "diagnosisFaqItem", question: "Er PPPD psykisk?", answer: "Nei. PPPD er en funksjonell tilstand i balansesystemet. Stress og bekymring kan påvirke den, slik de påvirker mange tilstander, men plagene er reelle." },
    { _type: "diagnosisFaqItem", question: "Hvorfor er undersøkelsene mine normale?", answer: "Ved PPPD er det ingen skade på organene. Det er samspillet i balansesystemet som er forstyrret. Normale funn er typisk." },
    { _type: "diagnosisFaqItem", question: "Kan jeg få PPPD etter krystallsyke?", answer: "Ja, krystallsyke er en av de vanligste utløsende hendelsene." },
    { _type: "diagnosisFaqItem", question: "Blir jeg noen gang frisk?", answer: "De fleste blir tydelig bedre med behandling. Bedringen tar tid og kommer gjerne gradvis." },
    { _type: "diagnosisFaqItem", question: "Bør jeg unngå det som gjør meg svimmel?", answer: "Nei, ikke på lang sikt. Gradvis og kontrollert eksponering er en del av behandlingen." },
    { _type: "diagnosisFaqItem", question: "Hva er forskjellen på PPPD og restsvimmelhet?", answer: "Restsvimmelhet etter krystallsyke går som regel over i løpet av dager til uker. Varer ustøheten i tre måneder eller mer, og har den typiske kjennetegn, kan det være PPPD. → Lenke: Restsvimmelhet etter krystallsyke" },
  ],
  ctaHeading: "Få hjelp med langvarig svimmelhet",
  ctaText: "En grundig undersøkelse kan avklare om plagene passer med PPPD, om noe fortsatt er aktivt, og hvordan du trygt kan trene deg bedre.",
  relatedArticles: [{ _type: "reference", _ref: "blogPost-restsvimmelhet-etter-krystallsyke" }],
};

// --- 5. Nakkesvimmelhet ---
const diagnosisNakkesvimmelhet = {
  _id: "drafts.diagnosis-nakkesvimmelhet",
  _type: "diagnosisPage",
  title: "Nakkesvimmelhet",
  slug: { _type: "slug", current: "nakkesvimmelhet" },
  order: 4,
  hasOwnPage: false,
  seoTitle: "Nakkesvimmelhet: når nakken gir ustøhet | Krystallsykehjelpen",
  seoDescription: "Kan nakken gi svimmelhet? Les om nakkesvimmelhet (cervikogen svimmelhet), hvordan den skilles fra andre årsaker og hvordan den behandles.",
  cardShortDescription: "Ustøhet eller uvelhet som henger sammen med nakkeplager. Nakken sender signaler som hjernen bruker til balansen, og når de forstyrres, kan man bli ustø.",
  cardChips: ["Følger nakkesmerter", "Ustøhet, sjelden snurring", "Andre årsaker utelukkes først"],
  cardWizardQuote: "Jeg blir ustø eller uvel når nakken er stiv og vond, eller når jeg beveger nakken.",
  heroEyebrow: "Nakkesvimmelhet",
  heroHeading: "Nakkesvimmelhet: når nakken påvirker balansen",
  heroLead: "Nakken sender hele tiden informasjon til hjernen om hvor hodet er i forhold til kroppen. Når nakken er vond eller stiv, kan signalene bli forstyrret og gi en følelse av ustøhet. Nakkesvimmelhet kan behandles, men andre årsaker må vurderes først.",
  heroFacts: [
    { _type: "heroFact", title: "Ustøhet", text: "Sjelden snurring" },
    { _type: "heroFact", title: "Følger nakken", text: "Kommer og går med nakkeplagene" },
    { _type: "heroFact", title: "Kan behandles", text: "Nakke- og balansetrening" },
  ],
  understandEyebrow: "01 · Forstå tilstanden",
  understandHeading: "Hvordan kan nakken gi svimmelhet?",
  understandBody: [
    block("Musklene og leddene i den øvre delen av nakken er fulle av små sensorer som registrerer stilling og bevegelse. Hjernen bruker denne informasjonen sammen med signaler fra det indre øret og øynene for å holde balansen."),
    block("Ved smerter, stivhet eller etter en skade, for eksempel en nakkesleng, kan signalene fra nakken bli upresise. Når de ikke stemmer med signalene fra øret og øynene, kan det gi ustøhet, uvelhet eller en følelse av å være «ute av seg selv»."),
    block("Nakkesvimmelhet (cervikogen svimmelhet) er en diagnose som stilles når andre årsaker er utelukket. Den er fortsatt omdiskutert i fagmiljøet, fordi det ikke finnes noen sikker test for den. [SJEKK: ønsker du å beholde denne åpenheten? Anbefales for troverdighetens skyld.]"),
  ],
  symptomsHeading: "Slik oppleves nakkesvimmelhet",
  symptomsItems: [
    { _type: "symptomItem", title: "Ustøhet og uvelhet", text: "Oftere en gyngende eller «tåkete» følelse enn kraftig snurring." },
    { _type: "symptomItem", title: "Samtidig med nakkesmerter", text: "Svimmelheten kommer og går sammen med nakkeplagene." },
    { _type: "symptomItem", title: "Utløses av nakkebevegelser", text: "Eller av å holde nakken i samme stilling lenge, for eksempel ved skjermarbeid." },
    { _type: "symptomItem", title: "Ofte med hodepine", text: "Mange har også stivhet og hodepine som starter i nakken." },
  ],
  warningHeading: "Når det ikke bør forklares som nakkesvimmelhet",
  warningIntro: "Søk akutt medisinsk hjelp (113) ved:",
  warningItems: [
    "ny, kraftig nakkesmerte eller hodepine, særlig etter et slag, fall eller brå bevegelse, sammen med svimmelhet",
    "lammelser, nummenhet i ansiktet, talevansker, svelgevansker eller dobbeltsyn",
    "plutselig manglende evne til å gå eller stå",
  ],
  warningAfter:
    "Dette kan i sjeldne tilfeller være tegn på skade på en blodåre i nakken, og skal alltid undersøkes akutt.\n\nSvimmelhet som kommer av å legge seg ned eller snu seg i sengen, passer oftere med krystallsyke enn med nakkesvimmelhet.",
  backgroundHeading: "Hvem får nakkesvimmelhet?",
  backgroundIntro: [
    block("Nakkesvimmelhet ses oftest hos personer med:"),
    bulletBlock("Nakkesleng (whiplash) eller annen skade mot hode og nakke"),
    bulletBlock("Langvarige nakkesmerter"),
    bulletBlock("Mye statisk arbeid, for eksempel foran skjerm"),
    bulletBlock("Hjernerystelse, der nakken ofte også er påvirket"),
  ],
  examinationHeading: "Å skille nakken fra øret",
  examinationIntro: "Fordi krystallsyke, vestibulær migrene og nakkeplager kan gi overlappende symptomer, må undersøkelsen være grundig.",
  examinationSteps: [
    { _type: "examinationStep", title: "Sykehistorie", text: "når kommer svimmelheten, og henger den sammen med nakken?" },
    { _type: "examinationStep", title: "Posisjonstester", text: "for å utelukke krystallsyke" },
    { _type: "examinationStep", title: "Undersøkelse av nakken", text: "bevegelighet, muskulatur og stillingssans" },
    { _type: "examinationStep", title: "Øyebevegelser og balanse", text: "for å vurdere samspillet mellom nakke, øyne og indre øre" },
  ],
  examinationAfter: "Et viktig skille: Ved krystallsyke er det hodets stilling i forhold til tyngdekraften som utløser svimmelheten. Ved nakkesvimmelhet er det nakkens bevegelse og stilling.",
  treatmentHeading: "Behandling av nakke og balanse sammen",
  treatmentCards: [
    { _type: "treatmentCard", title: "Behandling av nakken", text: "Manuell behandling og bløtvevsbehandling kan redusere smerter og stivhet. [SJEKK: ordlyd om egen behandling]" },
    { _type: "treatmentCard", title: "Trening av stillingssansen", text: "Øvelser som trener nakkens evne til å vite hvor hodet er, for eksempel å finne tilbake til midtstilling med lukkede øyne." },
    { _type: "treatmentCard", title: "Øye- og balansetrening", text: "Blikkstabilisering og balanseøvelser som får nakke, øyne og indre øre til å samarbeide igjen." },
    { _type: "treatmentCard", title: "Styrke og utholdenhet", text: "Gradvis styrketrening for dype nakkemuskler og skuldre." },
  ],
  selfCareItems: [
    "Varier arbeidsstillingen og ta korte pauser fra skjermen",
    "Beveg nakken rolig i alle retninger flere ganger om dagen",
    "Gå turer og hold deg i aktivitet",
    "Legg skjermen i øyehøyde",
  ],
  selfCareFeaturedExercise: { _type: "reference", _ref: "exercise-blikkstabilisering" },
  prognosisHeading: "Hva kan du forvente?",
  prognosisBody: "Nakkesvimmelhet bedres ofte i takt med nakkeplagene. Kombinasjonen av behandling av nakken og målrettet trening gir best resultater, og mange merker bedring i løpet av noen uker.",
  faq: [
    { _type: "diagnosisFaqItem", question: "Kan nakken virkelig gi svimmelhet?", answer: "Ja, nakken bidrar til balansen. Men fordi det ikke finnes noen sikker test, må andre årsaker alltid vurderes først." },
    { _type: "diagnosisFaqItem", question: "Hvordan vet jeg om det er nakken eller krystallsyke?", answer: "Krystallsyke gir korte snurreanfall når du legger deg ned, snur deg i sengen eller ser opp. Nakkesvimmelhet gir oftere ustøhet som følger nakkesmertene. Posisjonstester kan skille dem." },
    { _type: "diagnosisFaqItem", question: "Er det farlig å knekke nakken når jeg er svimmel?", answer: "Ny svimmelhet sammen med ny, kraftig nakkesmerte skal vurderes av lege før manuell behandling. [SJEKK: ønsker du dette spørsmålet med?]" },
    { _type: "diagnosisFaqItem", question: "Kan jeg få nakkesvimmelhet etter whiplash?", answer: "Ja, det er en av de vanligste bakgrunnene." },
    { _type: "diagnosisFaqItem", question: "Hjelper øvelser?", answer: "Ja. Trening av stillingssans, blikk og balanse er en sentral del av behandlingen." },
  ],
  ctaHeading: "Få undersøkt nakke og balanse",
  ctaText: "En grundig undersøkelse kan avklare om svimmelheten kommer fra nakken, det indre øret eller noe annet, og hvilken behandling som passer.",
};

async function run() {
  const docs: Record<string, any>[] = [
    svimmelhetPage,
    diagnosisKrystallsyke,
    diagnosisVestibulaerMigrene,
    diagnosisPppd,
    diagnosisNakkesvimmelhet,
  ];
  for (const doc of docs) {
    const result = await client.createIfNotExists(doc);
    console.log(`${result._id === doc._id ? "OK" : "?"} ${doc._id} (${doc._type})`);
  }
  console.log("\nFerdig. Ingenting er publisert — åpne Studio → «Svimmelhet» for å se utkastene.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
