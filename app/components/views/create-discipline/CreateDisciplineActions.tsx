import React from "react";

interface CreateDisciplineActionsProps {
  loading: boolean;
  error?: string | null;
  onConfirm: () => void;
  onBack: () => void;
}

const CreateDisciplineActions: React.FC<CreateDisciplineActionsProps> = ({
  loading,
  error,
  onConfirm,
  onBack,
}) => {
  return (
    <>
      <div className="form-actions">
        <button
          type="button"
          className="form-button primary"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? "Criando..." : "✅ Confirmar Criação"}
        </button>

        <button
          type="button"
          className="form-button secondary"
          onClick={onBack}
        >
          ← Voltar
        </button>
      </div>

      {error && (
        <p className="error-message">{error}</p>
      )}
    </>
  );
};

export default CreateDisciplineActions;
