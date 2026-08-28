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

    // --- Felt for /finn-behandler/ (landsdekkende behandlerkatalog) ---
    defineField({
      name: "role",
      title: "Rolle",
      description: 'F.eks. "Kiropraktor", "Fysioterapeut / svimmelhetsterapeut"',
      type: "string",
    }),
    defineField({
      name: "clinic",
      title: "Klinikk",
      description: "Klinikknavn (eller klinikknavn for B/C-nivå behandlere uten bekreftet navn)",
      type: "string",
    }),
    defineField({
      name: "sted",
      title: "Poststed",
      description: "Brukes i fritekstsøk på /finn-behandler/",
      type: "string",
    }),
    defineField({
      name: "profession",
      title: "Profesjon",
      type: "string",
      options: {
        list: [
          { title: "Kiropraktor", value: "kiropraktor" },
          { title: "Fysioterapeut", value: "fysioterapeut" },
          { title: "Manuellterapeut", value: "manuellterapeut" },
          { title: "Naprapat", value: "naprapat" },
          { title: "Tverrfaglig senter", value: "tverrfaglig" },
          { title: "Lege / ØNH", value: "onh" },
          { title: "Offentlig / sykehus", value: "offentlig" },
        ],
      },
    }),
    defineField({
      name: "treatmentTags",
      title: "Behandlingstyper",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Krystallsyke", value: "krystallsyke" },
          { title: "Svimmelhet", value: "svimmelhet" },
          { title: "Hjemmebesøk", value: "hjemmebesok" },
          { title: "Video", value: "video" },
        ],
      },
    }),
    defineField({
      name: "equipment",
      title: "Utstyr",
      description: 'Fritekst, f.eks. "TRV-stol", "VNG/Frenzel"',
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "access",
      title: "Tilgang",
      description: 'Fritekst, f.eks. "Privat", "Henvisning"',
      type: "string",
    }),
    defineField({
      name: "verificationLevel",
      title: "Verifiseringsnivå",
      description: "A = navngitt behandler, B = klinikktilbud, C = offentlig/henvisningsbasert",
      type: "string",
      options: { list: ["A", "B", "C"] },
    }),
    defineField({
      name: "sourceUrl",
      title: "Kilde-URL",
      type: "url",
    }),
    defineField({
      name: "location",
      title: "Posisjon",
      type: "object",
      fields: [
        defineField({ name: "lat", title: "Breddegrad", type: "number" }),
        defineField({ name: "lng", title: "Lengdegrad", type: "number" }),
      ],
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Privat / bookbar", value: "private" },
          { title: "Offentlig / henvisning", value: "public" },
        ],
      },
    }),
    defineField({
      name: "tier",
      title: "Nivå",
      type: "string",
      options: { list: ["standard", "featured"] },
      initialValue: "standard",
    }),
    defineField({
      name: "reviewStatus",
      title: "Gjennomgangsstatus",
      description:
        "Kun dokumenter som er PUBLISERT og har status «Bekreftet» vises på den offentlige siden — uansett publiseringsstatus for øvrig.",
      type: "string",
      options: {
        list: [
          { title: "Venter", value: "pending" },
          { title: "Kontaktet", value: "contacted" },
          { title: "Bekreftet", value: "confirmed" },
          { title: "Avslått", value: "declined" },
        ],
      },
      initialValue: "pending",
    }),
  ],
  preview: {
    select: { title: "name", clinic: "clinic", clinicName: "clinicName", status: "reviewStatus" },
    prepare({ title, clinic, clinicName, status }) {
      return { title, subtitle: [clinic ?? clinicName, status].filter(Boolean).join(" · ") };
    },
  },
});
