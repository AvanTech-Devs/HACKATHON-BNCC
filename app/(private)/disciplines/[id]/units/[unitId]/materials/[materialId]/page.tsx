"use client";

import { useParams } from "next/navigation";
import { localUnitRepository } from "@/app/models/repository/localUnitRepository";

export default function MaterialDetailsPage() {
  const { materialId } = useParams();

  const unit = localUnitRepository
    .getUnits()
    .find((u) =>
      u.materials.some((m) => m.id === materialId)
    );

  const material = unit?.materials.find(
    (m) => m.id === materialId
  );

  if (!material) return <p>Material não encontrado.</p>;

  return (
    <div className="material-details-container">
      <h1>{material.type.toUpperCase()}</h1>
      <pre>{material.content}</pre>
    </div>
  );
}
