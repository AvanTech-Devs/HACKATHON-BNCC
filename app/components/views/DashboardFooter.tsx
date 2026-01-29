import { FC } from "react";

export interface DashboardFooterProps {
  onCreateMaterial: () => void;
}

const DashboardFooter: FC<DashboardFooterProps> = ({
  onCreateMaterial,
}) => (
  <footer className="dashboard-footer">
  <button
    className="dashboard-button primary"
    onClick={onCreateMaterial}
  >
    + Criar Novo Material
  </button>
</footer>

);

export default DashboardFooter;
