import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innhold")
    .items([
      S.listItem()
        .title("Innstillinger")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("pageSection").title("Sidetekster"),
      S.documentTypeListItem("exerciseCategory").title("Øvelseskategorier"),
      S.documentTypeListItem("exercise").title("Øvelser"),
      S.documentTypeListItem("blogPost").title("Blogginnlegg"),
      S.documentTypeListItem("faqItem").title("FAQ"),
      S.documentTypeListItem("practitioner").title("Behandlere"),
    ]);
