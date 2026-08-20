import { sanityClient } from "sanity:client";

export type PageSection = {
  sectionKey: string;
  heading?: string;
  body?: { _type: string; style?: string; children?: { text: string; marks?: string[] }[] }[];
  mediaType?: "bilde" | "video" | "ingen";
  mediaUrl?: string;
};

const QUERY = `*[_type == "pageSection" && pageSlug == $pageSlug]{
  sectionKey,
  heading,
  body,
  mediaType,
  "mediaUrl": mediaAsset.asset->url
}`;

// Henter alle pageSection-dokumenter for én side, nøkkelet på sectionKey.
// Feiler aldri — hvis Sanity er utilgjengelig eller siden mangler innhold,
// returneres et tomt objekt, og sidene faller tilbake til hardkodet tekst.
export async function getPageSections(pageSlug: string): Promise<Record<string, PageSection>> {
  try {
    const sections = await sanityClient.fetch<PageSection[]>(QUERY, { pageSlug });
    const bySectionKey: Record<string, PageSection> = {};
    for (const section of sections) {
      bySectionKey[section.sectionKey] = section;
    }
    return bySectionKey;
  } catch (error) {
    console.warn(`[pageSections] Kunne ikke hente Sanity-innhold for "${pageSlug}":`, error);
    return {};
  }
}
