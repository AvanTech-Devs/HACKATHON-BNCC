import { Unit } from "@/app/models/types/unit";

const STORAGE_KEY = "units";

export const localUnitRepository = {
  getUnits(): Unit[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    return JSON.parse(data).map((unit: Unit) => ({
      ...unit,
      createdAt: new Date(unit.createdAt),
    }));
  },

  saveUnit(unit: Unit) {
    const units = this.getUnits();
    units.push(unit);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
  },

  getUnitById(unitId: string): Unit | undefined {
    return this.getUnits().find((u) => u.id === unitId);
  },
   // 🔹 NOVA FUNÇÃO: Excluir unidade por ID
  deleteUnitById(unitId: string) {
    const units = this.getUnits();
    const updatedUnits = units.filter((unit) => unit.id !== unitId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUnits));
  },
};
