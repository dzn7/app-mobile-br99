/**
 * Contexto de Tema - BarbeariaBR99
 * Gerencia o tema claro/escuro do aplicativo
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Tema = "light" | "dark" | "system";

interface TemaContextProps {
  tema: "light" | "dark";
  temaConfigurado: Tema;
  alternarTema: () => void;
  definirTema: (tema: Tema) => void;
  estaCarregando: boolean;
}

const TemaContext = createContext<TemaContextProps | undefined>(undefined);

const CHAVE_TEMA = "@barbeariabr99:tema";

/**
 * Provider do contexto de tema
 */
export function TemaProvider({ children }: { children: React.ReactNode }) {
  const esquemaDispositivo = useNativeColorScheme();
  const [temaConfigurado, setTemaConfigurado] = useState<Tema>("system");
  const [estaCarregando, setEstaCarregando] = useState(true);

  // Tema efetivo baseado na configuração
  const tema: "light" | "dark" =
    temaConfigurado === "system"
      ? esquemaDispositivo || "dark"
      : temaConfigurado;

  // Carregar tema salvo
  useEffect(() => {
    carregarTema();
  }, []);

  const carregarTema = async () => {
    try {
      const temaSalvo = await AsyncStorage.getItem(CHAVE_TEMA);
      if (temaSalvo && ["light", "dark", "system"].includes(temaSalvo)) {
        setTemaConfigurado(temaSalvo as Tema);
      }
    } catch (erro) {
      console.error("Erro ao carregar tema:", erro);
    } finally {
      setEstaCarregando(false);
    }
  };

  const salvarTema = async (novoTema: Tema) => {
    try {
      await AsyncStorage.setItem(CHAVE_TEMA, novoTema);
    } catch (erro) {
      console.error("Erro ao salvar tema:", erro);
    }
  };

  const alternarTema = () => {
    const proximoTema = tema === "light" ? "dark" : "light";
    setTemaConfigurado(proximoTema);
    salvarTema(proximoTema);
  };

  const definirTema = (novoTema: Tema) => {
    setTemaConfigurado(novoTema);
    salvarTema(novoTema);
  };

  return (
    <TemaContext.Provider
      value={{
        tema,
        temaConfigurado,
        alternarTema,
        definirTema,
        estaCarregando,
      }}
    >
      {children}
    </TemaContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de tema
 */
export function useTema() {
  const context = useContext(TemaContext);

  if (context === undefined) {
    throw new Error("useTema deve ser usado dentro de um TemaProvider");
  }

  return context;
}

export default TemaContext;
