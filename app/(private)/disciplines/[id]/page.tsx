"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/disciplines.css";

import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";

const DisciplinePage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [materialMode, setMaterialMode] = useState<"content" | "activity" | null>(null);

  const { state, actions } = useUserDisciplineViewModel();

  const discipline = state.disciplines.find((d) => d.id === id);

  const recentContentMaterials = discipline
    ? actions.getRecentContentMaterials(discipline.id)
    : [];

  const recentActivityMaterials = discipline
    ? actions.getRecentActivityMaterials(discipline.id)
    : [];

  const handleOpenCreate = (mode: "content" | "activity") => {
    setMaterialMode(mode);
    setSelectedUnitId(null);
    setShowUnitModal(true);
  };

  useEffect(() => {
    if (!discipline && state.disciplines.length > 0) {
      router.push("/dashboard");
    }
  }, [discipline, state.disciplines, router]);

  if (state.loading) {
    return <p>Carregando...</p>;
  }

  if (!discipline) return null;

  return (
    <div className="disciplines-container">
      <header>
        <h1>{discipline.name}</h1>
        <p>Série: {discipline.grade}</p>
      </header>

      <section className="disciplines-cards">
        {/* 📘 CARD AULAS */}
        <div className="discipline-card">
          <h2>📘 Aulas</h2>

          {discipline.units.length === 0 ? (
            <p>Nenhuma aula criada.</p>
          ) : (
            <ul>
              {discipline.units.slice(0, 3).map((unit) => (
                <li
                  key={unit.id}
                  className="unit-item"
                  onClick={() =>
                    router.push(
                      `/disciplines/${discipline.id}/units/${unit.id}`
                    )
                  }
                >
                  <span className="unit-title">{unit.theme}</span>

                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(`Deseja excluir a aula "${unit.theme}"?`)
                      ) {
                        actions.deleteUnit(discipline.id, unit.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="dashboard-button primary"
            onClick={() =>
              router.push(`/disciplines/${discipline.id}/create-unit`)
            }
          >
            + Criar Aula
          </button>
        </div>

        {/* 📄 CARD PDF & SLIDES */}
        <div className="discipline-card">
          <h2>📄 PDFs & Slides</h2>

          {recentContentMaterials.length === 0 ? (
            <p>Nenhum material recente.</p>
          ) : (
            <ul>
              {recentContentMaterials.map((m) => (
                <li
                  key={m.id}
                  className="clickable"
                  onClick={() =>
                    router.push(
                      `/disciplines/${discipline.id}/units/${m.unitId}/materials/${m.id}`
                    )
                  }
                >
                  {m.title} ({m.type})
                </li>
              ))}
            </ul>
          )}

          <button
            className="dashboard-button primary"
            onClick={() => handleOpenCreate("content")}
          >
            Criar Material
          </button>
        </div>

        {/* 📝 CARD ATIVIDADES */}
        <div className="discipline-card">
          <h2>📝 Atividades & Avaliações</h2>

          {recentActivityMaterials.length === 0 ? (
            <p>Nenhuma atividade recente.</p>
          ) : (
            <ul>
              {recentActivityMaterials.map((m) => (
                <li
                  key={m.id}
                  className="clickable"
                  onClick={() =>
                    router.push(
                      `/disciplines/${discipline.id}/units/${m.unitId}/materials/${m.id}`
                    )
                  }
                >
                  {m.title} ({m.type})
                </li>
              ))}
            </ul>
          )}

          <button
            className="dashboard-button primary"
            onClick={() => handleOpenCreate("activity")}
          >
            Criar Atividade
          </button>
        </div>
      </section>

      {/* MODAL */}
      {showUnitModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Selecione a aula</h3>

            <select
              value={selectedUnitId ?? ""}
              onChange={(e) => setSelectedUnitId(e.target.value)}
            >
              <option value="">Escolha uma aula</option>
              {discipline.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.theme}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                className="dashboard-button"
                onClick={() => setShowUnitModal(false)}
              >
                Cancelar
              </button>

              <button
                className="dashboard-button primary"
                disabled={!selectedUnitId}
                onClick={() => {
                  router.push(
                    `/disciplines/${discipline.id}/units/${selectedUnitId}/materials?mode=${materialMode}`
                  );
                  setShowUnitModal(false);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinePage;
