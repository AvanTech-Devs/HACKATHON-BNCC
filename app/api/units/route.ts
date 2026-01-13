import { NextResponse } from 'next/server';

export async function GET() {
    // Exemplo de resposta para listar unidades
    const units = [
        { id: 1, name: 'Matemática Básica', disciplineId: 1 },
        { id: 2, name: 'Geometria', disciplineId: 1 },
    ];
    return NextResponse.json(units);
}

export async function POST(request: Request) {
    const body = await request.json();
    // Lógica para criar uma nova unidade
    const newUnit = { id: Date.now(), ...body };
    return NextResponse.json(newUnit, { status: 201 });
}
