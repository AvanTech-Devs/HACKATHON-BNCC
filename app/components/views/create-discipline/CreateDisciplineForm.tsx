import React from "react";
import {
  EDUCATION_STRUCTURE,
  EducationLevel,
} from "@/app/constants/education";

interface CreateDisciplineFormProps {
  level: EducationLevel | "";
  year: string;
  discipline: string;
  onLevelChange: (value: EducationLevel | "") => void;
  onYearChange: (value: string) => void;
  onDisciplineChange: (value: string) => void;
}

const CreateDisciplineForm: React.FC<CreateDisciplineFormProps> = ({
  level,
  year,
  discipline,
  onLevelChange,
  onYearChange,
  onDisciplineChange,
}) => {
  const educationData = level ? EDUCATION_STRUCTURE[level] : null;

  return (
    <>
      {/* NÍVEL */}
      <div className="form-group">
        <label>Nível de Ensino</label>
        <select
          value={level}
          onChange={(e) =>
            onLevelChange(e.target.value as EducationLevel)
          }
        >
          <option value="">Selecione</option>
          <option value="fundamental">Ensino Fundamental</option>
          <option value="medio">Ensino Médio</option>
        </select>
      </div>

      {/* ANO */}
      {educationData && (
        <div className="form-group">
          <label>Ano/Série</label>
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">Selecione</option>
            {educationData.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* DISCIPLINA */}
      {educationData && (
        <div className="form-group">
          <label>Disciplina</label>
          <select
            value={discipline}
            onChange={(e) =>
              onDisciplineChange(e.target.value)
            }
          >
            <option value="">Selecione</option>
            {educationData.disciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default CreateDisciplineForm;
