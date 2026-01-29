import { Material } from "@/app/models/types/material";
import { db } from "@/app/lib/supabaseSchema";
export const supabaseMaterialRepository = {
  async getMaterials(): Promise<Material[]> {
    const { data, error } = await db
      .from("materials")
      .select("*");

    if (error) throw error;

    return data.map((m: any) => ({
      id: m.id,
      unitId: m.unit_id,
      title: m.title,
      type: m.type,
      content: m.content,
      createdAt: new Date(m.created_at),
    }));
  },

  async getMaterialById(id: string): Promise<Material | null> {
    const { data, error } = await db
      .from("materials")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      unitId: data.unit_id,
      title: data.title,
      type: data.type,
      content: data.content,
      createdAt: new Date(data.created_at),
    };
  },

  async getMaterialsByUnitId(unitId: string): Promise<Material[]> {
    const { data, error } = await db
      .from("materials")
      .select("*")
      .eq("unit_id", unitId);

    if (error) throw error;

    return data.map((m: any) => ({
      id: m.id,
      unitId: m.unit_id,
      title: m.title,
      type: m.type,
      content: m.content,
      createdAt: new Date(m.created_at),
    }));
  },

  async saveMaterial(material: Material) {
    const { error } = await db.from("materials").insert({
      id: material.id,
      unit_id: material.unitId,
      title: material.title,
      type: material.type,
      content: material.content,
      created_at: material.createdAt ?? new Date(),
    });

    if (error) throw error;
  },

  async updateMaterial(material: Material) {
    const { error } = await db
      .from("materials")
      .update({
        title: material.title,
        type: material.type,
        content: material.content,
      })
      .eq("id", material.id);

    if (error) throw error;
  },

  async deleteMaterialById(id: string) {
    const { error } = await db
      .from("materials")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

