/**
 * Tela Meus Agendamentos - BarbeariaBR99
 * Lista de agendamentos do usuário
 */

import {
    Botao,
    CampoTexto,
    Carregando,
    Cartao,
    IconeCalendario,
    IconeFechar,
    IconeRelogio,
    IconeTesoura,
    Texto,
} from "@/components/ui";
import Cores from "@/constants/Colors";
import { useTema } from "@/contexts/TemaContext";
import { formatarPreco } from "@/lib/horarios";
import { supabase } from "@/lib/supabase";
import type { StatusAgendamento } from "@/types";
import { format, isAfter, isBefore, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Interface corrigida para campos reais da tabela agendamentos
interface AgendamentoCompleto {
  id: string;
  cliente_id: string;
  barbeiro_id: string;
  servico_id: string;
  data_hora: string;
  status: StatusAgendamento;
  observacoes?: string;
  criado_em?: string;
  barbeiro?: { nome: string };
  servicos?: { nome: string; preco: number; duracao: number };
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

  // Usar data_hora (campo correto da tabela) - é um timestamp
  const dataAgendamento = new Date(agendamento.data_hora);
  const ehHoje = isToday(dataAgendamento);
  const ehFuturo = isAfter(dataAgendamento, new Date());

  const getCorStatus = (status: StatusAgendamento) => {
    switch (status) {
      case "pendente":
        return "#f59e0b"; // amber/warning
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
            {format(dataAgendamento, "HH:mm")}
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
      <View style={[styles.agendamentoValor, { borderTopColor: cores.borda }]}>
        <Texto variante="corpo" secundario>
          Valor total
        </Texto>
        <Texto variante="subtitulo" negrito>
          {formatarPreco(agendamento.servicos?.preco || 0)}
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
      // Buscar TODOS os clientes com esse telefone (pode haver duplicados)
      const { data: clientes, error: errorClientes } = await supabase
        .from("clientes")
        .select("id")
        .eq("telefone", telefoneNumeros);

      if (errorClientes) throw errorClientes;

      if (!clientes || clientes.length === 0) {
        setAgendamentos([]);
        setTelefoneConsultado(telefoneNumeros);
        return;
      }

      // Pegar IDs de todos os clientes com esse telefone
      const clienteIds = clientes.map(c => c.id);

      // Buscar agendamentos de TODOS os clientes com esse telefone
      const { data, error } = await supabase
        .from("agendamentos")
        .select(
          `
          *,
          barbeiro:barbeiros(nome),
          servicos(nome, preco, duracao)
        `
        )
        .in("cliente_id", clienteIds)
        .order("data_hora", { ascending: false })
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

  // Separar agendamentos por período (usando data_hora)
  const agendamentosFuturos = agendamentos.filter(
    (a) =>
      (isAfter(new Date(a.data_hora), new Date()) || isToday(new Date(a.data_hora))) &&
      !["cancelado", "concluido", "nao_compareceu"].includes(a.status)
  );

  const agendamentosPassados = agendamentos.filter(
    (a) =>
      isBefore(new Date(a.data_hora), new Date()) ||
      ["cancelado", "concluido", "nao_compareceu"].includes(a.status)
  );

  // Tela de busca
  if (!telefoneConsultado) {
    return (
      <SafeAreaView 
        style={[styles.container, { backgroundColor: cores.fundo }]}
        edges={["top"]}
      >
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
    <SafeAreaView 
      style={[styles.container, { backgroundColor: cores.fundo }]}
      edges={["top"]}
    >
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
  },
  agendamentoAcoes: {
    marginTop: 12,
  },
});
