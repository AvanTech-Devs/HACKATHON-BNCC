export interface Discipline {
    id: string;
    name: string;
    grade: string;
    description?: string; // Descrição gerada pelo RAG
    createdAt: Date;
}