import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Retorna todas as disciplinas
        res.status(200).json({ message: 'Lista de disciplinas' });
    } else if (req.method === 'POST') {
        // Cria uma nova disciplina
        const { name, grade } = req.body;
        res.status(201).json({ message: `Disciplina ${name} criada para a série ${grade}` });
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
