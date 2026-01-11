/**
 * Componente Texto - BarbeariaBR99
 * Texto reutilizável seguindo o design system
 */

import React from "react";
import { Text as RNText, TextProps, StyleSheet, TextStyle } from "react-native";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";

type VarianteTexto =
  | "titulo"
  | "subtitulo"
  | "corpo"
  | "label"
  | "pequeno"
  | "link";

interface TextoProps extends TextProps {
  variante?: VarianteTexto;
  cor?: string;
  centralizado?: boolean;
  negrito?: boolean;
  secundario?: boolean;
}

export function Texto({
  children,
  variante = "corpo",
  cor,
  centralizado = false,
  negrito = false,
  secundario = false,
  style,
  ...props
}: TextoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];

  const obterEstilo = (): TextStyle => {
    const estiloBase: TextStyle = {
      color: cor || (secundario ? cores.textoSecundario : cores.texto),
    };

    switch (variante) {
      case "titulo":
        estiloBase.fontSize = 28;
        estiloBase.fontWeight = "700";
        estiloBase.lineHeight = 36;
        break;
      case "subtitulo":
        estiloBase.fontSize = 20;
        estiloBase.fontWeight = "600";
        estiloBase.lineHeight = 28;
        break;
      case "corpo":
        estiloBase.fontSize = 16;
        estiloBase.fontWeight = "400";
        estiloBase.lineHeight = 24;
        break;
      case "label":
        estiloBase.fontSize = 14;
        estiloBase.fontWeight = "500";
        estiloBase.lineHeight = 20;
        break;
      case "pequeno":
        estiloBase.fontSize = 12;
        estiloBase.fontWeight = "400";
        estiloBase.lineHeight = 16;
        break;
      case "link":
        estiloBase.fontSize = 16;
        estiloBase.fontWeight = "500";
        estiloBase.textDecorationLine = "underline";
        break;
    }

    if (centralizado) {
      estiloBase.textAlign = "center";
    }

    if (negrito) {
      estiloBase.fontWeight = "700";
    }

    return estiloBase;
  };

  return (
    <RNText {...props} style={[obterEstilo(), style]}>
      {children}
    </RNText>
  );
}

export default Texto;
