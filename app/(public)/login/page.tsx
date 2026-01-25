"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username && password) {
      router.push("/dashboard");
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };
//comentando
  return (
    <div className="flex flex-col items-center mt-16">
      <h1 className="text-2xl font-bold mb-6">
        Bem-vindo ao Cultura Digital
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col w-80 gap-3">
        <label>Usuário</label>
        <input
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Senha</label>
        <input
          type="password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
