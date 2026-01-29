"use client";

import { useState } from "react";
import { Material, MaterialType } from "@/app/models/types/material";
import { localMaterialRepository } from "@/app/models/repository/localMaterialRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";


/* =========================
   TYPES
========================= */
export type MaterialMode = "CONTENT" | "ACTIVITY";


/* =========================
   STATE
========================= */
export interface MaterialState {
  loading: boolean;
  error: string | null;
    materials: Material[];

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

   /* 🧠 NOVAS FUNÇÕES */
  

  getFilteredMaterials: (
    unitId: string,
    mode: MaterialMode
  ) => Material[];

  getAllowedTypesByMode: (
    mode: MaterialMode
  ) => MaterialType[];

  updateMaterial: (updatedMaterial: Material) => void;


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
      materials: [],

  });


  const actions: MaterialActions = {

     /* 🧠 Tipos permitidos por modo */
  getAllowedTypesByMode: (
    mode: MaterialMode
  ): MaterialType[] => {
    return mode === "CONTENT"
      ? ["SLIDES", "PDF"]
      : ["RESUMO", "ATIVIDADE", "PROVA"];
  },


/* 🔄 Atualizar material */
updateMaterial: (updatedMaterial: Material) => {
  try {
    localMaterialRepository.updateMaterial(updatedMaterial);

    // Atualiza state local
    setState(prev => ({
      ...prev,
      materials: prev.materials.map(m =>
        m.id === updatedMaterial.id ? updatedMaterial : m
      ),
    }));

    // Log
    localLogRepository.addLog(
      "Material editado",
      `ID: ${updatedMaterial.id} | Título: ${updatedMaterial.title}`
    );
  } catch (err) {
    setState(prev => ({ ...prev, error: "Erro ao atualizar material" }));
    console.error(err);
  }
},



  /* 🎯 Filtrar materiais exibidos por modo */
  getFilteredMaterials : (
    unitId: string,
    mode: MaterialMode
  ) => {
    const materials = actions.getMaterialsByUnit(unitId);
    const allowedTypes = actions.getAllowedTypesByMode(mode);

    return materials.filter((m) =>
      allowedTypes.includes(m.type)
    );
  },


    /* 🧠 Gerar material com IA */
   generateMaterial: async (unitId, materialType) => {
  setState({ loading: true, error: null, materials: state.materials });

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

    try {
      // chama a rota server que gera PDF ou Slides
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material, format }),
      });

      if (!res.ok) throw new Error("Erro na exportação");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // baixa automaticamente
      const a = document.createElement("a");
      a.href = url;
      a.download = `${material.title}.${format === "PDF" ? "pdf" : "pptx"}`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Erro ao exportar material");
    }
  },




  };

  return { state, actions };
}
