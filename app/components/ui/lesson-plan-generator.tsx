"use client";

import React, { useState } from "react";

type LessonPlanResponse = {
  lessonPlan: string;
};

const LessonPlanGenerator = () => {
  const [theme, setTheme] = useState("");
  const [grade, setGrade] = useState("fundamental1");
  const [competencies, setCompetencies] = useState("");
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateLessonPlan = async () => {
    if (!theme || !competencies) {
      alert("Preencha o tema e as competências.");
      return;
    }

    setLoading(true);
    setLessonPlan(null);

    try {
      const response = await fetch("/api/chat/lesson-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
          grade,
          competencies: competencies
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar o plano de aula.");
      }

      const data: LessonPlanResponse = await response.json();
      setLessonPlan(data.lessonPlan);
    } catch (error) {
      console.error("[LessonPlanGenerator]", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao gerar o plano de aula."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Gerador de Plano de Aula</h1>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Tema:</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Digite o tema da aula"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Série:</label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="fundamental1">Ensino Fundamental I</option>
          <option value="fundamental2">Ensino Fundamental II</option>
          <option value="medio">Ensino Médio</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Competências (separadas por vírgula):
        </label>
        <input
          type="text"
          value={competencies}
          onChange={(e) => setCompetencies(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Ex: Resolver problemas, Pensamento crítico"
        />
      </div>

      <button
        onClick={generateLessonPlan}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading || !theme || !competencies}
      >
        {loading ? "Gerando plano de aula..." : "Gerar Plano de Aula"}
      </button>

      {loading && (
        <p className="mt-2 text-gray-500">
          Consultando BNCC e documentos pedagógicos...
        </p>
      )}

      {lessonPlan && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Plano de Aula Gerado:</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {lessonPlan}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LessonPlanGenerator;
