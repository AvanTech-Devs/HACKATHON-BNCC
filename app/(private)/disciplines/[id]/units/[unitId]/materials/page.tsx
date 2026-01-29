"use client";

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

  const materials =
    actions.getFilteredMaterials(unitId, mode);

  const allowedTypes =
    actions.getAllowedTypesByMode(mode);

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

      <section className="materials-actions">
        <h2>Gerar com IA</h2>

        {allowedTypes.map((type) => (
          <button
            key={type}
            onClick={() =>
              actions.generateMaterial(unitId, type)
            }
          >
            Gerar {type}
          </button>
        ))}
      </section>

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
                onClick={() =>
                  actions.deleteMaterial(m.id)
                }
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MaterialsPage;
