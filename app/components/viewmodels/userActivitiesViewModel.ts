"use client";

import { useState } from "react";
import { Activity } from "@/app/models/types/activity";
import { localActivityRepository } from "@/app/models/repository/localActivityRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";

/* =========================
   STATE
========================= */
export interface ActivityState {
  loading: boolean;
  error: string | null;
}

/* =========================
   ACTIONS
========================= */
export interface ActivityActions {
  generateActivityDescription: (
    title: string
  ) => Promise<string | null>;

  createActivity: (
    title: string,
    unitId: string,
    description?: string
  ) => Promise<void>;
}

/* =========================
   VIEWMODEL
========================= */
export function useUserActivitiesViewModel(): {
  state: ActivityState;
  actions: ActivityActions;
} {
  const [state, setState] = useState<ActivityState>({
    loading: false,
    error: null,
  });

  const actions: ActivityActions = {
    /* 🔹 IA — Gerar descrição da atividade */
    generateActivityDescription: async (title) => {
      setState({ loading: true, error: null });

      try {
        const response = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            unitId: "preview", // apenas para gerar descrição
          }),
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        return data.description ?? null;
      } catch {
        setState((prev) => ({
          ...prev,
          error: "Erro ao gerar descrição da atividade",
        }));
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },

    /* 🔹 Criar atividade */
    createActivity: async (title, unitId, description) => {
      if (!title || !unitId) {
        setState((prev) => ({
          ...prev,
          error: "Preencha todos os campos obrigatórios.",
        }));
        throw new Error("Campos obrigatórios");
      }

      setState({ loading: true, error: null });

      try {
        const response = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, unitId, description }),
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        const newActivity: Activity = {
          id: data.id,
          title: data.title,
          unitId: data.unitId,
          description: data.description,
          createdAt: new Date(data.createdAt),
        };

        // 🔹 Salva localmente
        localActivityRepository.create(newActivity);

        // 🔹 Log
        localLogRepository.addLog(
          "Atividade criada",
          `Atividade: ${title}`
        );
      } catch {
        setState((prev) => ({
          ...prev,
          error: "Erro ao criar atividade",
        }));
        throw new Error();
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
  };

  return { state, actions };
}
