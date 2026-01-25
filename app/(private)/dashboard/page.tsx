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
  const { state, actions } = useUserDashboardViewModel();

  if (!state) {
    return <p className="dashboard-container">Carregando...</p>;
  }

  return (
    <div className="dashboard-container">
      {/* 🔹 HEADER */}
      <DashboardHeader userName={state.userName} />

      <div className="dashboard-grid">
        {/* 🔹 CRÉDITOS */}
        <DashboardCard title="Créditos disponíveis">
          <p className="dashboard-credits">
            {formatNumber(state.credits)}
          </p>
        </DashboardCard>

        {/* 🔹 LOGS */}
        <DashboardCard title="Atividades Recentes">
          {state.logs.length === 0 ? (
            <p className="dashboard-empty">
              Nenhuma atividade registrada.
            </p>
          ) : (
            <ul className="dashboard-list">
              {state.logs.map((log) => (
                <li key={log.id}>
                  <strong>{log.action}</strong>
                  {log.description && ` — ${log.description}`}
                  <br />
                  <small>{formatDate(log.createdAt)}</small>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        {/* 🔹 DISCIPLINAS */}
        <DashboardCard title="Suas Disciplinas">
          {state.disciplines.length === 0 ? (
            <p className="dashboard-empty">
              Nenhuma disciplina criada ainda.
            </p>
          ) : (
            <ul className="dashboard-discipline-list">
              {state.disciplines.map((discipline) => (
                <li key={discipline.id} className="discipline-item">
                  <span>
                    <strong>{discipline.name}</strong> —{" "}
                    {discipline.grade}
                  </span>

                  <button
                    className="view-discipline-button"
                    onClick={() =>
                      actions.viewDisciplineDetails(discipline.id)
                    }
                  >
                    Ver Detalhes
                  </button>

                  <button
                    className="delete-discipline-button"
                    onClick={() =>
                      actions.deleteDiscipline(discipline.id)
                    }
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="dashboard-button primary"
            onClick={actions.createDiscipline}
          >
            + Criar Nova Disciplina
          </button>
        </DashboardCard>
      </div>

      {/* 🔹 FOOTER */}
      <DashboardFooter
        onCreateMaterial={actions.createMaterial}
      />
    </div>
  );
};

export default DashboardPage;
