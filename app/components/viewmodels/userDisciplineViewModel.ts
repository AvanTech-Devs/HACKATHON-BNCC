"use client";

import { useState, useEffect, useCallback } from "react";
import { Discipline } from "@/app/models/types/discipline";
import { localRepository } from "@/app/models/repository/localDisciplineRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";

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
  addDiscipline: (name: string, grade: string) => Promise<Discipline>;
  confirmCreateDiscipline: (
    discipline: string,
    levelLabel: string,
    year: string
  ) => Promise<Discipline>;
  deleteUnit: (disciplineId: string, unitId: string) => void;
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
  loadDisciplines,

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
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Erro ao criar a disciplina",
      }));
      throw err;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  },

  /* ✅ NOVA ACTION: confirmação da criação */
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
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Erro ao criar a disciplina",
      }));
      throw err;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  },

  deleteUnit: (disciplineId, unitId) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      localUnitRepository.deleteUnitById(unitId);

      const updatedDisciplines = state.disciplines.map((d) =>
        d.id === disciplineId
          ? { ...d, units: d.units.filter((u) => u.id !== unitId) }
          : d
      );

      localRepository.updateDiscipline(
        updatedDisciplines.find((d) => d.id === disciplineId)!
      );

      setState((prev) => ({
        ...prev,
        disciplines: updatedDisciplines,
      }));

      localLogRepository.addLog(
        "Unidade excluída",
        `Unidade ${unitId}`
      );
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Erro ao excluir unidade",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  },
};


  return {
    state,
    actions,
  };
}
