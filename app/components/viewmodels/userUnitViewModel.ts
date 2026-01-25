import { useState } from "react";
import { Unit } from "@/app/models/types/unit";
import { localRepository } from "@/app/models/repository/localDisciplineRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";

export function useUserUnitViewModel(disciplineId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 🔹 IA: gerar sugestões (on-demand) */
  const generateSuggestions = async (
    type: "theme" | "context",
    discipline: string,
    grade: string,
    bnccGuidelines: string
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/unit-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          discipline,
          grade,
          bnccGuidelines,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar sugestões");
      }

      const data = await response.json();
      return data.suggestions as string[];
    } catch {
      setError("Erro ao gerar sugestões");
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Criar aula */
  const createUnit = async (theme: string, context: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, context, disciplineId }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a aula.");
      }

      const data = await response.json();

      const newUnit: Unit = {
        id: data.id,
        theme,
        context,
        lessonPlan: data.lessonPlan,
        activity: data.activity,
        createdAt: new Date(data.createdAt),
      };

      localRepository.addUnitToDiscipline(disciplineId, newUnit);
      localUnitRepository.saveUnit(newUnit);
      localLogRepository.addLog("Aula criada", `Tema: ${theme}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createUnit,
    generateSuggestions,
    loading,
    error,
  };
}
