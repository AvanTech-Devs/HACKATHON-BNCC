"use client";

import { useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import "@/app/styles/materials.css";

import {
  useUserMaterialViewModel,
  MaterialMode,
} from "@/app/components/viewmodels/useUserMaterialViewModel";

import LoadingGenerate from "@/app/components/modals/LoadingGenerate";

const MaterialsPage = () => {
  const { id, unitId } = useParams<{
    id: string;
    unitId: string;
  }>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const mode: MaterialMode =
    searchParams.get("mode") === "activity"
      ? "ACTIVITY"
      : "CONTENT";

  const { state, actions } = useUserMaterialViewModel();

  const materials = actions.getFilteredMaterials(unitId, mode);
  const allowedTypes = actions.getAllowedTypesByMode(mode);

  /* =========================
     LOADING STATE
  ========================= */
  const [showLoading, setShowLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Gerando conteúdo..."
  );

  return (
    <div className="materials-container">
      <header>
        <h1>
          {mode === "CONTENT"
            ? "Materiais Didáticos"
            : "Atividades e Avaliações"}
        </h1>

        <button onClick={() => router.back()}>
          Voltar
        </button>
      </header>

      {state.error && <p>{state.error}</p>}

      {/* =========================
          AÇÕES
      ========================= */}
      <section className="materials-actions">
        <h2>Gerar com IA</h2>

        {allowedTypes.map((type) => (
          <button
            key={type}
            disabled={state.loading}
            onClick={async () => {
              setShowLoading(true);
              setLoadingMessage("Gerando material com IA...");

              const result =
                await actions.generateMaterial(unitId, type);

              if (result) {
                setLoadingMessage(
                  "Material gerado com sucesso!"
                );
              } else {
                setLoadingMessage(
                  "Erro ao gerar material."
                );
              }

              // pequeno delay para UX
              setTimeout(() => {
                setShowLoading(false);
                setLoadingMessage("");
                router.refresh();
              }, 1200);
            }}
          >
            Gerar {type}
          </button>
        ))}
      </section>

      {/* =========================
          LISTA
      ========================= */}
      <section className="materials-list">
        <h2>Materiais Criados</h2>

        {materials.length === 0 && (
          <p>Nenhum material gerado ainda.</p>
        )}

        <ul>
          {materials.map((m) => (
            <li key={m.id}>
              <strong>{m.title}</strong>
              <span>{m.type}</span>

              <button
                onClick={() =>
                  router.push(
                    `/disciplines/${id}/units/${unitId}/materials/${m.id}`
                  )
                }
              >
                Ver
              </button>

              <button
                onClick={() => actions.deleteMaterial(m.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* =========================
          LOADING MODAL
      ========================= */}
      {showLoading && (
        <LoadingGenerate message={loadingMessage} />
      )}
    </div>
  );
};

export default MaterialsPage;
