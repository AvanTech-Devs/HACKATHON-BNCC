"use client";

import { useState, useEffect } from "react";
import { Discipline } from "@/app/models/types/discipline";
import { localRepository } from "@/app/models/repository/localDisciplineRepository";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";
import { localLogRepository } from "@/app/models/repository/localLogRepository";

export function useUserDisciplineViewModel() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDisciplines = () => {
    const stored = localRepository.getDisciplines();
    setDisciplines(stored);
  };

  useEffect(() => {
    loadDisciplines();
  }, []);

  const addDiscipline = async (
    name: string,
    grade: string
  ): Promise<Discipline> => {
    setLoading(true);
    setError(null);

    try {
      const newDiscipline: Discipline = {
        id: crypto.randomUUID(),
        name,
        grade,
        createdAt: new Date(),
        units: [], // 🔥 FUNDAMENTAL
      };

      localRepository.saveDiscipline(newDiscipline);
      localLogRepository.addLog(
        "Disciplina criada",
        `Disciplina "${name}" (${grade})`
      );
      setDisciplines((prev) => [...prev, newDiscipline]);

      return newDiscipline;
    } catch (err) {
      setError("Erro ao criar a disciplina");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = (disciplineId: string, unitId: string) => {
  setLoading(true);
  setError(null);

  try {
    // remove do repositório de unidades
    localUnitRepository.deleteUnitById(unitId);

    // atualiza disciplina
    const disciplines = localRepository.getDisciplines();
    const discipline = disciplines.find(d => d.id === disciplineId);
    if (!discipline) return;

    const updatedDiscipline = {
      ...discipline,
      units: discipline.units.filter(u => u.id !== unitId),
    };

    localRepository.updateDiscipline(updatedDiscipline);

    setDisciplines(
      disciplines.map(d =>
        d.id === disciplineId ? updatedDiscipline : d
      )
    );

    localLogRepository.addLog(
      "Unidade excluída",
      `Unidade ${unitId}`
    );
  } catch {
    setError("Erro ao excluir unidade");
  } finally {
    setLoading(false);
  }
};


  return {
    disciplines,
    loading,
    error,
    addDiscipline,
    deleteUnit, // 🔹 Retorna a nova função
    reload: loadDisciplines, // 👈 ajuda a refletir alterações
  };
}
