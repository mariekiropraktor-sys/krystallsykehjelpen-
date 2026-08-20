import { defineField, defineType } from "sanity";

export default defineType({
  name: "practitioner",
  title: "Behandlere",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tittel",
      description: 'F.eks. "Kiropraktor"',
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Om behandleren",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "photo",
      title: "Bilde",
      type: "image",
    }),
    defineField({
      name: "clinicName",
      title: "Klinikknavn",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
    }),
    defineField({
      name: "latitude",
      title: "Breddegrad (latitude)",
      type: "number",
    }),
    defineField({
      name: "longitude",
      title: "Lengdegrad (longitude)",
      type: "number",
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
    }),
    defineField({
      name: "bookingUrl",
      title: "Bookinglenke",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "clinicName" },
  },
});
