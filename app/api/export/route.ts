import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import jsPDF from "jspdf";

export async function POST(req: NextRequest) {
  const { material, format } = await req.json();

  if (!material || !format) {
    return NextResponse.json(
      { error: "Dados inválidos" },
      { status: 400 }
    );
  }

  /* ================= PDF ================= */
  if (format === "PDF") {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(material.title, 10, 20);

    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(material.content, 180);
    pdf.text(lines, 10, 35);

    const buffer = Buffer.from(pdf.output("arraybuffer"));

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${material.title}.pdf"`,
      },
    });
  }

  /* ================= SLIDES ================= */
  if (format === "SLIDES") {
    const pptx = new PptxGenJS();

    const titleSlide = pptx.addSlide();
    titleSlide.addText(material.title, {
      x: 1,
      y: 1.5,
      fontSize: 24,
      bold: true,
    });

    material.content.split("\n\n").forEach((block: string) => {
      const slide = pptx.addSlide();
      slide.addText(block, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 5,
        fontSize: 16,
      });
    });

    const arrayBuffer = (await pptx.write({
      outputType: "arraybuffer",
    })) as ArrayBuffer;

    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${material.title}.pptx"`,
      },
    });
  }

  return NextResponse.json(
    { error: "Formato inválido" },
    { status: 400 }
  );
}
