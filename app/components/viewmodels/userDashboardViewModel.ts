"use client";

import { useState, useEffect } from "react";
import { localRepository } from "@/app/models/repository/localRepository";
import { Discipline } from "@/app/models/types/discipline";
import { useRouter } from "next/navigation";
import { logAction } from "@/app/utils/logAction";

interface UserDashboardData {
  userName: string;
  credits: number;
  generationHistory: Array<{ type: string; date: string; time: string }>;
  disciplines: Discipline[];
}

export const useUserDashboardViewModel = () => {
  const [dashboardData, setDashboardData] =
    useState<UserDashboardData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedDisciplines = localRepository.getDisciplines();

      const data: UserDashboardData = {
        userName: "Prof. João",
        credits: 260,
        generationHistory: [
          { type: "Plano de aula", date: "15/04", time: "10:35" },
          { type: "Atividade", date: "14/04", time: "15:20" },
          { type: "Slides de apoio", date: "14/04", time: "09:10" },
          { type: "Plano de aula", date: "13/04", time: "11:45" },
        ],
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

  return {
    dashboardData,
    onCreateMaterial,
    onCreateDiscipline,
    onViewDisciplineDetails,
  };
};
