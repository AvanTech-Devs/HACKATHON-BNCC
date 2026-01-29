import React from "react";

export function parseRichText(text: string) {
  const regex = /(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*)/g;
  const parts: React.ReactNode[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const value = match[0];

    if (value.startsWith("***")) {
      parts.push(
        <strong key={match.index}>
          <em>{value.slice(3, -3)}</em>
        </strong>
      );
    } else if (value.startsWith("**")) {
      parts.push(
        <strong key={match.index}>{value.slice(2, -2)}</strong>
      );
    } else {
      parts.push(
        <em key={match.index}>{value.slice(1, -1)}</em>
      );
    }

    lastIndex = match.index + value.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
