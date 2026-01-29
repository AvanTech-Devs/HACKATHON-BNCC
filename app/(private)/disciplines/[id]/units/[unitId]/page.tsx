"use client";

import { useParams, useRouter } from "next/navigation";
import { useUserUnitDetailsViewModel } from "@/app/components/viewmodels/userUnitDetailsViewModel";
import { parseRichText } from "@/app/utils/parseRichText";
import "@/app/styles/unit-details.css";

export default function UnitDetailsPage() {
  const { unitId } = useParams();
  const router = useRouter();

  const {
    unit,
    loading,
    isEditing,
    lessonPlanInput,
    activityInput,
    setIsEditing,
    setLessonPlanInput,
    setActivityInput,
    saveUnit,
  } = useUserUnitDetailsViewModel(unitId as string);

  if (loading) {
    return <p className="loading-text">Carregando unidade...</p>;
  }

  if (!unit) {
    return <p className="loading-text">Unidade não encontrada.</p>;
  }

  return (
    <div className="unit-details-container">
      {/* HEADER */}
      <div className="unit-details-header">
        <h1>{unit.theme}</h1>
        <p>
          <strong>Criada em:</strong>{" "}
          {unit.createdAt.toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* PLANO DE AULA */}
      <div className="unit-section">
        <h2>Plano de Aula</h2>
        {isEditing ? (
          <textarea
            className="unit-textarea"
            value={lessonPlanInput}
            onChange={(e) => setLessonPlanInput(e.target.value)}
            rows={8}
          />
        ) : (
          <div className="unit-text-block">{parseRichText(unit.lessonPlan)}</div>
        )}
      </div>

      {/* ATIVIDADE */}
      <div className="unit-section">
        <h2>Atividade</h2>
        {isEditing ? (
          <textarea
            className="unit-textarea"
            value={activityInput}
            onChange={(e) => setActivityInput(e.target.value)}
            rows={8}
          />
        ) : (
          <div className="unit-text-block">{parseRichText(unit.activity)}</div>
        )}
      </div>

      {/* BOTÕES */}
      <div className="unit-buttons">
        {isEditing ? (
          <>
            <button className="primary" onClick={saveUnit}>
              Salvar
            </button>
            <button className="secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="primary" onClick={() => setIsEditing(true)}>
            Editar
          </button>
        )}

        <button className="secondary" onClick={() => router.back()}>
          Voltar
        </button>
      </div>
    </div>
  );
}
