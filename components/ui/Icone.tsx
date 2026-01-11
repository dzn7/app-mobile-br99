/**
 * Componente Ícone - BarbeariaBR99
 * Wrapper para ícones do Expo Vector Icons
 */

import React from "react";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";

type BibliotecaIcones = "ionicons" | "feather" | "material";

interface IconeProps {
  nome: string;
  tamanho?: number;
  cor?: string;
  biblioteca?: BibliotecaIcones;
}

export function Icone({
  nome,
  tamanho = 24,
  cor,
  biblioteca = "ionicons",
}: IconeProps) {
  const { tema } = useTema();
  const cores = Cores[tema];
  const corFinal = cor || cores.texto;

  switch (biblioteca) {
    case "feather":
      return <Feather name={nome as any} size={tamanho} color={corFinal} />;
    case "material":
      return (
        <MaterialCommunityIcons
          name={nome as any}
          size={tamanho}
          color={corFinal}
        />
      );
    default:
      return <Ionicons name={nome as any} size={tamanho} color={corFinal} />;
  }
}

// Ícones pré-configurados para uso comum

interface IconePreconfiguradoProps {
  tamanho?: number;
  cor?: string;
}

export function IconeCalendario({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="calendar-outline" tamanho={tamanho} cor={cor} />;
}

export function IconeRelogio({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="time-outline" tamanho={tamanho} cor={cor} />;
}

export function IconePessoa({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="person-outline" tamanho={tamanho} cor={cor} />;
}

export function IconeTesoura({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="cut-outline" tamanho={tamanho} cor={cor} />;
}

export function IconeEstrela({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];
  return (
    <Ionicons name="star" size={tamanho} color={cor || Cores.fixas.estrela} />
  );
}

export function IconeEstrelaMeia({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Ionicons name="star-half" size={tamanho} color={cor || Cores.fixas.estrela} />;
}

export function IconeEstrelaVazia({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];
  return <Ionicons name="star-outline" size={tamanho} color={cor || cores.borda} />;
}

export function IconeLocal({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="location-outline" tamanho={tamanho} cor={cor} />;
}

export function IconeTelefone({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="call-outline" tamanho={tamanho} cor={cor} />;
}

export function IconeWhatsApp({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Ionicons name="logo-whatsapp" size={tamanho} color={cor || "#25D366"} />;
}

export function IconeVoltar({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="arrow-back" tamanho={tamanho} cor={cor} />;
}

export function IconeAvancar({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="arrow-forward" tamanho={tamanho} cor={cor} />;
}

export function IconeCheck({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Ionicons name="checkmark" size={tamanho} color={cor || "#22c55e"} />;
}

export function IconeFechar({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="close" tamanho={tamanho} cor={cor} />;
}

export function IconeMenu({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="menu" tamanho={tamanho} cor={cor} />;
}

export function IconeHome({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="home-outline" tamanho={tamanho} cor={cor} />;
}

export function IconeConfiguracao({ tamanho = 24, cor }: IconePreconfiguradoProps) {
  return <Icone nome="settings-outline" tamanho={tamanho} cor={cor} />;
}
