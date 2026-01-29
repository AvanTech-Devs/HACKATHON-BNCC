import { FC } from "react";

interface DashboardHeaderProps {
  userName: string;
  onCreateMaterial: () => void;
}



const DashboardHeader: FC<DashboardHeaderProps> = ({
  userName,
}) => (
  <header className="dashboard-header">
    <h1 className="dashboard-title">Cultura Digital</h1>
    <p className="dashboard-welcome">
      Bem-vindo, {userName} 👋
    </p>
  </header>
);

export default DashboardHeader;
