
import { localMaterialRepository } from '@/app/models/repository/localMaterialRepository';
import { Material } from '@/app/models/types/material';

export class UserMaterialViewModel {
    getAllMaterials(): Material[] {
        return localMaterialRepository.getAll();
    }

    getMaterialById(id: string): Material | undefined {
        return localMaterialRepository.getById(id);
    }

    createMaterial(material: Material): Material {
        localMaterialRepository.create(material);
        return material;
    }


    updateMaterial(id: string, updated: Partial<Material>): Material | undefined {
        const material = localMaterialRepository.getById(id);
        if (!material) {
            return undefined;
        }
        // Faz o merge dos dados existentes com os novos, garantindo que o id nunca seja undefined
        const merged: Material = { ...material, ...updated, id };
        return localMaterialRepository.update(id, merged);
    }


    deleteMaterial(id: string): boolean {
        const material = localMaterialRepository.getById(id);
        if (material) {
            localMaterialRepository.delete(id);
            return true;
        }
        return false;
    }
}
