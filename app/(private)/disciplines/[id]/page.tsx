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
      router.push("/dashboard"); // segurança
      return;
    }

    setDiscipline(found);
  }, [id, router]);

  if (!discipline) {
    return <p className="disciplines-container">Carregando disciplina...</p>;
  }

  return (
    <div className="disciplines-container">
      <header className="disciplines-header">
        <h1 className="disciplines-title">{discipline.name}</h1>
        <p className="disciplines-welcome">
          Série: {discipline.grade}
        </p>
        <p>
          Criada em: {discipline.createdAt.toLocaleDateString()}
        </p>
      </header>

      <div className="disciplines-sections">
        <section className="disciplines-section">
          <h2>Aulas</h2>
          <button onClick={() => router.push(`/disciplines/${discipline.id}/create-unit`)}>
            + Criar Aula
          </button>
        </section>

        <section className="disciplines-section">
          <h2>Materiais</h2>
          <button onClick={() => router.push(`/disciplines/${discipline.id}/add-material`)}>
            + Adicionar Material
          </button>
        </section>

        <section className="disciplines-section">
          <h2>Atividades</h2>
          <button onClick={() => router.push(`/disciplines/${discipline.id}/create-activity`)}>
            + Criar Atividade
          </button>
        </section>
      </div>
    </div>
  );
};

export default DisciplinePage;
