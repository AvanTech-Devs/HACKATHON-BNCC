import React from "react";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  scrollable?: boolean;
  fullWidth? : boolean;
    area?: "credits" | "logs" | "disciplines";
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  scrollable = false,
  area,
}) => {
  return (
    <div
      className={`dashboard-card
        ${scrollable ? "dashboard-card--scrollable" : ""}
        ${area ? `dashboard-card--${area}` : ""}
      `}
    >
      <h2>{title}</h2>
      {children}
    </div>
  );
};


export default DashboardCard;
