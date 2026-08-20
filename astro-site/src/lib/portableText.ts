// Enkel, avhengighetsfri renderer for portable text-blokker fra Sanity.
// Støtter kun det innholdet sidetekstene faktisk bruker: normal-blokker med
// fet/kursiv-markering. Overskrifter (h2/h3 osv.) rendres av .astro-malene
// selv via `heading`-feltet, ikke herfra.

type PortableSpan = {
  _type: "span";
  text: string;
  marks?: string[];
};

type PortableBlock = {
  _type: string;
  style?: string;
  children?: PortableSpan[];
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Rendrer innholdet i én blokk til inline HTML (uten omsluttende tag), slik
// at malene selv kan bestemme hvilket element (p, span, osv.) og hvilken
// klasse teksten skal ha.
export function inlineHtmlFromBlock(block?: PortableBlock): string {
  if (!block?.children) return "";
  return block.children
    .map((span) => {
      let text = escapeHtml(span.text ?? "");
      for (const mark of span.marks ?? []) {
        if (mark === "strong") text = `<strong>${text}</strong>`;
        else if (mark === "em") text = `<em>${text}</em>`;
      }
      return text;
    })
    .join("");
}
