import { defineField, defineType } from "sanity";

export default defineType({
  name: "exerciseCategory",
  title: "Øvelseskategorier",
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
      name: "description",
      title: "Beskrivelse",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "icon",
      title: "Ikon",
      type: "image",
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
    select: { title: "title", order: "order" },
    prepare({ title, order }) {
      return { title, subtitle: order != null ? `Rekkefølge: ${order}` : undefined };
    },
  },
});
