# 📱 BarbeariaBR99 - Aplicativo Mobile

Aplicativo React Native/Expo para a Barbearia BR99, desenvolvido com as melhores práticas de design e desenvolvimento mobile.

## 🚀 Tecnologias

- **Expo SDK 52** - Framework React Native
- **Expo Router** - Navegação baseada em arquivos
- **NativeWind** - TailwindCSS para React Native
- **Supabase** - Backend (banco de dados, autenticação)
- **React Native Reanimated** - Animações fluidas
- **Expo Haptics** - Feedback tátil
- **TypeScript** - Tipagem estática

## 📁 Estrutura do Projeto

```
barbeariabr99-app/
├── app/                    # Telas (Expo Router)
│   ├── (tabs)/            # Navegação por tabs
│   │   ├── index.tsx      # Tela inicial (Home)
│   │   ├── agendamento.tsx # Fluxo de agendamento
│   │   ├── meus-agendamentos.tsx # Lista de agendamentos
│   │   └── perfil.tsx     # Perfil e configurações
│   └── _layout.tsx        # Layout raiz
├── components/            # Componentes reutilizáveis
│   └── ui/               # Design system
│       ├── Botao.tsx     # Botões
│       ├── Cartao.tsx    # Cards
│       ├── CampoTexto.tsx # Inputs
│       ├── Texto.tsx     # Tipografia
│       ├── Icone.tsx     # Ícones
│       └── Carregando.tsx # Loading states
├── contexts/             # React Contexts
│   ├── TemaContext.tsx   # Tema claro/escuro
│   └── AutenticacaoContext.tsx # Auth
├── hooks/                # Custom hooks
│   ├── useServicos.ts    # Busca serviços
│   ├── useBarbeiros.ts   # Busca barbeiros
│   ├── useAvaliacoes.ts  # Busca avaliações
│   └── useConfiguracaoBarbearia.ts # Config
├── lib/                  # Utilitários
│   ├── supabase.ts       # Cliente Supabase
│   └── horarios.ts       # Lógica de horários
├── constants/            # Constantes
│   └── Colors.ts         # Design system cores
├── types/                # TypeScript types
│   └── index.ts          # Tipos do app
└── assets/              # Imagens e fontes
```

## 🎨 Design System

O aplicativo usa o design system da versão web, com:

- **Cores**: Tema claro e escuro automático
- **Tipografia**: Sistema de variantes (titulo, subtitulo, corpo, label, pequeno)
- **Componentes**: Botões, Cards, Inputs, Ícones reutilizáveis
- **Animações**: Transições suaves com Reanimated

### Cores Principais

```javascript
// Tema Claro
fundo: "#ffffff"
texto: "#09090b"
cartao: "#ffffff"
borda: "#e4e4e7"

// Tema Escuro
fundo: "#09090b"
texto: "#fafafa"
cartao: "#18181b"
borda: "#27272a"
```

## 📱 Funcionalidades

### Tela Inicial
- Hero section com estatísticas
- Serviços em destaque
- Avaliações de clientes
- Informações de contato

### Agendamento
- Fluxo multi-etapas intuitivo
- Seleção de serviços
- Escolha de barbeiro
- Calendário de datas
- Grade de horários disponíveis
- Confirmação com resumo

### Meus Agendamentos
- Busca por telefone
- Lista de agendamentos futuros
- Histórico de atendimentos
- Cancelamento de agendamentos

### Perfil
- Informações de contato
- Horário de funcionamento
- Tema claro/escuro
- Links para WhatsApp, Instagram, Maps

## 🔧 Instalação

1. **Clone o repositório**
```bash
cd barbeariabr99-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

4. **Inicie o projeto**
```bash
npx expo start
```

## 📲 Executando no Dispositivo

- **Android**: Escaneie o QR code com o app Expo Go
- **iOS**: Escaneie o QR code com a câmera
- **Web**: Pressione `w` no terminal

## 🏗️ Build de Produção

```bash
# Android
npx eas build --platform android

# iOS
npx eas build --platform ios
```

## 🔗 Integração com Supabase

O app se conecta ao mesmo banco de dados da versão web:

- **Realtime**: Atualizações automáticas de serviços e barbeiros
- **Autenticação**: Login seguro com Secure Store
- **Queries**: Tipadas com TypeScript

## 📄 Licença

Desenvolvido para Barbearia BR99 - Barras, PI
