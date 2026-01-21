"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DashboardDisciplineListProps {
  disciplines: string[];
  onCreateDiscipline: () => void;
}

const DashboardDisciplineList: React.FC<DashboardDisciplineListProps> = ({
  disciplines,
  onCreateDiscipline,
}) => {
  const router = useRouter();

  const handleDisciplineClick = (discipline: string) => {
    if (discipline === "Matemática") {
      router.push("/disciplines");
    } else {
      alert(`A página para a disciplina "${discipline}" ainda não está disponível.`);
    }
  };

  return (
    <div className="dashboard-discipline-list">
      {disciplines.map((discipline, index) => (
        <button
          key={index}
          className="dashboard-button"
          onClick={() => handleDisciplineClick(discipline)}
        >
          {discipline}
        </button>
      ))}
      <button className="dashboard-button primary" onClick={onCreateDiscipline}>
        + Criar Disciplina
      </button>
    </div>
  );
};

export default DashboardDisciplineList;
