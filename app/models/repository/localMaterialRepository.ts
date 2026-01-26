import { Material } from "../types/material";

const STORAGE_KEY = "materials";

export const localMaterialRepository = {
  /* =========================
     GET ALL
  ========================= */
  getMaterials(): Material[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    return JSON.parse(data).map((material: Material) => ({
      ...material,
      createdAt: new Date(material.createdAt),
    }));
  },

  /* =========================
     SAVE
  ========================= */
  saveMaterial(material: Material) {
    const materials = this.getMaterials();
    materials.push(material);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(materials)
    );
  },

  /* =========================
     GET BY ID
  ========================= */
  getMaterialById(materialId: string): Material | undefined {
    return this.getMaterials().find(
      (m) => m.id === materialId
    );
  },

  /* =========================
     GET BY UNIT
  ========================= */
  getMaterialsByUnitId(unitId: string): Material[] {
    return this.getMaterials().filter(
      (m) => m.unitId === unitId
    );
  },

  /* =========================
     DELETE
  ========================= */
  deleteMaterialById(materialId: string) {
    const materials = this.getMaterials();
    const updated = materials.filter(
      (material) => material.id !== materialId
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  },
};
