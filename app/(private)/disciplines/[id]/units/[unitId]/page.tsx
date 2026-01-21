"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Unit } from "@/app/models/types/unit";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";

export default function UnitDetailsPage() {
  const { unitId } = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);

  useEffect(() => {
    const foundUnit = localUnitRepository.getUnitById(unitId as string);
    if (foundUnit) {
      setUnit(foundUnit);
    }
  }, [unitId]);

  if (!unit) {
    return <p>Carregando unidade...</p>;
  }

  return (
    <section>
      <h1>{unit.theme}</h1>

      <p>
        <strong>Criada em:</strong>{" "}
        {unit.createdAt.toLocaleDateString("pt-BR")}
      </p>

      <h2>Plano de Aula</h2>
      <p>{unit.lessonPlan}</p>

      <h2>Atividade</h2>
      <p>{unit.activity}</p>
    </section>
  );
}
