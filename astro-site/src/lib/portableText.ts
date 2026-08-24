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
  listItem?: string;
  children?: PortableSpan[];
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function plainTextFromBlock(block?: PortableBlock): string {
  return (block?.children ?? []).map((span) => span.text ?? "").join("");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

// Rendrer en full portable text-array til HTML, inkludert blokk-nivå
// struktur (h2/h3-overskrifter og punktlister) — for lengre artikkelinnhold
// (f.eks. blogPost.body) der inlineHtmlFromBlock() alene ikke er nok, fordi
// den forutsetter at hver blokk er ett avsnitt.
export function blocksToHtml(blocks?: PortableBlock[]): string {
  if (!blocks?.length) return "";
  let html = "";
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block._type !== "block") {
      i++;
      continue;
    }
    if (block.listItem === "bullet") {
      let items = "";
      while (i < blocks.length && blocks[i].listItem === "bullet") {
        items += `<li>${inlineHtmlFromBlock(blocks[i])}</li>`;
        i++;
      }
      html += `<ul>${items}</ul>`;
      continue;
    }
    const tag = block.style === "h2" || block.style === "h3" ? block.style : "p";
    const idAttr = tag !== "p" ? ` id="${slugify(plainTextFromBlock(block))}"` : "";
    html += `<${tag}${idAttr}>${inlineHtmlFromBlock(block)}</${tag}>`;
    i++;
  }
  return html;
}

// Estimerer lesetid i minutter fra ordantall i body (norsk lesehastighet
// ~200 ord/min) — regnes ut, lagres ikke som eget felt i Sanity.
export function estimateReadingTime(blocks?: PortableBlock[]): number {
  if (!blocks?.length) return 1;
  const wordCount = blocks
    .filter((b) => b._type === "block")
    .map((b) => plainTextFromBlock(b))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

// Trekker ut h2-overskrifter fra en portable text-array til en innholds-
// fortegnelse (samme slugify-mønster som id-ene blocksToHtml() setter).
export function extractHeadings(blocks?: PortableBlock[]): { id: string; text: string }[] {
  if (!blocks?.length) return [];
  return blocks
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b) => {
      const text = plainTextFromBlock(b);
      return { id: slugify(text), text };
    });
}
