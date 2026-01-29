"use client";

import { useState } from "react";
import { Unit } from "@/app/models/types/unit";

import { supabaseUnitRepository } from "@/app/models/repository/supabase/supabaseUnitRepository";
import { supabaseLogRepository } from "@/app/models/repository/supabase/supabaseLogRepository";

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
  ) => Promise<Unit>;
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

        if (!response.ok) throw new Error();

        const data = await response.json();
        return data.suggestions?.[0] ?? null;
      } catch {
        setState({
          loading: false,
          error: "Erro ao gerar sugestão de tema",
        });
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

        if (!response.ok) throw new Error();

        const data = await response.json();
        return data.suggestions?.[0] ?? null;
      } catch {
        setState({
          loading: false,
          error: "Erro ao gerar sugestão de contexto",
        });
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },

    /* 🔹 Criar Unidade (Supabase) */
    createUnit: async (disciplineId, theme, context) => {
      if (!theme || !context) {
        setState({
          loading: false,
          error: "Preencha todos os campos.",
        });
        throw new Error("Campos obrigatórios");
      }

      setState({ loading: true, error: null });

      try {
        // 🔹 Backend gera lessonPlan + activity
        const response = await fetch("/api/units", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme, context, disciplineId }),
        });

        if (!response.ok) throw new Error();

        const data = await response.json();

        const newUnit: Unit = {
          id: data.id,
          theme,
          context,
          lessonPlan: data.lessonPlan,
          activity: data.activity,
          createdAt: new Date(data.createdAt),
        };

        // 🔥 Supabase
        await supabaseUnitRepository.saveUnit(
          disciplineId,
          newUnit
        );

        await supabaseLogRepository.addLog(
          "Unidade criada",
          `Tema: ${theme}`
        );

        return newUnit;
      } catch {
        setState({
          loading: false,
          error: "Erro ao criar a aula",
        });
        throw new Error("Erro ao criar unidade");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
  };

  return { state, actions };
}
