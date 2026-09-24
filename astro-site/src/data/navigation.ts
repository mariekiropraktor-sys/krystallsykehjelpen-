// Delt navigasjonsdata for Header.astro (menypanelets fire faner) og
// Footer.astro, slik at lenketekst/URL aldri kommer ut av synk mellom de to.
//
// "Alle former for svimmelhet →" og de publiserte diagnosesidene (utenom
// krystallsyke, som står fast) hentes dynamisk fra Sanity — se
// getNavigationTabs() nederst. navigationTabs under er kun den statiske
// grunnstrukturen/fallback.

import { svimmelhetPreviewClient } from "../lib/svimmelhetPreviewClient";

export const BOOKING_URL =
  "https://psno-patient-platform-fe.svc.pasientsky.no/embedded/planner/booking?serviceProviderId=54907264-049e-11eb-8fc8-26c6f94d64b7";

export type NavItem =
  | {
      kind: "link";
      label: string;
      href: string;
      description?: string;
      enabled?: boolean; // default true — sett false for lenker til sider som ikke finnes ennå
    }
  | { kind: "divider" };

export interface NavTab {
  label: string;
  items: NavItem[];
}

export const navigationTabs: NavTab[] = [
  {
    label: "Svimmelhet",
    items: [
      { kind: "link", label: "Alle former for svimmelhet →", href: "/svimmelhet/", enabled: false },
      { kind: "link", label: "Krystallsyke (BPPV)", href: "/svimmelhet/krystallsyke/" },
      { kind: "divider" },
      { kind: "link", label: "Artikler", href: "/blogg/" },
      { kind: "link", label: "Spørsmål og svar", href: "/faq/" },
    ],
  },
  {
    label: "Hjelp deg selv",
    items: [
      { kind: "link", label: "Krystallsykehjelpen hjemme", href: "/hjemme/", description: "Veiledet selvhjelp for krystallsyke" },
      { kind: "link", label: "Øvelsesbibliotek", href: "/ovelsesbibliotek/" },
    ],
  },
  {
    label: "Behandling",
    items: [
      { kind: "link", label: "Videokonsultasjon", href: "/tjenester/videokonsultasjon/" },
      { kind: "link", label: "Finn behandler", href: "/finn-behandler/" },
    ],
  },
  {
    label: "Om",
    items: [
      { kind: "link", label: "Møt Marie", href: "/mott-marie/" },
      { kind: "link", label: "Om Krystallsykehjelpen", href: "/om-krystallsykehjelpen/" },
      { kind: "link", label: "Kontakt", href: "/kontakt/" },
    ],
  },
];

// Footer viser samme fire faner (kun enabled lenker), pluss et par
// footer-spesifikke lenker under "Behandling" (booking + Få hjelp) som ikke
// hører hjemme i menypanelet.
export const footerBehandlingExtras: NavItem[] = [
  { kind: "link", label: "Bestill time", href: BOOKING_URL },
  { kind: "link", label: "Få hjelp", href: "/fa-hjelp/" },
];

// Bygger navigasjonsfanene dynamisk: slår på "Alle former for svimmelhet →"
// kun når svimmelhetPage er publisert med visible:true, og setter inn
// publiserte diagnosesider (utenom krystallsyke, som allerede står fast i
// grunnstrukturen) rett etter "Krystallsyke (BPPV)", sortert på order.
// Bruker svimmelhetPreviewClient, så upubliserte utkast også dukker opp i
// menyen lokalt når SANITY_PREVIEW_DRAFTS+SANITY_READ_TOKEN er satt — se
// den filen. En faktisk build ser alltid kun publiserte dokumenter.
export async function getNavigationTabs(): Promise<NavTab[]> {
  const tabs = navigationTabs.map((tab) => ({ ...tab, items: [...tab.items] }));
  const svimmelhetTab = tabs.find((t) => t.label === "Svimmelhet");
  if (!svimmelhetTab) return tabs;

  try {
    const [svimmelhetVisible, extraDiagnoses] = await Promise.all([
      svimmelhetPreviewClient.fetch(`*[_id == "svimmelhetPage" && visible == true][0]._id`),
      svimmelhetPreviewClient.fetch(
        `*[_type == "diagnosisPage" && defined(slug.current) && hasOwnPage != true] | order(order asc){ title, "slug": slug.current }`,
      ),
    ]);

    svimmelhetTab.items = svimmelhetTab.items.map((item) =>
      item.kind === "link" && item.href === "/svimmelhet/" ? { ...item, enabled: Boolean(svimmelhetVisible) } : item,
    );

    const krystallsykeIndex = svimmelhetTab.items.findIndex(
      (item) => item.kind === "link" && item.href === "/svimmelhet/krystallsyke/",
    );
    const insertAt = krystallsykeIndex === -1 ? svimmelhetTab.items.length : krystallsykeIndex + 1;
    const newItems: NavItem[] = extraDiagnoses.map((d) => ({
      kind: "link" as const,
      label: d.title,
      href: `/svimmelhet/${d.slug}/`,
    }));
    svimmelhetTab.items.splice(insertAt, 0, ...newItems);
  } catch (error) {
    console.warn("[navigation] Kunne ikke hente svimmelhet-data fra Sanity:", error);
  }

  return tabs;
}
