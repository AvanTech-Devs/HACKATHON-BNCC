"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

import { Material, MaterialType } from "@/app/models/types/material";
import { supabaseMaterialRepository } from "@/app/models/repository/supabase/supabaseMaterialRepository";
import { supabaseLogRepository } from "@/app/models/repository/supabase/supabaseLogRepository";
import { supabaseUnitRepository } from "@/app/models/repository/supabase/supabaseUnitRepository";

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

  deleteMaterial: (materialId: string) => Promise<void>;

  exportMaterial: (
    materialId: string,
    format: "PDF" | "SLIDES"
  ) => Promise<void>;

  getFilteredMaterials: (
    unitId: string,
    mode: MaterialMode
  ) => Material[];

  getAllowedTypesByMode: (mode: MaterialMode) => MaterialType[];

  updateMaterial: (updatedMaterial: Material) => Promise<void>;

  getMaterialById: (materialId: string) => Material | null;
}

/* =========================
   VIEWMODEL
========================= */
export function useUserMaterialViewModel(): {
  state: MaterialState;
  actions: MaterialActions;
} {
  const { unitId } = useParams<{ unitId: string }>();

  const [state, setState] = useState<MaterialState>({
    loading: false,
    error: null,
    materials: [],
  });

  /* =========================
     LOAD MATERIALS (AUTO)
  ========================= */
  const loadMaterialsByUnit = useCallback(async (unitId: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const materials =
        await supabaseMaterialRepository.getMaterialsByUnitId(unitId);

      setState((prev) => ({
        ...prev,
        materials,
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        error: "Erro ao carregar materiais",
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (unitId) {
      loadMaterialsByUnit(unitId);
    }
  }, [unitId, loadMaterialsByUnit]);

  /* =========================
     ACTIONS
  ========================= */
  const actions: MaterialActions = {
    /* 🧠 Tipos permitidos por modo */
    getAllowedTypesByMode: (mode) =>
      mode === "CONTENT"
        ? ["SLIDES", "PDF"]
        : ["RESUMO", "ATIVIDADE", "PROVA"],

    /* 🎯 FILTRO SINCRONO */
    getFilteredMaterials: (unitId, mode) => {
      const allowedTypes = actions.getAllowedTypesByMode(mode);

      return state.materials.filter(
        (m) =>
          m.unitId === unitId &&
          allowedTypes.includes(m.type)
      );
    },

    /* 🔍 Buscar por ID (sincrono) */
    getMaterialById: (materialId) => {
      return (
        state.materials.find((m) => m.id === materialId) ??
        null
      );
    },

   /* 🧠 Gerar material */
generateMaterial: async (unitId, materialType) => {
  setState((prev) => ({ ...prev, loading: true }));

  try {
    const unit = await supabaseUnitRepository.getUnitById(unitId);
    if (!unit) throw new Error("Unidade não encontrada");

    // Pegando o conteúdo atual da página (edição incluída)
    const lessonPlan = unit.lessonPlan ?? "";
    const activity = unit.activity ?? "";

    const response = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unitTitle: unit.theme,
        unitContext: unit.context,
        lessonPlan,
        activity,
        materialType,
      }),
    });

    if (!response.ok) throw new Error("Erro ao gerar material");

    const data = await response.json();

    const material: Material = {
      id: crypto.randomUUID(),
      unitId,
      title: `${materialType} - ${unit.theme}`,
      type: materialType,
      content: data.content,
      createdAt: new Date(),
    };

    await supabaseMaterialRepository.saveMaterial(material);

    setState((prev) => ({
      ...prev,
      materials: [material, ...prev.materials],
    }));

    supabaseLogRepository.addLog("Material gerado", material.title);

    return material;
  } catch (err) {
    console.error(err);
    setState((prev) => ({
      ...prev,
      error: "Erro ao gerar material",
    }));
    return null;
  } finally {
    setState((prev) => ({ ...prev, loading: false }));
  }
},


    /* 🗑️ Excluir */
    deleteMaterial: async (materialId) => {
      await supabaseMaterialRepository.deleteMaterialById(materialId);

      setState((prev) => ({
        ...prev,
        materials: prev.materials.filter(
          (m) => m.id !== materialId
        ),
      }));

      supabaseLogRepository.addLog(
        "Material excluído",
        materialId
      );
    },

    /* ✏️ Atualizar */
    updateMaterial: async (updatedMaterial) => {
      await supabaseMaterialRepository.updateMaterial(
        updatedMaterial
      );

      setState((prev) => ({
        ...prev,
        materials: prev.materials.map((m) =>
          m.id === updatedMaterial.id
            ? updatedMaterial
            : m
        ),
      }));
    },

    /* 📤 Exportar */
    exportMaterial: async (materialId, format) => {
      const material =
        state.materials.find((m) => m.id === materialId);
      if (!material) return;

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material, format }),
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${material.title}.${format === "PDF" ? "pdf" : "pptx"}`;
      a.click();
      URL.revokeObjectURL(url);
    },
  };

  return { state, actions };
}
