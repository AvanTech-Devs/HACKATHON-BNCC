// app/components/viewmodels/userUnitDetailsViewModel.ts

// app/components/viewmodels/userUnitDetailsViewModel.ts
import { useState, useEffect } from "react";
import { Unit } from "@/app/models/types/unit";
import { supabaseUnitRepository } from "@/app/models/repository/supabase/supabaseUnitRepository";

export const useUserUnitDetailsViewModel = (unitId: string | undefined) => {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [lessonPlanInput, setLessonPlanInput] = useState("");
  const [activityInput, setActivityInput] = useState("");

  // Carrega a unidade
  useEffect(() => {
    if (!unitId) return;

    const fetchUnit = async () => {
      setLoading(true);
      const foundUnit = await supabaseUnitRepository.getUnitById(unitId);
      if (foundUnit) {
        setUnit(foundUnit);
        setLessonPlanInput(foundUnit.lessonPlan);
        setActivityInput(foundUnit.activity);
      }
      setLoading(false);
    };

    fetchUnit();
  }, [unitId]);

  // Salva alterações
  const saveUnit = async () => {
    if (!unit) return;

    const updatedUnit: Unit = {
      ...unit,
      lessonPlan: lessonPlanInput,
      activity: activityInput,
    };

    await supabaseUnitRepository.deleteUnitById(unit.id); // remove antiga
    await supabaseUnitRepository.saveUnit(unit.id, updatedUnit); // salva atualizada

    setUnit(updatedUnit);
    setIsEditing(false);
  };

  return {
    unit,
    loading,
    isEditing,
    lessonPlanInput,
    activityInput,
    setIsEditing,
    setLessonPlanInput,
    setActivityInput,
    saveUnit,
  };
};
