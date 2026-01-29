"use client";

import { FC } from "react";
import { Discipline } from "@/app/models/types/discipline";

interface SelectUnitModalProps {
  discipline: Discipline;
  selectedUnitId: string;
  setSelectedUnitId: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const SelectUnitModal: FC<SelectUnitModalProps> = ({
  discipline,
  selectedUnitId,
  setSelectedUnitId,
  onCancel,
  onConfirm,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Selecione a unidade</h2>

        <select
          value={selectedUnitId}
          onChange={(e) => setSelectedUnitId(e.target.value)}
          style={styles.select}
        >
          <option value="">Selecione a unidade</option>
          {discipline.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.theme}
            </option>
          ))}
        </select>

        <div style={styles.buttons}>
          <button style={styles.button} onClick={onCancel}>
            Cancelar
          </button>
          <button
            style={{
              ...styles.button,
              ...(selectedUnitId ? {} : styles.buttonDisabled),
            }}
            disabled={!selectedUnitId}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectUnitModal;

/* =========================
   STYLES INLINE – PADRÃO DASHBOARD
========================= */
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#ffffff",
    color: "#111827",
    padding: "24px 32px",
    borderRadius: 12,
    minWidth: 280,
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  select: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    background: "#f3f4f6",
    color: "#111827",
    fontSize: 14,
    marginTop: 8,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
  button: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    transition: "background-color 0.2s ease",
  },
  buttonDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
};
