/**
 * Tela Meus Agendamentos - BarbeariaBR99
 * Lista de agendamentos do usuário
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { format, parseISO, isAfter, isBefore, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";
import {
  Texto,
  Botao,
  Cartao,
  CampoTexto,
  Carregando,
  IconeCalendario,
  IconeRelogio,
  IconeTesoura,
  IconeFechar,
} from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { formatarPreco } from "@/lib/horarios";
import type { Agendamento, StatusAgendamento } from "@/types";

interface AgendamentoCompleto extends Agendamento {
  barbeiro?: { nome: string };
  servicos?: { nome: string; preco: number }[];
}

/**
 * Card de agendamento
 */
function CardAgendamento({
  agendamento,
  onCancelar,
}: {
  agendamento: AgendamentoCompleto;
  onCancelar: () => void;
}) {
  const { tema } = useTema();
  const cores = Cores[tema];

  const dataAgendamento = parseISO(agendamento.data);
  const ehHoje = isToday(dataAgendamento);
  const ehFuturo = isAfter(dataAgendamento, new Date());

  const getCorStatus = (status: StatusAgendamento) => {
    switch (status) {
      case "pendente":
        return Cores.fixas.alerta;
      case "confirmado":
        return cores.sucesso;
      case "concluido":
        return "#22c55e";
      case "cancelado":
        return cores.erro;
      case "nao_compareceu":
        return "#ef4444";
      default:
        return cores.textoSecundario;
    }
  };

  const getLabelStatus = (status: StatusAgendamento) => {
    switch (status) {
      case "pendente":
        return "Aguardando confirmação";
      case "confirmado":
        return "Confirmado";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      case "nao_compareceu":
        return "Não compareceu";
      default:
        return status;
    }
  };

  const podeCancelar =
    ehFuturo && !["cancelado", "concluido", "nao_compareceu"].includes(agendamento.status);

  return (
    <Cartao estilo={styles.cartaoAgendamento}>
      {/* Header com data */}
      <View style={styles.agendamentoHeader}>
        <View style={styles.dataContainer}>
          <IconeCalendario tamanho={18} cor={cores.texto} />
          <Texto variante="label" negrito>
            {ehHoje
              ? "Hoje"
              : format(dataAgendamento, "EEEE, dd 'de' MMM", { locale: ptBR })}
          </Texto>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getCorStatus(agendamento.status) + "20" },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getCorStatus(agendamento.status) },
            ]}
          />
          <Texto
            variante="pequeno"
            cor={getCorStatus(agendamento.status)}
            negrito
          >
            {getLabelStatus(agendamento.status)}
          </Texto>
        </View>
      </View>

      {/* Detalhes */}
      <View style={styles.agendamentoDetalhes}>
        <View style={styles.detalheItem}>
          <IconeRelogio tamanho={16} cor={cores.textoSecundario} />
          <Texto variante="corpo" secundario>
            {agendamento.hora_inicio} - {agendamento.hora_fim}
          </Texto>
        </View>

        {agendamento.barbeiro && (
          <View style={styles.detalheItem}>
            <IconeTesoura tamanho={16} cor={cores.textoSecundario} />
            <Texto variante="corpo" secundario>
              {agendamento.barbeiro.nome}
            </Texto>
          </View>
        )}
      </View>

      {/* Valor */}
      <View style={styles.agendamentoValor}>
        <Texto variante="corpo" secundario>
          Valor total
        </Texto>
        <Texto variante="subtitulo" negrito>
          {formatarPreco(agendamento.valor_total)}
        </Texto>
      </View>

      {/* Ações */}
      {podeCancelar && (
        <View style={styles.agendamentoAcoes}>
          <Botao
            titulo="Cancelar"
            onPress={onCancelar}
            variante="outline"
            tamanho="pequeno"
            iconeEsquerda={<IconeFechar tamanho={14} cor={cores.erro} />}
            estiloTexto={{ color: cores.erro }}
          />
        </View>
      )}
    </Cartao>
  );
}

/**
 * Tela Meus Agendamentos
 */
export default function TelaMeusAgendamentos() {
  const { tema } = useTema();
  const cores = Cores[tema];

  const [telefone, setTelefone] = useState("");
  const [telefoneConsultado, setTelefoneConsultado] = useState<string | null>(null);
  const [agendamentos, setAgendamentos] = useState<AgendamentoCompleto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
      7,
      11
    )}`;
  };

  const buscarAgendamentos = useCallback(async (tel: string) => {
    const telefoneNumeros = tel.replace(/\D/g, "");
    if (telefoneNumeros.length < 10) return;

    setCarregando(true);

    try {
      // Buscar cliente
      const { data: cliente } = await supabase
        .from("clientes")
        .select("id")
        .eq("telefone", telefoneNumeros)
        .single();

      if (!cliente) {
        setAgendamentos([]);
        setTelefoneConsultado(telefoneNumeros);
        return;
      }

      // Buscar agendamentos
      const { data, error } = await supabase
        .from("agendamentos")
        .select(
          `
          *,
          barbeiro:barbeiros(nome)
        `
        )
        .eq("cliente_id", cliente.id)
        .order("data", { ascending: false })
        .order("hora_inicio", { ascending: false })
        .limit(20);

      if (error) throw error;

      setAgendamentos(data || []);
      setTelefoneConsultado(telefoneNumeros);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      Alert.alert("Erro", "Não foi possível buscar os agendamentos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const atualizar = useCallback(async () => {
    if (!telefoneConsultado) return;
    setAtualizando(true);
    await buscarAgendamentos(telefoneConsultado);
    setAtualizando(false);
  }, [telefoneConsultado, buscarAgendamentos]);

  const cancelarAgendamento = async (id: string) => {
    Alert.alert(
      "Cancelar Agendamento",
      "Tem certeza que deseja cancelar este agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("agendamentos")
                .update({ status: "cancelado" })
                .eq("id", id);

              if (error) throw error;

              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              atualizar();
            } catch (error) {
              console.error("Erro ao cancelar:", error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Erro", "Não foi possível cancelar o agendamento.");
            }
          },
        },
      ]
    );
  };

  // Separar agendamentos por período
  const agendamentosFuturos = agendamentos.filter(
    (a) =>
      (isAfter(parseISO(a.data), new Date()) || isToday(parseISO(a.data))) &&
      !["cancelado", "concluido", "nao_compareceu"].includes(a.status)
  );

  const agendamentosPassados = agendamentos.filter(
    (a) =>
      isBefore(parseISO(a.data), new Date()) ||
      ["cancelado", "concluido", "nao_compareceu"].includes(a.status)
  );

  // Tela de busca
  if (!telefoneConsultado) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
        <View style={styles.header}>
          <Texto variante="titulo">Meus Agendamentos</Texto>
        </View>

        <View style={styles.buscaContainer}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <Texto variante="corpo" secundario style={styles.buscaTexto}>
              Digite seu telefone para visualizar seus agendamentos
            </Texto>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <CampoTexto
              label="Telefone"
              placeholder="(86) 99999-9999"
              value={telefone}
              onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
              keyboardType="phone-pad"
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)}>
            <Botao
              titulo="Buscar Agendamentos"
              onPress={() => buscarAgendamentos(telefone)}
              larguraTotal
              carregando={carregando}
              desabilitado={telefone.replace(/\D/g, "").length < 10}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // Lista de agendamentos
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
      <View style={styles.header}>
        <Texto variante="titulo">Meus Agendamentos</Texto>
        <TouchableOpacity
          onPress={() => setTelefoneConsultado(null)}
          style={styles.trocarTelefone}
        >
          <Texto variante="pequeno" cor={cores.texto}>
            Trocar número
          </Texto>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <Carregando mensagem="Carregando agendamentos..." telaCheia />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={atualizar} />
          }
        >
          {agendamentos.length === 0 ? (
            <View style={styles.vazio}>
              <IconeCalendario tamanho={64} cor={cores.textoSecundario} />
              <Texto
                variante="corpo"
                secundario
                centralizado
                style={{ marginTop: 16 }}
              >
                Nenhum agendamento encontrado para este número.
              </Texto>
              <Botao
                titulo="Fazer Agendamento"
                onPress={() => {}}
                variante="outline"
                estilo={{ marginTop: 24 }}
              />
            </View>
          ) : (
            <>
              {/* Próximos agendamentos */}
              {agendamentosFuturos.length > 0 && (
                <View style={styles.secao}>
                  <Texto variante="label" negrito style={styles.secaoTitulo}>
                    Próximos Agendamentos
                  </Texto>
                  {agendamentosFuturos.map((agendamento, index) => (
                    <Animated.View
                      key={agendamento.id}
                      entering={FadeInDown.delay(index * 100)}
                    >
                      <CardAgendamento
                        agendamento={agendamento}
                        onCancelar={() => cancelarAgendamento(agendamento.id)}
                      />
                    </Animated.View>
                  ))}
                </View>
              )}

              {/* Histórico */}
              {agendamentosPassados.length > 0 && (
                <View style={styles.secao}>
                  <Texto variante="label" negrito style={styles.secaoTitulo}>
                    Histórico
                  </Texto>
                  {agendamentosPassados.map((agendamento, index) => (
                    <Animated.View
                      key={agendamento.id}
                      entering={FadeInDown.delay(index * 50)}
                    >
                      <CardAgendamento
                        agendamento={agendamento}
                        onCancelar={() => {}}
                      />
                    </Animated.View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  trocarTelefone: {
    padding: 8,
  },
  buscaContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  buscaTexto: {
    marginBottom: 24,
    textAlign: "center",
  },
  lista: {
    padding: 20,
    paddingBottom: 100,
  },
  vazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    marginBottom: 12,
  },
  cartaoAgendamento: {
    marginBottom: 12,
  },
  agendamentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  agendamentoDetalhes: {
    gap: 8,
    marginBottom: 12,
  },
  detalheItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  agendamentoValor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#27272a",
  },
  agendamentoAcoes: {
    marginTop: 12,
  },
});
