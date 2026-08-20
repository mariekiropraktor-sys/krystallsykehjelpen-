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
      name: "body",
      title: "Tekst",
      type: "array",
      of: [{ type: "block" }],
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
  ],
  preview: {
    select: { title: "title", publishedDate: "publishedDate" },
    prepare({ title, publishedDate }) {
      return { title, subtitle: publishedDate };
    },
  },
});
