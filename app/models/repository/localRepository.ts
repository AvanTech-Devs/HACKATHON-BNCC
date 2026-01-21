import { Discipline } from "@/app/models/types/discipline";

const LOCAL_STORAGE_KEY = "disciplines";

export const localRepository = {
  // Salva uma disciplina no armazenamento local
  saveDiscipline: (discipline: Discipline) => {
    const existingDisciplines = localRepository.getDisciplines();
    existingDisciplines.push(discipline);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingDisciplines));
  },

  // Retorna todas as disciplinas armazenadas localmente
  getDisciplines: (): Discipline[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    const parsedData: Discipline[] = JSON.parse(data);

    // Converte o campo createdAt para Date
    return parsedData.map((discipline) => ({
      ...discipline,
      createdAt: new Date(discipline.createdAt),
    }));
  },

  // Limpa todas as disciplinas do armazenamento local
  clearDisciplines: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
};
