// ... existing code ...
import { NextRequest, NextResponse } from 'next/server';
import { Material } from '@/app/models/types/material';
import { localMaterialRepository } from '@/app/models/repository/localMaterialRepository';

// GET: Lista todos os materiais
export function GET(request: NextRequest) {
    const materials = localMaterialRepository.getAll();
    return NextResponse.json(materials);
}

// POST: Cria um novo material
export async function POST(request: NextRequest) {
    const body = await request.json();
    const newMaterial: Material = body;
    localMaterialRepository.create(newMaterial);
    return NextResponse.json(newMaterial, { status: 201 });
}

// PUT: Atualiza um material existente (espera id e campos atualizados no body)
export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { id, ...updatedFields } = body;
    if (!id) {
        return NextResponse.json({ error: 'ID é necessário' }, { status: 400 });
    }
    localMaterialRepository.update(id, updatedFields);
    const updatedMaterial = localMaterialRepository.getById(id);
    if (!updatedMaterial) {
        return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 });
    }
    return NextResponse.json(updatedMaterial);
}

// DELETE: Remove um material (espera id no body)
export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const { id } = body;
    if (!id) {
        return NextResponse.json({ error: 'ID é necessário' }, { status: 400 });
    }
    const material = localMaterialRepository.getById(id);
    if (!material) {
        return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 });
    }
    localMaterialRepository.delete(id);
    return NextResponse.json({ message: 'Material deletado' });
}
