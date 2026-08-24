// Habitueringsseksjonene er ikke egne Sanity-dokumenter — kun en fast
// verdiliste (matcher exercise.habitueringSeksjon-feltet i skjemaet).
// Egen modul (ikke en const i .astro-frontmatter) fordi Astro sin
// getStaticPaths() ikke pålitelig lukker over andre top-level consts i
// samme fil.
export const HABITUERING_SECTIONS = {
  "vestibular-rehab": {
    title: "Vestibulær rehabilitering",
    description: "Strukturerte treningsprogram som trener opp balansesystemet gradvis.",
  },
  "balanse-rad": {
    title: "Balansetrening og råd",
    description: "Balanseøvelser og praktiske råd for hverdagen og forebygging.",
  },
} as const;
