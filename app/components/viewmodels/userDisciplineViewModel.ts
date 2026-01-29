"use client";

import { useState, useEffect, useCallback } from "react";

import { Discipline } from "@/app/models/types/discipline";
import { Material } from "@/app/models/types/material";

import { supabaseDisciplineRepository } from "@/app/models/repository/supabase/supabaseDiciplineRepository";
import { supabaseMaterialRepository } from "@/app/models/repository/supabase/supabaseMaterialRepository";
import { supabaseUnitRepository } from "@/app/models/repository/supabase/supabaseUnitRepository";
import { supabaseLogRepository } from "@/app/models/repository/supabase/supabaseLogRepository";

export type MaterialMode = "CONTENT" | "ACTIVITY";

/* =========================
   STATE
========================= */
export interface DisciplineState {
  disciplines: Discipline[];
  materials: Material[]; // 🔥 cache local
  loading: boolean;
  error: string | null;
}

/* =========================
   ACTIONS
========================= */
export interface DisciplineActions {
  loadDisciplines: () => Promise<void>;

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
  ) => Promise<void>;

  // 👇 AGORA SÍNCRONO (igual localRepository)
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
export function useUserDisciplineViewModel() {
  const [state, setState] = useState<DisciplineState>({
    disciplines: [],
    materials: [],
    loading: false,
    error: null,
  });

  /* =========================
     LOAD DISCIPLINES + MATERIALS
  ========================= */
  const loadDisciplines = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
  const [disciplines, materials] = await Promise.all([
    supabaseDisciplineRepository.getDisciplines(),
    supabaseMaterialRepository.getMaterials(),
  ]);

  setState({
    disciplines,
    materials,
    loading: false,
    error: null,
  });
} catch (err) {
  console.error("Erro loadDisciplines:", err);
  setState((prev) => ({
    ...prev,
    loading: false,
    error: "Erro ao carregar dados",
  }));
}

  }, []);

  useEffect(() => {
    loadDisciplines();
  }, [loadDisciplines]);

  /* =========================
     HELPERS (SYNC)
  ========================= */
  const getMaterialsByDiscipline = (
    disciplineId: string
  ): Material[] => {
    const discipline = state.disciplines.find(
      (d) => d.id === disciplineId
    );

    if (!discipline) return [];

    const unitIds = discipline.units.map((u) => u.id);

    return state.materials
      .filter((m) => unitIds.includes(m.unitId))
      .sort(
        (a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime()
      );
  };

  /* =========================
     ACTIONS
  ========================= */
  const actions: DisciplineActions = {
    loadDisciplines,

    /* 🔹 CREATE */
    addDiscipline: async (name, grade) => {
      const newDiscipline: Discipline = {
        id: crypto.randomUUID(),
        name,
        grade,
        createdAt: new Date(),
        units: [],
      };

      await supabaseDisciplineRepository.saveDiscipline(
        newDiscipline
      );

      await supabaseLogRepository.addLog(
        "Disciplina criada",
        `Disciplina "${name}" (${grade})`
      );

      setState((prev) => ({
        ...prev,
        disciplines: [...prev.disciplines, newDiscipline],
      }));

      return newDiscipline;
    },

    confirmCreateDiscipline: async (
      discipline,
      levelLabel,
      year
    ) => {
      const newDiscipline: Discipline = {
        id: crypto.randomUUID(),
        name: discipline,
        grade: `${levelLabel} - ${year}`,
        createdAt: new Date(),
        units: [],
      };

      await supabaseDisciplineRepository.saveDiscipline(
        newDiscipline
      );

      await supabaseLogRepository.addLog(
        "Disciplina criada",
        `Disciplina "${discipline}" (${levelLabel} - ${year})`
      );

      setState((prev) => ({
        ...prev,
        disciplines: [...prev.disciplines, newDiscipline],
      }));

      return newDiscipline;
    },

    deleteUnit: async (disciplineId, unitId) => {
      await supabaseUnitRepository.deleteUnitById(unitId);

      await supabaseLogRepository.addLog(
        "Unidade excluída",
        `Unidade ${unitId}`
      );

      setState((prev) => ({
        ...prev,
        disciplines: prev.disciplines.map((d) =>
          d.id === disciplineId
            ? {
                ...d,
                units: d.units.filter(
                  (u) => u.id !== unitId
                ),
              }
            : d
        ),
        materials: prev.materials.filter(
          (m) => m.unitId !== unitId
        ),
      }));
    },

    /* 📄 PDFs & Slides */
    getRecentContentMaterials: (
      disciplineId,
      limit = 3
    ) =>
      getMaterialsByDiscipline(disciplineId)
        .filter(
          (m) =>
            m.type === "PDF" ||
            m.type === "SLIDES"
        )
        .slice(0, limit),

    /* 📝 Atividades */
    getRecentActivityMaterials: (
      disciplineId,
      limit = 3
    ) =>
      getMaterialsByDiscipline(disciplineId)
        .filter(
          (m) =>
            m.type === "RESUMO" ||
            m.type === "ATIVIDADE" ||
            m.type === "PROVA"
        )
        .slice(0, limit),
  };

  return { state, actions };
}
