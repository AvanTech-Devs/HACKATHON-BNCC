import { FC } from "react";
import { Discipline } from "@/app/models/types/discipline";

export interface DashboardDisciplineListProps {
  disciplines: Discipline[];
  onView: (id: Discipline["id"]) => void;
  onDelete: (id: Discipline["id"]) => void;
  onCreate: () => void;
}

const DashboardDisciplineList: FC<DashboardDisciplineListProps> = ({
  disciplines,
  onView,
  onDelete,
  onCreate,
}) => {
  if (disciplines.length === 0) {
    return (
      <>
        <p className="dashboard-empty">
          Nenhuma disciplina criada ainda.
        </p>

        <button
          className="dashboard-button primary"
          onClick={onCreate}
        >
          + Criar Nova Disciplina
        </button>
      </>
    );
  }

  return (
    <>
      <div className="dashboard-discipline-grid">
        {disciplines.map((discipline) => (
          <div key={discipline.id} className="discipline-card">
            <div>
              <h3 className="discipline-card-title">
                {discipline.name}
              </h3>
              <p className="discipline-card-grade">
                {discipline.grade}
              </p>
            </div>

            <div className="discipline-card-actions">
              <button
                className="discipline-view"
                onClick={() => onView(discipline.id)}
              >
                Ver
              </button>

              <button
                className="discipline-delete"
                onClick={() => onDelete(discipline.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

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
