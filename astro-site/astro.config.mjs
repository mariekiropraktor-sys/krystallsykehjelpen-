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
//
// Redirects: satt her for lokal dev/build/preview (Astros egen redirects-
// støtte). Selve produksjonen kjører som ren statisk build på Vercel uten
// SSR-adapter, så dette blir en statisk HTML-side med meta-refresh — ikke
// ekte HTTP 301. Den ekte 301-redirecten ligger i vercel.json i prosjektets
// rotmappe (Vercels egen redirect-mekanisme, ingen ny avhengighet).
//
// Kun /krystallsyken/ er med her — /om-oss/ kan IKKE også ha en
// redirects-oppføring, siden sidefilen src/pages/om-oss/index.astro
// fortsatt skal finnes (ikke slettes, se oppgavebeskrivelsen). Astro tillater
// ikke en redirect og en ekte side på samme sti samtidig. /om-oss/ redirecter
// derfor via sin egen sidefil i stedet (meta-refresh + canonical), pluss
// samme ekte 301 i vercel.json som /krystallsyken/.
export default defineConfig({
  site: "https://www.krystallsykehjelpen.no",
  redirects: {
    "/krystallsyken": "/svimmelhet/krystallsyke/",
    "/krystallsyken/": "/svimmelhet/krystallsyke/",
  },
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
