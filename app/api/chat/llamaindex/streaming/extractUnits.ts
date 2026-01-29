// extractUnits.ts
export function extractUnits(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .replace(/<|>/g, "")
        .replace(/Unit\s*\d+/gi, "")
        .trim()
    )
    .filter(Boolean);
}
