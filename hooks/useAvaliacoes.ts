/**
 * Hook para buscar avaliações públicas
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { AvaliacaoPublica } from "@/types";

interface EstatisticasAvaliacoes {
  totalAvaliacoes: number;
  mediaNotas: string;
  porcentagem5Estrelas: number;
  distribuicao: { nota: number; quantidade: number; porcentagem: number }[];
}

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoPublica[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasAvaliacoes>({
    totalAvaliacoes: 0,
    mediaNotas: "0.0",
    porcentagem5Estrelas: 0,
    distribuicao: [],
  });

  useEffect(() => {
    buscarAvaliacoes();
  }, []);

  const calcularEstatisticas = (avaliacoes: AvaliacaoPublica[]) => {
    if (avaliacoes.length === 0) {
      return {
        totalAvaliacoes: 0,
        mediaNotas: "0.0",
        porcentagem5Estrelas: 0,
        distribuicao: [5, 4, 3, 2, 1].map((nota) => ({
          nota,
          quantidade: 0,
          porcentagem: 0,
        })),
      };
    }

    const total = avaliacoes.length;
    const soma = avaliacoes.reduce((acc, av) => acc + av.avaliacao, 0);
    const media = (soma / total).toFixed(1);
    const cincoEstrelas = avaliacoes.filter((av) => av.avaliacao === 5).length;

    const distribuicao = [5, 4, 3, 2, 1].map((nota) => {
      const quantidade = avaliacoes.filter((av) => av.avaliacao === nota).length;
      return {
        nota,
        quantidade,
        porcentagem: Math.round((quantidade / total) * 100),
      };
    });

    return {
      totalAvaliacoes: total,
      mediaNotas: media,
      porcentagem5Estrelas: Math.round((cincoEstrelas / total) * 100),
      distribuicao,
    };
  };

  const buscarAvaliacoes = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from("avaliacoes_publicas")
        .select("*")
        .eq("aprovado", true)
        .order("criado_em", { ascending: false });

      if (error) {
        console.error("❌ Erro ao buscar avaliações:", error);
        throw error;
      }

      setAvaliacoes(data || []);
      setEstatisticas(calcularEstatisticas(data || []));
    } catch (err: any) {
      console.error("❌ Erro ao buscar avaliações:", err);
      setErro(err.message || "Erro ao carregar avaliações");
      setAvaliacoes([]);
    } finally {
      setCarregando(false);
    }
  };

  const enviarAvaliacao = async (
    nome: string,
    avaliacao: number,
    comentario: string
  ) => {
    try {
      const { error } = await supabase.from("avaliacoes_publicas").insert([
        {
          nome: nome.trim(),
          avaliacao,
          comentario: comentario.trim(),
          aprovado: true,
        },
      ]);

      if (error) throw error;

      await buscarAvaliacoes();
      return { sucesso: true };
    } catch (err: any) {
      console.error("❌ Erro ao enviar avaliação:", err);
      return { sucesso: false, erro: err.message };
    }
  };

  return {
    avaliacoes,
    estatisticas,
    carregando,
    erro,
    recarregar: buscarAvaliacoes,
    enviarAvaliacao,
  };
}

export default useAvaliacoes;
