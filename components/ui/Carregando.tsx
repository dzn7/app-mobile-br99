/**
 * Componente Carregando - BarbeariaBR99
 * Indicador de carregamento reutilizável
 */

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";
import { Texto } from "./Texto";

interface CarregandoProps {
  mensagem?: string;
  telaCheia?: boolean;
  tamanho?: "small" | "large";
}

export function Carregando({
  mensagem,
  telaCheia = false,
  tamanho = "large",
}: CarregandoProps) {
  const { tema } = useTema();
  const cores = Cores[tema];

  if (telaCheia) {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.telaCheia, { backgroundColor: cores.fundo }]}
      >
        <ActivityIndicator size={tamanho} color={cores.texto} />
        {mensagem && (
          <Texto
            variante="corpo"
            secundario
            centralizado
            style={styles.mensagem}
          >
            {mensagem}
          </Texto>
        )}
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={tamanho} color={cores.texto} />
      {mensagem && (
        <Texto variante="pequeno" secundario style={styles.mensagem}>
          {mensagem}
        </Texto>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  telaCheia: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mensagem: {
    marginTop: 12,
  },
});

export default Carregando;
