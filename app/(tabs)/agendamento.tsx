/**
 * Tela de Agendamento - BarbeariaBR99
 * Fluxo completo de agendamento de serviços
 */

import {
  Botao,
  CampoTexto,
  Carregando,
  Cartao,
  IconeCalendario,
  IconeCheck,
  IconeRelogio,
  IconeTesoura,
  Texto,
} from "@/components/ui";
import Cores from "@/constants/Colors";
import { useTema } from "@/contexts/TemaContext";
import { useBarbeiros } from "@/hooks/useBarbeiros";
import { useConfiguracaoBarbearia } from "@/hooks/useConfiguracaoBarbearia";
import { useServicos } from "@/hooks/useServicos";
import {
  formatarPreco,
  gerarTodosHorarios
} from "@/lib/horarios";
import { supabase } from "@/lib/supabase";
import type { HorarioComStatus } from "@/types";
import { addDays, format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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
                  estilo={
                    selecionado
                      ? { ...styles.cartaoServico, borderColor: cores.sucesso, borderWidth: 2 }
                      : styles.cartaoServico
                  }
                >
                  <View style={styles.servicoInfo}>
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
                  estilo={
                    selecionado
                      ? { ...styles.cartaoBarbeiro, borderColor: cores.sucesso, borderWidth: 2 }
                      : styles.cartaoBarbeiro
                  }
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
 * Componente de seleção de data - Design sofisticado com filtro de dias de funcionamento
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
  const { configuracao } = useConfiguracaoBarbearia();

  // Mapa de dias da semana
  const mapaDias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  
  // Dias de funcionamento da barbearia
  const diasFuncionamento = configuracao?.dias_funcionamento || ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  // Gerar próximos 21 dias
  const todasDatas = useMemo(() => {
    const hoje = new Date();
    return Array.from({ length: 21 }, (_, i) => addDays(hoje, i));
  }, []);

  // Verificar se um dia está disponível (barbearia abre)
  const diaDisponivel = useCallback((data: Date) => {
    const diaSemana = mapaDias[data.getDay()];
    return diasFuncionamento.includes(diaSemana);
  }, [diasFuncionamento]);

  // Agrupar por semana para melhor visualização
  const semanas = useMemo(() => {
    const grupos: Date[][] = [];
    let semanaAtual: Date[] = [];
    
    todasDatas.forEach((data, index) => {
      semanaAtual.push(data);
      if (semanaAtual.length === 7 || index === todasDatas.length - 1) {
        grupos.push(semanaAtual);
        semanaAtual = [];
      }
    });
    
    return grupos;
  }, [todasDatas]);

  const formatarDataCompleta = (data: Date) => {
    if (isToday(data)) return "Hoje, " + format(data, "dd 'de' MMMM", { locale: ptBR });
    if (isTomorrow(data)) return "Amanhã, " + format(data, "dd 'de' MMMM", { locale: ptBR });
    return format(data, "EEEE, dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={styles.etapaContainer}
    >
      <Texto variante="subtitulo" style={styles.etapaTitulo}>
        Escolha a Data
      </Texto>
      <Texto variante="corpo" secundario style={styles.etapaSubtitulo}>
        Selecione o melhor dia para você
      </Texto>

      {/* Data selecionada destacada */}
      {dataSelecionada && (
        <Animated.View 
          entering={FadeInDown.springify()}
          style={[styles.dataSelecionadaCard, { backgroundColor: cores.destaque }]}
        >
          <View style={styles.dataSelecionadaIcone}>
            <IconeCalendario tamanho={24} cor="#fff" />
          </View>
          <View style={styles.dataSelecionadaInfo}>
            <Texto variante="pequeno" cor="rgba(255,255,255,0.7)">Data selecionada</Texto>
            <Texto variante="subtitulo" cor="#fff" negrito>
              {formatarDataCompleta(dataSelecionada)}
            </Texto>
          </View>
        </Animated.View>
      )}

      {/* Calendário visual por semanas */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.calendarioScroll}
        contentContainerStyle={styles.calendarioContent}
      >
        {/* Header dos dias da semana */}
        <View style={styles.diasSemanaHeader}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, idx) => {
            const diaAbrev = mapaDias[idx];
            const aberto = diasFuncionamento.includes(diaAbrev);
            return (
              <View key={dia} style={styles.diaSemanaItem}>
                <Texto 
                  variante="pequeno" 
                  cor={aberto ? cores.texto : cores.textoSecundario} 
                  style={{ textAlign: 'center', opacity: aberto ? 1 : 0.4 }}
                >
                  {dia}
                </Texto>
              </View>
            );
          })}
        </View>

        {/* Grid de datas */}
        {semanas.map((semana, semanaIndex) => (
          <View key={semanaIndex} style={styles.semanaRow}>
            {/* Preencher espaços vazios no início */}
            {semanaIndex === 0 && Array.from({ length: todasDatas[0].getDay() }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.diaVazio} />
            ))}
            
            {semana.map((data, index) => {
              const selecionada = dataSelecionada && 
                format(data, "yyyy-MM-dd") === format(dataSelecionada, "yyyy-MM-dd");
              const ehHoje = isToday(data);
              const disponivel = diaDisponivel(data);

              return (
                <Animated.View
                  key={data.toISOString()}
                  entering={FadeInDown.delay((semanaIndex * 7 + index) * 15)}
                  style={styles.diaItem}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (disponivel) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onSelectData(data);
                      }
                    }}
                    activeOpacity={disponivel ? 0.7 : 1}
                    disabled={!disponivel}
                    style={[
                      styles.diaBotao,
                      selecionada && styles.diaSelecionado,
                      ehHoje && !selecionada && disponivel && styles.diaHoje,
                      !disponivel && styles.diaIndisponivel,
                      !selecionada && !ehHoje && disponivel && { backgroundColor: cores.cartao, borderColor: cores.borda },
                    ]}
                  >
                    <Texto
                      variante="label"
                      negrito
                      cor={
                        !disponivel 
                          ? cores.textoSecundario 
                          : selecionada 
                          ? "#fff" 
                          : ehHoje 
                          ? cores.destaque 
                          : cores.texto
                      }
                      style={!disponivel ? { opacity: 0.4 } : undefined}
                    >
                      {format(data, "dd")}
                    </Texto>
                    <Texto
                      variante="pequeno"
                      cor={selecionada ? "rgba(255,255,255,0.8)" : cores.textoSecundario}
                      style={{ fontSize: 10, opacity: disponivel ? 1 : 0.4 }}
                    >
                      {format(data, "MMM", { locale: ptBR })}
                    </Texto>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        ))}
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

  // Buscar horários disponíveis em tempo real (mesmo formato do site web)
  React.useEffect(() => {
    async function buscarHorarios() {
      setCarregando(true);

      try {
        const dataStr = format(dataSelecionada, "yyyy-MM-dd");
        
        // Criar datas em UTC para evitar problemas de timezone (igual ao site web)
        const [ano, mes, dia] = dataStr.split('-').map(Number);
        const inicioDia = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0, 0));
        const fimDia = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999));

        console.log('🔍 Buscando horários:', { dataStr, barbeiroId });

        // Buscar agendamentos do dia usando data_hora (timestamp)
        const { data: agendamentos, error: errorAg } = await supabase
          .from("agendamentos")
          .select("data_hora, servico_id, status, servicos(duracao)")
          .gte("data_hora", inicioDia.toISOString())
          .lte("data_hora", fimDia.toISOString())
          .eq("barbeiro_id", barbeiroId)
          .neq("status", "cancelado");

        if (errorAg) {
          console.error("❌ Erro ao buscar agendamentos:", errorAg);
        }

        console.log('✅ Agendamentos encontrados:', agendamentos?.length || 0);

        // Converter agendamentos para o formato {horario, duracao} (igual ao site web)
        const ocupadosAgendamentos = (agendamentos || []).map((ag: any) => {
          const horario = format(new Date(ag.data_hora), "HH:mm");
          const duracao = ag.servicos?.duracao || 30;
          console.log(`🔴 Horário ocupado: ${horario} (${duracao} min)`);
          return { horario, duracao };
        });

        // Buscar horários bloqueados do dia
        const { data: bloqueios, error: errorBloq } = await supabase
          .from("horarios_bloqueados")
          .select("*")
          .eq("data", dataStr)
          .or(`barbeiro_id.is.null,barbeiro_id.eq.${barbeiroId}`);

        if (errorBloq) {
          console.error("❌ Erro ao buscar bloqueios:", errorBloq);
        }

        console.log('🔒 Bloqueios encontrados:', bloqueios?.length || 0);

        // Converter bloqueios para o formato {horario, duracao} (igual ao site web)
        const ocupadosBloqueios: Array<{horario: string, duracao: number}> = [];
        if (bloqueios) {
          bloqueios.forEach((bloqueio: any) => {
            const horaInicioStr = bloqueio.horario_inicio?.substring(0, 5) || "00:00";
            const horaFimStr = bloqueio.horario_fim?.substring(0, 5) || "00:00";
            
            const dataBase = new Date(2000, 0, 1);
            const [hI, mI] = horaInicioStr.split(':').map(Number);
            const [hF, mF] = horaFimStr.split(':').map(Number);
            
            const inicioBloqueio = new Date(dataBase);
            inicioBloqueio.setHours(hI, mI, 0, 0);
            
            const fimBloqueio = new Date(dataBase);
            fimBloqueio.setHours(hF, mF, 0, 0);
            
            // Se o bloqueio cobre múltiplos intervalos de 20min, criar entradas para cada um
            let horarioAtual = new Date(inicioBloqueio);
            while (horarioAtual < fimBloqueio) {
              const horarioFormatado = format(horarioAtual, "HH:mm");
              const tempoRestante = Math.ceil((fimBloqueio.getTime() - horarioAtual.getTime()) / 60000);
              const duracaoBloqueio = Math.min(20, tempoRestante);
              
              ocupadosBloqueios.push({
                horario: horarioFormatado,
                duracao: duracaoBloqueio
              });
              
              // Avançar 20 minutos
              horarioAtual = new Date(horarioAtual.getTime() + 20 * 60000);
            }
            
            console.log(`🔒 Bloqueio: ${horaInicioStr} - ${horaFimStr}`);
          });
        }

        // Combinar agendamentos e bloqueios
        const todosOcupados = [...ocupadosAgendamentos, ...ocupadosBloqueios];
        console.log('📊 Total ocupados:', todosOcupados.length);

        // Normalizar horários do Supabase (remover segundos se houver)
        const normalizarHorario = (horario: string | null | undefined): string | null => {
          if (!horario) return null;
          if (horario.length === 8) return horario.substring(0, 5);
          return horario;
        };

        // Gerar horários com status usando gerarTodosHorarios (igual ao site web)
        const config = {
          inicio: normalizarHorario(configuracao?.horario_abertura) || "08:00",
          fim: normalizarHorario(configuracao?.horario_fechamento) || "19:00",
          intervaloAlmocoInicio: normalizarHorario(configuracao?.intervalo_almoco_inicio),
          intervaloAlmocoFim: normalizarHorario(configuracao?.intervalo_almoco_fim),
          intervaloHorarios: configuracao?.intervalo_horarios || 20,
        };

        console.log('⏰ Config horários:', config);

        // gerarTodosHorarios retorna { horario, disponivel } mas o app usa { hora, disponivel }
        const todosHorariosGerados = gerarTodosHorarios(duracaoTotal, todosOcupados, config) as unknown as Array<{ horario: string; disponivel: boolean }>;
        console.log('📋 Horários gerados:', todosHorariosGerados.length);
        
        // Converter para o formato esperado pelo componente e filtrar horários passados se for hoje
        const agora = new Date();
        const ehHoje = format(dataSelecionada, "yyyy-MM-dd") === format(agora, "yyyy-MM-dd");
        
        // Filtrar horários passados se for hoje e converter para formato do app
        const horariosFinais: HorarioComStatus[] = [];
        
        for (const h of todosHorariosGerados) {
          // Se for hoje, verificar se o horário já passou
          if (ehHoje) {
            const [horas, minutos] = h.horario.split(":").map(Number);
            const horarioDate = new Date(dataSelecionada);
            horarioDate.setHours(horas, minutos, 0, 0);
            if (horarioDate <= agora) continue;
          }
          
          // Converter de {horario, disponivel} para {hora, disponivel}
          horariosFinais.push({
            hora: h.horario,
            disponivel: h.disponivel,
          });
        }

        console.log('✅ Horários disponíveis:', horariosFinais.filter(h => h.disponivel).length);
        setHorarios(horariosFinais);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      } finally {
        setCarregando(false);
      }
    }

    buscarHorarios();

    // Subscription para atualizações em tempo real (igual ao site web)
    const canalAgendamentos = supabase
      .channel(`horarios-${barbeiroId}-${format(dataSelecionada, "yyyy-MM-dd")}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "agendamentos",
          filter: `barbeiro_id=eq.${barbeiroId}`,
        },
        () => {
          console.log("🔄 Agendamentos atualizados, recarregando horários...");
          buscarHorarios();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "horarios_bloqueados",
        },
        () => {
          console.log("🔄 Bloqueios atualizados, recarregando horários...");
          buscarHorarios();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalAgendamentos);
    };
  }, [dataSelecionada, barbeiroId, duracaoTotal, configuracao]);

  if (carregando) {
    return <Carregando mensagem="Carregando horários disponíveis..." telaCheia />;
  }

  // Contar horários ocupados para exibir
  const horariosOcupados = horarios.filter((h) => !h.disponivel).length;

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

      {horarios.length === 0 ? (
        <View style={styles.semHorarios}>
          <IconeCalendario tamanho={48} cor={cores.textoSecundario} />
          <Texto variante="corpo" secundario centralizado style={{ marginTop: 16 }}>
            Nenhum horário disponível para esta data.{"\n"}Tente outra data.
          </Texto>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Indicador de horários ocupados */}
          {horariosOcupados > 0 && (
            <View style={styles.indicadorOcupados}>
              <View style={styles.bolinhaVermelha} />
              <Texto variante="pequeno" secundario>
                {horariosOcupados} horário{horariosOcupados > 1 ? 's' : ''} ocupado{horariosOcupados > 1 ? 's' : ''}
              </Texto>
            </View>
          )}

          {/* Grid de horários - mostra TODOS (disponíveis e ocupados) */}
          <View style={styles.gridHorarios}>
            {horarios.map((horario, index) => {
              const selecionado = horarioSelecionado === horario.hora;
              const ocupado = !horario.disponivel;

              return (
                <Animated.View
                  key={horario.hora}
                  entering={FadeInDown.delay(index * 20)}
                  style={styles.horarioItem}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (!ocupado) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onSelectHorario(horario.hora);
                      }
                    }}
                    activeOpacity={ocupado ? 1 : 0.7}
                    disabled={ocupado}
                    style={[
                      styles.botaoHorario,
                      ocupado
                        ? styles.horarioOcupado
                        : selecionado
                        ? styles.horarioSelecionado
                        : { backgroundColor: cores.cartao, borderColor: cores.borda },
                    ]}
                  >
                    {/* Bolinha vermelha para ocupados */}
                    {ocupado && (
                      <View style={styles.bolinhaOcupado} />
                    )}
                    
                    <Texto
                      variante="label"
                      negrito
                      cor={
                        ocupado
                          ? "#ef4444"
                          : selecionado
                          ? cores.botaoPrimarioTexto
                          : cores.texto
                      }
                      style={ocupado ? styles.textoRiscado : undefined}
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
      const { data: servicosData } = await supabase
        .from("servicos")
        .select("id, preco, duracao")
        .in("id", servicosSelecionados);

      const valorTotal = servicosData?.reduce((acc, s) => acc + s.preco, 0) || 0;

      // Criar data_hora combinada (igual ao site web)
      const [horas, minutos] = horarioSelecionado.split(":").map(Number);
      const dataHora = new Date(dataSelecionada);
      dataHora.setHours(horas, minutos, 0, 0);

      // Usar primeiro serviço selecionado (a tabela usa servico_id singular)
      const primeiroServicoId = servicosSelecionados[0];

      // Criar agendamento usando data_hora (timestamp) - formato correto da tabela
      const { error: erroAgendamento } = await supabase
        .from("agendamentos")
        .insert({
          cliente_id: cliente.id,
          barbeiro_id: barbeiroSelecionado,
          servico_id: primeiroServicoId,
          data_hora: dataHora.toISOString(),
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
      <SafeAreaView 
        style={[styles.container, { backgroundColor: cores.fundo }]}
        edges={["top"]}
      >
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
    <SafeAreaView 
      style={[styles.container, { backgroundColor: cores.fundo }]}
      edges={["top"]}
    >
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
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 4,
  },
  dataItem: {
    width: (width - 70) / 4,
    minWidth: 72,
    maxWidth: 90,
  },
  botaoData: {
    aspectRatio: 0.8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 8,
  },
  dataSelecionada: {
    backgroundColor: "#18181b",
    borderColor: "#18181b",
  },
  seletorDataContainer: {
    marginBottom: 8,
  },
  labelData: {
    marginBottom: 8,
  },
  dropdownData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  dropdownLista: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  // Estilos do calendário sofisticado
  dataSelecionadaCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dataSelecionadaIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dataSelecionadaInfo: {
    flex: 1,
  },
  calendarioScroll: {
    flex: 1,
  },
  calendarioContent: {
    paddingBottom: 100,
  },
  diasSemanaHeader: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  diaSemanaItem: {
    flex: 1,
    alignItems: "center",
  },
  semanaRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  diaVazio: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
  },
  diaItem: {
    flex: 1,
    margin: 4,
  },
  diaBotao: {
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  diaSelecionado: {
    backgroundColor: "#18181b",
    borderColor: "#18181b",
  },
  diaHoje: {
    borderColor: "#22c55e",
    borderWidth: 2,
  },
  diaIndisponivel: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.1)",
    opacity: 0.4,
  },
  gridHorarios: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 4,
    paddingBottom: 100,
  },
  horarioItem: {
    width: (width - 48) / 4,
    padding: 4,
  },
  botaoHorario: {
    aspectRatio: 1.3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 2,
    position: "relative",
  },
  horarioOcupado: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  horarioSelecionado: {
    backgroundColor: "#18181b",
    borderColor: "#18181b",
  },
  bolinhaOcupado: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    borderWidth: 2,
    borderColor: "#18181b",
  },
  textoRiscado: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  indicadorOcupados: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  bolinhaVermelha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
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
