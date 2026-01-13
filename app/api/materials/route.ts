import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    // Lógica para gerar materiais didáticos
    const material = {
        id: Date.now(),
        type: body.type,
        content: `Material gerado para ${body.type}`,
    };
    return NextResponse.json(material, { status: 201 });
}
