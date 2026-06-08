import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const TOUR_STEPS = [
  {
    id: "planet",
    eyebrow: "1 / 11",
    title: "O planeta é o tabuleiro",
    body: "No centro, a órbita mostra satélites, detritos, frotas e colisões acontecendo em tempo real. Arraste o globo para observar a distribuição.",
    pad: 18,
  },
  {
    id: "globe-legend",
    eyebrow: "2 / 11",
    title: "Legenda orbital",
    body: "Use estes símbolos para ler o globo: satélites ativos, lixo espacial, frotas de coleta e objetos destruídos. As formas também ajudam quando cor não basta.",
    pad: 12,
  },
  {
    id: "deploy-fleet",
    eyebrow: "3 / 11",
    title: "Implantar Frota",
    body: "Este é o controle principal da simulação. Cada frota remove detritos da faixa crítica e tenta empurrar o sistema de volta para uma região estável.",
    pad: 12,
  },
  {
    id: "transport-controls",
    eyebrow: "4 / 11",
    title: "Tempo da simulação",
    body: "Aqui você controla o ritmo: pausar ou iniciar, alternar a velocidade e reiniciar o cenário para testar outra estratégia.",
    pad: 12,
  },
  {
    id: "active-satellites",
    eyebrow: "5 / 11",
    title: "Satélites ativos",
    body: "Aqui começa a pressão sobre a órbita: quanto mais satélites operacionais, maior a dependência da infraestrutura espacial e maior o tráfego a ser protegido.",
  },
  {
    id: "orbital-debris",
    eyebrow: "6 / 11",
    title: "Detritos em órbita",
    body: "Este é o lixo espacial sem controle. Ele não presta serviço, mas continua cruzando a órbita em alta velocidade e alimenta o risco de colisão.",
  },
  {
    id: "yearly-collisions",
    eyebrow: "7 / 11",
    title: "Colisões por ano",
    body: "As colisões não crescem de forma linear: mais objetos significam muito mais encontros possíveis. É aqui que a cascata começa a acelerar.",
  },
  {
    id: "financial-loss",
    eyebrow: "8 / 11",
    title: "Prejuízo financeiro global",
    body: "Quando a órbita degrada, o impacto sai da física e vira economia: ativos destruídos, serviços interrompidos e cobertura global comprometida.",
  },
  {
    id: "lost-satellites",
    eyebrow: "9 / 11",
    title: "Satélites perdidos",
    body: "Este acumulado mostra a constelação sendo consumida pela cascata. Cada perda também vira mais fragmentos circulando.",
  },
  {
    id: "equilibrium-distance",
    eyebrow: "10 / 11",
    title: "Distância do equilíbrio",
    body: "O marcador mostra quão perto estamos do ponto sem volta. Depois dessa linha, a geração de detritos supera até a remoção máxima viável.",
  },
  {
    id: "mission-kpi",
    eyebrow: "11 / 11",
    title: "Painel da missão",
    body: "Estes são os números que decidem tudo. Índice Kessler, lançamentos, perdas e a data da simulação — você os verá aqui durante toda a missão. Mantenha o índice abaixo de 1.",
    pad: 14,
  },
];

const TOOLTIP_W = 340;
const GAP = 18;
const EDGE = 18;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function measureStep(targetId) {
  const target = document.querySelector(`[data-tour-id="${targetId}"]`);
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const roomRight = viewportW - rect.right;
  const placeRight = roomRight >= TOOLTIP_W + GAP || rect.left < TOOLTIP_W + GAP;
  const left = placeRight ? rect.right + GAP : rect.left - TOOLTIP_W - GAP;
  // For the KPI step, push slightly below the legend row
  const topBase = targetId === "mission-kpi" ? rect.bottom + 100 : rect.top + rect.height / 2 - 120;
  const top = clamp(topBase, EDGE, Math.max(EDGE, viewportH - 260));

  return {
    target: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
    tooltip: {
      top,
      left: clamp(left, EDGE, Math.max(EDGE, viewportW - TOOLTIP_W - EDGE)),
    },
    side: placeRight ? "left" : "right",
  };
}

export default function IntroTour({ startActive = true, onDone }) {
  const [active, setActive] = useState(startActive);
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState(null);
  const step = TOUR_STEPS[index];

  const close = useCallback(() => {
    setActive(false);
    document.querySelectorAll("[data-tour-id]").forEach((node) => {
      node.classList.remove("tour-focus", "tour-visited");
    });
    onDone?.();
  }, [onDone]);

  const updateLayout = useCallback(() => {
    if (!active || !step) return;

    const nextLayout = measureStep(step.id);
    setLayout(nextLayout);

    document.querySelectorAll("[data-tour-id]").forEach((node) => {
      const stepIndex = TOUR_STEPS.findIndex((item) => item.id === node.getAttribute("data-tour-id"));
      const isCurrent = stepIndex === index;
      const isVisited = stepIndex >= 0 && stepIndex < index;
      node.classList.toggle("tour-focus", isCurrent);
      node.classList.toggle("tour-visited", isVisited);
    });
  }, [active, index, step]);

  useLayoutEffect(() => {
    updateLayout();
  }, [updateLayout]);

  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        setIndex((current) => {
          if (current === TOUR_STEPS.length - 1) {
            close();
            return current;
          }
          return current + 1;
        });
      } else if (event.key === "ArrowLeft") {
        setIndex((current) => Math.max(current - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
    };
  }, [active, close, updateLayout]);

  useEffect(() => {
    if (active) return undefined;

    document.querySelectorAll("[data-tour-id]").forEach((node) => {
      node.classList.remove("tour-focus", "tour-visited");
    });
    return undefined;
  }, [active]);

  useEffect(() => {
    document.body.classList.toggle("tour-active", active);
    return () => document.body.classList.remove("tour-active");
  }, [active]);

  useEffect(() => {
    if (startActive) setActive(true);
  }, [startActive]);

  const spotlightStyle = useMemo(() => {
    if (!layout) return {};
    const pad = step.pad ?? 10;

    return {
      top: layout.target.top - pad,
      left: layout.target.left - pad,
      width: layout.target.width + pad * 2,
      height: layout.target.height + pad * 2,
    };
  }, [layout, step]);

  if (!active || !step || !layout) return null;

  const isFirst = index === 0;
  const isLast = index === TOUR_STEPS.length - 1;

  return createPortal(
    <div className="intro-tour" aria-live="polite">
      <div className="tour-backdrop" />
      <div className="tour-spotlight" style={spotlightStyle} />
      <aside
        className={"tour-card tour-card-" + layout.side}
        style={{ top: layout.tooltip.top, left: layout.tooltip.left }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        <button className="tour-close" type="button" onClick={close} aria-label="Sair da introdução">
          ×
        </button>
        <div className="tour-eyebrow">{step.eyebrow}</div>
        <h2 id="tour-title" className="tour-title">
          {step.title}
        </h2>
        <p className="tour-body">{step.body}</p>
        <div className="tour-progress" aria-hidden="true">
          {TOUR_STEPS.map((item, itemIndex) => (
            <span key={item.id} className={itemIndex === index ? "is-active" : ""} />
          ))}
        </div>
        <div className="tour-actions">
          <button className="tour-btn tour-btn-ghost" type="button" onClick={close}>
            Sair
          </button>
          <div className="tour-nav">
            <button
              className="tour-btn tour-btn-muted"
              type="button"
              onClick={() => setIndex((current) => Math.max(current - 1, 0))}
              disabled={isFirst}
            >
              Voltar
            </button>
            <button
              className="tour-btn tour-btn-primary"
              type="button"
              onClick={() => (isLast ? close() : setIndex((current) => current + 1))}
            >
              {isLast ? "Começar" : "Próximo"}
            </button>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
