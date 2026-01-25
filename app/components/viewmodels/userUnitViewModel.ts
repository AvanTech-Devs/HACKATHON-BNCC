import { useState } from "react";
import { Unit } from "@/app/models/types/unit";
import { localRepository } from "@/app/models/repository/localDisciplineRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";

export function useUserUnitViewModel(disciplineId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // 🔗 vínculo com a disciplina
      localRepository.addUnitToDiscipline(disciplineId, newUnit);

      // 💾 salva a unidade individualmente (detalhes)
      localUnitRepository.saveUnit(newUnit);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { createUnit, loading, error };
}
