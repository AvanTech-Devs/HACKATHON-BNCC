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
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.spinner} />
          <p>{message}</p>
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
  },

  modal: {
    background: "#111",
    color: "#fff",
    padding: "24px 32px",
    borderRadius: 12,
    minWidth: 260,
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
  },

  spinner: {
    width: 36,
    height: 36,
    border: "4px solid #444",
    borderTop: "4px solid #4ade80",
    borderRadius: "50%",
    margin: "0 auto 16px",
    animation: "spin 0.9s linear infinite",
  },
};
