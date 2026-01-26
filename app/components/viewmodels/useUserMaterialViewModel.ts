"use client";

import { useState } from "react";
import { Material, MaterialType } from "@/app/models/types/material";
import { localMaterialRepository } from "@/app/models/repository/localMaterialRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";

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
    unitTitle: string,
    unitContext: string,
    materialType: MaterialType
  ) => Promise<Material | null>;

  getMaterialsByUnit: (unitId: string) => Material[];

  deleteMaterial: (materialId: string) => void;
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
    /* 🔹 Gerar material com IA */
    generateMaterial: async (
      unitId,
      unitTitle,
      unitContext,
      materialType
    ) => {
      setState({ loading: true, error: null });

      try {
        const response = await fetch("/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitTitle,
            unitContext,
            materialType,
          }),
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        const material: Material = {
          id: crypto.randomUUID(),
          unitId,
          title: `${materialType} - ${unitTitle}`,
          type: materialType,
          content: data.content,
          createdAt: new Date(data.createdAt),
        };

        /* 🔹 Salva no localStorage */
        localMaterialRepository.saveMaterial(material);

        /* 🔹 Log */
        localLogRepository.addLog(
          "Material gerado",
          `Tipo: ${materialType} | Aula: ${unitTitle}`
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

    /* 🔹 Listar materiais por aula */
    getMaterialsByUnit: (unitId: string) => {
      return localMaterialRepository.getMaterialsByUnitId(unitId);
    },

    /* 🔹 Excluir material */
    deleteMaterial: (materialId: string) => {
      localMaterialRepository.deleteMaterialById(materialId);

      localLogRepository.addLog(
        "Material excluído",
        `ID do material: ${materialId}`
      );
    },
  };

  return { state, actions };
}
