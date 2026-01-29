import jsPDF from "jspdf";

export function applyPdfTemplate(
  pdf: jsPDF,
  title: string,
  pageNumber: number
) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 25;

  // ===== FONTE PADRÃO =====
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0);

  // ===== TÍTULO (APENAS NA PRIMEIRA PÁGINA) =====
  if (pageNumber === 1) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);

    const titleLines = pdf.splitTextToSize(title, pageWidth - margin * 2);
    let y = 30;

    titleLines.forEach((line: string) => {
      pdf.text(line, pageWidth / 2, y, { align: "center" });
      y += 6;
    });

    // Linha separadora
    pdf.setLineWidth(0.5);
    pdf.line(margin, y + 4, pageWidth - margin, y + 4);
  }

  // ===== RODAPÉ =====
  pdf.setFontSize(9);
  pdf.setTextColor(120);

  const date = new Date().toLocaleDateString("pt-BR");

  pdf.text(
    `Gerado em ${date}`,
    margin,
    pageHeight - 15
  );

  pdf.text(
    `Página ${pageNumber}`,
    pageWidth - margin,
    pageHeight - 15,
    { align: "right" }
  );

  // Reset
  pdf.setTextColor(0);
}
