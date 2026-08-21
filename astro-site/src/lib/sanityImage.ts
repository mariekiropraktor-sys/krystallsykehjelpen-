import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "sanity:client";

const builder = createImageUrlBuilder(sanityClient);

// Bygger en optimalisert, størrelsesbegrenset bilde-URL fra et rått Sanity
// image-felt (f.eks. pageSection.mediaAsset) — ikke en ferdig URL fra GROQ.
// `width` bør matche hvor stort bildet faktisk vises i CSS-en (x2 for retina).
export function urlForImage(source: unknown, width: number): string | undefined {
  if (!source) return undefined;
  return builder.image(source as never).width(width).fit("max").auto("format").quality(80).url();
}
