/**
 * Configuração do cliente Supabase para React Native
 * Utiliza SecureStore para armazenamento seguro de sessões
 */

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Variáveis de ambiente do Supabase
const urlSupabase = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const chavePublicaSupabase = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Adaptador de armazenamento seguro para Expo
 * Usa SecureStore em mobile e AsyncStorage em web
 */
const adaptadorArmazenamento = {
  getItem: async (chave: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return AsyncStorage.getItem(chave);
    }
    return SecureStore.getItemAsync(chave);
  },
  setItem: async (chave: string, valor: string): Promise<void> => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(chave, valor);
      return;
    }
    await SecureStore.setItemAsync(chave, valor);
  },
  removeItem: async (chave: string): Promise<void> => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(chave);
      return;
    }
    await SecureStore.deleteItemAsync(chave);
  },
};

/**
 * Cliente do Supabase configurado para React Native
 */
export const supabase = createClient(urlSupabase, chavePublicaSupabase, {
  auth: {
    storage: adaptadorArmazenamento,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Verifica se o Supabase está configurado corretamente
 */
export function verificarConfiguracao(): boolean {
  return Boolean(urlSupabase && chavePublicaSupabase);
}
