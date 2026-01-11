/**
 * Layout Principal - BarbeariaBR99
 * Configura providers e navegação global
 */

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TemaProvider, useTema } from "@/contexts/TemaContext";
import { AutenticacaoProvider } from "@/contexts/AutenticacaoContext";
import Cores from "@/constants/Colors";

import "../global.css";

// Mantém a splash screen visível enquanto carrega recursos
SplashScreen.preventAutoHideAsync();

/**
 * Navegação com tema aplicado
 */
function NavegacaoComTema() {
  const { tema } = useTema();
  const cores = Cores[tema];

  return (
    <>
      <StatusBar style={tema === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}

/**
 * Layout raiz da aplicação
 */
export default function LayoutRaiz() {
  const [carregado, erro] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (erro) throw erro;
  }, [erro]);

  useEffect(() => {
    if (carregado) {
      SplashScreen.hideAsync();
    }
  }, [carregado]);

  if (!carregado) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TemaProvider>
        <AutenticacaoProvider>
          <NavegacaoComTema />
        </AutenticacaoProvider>
      </TemaProvider>
    </GestureHandlerRootView>
  );
}
