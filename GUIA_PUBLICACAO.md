# 🚀 Guia de Publicação na Play Store

## Passo a Passo Completo

---

## 📋 Pré-requisitos

Você já tem:
- ✅ Conta de desenvolvedor Google Play (taxa única de $25)
- ✅ App configurado com EAS

Você precisa preparar:
- [ ] Política de Privacidade (URL pública)
- [ ] Screenshots do app (mínimo 2)
- [ ] Gráfico de Destaque (1024x500px)

---

## 🔧 PASSO 1: Configurar EAS

Primeiro, faça login no EAS:

```bash
npx eas login
```

Depois, configure o projeto (só precisa fazer uma vez):

```bash
npx eas build:configure
```

---

## 📦 PASSO 2: Gerar Build de Produção

Execute o comando para gerar o AAB (Android App Bundle):

```bash
npx eas build --platform android --profile production
```

⏱️ **Tempo estimado:** 10-20 minutos

O build será feito nos servidores do Expo. Quando terminar, você receberá um link para baixar o arquivo `.aab`.

---

## 📱 PASSO 3: Criar App no Google Play Console

1. Acesse: https://play.google.com/console

2. Clique em **"Criar app"**

3. Preencha os campos:
   - **Nome do app:** Barbearia BR99
   - **Idioma padrão:** Português (Brasil)
   - **App ou jogo:** App
   - **Gratuito ou pago:** Gratuito
   - ✅ Aceite as políticas

4. Clique em **"Criar app"**

---

## 📝 PASSO 4: Preencher Ficha da Play Store

### 4.1 Informações Principais

Vá em **"Ficha da Play Store" > "Ficha principal da loja"**

Preencha:

**Descrição curta (80 caracteres):**
```
Agende seu corte na Barbearia BR99 de forma rápida e prática!
```

**Descrição completa:** (Copie do arquivo PLAYSTORE.md)

---

### 4.2 Gráficos

**Ícone do app (512x512):**
- Use o arquivo `assets/images/icon.png`

**Gráfico de destaque (1024x500):**
- Crie uma imagem promocional com o logo da barbearia

**Screenshots:**
- Capture 2-8 telas do app no celular
- Use um emulador ou tire do próprio dispositivo

---

### 4.3 Categorização

Vá em **"Ficha da Play Store" > "Categorização"**

- **Tipo:** App
- **Categoria:** Beleza
- **Tags:** barbearia, agendamento, corte de cabelo

---

## 🔒 PASSO 5: Política e Acesso

### 5.1 Política de Privacidade

Vá em **"Política" > "Política de privacidade"**

Cole a URL da sua política de privacidade.

**Dica:** Crie uma página simples em:
- https://termly.io (gratuito)
- https://privacypolicies.com (gratuito)

---

### 5.2 Acesso ao App

Vá em **"Política" > "Acesso ao app"**

Selecione: **"Todas as funcionalidades estão disponíveis sem credenciais especiais"**

---

### 5.3 Anúncios

Vá em **"Política" > "Anúncios"**

Selecione: **"Não, meu app não contém anúncios"**

---

## 📊 PASSO 6: Classificação de Conteúdo

Vá em **"Política" > "Classificação de conteúdo"**

1. Clique em **"Iniciar questionário"**
2. Preencha o email de contato
3. Selecione a categoria: **"Utilidade, produtividade, comunicação ou outro"**
4. Responda as perguntas (todas "Não" para um app de agendamento)
5. Clique em **"Salvar" > "Enviar"**

O app receberá classificação **"Livre"**.

---

## 🌍 PASSO 7: Países e Preço

### 7.1 Países

Vá em **"Versão" > "Produção" > "Países/regiões"**

Clique em **"Adicionar países/regiões"** e selecione **Brasil** (ou todos).

### 7.2 Preço

O app já está configurado como **Gratuito** (não pode mudar depois).

---

## 📤 PASSO 8: Fazer Upload do AAB

1. Vá em **"Versão" > "Produção"**

2. Clique em **"Criar nova versão"**

3. Arraste o arquivo `.aab` (baixado do EAS) para a área de upload

4. Preencha as **Notas da versão:**
```
Versão inicial do app Barbearia BR99

Funcionalidades:
• Agendamento online de serviços
• Visualização de horários disponíveis
• Acompanhamento de agendamentos
• Catálogo de serviços
• Contato via WhatsApp
```

5. Clique em **"Salvar"**

---

## ✅ PASSO 9: Revisar e Publicar

1. Vá em **"Visão geral da versão"**

2. Verifique se todos os itens estão com ✅ verde

3. Clique em **"Enviar para revisão"**

---

## ⏱️ Tempo de Aprovação

- **Primeira publicação:** 1-3 dias úteis
- **Atualizações:** Algumas horas a 1 dia

Você receberá um email quando o app for aprovado.

---

## 🔄 Comandos Úteis para Atualizações Futuras

### Gerar nova build:
```bash
npx eas build --platform android --profile production
```

### Enviar diretamente para Play Store (após configurar):
```bash
npx eas submit --platform android
```

---

## 📞 Suporte

Se tiver problemas:
- Documentação Expo: https://docs.expo.dev/submit/android/
- Google Play Console Help: https://support.google.com/googleplay/android-developer/

---

**Desenvolvido por Derick Mackenzie**
https://www.instagram.com/derick.mackenzie/
