"use client";

import { useParams, useRouter } from "next/navigation";
import "@/app/styles/unit-details.css";

import { useUserUnitDetailsViewModel } from "@/app/components/viewmodels/userUnitDetailsViewModel";
import { parseRichText } from "@/app/utils/parseRichText";

export default function UnitDetailsPage() {
  const { unitId } = useParams<{ unitId: string }>();
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
  } = useUserUnitDetailsViewModel(unitId);

  if (loading) {
    return <p className="unit-loading">Carregando aula...</p>;
  }

  if (!unit) {
    return <p className="unit-loading">Unidade não encontrada.</p>;
  }

  return (
    <div
      className={`unit-details-container ${
        isEditing ? "editing" : ""
      }`}
    >
      {/* HEADER */}
      <header className="unit-details-header">
        <div className="unit-header-info">
          <h1>{unit.theme}</h1>
          <p>
            Criada em{" "}
            {unit.createdAt.toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="unit-header-actions">
          {!isEditing && (
            <button
              className="unit-button primary"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}

          <button
            className="unit-button secondary"
            onClick={() => router.back()}
          >
            Voltar
          </button>
        </div>
      </header>

      {/* PLANO DE AULA */}
      <section className="unit-section">
        <h2>📘 Plano de Aula</h2>

        {isEditing ? (
          <textarea
            className="unit-textarea"
            value={lessonPlanInput}
            onChange={(e) =>
              setLessonPlanInput(e.target.value)
            }
            rows={10}
          />
        ) : (
          <div className="unit-text-block">
            {parseRichText(unit.lessonPlan)}
          </div>
        )}
      </section>

      {/* ATIVIDADE */}
      <section className="unit-section">
        <h2>📝 Atividade</h2>

        {isEditing ? (
          <textarea
            className="unit-textarea"
            value={activityInput}
            onChange={(e) =>
              setActivityInput(e.target.value)
            }
            rows={10}
          />
        ) : (
          <div className="unit-text-block">
            {parseRichText(unit.activity)}
          </div>
        )}
      </section>

      {/* AÇÕES DE EDIÇÃO */}
      {isEditing && (
        <div className="unit-buttons">
          <button className="unit-button primary" onClick={saveUnit}>
            Salvar
          </button>

          <button
            className="unit-button secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
