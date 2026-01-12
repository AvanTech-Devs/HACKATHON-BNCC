import React from "react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title">Cultura Digital</h1>
      <p className="dashboard-welcome">Bem-vindo, {userName} 👋</p>
    </header>
  );
};

export default DashboardHeader;
