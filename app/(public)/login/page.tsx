"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "@/app/styles/login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Cultura Digital</h1>
        <p className="login-subtitle">
          Acesse sua conta para continuar
        </p>

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/dashboard");
          }}
        >
          <div className="login-field">
            <label className="login-label">Usuário</label>
            <input
              className="login-input"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Senha</label>
            <input
              type="password"
              className="login-input"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
