// Renderer for portable text-blokker fra Sanity. Håndterer vanlige
// tekstblokker (fet/kursiv-markering, overskrifter, punktlister) samt tre
// innsettbare custom-blokktyper fra blogPost.body: checklistBox, factBox og
// warningBox (se src/sanity/schemaTypes/blogPost.ts). Bruker urlForImage()
// for factBox sin illustrasjon — ikke lenger avhengighetsfri, men fortsatt
// uten eksterne pakker utover resten av prosjektet.

import { urlForImage } from "./sanityImage";

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
  // checklistBox / warningBox
  title?: string;
  items?: string[];
  // factBox
  label?: string;
  text?: string;
  illustration?: unknown;
  // warningBox
  callout?: string;
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

// De tre innsettbare custom-blokktypene fra blogPost.body (se
// src/sanity/schemaTypes/blogPost.ts) — hver bygger sitt eget HTML-fragment.
// Stil defineres i .post-body-scopet CSS i blogg/[slug]/index.astro
// (fungerer selv om markupen settes inn via set:html, siden CSS-scoping i
// Astro matcher på .post-body-ansestoren, ikke hvert enkelt barn).
function renderChecklistBox(block: PortableBlock): string {
  const title = block.title ? `<h3>${escapeHtml(block.title)}</h3>` : "";
  const items = (block.items ?? [])
    .map((item) => `<li><span class="checklist-mark" aria-hidden="true"></span>${escapeHtml(item)}</li>`)
    .join("");
  return `<div class="checklist-box">${title}<ul class="checklist-items">${items}</ul></div>`;
}

function renderFactBox(block: PortableBlock): string {
  const label = escapeHtml(block.label || "Kort forklart");
  const text = block.text ? `<p>${escapeHtml(block.text)}</p>` : "";
  const illustrationUrl = urlForImage(block.illustration, 400);
  const illustrationHtml = illustrationUrl
    ? `<div class="fact-box-illustration"><img src="${illustrationUrl}" alt="" /></div>`
    : "";
  return `<div class="fact-box${illustrationUrl ? "" : " fact-box-full"}"><div class="fact-box-content"><span class="fact-box-label">${label}</span>${text}</div>${illustrationHtml}</div>`;
}

function renderWarningBox(block: PortableBlock): string {
  const title = block.title ? `<h3>${escapeHtml(block.title)}</h3>` : "";
  const items = block.items?.length ? `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
  const callout = block.callout ? `<p class="warning-box-callout">${escapeHtml(block.callout)}</p>` : "";
  return `<div class="warning-box">${title}${items}${callout}</div>`;
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
    if (block._type === "checklistBox") {
      html += renderChecklistBox(block);
      i++;
      continue;
    }
    if (block._type === "factBox") {
      html += renderFactBox(block);
      i++;
      continue;
    }
    if (block._type === "warningBox") {
      html += renderWarningBox(block);
      i++;
      continue;
    }
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
    const isHeading = block.style === "h2" || block.style === "h3";
    const tag = isHeading ? block.style : block.style === "blockquote" ? "blockquote" : "p";
    const idAttr = isHeading ? ` id="${slugify(plainTextFromBlock(block))}"` : "";
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
