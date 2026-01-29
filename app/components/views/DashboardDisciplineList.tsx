import { FC } from "react";
import { Discipline } from "@/app/models/types/discipline";

export interface DashboardDisciplineListProps {
  disciplines: Discipline[];
  onView: (id: Discipline["id"]) => void;
  onDelete: (id: Discipline["id"]) => void;
  onCreate: () => void;
}

const DashboardDisciplineList: FC<
  DashboardDisciplineListProps
> = ({ disciplines, onView, onDelete, onCreate }) => {
  return (
    <>
      {disciplines.length === 0 && (
        <p className="dashboard-empty">
          Nenhuma disciplina criada ainda.
        </p>
      )}

      {disciplines.length > 0 && (
        <ul className="dashboard-discipline-list">
          {disciplines.map((discipline) => (
            <li key={discipline.id} className="discipline-item">
              <span>
                <strong>{discipline.name}</strong> —{" "}
                {discipline.grade}
              </span>

              <button
                className="view-discipline-button"
                onClick={() => onView(discipline.id)}
              >
                Ver Detalhes
              </button>

              <button
                className="delete-discipline-button"
                onClick={() => onDelete(discipline.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        className="dashboard-button primary"
        onClick={onCreate}
      >
        + Criar Nova Disciplina
      </button>
    </>
  );
};


export default DashboardDisciplineList;
