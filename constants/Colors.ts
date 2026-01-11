/**
 * Design System de Cores - BarbeariaBR99
 * Cores extraídas do projeto web para consistência visual
 */

const corBranca = "#ffffff";
const corPretaBase = "#09090b";
const corPretaEscura = "#18181b";
const corCinzaClaro = "#fafafa";
const corCinzaMedio = "#f4f4f5";
const corCinzaEscuro = "#27272a";
const corBordaClara = "#e4e4e7";
const corTextoSecundario = "#71717a";

export const Cores = {
  light: {
    // Cores principais
    texto: corPretaBase,
    textoSecundario: corTextoSecundario,
    fundo: corBranca,
    fundoSecundario: corCinzaMedio,
    
    // Componentes
    cartao: corBranca,
    cartaoTexto: corPretaBase,
    borda: corBordaClara,
    
    // Botões
    botaoPrimario: corPretaEscura,
    botaoPrimarioTexto: corCinzaClaro,
    botaoSecundario: corCinzaMedio,
    botaoSecundarioTexto: corPretaEscura,
    botaoGhost: "transparent",
    botaoGhostTexto: corPretaBase,
    
    // Estados
    destaque: corCinzaMedio,
    destaqueTexto: corPretaEscura,
    sucesso: "#22c55e",
    erro: "#ef4444",
    alerta: "#f59e0b",
    
    // Tabs
    tabIconeAtivo: corPretaEscura,
    tabIconeInativo: corTextoSecundario,
    tabFundo: corBranca,
    
    // Header
    headerFundo: corBranca,
    headerTexto: corPretaBase,
    
    // Input
    inputFundo: corBranca,
    inputBorda: corBordaClara,
    inputTexto: corPretaBase,
    inputPlaceholder: corTextoSecundario,
  },
  dark: {
    // Cores principais
    texto: corCinzaClaro,
    textoSecundario: "#a1a1aa",
    fundo: corPretaBase,
    fundoSecundario: corCinzaEscuro,
    
    // Componentes
    cartao: corPretaEscura,
    cartaoTexto: corCinzaClaro,
    borda: corCinzaEscuro,
    
    // Botões
    botaoPrimario: corCinzaClaro,
    botaoPrimarioTexto: corPretaEscura,
    botaoSecundario: corCinzaEscuro,
    botaoSecundarioTexto: corCinzaClaro,
    botaoGhost: "transparent",
    botaoGhostTexto: corCinzaClaro,
    
    // Estados
    destaque: corCinzaEscuro,
    destaqueTexto: corCinzaClaro,
    sucesso: "#22c55e",
    erro: "#ef4444",
    alerta: "#f59e0b",
    
    // Tabs
    tabIconeAtivo: corCinzaClaro,
    tabIconeInativo: "#a1a1aa",
    tabFundo: "#1a1a1a",
    
    // Header
    headerFundo: "#1a1a1a",
    headerTexto: corCinzaClaro,
    
    // Input
    inputFundo: corPretaEscura,
    inputBorda: corCinzaEscuro,
    inputTexto: corCinzaClaro,
    inputPlaceholder: "#a1a1aa",
  },
  // Cores fixas (não mudam com tema)
  fixas: {
    sucesso: "#22c55e",
    sucessoClaro: "#dcfce7",
    erro: "#ef4444",
    erroClaro: "#fee2e2",
    aviso: "#f59e0b",
    avisoClaro: "#fef3c7",
    info: "#3b82f6",
    infoClaro: "#dbeafe",
    estrela: "#facc15",
    whatsapp: "#25d366",
    ocupado: "#ef4444",
    disponivel: "#22c55e",
  },
};

export default Cores;
