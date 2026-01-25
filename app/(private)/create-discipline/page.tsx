"use client";

import React, { useState } from "react";
import "@/app/styles/create-discipline.css";
import { useRouter } from "next/navigation";

import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";
import {
  EDUCATION_STRUCTURE,
  EducationLevel,
} from "@/app/constants/education";

const CreateDisciplinePage = () => {
  const router = useRouter();
  const { state, actions } = useUserDisciplineViewModel();

  const [level, setLevel] = useState<EducationLevel | "">("");
  const [year, setYear] = useState("");
  const [discipline, setDiscipline] = useState("");

  const educationData = level ? EDUCATION_STRUCTURE[level] : null;

  

  return (
    <div className="create-discipline-container">
      <header className="create-discipline-header">
        <h1>Criar Nova Disciplina</h1>
        <p>Selecione o nível de ensino, ano e disciplina.</p>
      </header>

      <form className="create-discipline-form">
        {/* NÍVEL DE ENSINO */}
        <div className="form-group">
          <label>Nível de Ensino</label>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as EducationLevel);
              setYear("");
              setDiscipline("");
            }}
          >
            <option value="">Selecione</option>
            <option value="fundamental">Ensino Fundamental</option>
            <option value="medio">Ensino Médio</option>
          </select>
        </div>

        {/* ANO */}
        {educationData && (
          <div className="form-group">
            <label>Ano/Série</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Selecione</option>
              {educationData.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* DISCIPLINA */}
        {educationData && (
          <div className="form-group">
            <label>Disciplina</label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
            >
              <option value="">Selecione</option>
              {educationData.disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* BOTÕES */}
        <div className="form-actions">
         <button
  type="button"
  className="form-button primary"
  disabled={state.loading}
  onClick={async () => {
    try {
      const created = await actions.confirmCreateDiscipline(
        discipline,
        educationData!.label,
        year
      );

      alert(`Disciplina "${created.name}" criada com sucesso!`);
      router.push(`/disciplines/${created.id}`);
    } catch {
      // erro já está no state.error
    }
  }}
>
  {state.loading ? "Criando..." : "✅ Confirmar Criação"}
</button>


          <button
            type="button"
            className="form-button secondary"
            onClick={() => router.push("/dashboard")}
          >
            ← Voltar
          </button>
        </div>

        {state.error && (
          <p className="error-message">{state.error}</p>
        )}
      </form>
    </div>
  );
};

export default CreateDisciplinePage;
