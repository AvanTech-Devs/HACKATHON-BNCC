"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/create-unit.css";
import { logAction } from "../../utils/logAction";

export default function CreateUnitPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("");
  const [context, setContext] = useState("");

  const handleSaveUnit = () => {
    logAction("Unidade criada", { theme, context });
    alert("Unidade criada com sucesso!");
    router.push("/(private)/disciplines");
  };

  return (
    <div className="create-unit-container">
      <h1>Criar Nova Unidade</h1>
      <p>Preencha os campos abaixo para criar uma nova unidade didática para sua disciplina.</p>

      <form className="create-unit-form">
        <label>
          Tema
          <input
            type="text"
            placeholder="Digite o tema da unidade"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>

        <label>
          Contexto
          <textarea
            placeholder="Explique como o tema se relaciona com a Cultura Digital"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </label>

        <div className="material-buttons">
          <button type="button" onClick={() => logAction("Gerar Plano de Aula")}>
            Gerar Plano de Aula
          </button>
          <button type="button" onClick={() => logAction("Gerar Atividade")}>
            Gerar Atividade
          </button>
          <button type="button" onClick={() => logAction("Gerar Slides de Apoio")}>
            Gerar Slides de Apoio
          </button>
        </div>

        <button type="button" className="save-button" onClick={handleSaveUnit}>
          Salvar Unidade
        </button>
      </form>

      <button className="back-button" onClick={() => router.back()}>
        Voltar
      </button>
    </div>
  );
}
