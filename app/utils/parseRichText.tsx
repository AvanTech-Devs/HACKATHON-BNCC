import React from "react";

export function parseRichText(text: string) {
  const parts: React.ReactNode[] = [];

  // Divide por linhas
  const lines = text.split("\n");

  lines.forEach((line, i) => {
    let processedLine: React.ReactNode = line;

    // Títulos: #### > ### > ## > #
    if (line.startsWith("#### ")) {
      processedLine = <h4 key={i}>{line.slice(5)}</h4>;
    } else if (line.startsWith("### ")) {
      processedLine = <h3 key={i}>{line.slice(4)}</h3>;
    } else if (line.startsWith("## ")) {
      processedLine = <h2 key={i}>{line.slice(3)}</h2>;
    } else if (line.startsWith("# ")) {
      processedLine = <h1 key={i}>{line.slice(2)}</h1>;
    } else {
      // Negrito/itálico
      const regex = /(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*)/g;
      const innerParts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          innerParts.push(line.slice(lastIndex, match.index));
        }

        const value = match[0];

        if (value.startsWith("***")) {
          innerParts.push(
            <strong key={match.index}>
              <em>{value.slice(3, -3)}</em>
            </strong>
          );
        } else if (value.startsWith("**")) {
          innerParts.push(<strong key={match.index}>{value.slice(2, -2)}</strong>);
        } else {
          innerParts.push(<em key={match.index}>{value.slice(1, -1)}</em>);
        }

        lastIndex = match.index + value.length;
      }

      if (lastIndex < line.length) {
        innerParts.push(line.slice(lastIndex));
      }

      processedLine = <p key={i}>{innerParts}</p>;
    }

    parts.push(processedLine);
  });

  return parts;
}
