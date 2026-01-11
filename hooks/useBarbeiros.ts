/**
 * Hook para buscar barbeiros do Supabase
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Barbeiro } from "@/types";

export function useBarbeiros() {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarBarbeiros();

    // Configurar realtime
    const channel = supabase
      .channel("barbeiros-publicos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "barbeiros",
        },
        () => {
          console.log("🔄 Barbeiros atualizados, recarregando...");
          buscarBarbeiros();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const buscarBarbeiros = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from("barbeiros")
        .select("*")
        .eq("ativo", true);

      if (error) {
        console.error("❌ Erro ao buscar barbeiros:", error);
        throw error;
      }

      console.log("✅ Barbeiros carregados:", data?.length || 0);
      setBarbeiros(data || []);
    } catch (err: any) {
      console.error("❌ Erro ao buscar barbeiros:", err);
      setErro(err.message || "Erro ao carregar barbeiros");
      setBarbeiros([]);
    } finally {
      setCarregando(false);
    }
  };

  return { barbeiros, carregando, erro, recarregar: buscarBarbeiros };
}

export default useBarbeiros;
