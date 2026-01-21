import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "@/app/api/chat/engine/chat";

export async function POST(request: NextRequest) {
  try {
    const { theme, context, disciplineId } = await request.json();

    // 🔒 Validação
    if (!theme || !context || !disciplineId) {
      return NextResponse.json(
        { error: "theme, context e disciplineId são obrigatórios." },
        { status: 400 }
      );
    }

    const chatEngine = await createChatEngine();

    // 📘 Prompt do plano de aula
    const lessonPlanPrompt = `
Gere um PLANO DE AULA alinhado à BNCC e às diretrizes do MEC.

Tema da aula: ${theme}
Contexto: ${context}

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

    // 📝 Prompt da atividade
    const activityPrompt = `
Gere uma ATIVIDADE ou TAREFA AVALIATIVA alinhada ao tema "${theme}" 
e ao contexto "${context}".

A atividade deve ser prática, criativa e alinhada às diretrizes pedagógicas brasileiras.
`;

    const lessonPlanResponse = await chatEngine.chat({
      message: lessonPlanPrompt,
    });

    const activityResponse = await chatEngine.chat({
      message: activityPrompt,
    });

    // ✅ Resposta final
    return NextResponse.json({
      id: Date.now().toString(),
      disciplineId, // 🔥 vínculo com a disciplina
      lessonPlan:
        lessonPlanResponse.message?.content ??
        "Erro ao gerar o plano de aula",
      activity:
        activityResponse.message?.content ??
        "Erro ao gerar a atividade",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Units API]", error);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
