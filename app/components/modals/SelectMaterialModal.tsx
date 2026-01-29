"use client";

import { FC } from "react";
import { Discipline } from "@/app/models/types/discipline";

interface SelectMaterialModalProps {
  disciplines: Discipline[];
  selectedDisciplineId: string;
  setSelectedDisciplineId: (id: string) => void;
  selectedUnitId: string;
  setSelectedUnitId: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const SelectMaterialModal: FC<SelectMaterialModalProps> = ({
  disciplines,
  selectedDisciplineId,
  setSelectedDisciplineId,
  selectedUnitId,
  setSelectedUnitId,
  onCancel,
  onConfirm,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Escolha a disciplina e a unidade</h2>

        <select
          value={selectedDisciplineId}
          onChange={(e) => {
            setSelectedDisciplineId(e.target.value);
            setSelectedUnitId(""); // resetar unidade
          }}
          style={styles.select}
        >
          <option value="">Selecione a disciplina</option>
          {disciplines.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — Ensino Fundamental - {d.grade}
            </option>
          ))}
        </select>

        {selectedDisciplineId && (
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            style={styles.select}
          >
            <option value="">Selecione a unidade</option>
            {disciplines
              .find((d) => d.id === selectedDisciplineId)
              ?.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.theme}
                </option>
              ))}
          </select>
        )}

        <div style={styles.buttons}>
          <button style={styles.button} onClick={onCancel}>
            Cancelar
          </button>
          <button
            style={{
              ...styles.button,
              ...( !selectedDisciplineId || !selectedUnitId
                  ? styles.buttonDisabled
                  : {}),
            }}
            disabled={!selectedDisciplineId || !selectedUnitId}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectMaterialModal;

/* =========================
   STYLES INLINE
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
    background: "#111",
    color: "#fff",
    padding: "24px 32px",
    borderRadius: 12,
    minWidth: 280,
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  select: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #555",
    background: "#222",
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: "#4ade80",
    color: "#111",
  },
  buttonDisabled: {
    backgroundColor: "#555",
    cursor: "not-allowed",
  },
};
