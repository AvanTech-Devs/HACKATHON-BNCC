export type ParsedSlide =
  | { type: "cover"; title: string }
  | { type: "content"; text: string };

function isTopicCover(block: string) {
  return block.trim().startsWith("### ");
}

function extractTopicTitle(block: string) {
  return block
    .replace(/^###\s*/g, "")
    .replace(/:$/, "")
    .trim();
}

export function parseSlides(content: string): ParsedSlide[] {
  if (!content) return [];

  const blocks = content
    .split("\n\n")
    .map(b => b.trim())
    .filter(Boolean);

  return blocks.map(block => {
    if (isTopicCover(block)) {
      return {
        type: "cover",
        title: extractTopicTitle(block),
      };
    }

    return {
      type: "content",
      text: block, // markdown intacto (** * ***)
    };
  });
}
