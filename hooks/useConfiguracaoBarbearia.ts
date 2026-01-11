/**
 * Hook para buscar configurações da barbearia
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ConfiguracaoBarbearia } from "@/types";

export function useConfiguracaoBarbearia() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoBarbearia | null>(
    null
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarConfiguracao();

    // Realtime para status da barbearia
    const channel = supabase
      .channel("status-barbearia")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "configuracoes_barbearia",
        },
        () => {
          console.log("🔄 Configurações atualizadas, recarregando...");
          buscarConfiguracao();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const buscarConfiguracao = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from("configuracoes_barbearia")
        .select("*")
        .single();

      if (error) {
        console.error("❌ Erro ao buscar configuração:", error);
        throw error;
      }

      setConfiguracao(data);
    } catch (err: any) {
      console.error("❌ Erro ao buscar configuração:", err);
      setErro(err.message || "Erro ao carregar configuração");
      // Configuração padrão
      setConfiguracao({
        id: "",
        aberta: true,
        mensagem_fechamento: null,
        horario_abertura: "09:00",
        horario_fechamento: "19:00",
        dias_funcionamento: ["seg", "ter", "qua", "qui", "sex", "sab"],
        intervalo_almoco_inicio: null,
        intervalo_almoco_fim: null,
        intervalo_horarios: 20,
        usar_horarios_personalizados: false,
        horarios_personalizados: null,
      });
    } finally {
      setCarregando(false);
    }
  };

  return { configuracao, carregando, erro, recarregar: buscarConfiguracao };
}

export default useConfiguracaoBarbearia;
