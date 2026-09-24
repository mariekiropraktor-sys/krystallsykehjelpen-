import { defineField, defineType } from "sanity";

// Diagnoseside-dokument for /svimmelhet/[slug]/-malen (og for kort/veiviser
// på oversiktssiden /svimmelhet/). Alle seksjonsfelt er valgfrie — en
// seksjon uten innhold skjules på siden (se src/pages/svimmelhet/[slug]/
// index.astro). Krystallsyke har et eget dokument her KUN for kort-/
// veiviserfeltene (hasOwnPage: true, ownPagePath peker til den eksisterende,
// urørte /svimmelhet/krystallsyke/-siden) — den bygger ikke sin egen side
// via denne malen.

function titleTextPair(name, groupName) {
  return {
    type: "object",
    name,
    group: groupName,
    fields: [
      defineField({ name: "title", title: "Tittel", type: "string" }),
      defineField({ name: "text", title: "Tekst", type: "text", rows: 3 }),
    ],
    preview: { select: { title: "title" } },
  };
}

export default defineType({
  name: "diagnosisPage",
  title: "Diagnoseside",
  type: "document",
  groups: [
    { name: "grunnleggende", title: "Grunnleggende", default: true },
    { name: "seo", title: "SEO" },
    { name: "card", title: "Kort/veiviser" },
    { name: "hero", title: "Hero" },
    { name: "understand", title: "Forstå tilstanden" },
    { name: "symptoms", title: "Kjennetegn" },
    { name: "warning", title: "Viktig å vite" },
    { name: "background", title: "Bakgrunn" },
    { name: "examination", title: "Undersøkelse" },
    { name: "treatment", title: "Behandling" },
    { name: "selfCare", title: "Dette kan du gjøre selv" },
    { name: "prognosis", title: "Forløp" },
    { name: "faq", title: "Spørsmål og svar" },
    { name: "related", title: "Relatert" },
    { name: "cta", title: "Få hjelp (CTA)" },
  ],
  fields: [
    // --- Grunnleggende ---
    defineField({ name: "title", title: "Tittel", type: "string", group: "grunnleggende", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, group: "grunnleggende", validation: (Rule) => Rule.required() }),
    defineField({ name: "order", title: "Rekkefølge", type: "number", group: "grunnleggende" }),
    defineField({
      name: "hasOwnPage",
      title: "Har egen, separat side",
      description: "Sett kun for krystallsyke — siden bygges ikke via denne malen, kun kort-/veiviserfeltene under brukes.",
      type: "boolean",
      initialValue: false,
      group: "grunnleggende",
    }),
    defineField({
      name: "ownPagePath",
      title: "Sti til den separate siden",
      description: 'F.eks. "/svimmelhet/krystallsyke/". Vises kun når "Har egen side" er på.',
      type: "string",
      group: "grunnleggende",
      hidden: ({ document }) => !document?.hasOwnPage,
    }),

    // --- SEO ---
    defineField({ name: "seoTitle", title: "SEO-tittel", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "Metabeskrivelse", type: "text", rows: 2, group: "seo" }),

    // --- Kort/veiviser (brukes på oversiktssiden) ---
    defineField({ name: "cardShortDescription", title: "Kortbeskrivelse", type: "text", rows: 3, group: "card" }),
    defineField({
      name: "cardChips",
      title: "Stikkord (maks 3)",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(3),
      group: "card",
    }),
    defineField({
      name: "cardWizardQuote",
      title: "Veiviser-setning",
      description: "Vist i «Hvordan kjennes svimmelheten?»-veiviseren på oversiktssiden",
      type: "text",
      rows: 2,
      group: "card",
    }),
    defineField({ name: "cardImage", title: "Kortbilde", type: "image", group: "card" }),

    // --- Hero ---
    defineField({ name: "heroEyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeading", title: "H1", type: "string", group: "hero" }),
    defineField({ name: "heroLead", title: "Ingress", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "heroFacts",
      title: "Faktastripe (3 stk)",
      type: "array",
      of: [titleTextPair("heroFact", "hero")],
      validation: (Rule) => Rule.max(3),
      group: "hero",
    }),
    defineField({ name: "heroImage", title: "Hero-bilde", type: "image", group: "hero" }),

    // --- Forstå tilstanden ---
    defineField({ name: "understandEyebrow", title: "Eyebrow", type: "string", group: "understand" }),
    defineField({ name: "understandHeading", title: "Overskrift", type: "string", group: "understand" }),
    defineField({ name: "understandPullQuote", title: "Uthevet sitat", type: "text", rows: 2, group: "understand" }),
    defineField({ name: "understandBody", title: "Brødtekst", type: "array", of: [{ type: "block" }], group: "understand" }),

    // --- Kjennetegn ---
    defineField({ name: "symptomsHeading", title: "Overskrift", type: "string", group: "symptoms" }),
    defineField({ name: "symptomsItems", title: "Kjennetegn", type: "array", of: [titleTextPair("symptomItem", "symptoms")], group: "symptoms" }),
    defineField({ name: "symptomsAfter", title: "Avsluttende tekst", type: "text", rows: 2, group: "symptoms" }),

    // --- Viktig å vite ---
    defineField({ name: "warningHeading", title: "Overskrift", type: "string", group: "warning" }),
    defineField({ name: "warningIntro", title: "Ingress", type: "text", rows: 2, group: "warning" }),
    defineField({ name: "warningItems", title: "Punkter", type: "array", of: [{ type: "string" }], group: "warning" }),
    defineField({ name: "warningAfter", title: "Avsluttende tekst", type: "text", rows: 2, group: "warning" }),

    // --- Bakgrunn ---
    defineField({ name: "backgroundHeading", title: "Overskrift", type: "string", group: "background" }),
    defineField({ name: "backgroundIntro", title: "Ingress", type: "array", of: [{ type: "block" }], group: "background" }),
    defineField({ name: "backgroundChips", title: "Stikkord", type: "array", of: [{ type: "string" }], group: "background" }),
    defineField({ name: "backgroundAfter", title: "Avsluttende tekst", type: "text", rows: 2, group: "background" }),

    // --- Undersøkelse ---
    defineField({ name: "examinationHeading", title: "Overskrift", type: "string", group: "examination" }),
    defineField({ name: "examinationIntro", title: "Ingress", type: "text", rows: 2, group: "examination" }),
    defineField({ name: "examinationSteps", title: "Steg", type: "array", of: [titleTextPair("examinationStep", "examination")], group: "examination" }),
    defineField({ name: "examinationAfter", title: "Avsluttende tekst", type: "text", rows: 2, group: "examination" }),

    // --- Behandling ---
    defineField({ name: "treatmentHeading", title: "Overskrift", type: "string", group: "treatment" }),
    defineField({ name: "treatmentIntro", title: "Ingress", type: "text", rows: 2, group: "treatment" }),
    defineField({
      name: "treatmentCards",
      title: "Behandlingskort",
      type: "array",
      group: "treatment",
      of: [
        {
          type: "object",
          name: "treatmentCard",
          fields: [
            defineField({ name: "kicker", title: "Liten forhåndstekst", type: "string" }),
            defineField({ name: "title", title: "Tittel", type: "string" }),
            defineField({ name: "text", title: "Tekst", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "kicker" } },
        },
      ],
    }),

    // --- Dette kan du gjøre selv ---
    defineField({ name: "selfCareHeading", title: "Overskrift", type: "string", group: "selfCare" }),
    defineField({ name: "selfCareItems", title: "Punkter", type: "array", of: [{ type: "string" }], group: "selfCare" }),
    defineField({
      name: "selfCareFeaturedExercise",
      title: "Fremhevet øvelse",
      type: "reference",
      to: [{ type: "exercise" }],
      group: "selfCare",
    }),

    // --- Forløp ---
    defineField({ name: "prognosisHeading", title: "Overskrift", type: "string", group: "prognosis" }),
    defineField({ name: "prognosisBody", title: "Tekst", type: "text", rows: 4, group: "prognosis" }),

    // --- FAQ ---
    defineField({
      name: "faq",
      title: "Spørsmål og svar",
      type: "array",
      group: "faq",
      of: [
        {
          type: "object",
          name: "diagnosisFaqItem",
          fields: [
            defineField({ name: "question", title: "Spørsmål", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Svar", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // --- Relatert ---
    defineField({
      name: "relatedArticles",
      title: "Relaterte artikler",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
      group: "related",
    }),
    defineField({
      name: "relatedExercises",
      title: "Relaterte øvelser",
      type: "array",
      of: [{ type: "reference", to: [{ type: "exercise" }] }],
      group: "related",
    }),

    // --- CTA ---
    defineField({ name: "ctaHeading", title: "Overskrift", type: "string", group: "cta" }),
    defineField({ name: "ctaText", title: "Tekst", type: "text", rows: 2, group: "cta" }),
  ],
  preview: {
    select: { title: "title", order: "order", hasOwnPage: "hasOwnPage" },
    prepare({ title, order, hasOwnPage }) {
      return {
        title,
        subtitle: [hasOwnPage ? "Egen side (kun kort/veiviser)" : null, order != null ? `#${order}` : null].filter(Boolean).join(" · "),
      };
    },
  },
});
