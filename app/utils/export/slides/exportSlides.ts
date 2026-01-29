import PptxGenJS from "pptxgenjs";
import { Material } from "@/app/models/types/material";

export async function exportSlides(material: Material): Promise<Buffer> {
  const pptx = new PptxGenJS();

  // ===== METADATA =====
  pptx.title = material.title;
  pptx.author = "AvanTech";
  pptx.subject = "Material Educacional";
  pptx.company = "AvanTech";
  pptx.revision = "1";

  // ===== LAYOUT / THEME =====
  pptx.layout = "LAYOUT_16x9";
  pptx.theme = {
    headFontFace: "Arial",
    bodyFontFace: "Arial",
  };

  // ===== MARKDOWN SIMPLES → RICH TEXT =====
  function parseText(text: string) {
    const regex = /(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*)/g;
    const rich: any[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        rich.push({ text: text.slice(lastIndex, match.index) });
      }

      const m = match[0];
      if (m.startsWith("***")) {
        rich.push({ text: m.slice(3, -3), options: { bold: true, italic: true } });
      } else if (m.startsWith("**")) {
        rich.push({ text: m.slice(2, -2), options: { bold: true } });
      } else {
        rich.push({ text: m.slice(1, -1), options: { italic: true } });
      }

      lastIndex = match.index + m.length;
    }

    if (lastIndex < text.length) {
      rich.push({ text: text.slice(lastIndex) });
    }

    return rich;
  }

  // ===== HELPERS PARA CAPA DE TÓPICO =====
  function isTopicCover(block: string) {
    return block.trim().startsWith("### ");
  }

  function extractTopicTitle(block: string) {
    return block
      .replace(/^###\s*/g, "")
      .replace(/:$/, "")
      .trim();
  }

  function addTopicCoverSlide(title: string) {
  const slide = pptx.addSlide();

  // Mesmo fundo do título principal
  slide.background = { color: "0F172A" };

  // Mesma faixa superior
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 1.4,
    fill: { color: "2563EB" },
  });

  // Título do tópico (mesmo padrão do título principal)
  slide.addText(parseText(title), {
    x: 1,
    y: 2.0,
    w: 8,
    h: 2,
    fontSize: 34,
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  // Subtítulo discreto (opcional)
  slide.addText("Tópico", {
    x: 1,
    y: 4.1,
    w: 8,
    fontSize: 14,
    color: "CBD5E1",
    align: "center",
  });
}

  // ===== SLIDE DE TÍTULO PRINCIPAL =====
  const titleSlide = pptx.addSlide();

  titleSlide.background = { color: "0F172A" };

  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 1.4,
    fill: { color: "2563EB" },
  });

  titleSlide.addText(parseText(material.title), {
    x: 1,
    y: 1.8,
    w: 8,
    h: 2,
    fontSize: 36,
    color: "FFFFFF",
    bold: true,
    align: "center",
  });

  titleSlide.addText("Apresentação", {
    x: 1,
    y: 4.2,
    w: 8,
    fontSize: 16,
    color: "CBD5E1",
    align: "center",
  });

  // ===== SLIDES GERADOS A PARTIR DO CONTEÚDO =====
  material.content.split("\n\n").forEach((block) => {
    // 👉 CAPA DE TÓPICO
    if (isTopicCover(block)) {
      const title = extractTopicTitle(block);
      addTopicCoverSlide(title);
      return;
    }

    // 👉 SLIDE NORMAL
    const slide = pptx.addSlide();

    slide.background = { color: "F8FAFC" };

    // Header
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 0.9,
      fill: { color: "1E293B" },
    });

    slide.addText(material.title, {
      x: 0.6,
      y: 0.25,
      fontSize: 16,
      color: "FFFFFF",
      bold: true,
    });

    // Card de conteúdo
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 4,
      fill: { color: "FFFFFF" },
      line: { color: "E2E8F0" },
      rectRadius: 0.1,
    });

    slide.addText(parseText(block), {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 3.5,
      fontSize: 18,
      color: "0F172A",
      valign: "top",
    });

    // Número do slide
    slide.slideNumber = {
      x: "90%",
      y: "95%",
      fontSize: 10,
      color: "64748B",
    };
  });

  // ===== SAÍDA NODE =====
  const buffer = (await pptx.write({
    outputType: "nodebuffer",
    compression: true,
  })) as Buffer;

  return buffer;
}
