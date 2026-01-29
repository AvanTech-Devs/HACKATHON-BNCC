import { Unit } from "@/app/models/types/unit";
import { db } from "@/app/lib/supabaseSchema";

export const supabaseUnitRepository = {
  async getUnits(): Promise<Unit[]> {
    const { data, error } = await db
      .from("units")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar units:", error);
      return [];
    }

    return data.map((unit) => ({
      id: unit.id,
      theme: unit.theme,
      context: unit.context,
      lessonPlan: unit.lesson_plan,
      activity: unit.activity,
      createdAt: new Date(unit.created_at),
    }));
  },

  async saveUnit(unit: Unit): Promise<void> {
    const { error } = await db.from("units").insert([
      {
        id: unit.id,
        theme: unit.theme,
        context: unit.context,
        lesson_plan: unit.lessonPlan,
        activity: unit.activity,
        created_at: unit.createdAt,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar unit:", error);
      throw error;
    }
  },

  async getUnitById(unitId: string): Promise<Unit | null> {
    const { data, error } = await db
      .from("units")
      .select("*")
      .eq("id", unitId)
      .single();

    if (error || !data) {
      console.error("Erro ao buscar unit:", error);
      return null;
    }

    return {
      id: data.id,
      theme: data.theme,
      context: data.context,
      lessonPlan: data.lesson_plan,
      activity: data.activity,
      createdAt: new Date(data.created_at),
    };
  },

  async deleteUnitById(unitId: string): Promise<void> {
    const { error } = await db
      .from("units")
      .delete()
      .eq("id", unitId);

    if (error) {
      console.error("Erro ao deletar unit:", error);
      throw error;
    }
  },
};
