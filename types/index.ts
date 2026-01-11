/**
 * Tipos TypeScript para o aplicativo BarbeariaBR99
 * Espelhando a estrutura do projeto web
 */

/**
 * Representa um barbeiro da barbearia
 */
export interface Barbeiro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidades: string[];
  foto_url: string | null;
  ativo: boolean;
  data_cadastro: string;
  comissao_percentual?: number;
  total_atendimentos?: number;
  avaliacao_media?: number;
}

/**
 * Representa um serviço oferecido
 */
export interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  duracao: number;
  preco: number;
  ativo: boolean;
  categoria?: string;
  ordem_exibicao?: number;
}

/**
 * Status possíveis de um agendamento
 */
export type StatusAgendamento =
  | "pendente"
  | "confirmado"
  | "concluido"
  | "cancelado"
  | "nao_compareceu";

/**
 * Representa um agendamento
 */
export interface Agendamento {
  id: string;
  cliente_id: string;
  barbeiro_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  valor_total: number;
  status: StatusAgendamento;
  observacoes?: string;
  valor_pago?: number;
  forma_pagamento?: FormaPagamento;
  avaliacao?: number;
  comentario_avaliacao?: string;
  criado_em: string;
  atualizado_em: string;
  // Joins
  clientes?: Cliente;
  barbeiros?: Barbeiro;
  servicos?: Servico;
}

/**
 * Representa um cliente
 */
export interface Cliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  data_cadastro: string;
  ativo: boolean;
  observacoes?: string;
  total_agendamentos?: number;
  ultima_visita?: string;
  user_id?: string;
}

/**
 * Formas de pagamento
 */
export type FormaPagamento =
  | "dinheiro"
  | "pix"
  | "debito"
  | "credito"
  | "transferencia";

/**
 * Configurações da barbearia
 */
export interface ConfiguracaoBarbearia {
  id: string;
  aberta: boolean;
  mensagem_fechamento: string | null;
  horario_abertura: string;
  horario_fechamento: string;
  dias_funcionamento: string[];
  intervalo_almoco_inicio: string | null;
  intervalo_almoco_fim: string | null;
  intervalo_horarios: number;
  usar_horarios_personalizados: boolean;
  horarios_personalizados: HorariosPersonalizados | null;
}

/**
 * Horários personalizados por dia
 */
export interface HorarioDia {
  abertura: string;
  fechamento: string;
  almoco_inicio: string | null;
  almoco_fim: string | null;
}

export interface HorariosPersonalizados {
  seg?: HorarioDia;
  ter?: HorarioDia;
  qua?: HorarioDia;
  qui?: HorarioDia;
  sex?: HorarioDia;
  sab?: HorarioDia;
  dom?: HorarioDia;
}

/**
 * Avaliação pública
 */
export interface AvaliacaoPublica {
  id: string;
  nome: string;
  avaliacao: number;
  comentario: string;
  aprovado: boolean;
  ip_address?: string;
  criado_em: string;
}

/**
 * Trabalho/Portfólio
 */
export interface Trabalho {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
  descricao?: string;
  curtidas: number;
  ativo: boolean;
  criado_em: string;
}

/**
 * Horário com status de disponibilidade
 */
export interface HorarioComStatus {
  hora: string;
  disponivel: boolean;
}

/**
 * Data disponível para agendamento
 */
export interface DataDisponivel {
  valor: string;
  label: string;
}
