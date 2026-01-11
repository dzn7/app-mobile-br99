/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Design system BarbeariaBR99
        fundo: {
          claro: "#ffffff",
          escuro: "#09090b",
        },
        texto: {
          claro: "#09090b",
          escuro: "#fafafa",
        },
        primario: {
          DEFAULT: "#18181b",
          claro: "#18181b",
          escuro: "#fafafa",
        },
        secundario: {
          DEFAULT: "#f4f4f5",
          claro: "#f4f4f5",
          escuro: "#27272a",
        },
        borda: {
          claro: "#e4e4e7",
          escuro: "#27272a",
        },
        cartao: {
          claro: "#ffffff",
          escuro: "#18181b",
        },
        destaque: {
          claro: "#f4f4f5",
          escuro: "#27272a",
        },
        // Cores de estado
        sucesso: "#22c55e",
        erro: "#ef4444",
        aviso: "#f59e0b",
        info: "#3b82f6",
        // Cores específicas
        estrela: "#facc15",
        whatsapp: "#25d366",
      },
      fontFamily: {
        sans: ["SpaceMono", "System"],
      },
      borderRadius: {
        'card': 16,
        'botao': 12,
        'input': 10,
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
