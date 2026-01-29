"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/material-details.css";

import { useUserMaterialViewModel } from "@/app/components/viewmodels/useUserMaterialViewModel";
import { Material } from "@/app/models/types/material";

const MaterialDetailsPage = () => {
  const { id, unitId, materialId } = useParams();
  const router = useRouter();

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
        <h2>Conteúdo</h2>
        <pre>{material.content}</pre>
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
