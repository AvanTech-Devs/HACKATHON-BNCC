import { Settings } from "llamaindex";
import { extractUnits } from "./extractUnits";
import { UNIT_SUGGESTION_PROMPT_TEMPLATE } from "./unitSuggestionPrompt";
import { N_UNITS_TO_GENERATE } from "./constants";

export async function generateUnitSuggestions(
  type: "theme" | "context",
  discipline: string,
  grade: string,
  bnccGuidelines: string,
  numberOfUnits: number = N_UNITS_TO_GENERATE
): Promise<string[]> {
  const llm = Settings.llm;

  const prompt =
    type === "theme"
      ? UNIT_SUGGESTION_PROMPT_TEMPLATE
          .replace("$discipline", discipline)
          .replace("$grade", grade)
          .replace("$bncc_guidelines", bnccGuidelines)
          .replace("$number_of_units", numberOfUnits.toString())
      : `
Generate a pedagogical context paragraph.

Discipline: ${discipline}
Grade/Year: ${grade}
BNCC: ${bnccGuidelines}
`;

  try {
    const response = await llm.complete({ prompt });

    if (type === "theme") {
      return extractUnits(response.text);
    }

    return [response.text.trim()];
  } catch (error) {
    console.error("Error when generating unit suggestions:", error);
    return [];
  }
}
