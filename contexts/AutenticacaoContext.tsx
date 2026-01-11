/**
 * Contexto de Autenticação - BarbeariaBR99
 * Gerencia autenticação via Supabase
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AppState } from "react-native";

interface AutenticacaoContextProps {
  usuario: User | null;
  sessao: Session | null;
  carregando: boolean;
  entrar: (
    email: string,
    senha: string
  ) => Promise<{ sucesso: boolean; erro?: string }>;
  cadastrar: (
    email: string,
    senha: string,
    nome: string,
    telefone: string
  ) => Promise<{ sucesso: boolean; erro?: string }>;
  sair: () => Promise<void>;
}

const AutenticacaoContext = createContext<AutenticacaoContextProps>({
  usuario: null,
  sessao: null,
  carregando: true,
  entrar: async () => ({ sucesso: false }),
  cadastrar: async () => ({ sucesso: false }),
  sair: async () => {},
});

/**
 * Provider do contexto de autenticação
 */
export function AutenticacaoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Gerenciar refresh de token quando app está em foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (estado) => {
      if (estado === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Verificar sessão e escutar mudanças
  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      setUsuario(session?.user ?? null);
      setCarregando(false);
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      setSessao(session);
      setUsuario(session?.user ?? null);
      setCarregando(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const entrar = async (email: string, senha: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error("Erro ao entrar:", error);
        return { sucesso: false, erro: error.message };
      }

      console.log("Login bem-sucedido:", data.user?.email);
      return { sucesso: true };
    } catch (erro: any) {
      console.error("Erro ao entrar:", erro);
      return { sucesso: false, erro: erro.message };
    }
  };

  const cadastrar = async (
    email: string,
    senha: string,
    nome: string,
    telefone: string
  ) => {
    try {
      // 1. Verificar se cliente já existe
      const { data: clienteExistente } = await supabase
        .from("clientes")
        .select("id, user_id")
        .eq("email", email)
        .maybeSingle();

      // 2. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
            telefone,
          },
        },
      });

      if (authError) {
        console.error("Erro ao cadastrar:", authError);
        return { sucesso: false, erro: authError.message };
      }

      if (!authData.user) {
        return { sucesso: false, erro: "Erro ao criar usuário" };
      }

      // 3. Criar ou atualizar registro na tabela clientes
      if (clienteExistente) {
        await supabase
          .from("clientes")
          .update({ user_id: authData.user.id })
          .eq("id", clienteExistente.id);
      } else {
        await supabase.from("clientes").insert([
          {
            nome,
            email,
            telefone,
            user_id: authData.user.id,
          },
        ]);
      }

      console.log("Cadastro bem-sucedido:", authData.user.email);
      return { sucesso: true };
    } catch (erro: any) {
      console.error("Erro ao cadastrar:", erro);
      return { sucesso: false, erro: erro.message };
    }
  };

  const sair = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Logout bem-sucedido");
    } catch (erro) {
      console.error("Erro ao sair:", erro);
    }
  };

  return (
    <AutenticacaoContext.Provider
      value={{
        usuario,
        sessao,
        carregando,
        entrar,
        cadastrar,
        sair,
      }}
    >
      {children}
    </AutenticacaoContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação
 */
export function useAutenticacao() {
  const context = useContext(AutenticacaoContext);
  if (!context) {
    throw new Error(
      "useAutenticacao deve ser usado dentro de AutenticacaoProvider"
    );
  }
  return context;
}

export default AutenticacaoContext;
