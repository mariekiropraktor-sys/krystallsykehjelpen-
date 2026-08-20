import { defineField, defineType } from "sanity";

export default defineType({
  name: "exercise",
  title: "Øvelser",
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
      name: "category",
      title: "Kategori (buegang)",
      type: "reference",
      to: [{ type: "exerciseCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "steps",
      title: "Trinn",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "videoOrImage",
      title: "Video eller bilde",
      type: "file",
    }),
    defineField({
      name: "difficultyLevel",
      title: "Vanskelighetsgrad",
      type: "string",
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
    select: { title: "title", category: "category.title", order: "order" },
    prepare({ title, category, order }) {
      return {
        title,
        subtitle: [category, order != null ? `#${order}` : null].filter(Boolean).join(" · "),
      };
    },
  },
});
