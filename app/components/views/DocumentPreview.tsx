"use client";

import { parseRichText } from "@/app/utils/parseRichText";
import { paginatePdfContent } from "@/app/utils/paginatePdfContent";
import { useState } from "react";
import { Material } from "@/app/models/types/material";

type Props = {
  title: string;
  content: string;
  editable?: boolean; // modo de edição
  onChange?: (updatedContent: string) => void; // callback para MaterialDetailsPage
};

export function DocumentPreview({ title, content, editable = false, onChange }: Props) {
  const [localContent, setLocalContent] = useState(content);
  const pages = paginatePdfContent(localContent);

  const handleTextChange = (newValue: string) => {
    setLocalContent(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="document-preview">
      {/* EDIÇÃO */}
      {editable ? (
        <textarea
          value={localContent}
          onChange={(e) => handleTextChange(e.target.value)}
          style={{ width: "100%", minHeight: "400px", fontFamily: "inherit" }}
        />
      ) : (
        <div className="pdf-pages">
          {pages.map((lines, pageIndex) => (
            <div key={pageIndex} className="pdf-page">
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
                      {parseRichText(type === "list" ? line.replace(/^-\s*/, "• ") : line)}
                    </p>
                  );
                })}
              </div>

              <PdfFooter page={pageIndex + 1} />
            </div>
          ))}
        </div>
      )}
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
