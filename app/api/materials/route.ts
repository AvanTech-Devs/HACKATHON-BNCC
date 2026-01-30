import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "@/app/api/chat/engine/chat";

export async function POST(request: NextRequest) {
  try {
    const { unitTitle, unitContext, lessonPlan, activity, materialType } =
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
Plano de aula: ${lessonPlan ?? "Não informado"}
Atividade: ${activity ?? "Não informado"}

Se o tipo for SLIDES:
- Produza um material didático visual organizado em tópicos, baseado no conteúdo da aula
- Inclua explicações curtas e claras para cada tópico
- Mostre elementos visuais que ajudem os alunos a compreender o conteúdo (imagens, gráficos, fluxogramas, tabelas, ícones)
- Inclua sugestões de recursos digitais e tradicionais que possam ser utilizados na aula
- Use linguagem pedagógica formal e objetiva
- Ideal para apresentação em sala de aula e apoio direto aos alunos


Se o tipo for PDF ou RESUMO:
- Produza conteúdo detalhado e completo
- Organize em seções claras
- Inclua explicações, exemplos práticos e referências
- Pronto para estudo ou impressão

ATIVIDADE ou PROVA  prática alinhada ao plano de aula

- Produza uma única atividade ou prova, não várias
-Inclua instruções detalhadas e critérios de avaliação
-Alinhe explicitamente ao tema, contexto e objetivos de aprendizagem do plano de aula
-Incentive colaboração, habilidades digitais e raciocínio crítico, se aplicável
-Explique brevemente por que esta atividade está alinhada ao plano de aula

Além disso, extraia e inclua de forma clara no material:
1. Objetivos de aprendizagem
2. Competências BNCC (com códigos, se possível)
3. Recursos didáticos sugeridos

Não inclua placeholders de citação ou links automáticos. Se precisar referenciar algo, inclua apenas referências textuais reais (BNCC, MEC ou materiais digitais).

Mantenha **linguagem pedagógica formal e clara** e adapte a forma de apresentação ao tipo de material.
`;


    const response = await chatEngine.chat({ message: prompt });
    const content = response.message?.content ?? "Conteúdo não disponível";

    return NextResponse.json({ content, createdAt: new Date() }, { status: 201 });
  } catch (error) {
    console.error("[MATERIAL API]", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
