"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserUnitViewModel } from "@/app/components/viewmodels/userUnitViewModel";
import "../../../../styles/create-unit.css";

export default function CreateUnitPage() {
  const { id: disciplineId } = useParams();
  const router = useRouter();

  const { createUnit, loading, error } =
    useUserUnitViewModel(disciplineId as string);

  const [theme, setTheme] = useState("");
  const [context, setContext] = useState("");

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

      <form className="create-unit-form">
        <label>
          Tema
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>

        <label>
          Contexto
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </label>

        <button onClick={handleSaveUnit} disabled={loading}>
          {loading ? "Salvando..." : "Salvar Aula"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
