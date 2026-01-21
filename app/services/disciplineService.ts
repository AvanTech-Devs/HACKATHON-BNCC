import { Discipline } from "@/app/models/types/discipline";

export async function createDiscipline(name: string, grade: string): Promise<Discipline> {
    const response = await fetch("/api/disciplines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, grade }),
    });

    if (!response.ok) {
        throw new Error("Erro ao criar a disciplina");
    }

    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        grade: data.grade,
        description: data.description,
        createdAt: new Date(data.createdAt),
    };
}
