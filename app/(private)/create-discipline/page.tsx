"use client";

import React, { useState } from "react";
import "@/app/styles/create-discipline.css";
import { logAction } from "../../utils/logAction";
import { useRouter } from "next/navigation";

const CreateDisciplinePage = () => {
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");

  const years = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"];
  const disciplines = ["Português", "Matemática", "História", "Geografia"];

  const handleConfirmCreation = () => {
    if (!selectedYear || !selectedDiscipline) {
      alert("Por favor, selecione a série/ano e a disciplina.");
      return;
    }

    logAction("Criar Nova Disciplina", { year: selectedYear, discipline: selectedDiscipline });
    console.log(`Disciplina criada: ${selectedDiscipline} para o ano ${selectedYear}`);
    alert(`Disciplina "${selectedDiscipline}" criada com sucesso para o ano "${selectedYear}"!`);
    router.push("/disciplines"); // Redireciona para a página de disciplinas
  };

  const handleBack = () => {
    router.push("/disciplines"); // Redireciona para a página de disciplinas
  };

  return (
    <div className="create-discipline-container">
      <header className="create-discipline-header">
        <h1 className="create-discipline-title">Criar Nova Disciplina</h1>
        <p className="create-discipline-instructions">
          Preencha os campos abaixo para criar uma nova disciplina.
        </p>
      </header>

      <form className="create-discipline-form">
        {/* Série/Ano */}
        <div className="form-group">
          <label htmlFor="year">Série/Ano</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Selecione</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Disciplina */}
        <div className="form-group">
          <label htmlFor="discipline">Disciplina</label>
          <select
            id="discipline"
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
          >
            <option value="">Selecione</option>
            {disciplines.map((discipline, index) => (
              <option key={index} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </div>

        {/* Botões */}
        <div className="form-actions">
          <button
            type="button"
            className="form-button primary"
            onClick={handleConfirmCreation}
          >
            ✅ Confirmar Criação
          </button>
          <button
            type="button"
            className="form-button secondary"
            onClick={handleBack}
          >
            ← Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDisciplinePage;
