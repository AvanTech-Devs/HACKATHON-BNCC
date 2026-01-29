"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Discipline } from "@/app/models/types/discipline";
import { LogEntry } from "@/app/models/types/logs";

import { supabaseDisciplineRepository } from "@/app/models/repository/supabase/supabaseDiciplineRepository";
import { supabaseLogRepository } from "@/app/models/repository/supabase/supabaseLogRepository";

/* =========================
   DASHBOARD STATE
========================= */
export interface DashboardState {
  userName: string;
  credits: number;
  disciplines: Discipline[];
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
}

/* =========================
   DASHBOARD ACTIONS
========================= */
export interface DashboardActions {
  createMaterial: () => void;
  createDiscipline: () => void;
  viewDisciplineDetails: (disciplineId: string) => void;
  deleteDiscipline: (disciplineId: string) => Promise<void>;
}

/* =========================
   VIEWMODEL
========================= */
export const useUserDashboardViewModel = (): {
  state: DashboardState | null;
  actions: DashboardActions;
} => {
  const [state, setState] = useState<DashboardState | null>(null);
  const router = useRouter();

  /* =========================
     LOAD INICIAL (SUPABASE)
  ========================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [disciplines, logs] = await Promise.all([
          supabaseDisciplineRepository.getDisciplines(),
          supabaseLogRepository.getLogs(),
        ]);

        setState({
          userName: "Prof. João",
          credits: 260,
          disciplines,
          logs,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        setState({
          userName: "Prof. João",
          credits: 0,
          disciplines: [],
          logs: [],
          loading: false,
          error: "Erro ao carregar dados do dashboard",
        });
      }
    };

    loadDashboard();
  }, []);

  /* =========================
     ACTIONS
  ========================= */
  const actions: DashboardActions = {
    createMaterial: useCallback(() => {
      router.push("/add-material");
    }, [router]),

    createDiscipline: useCallback(() => {
      router.push("/create-discipline");
    }, [router]),

    viewDisciplineDetails: useCallback(
      (disciplineId: string) => {
        router.push(`/disciplines/${disciplineId}`);
      },
      [router]
    ),

    deleteDiscipline: useCallback(
      async (disciplineId: string) => {
        if (!state) return;

        await supabaseDisciplineRepository.deleteDisciplineById(
          disciplineId
        );

        await supabaseLogRepository.addLog(
          "Disciplina excluída",
          `Disciplina ${disciplineId}`
        );

        setState({
          ...state,
          disciplines: state.disciplines.filter(
            (d) => d.id !== disciplineId
          ),
        });
      },
      [state]
    ),
  };

  return { state, actions };
};
