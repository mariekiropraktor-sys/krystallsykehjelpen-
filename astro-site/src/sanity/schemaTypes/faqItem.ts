import { defineField, defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Spørsmål",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Svar",
      type: "array",
      of: [{ type: "block" }],
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
    select: { title: "question", order: "order" },
    prepare({ title, order }) {
      return { title, subtitle: order != null ? `Rekkefølge: ${order}` : undefined };
    },
  },
});
