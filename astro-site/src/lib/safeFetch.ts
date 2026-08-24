import { sanityClient } from "sanity:client";
import type { SanityClient } from "@sanity/client";

// Samme forsvars-mønster som getPageSections() i pageSections.ts: en
// Sanity-spørring skal aldri kunne krasje en side. Ved feil logges en
// advarsel og fallback-verdien brukes i stedet.
// `client` kan overstyres (f.eks. med blogPreviewClient for utkast-
// forhåndsvisning) — bruker den vanlige offentlige klienten som standard.
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T,
  client: Pick<SanityClient, "fetch"> = sanityClient,
): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.warn("[safeFetch] Sanity-spørring feilet:", error);
    return fallback;
  }
}
