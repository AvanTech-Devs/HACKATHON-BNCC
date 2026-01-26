export interface LogEntry {
  id: string;
  action: string;
  description?: string;
  createdAt: Date;
}
