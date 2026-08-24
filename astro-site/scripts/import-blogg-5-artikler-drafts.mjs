// Engangsskript: importerer 5 fagartikler (fra
// /Users/marie/Downloads/Krystallsykehjelpen-blogg-prompt-KLAR.md) som Sanity
// DRAFTS (_id prefikset "drafts.") — IKKE publiserte dokumenter. Drafts er
// usynlige for det offentlige API-et (sanity:client) og trigger derfor ikke
// Sanity→Vercel-deploywebhooken. Kun synlige lokalt via blogPreviewClient
// (npm run dev med SANITY_API_WRITE_TOKEN i .env).
//
// Bilder er IKKE lastet opp ennå (venter på assets-mappen fra Marie) —
// coverImage står tom, MediaPlaceholder vises i mellomtiden.
//
// Kjør med: node scripts/import-blogg-5-artikler-drafts.mjs
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

function body(...parts) {
  return parts.flatMap((p) => (Array.isArray(p) ? p : [p]));
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

const articles = [
  {
    slug: "svimmel-nar-du-snur-deg-i-sengen",
    title: "Svimmel når du snur deg i sengen? Dette kan være krystallsyke",
    category: "Krystallsyke",
    metaTitle: "Svimmel når du snur deg i sengen?",
    excerpt: "Blir du svimmel når du legger deg ned eller snur deg i sengen? Les om det typiske mønsteret ved krystallsyke, hvordan det undersøkes og når du bør søke hjelp.",
    shortSummary: "Krystallsyke gir vanligvis korte anfall av karusellsvimmelhet når hodet flyttes i bestemte retninger i forhold til tyngdekraften. Typiske situasjoner er å snu seg i sengen, legge seg bakover, se opp eller bøye seg frem. Diagnosen kan ikke avgjøres sikkert ut fra symptomene alene; riktig posisjonstest og vurdering av nystagmus er sentralt.",
    warningBox: "Kontakt akutt helsehjelp ved ny, kraftig eller vedvarende svimmelhet sammen med for eksempel lammelse eller nummenhet i ansikt/arm/ben, talevansker, dobbeltsyn, ny alvorlig hodepine, besvimelse, uttalte gangvansker eller plutselig hørselstap. Dette er ikke det vanlige mønsteret ved ukomplisert krystallsyke.",
    body: body(
      block("Et typisk mønster ved krystallsyke", "h2"),
      block("Mange beskriver den samme situasjonen: De legger seg ned eller snur seg mot én side, og etter et lite øyeblikk begynner rommet å gå rundt. Selve karusellfølelsen varer ofte bare noen sekunder. Når hodet ligger stille, roer den seg igjen."),
      block("Vanlige utløsende bevegelser er:"),
      bullet("å snu seg mot høyre eller venstre i sengen"),
      bullet("å legge seg ned eller sette seg opp"),
      bullet("å bøye hodet bakover, for eksempel hos frisøren eller tannlegen"),
      bullet("å se opp i et skap"),
      bullet("å bøye seg ned mot gulvet"),
      block("Noen blir kvalme, mens andre først og fremst kjenner et kort sug, fallfølelse eller en bølge gjennom kroppen. Etter anfallet kan man føle seg litt ustø eller uvel, selv om den kraftige rotasjonen har gitt seg."),

      block("Hvorfor oppstår svimmelheten når hodet beveges?", "h2"),
      block("I det indre øret sitter balanseorganet. Små kalkpartikler, ofte kalt krystaller eller øresteiner, hører normalt hjemme i utriculus. Ved krystallsyke har noen av partiklene løsnet og kommet inn i en buegang."),
      block("Når hodet endrer stilling, kan partiklene flytte på væsken i buegangen. Da sendes et signal om bevegelse fra det ene øret som ikke stemmer med signalene fra det andre øret, synet og kroppen. Hjernen tolker denne midlertidige ubalansen som bevegelse, selv om du ligger stille."),
      block("Dette forklarer også hvorfor svimmelheten vanligvis er kortvarig: Når partiklene og væsken faller til ro, avtar det feilaktige bevegelsessignalet."),

      block("Det er ikke all svimmelhet i sengen som er krystallsyke", "h2"),
      block("At svimmelheten kommer i sengen, er et viktig spor, men ikke en ferdig diagnose. Vestibulær migrene kan også gi stillingsfølsomhet. Blodtrykksfall gir oftere svimmelhet når man reiser seg opp enn når man ruller fra side til side. Vedvarende ustøhet, visuell svimmelhet eller svimmelhet som varer lenge av gangen kan peke mot andre deler av balansesystemet."),
      block("Det er særlig viktig å få en ny vurdering dersom:"),
      bullet("svimmelheten varer sammenhengende i timer eller dager"),
      bullet("mønsteret ikke er tydelig knyttet til bestemte hodeposisjoner"),
      bullet("det samtidig oppstår ny hørselspåvirkning, kraftig hodepine eller nevrologiske symptomer"),
      bullet("gjentatte manøvre ikke endrer symptomene"),

      block("Slik undersøkes stillingsutløst svimmelhet", "h2"),
      block("En grundig undersøkelse begynner med en presis beskrivelse av når svimmelheten kommer, hvor lenge den varer, og om det er én retning som utløser mer enn andre."),
      block("Ved mistanke om bakre buegang brukes vanligvis Dix-Hallpike-test. Dersom historien passer med krystallsyke, men denne testen er negativ eller viser et annet mønster, bør også den horisontale buegangen vurderes med en rulletest i ryggleie."),
      block("Under testen ser behandleren etter nystagmus - ufrivillige øyebevegelser som kan vise hvilken buegang og side som påvirkes. VNG-briller kan gjøre svake øyebevegelser lettere å se fordi øynene registreres i mørke og uten et fast blikkpunkt."),

      block("Hva kan hjelpe?", "h2"),
      block("Ved bekreftet krystallsyke behandles tilstanden vanligvis med en reposisjoneringsmanøver. Hensikten er å føre partiklene ut av den påvirkede buegangen og tilbake til et område der de ikke lenger utløser svimmelhet."),
      block("Epleys manøver brukes ofte ved krystallsyke i bakre buegang. Ved horisontal buegang benyttes andre manøvre. Derfor er det en fordel å vite hvilken side og buegang som faktisk er rammet før man gjentar egenbehandling."),
      block("De fleste kan være i vanlig, rolig aktivitet etter behandling. Det kan være fornuftig å ta det litt med ro dersom man er kvalm eller ustø, men langvarig bevegelsesunngåelse kan gjøre kroppen mer usikker på bevegelse."),
    ),
    faq: faqItems([
      ["Kan krystallsyke bare komme på én side?", "Ja, ofte er én buegang i ett øre påvirket. Det kan likevel forekomme funn i flere bueganger eller på begge sider. Symptomene alene viser ikke alltid sikkert hvilken side som er rammet."],
      ["Hvor lenge varer anfallet?", "Ved typisk krystallsyke er den kraftigste rotasjonen kort, ofte under ett minutt når hodet holdes stille. Kvalme eller ustøhet kan vare lenger."],
      ["Kan krystallsyke gå over av seg selv?", "Ja, hos noen avtar tilstanden spontant. En riktig valgt reposisjoneringsmanøver kan imidlertid gi raskere bedring, og undersøkelsen kan samtidig avklare om det faktisk er krystallsyke."],
      ["Bør jeg gjøre Epleys manøver med en gang?", "Epleys manøver er laget for en bestemt variant av krystallsyke. Dersom side eller buegang er usikker, eller du har nakke-/ryggproblemer som gjør stillingene vanskelige, bør du få veiledning før du gjør manøveren på egen hånd."],
    ]),
    sources: sourceItems([
      ["Bhattacharyya N, et al. Clinical Practice Guideline: Benign Paroxysmal Positional Vertigo (Update). 2017.", "https://pubmed.ncbi.nlm.nih.gov/28248609/"],
      ["von Brevern M, et al. Benign paroxysmal positional vertigo: Diagnostic criteria. Bárány Society. 2015.", "https://pubmed.ncbi.nlm.nih.gov/26756126/"],
      ["Hilton MP, Pinder DK. The Epley manoeuvre for benign paroxysmal positional vertigo. Cochrane review.", "https://pubmed.ncbi.nlm.nih.gov/25485940/"],
    ]),
    relatedLinks: relatedItems([
      ["Hovedartikkelen om krystallsyke", "/krystallsyken/"],
      ["Epleys manøver", "/ovelsesbibliotek/bakre-buegang/"],
      ["Epleys manøver virker ikke – hva kan være årsaken?", "/blogg/epleys-manover-virker-ikke/"],
      ["Hvorfor kommer krystallsyken tilbake?", "/blogg/hvorfor-kommer-krystallsyken-tilbake/"],
    ]),
  },

  {
    slug: "epleys-manover-virker-ikke",
    title: "Epleys manøver virker ikke - hva kan være årsaken?",
    category: "Behandling av krystallsyke",
    metaTitle: "Epleys manøver virker ikke - hva nå?",
    excerpt: "Fortsatt svimmel etter Epleys manøver? Les hvorfor manøveren ikke alltid hjelper, når den bør gjentas og når diagnosen eller buegangen bør vurderes på nytt.",
    shortSummary: "Epleys manøver er ikke en generell øvelse mot all svimmelhet. Den er utviklet for en bestemt type krystallsyke. Dersom du fortsatt er svimmel, bør neste steg være ny vurdering av symptomene og posisjonstestene - ikke nødvendigvis stadig flere manøvre på tilfeldig side.",
    warningBox: "Søk akutt vurdering ved vedvarende, ny og kraftig svimmelhet sammen med nevrologiske symptomer, dobbeltsyn, talevansker, ny uttalt gangsvikt, besvimelse, plutselig hørselstap eller en ny alvorlig hodepine. Slike symptomer skal ikke forklares med manglende effekt av Epleys manøver.",
    body: body(
      block("Epley virker godt når diagnosen passer", "h2"),
      block("Ved typisk krystallsyke i bakre buegang kan Epleys manøver føre partiklene gjennom buegangen og ut igjen. Systematiske oversikter viser at manøveren er effektiv og vanligvis trygg ved denne varianten."),
      block("Men balansesystemet består av tre bueganger i hvert øre, og svimmelhet kan ha mange andre årsaker. Derfor er det flere gode forklaringer på at én bestemt manøver ikke gir forventet effekt."),

      block("1. Feil side er behandlet", "h2"),
      block("Det er ikke alltid mulig å avgjøre rammet side ut fra hvilken side som føles verst i sengen. Noen blir mest svimmel når de beveger seg bort fra den påvirkede siden, mens andre har uklare eller skiftende symptomer."),
      block("Retningen og mønsteret på nystagmus under posisjonstesting gir langt sikrere informasjon enn symptomet alene. Gjennomføres manøveren for feil side, flyttes ikke partiklene i riktig retning."),

      block("2. En annen buegang er påvirket", "h2"),
      block("Epleys manøver brukes først og fremst ved bakre buegang. Dersom partiklene ligger i den horisontale buegangen, er andre manøvre mer aktuelle. Horisontal krystallsyke kan gi kraftig svimmelhet ved vending i sengen og kan derfor lett forveksles med bakre buegang dersom man ikke undersøker øyebevegelsene."),
      block("Fremre buegang og kombinasjoner av flere bueganger er sjeldnere, men kan gi mer uvanlige testfunn og kreve en annen strategi."),

      block("3. Utførelsen eller bevegelsesbanen blir unøyaktig", "h2"),
      block("For at partiklene skal flyttes gjennom buegangen, må hodet gjennom en bestemt serie av vinkler. En pute som ligger feil, for små hodeutslag, for rask overgang eller at man ikke blir lenge nok i hver posisjon, kan redusere effekten."),
      block("Begrenset bevegelighet i nakke, rygg eller hofter kan gjøre en standard Epley vanskelig. Da kan stillingene tilpasses, eller en annen manøver velges. Målet er ikke å presse kroppen inn i smertefulle posisjoner."),

      block("4. Det trengs mer enn én behandling", "h2"),
      block("Selv ved riktig diagnose og korrekt utførelse blir ikke alle symptomfrie etter ett forsøk. Noen trenger en ny manøver samme dag eller ved en senere kontroll. Det betyr ikke nødvendigvis at behandlingen har mislyktes."),
      block("En retest er nyttig fordi den viser om nystagmus er borte, svakere, uendret eller har skiftet mønster. Det gir et bedre grunnlag for neste behandling enn å gjenta manøveren ut fra følelse alene."),

      block("5. Partiklene kan ha skiftet buegang", "h2"),
      block("En sjelden gang kan partiklene bevege seg fra én buegang til en annen under eller etter behandling. Dette kalles kanalbytte eller canal conversion. Da kan svimmelheten endre karakter, og posisjonstesten viser et annet øyebevegelsesmønster enn før."),
      block("Det er ikke farlig i seg selv, men den nye buegangen må identifiseres for at riktig manøver skal velges."),

      block("6. Krystallsyken er borte, men balansesystemet er fortsatt urolig", "h2"),
      block("Noen har negative posisjonstester etter behandlingen, men kjenner fortsatt bølgefølelse, ustøhet, bevegelsesømfintlighet eller visuell sensitivitet. Dette omtales ofte som restsvimmelhet."),
      block("I en slik situasjon vil flere Epley-manøvre ikke nødvendigvis hjelpe, fordi det ikke lenger er tegn til partikler i bakre buegang. Kroppen kan trenge tid, normal bevegelse og eventuelt tilpasset vestibulær rehabilitering."),
      block("Ved vedvarende plager bør også andre tilstander vurderes, blant annet vestibulær migrene, PPPD, vestibulær hypofunksjon og andre medisinske eller nevrologiske årsaker."),

      block("Hva bør du gjøre når Epley ikke hjelper?", "h2"),
      block("Det viktigste er å stoppe opp og stille tre spørsmål: Er det fortsatt et tydelig, kortvarig og stillingsutløst anfall? Er riktig side og buegang undersøkt? Viser retesten fortsatt et mønster som passer med aktiv krystallsyke?"),
      block("En ny klinisk vurdering kan avklare om manøveren bør gjentas, endres eller avsluttes. Ved gjentatte behandlingsforsøk uten endring bør diagnosen vurderes på nytt."),

      block("Kan det være skadelig å gjenta Epley mange ganger?", "h2"),
      block("Epleys manøver regnes som trygg når den brukes riktig, men gjentatt egenbehandling kan fremkalle kvalme, gjøre nakken irritert og skape mer usikkerhet dersom side eller diagnose er feil. Personer med enkelte nakke-, rygg-, kar- eller øyetilstander kan trenge en tilpasset undersøkelse."),
      block("Poenget er ikke at du aldri kan gjøre manøveren hjemme, men at hjemmebehandling fungerer best når diagnosen og siden allerede er avklart og du har fått tydelige instrukser."),
    ),
    faq: faqItems([
      ["Hvor mange ganger kan Epley gjentas?", "Det finnes ikke ett tall som passer alle. Ved bekreftet bakre buegang kan manøveren gjentas, men ved manglende effekt er retest og ny vurdering mer nyttig enn et høyt antall tilfeldige repetisjoner."],
      ["Kan jeg være svimmel dagen etter en vellykket behandling?", "Ja. Lett ustøhet, kvalme eller bevegelsesømfintlighet kan henge igjen, selv om den typiske posisjonsnystagmusen er borte. Kraftig eller annerledes svimmelhet bør vurderes på nytt."],
      ["Betyr manglende effekt at jeg ikke har krystallsyke?", "Ikke nødvendigvis. Det kan være feil side, feil buegang, behov for flere behandlinger eller en atypisk variant. Men andre diagnoser må vurderes når mønsteret ikke passer eller manøvrer ikke gir endring."],
      ["Må jeg sove sittende etter Epley?", "Rutinemessige strenge stillingsrestriksjoner ser ikke ut til å være avgjørende for effekten hos de fleste. Følg individuelle råd dersom behandlingen eller helsetilstanden din tilsier noe annet."],
    ]),
    sources: sourceItems([
      ["Bhattacharyya N, et al. Clinical Practice Guideline: Benign Paroxysmal Positional Vertigo (Update). 2017.", "https://pubmed.ncbi.nlm.nih.gov/28248609/"],
      ["Hilton MP, Pinder DK. The Epley manoeuvre for benign paroxysmal positional vertigo. Cochrane review.", "https://pubmed.ncbi.nlm.nih.gov/25485940/"],
      ["Hunt WT, et al. Modifications of the Epley manoeuvre for posterior canal BPPV.", "https://pubmed.ncbi.nlm.nih.gov/22513962/"],
      ["Kim YK, et al. Canal conversion between anterior and posterior semicircular canal in BPPV.", "https://pubmed.ncbi.nlm.nih.gov/23928513/"],
    ]),
    relatedLinks: relatedItems([
      ["Epleys manøver – trinn for trinn", "/ovelsesbibliotek/bakre-buegang/"],
      ["Krystallsyke i horisontal buegang", "/ovelsesbibliotek/horisontale-buegang/"],
      ["Krystallsyke eller vestibulær migrene?", "/blogg/krystallsyke-eller-vestibular-migrene/"],
      ["Svimmel når du snur deg i sengen?", "/blogg/svimmel-nar-du-snur-deg-i-sengen/"],
    ]),
  },

  {
    slug: "hvorfor-kommer-krystallsyken-tilbake",
    title: "Hvorfor kommer krystallsyken tilbake?",
    category: "Krystallsyke",
    metaTitle: "Hvorfor kommer krystallsyken tilbake?",
    excerpt: "Krystallsyke kan komme tilbake etter vellykket behandling. Les hva tilbakefall betyr, mulige risikofaktorer, hva du kan gjøre og når symptomene bør undersøkes på nytt.",
    shortSummary: "Krystallsyke har en kjent tendens til å komme tilbake. Ved nye symptomer bør man likevel ikke automatisk anta at det er nøyaktig samme problem som sist. En ny undersøkelse kan vise om krystallsyken faktisk er aktiv, og hvilken side og buegang som nå er påvirket.",
    warningBox: "Ny vedvarende svimmelhet med ansikts- eller kroppslammelse, talevansker, dobbeltsyn, kraftig ny hodepine, besvimelse, uttalt gangsvikt eller plutselig hørselstap bør vurderes raskt. Dette passer ikke med et ukomplisert BPPV-tilbakefall.",
    body: body(
      block("Tilbakefall er ikke det samme som restsvimmelhet", "h2"),
      block("Et tilbakefall innebærer at det typiske stillingsutløste mønsteret kommer tilbake etter en periode med klar bedring eller symptomfrihet. Du kan igjen oppleve korte anfall når du legger deg, snur deg i sengen, ser opp eller bøyer deg ned."),
      block("Restsvimmelhet er annerledes. Da er den kraftige karusellsvimmelheten ofte borte, mens en mer diffus ustøhet, bølgefølelse eller bevegelsesømfintlighet henger igjen. Posisjonstestene kan være negative. Forskjellen er viktig, fordi flere reposisjoneringsmanøvre ikke nødvendigvis hjelper mot restsymptomer."),

      block("Hvorfor kan krystallsyken oppstå på nytt?", "h2"),
      block("Behandlingen fører løse partikler ut av buegangen, men den endrer ikke nødvendigvis årsaken til at partiklene løsnet. Hos mange finner man ingen bestemt utløsende faktor. Det kan derfor løsne nye partikler senere."),
      block("Tilbakefall betyr ikke nødvendigvis at de samme partiklene har «rullet tilbake», at du sov feil, eller at behandlingen ble gjort dårlig. Krystallsyke kan oppstå på nytt etter uker, måneder eller år og kan sitte i en annen buegang enn ved forrige episode."),

      block("Hvem har lettere for å få tilbakefall?", "h2"),
      block("Forskningen viser sammenhenger mellom tilbakevendende krystallsyke og flere faktorer, men ingen av dem kan forutsi sikkert hvem som får en ny episode. Blant faktorene som er undersøkt er:"),
      bullet("økende alder"),
      bullet("migrene"),
      bullet("osteopeni eller osteoporose"),
      bullet("lavt vitamin D-nivå"),
      bullet("diabetes, høyt blodtrykk og forstyrrelser i fettstoffskiftet"),
      bullet("tidligere hodeskade eller enkelte sykdommer i det indre øret"),
      block("Dette betyr ikke at slike tilstander alltid er årsaken. Studiene er ulike, og flere sammenhenger påvirkes av alder, kjønn og generell helse. Risikofaktorer bør brukes til å stille bedre spørsmål - ikke til å gi pasienten skyld eller en forenklet forklaring."),

      block("Har vitamin D betydning?", "h2"),
      block("Flere studier har funnet en sammenheng mellom lave vitamin D-verdier og tilbakevendende krystallsyke. Kliniske studier og nyere oversikter tyder på at tilskudd kan redusere nye episoder hos noen personer som både har hyppige tilbakefall og påvist mangel eller lave nivåer."),
      block("Det betyr ikke at alle med krystallsyke bør starte høydose vitamin D. Ved gjentatte episoder kan det være fornuftig å diskutere måling og eventuell behandling med fastlegen, særlig dersom det også finnes risiko for beinskjørhet. Dosering bør tilpasses blodprøver, kosthold og øvrig helse."),

      block("Kan tilbakefall forebygges?", "h2"),
      block("Det finnes ingen metode som garantert hindrer ny krystallsyke. Mange blir redde for å snu hodet, ligge på en bestemt side eller trene etter en episode, men langvarig bevegelsesunngåelse kan føre til mer stivhet, usikkerhet og bevegelsesfølsomhet. Et fornuftig fokus er:"),
      bullet("gjenoppta vanlig aktivitet gradvis når den akutte svimmelheten er behandlet"),
      bullet("redusere fallrisiko mens du fortsatt er ustø"),
      bullet("få vurdert hyppige tilbakefall og relevante helseforhold"),
      bullet("lære hva som kjennetegner ditt typiske BPPV-mønster uten å forklare all senere svimmelhet som krystallsyke"),
      bullet("ha en plan for hvem du kontakter dersom symptomene kommer tilbake"),

      block("Hva gjør du når svimmelheten kommer tilbake?", "h2"),
      block("Legg merke til hvilke bevegelser som utløser anfallet, hvor lenge det varer, og om du har andre symptomer. En kort beskrivelse kan gjøre den nye undersøkelsen mer presis."),
      block("Selv om en hjemmemanøver hjalp forrige gang, kan side og buegang være annerledes nå. Dersom du er usikker, symptomene har endret karakter eller manøveren ikke hjelper, bør tilstanden undersøkes på nytt."),

      block("Når er det sannsynligvis noe annet enn et vanlig tilbakefall?", "h2"),
      block("Tenk bredere dersom svimmelheten er konstant, hovedsakelig utløses av butikker eller skjerm, varer i mange timer, ledsages av migrenesymptomer, kommer når du reiser deg, eller opptrer sammen med hørselstap eller andre nevrologiske symptomer."),
      block("Det er også mulig å ha mer enn én tilstand samtidig. En person kan for eksempel ha hatt krystallsyke og senere utvikle restsvimmelhet, vestibulær migrene eller PPPD."),
    ),
    faq: faqItems([
      ["Betyr tilbakefall at behandlingen ikke virket?", "Nei. Dersom symptomene og testfunnene forsvant etter behandling, kan den første episoden ha vært vellykket behandlet selv om nye partikler løsner senere."],
      ["Kommer krystallsyken alltid tilbake på samme side?", "Nei. Den kan oppstå i samme øre, i motsatt øre eller i en annen buegang. Derfor er ny testing nyttig."],
      ["Bør jeg gjøre øvelser hver dag for å forebygge?", "Rutinemessige reposisjoneringsmanøvre uten aktive funn er vanligvis ikke nødvendig. Vanlig fysisk aktivitet og eventuelle individuelt valgte balanseøvelser er noe annet enn å gjenta Epley forebyggende."],
      ["Når bør gjentatte episoder utredes nærmere?", "Ved hyppige tilbakefall, atypiske testfunn, hørselssymptomer, fall eller manglende effekt av riktige manøvre bør det gjøres en bredere vurdering."],
    ]),
    sources: sourceItems([
      ["Bhattacharyya N, et al. Clinical Practice Guideline: Benign Paroxysmal Positional Vertigo (Update). 2017.", "https://pubmed.ncbi.nlm.nih.gov/28248609/"],
      ["Yao Q, et al. Identifying key risk factors for recurrence of BPPV: systematic review and meta-analysis. 2025.", "https://pubmed.ncbi.nlm.nih.gov/40211383/"],
      ["Kim HJ, et al. Prevention of BPPV with vitamin D supplementation: randomized trial. 2020.", "https://pubmed.ncbi.nlm.nih.gov/32759193/"],
      ["Jeong SH, et al. Prevention of recurrent BPPV with vitamin D supplementation: meta-analysis.", "https://pubmed.ncbi.nlm.nih.gov/32767116/"],
    ]),
    relatedLinks: relatedItems([
      ["Epleys manøver virker ikke – hva kan være årsaken?", "/blogg/epleys-manover-virker-ikke/"],
      ["Krystallsyke eller vestibulær migrene?", "/blogg/krystallsyke-eller-vestibular-migrene/"],
      ["Svimmel når du snur deg i sengen?", "/blogg/svimmel-nar-du-snur-deg-i-sengen/"],
      ["Hovedartikkelen om krystallsyke", "/krystallsyken/"],
    ]),
  },

  {
    slug: "krystallsyke-eller-vestibular-migrene",
    title: "Krystallsyke eller vestibulær migrene? Slik skiller symptomene seg",
    category: "Årsaker til svimmelhet",
    metaTitle: "Krystallsyke eller vestibulær migrene?",
    excerpt: "Krystallsyke og vestibulær migrene kan begge gi svimmelhet ved bevegelse. Se forskjeller i varighet, triggere, ledsagende symptomer, testfunn og behandling.",
    shortSummary: "Krystallsyke gir vanligvis korte, tydelig stillingsutløste anfall og et karakteristisk nystagmusmønster i bestemte tester. Vestibulær migrene gir oftere episoder som varer fra minutter til timer, noen ganger dager, og kan være knyttet til lys- og lydfølsomhet, migrenehodepine, aura eller tidligere migrene. Tilstandene kan også forekomme samtidig.",
    warningBox: "Et kjent migrenemønster skal ikke brukes til å bortforklare helt nye nevrologiske symptomer. Søk akutt hjelp ved lammelse, talevansker, dobbeltsyn, ny uttalt gangsvikt, besvimelse, plutselig hørselstap eller en uvanlig og kraftig ny hodepine.",
    body: body(
      block("Hvorfor forveksles de?", "h2"),
      block("Vestibulær migrene trenger ikke gi hodepine under selve svimmelhetsanfallet. Noen får først og fremst bevegelsesfølsomhet, kvalme, rotasjon eller visuell svimmelhet. Anfallene kan provoseres av hodebevegelser og stillingsendringer, akkurat som ved krystallsyke."),
      block("Samtidig kan personer med krystallsyke bli kvalme, ustø og mer følsomme for bevegelse også mellom de korte anfallene. En enkel beskrivelse som «jeg blir svimmel når jeg beveger hodet» er derfor ikke nok til å skille dem."),

      block("Tidsmønsteret gir viktige spor", "h2"),
      block("Ved typisk krystallsyke kommer den sterkeste rotasjonen etter en bestemt stillingsendring og avtar når hodet ligger stille. Anfallet er som regel kort, ofte under ett minutt."),
      block("De internasjonale kriteriene for vestibulær migrene beskriver episoder som varer fra 5 minutter til 72 timer. Noen opplever flere ulike tidsmønstre, men plagene er vanligvis ikke begrenset til de få sekundene det tar før partikler i en buegang faller til ro."),

      block("Typiske trekk ved krystallsyke", "h2"),
      bullet("tydelig utløst av bestemte hodeposisjoner i forhold til tyngdekraften"),
      bullet("korte, gjentakbare anfall"),
      bullet("ofte sterkest ved å legge seg, snu seg i sengen, se opp eller bøye seg"),
      bullet("karakteristisk nystagmus i Dix-Hallpike- eller rulletest"),
      bullet("bedring når riktig buegang behandles med en reposisjoneringsmanøver"),
      block("Mellom anfallene kan man føle seg helt normal eller ha lettere restsvimmelhet og ustøhet."),

      block("Typiske trekk ved vestibulær migrene", "h2"),
      bullet("episoder med spontan, stillingsutløst eller visuelt utløst svimmelhet"),
      bullet("varighet fra minutter til timer, eventuelt opptil flere døgn"),
      bullet("tidligere eller nåværende migrene"),
      bullet("lysfølsomhet, lydfølsomhet, migrenelignende hodepine eller synsaura i forbindelse med minst noen av episodene"),
      bullet("kvalme, reisesyke og bevegelsesfølsomhet er vanlig"),
      bullet("undersøkelsen kan være normal mellom anfallene"),
      block("Vestibulær migrene er en klinisk diagnose. Det finnes ingen enkelt blodprøve, skanning eller balanseprøve som alene bekrefter tilstanden."),

      block("Hva viser posisjonstestene?", "h2"),
      block("Ved krystallsyke forventes et øyebevegelsesmønster som passer med planet og retningen til en bestemt buegang. Nystagmusen har vanligvis en gjenkjennelig retning, latenstid og utvikling i testposisjonen."),
      block("Vestibulær migrene kan også gi stillingsnystagmus, men mønsteret kan være mindre typisk, mer vedvarende eller ikke passe rent med én buegang. En normal test utelukker ikke vestibulær migrene, særlig hvis personen undersøkes mellom anfall."),
      block("Når «krystallsyke» ikke bedres etter korrekt utførte og gjentatte manøvre, er det derfor viktig å vurdere både testfunnene og hele sykehistorien på nytt."),

      block("Kan man ha begge deler samtidig?", "h2"),
      block("Ja. Migrene utelukker ikke krystallsyke, og et klassisk positivt posisjonstestmønster skal behandles som krystallsyke selv om personen også har migrene. Etter at BPPV-funnene er borte, kan det likevel gjenstå svimmelhet som passer bedre med migrene eller en annen tilstand."),
      block("Det er derfor mer presist å spørre «hvilken mekanisme forklarer symptomene akkurat nå?» enn å forsøke å plassere alle episoder i én diagnose."),

      block("Behandlingen er forskjellig", "h2"),
      block("Krystallsyke behandles med en manøver som er valgt for riktig side og buegang. Medisiner flytter ikke partiklene ut av buegangen."),
      block("Ved vestibulær migrene rettes behandlingen mot migrenemekanismen. Tiltak kan omfatte regelmessig søvn og måltider, tilpasset aktivitet, håndtering av individuelle triggere, vestibulær rehabilitering ved bevegelsesfølsomhet og forebyggende eller anfallsrettet medikamentell behandling vurdert av lege."),
      block("Behandling må tilpasses symptombyrde, øvrig helse og hvilke tiltak som allerede er forsøkt."),
    ),
    faq: faqItems([
      ["Må jeg ha hodepine for å ha vestibulær migrene?", "Nei. Diagnosen bygger på gjentatte vestibulære episoder, migrenehistorie og migrenetrekk i forbindelse med minst noen av episodene. Hodepine trenger ikke være til stede hver gang."],
      ["Kan vestibulær migrene bare komme når jeg snur meg i sengen?", "Den kan være stillingsfølsom, men et helt kort, svært gjentakbart anfall med typisk nystagmus peker mer mot krystallsyke. Tidsmønster og testfunn må vurderes samlet."],
      ["Hjelper Epleys manøver mot vestibulær migrene?", "Nei, ikke mot selve migrenemekanismen. Den kan likevel hjelpe dersom personen samtidig har bekreftet krystallsyke."],
      ["Kan VNG bekrefte vestibulær migrene?", "VNG kan dokumentere øyebevegelser og bidra i differensialdiagnostikken, men det finnes ikke ett VNG-funn som alene bekrefter vestibulær migrene."],
    ]),
    sources: sourceItems([
      ["Lempert T, et al. Vestibular migraine: Diagnostic criteria. Bárány Society and International Headache Society update.", "https://pubmed.ncbi.nlm.nih.gov/34719447/"],
      ["von Brevern M, et al. Benign paroxysmal positional vertigo: Diagnostic criteria. Bárány Society.", "https://pubmed.ncbi.nlm.nih.gov/26756126/"],
      ["Furman JM, Balaban CD. Vestibular migraine. Review.", "https://pubmed.ncbi.nlm.nih.gov/25728541/"],
      ["Bhattacharyya N, et al. Clinical Practice Guideline: BPPV (Update).", "https://pubmed.ncbi.nlm.nih.gov/28248609/"],
    ]),
    relatedLinks: relatedItems([
      ["Hovedartikkelen om krystallsyke", "/krystallsyken/"],
      ["Epleys manøver virker ikke – hva kan være årsaken?", "/blogg/epleys-manover-virker-ikke/"],
      ["Svimmel i butikker eller av skjerm?", "/blogg/svimmel-i-butikker-eller-av-skjerm/"],
      ["Hvorfor kommer krystallsyken tilbake?", "/blogg/hvorfor-kommer-krystallsyken-tilbake/"],
    ]),
  },

  {
    slug: "svimmel-i-butikker-eller-av-skjerm",
    title: "Svimmel i butikker, på skjerm eller blant mange mennesker?",
    category: "Visuell svimmelhet",
    metaTitle: "Svimmel i butikker eller av skjerm?",
    excerpt: "Blir du svimmel av butikkhyller, scrolling, skjerm eller folkemengder? Les om visuell svimmelhet, mulige årsaker og hvordan gradvis rehabilitering kan hjelpe.",
    shortSummary: "Balansen skapes i et samarbeid mellom synet, balanseorganene i det indre øret og informasjon fra muskler og ledd. Etter en svimmelhetsepisode kan dette samarbeidet bli mer sårbart. Visuelt travle omgivelser kan da utløse ustøhet, kvalme, tåkesyn, trykk i hodet eller en følelse av å svaie - uten at rommet nødvendigvis går rundt.",
    warningBox: "Søk rask medisinsk vurdering ved plutselig vedvarende svimmelhet med dobbeltsyn, talevansker, lammelse, ny uttalt gangsvikt, besvimelse, plutselig hørselstap eller en alvorlig ny hodepine. Nytt vedvarende synstap eller tydelig dobbeltsyn skal heller ikke forklares som vanlig skjermfølsomhet.",
    body: body(
      block("Hvordan kjennes visuell svimmelhet?", "h2"),
      block("Personer beskriver ofte at de fungerer greit i rolige omgivelser, men blir dårlige når det er mye å se på. Typiske situasjoner er:"),
      bullet("lange butikkganger med hyller på begge sider"),
      bullet("kjøpesentre, flyplasser og store åpne rom"),
      bullet("folkemengder der mange beveger seg i ulike retninger"),
      bullet("scrolling på mobil eller nettbrett"),
      bullet("raske klipp, dataspill eller bevegelige bilder på TV"),
      bullet("arbeid ved flere skjermer"),
      bullet("trafikk, mønstre, sterke kontraster eller flimrende lys"),
      block("Symptomene kan være ustøhet, bølgefølelse, kvalme, hodepress, konsentrasjonsvansker eller en følelse av at synet ikke klarer å «henge med». Noen må støtte seg til handlevognen eller gå ut av butikken for å hente seg inn."),

      block("Hvorfor kan synsinntrykk påvirke balansen?", "h2"),
      block("Hjernen vurderer hele tiden om det er du eller omgivelsene som beveger seg. Balansesystemet sammenligner informasjon fra øynene, det indre øret og kroppen."),
      block("Etter for eksempel krystallsyke, vestibulær nevritt, migrene eller hjernerystelse kan hjernen begynne å stole mer på synet enn tidligere. I rolige omgivelser fungerer dette godt. I en butikkgang eller ved scrolling strømmer det derimot inn store mengder visuell bevegelse. Når synet får for stor vekt i balansereguleringen, kan kroppen oppleve konflikt og svimmelhet."),
      block("Dette betyr ikke at symptomene er innbilte, og heller ikke nødvendigvis at det er noe galt med selve øynene. Problemet kan ligge i hvordan sanseinntrykkene vektes og bearbeides sammen."),

      block("Hvilke tilstander kan gi visuell svimmelhet?", "h2"),
      block("Visuell svimmelhet er et symptom som kan opptre ved flere tilstander."),
      block("Ved vedvarende postural-perseptuell svimmelhet, forkortet PPPD, er svimmelhet, ustøhet eller ikke-roterende vertigo til stede de fleste dager i minst tre måneder. Symptomene forverres typisk av oppreist stilling, bevegelse og komplekse eller bevegelige synsinntrykk. Tilstanden starter ofte etter en episode som har forstyrret balansen, for eksempel krystallsyke, vestibulær migrene eller vestibulær nevritt. PPPD er en positiv klinisk diagnose med definerte kriterier — det er ikke bare en diagnose man setter fordi alle tester er normale."),
      block("Vestibulær migrene kan gi uttalt lys-, bevegelses- og skjermfølsomhet. Symptomene kommer ofte mer episodisk enn ved PPPD og kan ledsages av migrenehodepine, lydfølsomhet, aura eller kvalme. Hodepine trenger ikke være til stede under alle episodene."),
      block("Visuell avhengighet kan også henge igjen etter at krystallsyke er behandlet eller etter en sykdom i balansenerven. Dersom posisjonstestene er negative, men butikker og bevegelse fortsatt er vanskelige, kan tilpasset rehabilitering være mer relevant enn flere reposisjoneringsmanøvre."),
      block("Nye briller, utfordringer med samsyn, enkelte medisiner, blodtrykksproblemer og nevrologiske tilstander kan også påvirke svimmelhet og visuell toleranse. Derfor bør man ikke konkludere med PPPD eller migrene uten en helhetlig vurdering."),

      block("Hva kan hjelpe?", "h2"),
      block("Behandlingen avhenger av årsaken. Et godt første steg er å avklare om det fortsatt finnes aktiv krystallsyke eller annen vestibulær sykdom, og om symptomene passer med migrene, PPPD eller en synsrelatert problemstilling."),
      block("Vestibulær rehabilitering kan inneholde gradvis eksponering for de synsinntrykkene som provoserer, kombinert med balanse-, blikkstabiliserings- og bevegelsesøvelser. Doseringen er viktig: Målet er en håndterbar symptomøkning som roer seg igjen, ikke å presse gjennom en kraftig forverring."),
      block("Ved vestibulær migrene kan migrenebehandling være nødvendig. Ved PPPD brukes ofte en kombinasjon av informasjon, gradert aktivitet, vestibulær rehabilitering og tiltak som reduserer frykt og unngåelse. Noen kan også ha nytte av psykologisk behandling eller medikamentell vurdering, men dette tilpasses individuelt."),

      block("Praktiske råd i butikk og på skjerm", "h2"),
      block("På kort sikt kan disse grepene gjøre situasjonen mer håndterbar:"),
      bullet("velg kortere butikkbesøk og roligere tidspunkt i starten"),
      bullet("fest blikket på et stabilt punkt når omgivelsene blir overveldende"),
      bullet("beveg hodet rolig og naturlig i stedet for å stivne helt"),
      bullet("ta korte pauser fra scrolling og raske bilder"),
      bullet("øk tekststørrelsen og reduser unødvendige animasjoner på skjermen"),
      bullet("bruk handlevogn som støtte ved behov, men arbeid gradvis mot mindre avhengighet når det er trygt"),
      bullet("øk varighet og kompleksitet trinnvis fremfor å unngå situasjonen helt"),
      block("Fullstendig unngåelse gir ofte kortvarig lettelse, men kan over tid gjøre hjernen enda mer følsom for de samme miljøene. Gradvis tilbakeføring bør likevel skje i et tempo kroppen tåler."),

      block("Når bør synet undersøkes?", "h2"),
      block("En synsvurdering kan være relevant ved ny dobbeltsynsfølelse, problemer med fokusskifte, uttalt øyetretthet, nylig endring av briller eller når lesing gir symptomer som ikke ligner resten av svimmelhetsmønsteret."),
      block("Samtidig kan normale øyeundersøkelser forekomme ved visuell svimmelhet. Et normalt syn betyr ikke at symptomene ikke er reelle; det kan bety at utfordringen ligger i samspillet mellom syn og balanse."),
    ),
    faq: faqItems([
      ["Er visuell svimmelhet det samme som PPPD?", "Nei. Visuell svimmelhet er et symptom. PPPD er en definert diagnose der vedvarende symptomer, varighet, triggere og funksjonspåvirkning må oppfylle bestemte kriterier."],
      ["Kan krystallsyke gjøre meg svimmel i butikker?", "Ja, noen blir visuelt følsomme etter en BPPV-episode, men aktiv krystallsyke kjennetegnes først og fremst av korte anfall i bestemte hodeposisjoner. Ved negative posisjonstester og vedvarende butikkfølsomhet bør andre mekanismer vurderes."],
      ["Bør jeg unngå skjerm til jeg er helt bra?", "Kortvarig reduksjon kan være nødvendig når symptomene er sterke. Langvarig full unngåelse er sjelden den beste veien tilbake. Gradvis og planlagt opptrapping fungerer ofte bedre."],
      ["Kan vestibulær rehabilitering gjøre meg litt svimmel?", "Ja. Øvelser er ofte laget for å utfordre systemet forsiktig. Symptomøkningen bør være moderat, forutsigbar og roe seg igjen. Ved kraftig eller langvarig forverring bør doseringen justeres."],
    ]),
    sources: sourceItems([
      ["Staab JP, et al. Diagnostic criteria for persistent postural-perceptual dizziness (PPPD). Bárány Society.", "https://pubmed.ncbi.nlm.nih.gov/29036855/"],
      ["Lempert T, et al. Vestibular migraine: Diagnostic criteria update.", "https://pubmed.ncbi.nlm.nih.gov/34719447/"],
      ["Popkirov S, et al. Persistent postural-perceptual dizziness: review and update.", "https://pubmed.ncbi.nlm.nih.gov/37775196/"],
      ["Hall CD, et al. Vestibular Rehabilitation for Peripheral Vestibular Hypofunction: Clinical Practice Guideline.", "https://pubmed.ncbi.nlm.nih.gov/34864777/"],
    ]),
    relatedLinks: relatedItems([
      ["Vestibulære øvelser og rehabilitering", "/ovelsesbibliotek/vestibular-rehab/"],
      ["Krystallsyke eller vestibulær migrene?", "/blogg/krystallsyke-eller-vestibular-migrene/"],
      ["Svimmel når du snur deg i sengen?", "/blogg/svimmel-nar-du-snur-deg-i-sengen/"],
      ["Hovedartikkelen om krystallsyke", "/krystallsyken/"],
    ]),
  },
];

async function run() {
  for (const article of articles) {
    const id = `drafts.blogPost-${article.slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "blogPost",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      category: article.category,
      metaTitle: article.metaTitle,
      excerpt: article.excerpt,
      shortSummary: article.shortSummary,
      body: article.body,
      warningBox: article.warningBox,
      faq: article.faq,
      sources: article.sources,
      relatedLinks: article.relatedLinks,
      author: { _type: "reference", _ref: "practitioner-marie-hermansen" },
      publishedDate: new Date().toISOString().slice(0, 10),
      // coverImage bevisst utelatt — bilder ettersendes, MediaPlaceholder
      // vises i mellomtiden (avklart med Marie).
    });
    console.log(`DRAFT opprettet: "${article.title}" (${id})`);
  }
  console.log(`\nFerdig! ${articles.length} artikler opprettet som Sanity-drafts (upubliserte).`);
  console.log("De er kun synlige lokalt via `npm run dev` (blogPreviewClient) — ikke i produksjon, og trigger ikke deploy-webhooken.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
