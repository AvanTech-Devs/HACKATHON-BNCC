"use client";

import React from "react";
import "@/app/styles/disciplines.css";
import { useRouter } from "next/navigation";
import { logAction } from "../../utils/logAction";

const DisciplinesPage = () => {
  const router = useRouter();

  const classes = [
    { name: "Matemática Básica", date: "04/05 às 09:00" },
    { name: "Geometria", date: "03/05 às 14:30" },
  ];

  const materials = [
    { name: "Exercícios de Frações", details: "7 slides", date: "Enviado em 30/04" },
    { name: "Quiz de Equações", details: "PDF", date: "Enviado em 26/04" },
  ];

  const activities = [
    { name: "Prova sobre Equações", details: "02/15 alunos responderam", date: "28/04" },
    { name: "Quiz de Frações", details: "15 alunos responderam", date: "28/04" },
  ];

  const handleCreateClass = () => {
    logAction("Criar Aula");
    router.push("/create-unit");
  };

  const handleAddMaterial = () => logAction("Adicionar Material");
  const handleCreateActivity = () => logAction("Criar Atividade");
  const handleCreateContent = () => logAction("Criar Novo Conteúdo");

  return (
    <div className="disciplines-container">
      <header className="disciplines-header">
        <h1 className="disciplines-title">Matemática</h1>
        <p className="disciplines-welcome">
          Bem-vindo à disciplina de Matemática, Prof. João! Utilize esta página para gerenciar suas aulas e materiais.
        </p>
      </header>

      <div className="disciplines-sections">
        <section className="disciplines-section">
          <h2>Aulas</h2>
          <ul>
            {classes.map((cls, index) => (
              <li key={index}>
                {cls.name} <span>{cls.date}</span>
              </li>
            ))}
          </ul>
          <button className="disciplines-button" onClick={handleCreateClass}>
            + Criar Aula
          </button>
        </section>

        <section className="disciplines-section">
          <h2>Materiais</h2>
          <ul>
            {materials.map((material, index) => (
              <li key={index}>
                {material.name} <span>{material.details}</span> <span>{material.date}</span>
              </li>
            ))}
          </ul>
          <button className="disciplines-button" onClick={handleAddMaterial}>
            + Adicionar Material
          </button>
        </section>

        <section className="disciplines-section">
          <h2>Atividades Recentes</h2>
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>
                {activity.name} <span>{activity.details}</span> <span>{activity.date}</span>
              </li>
            ))}
          </ul>
          <button className="disciplines-button" onClick={handleCreateActivity}>
            + Criar Atividade
          </button>
        </section>
      </div>

      <button className="disciplines-button primary" onClick={handleCreateContent}>
        + Criar Novo Conteúdo
      </button>
    </div>
  );
};

export default DisciplinesPage;
