// app/api/unit-suggestions/route.ts
import { NextResponse } from "next/server";
import { generateUnitSuggestions } from "@/app/api/chat/llamaindex/streaming/unitSuggestion";

export async function POST(req: Request) {
  const { type, discipline, grade, bnccGuidelines } = await req.json();

  try {
    const suggestions = await generateUnitSuggestions(
      type,
      discipline,
      grade,
      bnccGuidelines
    );

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar sugestões" },
      { status: 500 }
    );
  }
}
