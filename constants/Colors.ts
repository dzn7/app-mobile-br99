/**
 * Design System de Cores - BarbeariaBR99
 * Sistema de cores premium com modo claro e escuro otimizados
 */

// Paleta Base
const corBranca = "#ffffff";
const corPretaBase = "#09090b";
const corPretaEscura = "#18181b";
const corCinzaClaro = "#fafafa";
const corCinzaMedio = "#f4f4f5";
const corCinzaEscuro = "#27272a";
const corBordaClara = "#e4e4e7";
const corTextoSecundario = "#71717a";

// Cores de destaque
const corVerdePrimaria = "#16a34a"; // Verde mais vibrante para modo claro
const corVerdeEscura = "#22c55e";   // Verde para modo escuro
const corVerdeClara = "#dcfce7";    // Verde background claro
const corAzulPrimaria = "#2563eb";
const corAzulClara = "#dbeafe";

export const Cores = {
  light: {
    // Cores principais - Alto contraste para legibilidade
    texto: "#111827",              // Quase preto, melhor contraste
    textoSecundario: "#6b7280",    // Cinza médio
    textoTerciario: "#9ca3af",     // Cinza mais claro
    fundo: "#f9fafb",              // Off-white suave (não branco puro)
    fundoSecundario: "#f3f4f6",    // Cinza muito claro
    fundoPuro: corBranca,          // Branco puro quando necessário
    
    // Componentes
    cartao: corBranca,
    cartaoTexto: "#111827",
    cartaoSombra: "rgba(0, 0, 0, 0.08)",
    borda: "#e5e7eb",
    bordaForte: "#d1d5db",
    
    // Botões - Cores mais definidas
    botaoPrimario: "#111827",       // Escuro para destaque
    botaoPrimarioTexto: corBranca,
    botaoSecundario: "#f3f4f6",
    botaoSecundarioTexto: "#111827",
    botaoGhost: "transparent",
    botaoGhostTexto: "#111827",
    
    // Estados - Cores mais vibrantes no modo claro
    destaque: corVerdePrimaria,
    destaqueTexto: corBranca,
    destaqueFundo: corVerdeClara,
    sucesso: corVerdePrimaria,
    sucessoFundo: "#ecfdf5",
    erro: "#dc2626",
    erroFundo: "#fef2f2",
    alerta: "#d97706",
    alertaFundo: "#fffbeb",
    info: corAzulPrimaria,
    infoFundo: corAzulClara,
    
    // Tabs - Visual mais limpo
    tabIconeAtivo: corVerdePrimaria,
    tabIconeInativo: "#9ca3af",
    tabFundo: corBranca,
    tabBorda: "#e5e7eb",
    
    // Header
    headerFundo: corBranca,
    headerTexto: "#111827",
    headerSombra: "rgba(0, 0, 0, 0.05)",
    
    // Input - Bordas mais visíveis
    inputFundo: corBranca,
    inputBorda: "#d1d5db",
    inputBordaFocada: corVerdePrimaria,
    inputTexto: "#111827",
    inputPlaceholder: "#9ca3af",
    
    // Elementos especiais para modo claro
    overlay: "rgba(0, 0, 0, 0.5)",
    divisor: "#e5e7eb",
    skeleton: "#e5e7eb",
    skeletonBrilho: "#f3f4f6",
    
    // Avatar e badges
    avatarFundo: "#e5e7eb",
    avatarTexto: "#374151",
    badgeFundo: "#f3f4f6",
    badgeTexto: "#374151",
    
    // Status específicos
    statusPendente: "#d97706",
    statusPendenteFundo: "#fef3c7",
    statusConfirmado: corVerdePrimaria,
    statusConfirmadoFundo: corVerdeClara,
    statusCancelado: "#dc2626",
    statusCanceladoFundo: "#fee2e2",
  },
  dark: {
    // Cores principais
    texto: corCinzaClaro,
    textoSecundario: "#a1a1aa",
    textoTerciario: "#71717a",
    fundo: corPretaBase,
    fundoSecundario: corPretaEscura,
    fundoPuro: "#000000",
    
    // Componentes
    cartao: corPretaEscura,
    cartaoTexto: corCinzaClaro,
    cartaoSombra: "rgba(0, 0, 0, 0.3)",
    borda: corCinzaEscuro,
    bordaForte: "#3f3f46",
    
    // Botões
    botaoPrimario: corCinzaClaro,
    botaoPrimarioTexto: corPretaEscura,
    botaoSecundario: corCinzaEscuro,
    botaoSecundarioTexto: corCinzaClaro,
    botaoGhost: "transparent",
    botaoGhostTexto: corCinzaClaro,
    
    // Estados
    destaque: corVerdeEscura,
    destaqueTexto: corPretaBase,
    destaqueFundo: "rgba(34, 197, 94, 0.15)",
    sucesso: corVerdeEscura,
    sucessoFundo: "rgba(34, 197, 94, 0.15)",
    erro: "#ef4444",
    erroFundo: "rgba(239, 68, 68, 0.15)",
    alerta: "#f59e0b",
    alertaFundo: "rgba(245, 158, 11, 0.15)",
    info: "#3b82f6",
    infoFundo: "rgba(59, 130, 246, 0.15)",
    
    // Tabs
    tabIconeAtivo: corCinzaClaro,
    tabIconeInativo: "#71717a",
    tabFundo: "#0f0f10",
    tabBorda: corCinzaEscuro,
    
    // Header
    headerFundo: "#0f0f10",
    headerTexto: corCinzaClaro,
    headerSombra: "rgba(0, 0, 0, 0.4)",
    
    // Input
    inputFundo: corPretaEscura,
    inputBorda: corCinzaEscuro,
    inputBordaFocada: corVerdeEscura,
    inputTexto: corCinzaClaro,
    inputPlaceholder: "#71717a",
    
    // Elementos especiais
    overlay: "rgba(0, 0, 0, 0.7)",
    divisor: corCinzaEscuro,
    skeleton: corCinzaEscuro,
    skeletonBrilho: "#3f3f46",
    
    // Avatar e badges
    avatarFundo: corCinzaEscuro,
    avatarTexto: corCinzaClaro,
    badgeFundo: corCinzaEscuro,
    badgeTexto: corCinzaClaro,
    
    // Status específicos
    statusPendente: "#f59e0b",
    statusPendenteFundo: "rgba(245, 158, 11, 0.15)",
    statusConfirmado: corVerdeEscura,
    statusConfirmadoFundo: "rgba(34, 197, 94, 0.15)",
    statusCancelado: "#ef4444",
    statusCanceladoFundo: "rgba(239, 68, 68, 0.15)",
  },
  // Cores fixas (não mudam com tema) - Para elementos que precisam manter consistência
  fixas: {
    // Sucesso
    sucesso: "#22c55e",
    sucessoClaro: "#dcfce7",
    sucessoEscuro: "#16a34a",
    
    // Erro
    erro: "#ef4444",
    erroClaro: "#fee2e2",
    erroEscuro: "#dc2626",
    
    // Aviso
    aviso: "#f59e0b",
    avisoClaro: "#fef3c7",
    avisoEscuro: "#d97706",
    
    // Info
    info: "#3b82f6",
    infoClaro: "#dbeafe",
    infoEscuro: "#2563eb",
    
    // Especiais
    estrela: "#facc15",
    estrelaBrilho: "#fde047",
    whatsapp: "#25d366",
    instagram: "#E1306C",
    telefone: "#3b82f6",
    
    // Agendamentos
    ocupado: "#ef4444",
    disponivel: "#22c55e",
    
    // Branco/Preto absolutos
    branco: "#ffffff",
    preto: "#000000",
  },
};

export default Cores;
