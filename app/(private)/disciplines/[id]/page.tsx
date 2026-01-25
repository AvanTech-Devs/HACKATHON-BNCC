"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/disciplines.css";

import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";

const DisciplinePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { state, actions } = useUserDisciplineViewModel();

  const discipline = state.disciplines.find((d) => d.id === id);

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

      <section className="disciplines-section">
        <h2>Aulas</h2>

        {discipline.units.length === 0 && (
          <p>Nenhuma aula criada.</p>
        )}

        <ul>
          {discipline.units.map((unit) => (
            <li key={unit.id}>
              <strong>{unit.theme}</strong>

              <button
                onClick={() =>
                  router.push(
                    `/disciplines/${discipline.id}/units/${unit.id}`
                  )
                }
              >
                Ver detalhes
              </button>

              <button
                onClick={() =>
                  actions.deleteUnit(discipline.id, unit.id)
                }
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() =>
            router.push(`/disciplines/${discipline.id}/create-unit`)
          }
        >
          + Criar Aula
        </button>
      </section>
    </div>
  );
};

export default DisciplinePage;
