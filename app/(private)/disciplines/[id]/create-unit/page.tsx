"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useUserUnitViewModel } from "@/app/components/viewmodels/userUnitViewModel";
import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";

import "@/app/styles/create-unit.css";

export default function CreateUnitPage() {
  const { id: disciplineId } = useParams();
  const router = useRouter();

  /* 🔹 ViewModels */
  const { createUnit, generateSuggestions, loading, error } =
    useUserUnitViewModel(disciplineId as string);

  const { state } = useUserDisciplineViewModel();

  /* 🔹 Disciplina associada */
  const discipline = state.disciplines.find(
    (d) => d.id === disciplineId
  );

  /* 🔹 Form */
  const [theme, setTheme] = useState("");
  const [context, setContext] = useState("");

  if (!discipline) {
    return <p>Carregando disciplina...</p>;
  }

  /* 🔹 IA — sugerir tema */
  const handleSuggestTheme = async () => {
    const suggestions = await generateSuggestions(
      "theme",
      discipline.name,
      discipline.grade,
      "Base Nacional Comum Curricular (BNCC)"
    );

    if (suggestions.length > 0) {
      setTheme(suggestions[0]);
    }
  };

  /* 🔹 IA — sugerir contexto */
  const handleSuggestContext = async () => {
    const suggestions = await generateSuggestions(
      "context",
      discipline.name,
      discipline.grade,
      "Base Nacional Comum Curricular (BNCC)"
    );

    if (suggestions.length > 0) {
      setContext(suggestions[0]);
    }
  };

  /* 🔹 Salvar aula */
  const handleSaveUnit = async () => {
    if (!theme || !context) {
      alert("Preencha todos os campos.");
      return;
    }

    await createUnit(theme, context);
    alert("Aula criada com sucesso!");
    router.push(`/disciplines/${disciplineId}`);
  };

  return (
    <div className="create-unit-container">
      <h1>Criar Nova Aula</h1>

      <p className="discipline-info">
        <strong>{discipline.name}</strong> — {discipline.grade}
      </p>

      <form
        className="create-unit-form"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 🔹 TEMA */}
        <label>
          Tema
          <div className="input-with-button">
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: Introdução às cores primárias"
            />
            <button type="button" onClick={handleSuggestTheme}>
              💡 Sugerir
            </button>
          </div>
        </label>

        {/* 🔹 CONTEXTO */}
        <label>
          Contexto
          <div className="input-with-button">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Contextualização pedagógica da aula"
            />
            <button type="button" onClick={handleSuggestContext}>
              ✨ Sugerir
            </button>
          </div>
        </label>

        <button
          type="button"
          onClick={handleSaveUnit}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Aula"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
