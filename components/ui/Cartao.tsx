/**
 * Componente Cartão - BarbeariaBR99
 * Card reutilizável seguindo o design system premium
 */

import Cores from "@/constants/Colors";
import { useTema } from "@/contexts/TemaContext";
import React from "react";
import { Platform, View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface CartaoProps {
  children: React.ReactNode;
  estilo?: ViewStyle | ViewStyle[];
  pressionavel?: boolean;
  onPress?: () => void;
  animacaoEntrada?: boolean;
  indiceAnimacao?: number;
  semSombra?: boolean;
}

export function Cartao({
  children,
  estilo,
  animacaoEntrada = false,
  indiceAnimacao = 0,
  semSombra = false,
}: CartaoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];

  // Sombras mais visíveis no modo claro
  const sombraClaro: ViewStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  };

  const sombraEscuro: ViewStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  };

  const estiloCartao: ViewStyle = {
    backgroundColor: cores.cartao,
    borderRadius: 16,
    padding: 16,
    borderWidth: tema === 'light' ? 1 : 1,
    borderColor: cores.borda,
    ...(semSombra ? {} : tema === 'light' ? sombraClaro : sombraEscuro),
  };

  if (animacaoEntrada) {
    return (
      <Animated.View
        entering={FadeInDown.delay(indiceAnimacao * 100).springify()}
        style={[estiloCartao, estilo]}
      >
        {children}
      </Animated.View>
    );
  }

  return <View style={[estiloCartao, estilo]}>{children}</View>;
}

export default Cartao;
