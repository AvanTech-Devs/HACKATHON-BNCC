"use client";

import React, { useState } from "react";
import "@/app/styles/create-discipline.css";
import { useRouter } from "next/navigation";

import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";

const CreateDisciplinePage = () => {
  const router = useRouter();

  const { state, actions } = useUserDisciplineViewModel();

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");

  const years = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"];
  const disciplines = ["Português", "Matemática", "História", "Geografia"];

  const handleConfirmCreation = async () => {
    if (!selectedYear || !selectedDiscipline) {
      alert("Por favor, selecione a série/ano e a disciplina.");
      return;
    }

    try {
      const createdDiscipline = await actions.addDiscipline(
        selectedDiscipline,
        selectedYear
      );

      alert(
        `Disciplina "${createdDiscipline.name}" criada com sucesso!`
      );

      router.push(`/disciplines/${createdDiscipline.id}`);
    } catch {
      alert("Erro ao criar a disciplina. Tente novamente.");
    }
  };

  const handleBack = () => {
    router.push("/disciplines");
  };

  return (
    <div className="create-discipline-container">
      <header className="create-discipline-header">
        <h1 className="create-discipline-title">
          Criar Nova Disciplina
        </h1>
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
            {years.map((year) => (
              <option key={year} value={year}>
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
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
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
            disabled={state.loading}
          >
            {state.loading ? "Criando..." : "✅ Confirmar Criação"}
          </button>

          <button
            type="button"
            className="form-button secondary"
            onClick={handleBack}
          >
            ← Voltar
          </button>
        </div>

        {/* Erro */}
        {state.error && (
          <p className="error-message">{state.error}</p>
        )}
      </form>
    </div>
  );
};

export default CreateDisciplinePage;
