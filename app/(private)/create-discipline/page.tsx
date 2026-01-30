"use client";

import React, { useState } from "react";
import "@/app/styles/create-discipline.css";
import { useRouter } from "next/navigation";
import { FaLightbulb, FaMagic } from "react-icons/fa";

import { useUserDisciplineViewModel } from "@/app/components/viewmodels/userDisciplineViewModel";
import { EducationLevel } from "@/app/constants/education";

import CreateDisciplineHeader from "@/app/components/views/create-discipline/CreateDisciplineHeader";
import CreateDisciplineForm from "@/app/components/views/create-discipline/CreateDisciplineForm";
import CreateDisciplineActions from "@/app/components/views/create-discipline/CreateDisciplineActions";

const CreateDisciplinePage = () => {
  const router = useRouter();
  const { state, actions } = useUserDisciplineViewModel();

  const [level, setLevel] = useState<EducationLevel | "">("");
  const [year, setYear] = useState("");
  const [discipline, setDiscipline] = useState("");

  return (
    <div className="create-discipline-container">
      <div className="create-discipline-wrapper">
        <CreateDisciplineHeader />

        <form className="create-discipline-form" onSubmit={(e) => e.preventDefault()}>
          {/* FORM */}
          <CreateDisciplineForm
            level={level}
            year={year}
            discipline={discipline}
            onLevelChange={(value) => {
              setLevel(value);
              setYear("");
              setDiscipline("");
            }}
            onYearChange={setYear}
            onDisciplineChange={setDiscipline}
          />

          {/* BOTÕES DE AÇÃO */}
          <div className="action-buttons">
            <button
              type="button"
              className="save-button"
              disabled={state.loading}
              onClick={async () => {
                try {
                  const created = await actions.confirmCreateDiscipline(
                    discipline,
                    level,
                    year
                  );
                  router.push(`/disciplines/${created.id}`);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              {state.loading ? "Carregando..." : "Salvar Disciplina"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => router.push("/dashboard")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDisciplinePage;
