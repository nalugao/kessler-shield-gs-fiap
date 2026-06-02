# Kessler Shield

**Active Debris Removal System — Poly-Catch System**
FIAP Global Solution 2025

Site institucional do Kessler Shield, um sistema de remoção de detritos espaciais
usando polímero expansível (espuma). Construído em **React + Vite**, com **React Router DOM v7**
e **CSS puro** (sem bibliotecas de UI, sem TypeScript).

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite imprimir no terminal (geralmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## 🧭 Páginas

| Rota            | Página       |
| --------------- | ------------ |
| `/`             | Home (seções 01–06) |
| `/problema`     | O Problema   |
| `/financeiro`   | Financeiro   |
| `/referencias`  | Referências (busca + filtros, 17 fontes) |
| `/contato`      | Contato      |

## 🗂️ Estrutura

```
src/
├── main.jsx                  # entrada (BrowserRouter) — importa index.css + styles/shared.css
├── App.jsx                   # layout + rotas
├── index.css                 # tokens, reset, utilitários, botões, badge, reveal
├── styles/
│   └── shared.css            # blocos usados por +1 página (stat-grid, rev-grid, two-col, contact)
├── data/
│   └── references.js         # 17 referências científicas
├── components/
│   ├── Starfield.jsx         # céu estrelado (canvas)
│   ├── Navbar.jsx + .css      # navbar sticky com blur ao scroll
│   ├── Footer.jsx + .css
│   ├── OrbitalVis.jsx + .css  # visualização orbital em SVG + slot do globo 3D
│   ├── Reveal.jsx            # animação de entrada ao rolar
│   ├── SignupForm.jsx + .css  # formulário controlado (newsletter / investir)
│   ├── TeamGrid.jsx + .css    # grade da equipe (avatares)
│   ├── RefCard.jsx + .css     # card de referência (compartilhado seção/página)
│   ├── PageHero.css          # cabeçalho das sub-páginas (usado por ui.jsx)
│   ├── ScrollManager.jsx     # scroll para topo / âncora ao trocar de rota
│   ├── ui.jsx                # Badge, SectionLabel, PageHero
│   └── sections/
│       └── ReferenciasSection.jsx + .css   # seção 04 da Home (≠ página Referências)
└── pages/
    ├── Home.jsx      + Home.css         # hero + passos da solução
    ├── Problema.jsx  + Problema.css     # timeline + prose
    ├── Financeiro.jsx + Financeiro.css  # tabela + gráfico de barras
    ├── Referencias.jsx + Referencias.css # busca, filtros, grade 3 col
    └── Contato.jsx   + Contato.css      # (reusa componentes/shared)
```

> **CSS:** um arquivo por página em `pages/` + CSS co-locado por componente.
> `index.css` guarda os tokens/utilitários globais e `styles/shared.css` os poucos
> blocos reutilizados por mais de uma página. Nada de bibliotecas — **CSS puro**.

## Identidade

- **Cores:** fundo `#020810`, verde-menta `#7de8c8`, branco para títulos, cinza-claro no corpo
- **Tipografia:** Orbitron (display) + Space Grotesk (corpo)
- **Background:** céu estrelado fixo (canvas) em todas as páginas

## Equipe

Natalia (Frontend) · Gabriel (Problema) · Jeff (Financeiro) · Sophia (Nav/Contato) · André (Pitch)

---

> _"Um pequeno passo para o homem, um passo enorme para a sobrevivência orbital."_
