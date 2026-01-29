"use client";

import "@/app/styles/dashboard.css";

import { FC } from "react";

import {
  useUserDashboardViewModel,
  DashboardState,
  DashboardActions,
} from "@/app/components/viewmodels/userDashboardViewModel";

import DashboardHeader from "@/app/components/views/DashboardHeader";
import DashboardCard from "@/app/components/views/DashboardCard";
import DashboardFooter from "@/app/components/views/DashboardFooter";
import DashboardDisciplineList from "@/app/components/views/DashboardDisciplineList";

import { formatNumber } from "@/app/utils/formatNumber";
import { formatDate } from "@/app/utils/formatDate";

const DashboardPage: FC = () => {
  const {
    state,
    actions,
  }: {
    state: DashboardState | null;
    actions: DashboardActions;
  } = useUserDashboardViewModel();

  if (!state) {
    return <p className="dashboard-container">Carregando...</p>;
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader
        userName={state.userName}
        onCreateMaterial={actions.createMaterial}
      />


      <div className="dashboard-grid">
        <div className="dashboard-top-row">
  <DashboardCard title="Créditos disponíveis" area="credits">
    <p className="dashboard-credits">
      {formatNumber(state.credits)}
    </p>
  </DashboardCard>

  <button
    className="dashboard-button primary dashboard-create-material"
    onClick={actions.createMaterial}
  >
    <p id="textButtonCreate">+ Criar Novo Material</p>
  </button>
</div>

        <DashboardCard
  title="Atividades Recentes"
  scrollable
  area="logs"
>
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

      <DashboardCard title="Suas Disciplinas" area="disciplines">
          <DashboardDisciplineList
            disciplines={state.disciplines}
            onView={actions.viewDisciplineDetails}
            onDelete={actions.deleteDiscipline}
            onCreate={actions.createDiscipline}
          />
        </DashboardCard>
      </div>


    </div>
  );
};

export default DashboardPage;
