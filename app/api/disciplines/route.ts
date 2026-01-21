import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "@/app/api/chat/engine/chat";

export async function POST(request: NextRequest) {
    try {
        const { name, grade } = await request.json();

        if (!name || !grade) {
            return NextResponse.json(
                { error: "name e grade são obrigatórios." },
                { status: 400 }
            );
        }

        const chatEngine = await createChatEngine();

        const userPrompt = `
Crie uma descrição detalhada para a disciplina abaixo:

Nome da disciplina: ${name}
Série/Ano: ${grade}

A descrição deve ser formal, pedagógica e alinhada às diretrizes educacionais brasileiras.
`;

        const response = await chatEngine.chat({
            message: userPrompt,
        });

        const description = response.message?.content ?? "Descrição não disponível";

        // Simula a criação da disciplina no banco de dados
        const newDiscipline = {
            id: Math.random().toString(36).substring(2, 15), // ID gerado aleatoriamente
            name,
            grade,
            description,
            createdAt: new Date(),
        };

        return NextResponse.json(newDiscipline, { status: 201 });
    } catch (error) {
        console.error("[Discipline API]", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
