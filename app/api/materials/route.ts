import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "@/app/api/chat/engine/chat";

export async function POST(request: NextRequest) {
  try {
    const { unitTitle, unitContext, materialType } =
      await request.json();

    if (!unitTitle || !materialType) {
      return NextResponse.json(
        { error: "unitTitle e materialType são obrigatórios" },
        { status: 400 }
      );
    }

    const chatEngine = await createChatEngine();

    const prompt = `
Crie um material educacional do tipo ${materialType} com base na aula abaixo:

Tema da aula: ${unitTitle}
Contexto da aula: ${unitContext ?? "Não informado"}

O material deve:
- Ser pedagógico
- Ter linguagem clara
- Estar adequado ao ensino básico
- Ser organizado em tópicos
`;

    const response = await chatEngine.chat({
      message: prompt,
    });

    const content =
      response.message?.content ?? "Conteúdo não disponível";

    return NextResponse.json(
      {
        content,
        createdAt: new Date(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[MATERIAL API]", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
