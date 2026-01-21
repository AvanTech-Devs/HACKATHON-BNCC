"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/styles/disciplines.css";
import { localRepository } from "@/app/models/repository/localRepository";
import { Discipline } from "@/app/models/types/discipline";

const DisciplinePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [discipline, setDiscipline] = useState<Discipline | null>(null);

  useEffect(() => {
    const disciplines = localRepository.getDisciplines();
    const found = disciplines.find((d) => d.id === id);

    if (!found) {
      router.push("/dashboard");
      return;
    }

    setDiscipline(found);
  }, [id, router]);

  if (!discipline) {
    return <p>Carregando...</p>;
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
