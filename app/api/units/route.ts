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

    // 📘 Prompt do plano de aula com foco em Cultura Digital e BNCC
    const lessonPlanPrompt = `
Gere um **PLANO DE AULA completo**, alinhado à **BNCC** e às diretrizes do MEC, com foco em **Cultura Digital** e competências digitais do século XXI.

Informações da aula:
- Tema: ${theme}
- Contexto: ${context}

O plano deve conter os seguintes itens, de forma clara e objetiva, pronto para exibição em **PDF ou slides**:

1. **Identificação da aula**: série, disciplina, turma, data
2. **Objetivo geral**
3. **Objetivos específicos**
4. **Competências e habilidades da BNCC**: 
- Sempre liste primeiro as competências específicas da disciplina, usando códigos oficiais da BNCC (ex: EF03MA16) com uma descrição curta.
   - Depois liste as Competências Gerais da BNCC (ex: Competência Geral 5, 6, etc) com descrição curta.
5. **Conteúdos abordados**: inclua conteúdos digitais, tecnológicos e tradicionais
6. **Metodologia**: detalhar atividades digitais, híbridas ou presenciais, incentivando criatividade, colaboração e pensamento crítico
7. **Sequência de atividades sugeridas**:
   - **Abertura**: contextualização e motivação
   - **Desenvolvimento**: atividades principais, com exemplos de ferramentas digitais, jogos educativos, plataformas ou softwares
   - **Fechamento**: síntese, reflexão e registro de aprendizagem
   Cada item deve ser **bem detalhado**, mas **não gerar a atividade completa**
8. **Recursos didáticos**: livros, vídeos, softwares, plataformas digitais, jogos educativos
9. **Avaliação**: formativa e somativa, incluindo sugestões de atividades digitais e colaborativas
10. **Referências**: BNCC, MEC, materiais digitais e recursos online confiáveis
Não inclua placeholders de citação ou links automáticos. Se precisar referenciar algo, inclua apenas referências textuais reais (BNCC, MEC ou materiais digitais).
Use linguagem pedagógica formal, clara e objetiva, adequada ao ensino brasileiro.  
O conteúdo deve ser **direto, pronto para exibir em PDF ou slides**.`;

    // Prompt atualizado: gerar apenas **exemplos de atividades**
    const activityPrompt = `
Forneça **exemplos de atividades sugeridas**, alinhadas ao tema e à BNCC, com foco em **Cultura Digital**.  
Cada exemplo deve incluir:
- Tipo de atividade (individual, em dupla ou em grupo)
- Ferramentas digitais ou recursos utilizados
- Objetivo pedagógico da atividade
Não inclua placeholders de citação ou links automáticos. Se precisar referenciar algo, inclua apenas referências textuais reais (BNCC, MEC ou materiais digitais).
Use linguagem pedagógica formal, clara e objetiva, adequada ao ensino brasileiro.  
O conteúdo deve ser **direto, pronto para exibir em PDF ou slides**.
⚠️ Importante: apenas forneça **exemplos**, **não gere a atividade completa**, nem instruções detalhadas passo a passo.
]
`;

    // 🤖 Chamadas ao Chat Engine
    const lessonPlanResponse = await chatEngine.chat({
      message: lessonPlanPrompt,
    });

    const activityResponse = await chatEngine.chat({
      message: activityPrompt,
    });

    // ✅ Resposta final
    return NextResponse.json({
      id: Date.now().toString(),
      disciplineId,
      lessonPlan:
        lessonPlanResponse.message?.content ?? "Erro ao gerar o plano de aula",
      activity:
        activityResponse.message?.content ?? "Erro ao gerar os exemplos de atividades",
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
