"use client";

import { useState } from "react";
import { Unit } from "@/app/models/types/unit";
import { localRepository } from "@/app/models/repository/localDisciplineRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";

/* =========================
   STATE
========================= */
export interface UnitState {
  loading: boolean;
  error: string | null;
}

/* =========================
   ACTIONS
========================= */
export interface UnitActions {
  generateThemeSuggestion: (
    discipline: string,
    grade: string,
    bnccGuidelines: string
  ) => Promise<string | null>;

  generateContextSuggestion: (
    discipline: string,
    grade: string,
    bnccGuidelines: string
  ) => Promise<string | null>;

  createUnit: (
    disciplineId: string,
    theme: string,
    context: string
  ) => Promise<void>;
}

/* =========================
   VIEWMODEL
========================= */
export function useUserUnitViewModel(): {
  state: UnitState;
  actions: UnitActions;
} {
  const [state, setState] = useState<UnitState>({
    loading: false,
    error: null,
  });

  const actions: UnitActions = {
    /* 🔹 IA — Tema */
    generateThemeSuggestion: async (
      discipline,
      grade,
      bnccGuidelines
    ) => {
      setState({ loading: true, error: null });

      try {
        const response = await fetch("/api/unit-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "theme",
            discipline,
            grade,
            bnccGuidelines,
          }),
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        return data.suggestions?.[0] ?? null;
      } catch {
        setState((prev) => ({
          ...prev,
          error: "Erro ao gerar sugestão de tema",
        }));
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },

    /* 🔹 IA — Contexto */
    generateContextSuggestion: async (
      discipline,
      grade,
      bnccGuidelines
    ) => {
      setState({ loading: true, error: null });

      try {
        const response = await fetch("/api/unit-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "context",
            discipline,
            grade,
            bnccGuidelines,
          }),
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        return data.suggestions?.[0] ?? null;
      } catch {
        setState((prev) => ({
          ...prev,
          error: "Erro ao gerar sugestão de contexto",
        }));
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },

    /* 🔹 Criar Aula */
    createUnit: async (disciplineId, theme, context) => {
      if (!theme || !context) {
        setState((prev) => ({
          ...prev,
          error: "Preencha todos os campos.",
        }));
        throw new Error("Campos obrigatórios");
      }

      setState({ loading: true, error: null });

      try {
        const response = await fetch("/api/units", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme, context, disciplineId }),
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        const newUnit: Unit = {
          id: data.id,
          theme,
          context,
          lessonPlan: data.lessonPlan,
          activity: data.activity,
          createdAt: new Date(data.createdAt),
        };

        localRepository.addUnitToDiscipline(disciplineId, newUnit);
        localUnitRepository.saveUnit(newUnit);
        localLogRepository.addLog(
          "Aula criada",
          `Tema: ${theme}`
        );
      } catch {
        setState((prev) => ({
          ...prev,
          error: "Erro ao criar a aula",
        }));
        throw new Error();
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
  };

  return { state, actions };
}
