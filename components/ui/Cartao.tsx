/**
 * Componente Cartão - BarbeariaBR99
 * Card reutilizável seguindo o design system
 */

import Cores from "@/constants/Colors";
import { useTema } from "@/contexts/TemaContext";
import React from "react";
import { View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface CartaoProps {
  children: React.ReactNode;
  estilo?: ViewStyle | ViewStyle[];
  pressionavel?: boolean;
  onPress?: () => void;
  animacaoEntrada?: boolean;
  indiceAnimacao?: number;
}

export function Cartao({
  children,
  estilo,
  animacaoEntrada = false,
  indiceAnimacao = 0,
}: CartaoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];

  const estiloCartao: ViewStyle = {
    backgroundColor: cores.cartao,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: cores.borda,
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
