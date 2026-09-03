import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blogginnlegg",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedDate",
      title: "Publiseringsdato",
      type: "date",
    }),
    defineField({
      name: "excerpt",
      title: "Ingress",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Kategori",
      description: 'Fritekst, vist som badge i artikkel-hero, f.eks. "Krystallsyke", "Behandling av krystallsyke"',
      type: "string",
    }),
    defineField({
      name: "shortSummary",
      title: "Kort fortalt",
      description: "Kort oppsummeringsboks øverst i artikkelen (adskilt fra ingressen)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Tekst",
      description:
        "Vanlig brødtekst, pluss tre innsettbare blokktyper (sjekkliste, faktaboks, advarselsboks) — bruk «+»-menyen i editoren for å sette dem inn hvor som helst i teksten.",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "checklistBox",
          title: "Sjekkliste",
          fields: [
            defineField({ name: "title", title: "Overskrift", type: "string" }),
            defineField({ name: "items", title: "Punkter", type: "array", of: [{ type: "string" }] }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({ title: title || "Sjekkliste" }),
          },
        },
        {
          type: "object",
          name: "factBox",
          title: "Faktaboks",
          fields: [
            defineField({ name: "label", title: "Etikett", type: "string", initialValue: "Kort forklart" }),
            defineField({ name: "text", title: "Tekst", type: "text", rows: 4 }),
            defineField({ name: "illustration", title: "Illustrasjon (valgfri)", type: "image" }),
          ],
          preview: {
            select: { title: "label", subtitle: "text" },
            prepare: ({ title, subtitle }) => ({ title: title || "Faktaboks", subtitle }),
          },
        },
        {
          type: "object",
          name: "warningBox",
          title: "Advarselsboks (i teksten)",
          description: "Navy-2 ramme på hvitt — ikke rødt. Kan settes inn hvor som helst i teksten, i motsetning til Faresignalboks-feltet lenger ned.",
          fields: [
            defineField({ name: "title", title: "Overskrift", type: "string" }),
            defineField({ name: "items", title: "Punkter", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "callout", title: "Fremhevet linje (valgfri)", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({ title: title || "Advarselsboks" }),
          },
        },
      ],
    }),
    defineField({
      name: "warningBox",
      title: "Faresignalboks",
      description: '"Når bør du søke rask hjelp?" — vises i egen rød varselboks',
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "faq",
      title: "Ofte stilte spørsmål (denne artikkelen)",
      type: "array",
      of: [
        {
          type: "object",
          name: "articleFaqItem",
          fields: [
            defineField({ name: "question", title: "Spørsmål", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Svar", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "sources",
      title: "Faglige kilder",
      type: "array",
      of: [
        {
          type: "object",
          name: "source",
          fields: [
            defineField({ name: "label", title: "Referanse", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: { select: { title: "label" } },
        },
      ],
    }),
    defineField({
      name: "relatedLinks",
      title: "Relaterte artikler/sider",
      description: "Kun lenker til sider som faktisk finnes på nettstedet",
      type: "array",
      of: [
        {
          type: "object",
          name: "relatedLink",
          fields: [
            defineField({ name: "title", title: "Tittel", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "url", title: "Intern URL", type: "string", description: 'F.eks. "/krystallsyken/"', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Toppbilde",
      description: "Vises på artikkelen (under ingressen), som forhåndsvisning i bloggoversikten, og som delingsbilde (og:image).",
      type: "image",
    }),
    defineField({
      name: "coverImageAlt",
      title: "Alt-tekst for toppbilde",
      description: "Påkrevd hvis toppbilde er satt.",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.coverImage && !value) {
            return "Alt-tekst er påkrevd når toppbilde er satt";
          }
          return true;
        }),
    }),
    defineField({
      name: "author",
      title: "Forfatter",
      type: "reference",
      to: [{ type: "practitioner" }],
    }),
    defineField({
      name: "metaTitle",
      title: "Meta-tittel (SEO)",
      description: "Overstyrer tittel i søkeresultater/faner hvis satt — ellers brukes Tittel",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Metabeskrivelse (SEO)",
      description: "Overstyrer beskrivelse i søkeresultater hvis satt — ellers brukes Ingress",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", publishedDate: "publishedDate" },
    prepare({ title, publishedDate }) {
      return { title, subtitle: publishedDate };
    },
  },
});
