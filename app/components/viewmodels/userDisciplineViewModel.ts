import { useState, useEffect } from "react";
import { createDiscipline } from "@/app/services/disciplineService";
import { Discipline } from "@/app/models/types/discipline";
import { localRepository } from "@/app/models/repository/localRepository";

export function useUserDisciplineViewModel() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedDisciplines = localRepository.getDisciplines();
    setDisciplines(storedDisciplines);
  }, []);

  const addDiscipline = async (
    name: string,
    grade: string
  ): Promise<Discipline> => {
    setLoading(true);
    setError(null);

    try {
      const newDiscipline: Discipline = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        grade,
        createdAt: new Date(),
      };

      localRepository.saveDiscipline(newDiscipline);
      setDisciplines((prev) => [...prev, newDiscipline]);

      return newDiscipline; // 🔴 ESSENCIAL
    } catch (err) {
      setError("Erro ao criar a disciplina");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    disciplines,
    loading,
    error,
    addDiscipline,
  };
}

