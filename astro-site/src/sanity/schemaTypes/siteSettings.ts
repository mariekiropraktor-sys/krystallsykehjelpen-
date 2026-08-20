import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Innstillinger",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "E-post",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
    }),
    defineField({
      name: "bookingUrl",
      title: "Bookinglenke (Pasientsky)",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Innstillinger" };
    },
  },
});
