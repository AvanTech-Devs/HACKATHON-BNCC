"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useUserUnitViewModel } from "@/app/components/viewmodels/userUnitViewModel";
import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";

import "@/app/styles/create-unit.css";

export default function CreateUnitPage() {
  const { id: disciplineId } = useParams();
  const router = useRouter();

  const { state: unitState, actions: unitActions } =
    useUserUnitViewModel();

  const { state: disciplineState } =
    useUserDisciplineViewModel();

  const discipline = disciplineState.disciplines.find(
    (d) => d.id === disciplineId
  );

  const [theme, setTheme] = useState("");
  const [context, setContext] = useState("");

  if (!discipline) {
    return <p>Carregando disciplina...</p>;
  }

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
        {/* TEMA */}
        <label>
          Tema
          <div className="input-with-button">
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
            <button
              type="button"
              onClick={async () => {
                const suggestion =
                  await unitActions.generateThemeSuggestion(
                    discipline.name,
                    discipline.grade,
                    "Base Nacional Comum Curricular (BNCC)"
                  );
                if (suggestion) setTheme(suggestion);
              }}
            >
              💡 Sugerir
            </button>
          </div>
        </label>

        {/* CONTEXTO */}
        <label>
          Contexto
          <div className="input-with-button">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <button
              type="button"
              onClick={async () => {
                const suggestion =
                  await unitActions.generateContextSuggestion(
                    discipline.name,
                    discipline.grade,
                    "Base Nacional Comum Curricular (BNCC)"
                  );
                if (suggestion) setContext(suggestion);
              }}
            >
              ✨ Sugerir
            </button>
          </div>
        </label>

        <button
          type="button"
          disabled={unitState.loading}
          onClick={async () => {
            try {
              await unitActions.createUnit(
                discipline.id,
                theme,
                context
              );
              alert("Aula criada com sucesso!");
              router.push(`/disciplines/${discipline.id}`);
            } catch {}
          }}
        >
          {unitState.loading ? "Carregando..." : "Salvar Aula"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/disciplines/${discipline.id}`)}
        >
          Cancelar
        </button>
      </form>

      {unitState.error && (
        <p className="error-message">{unitState.error}</p>
      )}
    </div>
  );
}
