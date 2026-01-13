"use client";

import { useState, useEffect } from "react";

interface UserDashboardData {
    userName: string;
    credits: number;
    generationHistory: Array<{ type: string; date: string; time: string }>;
    disciplines: string[];
}

export const useUserDashboardViewModel = () => {
    const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);

    useEffect(() => {
        // Simulação de carregamento de dados (pode ser substituído por uma chamada à API)
        const fetchDashboardData = async () => {
            const data: UserDashboardData = {
                userName: "Prof. João",
                credits: 260,
                generationHistory: [
                    { type: "Plano de aula", date: "15/04", time: "10:35" },
                    { type: "Atividade", date: "14/04", time: "15:20" },
                    { type: "Slides de apoio", date: "14/04", time: "09:10" },
                    { type: "Plano de aula", date: "13/04", time: "11:45" },
                ],
                disciplines: ["Matemática", "História", "Português"],
            };
            setDashboardData(data);
        };

        fetchDashboardData();
    }, []);

    return { dashboardData };
};
