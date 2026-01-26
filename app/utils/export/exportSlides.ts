import PptxGenJS from "pptxgenjs";
import { Material } from "@/app/models/types/material";

// ✅ Retorna Promise<Buffer>
export async function exportSlides(material: Material): Promise<Buffer> {
  const pptx = new PptxGenJS();

  // Função para processar Markdown básico
  function parseText(text: string) {
    const segments: { text: string; bold?: boolean; italic?: boolean }[] = [];
    let remaining = text;

    const regex = /(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*)/g;

    let match;
    let lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: text.slice(lastIndex, match.index) });
      }

      const m = match[0];
      if (m.startsWith("***")) {
        segments.push({ text: m.slice(3, -3), bold: true, italic: true });
      } else if (m.startsWith("**")) {
        segments.push({ text: m.slice(2, -2), bold: true });
      } else if (m.startsWith("*")) {
        segments.push({ text: m.slice(1, -1), italic: true });
      }

      lastIndex = match.index + m.length;
    }

    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex) });
    }

    return segments;
  }

  // ======== Slide de título ========
  const titleSlide = pptx.addSlide();
  const titleSegments = parseText(material.title);
  titleSegments.forEach((seg) => {
    titleSlide.addText(seg.text, {
      x: 1,
      y: 1.5,
      fontSize: 28,
      bold: seg.bold,
      italic: seg.italic,
    });
  });

  // ======== Slides de conteúdo ========
  material.content.split("\n\n").forEach((block: string) => {
    const slide = pptx.addSlide();
    const segments = parseText(block);

    let y = 0.5;
    segments.forEach((seg) => {
      slide.addText(seg.text, {
        x: 0.5,
        y,
        w: 9,
        h: 5,
        fontSize: 18,
        bold: seg.bold,
        italic: seg.italic,
      });
      y += 0.7; // ajusta espaçamento
    });
  });

  const arrayBuffer = (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
