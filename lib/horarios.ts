/**
 * Utilitários para cálculo de horários dinâmicos
 * Baseado no código do projeto web
 */

import { addMinutes, format, parse, isAfter, isBefore, isEqual } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { HorarioComStatus, DataDisponivel } from "@/types";

/**
 * Configuração padrão de horário de funcionamento
 */
export const HORARIO_FUNCIONAMENTO_PADRAO = {
  inicio: "09:00",
  fim: "19:00",
  intervaloMinimo: 5,
  intervaloAlmocoInicio: null as string | null,
  intervaloAlmocoFim: null as string | null,
};

/**
 * Interface para configurações de horário
 */
export interface ConfiguracaoHorario {
  inicio: string;
  fim: string;
  intervaloAlmocoInicio?: string | null;
  intervaloAlmocoFim?: string | null;
  intervaloHorarios?: number;
}

/**
 * Gera todos os horários possíveis com status (disponível ou ocupado)
 */
export function gerarTodosHorarios(
  duracaoServico: number,
  agendamentosOcupados: Array<{ horario: string; duracao: number }> = [],
  config: ConfiguracaoHorario = HORARIO_FUNCIONAMENTO_PADRAO
): HorarioComStatus[] {
  const horarios: HorarioComStatus[] = [];
  const dataBase = new Date(2000, 0, 1);

  const horaInicio = parse(config.inicio, "HH:mm", dataBase);
  const horaFim = parse(config.fim, "HH:mm", dataBase);

  let horarioAtual = horaInicio;

  // Intervalos de almoço (se configurados)
  let almocoInicio: Date | null = null;
  let almocoFim: Date | null = null;

  if (config.intervaloAlmocoInicio && config.intervaloAlmocoFim) {
    almocoInicio = parse(config.intervaloAlmocoInicio, "HH:mm", dataBase);
    almocoFim = parse(config.intervaloAlmocoFim, "HH:mm", dataBase);
  }

  // Intervalo entre horários (padrão 20 minutos)
  const intervalo = config.intervaloHorarios || 20;

  // Gerar todos os horários com o intervalo configurado
  while (isBefore(horarioAtual, horaFim)) {
    const horarioFormatado = format(horarioAtual, "HH:mm");
    const horarioTermino = addMinutes(horarioAtual, duracaoServico);

    // Verificar se o término não ultrapassa o horário de fechamento
    if (isBefore(horarioTermino, horaFim) || isEqual(horarioTermino, horaFim)) {
      // Verificar se está no intervalo de almoço
      let estaNoAlmoco = false;
      if (almocoInicio && almocoFim) {
        estaNoAlmoco =
          ((isAfter(horarioAtual, almocoInicio) ||
            isEqual(horarioAtual, almocoInicio)) &&
            isBefore(horarioAtual, almocoFim)) ||
          (isAfter(horarioTermino, almocoInicio) &&
            (isBefore(horarioTermino, almocoFim) ||
              isEqual(horarioTermino, almocoFim)));
      }

      // Verificar se conflita com agendamentos ocupados
      const temConflito = agendamentosOcupados.some((agendamento) => {
        const inicioOcupado = parse(agendamento.horario, "HH:mm", dataBase);
        const fimOcupado = addMinutes(inicioOcupado, agendamento.duracao);

        return (
          ((isAfter(horarioAtual, inicioOcupado) ||
            isEqual(horarioAtual, inicioOcupado)) &&
            isBefore(horarioAtual, fimOcupado)) ||
          (isAfter(horarioTermino, inicioOcupado) &&
            (isBefore(horarioTermino, fimOcupado) ||
              isEqual(horarioTermino, fimOcupado))) ||
          (isBefore(horarioAtual, inicioOcupado) &&
            isAfter(horarioTermino, fimOcupado))
        );
      });

      horarios.push({
        horario: horarioFormatado,
        disponivel: !temConflito && !estaNoAlmoco,
      });
    }

    horarioAtual = addMinutes(horarioAtual, intervalo);
  }

  return horarios;
}

/**
 * Gera horários disponíveis com status
 * Compatível com o formato do Supabase
 */
export function gerarHorariosDisponiveis(
  config: ConfiguracaoHorario,
  agendamentos: Array<{ hora_inicio: string; hora_fim: string; status: string }> = [],
  duracaoServico: number,
  dataSelecionada: Date
): HorarioComStatus[] {
  const horarios: HorarioComStatus[] = [];
  const dataBase = new Date(2000, 0, 1);
  const agora = new Date();

  const horaInicio = parse(config.inicio, "HH:mm", dataBase);
  const horaFim = parse(config.fim, "HH:mm", dataBase);

  let horarioAtual = horaInicio;

  // Intervalos de almoço (se configurados)
  let almocoInicio: Date | null = null;
  let almocoFim: Date | null = null;

  if (config.intervaloAlmocoInicio && config.intervaloAlmocoFim) {
    almocoInicio = parse(config.intervaloAlmocoInicio, "HH:mm", dataBase);
    almocoFim = parse(config.intervaloAlmocoFim, "HH:mm", dataBase);
  }

  // Intervalo entre horários (padrão 30 minutos)
  const intervalo = config.intervaloHorarios || 30;

  // Verificar se é hoje para filtrar horários passados
  const ehHoje = format(dataSelecionada, "yyyy-MM-dd") === format(agora, "yyyy-MM-dd");

  // Gerar todos os horários com o intervalo configurado
  while (isBefore(horarioAtual, horaFim)) {
    const horarioFormatado = format(horarioAtual, "HH:mm");
    const horarioTermino = addMinutes(horarioAtual, duracaoServico);

    // Se for hoje, ignorar horários passados
    if (ehHoje) {
      const [horas, minutos] = horarioFormatado.split(":").map(Number);
      const horarioDate = new Date(dataSelecionada);
      horarioDate.setHours(horas, minutos, 0, 0);
      
      if (isBefore(horarioDate, agora)) {
        horarioAtual = addMinutes(horarioAtual, intervalo);
        continue;
      }
    }

    // Verificar se o término não ultrapassa o horário de fechamento
    if (isBefore(horarioTermino, horaFim) || isEqual(horarioTermino, horaFim)) {
      // Verificar se está no intervalo de almoço
      let estaNoAlmoco = false;
      if (almocoInicio && almocoFim) {
        estaNoAlmoco =
          ((isAfter(horarioAtual, almocoInicio) ||
            isEqual(horarioAtual, almocoInicio)) &&
            isBefore(horarioAtual, almocoFim)) ||
          (isAfter(horarioTermino, almocoInicio) &&
            (isBefore(horarioTermino, almocoFim) ||
              isEqual(horarioTermino, almocoFim)));
      }

      // Verificar se conflita com agendamentos existentes
      const temConflito = agendamentos.some((ag) => {
        const inicioOcupado = parse(ag.hora_inicio, "HH:mm", dataBase);
        const fimOcupado = parse(ag.hora_fim, "HH:mm", dataBase);

        return (
          ((isAfter(horarioAtual, inicioOcupado) ||
            isEqual(horarioAtual, inicioOcupado)) &&
            isBefore(horarioAtual, fimOcupado)) ||
          (isAfter(horarioTermino, inicioOcupado) &&
            (isBefore(horarioTermino, fimOcupado) ||
              isEqual(horarioTermino, fimOcupado))) ||
          (isBefore(horarioAtual, inicioOcupado) &&
            isAfter(horarioTermino, fimOcupado))
        );
      });

      horarios.push({
        hora: horarioFormatado,
        disponivel: !temConflito && !estaNoAlmoco,
      });
    }

    horarioAtual = addMinutes(horarioAtual, intervalo);
  }

  return horarios;
}

/**
 * Calcula a duração total de múltiplos serviços
 */
export function calcularDuracaoTotal(duracoes: number[]): number {
  return duracoes.reduce((acc, d) => acc + d, 0);
}

/**
 * Valida se uma data está dentro do período permitido (hoje até 15 dias)
 */
export function validarDataPermitida(data: string): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataLimite = new Date(hoje);
  dataLimite.setDate(dataLimite.getDate() + 15);

  const dataSelecionada = parse(data, "yyyy-MM-dd", new Date());
  dataSelecionada.setHours(0, 0, 0, 0);

  return (
    (isAfter(dataSelecionada, hoje) || isEqual(dataSelecionada, hoje)) &&
    (isBefore(dataSelecionada, dataLimite) ||
      isEqual(dataSelecionada, dataLimite))
  );
}

/**
 * Gera array de datas disponíveis (hoje + 15 dias)
 */
export function gerarDatasDisponiveis(): DataDisponivel[] {
  const datas: DataDisponivel[] = [];
  const hoje = new Date();

  for (let i = 0; i <= 15; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + i);

    datas.push({
      valor: format(data, "yyyy-MM-dd"),
      label: format(data, "EEEE, dd 'de' MMMM", { locale: ptBR }),
    });
  }

  return datas;
}

/**
 * Calcula o horário de término de um agendamento
 */
export function calcularHorarioTermino(
  horarioInicio: string,
  duracaoMinutos: number
): string {
  const dataBase = new Date(2000, 0, 1);
  const inicio = parse(horarioInicio, "HH:mm", dataBase);
  const termino = addMinutes(inicio, duracaoMinutos);
  return format(termino, "HH:mm");
}

/**
 * Formata data para exibição
 */
export function formatarData(data: string | Date): string {
  const dataObj = typeof data === "string" ? new Date(data) : data;
  return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Formata data e hora para exibição
 */
export function formatarDataHora(dataHora: string | Date): string {
  const dataObj = typeof dataHora === "string" ? new Date(dataHora) : dataHora;
  return format(dataObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

/**
 * Formata preço em reais
 */
export function formatarPreco(valor: number): string {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}
