"use client";

interface LoadingGenerateProps {
  message?: string;
}

export default function LoadingGenerate({
  message = "Gerando conteúdo..."
}: LoadingGenerateProps) {
  return (
    <>
      {/* CSS da animação */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.spinner} />
          <p style={styles.message}>{message}</p>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "1rem",
  },

  modal: {
    background: "#fff",              // agora segue o padrão de card/modal
    color: "#111827",                // texto principal
    padding: "24px 32px",
    borderRadius: 12,
    minWidth: 280,
    maxWidth: "90%",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)", // sombra suave
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },

  spinner: {
    width: 36,
    height: 36,
    border: "4px solid #e5e7eb",          // cor neutra
    borderTop: "4px solid #1e3a8a",       // cor primária do app
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },

  message: {
    fontSize: "1rem",
    fontWeight: 500,
    textAlign: "center",
    color: "#111827",
    margin: 0,
  },
};
