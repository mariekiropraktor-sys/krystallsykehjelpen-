import { defineField, defineType } from "sanity";

export default defineType({
  name: "pageSection",
  title: "Sidetekster",
  type: "document",
  fields: [
    defineField({
      name: "pageSlug",
      title: "Side",
      type: "string",
      options: {
        list: [
          { title: "Hjem", value: "hjem" },
          { title: "Om Krystallsykehjelpen", value: "om-krystallsykehjelpen" },
          { title: "Krystallsyken", value: "krystallsyken" },
          { title: "Øvelsesbibliotek", value: "ovelsesbibliotek" },
          { title: "Finn behandler", value: "finn-behandler" },
          { title: "Kontakt oss", value: "kontakt-oss" },
          { title: "Blogg", value: "blogg" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sectionKey",
      title: "Seksjonsnøkkel",
      description: 'Identifiserer hvilken seksjon på siden, f.eks. "hero", "hva-er-krystallsyken", "symptomer"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Overskrift",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Tekst",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "mediaType",
      title: "Medietype",
      type: "string",
      options: {
        list: [
          { title: "Bilde", value: "bilde" },
          { title: "Video", value: "video" },
          { title: "Ingen", value: "ingen" },
        ],
      },
      initialValue: "ingen",
    }),
    defineField({
      name: "mediaAsset",
      title: "Bilde",
      type: "image",
      hidden: ({ parent }) => parent?.mediaType !== "bilde",
    }),
    defineField({
      name: "mediaFile",
      title: "Videofil",
      type: "file",
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
  ],
  preview: {
    select: {
      pageSlug: "pageSlug",
      sectionKey: "sectionKey",
      heading: "heading",
    },
    prepare({ pageSlug, sectionKey, heading }) {
      return {
        title: heading || sectionKey,
        subtitle: `${pageSlug} / ${sectionKey}`,
      };
    },
  },
});
