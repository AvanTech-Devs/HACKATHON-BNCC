import { Unit } from "./unit";

export interface Discipline {
  id: string;
  name: string;
  grade: string;
  createdAt: Date;
  units: Unit[]; // 👈 AGORA TEM AULAS
}
