import { LogEntry } from "../../types/logs";

const LOG_KEY = "system_logs";

export const localLogRepository = {
  getLogs(): LogEntry[] {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];

    return JSON.parse(raw).map((log: any) => ({
      ...log,
      createdAt: new Date(log.createdAt),
    }));
  },

  addLog(action: string, description?: string) {
    const logs = this.getLogs();

    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      action,
      description,
      createdAt: new Date(),
    };

    localStorage.setItem(
      LOG_KEY,
      JSON.stringify([newLog, ...logs])
    );
  },

  clear() {
    localStorage.removeItem(LOG_KEY);
  },
};
