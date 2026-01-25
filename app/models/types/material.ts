
export interface Material {
    id: string;
    title: string;
    description?: string;
    type: 'pdf' | 'video' | 'slide' | 'link' | 'image' | 'other';
    createdAt: Date;
    updatedAt?: Date;
    disciplineId?: string;
}
