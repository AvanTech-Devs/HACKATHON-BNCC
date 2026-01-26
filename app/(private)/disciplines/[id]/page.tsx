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

  const recentMaterials =
    discipline
      ? actions.getRecentMaterialsByDiscipline(discipline.id)
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

      {/* 🔹 AULAS */}
      <section className="disciplines-section">
        <h2>Aulas</h2>

        {discipline.units.length === 0 && (
          <p>Nenhuma aula criada.</p>
        )}

        <ul>
  {discipline.units.map((unit) => (
    <li key={unit.id}>
      <strong>{unit.theme}</strong>

      <div className="unit-buttons">
        <button
          onClick={() =>
            router.push(
              `/disciplines/${discipline.id}/units/${unit.id}`
            )
          }
        >
          Ver detalhes
        </button>

        {/* 🧠 NOVO BOTÃO */}
        <button
          onClick={() =>
            router.push(
              `/disciplines/${discipline.id}/units/${unit.id}/materials`
            )
          }
        >
          Criar material
        </button>

        <button
          onClick={() =>
            actions.deleteUnit(discipline.id, unit.id)
          }
        >
          Excluir
        </button>
      </div>
    </li>
  ))}
</ul>


        <button
          onClick={() =>
            router.push(
              `/disciplines/${discipline.id}/create-unit`
            )
          }
        >
          + Criar Aula
        </button>
      </section>

      {/* 🔹 MATERIAIS RECENTES */}
      <section className="disciplines-section">
        <h2>Materiais Recentes</h2>

        {recentMaterials.length === 0 && (
          <p>Nenhum material gerado ainda.</p>
        )}

        <ul>
          {recentMaterials.map((material) => (
            <li key={material.id}>
              <strong>{material.title}</strong>
              <span> ({material.type})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DisciplinePage;
