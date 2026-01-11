/**
 * Componente Campo de Texto - BarbeariaBR99
 * Input reutilizável seguindo o design system
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";

interface CampoTextoProps extends TextInputProps {
  label?: string;
  erro?: string;
  iconeEsquerda?: React.ReactNode;
  iconeDireita?: React.ReactNode;
  obrigatorio?: boolean;
  estilo?: ViewStyle;
}

export function CampoTexto({
  label,
  erro,
  iconeEsquerda,
  iconeDireita,
  obrigatorio = false,
  estilo,
  onFocus,
  onBlur,
  ...props
}: CampoTextoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];
  const [focado, setFocado] = useState(false);
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  const handleFocus = (e: any) => {
    setFocado(true);
    escala.value = withSpring(1.01, { damping: 15 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocado(false);
    escala.value = withSpring(1, { damping: 15 });
    onBlur?.(e);
  };

  const corBorda = erro
    ? Cores.fixas.erro
    : focado
    ? cores.texto
    : cores.inputBorda;

  return (
    <View style={[styles.container, estilo]}>
      {label && (
        <Text style={[styles.label, { color: cores.texto }]}>
          {label}
          {obrigatorio && (
            <Text style={{ color: Cores.fixas.erro }}> *</Text>
          )}
        </Text>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: cores.inputFundo,
            borderColor: corBorda,
          },
          estiloAnimado,
        ]}
      >
        {iconeEsquerda && (
          <View style={styles.icone}>{iconeEsquerda}</View>
        )}

        <TextInput
          {...props}
          style={[
            styles.input,
            {
              color: cores.inputTexto,
              flex: 1,
            },
          ]}
          placeholderTextColor={cores.inputPlaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {iconeDireita && (
          <View style={styles.icone}>{iconeDireita}</View>
        )}
      </Animated.View>

      {erro && (
        <Text style={[styles.erro, { color: Cores.fixas.erro }]}>
          ⚠️ {erro}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
  },
  icone: {
    marginRight: 8,
  },
  erro: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CampoTexto;
