import { parseRichText } from "@/app/utils/parseRichText";
import { paginatePdfContent } from "@/app/utils/paginatePdfContent";
import { useState } from "react";
import { Material } from "@/app/models/types/material";

type Props = {
  title: string;
  content: string;
};

export function DocumentPreview({ title, content }: Props) {
  const pages = paginatePdfContent(content);
      const [material, setMaterial] = useState<Material | null>(null);
    
  return (
    <div className="document-preview">
      {/* NÃO mostrar título fora do PDF */}

      <div className="pdf-pages">
        {pages.map((lines, pageIndex) => (
          <div key={pageIndex} className="pdf-page">
            {/* TÍTULO só na primeira página */}
            {pageIndex === 0 && (
              <div className="pdf-title">
                <h3>{title}</h3>
                <hr />
              </div>
            )}

            <div className="pdf-content">
              {lines.map((line, i) => {
                const type = classifyLine(line);

                return (
                  <p key={i} className={`pdf-${type}`}>
                    {parseRichText(
                      type === "list"
                        ? line.replace(/^-\s*/, "• ")
                        : line
                    )}
                  </p>
                );
              })}
            </div>

            <PdfFooter page={pageIndex + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

function classifyLine(line: string) {
  if (/^\d+\.\s/.test(line)) return "section";
  if (line.endsWith(":")) return "title";
  if (line.startsWith("- ")) return "list";
  return "text";
}

function PdfFooter({ page }: { page: number }) {
  const date = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="pdf-footer">
      <span>Gerado em {date}</span>
      <span>Página {page}</span>
    </div>
  );
}
