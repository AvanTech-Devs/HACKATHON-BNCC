const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MARGIN_MM = 25;
const FOOTER_HEIGHT_MM = 20;

const MM_TO_PX = 3.78;

const LINE_HEIGHT_MM = 6 * 1.49;;
const START_Y_FIRST_PAGE_MM = 55;
const START_Y_OTHER_PAGES_MM = 35;

// altura real ocupada pelo título + linha na primeira página
const TITLE_BLOCK_HEIGHT_MM = 18;

// limite real de escrita (antes do rodapé)
const MAX_Y_MM = PAGE_HEIGHT_MM - FOOTER_HEIGHT_MM;

/* =========================
   QUEBRA POR LARGURA (IGUAL PDF)
========================= */
export function splitTextForPreview(
  text: string,
  maxWidthPx: number,
  font = "11px Helvetica"
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;

  const words = text.split(" ");
  const lines: string[] = [];

  let current = "";

  words.forEach(word => {
    const test = current ? current + " " + word : word;
    const width = ctx.measureText(test).width;

    if (width > maxWidthPx && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });

  if (current) lines.push(current);

  return lines;
}

/* =========================
   PAGINAÇÃO REAL (1:1 PDF)
========================= */
export function paginatePdfContent(content: string) {
  const maxWidthPx =
    (PAGE_WIDTH_MM - MARGIN_MM * 2) * MM_TO_PX;

  const rawLines = content
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  // quebra por largura (ANTES de paginar)
  const visualLines = rawLines.flatMap(line => {
    const visualLine = line.startsWith("- ")
      ? "• " + line.slice(2) // largura real da lista
      : line;

    return splitTextForPreview(visualLine, maxWidthPx);
  });

  const pages: string[][] = [];
  let currentPage: string[] = [];

  let isFirstPage = true;
  let y = START_Y_FIRST_PAGE_MM + TITLE_BLOCK_HEIGHT_MM;

  visualLines.forEach(line => {
    if (y + LINE_HEIGHT_MM > MAX_Y_MM) {
      pages.push(currentPage);
      currentPage = [];

      isFirstPage = false;
      y = START_Y_OTHER_PAGES_MM;
    }

    currentPage.push(line);
    y += LINE_HEIGHT_MM;
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  return pages;
}
