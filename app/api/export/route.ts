import { NextRequest, NextResponse } from "next/server";
import { exportPdf } from "@/app/utils/export/pdf/exportPdf";
import { exportSlides } from "@/app/utils/export/slides/exportSlides";
import { Material } from "@/app/models/types/material";

export async function POST(req: NextRequest) {
  const { material, format }: { material: Material; format: "PDF" | "SLIDES" } =
    await req.json();

  if (!material || !format)
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  try {
    if (format === "PDF") {
      const buffer = exportPdf(material); // Buffer ou ArrayBuffer
      // converte para Uint8Array para o NextResponse aceitar
      const uint8Array = new Uint8Array(buffer);

      return new NextResponse(uint8Array, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${material.title}.pdf"`,
        },
      });
    }

    if (format === "SLIDES") {
      const buffer = await exportSlides(material);
      const uint8Array = new Uint8Array(buffer);

      return new NextResponse(uint8Array, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="${material.title}.pptx"`,
        },
      });
    }

    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao exportar material" }, { status: 500 });
  }
}
