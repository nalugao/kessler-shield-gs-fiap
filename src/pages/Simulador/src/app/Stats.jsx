/** Top bar — title + KPI row (value on top, label below, right-aligned). */
import { fmtCount } from "./chartUtils.jsx";
import GlobeLegend from "./GlobeLegend.jsx";
import InfoTip from "./InfoTip.jsx";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function critTone(c) {
  if (c >= 2) return "danger";
  if (c >= 1) return "warn";
  return "safe";
}

export default function Stats({ sim }) {
  const { display } = sim;
  const live = display?.live;
  const date = display ? new Date(display.dateMs) : null;
  const c = live?.systemCriticality ?? 0;

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <a href="/" className="topbar-back" aria-label="Voltar ao início">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18 7 10l8-8" />
          </svg>
        </a>
        <div>
          <h1 className="topbar-title">Kessler Shield</h1>
          <p className="topbar-sub">Síndrome de Kessler · órbita baixa</p>
        </div>
      </div>

      <GlobeLegend />

      <div className="topbar-stats" data-tour-id="mission-kpi">
        <div className="stat stat-date">
          <span className="stat-v">
            {date ? (
              <>
                <span className="kpi-month">{MONTHS[date.getUTCMonth()]}</span>{" "}
                <span className="kpi-year">{date.getUTCFullYear()}</span>
              </>
            ) : (
              "—"
            )}
          </span>
          <span className="stat-l">dia {date ? date.getUTCDate() : "—"}</span>
        </div>
        <div className="stat stat-hero hero">
          <span className={"stat-v tone-" + critTone(c)}>{c.toFixed(2)}</span>
          <span className="stat-l">
            índice Kessler
            <InfoTip
              align="right"
              title="Índice Kessler (C)"
              intro="Mede se a órbita se auto-limpa ou dispara."
              tex={"C = \\alpha\\,\\tau\\,X"}
              where={[
                ["C", "criticalidade da faixa"],
                ["\\alpha", "coeficiente de colisão"],
                ["\\tau", "decaimento atmosférico (anos)"],
                ["X = D + \\kappa S", "população que de fato colide"],
              ]}
              note="Abaixo de 1, a atmosfera limpa mais rápido do que as colisões criam. Acima de 1, as colisões vencem — a cascata dispara sozinha."
            />
          </span>
        </div>
        <div className="stat stat-count">
          <span className="stat-v tone-sat">{live ? fmtCount(live.totalLaunched) : "—"}</span>
          <span className="stat-l">satélites lançados</span>
        </div>
        <div className="stat stat-count">
          <span className="stat-v tone-debris">{live ? fmtCount(live.totalLost) : "—"}</span>
          <span className="stat-l">perdidos em colisões</span>
        </div>
      </div>
    </header>
  );
}
