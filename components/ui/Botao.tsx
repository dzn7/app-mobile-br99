/**
 * Componente Botão - BarbeariaBR99
 * Botão reutilizável seguindo o design system
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";

type VarianteBotao = "primario" | "secundario" | "outline" | "ghost";
type TamanhoBotao = "pequeno" | "medio" | "grande";

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  carregando?: boolean;
  desabilitado?: boolean;
  iconeEsquerda?: React.ReactNode;
  iconeDireita?: React.ReactNode;
  larguraTotal?: boolean;
  estilo?: ViewStyle;
  estiloTexto?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Botao({
  titulo,
  onPress,
  variante = "primario",
  tamanho = "medio",
  carregando = false,
  desabilitado = false,
  iconeEsquerda,
  iconeDireita,
  larguraTotal = false,
  estilo,
  estiloTexto,
}: BotaoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  const handlePressIn = () => {
    escala.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    escala.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (!desabilitado && !carregando) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  // Estilos baseados na variante
  const obterEstilosBotao = (): ViewStyle => {
    const estiloBase: ViewStyle = {
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    };

    // Tamanho
    switch (tamanho) {
      case "pequeno":
        estiloBase.paddingVertical = 8;
        estiloBase.paddingHorizontal = 16;
        break;
      case "grande":
        estiloBase.paddingVertical = 18;
        estiloBase.paddingHorizontal = 32;
        break;
      default:
        estiloBase.paddingVertical = 14;
        estiloBase.paddingHorizontal = 24;
    }

    // Variante
    switch (variante) {
      case "primario":
        estiloBase.backgroundColor = cores.botaoPrimario;
        break;
      case "secundario":
        estiloBase.backgroundColor = cores.botaoSecundario;
        break;
      case "outline":
        estiloBase.backgroundColor = "transparent";
        estiloBase.borderWidth = 2;
        estiloBase.borderColor = cores.botaoPrimario;
        break;
      case "ghost":
        estiloBase.backgroundColor = "transparent";
        break;
    }

    // Desabilitado
    if (desabilitado || carregando) {
      estiloBase.opacity = 0.5;
    }

    // Largura total
    if (larguraTotal) {
      estiloBase.width = "100%";
    }

    return estiloBase;
  };

  const obterEstilosTexto = (): TextStyle => {
    const estiloBase: TextStyle = {
      fontWeight: "600",
    };

    // Tamanho
    switch (tamanho) {
      case "pequeno":
        estiloBase.fontSize = 14;
        break;
      case "grande":
        estiloBase.fontSize = 18;
        break;
      default:
        estiloBase.fontSize = 16;
    }

    // Variante
    switch (variante) {
      case "primario":
        estiloBase.color = cores.botaoPrimarioTexto;
        break;
      case "secundario":
        estiloBase.color = cores.botaoSecundarioTexto;
        break;
      case "outline":
      case "ghost":
        estiloBase.color = cores.botaoGhostTexto;
        break;
    }

    return estiloBase;
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={desabilitado || carregando}
      activeOpacity={0.8}
      style={[obterEstilosBotao(), estiloAnimado, estilo]}
    >
      {carregando ? (
        <ActivityIndicator
          color={
            variante === "primario"
              ? cores.botaoPrimarioTexto
              : cores.botaoGhostTexto
          }
          size="small"
        />
      ) : (
        <>
          {iconeEsquerda}
          <Text style={[obterEstilosTexto(), estiloTexto]}>{titulo}</Text>
          {iconeDireita}
        </>
      )}
    </AnimatedTouchable>
  );
}

export default Botao;
