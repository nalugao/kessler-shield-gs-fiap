import { useMemo } from "react";
import { projectTrajectory, pointOfNoReturnDebris } from "./sim/project.js";
import { HIGH_SHELL_INDEX, REMOVAL_CEILING } from "./sim/scenarios.js";
import { fmtCount } from "./chartUtils.jsx";
import InfoTip from "./InfoTip.jsx";

/**
 * Where the critical band sits *right now* between two fixed references: the stable
 * equilibrium it could rest at (with a fleet) and the "sem volta" threshold beyond
 * which it runs away. A position gauge, not a time series — on purpose, for variety
 * and because the point is a single distance, not a trend.
 */
const W = 300;
const H = 132;
const CX = 150;
const CY = 100;
const R = 66;

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(startDeg, endDeg, r = R) {
  const start = polar(CX, CY, r, startDeg);
  const end = polar(CX, CY, r, endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}

function angleFor(v, max) {
  return -115 + (Math.max(0, Math.min(max, v)) / max) * 230;
}

export default function EquilibriumGauge({ sim, tourId }) {
  const cliff = pointOfNoReturnDebris(); // past here, no fleet can recover it
  const floor = useMemo(() => {
    const traj = projectTrajectory(REMOVAL_CEILING); // max fleet → the stable equilibrium
    return traj[traj.length - 1].high;
  }, []);

  const live = sim.display?.live;
  const current = live?.shells?.[HIGH_SHELL_INDEX]?.D ?? floor;
  const max = cliff * 1.7;
  const over = current >= cliff;
  const ratio = current / cliff;
  const floorA = angleFor(floor, max);
  const cliffA = angleFor(cliff, max);
  const curA = angleFor(current, max);
  const needle = polar(CX, CY, R - 18, curA);
  const needleBase = polar(CX, CY, 8, curA + 180);

  return (
    <section className="panel" data-tour-id={tourId}>
      <div className="panel-head">
        <span className="panel-label">
          <span className="panel-title">
            Distância do equilíbrio
          </span>
          <InfoTip
            title="Ponto sem volta"
            intro="Distância entre o equilíbrio estável e o ponto sem volta."
            tex={"\\alpha D^2 > R_{max}"}
            where={[
              ["D", "detritos na faixa crítica"],
              ["\\alpha", "coeficiente de colisão"],
              ["R_{max}", "remoção máxima viável por frotas"],
            ]}
            note="Além dessa linha, a geração de fragmentos supera qualquer frota — a cascata é irreversível."
          />
        </span>
        <span className={"panel-value " + (over ? "tone-danger" : ratio > 0.85 ? "tone-warn" : "tone-safe")}>
          {fmtCount(current)}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="panel-svg gauge-svg">
        <defs>
          <linearGradient id="gauge-zone-gradient" x1="40" x2="260" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(95, 214, 168, 0.92)" />
            <stop offset="58%" stopColor="rgba(255, 179, 92, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 107, 122, 0.95)" />
          </linearGradient>
        </defs>
        <path d={arcPath(-115, 115, R + 7)} className="gauge-halo" />
        <path d={arcPath(-115, 115)} className="gtrack-bg" />
        <path d={arcPath(-115, 115)} className="gz gz-gradient" />

        <line x1={polar(CX, CY, R - 8, floorA).x} y1={polar(CX, CY, R - 8, floorA).y}
          x2={polar(CX, CY, R + 5, floorA).x} y2={polar(CX, CY, R + 5, floorA).y} className="gtick" />
        <line x1={polar(CX, CY, R - 8, cliffA).x} y1={polar(CX, CY, R - 8, cliffA).y}
          x2={polar(CX, CY, R + 5, cliffA).x} y2={polar(CX, CY, R + 5, cliffA).y} className="gtick gtick-cliff" />

        <line x1={needleBase.x} y1={needleBase.y} x2={needle.x} y2={needle.y} className={over ? "gneedle gneedle-over" : "gneedle"} />
        <circle cx={CX} cy={CY} r="12" className="gauge-hub-bg" />
        <circle cx={CX} cy={CY} r="5.4" className={over ? "gmark gmark-over" : "gmark"} />
        <text x={50} y={119} className="cap label-stable" textAnchor="middle">estável</text>
        <text x={250} y={119} className="cap label-threshold" textAnchor="middle">sem volta</text>
        <text x={CX} y={84} className="cap gmark-label" textAnchor="middle">hoje</text>
      </svg>

      <p className="panel-cap">
        {over ? "já passou do ponto sem volta" : "quão perto do irreversível"}
      </p>
    </section>
  );
}
