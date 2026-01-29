"use client";

import React, { useState } from "react";
import "@/app/styles/create-discipline.css";
import { useRouter } from "next/navigation";

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
    
      <form className="create-discipline-form">
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

        <CreateDisciplineActions
          loading={state.loading}
          error={state.error}
          onConfirm={async () => {
            const created =
              await actions.confirmCreateDiscipline(
                discipline,
                level,
                year
              );

            router.push(`/disciplines/${created.id}`);
          }}
          onBack={() => router.push("/dashboard")}
        />
      </form>
    </div>
    </div>
  );
};

export default CreateDisciplinePage;
