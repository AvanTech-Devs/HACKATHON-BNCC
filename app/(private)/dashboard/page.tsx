"use client";

import { useState, FC } from "react";
import "@/app/styles/dashboard.css";

import {
  useUserDashboardViewModel,
  DashboardState,
  DashboardActions,
} from "@/app/components/viewmodels/userDashboardViewModel";

import DashboardHeader from "@/app/components/views/DashboardHeader";
import DashboardCard from "@/app/components/views/DashboardCard";
import DashboardDisciplineList from "@/app/components/views/DashboardDisciplineList";
import DashboardFooter from "@/app/components/views/DashboardFooter";

import SelectMaterialModal from "@/app/components/modals/SelectMaterialModal";

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

  /* =========================
     ESTADO SELEÇÃO MATERIAL
  ========================= */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");

  if (!state) {
    return <p className="dashboard-container theme-dark">Carregando...</p>;
  }

  const handleCreateMaterial = () => setShowCreateModal(true);

  const handleConfirmCreate = () => {
    if (!selectedDisciplineId || !selectedUnitId) return;

    window.location.href = `/disciplines/${selectedDisciplineId}/units/${selectedUnitId}/materials?mode=content`;
  };

  return (
    <div className="dashboard-container theme-dark">
      {/* =========================
          HEADER
      ========================= */}
      <DashboardHeader userName={state.userName} />

      {/* =========================
          GRID PRINCIPAL
      ========================= */}
      <div className="dashboard-grid">
        <div className="dashboard-top-row">
          {/* Créditos */}
          <DashboardCard title="Créditos disponíveis" area="credits">
            <p className="dashboard-credits">{formatNumber(state.credits)}</p>
          </DashboardCard>

          {/* Atividades Recentes */}
          <DashboardCard title="Atividades Recentes" scrollable area="logs">
            {state.logs.length === 0 ? (
              <p className="dashboard-empty">Nenhuma atividade registrada.</p>
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
        </div>

        {/* Disciplinas */}
        <DashboardCard title="Suas Disciplinas" area="disciplines">
          <DashboardDisciplineList
            disciplines={state.disciplines}
            onView={actions.viewDisciplineDetails}
            onDelete={actions.deleteDiscipline}
            onCreate={actions.createDiscipline}
          />
        </DashboardCard>
      </div>

      {/* =========================
          FOOTER COM BOTÃO CRIAR MATERIAL
      ========================= */}
      <DashboardFooter onCreateMaterial={handleCreateMaterial} />

      {/* =========================
          MODAL DE SELEÇÃO
      ========================= */}
      {showCreateModal && (
        <SelectMaterialModal
          disciplines={state.disciplines}
          selectedDisciplineId={selectedDisciplineId}
          setSelectedDisciplineId={setSelectedDisciplineId}
          selectedUnitId={selectedUnitId}
          setSelectedUnitId={setSelectedUnitId}
          onCancel={() => setShowCreateModal(false)}
          onConfirm={handleConfirmCreate}
        />
      )}
    </div>
  );
};

export default DashboardPage;
