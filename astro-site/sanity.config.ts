import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

// Prosjekt-ID og dataset er hardkodet (ikke hemmeligheter — de bakes uansett
// inn i klientkoden). import.meta.env fungerer i Astro/Vite-konteksten, men
// ikke når Sanity CLI (f.eks. `sanity deploy`) laster denne filen direkte.
export default defineConfig({
  name: "krystallsykehjelpen",
  title: "Krystallsykehjelpen",
  projectId: "b1cmdslc",
  dataset: "production",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
