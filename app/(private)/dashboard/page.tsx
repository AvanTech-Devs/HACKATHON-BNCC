"use client";

import React from "react";
import "@/app/styles/dashboard.css";
import { useUserDashboardViewModel } from "../../components/viewmodels/userDashboardViewModel";
import DashboardHeader from "../../components/views/DashboardHeader";
import DashboardCard from "../../components/views/DashboardCard";
import DashboardDisciplineList from "../../components/views/DashboardDisciplineList";
import DashboardFooter from "../../components/views/DashboardFooter";
import { formatNumber } from "../../utils/formatNumber";
import { formatDate } from "../../utils/formatDate";
import { logAction } from "../../utils/logAction";

const DashboardPage = () => {
  const { dashboardData } = useUserDashboardViewModel();

  if (!dashboardData) {
    return <p className="dashboard-container">Carregando...</p>;
  }

  const handleCreateDiscipline = () => {
    logAction("Criar Disciplina", { user: dashboardData.userName });
    console.log("Criar disciplina clicado!");
  };

  const handleCreateMaterial = () => {
    logAction("Criar Material", { user: dashboardData.userName });
    console.log("Criar material clicado!");
  };

  return (
    <div className="dashboard-container">
      {/* Cabeçalho */}
      <DashboardHeader userName={dashboardData.userName} />

      <div className="dashboard-grid">
        {/* Créditos */}
        <DashboardCard title="Créditos disponíveis">
          <p className="dashboard-credits">{formatNumber(dashboardData.credits)}</p>
        </DashboardCard>

        {/* Histórico */}
        <DashboardCard title="Histórico de Gerações">
          <ul className="dashboard-list">
            {dashboardData.generationHistory.map((item, index) => (
              <li key={index}>
                {item.type} — {formatDate(item.date)} às {item.time}
              </li>
            ))}
          </ul>
        </DashboardCard>

        {/* Disciplinas */}
        <DashboardCard title="Suas Disciplinas">
          <DashboardDisciplineList
            disciplines={dashboardData.disciplines}
            onCreateDiscipline={handleCreateDiscipline}
          />
        </DashboardCard>
      </div>

      {/* Rodapé */}
      <DashboardFooter onCreateMaterial={handleCreateMaterial} />
    </div>
  );
};

export default DashboardPage;
