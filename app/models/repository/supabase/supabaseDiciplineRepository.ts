import { Discipline } from "@/app/models/types/discipline";
import { Unit } from "@/app/models/types/unit";
import { db } from "@/app/lib/supabaseSchema";

export const supabaseDisciplineRepository = {
  /* =========================
     CREATE
  ========================= */
  async saveDiscipline(discipline: Discipline) {
    const { error } = await db.from("disciplines").insert({
      id: discipline.id,
      name: discipline.name,
      grade: discipline.grade,
      created_at: discipline.createdAt,
    });

    if (error) throw error;
  },

  /* =========================
     ADD UNIT
  ========================= */
  async addUnitToDiscipline(disciplineId: string, unit: Unit) {
    const { error } = await db.from("units").insert({
      id: unit.id,
      discipline_id: disciplineId,
      theme: unit.theme,
      context: unit.context,
      lesson_plan: unit.lessonPlan,
      activity: unit.activity,
      created_at: unit.createdAt,
    });

    if (error) throw error;
  },

  /* =========================
     UPDATE
  ========================= */
  async updateDiscipline(updated: Discipline) {
    const { error } = await db
      .from("disciplines")
      .update({
        name: updated.name,
        grade: updated.grade,
      })
      .eq("id", updated.id);

    if (error) throw error;
  },

  /* =========================
     READ (ALL + UNITS)
  ========================= */
  async getDisciplines(): Promise<Discipline[]> {
    const { data, error } = await db
      .from("disciplines")
      .select(`
        id,
        name,
        grade,
        created_at,
        units (
          id,
          theme,
          context,
          lesson_plan,
          activity,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((discipline: any) => ({
      id: discipline.id,
      name: discipline.name,
      grade: discipline.grade,
      createdAt: new Date(discipline.created_at),
      units: (discipline.units ?? []).map((unit: any) => ({
        id: unit.id,
        theme: unit.theme,
        context: unit.context,
        lessonPlan: unit.lesson_plan,
        activity: unit.activity,
        createdAt: new Date(unit.created_at),
      })),
    }));
  },

  /* =========================
     DELETE
  ========================= */
  async deleteDisciplineById(disciplineId: string) {
    // 🔥 Apaga unidades primeiro (FK safety)
    await db.from("units")
      .delete()
      .eq("discipline_id", disciplineId);

    const { error } = await db.from("disciplines")
      .delete()
      .eq("id", disciplineId);

    if (error) throw error;
  },

  /* =========================
     CLEAR (DEV / TEST)
  ========================= */
  async clearDisciplines() {
    await db.from("units").delete().neq("id", "");
    await db.from("disciplines").delete().neq("id", "");
  },
};
