// unitSuggestionPrompt.ts
export const UNIT_SUGGESTION_PROMPT_TEMPLATE = `
You're a helpful assistant! Your task is to suggest teaching units for a discipline.

Discipline: $discipline
Grade/Year: $grade
BNCC Guidelines: $bncc_guidelines

Suggest $number_of_units teaching unit themes.
Each unit must be wrapped with < > and placed on a new line.
`;
