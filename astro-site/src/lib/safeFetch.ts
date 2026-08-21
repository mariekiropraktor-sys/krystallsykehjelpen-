import { sanityClient } from "sanity:client";

// Samme forsvars-mønster som getPageSections() i pageSections.ts: en
// Sanity-spørring skal aldri kunne krasje en side. Ved feil logges en
// advarsel og fallback-verdien brukes i stedet.
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T,
): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    console.warn("[safeFetch] Sanity-spørring feilet:", error);
    return fallback;
  }
}
