import { LogEntry } from "@/app/models/types/logs";
import { db } from "@/app/lib/supabaseSchema";


export const supabaseLogRepository = {
  async getLogs(): Promise<LogEntry[]> {
    const { data, error } = await db
      .from("system_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar logs:", error);
      return [];
    }

    return data.map((log) => ({
      id: log.id,
      action: log.action,
      description: log.description ?? undefined,
      createdAt: new Date(log.created_at),
    }));
  },

  async addLog(action: string, description?: string): Promise<void> {
    const { error } = await db.from("system_logs").insert([
      {
        id: crypto.randomUUID(),
        action,
        description,
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.error("Erro ao salvar log:", error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    const { error } = await db
      .from("system_logs")
      .delete()
      .neq("id", "");

    if (error) {
      console.error("Erro ao limpar logs:", error);
      throw error;
    }
  },
};
