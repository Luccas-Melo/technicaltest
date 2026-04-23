# Technical Test

Repositório com dois projetos de landing pages desenvolvidos como teste técnico.

## Projetos

### Parte 1 — Positivus

Landing page de agência de marketing digital, baseada em layout do Figma (template Positivus).

- **Stack:** HTML5, Tailwind CSS (build local via PostCSS), Alpine.js, JavaScript vanilla
- **Destaques:**
  - Hero animado com SVG (anéis girando, elementos flutuantes)
  - Carrossel de cases com auto-play, drag e suporte a touch
  - Grid de serviços com reveal on scroll (IntersectionObserver)
  - Menu mobile responsivo
  - Navbar com efeito glassmorphism ao scrollar
- **Rodar:**
  ```bash
  cd parte-1
  npm install
  npm run build-css   # gera css/tailwind.css
  ```
  Depois abrir `parte-1/index.html` no navegador (ou servir via XAMPP/http.server).

### Parte 2 — Pyflow

Landing page minimalista e artística para curso de Python com IA.

- **Stack:** HTML5, CSS puro (custom properties), JavaScript vanilla, Canvas 2D
- **Destaques:**
  - Background artístico com anéis de texto animados em canvas (interação com mouse/touch)
  - Entrada refinada com blur + scale + translate (sensação de "peso físico")
  - Fade suave no canvas ao carregar
  - Parallax sutil ao scrollar
  - Design dark, tipografia Inter, paleta em HSL com acento warm
  - Totalmente responsivo, sem dependências externas além da fonte
- **Rodar:** abrir `parte-2/index.html` no navegador.

## Estrutura

```
teste/
├── parte-1/          # Positivus — Tailwind + Alpine
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── components/
└── parte-2/          # Pyflow — CSS puro + Canvas
    ├── index.html
    ├── css/
    └── js/
```

## Créditos & IA

O desenvolvimento deste repositório contou com auxílio de assistentes de IA:

- **Claude (Anthropic)** — refino de animações, estruturação de código, revisão e ajustes de UX.
- **Gemini (gratuito)** — apoio em brainstorming, sugestões de layout e decisões visuais.

As decisões de design, arquitetura e implementação final foram conduzidas e validadas manualmente.
