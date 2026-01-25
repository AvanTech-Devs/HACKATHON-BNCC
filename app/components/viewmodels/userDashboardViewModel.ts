"use client";

import { useState, useEffect } from "react";
import { localRepository } from "@/app/models/repository/localDisciplineRepository";
import { Discipline } from "@/app/models/types/discipline";
import { useRouter } from "next/navigation";
import { logAction } from "@/app/utils/logAction";
import { localLogRepository } from "@/app/models/repository/localLogRepository";
import { LogEntry } from "@/app/models/types/logs";

interface UserDashboardData {
  userName: string;
  credits: number;
  disciplines: Discipline[];
  logs: LogEntry[];
}

export const useUserDashboardViewModel = () => {
  const [dashboardData, setDashboardData] =
    useState<UserDashboardData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedDisciplines = localRepository.getDisciplines();
      const generationHistory = localLogRepository.getLogs();

      const data: UserDashboardData = {
        userName: "Prof. João",
        credits: 260,
        logs: generationHistory,
        disciplines: storedDisciplines,
      };

      setDashboardData(data);
    };

    fetchDashboardData();
  }, []);

  // 🔹 AÇÃO DO FOOTER
  const onCreateMaterial = () => {
    if (!dashboardData) return;

    logAction("Criar Material", { user: dashboardData.userName });
    router.push("/add-material");
  };

  // 🔹 AÇÃO DO DASHBOARD
  const onCreateDiscipline = () => {
    if (!dashboardData) return;

    logAction("Criar Disciplina", { user: dashboardData.userName });
    router.push("/create-discipline");
  };

  const onViewDisciplineDetails = (disciplineId: string) => {
    logAction("Ver Detalhes da Disciplina", { disciplineId });
    router.push(`/disciplines/${disciplineId}`);
  };

  // 🔹 NOVA FUNÇÃO: Excluir disciplina
  const onDeleteDiscipline = (disciplineId: string) => {
    if (!dashboardData) return;

    // Remove a disciplina do repositório local
    localRepository.deleteDisciplineById(disciplineId);

    // Atualiza os dados do dashboard
    const updatedDisciplines = dashboardData.disciplines.filter(
      (discipline) => discipline.id !== disciplineId
    );

    setDashboardData({
      ...dashboardData,
      disciplines: updatedDisciplines,
    });

    // Registra a ação no log
    const logDescription = `Disciplina com ID ${disciplineId} foi excluída.`;
    localLogRepository.addLog("Excluir Disciplina", logDescription);
  };

  return {
    dashboardData,
    onCreateMaterial,
    onCreateDiscipline,
    onViewDisciplineDetails,
    onDeleteDiscipline,
  };
};
