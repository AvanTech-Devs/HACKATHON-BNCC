"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/disciplines.css";

import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";

const DisciplinePage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { state, actions } = useUserDisciplineViewModel();

  const discipline = state.disciplines.find(
    (d) => d.id === id
  );

  const recentContentMaterials = discipline
    ? actions.getRecentContentMaterials(discipline.id)
    : [];

  const recentActivityMaterials = discipline
    ? actions.getRecentActivityMaterials(discipline.id)
    : [];

  useEffect(() => {
    if (!discipline && state.disciplines.length > 0) {
      router.push("/dashboard");
    }
  }, [discipline, state.disciplines, router]);

  if (state.loading) {
    return <p>Carregando...</p>;
  }

  if (!discipline) {
    return null;
  }

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

              const confirmDelete = confirm(
                `Deseja excluir a aula "${unit.theme}"?`
              );

              if (confirmDelete) {
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
    onClick={() =>
      router.push(
        `/disciplines/${discipline.id}/create-unit`
      )
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
            onClick={() =>
              router.push(
                `/disciplines/${discipline.id}/units/${discipline.units[0]?.id}/materials?mode=content`
              )
            }
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
            onClick={() =>
              router.push(
                `/disciplines/${discipline.id}/units/${discipline.units[0]?.id}/materials?mode=activity`
              )
            }
          >
            Criar Atividade
          </button>
        </div>
      </section>
    </div>
  );
};

export default DisciplinePage;
