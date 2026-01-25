import { Discipline } from "./discipline";
import { LogEntry } from "./logs";


export interface UserDashboardData {
  userName: string;
  credits: number;
  disciplines: Discipline[];
  logs: LogEntry[];
}