import { Discipline } from "@/app/models/types/discipline";
import { Unit } from "@/app/models/types/unit";

const LOCAL_STORAGE_KEY = "disciplines";

export const localRepository = {
  // Salva uma disciplina no armazenamento local
  saveDiscipline: (discipline: Discipline) => {
    const existingDisciplines = localRepository.getDisciplines();
    existingDisciplines.push(discipline);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingDisciplines));
  },
  addUnitToDiscipline: (disciplineId: string, unit: Unit) => {
  const disciplines = localRepository.getDisciplines();

  const updated = disciplines.map((discipline) => {
    if (discipline.id === disciplineId) {
      return {
        ...discipline,
        units: [...(discipline.units || []), unit],
      };
    }
    return discipline;
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
},


 getDisciplines: (): Discipline[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];

  const parsedData: Discipline[] = JSON.parse(data);

  return parsedData.map((discipline) => ({
    ...discipline,
    createdAt: new Date(discipline.createdAt),
    units: discipline.units ?? [], // ✅ GARANTE SEMPRE UM ARRAY
  }));
},


  // Limpa todas as disciplinas do armazenamento local
  clearDisciplines: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
};
