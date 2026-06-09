import { useState } from "react";
import Globe from "../globe/Globe.jsx";
import MiniChart from "./MiniChart.jsx";
import EquilibriumGauge from "./EquilibriumGauge.jsx";
import Stats from "./Stats.jsx";
import Deck from "./Deck.jsx";
import IntroTour from "./IntroTour.jsx";
import CinematicIntro from "./CinematicIntro.jsx";
import { fmtCount, fmtUSD, fmtMoneyTick } from "./chartUtils.jsx";
import { useSimulation } from "../sim/useSimulation.js";
import "./app.css";

const SAT = "#5aa9ff";
const DEBRIS = "#ff6b7a";
const AMBER = "#ffb35c";
const CATASTROPHE_C = 100;

function mix(a, b, t) {
  const k = Math.max(0, Math.min(1, t));
  return Math.round(a + (b - a) * k);
}

function auraStyle(criticality = 0) {
  const t = criticality < 1 ? 0 : Math.min(1, (criticality - 1) / 4);
  const r = mix(62, 255, t);
  const g = mix(128, 62, t);
  const b = mix(220, 82, t);
  return {
    "--universe-aura-color": `${r}, ${g}, ${b}`,
    "--universe-aura-strength": String(0.16 + t * 0.28),
  };
}

export default function SimuladorPage() {
  const sim = useSimulation();
  const [introPhase, setIntroPhase] = useState("cinematic");

  if (introPhase === "cinematic") {
    return (
      <div className="intro-shell">
        <CinematicIntro onComplete={() => setIntroPhase("tour")} />
      </div>
    );
  }

  const live = sim.display?.live;
  const collisionsNow = live ? live.shells.reduce((a, s) => a + s.collisionRate, 0) : 0;
  const catastrophic = (live?.systemCriticality ?? 0) >= CATASTROPHE_C;

  return (
    <div className="app">
      <Stats sim={sim} />

      {/* LEFT — the build-up: what we are → where we're going */}
      <aside className="rail rail-left">
        <MiniChart
          tourId="active-satellites"
          sim={sim}
          title="Satélites ativos"
          value={fmtCount(live?.totalS ?? 0)}
          valueClass="tone-sat"
          caption="lançamentos disparando — a era das megaconstelações"
          info={{
            title: "Satélites ativos",
            intro: "Satélites operacionais em órbita.",
            tex: "\\frac{dS}{dt} = L(t) - \\frac{S}{T_{op}} - \\kappa\\,\\alpha\\,S\\,X",
            where: [
              ["S", "satélites ativos"],
              ["L(t)", "lançamentos por ano (cresce com o tempo)"],
              ["T_{op}", "vida útil operacional, em anos"],
              ["\\kappa", "fração que não consegue desviar"],
              ["\\alpha", "coeficiente de colisão"],
              ["X = D + \\kappa S", "população que de fato colide"],
            ],
          }}
          scale="linear"
          domain={{ min: 0, max: 36000 }}
          series={[
            { key: (r) => r.totalS, color: SAT, kind: "area" },
            { key: (r) => r.totalS, color: SAT, kind: "line" },
          ]}
        />
        <MiniChart
          tourId="orbital-debris"
          sim={sim}
          title="Detritos em órbita"
          value={catastrophic ? "∞" : fmtCount(live?.totalD ?? 0)}
          valueClass="tone-debris"
          caption="o lixo acompanha cada lançamento"
          info={{
            title: "Detritos em órbita",
            intro: "Objetos sem controle — o lixo orbital.",
            tex: "\\frac{dD}{dt} = \\alpha X^2 + (1-f)\\frac{S}{T_{op}} - \\frac{D}{\\tau} - R",
            where: [
              ["D", "detritos (lixo)"],
              ["\\alpha X^2", "fragmentos criados por colisões"],
              ["f", "fração descartada corretamente"],
              ["\\tau", "tempo de decaimento atmosférico (anos)"],
              ["R", "remoção pela frota (objetos/ano)"],
              ["X = D + \\kappa S", "população que de fato colide"],
            ],
          }}
          scale="log"
          domain={{ min: 1e4, max: 1e9 }}
          series={[
            { key: (r) => (r.criticality >= CATASTROPHE_C ? 1e9 : r.total - r.totalS), color: DEBRIS, kind: "area" },
            { key: (r) => (r.criticality >= CATASTROPHE_C ? 1e9 : r.total - r.totalS), color: DEBRIS, kind: "line" },
          ]}
        />
        <MiniChart
          tourId="yearly-collisions"
          sim={sim}
          title="Colisões por ano"
          value={catastrophic ? "∞" : collisionsNow >= 100 ? fmtCount(collisionsNow) : collisionsNow.toFixed(1)}
          valueClass="tone-warn"
          caption="crescem com o quadrado dos detritos — αN²"
          info={{
            title: "Colisões por ano",
            intro: "Taxa de fragmentação na faixa.",
            tex: "\\text{colisões} \\approx \\alpha X^2",
            where: [
              ["\\alpha", "coeficiente de colisão"],
              ["X = D + \\kappa S", "população que de fato colide"],
            ],
            note: "Cresce com o quadrado da população: dobrar os objetos quadruplica as colisões. É esse termo não-linear que faz a cascata acelerar.",
          }}
          scale="log"
          domain={{ min: 10, max: 1e9 }}
          series={[{ key: (r) => (r.criticality >= CATASTROPHE_C ? 1e9 : r.leoColl + r.midColl + r.highColl), color: AMBER, kind: "line" }]}
        />
      </aside>

      {/* CENTER — the planet */}
      <div className="center" data-tour-id="planet" style={auraStyle(live?.systemCriticality ?? 0)}>
        <Globe onFrame={sim.onFrame} frameRef={sim.frameRef} />
      </div>

      {/* RIGHT — the stakes: why intervene */}
      <aside className="rail rail-right">
        <MiniChart
          tourId="financial-loss"
          sim={sim}
          title="Prejuízo financeiro global"
          value={fmtUSD(live?.financialLoss ?? 0)}
          valueClass="tone-warn"
          caption="estimativa — ativos perdidos + serviços interrompidos"
          info={{
            title: "Prejuízo financeiro (estimativa)",
            intro: "Acumulado, com hipóteses conservadoras.",
            tex: "\\text{perda} = N_{p}\\,V_a + \\int \\phi\\,v_s\\,S\\;dt",
            where: [
              ["N_{p}", "satélites destruídos"],
              ["V_a", "valor por satélite (≈ US$ 18 mi)"],
              ["\\phi", "fração da órbita comprometida"],
              ["v_s", "serviços por satélite·ano (≈ US$ 0,35 mi)"],
              ["S", "satélites ativos"],
            ],
            note: "Ordem de grandeza, não ciência exata.",
          }}
          scale="log"
          axisSide="right"
          domain={{ min: 1e9, max: 2e12 }}
          tickFormat={fmtMoneyTick}
          series={[
            { key: (r) => r.financialLoss, color: AMBER, kind: "area" },
            { key: (r) => r.financialLoss, color: AMBER, kind: "line", width: 2.2 },
          ]}
        />
        <MiniChart
          tourId="lost-satellites"
          sim={sim}
          title="Satélites perdidos"
          value={catastrophic ? "∞" : fmtCount(live?.totalLost ?? 0)}
          valueClass="tone-debris"
          caption="destruídos em colisões — o custo da cascata"
          info={{
            title: "Satélites perdidos",
            intro: "Satélites operacionais destruídos em colisões (acumulado).",
            tex: "N_{p} = \\int \\kappa\\,\\alpha\\,S\\,X \\; dt",
            where: [
              ["N_{p}", "satélites perdidos (acumulado)"],
              ["\\kappa", "fração que não consegue desviar"],
              ["\\alpha", "coeficiente de colisão"],
              ["S", "satélites ativos"],
              ["X = D + \\kappa S", "população que de fato colide"],
            ],
            note: "Dispara quando a cascata começa a consumir a constelação.",
          }}
          scale="linear"
          axisSide="right"
          domain={{ min: 0, max: 100000 }}
          series={[
            { key: (r) => (r.criticality >= CATASTROPHE_C ? 100000 : r.totalLost), color: DEBRIS, kind: "area" },
            { key: (r) => (r.criticality >= CATASTROPHE_C ? 100000 : r.totalLost), color: DEBRIS, kind: "line" },
          ]}
        />
        <EquilibriumGauge sim={sim} tourId="equilibrium-distance" />
      </aside>

      <Deck sim={sim} />
      {introPhase === "tour" && <IntroTour startActive onDone={() => setIntroPhase("done")} />}
    </div>
  );
}
