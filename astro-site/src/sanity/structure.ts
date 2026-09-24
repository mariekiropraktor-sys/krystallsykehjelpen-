import type { StructureResolver } from "sanity/structure";

// Samme sider som i pageSection-skjemaets `pageSlug`-liste
// (src/sanity/schemaTypes/pageSection.ts) — hold disse i sync.
const PAGE_SLUGS = [
  { title: "Hjem", value: "hjem" },
  { title: "Om Krystallsykehjelpen", value: "om-krystallsykehjelpen" },
  { title: "Krystallsyken", value: "krystallsyken" },
  { title: "Øvelsesbibliotek", value: "ovelsesbibliotek" },
  { title: "Finn behandler", value: "finn-behandler" },
  { title: "Kontakt oss", value: "kontakt-oss" },
  { title: "Blogg", value: "blogg" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innhold")
    .items([
      S.listItem()
        .title("Innstillinger")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Hjemme-siden (fase 3-innhold)")
        .child(
          S.document().schemaType("hjemmePage").documentId("hjemmePage"),
        ),
      S.listItem()
        .title("Om Marie-siden")
        .child(
          S.document().schemaType("omMariePage").documentId("omMariePage"),
        ),
      S.listItem()
        .title("Svimmelhet")
        .child(
          S.list()
            .title("Svimmelhet")
            .items([
              S.listItem()
                .title("Oversiktssiden (/svimmelhet/)")
                .child(
                  S.document().schemaType("svimmelhetPage").documentId("svimmelhetPage"),
                ),
              S.documentTypeListItem("diagnosisPage").title("Diagnosesider"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Sidetekster")
        .child(
          S.list()
            .title("Sidetekster")
            .items(
              PAGE_SLUGS.map(({ title, value }) =>
                S.listItem()
                  .title(title)
                  .child(
                    S.documentTypeList("pageSection")
                      .title(title)
                      .filter('_type == "pageSection" && pageSlug == $pageSlug')
                      .params({ pageSlug: value }),
                  ),
              ),
            ),
        ),
      S.documentTypeListItem("exerciseCategory").title("Øvelseskategorier"),
      S.documentTypeListItem("exercise").title("Øvelser"),
      S.documentTypeListItem("blogPost").title("Blogginnlegg"),
      S.documentTypeListItem("faqItem").title("FAQ"),
      S.documentTypeListItem("practitioner").title("Behandlere"),
    ]);
