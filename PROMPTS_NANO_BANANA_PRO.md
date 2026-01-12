# 🍌 Prompts Nano Banana Pro - Barbearia BR99

Prompts otimizados para o **Google AI Studio** usando o modelo **Nano Banana Pro** (gemini-3-pro-image-preview).

---

## 📋 Índice

1. [Ícone do App (512x512)](#1-ícone-do-app-512x512)
2. [Splash Screen (1080x1920)](#2-splash-screen-1080x1920)
3. [Feature Graphic (1024x500)](#3-feature-graphic-1024x500)
4. [Screenshots do App](#4-screenshots-do-app)
5. [Ícone Adaptativo Android](#5-ícone-adaptativo-android)

---

## 🔧 Configuração no Google AI Studio

**Modelo:** `gemini-3-pro-image-preview` (Nano Banana Pro)

**URL:** https://aistudio.google.com/prompts/new_chat

**Referência de marca (anexar quando indicado):** `assets/images/logo/logodark.webp`

---

## 1. Ícone do App (512x512)

### System Instructions

```
You are a professional app icon designer specializing in minimalist, modern mobile app icons. 
You create icons that are:
- Clean and recognizable at small sizes
- Following Material Design and iOS Human Interface Guidelines
- Using bold, simple shapes with limited color palette
- Optimized for app stores (no text, no fine details that disappear at small sizes)

Output format: Square image, 1:1 aspect ratio.
```

### Main Prompt

```
Create a professional mobile app icon for a Brazilian barbershop called "BR99".

Design specifications:
- Style: Modern, minimalist, high-contrast, matching the app's dark design system
- IMPORTANT: Use the provided brand logo as the primary reference (upload `assets/images/logo/logodark.webp`).
- Main element: A simplified geometric mark inspired by the BR99 logo (square frame with a centered rotated diamond / negative-space geometry).
- Color palette: Deep black (#09090b) background and white (#fafafa/#ffffff) foreground.
- Optional accent: very subtle white/gray glow highlight (#ffffff / #a1a1aa) only as a soft rim light (do NOT use blue or gold).
- Shape: Rounded square format (iOS/Android app icon style)
- No extra text beyond the symbol; do not add “barber pole” imagery
- Clean, bold silhouette that reads well at 48x48px
- Subtle depth allowed via soft shadow or gentle gradient (keep minimal)
- Brand feeling: modern, trustworthy, minimalist

Context: This is for a scheduling app for a premium barbershop in Brazil. The icon should convey trust, professionalism, and style.

Format: 1:1 square, 512x512 pixels
```

---

## 2. Splash Screen (1080x1920)

### System Instructions

```
You are a professional mobile UI designer creating splash screens for premium apps.
Your designs are:
- Clean and elegant with proper visual hierarchy
- Using dark themes with accent colors
- Centered compositions with breathing room
- Including subtle textures or gradients for depth

Output format: Portrait orientation, 9:16 aspect ratio.
```

### Main Prompt

```
Create a premium splash screen for a Brazilian barbershop app called "Barbearia BR99".

Design specifications:
- Orientation: Portrait (9:16 ratio, 1080x1920 pixels)
- Background: Deep black (#09090b) with subtle dark gradient or texture
- Center element: Use the provided BR99 logo image (upload `assets/images/logo/logodark.webp`) and keep it visually consistent.
- Typography (optional): If you add any text, keep it minimal and use a modern sans-serif.
- Accent color: Use white (#ffffff) and soft gray (#a1a1aa) only. No blue, no gold.
- Decorative elements: very subtle geometric pattern inspired by the logo shapes (squares/diamonds), extremely low opacity, with a faint soft-light gradient to add depth.
- Bottom: Keep clean. Optional small tagline in Portuguese: "Agende seu corte".
- Overall mood: Premium, masculine, sophisticated, trustworthy

The splash should feel like entering a high-end barbershop - dark, elegant, and professional.

Format: 1080x1920 pixels, portrait orientation
```

---

## 3. Feature Graphic (1024x500)

### System Instructions

```
You are a professional graphic designer creating app store promotional graphics.
Your designs are:
- Eye-catching and professional for Google Play Store
- Using bold typography and clear messaging
- Optimized for the 1024x500 feature graphic format
- Including the app's key value proposition visually

Output format: Landscape, 1024x500 pixels exactly.
```

### Main Prompt

```
Create a Google Play Store feature graphic for a Brazilian barbershop scheduling app called "Barbearia BR99".

Design specifications:
- Dimensions: 1024x500 pixels (landscape, 2:1 ratio approximately)
- Background: Dark gradient from black (#09090b) to dark gray (#18181b)
- Left side: Use the BR99 logo mark as the main brand element (upload `assets/images/logo/logodark.webp`)
- Right side: Mockup of a smartphone showing the app interface (scheduling screen)
- Text overlay: "Agende seu corte online" (Schedule your cut online) in bold white text
- Accent elements: Use white (#ffffff) and soft gray (#a1a1aa) only for separators, glow, and highlights. Avoid blue and gold.
- Style: Modern, clean, professional, but more sophisticated (premium editorial look)
- Composition: Balanced layout with strong spacing, clear hierarchy, and subtle depth
- Add realism: soft shadow under the phone mockup, gentle vignette, subtle film grain, and a refined texture (brushed metal / matte paper) at very low opacity
- Ensure the logo is crisp, centered vertically on the left block, and the phone mockup is high quality on the right
- Keep the design minimal but premium; no busy patterns, no excessive detail

The graphic should communicate: Easy online booking for a premium barbershop experience.

Format: 1024x500 pixels, landscape orientation
```

---

## 4. Screenshots do App

### System Instructions

```
You are a professional app screenshot designer for app store listings.
Your designs are:
- Clean device mockups with the app UI clearly visible
- Including descriptive text overlays that highlight features
- Using consistent branding and colors
- Following Google Play Store screenshot best practices

IMPORTANT: The user will provide actual screenshots from the app. Your job is to enhance them with device frames, text overlays, and professional presentation.

Output format: Portrait, 1080x1920 pixels or 9:16 ratio.
```

### Main Prompt - Screenshot 1 (Home/Serviços)

```
[ANEXAR PRINT DA TELA DE SERVIÇOS DO APP]

Enhance this app screenshot for Google Play Store listing.

Design specifications:
- Add a modern smartphone frame (iPhone or Pixel style, dark frame)
- Background: Dark gradient (#09090b to #1a1a1a)
- Top text overlay: "Escolha seus serviços" (Choose your services)
- Typography: Bold, white, modern sans-serif
- Accent: White (#ffffff) underline or highlight (no blue)
- Bottom: Subtle "Barbearia BR99" branding
- Keep the original screenshot clearly visible and readable

Format: 1080x1920 pixels, portrait
```

### Main Prompt - Screenshot 2 (Barbeiros)

```
[ANEXAR PRINT DA TELA DE BARBEIROS DO APP]

Enhance this app screenshot for Google Play Store listing.

Design specifications:
- Add a modern smartphone frame (dark frame, thin bezels)
- Background: Dark gradient with subtle geometric pattern inspired by the BR99 logo shapes
- Top text overlay: "Escolha seu barbeiro favorito" (Choose your favorite barber)
- Typography: Bold, white, modern sans-serif
- Accent color: White (#ffffff)
- Professional presentation for app store

Format: 1080x1920 pixels, portrait
```

### Main Prompt - Screenshot 3 (Calendário)

```
[ANEXAR PRINT DA TELA DE CALENDÁRIO DO APP]

Enhance this app screenshot for Google Play Store listing.

Design specifications:
- Modern smartphone mockup frame
- Dark background with subtle texture
- Top text overlay: "Escolha a melhor data" (Choose the best date)
- Highlight the calendar UI element
- White accent color (#ffffff)
- Clean, professional app store presentation

Format: 1080x1920 pixels, portrait
```

### Main Prompt - Screenshot 4 (Horários)

```
[ANEXAR PRINT DA TELA DE HORÁRIOS DO APP]

Enhance this app screenshot for Google Play Store listing.

Design specifications:
- Smartphone frame mockup
- Dark gradient background
- Top text overlay: "Horários disponíveis em tempo real" (Available times in real-time)
- Show the time grid clearly
- Highlight occupied vs available slots visually
- Use the app's status colors: green (#22c55e) for available and red (#ef4444) for occupied. Use white (#ffffff) only for headings/accents.

Format: 1080x1920 pixels, portrait
```

### Main Prompt - Screenshot 5 (Confirmação)

```
[ANEXAR PRINT DA TELA DE CONFIRMAÇÃO DO APP]

Enhance this app screenshot for Google Play Store listing.

Design specifications:
- Modern device frame
- Dark background
- Top text overlay: "Confirme em segundos" (Confirm in seconds)
- Emphasize the easy booking flow
- Success/checkmark visual element
- Green accent color (#22c55e) for success. Optional subtle white glow (#ffffff) for minor accents.

Format: 1080x1920 pixels, portrait
```

### Main Prompt - Screenshot 6 (Meus Agendamentos)

```
[ANEXAR PRINT DA TELA DE MEUS AGENDAMENTOS DO APP]

Enhance this app screenshot for Google Play Store listing.

Design specifications:
- Smartphone mockup frame
- Dark gradient background
- Top text overlay: "Acompanhe seus agendamentos" (Track your appointments)
- Show the appointments list clearly
- Professional app store styling
- White accent color (#ffffff)

Format: 1080x1920 pixels, portrait
```

---

## 5. Ícone Adaptativo Android

### System Instructions

```
You are an Android app icon designer following Material Design adaptive icon guidelines.
Adaptive icons have two layers:
- Foreground: The main icon element (with safe zone margins)
- Background: A solid color or simple pattern

The foreground should be centered with 33% padding from edges for safe zone.
```

### Main Prompt - Foreground Layer

```
Create the FOREGROUND layer for an Android adaptive icon for "Barbearia BR99".

Design specifications:
- Canvas: 108x108dp (432x432 pixels at xxxhdpi)
- Safe zone: Center 66dp circle (keep main element within this area)
- IMPORTANT: Use the provided brand logo as the primary reference (upload `assets/images/logo/logodark.webp`).
- Main element: Simplified geometric BR99 mark (no barber pole/scissors)
- Color: White (#ffffff / #fafafa). Optional extremely subtle white/gray rim light (#ffffff / #a1a1aa).
- Style: Bold, clean silhouette
- No background (transparent PNG)
- The element should be recognizable when masked as circle, squircle, or rounded square

Format: 432x432 pixels, PNG with transparency
```

### Main Prompt - Background Layer

```
Create the BACKGROUND layer for an Android adaptive icon for "Barbearia BR99".

Design specifications:
- Canvas: 108x108dp (432x432 pixels at xxxhdpi)
- Solid color: Deep black (#09090b)
- Optional: Very subtle radial gradient from #09090b to #18181b
- No patterns or complex elements
- This will be masked by Android launcher

Format: 432x432 pixels, solid or simple gradient
```

---

## 📐 Resumo de Dimensões

| Asset | Dimensões | Proporção | Uso |
|-------|-----------|-----------|-----|
| Ícone do App | 512x512 px | 1:1 | Play Store, launcher |
| Splash Screen | 1080x1920 px | 9:16 | Tela de carregamento |
| Feature Graphic | 1024x500 px | ~2:1 | Banner Play Store |
| Screenshots | 1080x1920 px | 9:16 | Galeria Play Store |
| Adaptive Icon FG | 432x432 px | 1:1 | Android launcher |
| Adaptive Icon BG | 432x432 px | 1:1 | Android launcher |

---

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Preto Principal | #09090b | Backgrounds |
| Preto Secundário | #18181b | Cards |
| Cinza Escuro | #27272a | Bordas/elementos |
| Branco | #ffffff | Texto principal |
| Cinza Texto | #a1a1aa | Texto secundário |
| Verde Sucesso | #22c55e | Confirmações/Disponível |
| Vermelho Erro | #ef4444 | Ocupado/Erro |

---

## 💡 Dicas de Uso

1. **Acesse o AI Studio:** https://aistudio.google.com
2. **Selecione o modelo:** `gemini-3-pro-image-preview`
3. **Cole as System Instructions** no campo apropriado
4. **Cole o Main Prompt** e anexe imagens quando indicado
5. **Itere:** Se o resultado não for perfeito, peça ajustes específicos
   - Exemplo: "Aumente o contraste do texto" ou "Mude a cor do fundo para mais escuro"

---

**Desenvolvido por Derick Mackenzie**
https://www.instagram.com/derick.mackenzie/
