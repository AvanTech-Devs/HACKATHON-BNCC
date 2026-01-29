"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/material-details.css";
import { parseRichText } from "@/app/utils/parseRichText";

import { useUserMaterialViewModel } from "@/app/components/viewmodels/useUserMaterialViewModel";
import { Material } from "@/app/models/types/material";
import { parseSlides } from "@/app/utils/slidePreview";
import { SlidesPreview } from "@/app/components/views/SlidesPreview";
import { DocumentPreview } from "@/app/components/views/DocumentPreview";

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
  {material.type === "SLIDES" && (
    <SlidesPreview
      slides={parseSlides(material.content)}
    />
  )}

  {material.type === "PDF" && (
   <DocumentPreview
  title={material.title}
  content={material.content}
/>
  )}

  {material.type === "RESUMO" && (
    <DocumentPreview
        title={material.title}

      content={material.content}
    />
  )}

  {material.type === "ATIVIDADE" && (
    <DocumentPreview
        title={material.title}

      content={material.content}
    />
  )}

  {material.type === "PROVA" && (
    <DocumentPreview
        title={material.title}

      content={material.content}
    />
  )}
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
