export const UNIT_SUGGESTION_PROMPT_TEMPLATE = `
Você é um assistente pedagógico especialista em BNCC e cultura digital.

Disciplina: $discipline
Ano/Série: $grade
Diretrizes BNCC: $bncc_guidelines

Sugira $number_of_units temas de unidades de ensino que:

- Estejam alinhados à BNCC (mencionar habilidades/códigos quando possível)
- Promovam o uso de ferramentas digitais e a cultura digital
- Sejam criativos, contextualizados e aplicáveis em sala de aula híbrida ou digital

Formato:
- Cada tema deve vir entre < > e em uma linha separada
- Evite explicações adicionais, apenas o título da unidade
Não inclua placeholders de citação ou links automáticos. Se precisar referenciar algo, inclua apenas referências textuais reais (BNCC, MEC ou materiais digitais).
`;
