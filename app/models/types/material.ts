export type MaterialType =
  | "SLIDES"
  | "PDF"
  | "PROVA"
  | "ATIVIDADE"
  | "RESUMO";

export interface Material {
  id: string;
  unitId: string;
  title: string;
  type: MaterialType;
  content: string;      // texto gerado pela IA (base)
  createdAt: Date;
}
