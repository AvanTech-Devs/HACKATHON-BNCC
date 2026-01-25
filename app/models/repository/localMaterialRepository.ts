// Substitua o uso de localStorage por um array em memória
import { Material } from "../types/material";

let materials: Material[] = [];

export const localMaterialRepository = {
  getAll(): Material[] {
    return materials;
  },


  create(material: Material): Material {
    materials.push(material);
    return material;
  },


  getById(id: string): Material | undefined {
    return materials.find((m) => m.id === id);
  },


  update(id: string, updatedMaterial: Material): Material | undefined {
    const index = materials.findIndex((m) => m.id === id);
    if (index !== -1) {
      materials[index] = updatedMaterial;
      return updatedMaterial;
    }
    return undefined;
  },

  delete(id: string): boolean {
    const index = materials.findIndex((m) => m.id === id);
    if (index !== -1) {
      materials.splice(index, 1);
      return true;
    }
    return false;
  },
};