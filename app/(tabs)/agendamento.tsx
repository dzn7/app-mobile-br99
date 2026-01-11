/**
 * Tela de Agendamento - BarbeariaBR99
 * Fluxo completo de agendamento de serviços
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { format, addDays, isToday, isTomorrow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTema } from "@/contexts/TemaContext";
import { useAutenticacao } from "@/contexts/AutenticacaoContext";
import Cores from "@/constants/Colors";
import {
  Texto,
  Botao,
  Cartao,
  CampoTexto,
  Carregando,
  IconeCheck,
  IconeCalendario,
  IconeRelogio,
  IconeTesoura,
} from "@/components/ui";
import { useServicos } from "@/hooks/useServicos";
import { useBarbeiros } from "@/hooks/useBarbeiros";
import { useConfiguracaoBarbearia } from "@/hooks/useConfiguracaoBarbearia";
import { supabase } from "@/lib/supabase";
import {
  gerarHorariosDisponiveis,
  formatarPreco,
  calcularDuracaoTotal,
} from "@/lib/horarios";
import type { Servico, Barbeiro, HorarioComStatus } from "@/types";

const { width } = Dimensions.get("window");

type EtapaAgendamento =
  | "servicos"
  | "barbeiro"
  | "data"
  | "horario"
  | "confirmacao";

/**
 * Componente de seleção de serviços
 */
function EtapaServicos({
  servicosSelecionados,
  onToggleServico,
  onAvancar,
}: {
  servicosSelecionados: string[];
  onToggleServico: (id: string) => void;
  onAvancar: () => void;
}) {
  const { tema } = useTema();
  const cores = Cores[tema];
  const { servicos, carregando } = useServicos();

  const precoTotal = useMemo(() => {
    return servicos
      .filter((s) => servicosSelecionados.includes(s.id))
      .reduce((acc, s) => acc + s.preco, 0);
  }, [servicos, servicosSelecionados]);

  const duracaoTotal = useMemo(() => {
    return servicos
      .filter((s) => servicosSelecionados.includes(s.id))
      .reduce((acc, s) => acc + s.duracao, 0);
  }, [servicos, servicosSelecionados]);

  if (carregando) {
    return <Carregando mensagem="Carregando serviços..." telaCheia />;
  }

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.etapaContainer}
    >
      <Texto variante="subtitulo" style={styles.etapaTitulo}>
        Selecione os serviços
      </Texto>
      <Texto variante="corpo" secundario style={styles.etapaSubtitulo}>
        Escolha um ou mais serviços que deseja
      </Texto>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {servicos.map((servico, index) => {
          const selecionado = servicosSelecionados.includes(servico.id);

          return (
            <Animated.View
              key={servico.id}
              entering={FadeInDown.delay(index * 50)}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onToggleServico(servico.id);
                }}
                activeOpacity={0.7}
              >
                <Cartao
                  estilo={[
                    styles.cartaoServico,
                    selecionado && {
                      borderColor: cores.sucesso,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <View style={styles.servicoInfo}>
                    <View style={styles.servicoIcone}>
                      <IconeTesoura tamanho={20} cor={cores.texto} />
                    </View>
                    <View style={styles.servicoDetalhes}>
                      <Texto variante="label" negrito>
                        {servico.nome}
                      </Texto>
                      <Texto variante="pequeno" secundario>
                        {servico.duracao} min
                      </Texto>
                    </View>
                    <View style={styles.servicoPrecoCheck}>
                      <Texto variante="label" negrito>
                        {formatarPreco(servico.preco)}
                      </Texto>
                      {selecionado && (
                        <View
                          style={[
                            styles.checkMark,
                            { backgroundColor: cores.sucesso },
                          ]}
                        >
                          <IconeCheck tamanho={14} cor="#fff" />
                        </View>
                      )}
                    </View>
                  </View>
                </Cartao>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Resumo e botão */}
      {servicosSelecionados.length > 0 && (
        <Animated.View
          entering={FadeInUp.springify()}
          style={[styles.resumoFixo, { backgroundColor: cores.cartao }]}
        >
          <View style={styles.resumoTexto}>
            <Texto variante="label">
              {servicosSelecionados.length} serviço(s) • {duracaoTotal} min
            </Texto>
            <Texto variante="subtitulo" negrito>
              {formatarPreco(precoTotal)}
            </Texto>
          </View>
          <Botao
            titulo="Continuar"
            onPress={onAvancar}
            tamanho="medio"
          />
        </Animated.View>
      )}
    </Animated.View>
  );
}

/**
 * Componente de seleção de barbeiro
 */
function EtapaBarbeiro({
  barbeiroSelecionado,
  onSelectBarbeiro,
  onAvancar,
}: {
  barbeiroSelecionado: string | null;
  onSelectBarbeiro: (id: string) => void;
  onAvancar: () => void;
}) {
  const { tema } = useTema();
  const cores = Cores[tema];
  const { barbeiros, carregando } = useBarbeiros();

  if (carregando) {
    return <Carregando mensagem="Carregando barbeiros..." telaCheia />;
  }

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.etapaContainer}
    >
      <Texto variante="subtitulo" style={styles.etapaTitulo}>
        Escolha o profissional
      </Texto>
      <Texto variante="corpo" secundario style={styles.etapaSubtitulo}>
        Selecione o barbeiro de sua preferência
      </Texto>

      <ScrollView showsVerticalScrollIndicator={false}>
        {barbeiros.map((barbeiro, index) => {
          const selecionado = barbeiroSelecionado === barbeiro.id;

          return (
            <Animated.View
              key={barbeiro.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelectBarbeiro(barbeiro.id);
                }}
                activeOpacity={0.7}
              >
                <Cartao
                  estilo={[
                    styles.cartaoBarbeiro,
                    selecionado && {
                      borderColor: cores.sucesso,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <View style={styles.barbeiroAvatar}>
                    <Texto variante="titulo">
                      {barbeiro.nome.charAt(0).toUpperCase()}
                    </Texto>
                  </View>
                  <View style={styles.barbeiroInfo}>
                    <Texto variante="label" negrito>
                      {barbeiro.nome}
                    </Texto>
                    {barbeiro.especialidades && (
                      <Texto variante="pequeno" secundario>
                        {barbeiro.especialidades.join(" • ")}
                      </Texto>
                    )}
                  </View>
                  {selecionado && (
                    <View
                      style={[
                        styles.checkMark,
                        { backgroundColor: cores.sucesso },
                      ]}
                    >
                      <IconeCheck tamanho={14} cor="#fff" />
                    </View>
                  )}
                </Cartao>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {barbeiroSelecionado && (
        <Animated.View entering={FadeInUp.springify()} style={styles.botaoFixo}>
          <Botao titulo="Continuar" onPress={onAvancar} larguraTotal />
        </Animated.View>
      )}
    </Animated.View>
  );
}

/**
 * Componente de seleção de data
 */
function EtapaData({
  dataSelecionada,
  onSelectData,
  onAvancar,
}: {
  dataSelecionada: Date | null;
  onSelectData: (data: Date) => void;
  onAvancar: () => void;
}) {
  const { tema } = useTema();
  const cores = Cores[tema];

  // Gerar próximos 14 dias
  const datasDisponiveis = useMemo(() => {
    const hoje = new Date();
    return Array.from({ length: 14 }, (_, i) => addDays(hoje, i));
  }, []);

  const formatarDataCurta = (data: Date) => {
    if (isToday(data)) return "Hoje";
    if (isTomorrow(data)) return "Amanhã";
    return format(data, "EEE, dd", { locale: ptBR });
  };

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.etapaContainer}
    >
      <Texto variante="subtitulo" style={styles.etapaTitulo}>
        Escolha a data
      </Texto>
      <Texto variante="corpo" secundario style={styles.etapaSubtitulo}>
        Selecione o melhor dia para você
      </Texto>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridDatas}>
          {datasDisponiveis.map((data, index) => {
            const selecionada =
              dataSelecionada &&
              format(data, "yyyy-MM-dd") ===
                format(dataSelecionada, "yyyy-MM-dd");

            return (
              <Animated.View
                key={data.toISOString()}
                entering={FadeInDown.delay(index * 30)}
                style={styles.dataItem}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onSelectData(data);
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.botaoData,
                    {
                      backgroundColor: selecionada
                        ? cores.botaoPrimario
                        : cores.cartao,
                      borderColor: selecionada ? cores.botaoPrimario : cores.borda,
                    },
                  ]}
                >
                  <Texto
                    variante="pequeno"
                    cor={selecionada ? cores.botaoPrimarioTexto : cores.textoSecundario}
                  >
                    {format(data, "EEE", { locale: ptBR }).toUpperCase()}
                  </Texto>
                  <Texto
                    variante="titulo"
                    cor={selecionada ? cores.botaoPrimarioTexto : cores.texto}
                    negrito
                  >
                    {format(data, "dd")}
                  </Texto>
                  <Texto
                    variante="pequeno"
                    cor={selecionada ? cores.botaoPrimarioTexto : cores.textoSecundario}
                  >
                    {format(data, "MMM", { locale: ptBR })}
                  </Texto>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {dataSelecionada && (
        <Animated.View entering={FadeInUp.springify()} style={styles.botaoFixo}>
          <Botao titulo="Continuar" onPress={onAvancar} larguraTotal />
        </Animated.View>
      )}
    </Animated.View>
  );
}

/**
 * Componente de seleção de horário
 */
function EtapaHorario({
  dataSelecionada,
  barbeiroId,
  servicosSelecionados,
  horarioSelecionado,
  onSelectHorario,
  onAvancar,
}: {
  dataSelecionada: Date;
  barbeiroId: string;
  servicosSelecionados: string[];
  horarioSelecionado: string | null;
  onSelectHorario: (hora: string) => void;
  onAvancar: () => void;
}) {
  const { tema } = useTema();
  const cores = Cores[tema];
  const { servicos } = useServicos();
  const { configuracao } = useConfiguracaoBarbearia();
  const [horarios, setHorarios] = useState<HorarioComStatus[]>([]);
  const [carregando, setCarregando] = useState(true);

  const duracaoTotal = useMemo(() => {
    return servicos
      .filter((s) => servicosSelecionados.includes(s.id))
      .reduce((acc, s) => acc + s.duracao, 0);
  }, [servicos, servicosSelecionados]);

  // Buscar horários disponíveis
  React.useEffect(() => {
    async function buscarHorarios() {
      setCarregando(true);

      try {
        const dataStr = format(dataSelecionada, "yyyy-MM-dd");

        // Buscar agendamentos do dia
        const { data: agendamentos } = await supabase
          .from("agendamentos")
          .select("hora_inicio, hora_fim, status")
          .eq("data", dataStr)
          .eq("barbeiro_id", barbeiroId)
          .in("status", ["pendente", "confirmado"]);

        // Gerar horários com status
        const config = {
          inicio: configuracao?.horario_abertura || "09:00",
          fim: configuracao?.horario_fechamento || "19:00",
          intervaloAlmocoInicio: configuracao?.intervalo_almoco_inicio,
          intervaloAlmocoFim: configuracao?.intervalo_almoco_fim,
          intervaloHorarios: configuracao?.intervalo_horarios || 30,
        };

        const horariosGerados = gerarHorariosDisponiveis(
          config,
          agendamentos || [],
          duracaoTotal,
          dataSelecionada
        );

        setHorarios(horariosGerados);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      } finally {
        setCarregando(false);
      }
    }

    buscarHorarios();
  }, [dataSelecionada, barbeiroId, duracaoTotal, configuracao]);

  if (carregando) {
    return <Carregando mensagem="Carregando horários disponíveis..." telaCheia />;
  }

  const horariosDisponiveis = horarios.filter((h) => h.disponivel);

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.etapaContainer}
    >
      <Texto variante="subtitulo" style={styles.etapaTitulo}>
        Escolha o horário
      </Texto>
      <Texto variante="corpo" secundario style={styles.etapaSubtitulo}>
        {format(dataSelecionada, "EEEE, dd 'de' MMMM", { locale: ptBR })}
      </Texto>

      {horariosDisponiveis.length === 0 ? (
        <View style={styles.semHorarios}>
          <IconeCalendario tamanho={48} cor={cores.textoSecundario} />
          <Texto variante="corpo" secundario centralizado style={{ marginTop: 16 }}>
            Nenhum horário disponível para esta data.{"\n"}Tente outra data.
          </Texto>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.gridHorarios}>
            {horariosDisponiveis.map((horario, index) => {
              const selecionado = horarioSelecionado === horario.hora;

              return (
                <Animated.View
                  key={horario.hora}
                  entering={FadeInRight.delay(index * 30)}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onSelectHorario(horario.hora);
                    }}
                    activeOpacity={0.7}
                    style={[
                      styles.botaoHorario,
                      {
                        backgroundColor: selecionado
                          ? cores.botaoPrimario
                          : cores.cartao,
                        borderColor: selecionado
                          ? cores.botaoPrimario
                          : cores.borda,
                      },
                    ]}
                  >
                    <IconeRelogio
                      tamanho={16}
                      cor={selecionado ? cores.botaoPrimarioTexto : cores.texto}
                    />
                    <Texto
                      variante="label"
                      negrito
                      cor={selecionado ? cores.botaoPrimarioTexto : cores.texto}
                    >
                      {horario.hora}
                    </Texto>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {horarioSelecionado && (
        <Animated.View entering={FadeInUp.springify()} style={styles.botaoFixo}>
          <Botao titulo="Continuar" onPress={onAvancar} larguraTotal />
        </Animated.View>
      )}
    </Animated.View>
  );
}

/**
 * Componente de confirmação
 */
function EtapaConfirmacao({
  servicosSelecionados,
  barbeiroId,
  dataSelecionada,
  horarioSelecionado,
  onConfirmar,
  carregandoConfirmacao,
}: {
  servicosSelecionados: string[];
  barbeiroId: string;
  dataSelecionada: Date;
  horarioSelecionado: string;
  onConfirmar: (nome: string, telefone: string) => void;
  carregandoConfirmacao: boolean;
}) {
  const { tema } = useTema();
  const cores = Cores[tema];
  const { servicos } = useServicos();
  const { barbeiros } = useBarbeiros();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const servicosEscolhidos = servicos.filter((s) =>
    servicosSelecionados.includes(s.id)
  );
  const barbeiro = barbeiros.find((b) => b.id === barbeiroId);

  const precoTotal = servicosEscolhidos.reduce((acc, s) => acc + s.preco, 0);
  const duracaoTotal = servicosEscolhidos.reduce((acc, s) => acc + s.duracao, 0);

  const podeConfirmar = nome.trim().length >= 2 && telefone.length >= 10;

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

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.etapaContainer}
    >
      <Texto variante="subtitulo" style={styles.etapaTitulo}>
        Confirme seu agendamento
      </Texto>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resumo */}
        <Cartao estilo={styles.cartaoResumo}>
          <View style={styles.resumoItem}>
            <IconeCalendario tamanho={20} cor={cores.textoSecundario} />
            <Texto variante="corpo">
              {format(dataSelecionada, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </Texto>
          </View>

          <View style={styles.resumoItem}>
            <IconeRelogio tamanho={20} cor={cores.textoSecundario} />
            <Texto variante="corpo">
              {horarioSelecionado} • {duracaoTotal} min
            </Texto>
          </View>

          <View style={styles.resumoItem}>
            <IconeTesoura tamanho={20} cor={cores.textoSecundario} />
            <Texto variante="corpo">{barbeiro?.nome}</Texto>
          </View>

          <View style={[styles.divisor, { backgroundColor: cores.borda }]} />

          {servicosEscolhidos.map((servico) => (
            <View key={servico.id} style={styles.servicoResumo}>
              <Texto variante="corpo">{servico.nome}</Texto>
              <Texto variante="corpo" negrito>
                {formatarPreco(servico.preco)}
              </Texto>
            </View>
          ))}

          <View style={[styles.divisor, { backgroundColor: cores.borda }]} />

          <View style={styles.totalResumo}>
            <Texto variante="label" negrito>
              Total
            </Texto>
            <Texto variante="subtitulo" negrito>
              {formatarPreco(precoTotal)}
            </Texto>
          </View>
        </Cartao>

        {/* Dados do cliente */}
        <Texto variante="label" negrito style={styles.labelDados}>
          Seus dados
        </Texto>

        <CampoTexto
          label="Nome"
          placeholder="Seu nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          obrigatorio
        />

        <CampoTexto
          label="Telefone"
          placeholder="(86) 99999-9999"
          value={telefone}
          onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
          keyboardType="phone-pad"
          obrigatorio
        />
      </ScrollView>

      <Animated.View entering={FadeInUp.springify()} style={styles.botaoFixo}>
        <Botao
          titulo="Confirmar Agendamento"
          onPress={() => onConfirmar(nome, telefone)}
          larguraTotal
          carregando={carregandoConfirmacao}
          desabilitado={!podeConfirmar}
        />
      </Animated.View>
    </Animated.View>
  );
}

/**
 * Tela Principal de Agendamento
 */
export default function TelaAgendamento() {
  const { tema } = useTema();
  const cores = Cores[tema];

  // Estados do fluxo
  const [etapa, setEtapa] = useState<EtapaAgendamento>("servicos");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState<string | null>(
    null
  );
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
    null
  );
  const [carregandoConfirmacao, setCarregandoConfirmacao] = useState(false);
  const [agendamentoConcluido, setAgendamentoConcluido] = useState(false);

  const toggleServico = useCallback((id: string) => {
    setServicosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const avancarEtapa = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (etapa) {
      case "servicos":
        setEtapa("barbeiro");
        break;
      case "barbeiro":
        setEtapa("data");
        break;
      case "data":
        setEtapa("horario");
        break;
      case "horario":
        setEtapa("confirmacao");
        break;
    }
  }, [etapa]);

  const voltarEtapa = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (etapa) {
      case "barbeiro":
        setEtapa("servicos");
        break;
      case "data":
        setEtapa("barbeiro");
        break;
      case "horario":
        setEtapa("data");
        break;
      case "confirmacao":
        setEtapa("horario");
        break;
    }
  }, [etapa]);

  const confirmarAgendamento = async (nome: string, telefone: string) => {
    if (!barbeiroSelecionado || !dataSelecionada || !horarioSelecionado) return;

    setCarregandoConfirmacao(true);

    try {
      // Buscar ou criar cliente
      const telefoneNumeros = telefone.replace(/\D/g, "");

      let { data: cliente } = await supabase
        .from("clientes")
        .select("id")
        .eq("telefone", telefoneNumeros)
        .single();

      if (!cliente) {
        const { data: novoCliente, error: erroCliente } = await supabase
          .from("clientes")
          .insert({ nome, telefone: telefoneNumeros })
          .select("id")
          .single();

        if (erroCliente) throw erroCliente;
        cliente = novoCliente;
      }

      // Calcular valores
      const { data: servicos } = await supabase
        .from("servicos")
        .select("preco, duracao")
        .in("id", servicosSelecionados);

      const valorTotal = servicos?.reduce((acc, s) => acc + s.preco, 0) || 0;
      const duracaoTotal = servicos?.reduce((acc, s) => acc + s.duracao, 0) || 0;

      // Calcular hora fim
      const [horas, minutos] = horarioSelecionado.split(":").map(Number);
      const inicio = new Date(dataSelecionada);
      inicio.setHours(horas, minutos, 0, 0);
      const fim = new Date(inicio.getTime() + duracaoTotal * 60000);
      const horaFim = format(fim, "HH:mm");

      // Criar agendamento
      const { error: erroAgendamento } = await supabase
        .from("agendamentos")
        .insert({
          cliente_id: cliente.id,
          barbeiro_id: barbeiroSelecionado,
          data: format(dataSelecionada, "yyyy-MM-dd"),
          hora_inicio: horarioSelecionado,
          hora_fim: horaFim,
          valor_total: valorTotal,
          status: "pendente",
        });

      if (erroAgendamento) throw erroAgendamento;

      // Inserir serviços do agendamento (se houver tabela de relacionamento)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAgendamentoConcluido(true);
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Erro",
        "Não foi possível confirmar o agendamento. Tente novamente."
      );
    } finally {
      setCarregandoConfirmacao(false);
    }
  };

  const reiniciarAgendamento = () => {
    setEtapa("servicos");
    setServicosSelecionados([]);
    setBarbeiroSelecionado(null);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setAgendamentoConcluido(false);
  };

  // Tela de sucesso
  if (agendamentoConcluido) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
        <View style={styles.sucessoContainer}>
          <Animated.View
            entering={FadeInDown.springify()}
            style={[styles.iconeSucesso, { backgroundColor: cores.sucesso }]}
          >
            <IconeCheck tamanho={48} cor="#fff" />
          </Animated.View>

          <Texto variante="titulo" centralizado style={{ marginTop: 24 }}>
            Agendamento Confirmado!
          </Texto>

          <Texto
            variante="corpo"
            secundario
            centralizado
            style={{ marginTop: 12, maxWidth: 280 }}
          >
            Seu horário foi reservado com sucesso. Aguarde a confirmação do
            barbeiro.
          </Texto>

          <View style={{ width: "100%", marginTop: 32 }}>
            <Botao
              titulo="Fazer Novo Agendamento"
              onPress={reiniciarAgendamento}
              larguraTotal
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Indicador de progresso
  const etapas: EtapaAgendamento[] = [
    "servicos",
    "barbeiro",
    "data",
    "horario",
    "confirmacao",
  ];
  const indiceEtapa = etapas.indexOf(etapa);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
      {/* Header */}
      <View style={styles.header}>
        {etapa !== "servicos" && (
          <TouchableOpacity onPress={voltarEtapa} style={styles.botaoVoltar}>
            <Texto variante="corpo">← Voltar</Texto>
          </TouchableOpacity>
        )}
        <Texto variante="subtitulo" negrito>
          Agendamento
        </Texto>
        <View style={{ width: 60 }} />
      </View>

      {/* Progresso */}
      <View style={styles.progressoContainer}>
        {etapas.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressoBarra,
              {
                backgroundColor:
                  index <= indiceEtapa ? cores.sucesso : cores.borda,
              },
            ]}
          />
        ))}
      </View>

      {/* Conteúdo da etapa */}
      {etapa === "servicos" && (
        <EtapaServicos
          servicosSelecionados={servicosSelecionados}
          onToggleServico={toggleServico}
          onAvancar={avancarEtapa}
        />
      )}

      {etapa === "barbeiro" && (
        <EtapaBarbeiro
          barbeiroSelecionado={barbeiroSelecionado}
          onSelectBarbeiro={setBarbeiroSelecionado}
          onAvancar={avancarEtapa}
        />
      )}

      {etapa === "data" && (
        <EtapaData
          dataSelecionada={dataSelecionada}
          onSelectData={setDataSelecionada}
          onAvancar={avancarEtapa}
        />
      )}

      {etapa === "horario" && dataSelecionada && barbeiroSelecionado && (
        <EtapaHorario
          dataSelecionada={dataSelecionada}
          barbeiroId={barbeiroSelecionado}
          servicosSelecionados={servicosSelecionados}
          horarioSelecionado={horarioSelecionado}
          onSelectHorario={setHorarioSelecionado}
          onAvancar={avancarEtapa}
        />
      )}

      {etapa === "confirmacao" &&
        dataSelecionada &&
        barbeiroSelecionado &&
        horarioSelecionado && (
          <EtapaConfirmacao
            servicosSelecionados={servicosSelecionados}
            barbeiroId={barbeiroSelecionado}
            dataSelecionada={dataSelecionada}
            horarioSelecionado={horarioSelecionado}
            onConfirmar={confirmarAgendamento}
            carregandoConfirmacao={carregandoConfirmacao}
          />
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
  botaoVoltar: {
    width: 60,
  },
  progressoContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 16,
  },
  progressoBarra: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  etapaContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  etapaTitulo: {
    marginBottom: 8,
  },
  etapaSubtitulo: {
    marginBottom: 24,
  },
  cartaoServico: {
    marginBottom: 12,
  },
  servicoInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  servicoIcone: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  servicoDetalhes: {
    flex: 1,
  },
  servicoPrecoCheck: {
    alignItems: "flex-end",
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  resumoFixo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  resumoTexto: {
    flex: 1,
  },
  botaoFixo: {
    paddingVertical: 16,
  },
  cartaoBarbeiro: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  barbeiroAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  barbeiroInfo: {
    flex: 1,
  },
  gridDatas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dataItem: {
    width: (width - 60) / 4,
  },
  botaoData: {
    aspectRatio: 0.85,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  gridHorarios: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  botaoHorario: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  semHorarios: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  cartaoResumo: {
    marginBottom: 24,
  },
  resumoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  divisor: {
    height: 1,
    marginVertical: 12,
  },
  servicoResumo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalResumo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelDados: {
    marginBottom: 16,
  },
  sucessoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconeSucesso: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
