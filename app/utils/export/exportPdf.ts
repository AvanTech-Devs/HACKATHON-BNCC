import jsPDF from "jspdf";
import { Material } from "@/app/models/types/material";

export function exportPdf(material: Material): Buffer {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Função para renderizar linha com **negrito**
  function renderLine(line: string, x: number, y: number, fontSize: number) {
    const parts = line.split(/(\*\*.+?\*\*)/g); // divide pelo padrão **texto**
    let currentX = x;

    parts.forEach((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        pdf.setFont("helvetica", "bold");
        const text = part.slice(2, -2);
        pdf.text(text, currentX, y);
        currentX += pdf.getTextWidth(text);
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.text(part, currentX, y);
        currentX += pdf.getTextWidth(part);
      }
    });
  }

  // ======== TÍTULO ========
  pdf.setFontSize(18);
  const titleLines = pdf.splitTextToSize(material.title, pageWidth - margin * 2);
  let y = 20;
  titleLines.forEach((line: string) => {
    renderLine(line, pageWidth / 2 - pdf.getTextWidth(line) / 2, y, 18);
    y += 9;
  });

  y += 5; // espaço entre título e conteúdo

  // ======== CONTEÚDO ========
  pdf.setFontSize(12);
  const contentLines = pdf.splitTextToSize(material.content, pageWidth - margin * 2);

  contentLines.forEach((line: string) => {
    if (y > 280) {
      pdf.addPage();
      y = 20;
    }
    renderLine(line, margin, y, 12);
    y += 7;
  });

  return Buffer.from(pdf.output("arraybuffer"));
}
