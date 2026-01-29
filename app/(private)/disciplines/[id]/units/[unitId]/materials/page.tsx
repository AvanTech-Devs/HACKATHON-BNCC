"use client";

import React, { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import "@/app/styles/materials.css";

import { useUserMaterialViewModel } from "@/app/components/viewmodels/useUserMaterialViewModel";
import { Material, MaterialType } from "@/app/models/types/material";

type MaterialMode = "CONTENT" | "ACTIVITY";

const MaterialsPage = () => {
  const { id, unitId } = useParams<{
    id: string;
    unitId: string;
  }>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const { state, actions } = useUserMaterialViewModel();

  /* 🧠 Modo da página (define o que mostrar) */
  const mode: MaterialMode =
    searchParams.get("mode") === "activity"
      ? "ACTIVITY"
      : "CONTENT";

  /* 🧠 Tipos permitidos por modo */
  const allowedTypes: MaterialType[] =
    mode === "CONTENT"
      ? ["SLIDES", "PDF"]
      : ["RESUMO", "ATIVIDADE", "PROVA"];

  const [materials, setMaterials] = useState<Material[]>([]);

  /* 🔄 Carrega materiais da unidade */
  useEffect(() => {
    setMaterials(actions.getMaterialsByUnit(unitId));
  }, [unitId]);

  /* 🧠 Gerar material com IA */
  const handleGenerateMaterial = async (
    type: MaterialType
  ) => {
    const material = await actions.generateMaterial(
      unitId,
      type
    );

    if (material) {
      setMaterials(actions.getMaterialsByUnit(unitId));
    }
  };

  /* 🗑️ Excluir material */
  const handleDeleteMaterial = (materialId: string) => {
    actions.deleteMaterial(materialId);
    setMaterials(actions.getMaterialsByUnit(unitId));
  };

  /* 🎯 Filtrar materiais exibidos */
  const filteredMaterials = materials.filter((material) =>
    allowedTypes.includes(material.type)
  );

  if (state.loading) {
    return <p>Gerando material...</p>;
  }

  return (
    <div className="materials-container">
      <header>
        <h1>
          {mode === "CONTENT"
            ? "Materiais Didáticos"
            : "Atividades e Avaliações"}
        </h1>

        <button onClick={() => router.back()}>
          Voltar
        </button>
      </header>

      {state.error && (
        <p className="error">{state.error}</p>
      )}

      {/* 🔹 AÇÕES */}
      <section className="materials-actions">
        <h2>Gerar com IA</h2>

        {mode === "CONTENT" && (
          <>
            <button
              onClick={() =>
                handleGenerateMaterial("SLIDES")
              }
            >
              Gerar Slides
            </button>

            <button
              onClick={() =>
                handleGenerateMaterial("PDF")
              }
            >
              Gerar PDF
            </button>
          </>
        )}

        {mode === "ACTIVITY" && (
          <>
            <button
              onClick={() =>
                handleGenerateMaterial("RESUMO")
              }
            >
              Gerar Resumo
            </button>

            <button
              onClick={() =>
                handleGenerateMaterial("ATIVIDADE")
              }
            >
              Gerar Atividade
            </button>

            <button
              onClick={() =>
                handleGenerateMaterial("PROVA")
              }
            >
              Gerar Prova
            </button>
          </>
        )}
      </section>

      {/* 🔹 LISTA */}
      <section className="materials-list">
        <h2>Materiais Criados</h2>

        {filteredMaterials.length === 0 && (
          <p>Nenhum material gerado ainda.</p>
        )}

        <ul>
          {filteredMaterials.map((material) => (
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
                  onClick={() =>
                    handleDeleteMaterial(material.id)
                  }
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
