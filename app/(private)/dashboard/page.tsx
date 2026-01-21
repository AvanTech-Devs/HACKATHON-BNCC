"use client";

import React from "react";
import "@/app/styles/dashboard.css";
import { useUserDashboardViewModel } from "../../components/viewmodels/userDashboardViewModel";
import DashboardHeader from "../../components/views/DashboardHeader";
import DashboardCard from "../../components/views/DashboardCard";
import DashboardFooter from "../../components/views/DashboardFooter";
import { formatNumber } from "../../utils/formatNumber";
import { formatDate } from "../../utils/formatDate";

const DashboardPage = () => {
  const {
    dashboardData,
    onCreateMaterial,
    onCreateDiscipline,
    onViewDisciplineDetails,
  } = useUserDashboardViewModel();

  if (!dashboardData) {
    return <p className="dashboard-container">Carregando...</p>;
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader userName={dashboardData.userName} />

      <div className="dashboard-grid">
        <DashboardCard title="Créditos disponíveis">
          <p className="dashboard-credits">
            {formatNumber(dashboardData.credits)}
          </p>
        </DashboardCard>

        <DashboardCard title="Histórico de Gerações">
          <ul className="dashboard-list">
            {dashboardData.generationHistory.map((item, index) => (
              <li key={index}>
                {item.type} — {formatDate(item.date)} às {item.time}
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard title="Suas Disciplinas">
          {dashboardData.disciplines.length === 0 ? (
            <p className="dashboard-empty">
              Nenhuma disciplina criada ainda.
            </p>
          ) : (
            <ul className="dashboard-discipline-list">
              {dashboardData.disciplines.map((discipline) => (
                <li key={discipline.id} className="discipline-item">
                  <span>
                    <strong>{discipline.name}</strong> — {discipline.grade}
                  </span>

                  <button
                    className="view-discipline-button"
                    onClick={() =>
                      onViewDisciplineDetails(discipline.id)
                    }
                  >
                    Ver Detalhes
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="dashboard-button primary"
            onClick={onCreateDiscipline}
          >
            + Criar Nova Disciplina
          </button>
        </DashboardCard>
      </div>

      {/* ✅ Footer usando ação do ViewModel */}
      <DashboardFooter onCreateMaterial={onCreateMaterial} />
    </div>
  );
};

export default DashboardPage;
