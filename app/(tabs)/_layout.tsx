/**
 * Layout das Tabs - BarbeariaBR99
 * Navegação inferior com tabs - respeitando safe areas em Android e iOS
 */

import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LayoutTabs() {
  const { tema } = useTema();
  const cores = Cores[tema];
  const insets = useSafeAreaInsets();

  // Calcular padding bottom considerando safe area (para botões virtuais do Android)
  const paddingBottomSeguro = Math.max(insets.bottom, Platform.OS === "ios" ? 0 : 12);
  const alturaTabBar = 60 + paddingBottomSeguro;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.tabIconeAtivo,
        tabBarInactiveTintColor: cores.tabIconeInativo,
        tabBarStyle: {
          backgroundColor: cores.tabFundo,
          borderTopColor: cores.borda,
          borderTopWidth: 1,
          height: alturaTabBar,
          paddingBottom: paddingBottomSeguro,
          paddingTop: 8,
          // Sombra sutil para dar profundidade
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: tema === 'dark' ? 0.3 : 0.08,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agendamento"
        options={{
          title: "Agendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meus-agendamentos"
        options={{
          title: "Agendamentos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
