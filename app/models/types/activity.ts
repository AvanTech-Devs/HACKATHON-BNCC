export interface Activity {
  id: string;
  title: string;
  unitId: string;   // 🔹 obrigatório (atividade sempre pertence a uma unidade)
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}
