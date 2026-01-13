import React from "react";

interface DashboardDisciplineListProps {
  disciplines: string[];
  onCreateDiscipline: () => void;
}

const DashboardDisciplineList: React.FC<DashboardDisciplineListProps> = ({
  disciplines,
  onCreateDiscipline,
}) => {
  return (
    <div className="dashboard-discipline-list">
      {disciplines.map((discipline, index) => (
        <button key={index} className="dashboard-button">
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
