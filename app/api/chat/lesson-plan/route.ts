import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "@/app/api/chat/engine/chat";

export async function POST(request: NextRequest) {
  try {
    const { theme, grade, competencies } = await request.json();

    if (!theme || !grade || !competencies) {
      return NextResponse.json(
        { error: "theme, grade e competencies são obrigatórios." },
        { status: 400 }
      );
    }

    const chatEngine = await createChatEngine();

    const userPrompt = `
Gere um PLANO DE AULA alinhado à BNCC e às diretrizes do MEC.

Tema da aula: ${theme}
Série/Ano: ${grade}
Competências da BNCC: ${competencies.join(", ")}

O plano deve conter obrigatoriamente:
1. Identificação da aula
2. Objetivo geral
3. Objetivos específicos
4. Competências e habilidades da BNCC
5. Conteúdos abordados
6. Metodologia
7. Atividades (início, desenvolvimento e fechamento)
8. Recursos didáticos
9. Avaliação
10. Referências (BNCC/MEC)

Use linguagem pedagógica formal e adequada ao ensino brasileiro.
`;

    const response = await chatEngine.chat({
      message: userPrompt,
    });

    return NextResponse.json({
      lessonPlan: response.message?.content ?? "Erro ao gerar o plano de aula",
    });

  } catch (error) {
    console.error("[Lesson Plan API]", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
