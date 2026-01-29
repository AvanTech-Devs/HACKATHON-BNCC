"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Unit } from "@/app/models/types/unit";
import { supabaseUnitRepository } from "@/app/models/repository/supabase/supabaseUnitRepository"; 

export default function UnitDetailsPage() {
  const { unitId } = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lessonPlanInput, setLessonPlanInput] = useState("");
  const [activityInput, setActivityInput] = useState("");

  useEffect(() => {
    const fetchUnit = async () => {
      const foundUnit = await supabaseUnitRepository.getUnitById(unitId as string);
      if (foundUnit) {
        setUnit(foundUnit);
        setLessonPlanInput(foundUnit.lessonPlan);
        setActivityInput(foundUnit.activity);
      }
    };
    fetchUnit();
  }, [unitId]);

  if (!unit) {
    return <p>Carregando unidade...</p>;
  }

  const handleSave = () => {
    if (!unit) return;

    const updatedUnit: Unit = {
      ...unit,
      lessonPlan: lessonPlanInput,
      activity: activityInput,
    };

    supabaseUnitRepository.deleteUnitById(unit.id); // remove antiga
    supabaseUnitRepository.saveUnit(unit.id, updatedUnit);   // salva atualizada
    setUnit(updatedUnit);
    setIsEditing(false);
  };

  return (
    <section>
      <h1>{unit.theme}</h1>

      <p>
        <strong>Criada em:</strong>{" "}
        {unit.createdAt.toLocaleDateString("pt-BR")}
      </p>

      <h2>Plano de Aula</h2>
      {isEditing ? (
        <textarea
          value={lessonPlanInput}
          onChange={(e) => setLessonPlanInput(e.target.value)}
          rows={5}
        />
      ) : (
        <p>{unit.lessonPlan}</p>
      )}

      <h2>Atividade</h2>
      {isEditing ? (
        <textarea
          value={activityInput}
          onChange={(e) => setActivityInput(e.target.value)}
          rows={5}
        />
      ) : (
        <p>{unit.activity}</p>
      )}

      <div style={{ marginTop: "16px" }}>
        {isEditing ? (
          <>
            <button onClick={handleSave}>Salvar</button>
            <button onClick={() => setIsEditing(false)}>Cancelar</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Editar</button>
        )}
      </div>
    </section>
  );
}
