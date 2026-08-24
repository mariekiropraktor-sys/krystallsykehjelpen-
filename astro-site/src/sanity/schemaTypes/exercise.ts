import { defineField, defineType } from "sanity";

export default defineType({
  name: "exercise",
  title: "Øvelser",
  type: "document",
  groups: [
    { name: "grunnleggende", title: "Grunnleggende", default: true },
    { name: "steg", title: "Steg-innhold (reponering/vanebasert)" },
    { name: "lesestoff", title: "Lesestoff (les-format)" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      group: "grunnleggende",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      group: "grunnleggende",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "exerciseType",
      title: "Type",
      type: "string",
      group: "grunnleggende",
      options: {
        list: [
          { title: "Reponeringsøvelse", value: "reponering" },
          { title: "Habitueringsøvelse", value: "habituering" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "format",
      title: "Format",
      description: "Styrer hvilken sidemal øvelsen rendres med",
      type: "string",
      group: "grunnleggende",
      options: {
        list: [
          { title: "Steg-for-steg", value: "steps" },
          { title: "Leseguide", value: "read" },
        ],
      },
      initialValue: "steps",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori (buegang)",
      description: "Kun for reponeringsøvelser — la stå tom for habitueringsøvelser",
      type: "reference",
      to: [{ type: "exerciseCategory" }],
      group: "grunnleggende",
      hidden: ({ document }) => document?.exerciseType !== "reponering",
      validation: (Rule) =>
        Rule.custom((category, context) => {
          if (context.document?.exerciseType === "reponering" && !category) {
            return "Buegang er påkrevd for reponeringsøvelser";
          }
          return true;
        }),
    }),
    defineField({
      name: "canal",
      title: "Buegang",
      description: "Kun for reponeringsøvelser",
      type: "string",
      group: "grunnleggende",
      options: {
        list: [
          { title: "Bakre buegang", value: "bakre" },
          { title: "Horisontal buegang", value: "horisontal" },
          { title: "Fremre buegang (Øvre buegang)", value: "fremre" },
        ],
      },
      hidden: ({ document }) => document?.exerciseType !== "reponering",
      validation: (Rule) =>
        Rule.custom((canal, context) => {
          if (context.document?.exerciseType === "reponering" && !canal) {
            return "Buegang er påkrevd for reponeringsøvelser";
          }
          return true;
        }),
    }),
    defineField({
      name: "side",
      title: "Side",
      description: "Kun for reponeringsøvelser med en affisert side",
      type: "string",
      group: "grunnleggende",
      options: {
        list: [
          { title: "Høyre", value: "hoyre" },
          { title: "Venstre", value: "venstre" },
        ],
      },
      hidden: ({ document }) => document?.exerciseType !== "reponering",
    }),
    defineField({
      name: "habitueringSeksjon",
      title: "Habitueringsseksjon",
      description: "Kun for habitueringsøvelser",
      type: "string",
      group: "grunnleggende",
      options: {
        list: [
          { title: "Vestibulær rehabilitering", value: "vestibular-rehab" },
          { title: "Balansetrening og råd", value: "balanse-rad" },
        ],
      },
      hidden: ({ document }) => document?.exerciseType !== "habituering",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.exerciseType === "habituering" && !value) {
            return "Habitueringsseksjon er påkrevd for habitueringsøvelser";
          }
          return true;
        }),
    }),
    defineField({
      name: "duration",
      title: "Varighet",
      description: 'F.eks. "Ca. 5 minutter"',
      type: "string",
      group: "grunnleggende",
    }),
    defineField({
      name: "stepCount",
      title: "Antall trinn (visningstekst)",
      description: 'F.eks. "4 trinn" eller "5 sett" — fritekst for badge-visning',
      type: "string",
      group: "grunnleggende",
    }),
    defineField({
      name: "mediaType",
      title: "Medietype",
      description: "Beskrivende — brukes i meta-visning, styrer ikke selve filopplastingen",
      type: "string",
      group: "grunnleggende",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "Bilder", value: "bilder" },
          { title: "Leseguide (ingen media)", value: "leseguide" },
        ],
      },
    }),
    defineField({
      name: "lead",
      title: "Ingress",
      type: "text",
      rows: 3,
      group: "grunnleggende",
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "array",
      of: [{ type: "block" }],
      group: "grunnleggende",
    }),
    defineField({
      name: "mediaFile",
      title: "Video eller bilde (hovedmedia)",
      type: "file",
      group: "grunnleggende",
    }),
    defineField({
      name: "difficultyLevel",
      title: "Vanskelighetsgrad",
      type: "string",
      group: "grunnleggende",
      options: {
        list: [
          { title: "Lett", value: "lett" },
          { title: "Middels", value: "middels" },
          { title: "Krevende", value: "krevende" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Rekkefølge",
      type: "number",
      group: "grunnleggende",
    }),

    // --- Steg-format (reponering + steg-baserte habitueringsøvelser) ---
    defineField({
      name: "safetyNote",
      title: "Sikkerhetsmerknad",
      description: "Vises i en egen boks før selve trinnene",
      type: "text",
      rows: 3,
      group: "steg",
    }),
    defineField({
      name: "steps",
      title: "Trinn",
      type: "array",
      group: "steg",
      of: [
        {
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", title: "Tittel", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Beskrivelse", type: "text", rows: 2 }),
            defineField({ name: "holdTime", title: "Holdetid", type: "string", description: 'F.eks. "Hold i 30–60 sek"' }),
            defineField({ name: "image", title: "Bilde", type: "image" }),
          ],
          preview: {
            select: { title: "title", subtitle: "holdTime" },
          },
        },
      ],
    }),
    defineField({
      name: "aftercare",
      title: "Etter øvelsen",
      description: "Punktvise råd vist i egen boks etter trinnene",
      type: "array",
      of: [{ type: "string" }],
      group: "steg",
    }),

    // --- Les-format (habitueringsartikler) ---
    defineField({
      name: "content",
      title: "Innhold (overskrift + tekst)",
      type: "array",
      group: "lesestoff",
      of: [
        {
          type: "object",
          name: "contentBlock",
          fields: [
            defineField({ name: "heading", title: "Overskrift", type: "string" }),
            defineField({ name: "text", title: "Tekst", type: "text", rows: 4 }),
          ],
          preview: {
            select: { title: "heading" },
          },
        },
      ],
    }),
    defineField({
      name: "adviceList",
      title: "Rådliste",
      type: "array",
      group: "lesestoff",
      of: [
        {
          type: "object",
          name: "adviceItem",
          fields: [
            defineField({ name: "title", title: "Tittel", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Beskrivelse", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "tip",
      title: "Tips",
      description: "Vises i en egen boks nederst i artikkelen",
      type: "text",
      rows: 2,
      group: "lesestoff",
    }),

    // --- Felles for begge formater ---
    defineField({
      name: "relatedExercises",
      title: "Relaterte øvelser",
      type: "array",
      group: "grunnleggende",
      of: [{ type: "reference", to: [{ type: "exercise" }] }],
    }),
  ],
  orderings: [
    {
      title: "Rekkefølge",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      habitueringSeksjon: "habitueringSeksjon",
      order: "order",
    },
    prepare({ title, category, habitueringSeksjon, order }) {
      const group =
        category ??
        (habitueringSeksjon === "vestibular-rehab"
          ? "Vestibulær rehabilitering"
          : habitueringSeksjon === "balanse-rad"
            ? "Balansetrening og råd"
            : null);
      return {
        title,
        subtitle: [group, order != null ? `#${order}` : null].filter(Boolean).join(" · "),
      };
    },
  },
});
