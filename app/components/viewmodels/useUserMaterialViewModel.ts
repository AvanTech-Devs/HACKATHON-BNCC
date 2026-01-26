"use client";

import { useState } from "react";
import { Material, MaterialType } from "@/app/models/types/material";
import { localMaterialRepository } from "@/app/models/repository/localMaterialRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";

/* =========================
   STATE
========================= */
export interface MaterialState {
  loading: boolean;
  error: string | null;
}

/* =========================
   ACTIONS
========================= */
export interface MaterialActions {
  generateMaterial: (
  unitId: string,
  materialType: MaterialType
) => Promise<Material | null>;

  getMaterialsByUnit: (unitId: string) => Material[];

  getMaterialById: (materialId: string) => Material | undefined;

  deleteMaterial: (materialId: string) => void;

  exportMaterial: (
    materialId: string,
    format: "PDF" | "SLIDES"
  ) => void;
}

/* =========================
   VIEWMODEL
========================= */
export function useUserMaterialViewModel(): {
  state: MaterialState;
  actions: MaterialActions;
} {
  const [state, setState] = useState<MaterialState>({
    loading: false,
    error: null,
  });

  const actions: MaterialActions = {
    /* 🧠 Gerar material com IA */
   generateMaterial: async (unitId, materialType) => {
  setState({ loading: true, error: null });

  try {
    const unit = localUnitRepository.getUnitById(unitId);

    if (!unit) {
      throw new Error("Aula não encontrada");
    }

    // 🧠 CONTEXTO COMPLETO DA AULA
    const unitContext = `
Tema da aula:
${unit.theme}

Contexto:
${unit.context}

Plano de aula:
${unit.lessonPlan}

Atividade prevista:
${unit.activity}
`;

    const response = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unitTitle: unit.theme,
        unitContext,
        materialType,
      }),
    });

    if (!response.ok) throw new Error();

    const data = await response.json();

    const material: Material = {
      id: crypto.randomUUID(),
      unitId,
      title: `${materialType} - ${unit.theme}`,
      type: materialType,
      content: data.content,
      createdAt: new Date(),
    };

    localMaterialRepository.saveMaterial(material);

    localLogRepository.addLog(
      "Material gerado",
      `Tipo: ${materialType} | Aula: ${unit.theme}`
    );

    return material;
  } catch {
    setState((prev) => ({
      ...prev,
      error: "Erro ao gerar material educacional",
    }));
    return null;
  } finally {
    setState((prev) => ({ ...prev, loading: false }));
  }
},


    /* 📚 Materiais da aula */
    getMaterialsByUnit: (unitId) => {
      return localMaterialRepository.getMaterialsByUnitId(unitId);
    },

    /* 🔍 Buscar material por ID */
    getMaterialById: (materialId) => {
      return localMaterialRepository.getMaterialById(materialId);
    },

    /* 🗑️ Excluir */
    deleteMaterial: (materialId) => {
      localMaterialRepository.deleteMaterialById(materialId);

      localLogRepository.addLog(
        "Material excluído",
        `ID do material: ${materialId}`
      );
    },

    /* 📤 Exportar (mock por enquanto) */
   exportMaterial: async (materialId, format) => {
  const material = localMaterialRepository.getMaterialById(materialId);
  if (!material) return;

  const response = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ material, format }),
  });

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    format === "PDF"
      ? `${material.title}.pdf`
      : `${material.title}.pptx`;

  a.click();
  window.URL.revokeObjectURL(url);

  localLogRepository.addLog(
    "Material exportado",
    `ID: ${materialId} | Formato: ${format}`
  );
},




  };

  return { state, actions };
}
