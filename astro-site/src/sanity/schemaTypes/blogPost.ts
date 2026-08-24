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
      type: "array",
      of: [{ type: "block" }],
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
      type: "image",
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
