import { defineCliConfig } from "sanity/cli";

// Prosjekt-ID og dataset er ikke hemmeligheter (de bakes uansett inn i
// klientkoden via PUBLIC_-env-variablene) — men denne filen leses av
// Sanity CLI direkte (utenom Vite), så vi kan ikke bruke import.meta.env her.
export default defineCliConfig({
  api: {
    projectId: "b1cmdslc",
    dataset: "production",
  },
  deployment: {
    appId: "q21ev3zmzmqlpk54jsss7y3j",
  },
});
