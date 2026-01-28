"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/material-details.css";
import { parseRichText } from "@/app/utils/parseRichText";

import { useUserMaterialViewModel } from "@/app/components/viewmodels/useUserMaterialViewModel";
import { Material } from "@/app/models/types/material";
import { parseSlides } from "@/app/utils/slidePreview";


const MaterialDetailsPage = () => {
  const { id, unitId, materialId } = useParams();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const { state, actions } = useUserMaterialViewModel();
  const [material, setMaterial] = useState<Material | null>(null);

  /* 🔄 Carrega material */
  useEffect(() => {
    const found = actions.getMaterialById(materialId as string);
    if (found) {
      setMaterial(found);
    }
  }, [materialId]);

  if (!material) {
    return <p>Material não encontrado.</p>;
  }
const slidePreviews = material.type === "SLIDES"
  ? parseSlides(material.content)
  : [];

  return (
    
    <div className="material-details-container">
      <header>
        <h1>{material.title}</h1>
        <button onClick={() => router.back()}>Voltar</button>
      </header>

      <section className="material-meta">
        <p><strong>Tipo:</strong> {material.type}</p>
<p>
  <strong>Criado em:</strong>{" "}
  {material.createdAt.toLocaleString("pt-BR")}
</p>
      </section>

    <section className="material-content">
  <h2>Preview dos Slides</h2>

  <div className="slides-workspace">
    {/* ===== SIDEBAR (miniaturas) ===== */}
    <aside className="slides-sidebar">
      {slidePreviews.map((slide, index) => (
        <div
          key={index}
          className={`slide-thumb ${index === activeSlide ? "active" : ""}`}
          onClick={() => setActiveSlide(index)}
        >
          <span className="slide-number">{index + 1}</span>

          {slide.type === "cover" ? (
            <strong>{slide.title}</strong>
          ) : (
            <div className="thumb-text">
  {slide.text
    .split("\n")
    .slice(0, 2) // limita linhas na thumb
    .map((line, i) => (
      <p key={i}>{parseRichText(line)}</p>
    ))}
</div>

          )}
        </div>
      ))}
    </aside>

    {/* ===== SLIDE PRINCIPAL ===== */}
    <div className="slide-stage">
      {(() => {
        const slide = slidePreviews[activeSlide];

        if (!slide) return null;

        if (slide.type === "cover") {
          return (
            <div className="slide slide-cover slide-large">
              <div className="slide-header" />
              <h3>{slide.title}</h3>
              <span className="slide-sub">Tópico</span>
            </div>
          );
        }

        return (
          <div className="slide slide-content slide-large">
            <div className="slide-header" />
            <div className="slide-body">
              <div className="slide-text">
                {slide.text.split("\n").map((line, i) => (
                  <p key={i}>{parseRichText(line)}</p>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  </div>
</section>



      <section className="material-actions">
        <button onClick={() => actions.exportMaterial(material.id, "PDF")}>
          Exportar PDF
        </button>

        <button onClick={() => actions.exportMaterial(material.id, "SLIDES")}>
          Exportar Slides
        </button>
      </section>
    </div>
  );
};

export default MaterialDetailsPage;
