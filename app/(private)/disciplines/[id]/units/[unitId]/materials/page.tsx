"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/materials.css";

import { useUserMaterialViewModel } from "@/app/components/viewmodels/useUserMaterialViewModel";
import { Material, MaterialType } from "@/app/models/types/material";

const MaterialsPage = () => {
  const { id, unitId } = useParams();
  const router = useRouter();

  const { state, actions } = useUserMaterialViewModel();

  const [materials, setMaterials] = useState<Material[]>(
    actions.getMaterialsByUnit(unitId as string)
  );

  /* 🔄 Atualiza lista ao carregar */
  useEffect(() => {
    setMaterials(actions.getMaterialsByUnit(unitId as string));
  }, [unitId]);

  /* 🧠 Gerar material com IA */
  const handleGenerateMaterial = async (type: MaterialType) => {
    const material = await actions.generateMaterial(
  unitId as string,
  type
);


    if (material) {
      setMaterials(actions.getMaterialsByUnit(unitId as string));
    }
  };

  /* 🗑️ Excluir material */
  const handleDeleteMaterial = (materialId: string) => {
    actions.deleteMaterial(materialId);
    setMaterials(actions.getMaterialsByUnit(unitId as string));
  };

  if (state.loading) {
    return <p>Gerando material...</p>;
  }

  return (
    <div className="materials-container">
      <header>
        <h1>Materiais da Aula</h1>
        <button onClick={() => router.back()}>Voltar</button>
      </header>

      {state.error && <p className="error">{state.error}</p>}

      <section className="materials-actions">
        <h2>Gerar com IA</h2>

        <button onClick={() => handleGenerateMaterial("SLIDES")}>
          Gerar Slides
        </button>

        <button onClick={() => handleGenerateMaterial("PDF")}>
          Gerar PDF
        </button>

        <button onClick={() => handleGenerateMaterial("RESUMO")}>
          Gerar Resumo
        </button>

        <button onClick={() => handleGenerateMaterial("ATIVIDADE")}>
          Gerar Atividade
        </button>

        <button onClick={() => handleGenerateMaterial("PROVA")}>
          Gerar Prova
        </button>
      </section>

      <section className="materials-list">
        <h2>Materiais Criados</h2>

        {materials.length === 0 && (
          <p>Nenhum material gerado ainda.</p>
        )}

        <ul>
          {materials.map((material) => (
            <li key={material.id}>
              <strong>{material.title}</strong>
              <span>Tipo: {material.type}</span>

              <div className="materials-buttons">
                <button
                  onClick={() =>
                    router.push(
                      `/disciplines/${id}/units/${unitId}/materials/${material.id}`
                    )
                  }
                >
                  Ver
                </button>

                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MaterialsPage;
