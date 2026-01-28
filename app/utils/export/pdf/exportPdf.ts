import jsPDF from "jspdf";
import { Material } from "@/app/models/types/material";
import { applyPdfTemplate } from "./pdfTemplate";

export function exportPdf(material: Material): Buffer {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 25;

  let pageNumber = 1;

  // TEMPLATE PRIMEIRA PÁGINA
  applyPdfTemplate(pdf, material.title, pageNumber);

  let y = 55; // começa abaixo do título

  function renderLine(line: string, x: number, y: number) {
    const parts = line.split(/(\*\*.+?\*\*)/g);
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

  pdf.setFontSize(11);

  const contentLines = pdf.splitTextToSize(
    material.content,
    pageWidth - margin * 2
  );

  contentLines.forEach((line: string) => {
    if (y > 270) {
      pdf.addPage();
      pageNumber++;

      applyPdfTemplate(pdf, material.title, pageNumber);
      y = 35;
    }

    renderLine(line, margin, y);
    y += 6;
  });

  return Buffer.from(pdf.output("arraybuffer"));
}
