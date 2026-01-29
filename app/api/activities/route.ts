import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "@/app/api/chat/engine/chat";

export async function POST(request: NextRequest) {
  try {
    const { title, unitId, description } = await request.json();

    if (!title || !unitId) {
      return NextResponse.json(
        { error: "title e unitId são obrigatórios." },
        { status: 400 }
      );
    }

    const chatEngine = await createChatEngine();

    let finalDescription = description;

    // 🔹 Se não vier descrição, gera com IA
    if (!finalDescription) {
      const userPrompt = `
Crie uma descrição pedagógica para a atividade abaixo:

Título da atividade: ${title}

A descrição deve ser clara, objetiva, alinhada às diretrizes educacionais brasileiras
e adequada para estudantes do ensino básico.
`;

      const response = await chatEngine.chat({
        message: userPrompt,
      });

      finalDescription =
        response.message?.content ?? "Descrição não disponível.";
    }

    const newActivity = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      unitId,
      description: finalDescription,
      createdAt: new Date(),
    };

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("[ACTIVITY API]", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
