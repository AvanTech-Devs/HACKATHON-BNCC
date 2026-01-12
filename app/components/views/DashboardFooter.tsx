import React from "react";

interface DashboardFooterProps {
  onCreateMaterial: () => void;
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({ onCreateMaterial }) => {
  return (
    <footer className="dashboard-footer">
      <button className="dashboard-button primary" onClick={onCreateMaterial}>
        + Criar Novo Material
      </button>
    </footer>
  );
};

export default DashboardFooter;
