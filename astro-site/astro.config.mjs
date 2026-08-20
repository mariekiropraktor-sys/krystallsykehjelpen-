import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
import react from "@astrojs/react";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  "",
);

// VIKTIG: Bytt "site" til det ekte domenet ditt før du publiserer.
export default defineConfig({
  site: "https://www.krystallsykehjelpen.no",
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
      studioBasePath: "/admin",
    }),
    react(),
  ],
});
