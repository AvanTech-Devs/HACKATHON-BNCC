import React from "react";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default DashboardCard;
