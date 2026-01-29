// app/viewmodels/useLoginViewModel.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export function useLoginViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Usuário ou senha inválidos");
      return;
    }

    router.push("/dashboard");
  }

  return {
    loading,
    error,
    login,
  };
}

