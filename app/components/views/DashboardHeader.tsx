"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

interface DashboardHeaderProps {
  userName: string;
  onCreateMaterial?: () => void;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({
  userName,
  onCreateMaterial,
}) => {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">Cultura Digital</h1>
        <p className="dashboard-welcome">
          Bem-vindo, {userName} 👋
        </p>
      </div>

      <div className="dashboard-header-right">
        {onCreateMaterial && (
          <button
            className="dashboard-button primary"
            onClick={onCreateMaterial}
          >
            Novo Material
          </button>
        )}

        <button
          className="dashboard-button logout"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
