"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { localRepository } from "@/app/models/repository/local/localDisciplineRepository";
import { localLogRepository } from "@/app/models/repository/local/localLogRepository";

import { Discipline } from "@/app/models/types/discipline";
import { LogEntry } from "@/app/models/types/logs";
import { logAction } from "@/app/utils/logAction";

/* =========================
   DASHBOARD STATE
========================= */
export interface DashboardState {
  userName: string;
  credits: number;
  disciplines: Discipline[];
  logs: LogEntry[];
}

/* =========================
   DASHBOARD ACTIONS
========================= */
export interface DashboardActions {
  createMaterial: () => void;
  createDiscipline: () => void;
  viewDisciplineDetails: (disciplineId: string) => void;
  deleteDiscipline: (disciplineId: string) => void;
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

  /* 🔹 LOAD INICIAL */
  useEffect(() => {
    setState({
      userName: "Prof. João",
      credits: 260,
      disciplines: localRepository.getDisciplines(),
      logs: localLogRepository.getLogs(),
    });
  }, []);

  /* 🔹 ACTIONS */
  const actions: DashboardActions = {
    createMaterial: useCallback(() => {
      if (!state) return;

      logAction("Criar Material", { user: state.userName });
      router.push("/add-material");
    }, [state, router]),

    createDiscipline: useCallback(() => {
      if (!state) return;

      logAction("Criar Disciplina", { user: state.userName });
      router.push("/create-discipline");
    }, [state, router]),

    viewDisciplineDetails: useCallback(
      (disciplineId: string) => {
        logAction("Ver Detalhes da Disciplina", { disciplineId });
        router.push(`/disciplines/${disciplineId}`);
      },
      [router]
    ),

    deleteDiscipline: useCallback(
      (disciplineId: string) => {
        if (!state) return;

        localRepository.deleteDisciplineById(disciplineId);

        setState({
          ...state,
          disciplines: state.disciplines.filter(
            (d) => d.id !== disciplineId
          ),
        });

        localLogRepository.addLog(
          "Excluir Disciplina",
          `Disciplina com ID ${disciplineId} foi excluída.`
        );
      },
      [state]
    ),
  };

  return {
    state,
    actions,
  };
};
