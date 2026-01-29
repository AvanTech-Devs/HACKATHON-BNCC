"use client";

import { useState, useEffect, useCallback } from "react";
import { Discipline } from "@/app/models/types/discipline";
import { localRepository } from "@/app/models/repository/localDisciplineRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";
import { localMaterialRepository } from "@/app/models/repository/localMaterialRepository";

import { Material } from "@/app/models/types/material";
export type MaterialMode = "CONTENT" | "ACTIVITY";




/* =========================
   STATE
========================= */
export interface DisciplineState {
  disciplines: Discipline[];
  loading: boolean;
  error: string | null;
}

/* =========================
   ACTIONS
========================= */
export interface DisciplineActions {
  loadDisciplines: () => void;

  addDiscipline: (
    name: string,
    grade: string
  ) => Promise<Discipline>;

  confirmCreateDiscipline: (
    discipline: string,
    levelLabel: string,
    year: string
  ) => Promise<Discipline>;

  deleteUnit: (
    disciplineId: string,
    unitId: string
  ) => void;

  getRecentContentMaterials: (
    disciplineId: string,
    limit?: number
  ) => Material[];

  getRecentActivityMaterials: (
    disciplineId: string,
    limit?: number
  ) => Material[];
}



/* =========================
   VIEWMODEL
========================= */
export function useUserDisciplineViewModel(): {
  state: DisciplineState;
  actions: DisciplineActions;
} {
  const [state, setState] = useState<DisciplineState>({
    disciplines: [],
    loading: false,
    error: null,
  });

/* =========================
   HELPERS (privados)
========================= */
const getMaterialsByDisciplineInternal = (
  disciplineId: string
): Material[] => {
  const discipline = state.disciplines.find(
    (d) => d.id === disciplineId
  );

  if (!discipline) return [];

  const unitIds = discipline.units.map((u) => u.id);

  return localMaterialRepository
    .getMaterials()
    .filter((m: Material) =>
      unitIds.includes(m.unitId)
    )
    .sort(
      (a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
    );
};



  /* 🔹 LOAD */
  const loadDisciplines = useCallback(() => {
    const stored = localRepository.getDisciplines();
    setState((prev) => ({
      ...prev,
      disciplines: stored,
    }));
  }, []);

  useEffect(() => {
    loadDisciplines();
  }, [loadDisciplines]);

  /* 🔹 ACTIONS */
  
const actions: DisciplineActions = {
  /* 🔹 LOAD */
  loadDisciplines,

  /* 🔹 CRIAR DISCIPLINA (rápido) */
  addDiscipline: async (name, grade) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const newDiscipline: Discipline = {
        id: crypto.randomUUID(),
        name,
        grade,
        createdAt: new Date(),
        units: [],
      };

      localRepository.saveDiscipline(newDiscipline);
      localLogRepository.addLog(
        "Disciplina criada",
        `Disciplina "${name}" (${grade})`
      );

      setState((prev) => ({
        ...prev,
        disciplines: [...prev.disciplines, newDiscipline],
      }));

      return newDiscipline;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Erro ao criar a disciplina",
      }));
      throw error;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  },

  /* 🔹 CRIAR DISCIPLINA (confirmação) */
  confirmCreateDiscipline: async (
    discipline,
    levelLabel,
    year
  ) => {
    if (!discipline || !levelLabel || !year) {
      setState((prev) => ({
        ...prev,
        error: "Selecione o nível de ensino, o ano e a disciplina.",
      }));
      throw new Error("Dados incompletos");
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const newDiscipline: Discipline = {
        id: crypto.randomUUID(),
        name: discipline,
        grade: `${levelLabel} - ${year}`,
        createdAt: new Date(),
        units: [],
      };

      localRepository.saveDiscipline(newDiscipline);
      localLogRepository.addLog(
        "Disciplina criada",
        `Disciplina "${discipline}" (${levelLabel} - ${year})`
      );

      setState((prev) => ({
        ...prev,
        disciplines: [...prev.disciplines, newDiscipline],
      }));

      return newDiscipline;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Erro ao criar a disciplina",
      }));
      throw error;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  },

  /* 🔹 EXCLUIR UNIDADE (corrigido) */
  deleteUnit: (disciplineId, unitId) => {
    setState((prev) => {
      try {
        localUnitRepository.deleteUnitById(unitId);

        const updatedDisciplines = prev.disciplines.map((d) =>
          d.id === disciplineId
            ? {
                ...d,
                units: d.units.filter((u) => u.id !== unitId),
              }
            : d
        );

        const disciplineUpdated = updatedDisciplines.find(
          (d) => d.id === disciplineId
        );

        if (disciplineUpdated) {
          localRepository.updateDiscipline(disciplineUpdated);
        }

        localLogRepository.addLog(
          "Unidade excluída",
          `Unidade ${unitId}`
        );

        return {
          ...prev,
          disciplines: updatedDisciplines,
          loading: false,
        };
      } catch {
        return {
          ...prev,
          loading: false,
          error: "Erro ao excluir unidade",
        };
      }
    });

  },

   /* 📄 PDFs & Slides */
  getRecentContentMaterials: (
    disciplineId,
    limit = 3
  ) => {
    return getMaterialsByDisciplineInternal(disciplineId)
      .filter(
        (m) =>
          m.type === "PDF" ||
          m.type === "SLIDES"
      )
      .slice(0, limit);
  },

  /* 📝 Atividades */
  getRecentActivityMaterials: (
    disciplineId,
    limit = 3
  ) => {
    return getMaterialsByDisciplineInternal(disciplineId)
      .filter(
        (m) =>
          m.type === "RESUMO" ||
          m.type === "ATIVIDADE" ||
          m.type === "PROVA"
      )
      .slice(0, limit);
  },
};



  return {
    state,
    actions,
  };
}
