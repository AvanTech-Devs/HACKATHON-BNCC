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
 // 📘 Prompt final para gerar plano de aula limpo e pronto para PDF
const lessonPlanPrompt = `
Gere um PLANO DE AULA completo, alinhado à BNCC e às diretrizes do MEC, com foco em CULTURA DIGITAL.

Tema da aula: ${theme}
Contexto: ${context}

O plano deve conter, de forma clara e direta, os seguintes itens:

1. Identificação da aula (série, disciplina, turma, data)
2. Objetivo geral
3. Objetivos específicos
4. Competências e habilidades da BNCC (com códigos e descrições)
5. Conteúdos abordados (incluindo recursos digitais)
6. Metodologia (detalhando atividades digitais, híbridas ou presenciais)
7. Sequência de atividades:
   - Abertura
   - Desenvolvimento
   - Fechamento
8. Recursos didáticos (livros, vídeos, softwares, plataformas digitais, jogos educativos)
9. Avaliação (formativa e somativa, incluindo atividades digitais)
10. Referências (BNCC, MEC, materiais digitais)
Use linguagem pedagógica formal, clara e objetiva, adequada ao ensino brasileiro.
Inclua exemplos de atividades práticas digitais, incentivando criatividade, colaboração e pensamento crítico.
Não inclua mensagens de introdução ou explicações extras. O conteúdo deve ser **direto, pronto para exibir em PDF ou slides**, mantendo linguagem pedagógica formal.
`;

const activityPrompt = `
Gere uma ATIVIDADE ou TAREFA AVALIATIVA prática e digital, alinhada ao tema "${theme}", contexto "${context}" e ao objetivo principal de CULTURA DIGITAL.

A atividade deve:
- Ser realizável com recursos digitais
- Incentivar colaboração entre alunos
- Desenvolver habilidades cognitivas e digitais
- Incluir instruções claras e critérios de avaliação
- Estar alinhada à BNCC

Produza apenas o conteúdo da atividade, **sem explicações adicionais**.
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
