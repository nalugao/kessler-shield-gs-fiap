/**
 * Bottom bar — fleet deployment, status, and playback controls.
 * Three clear zones: fleet actions | live status | simulation transport.
 */
import { HIGH_SHELL_INDEX, SHELLS } from "./sim/scenarios.js";
import { pointOfNoReturnDebris } from "./sim/project.js";

export default function Deck({ sim }) {
  const { playing, speedLabel, fleets, removal, controls, display } = sim;
  const high = display?.live?.shells?.[HIGH_SHELL_INDEX];
  const highConfig = SHELLS[HIGH_SHELL_INDEX];
  const debris = high?.D ?? 0;
  const retiringJunk = high ? (1 - highConfig.fDeorbit) * high.S / highConfig.Top : 0;
  const dragCleanup = high ? high.D / highConfig.tau : 0;
  const netGrowthAfterRemoval = high ? high.collisionRate + retiringJunk - dragCleanup - removal : 0;
  const tooLate = debris >= pointOfNoReturnDebris();
  const reverting = !tooLate && fleets > 0 && netGrowthAfterRemoval < -1;

  let statusText;
  let statusCls = "";
  if (tooLate) {
    statusText = "Ponto sem volta — a cascata é irreversível";
    statusCls = "bad";
  } else if (reverting) {
    statusText = `Revertendo — removendo ${Math.round(removal)} objetos/ano`;
    statusCls = "ok";
  } else if (fleets > 0) {
    statusText = `Removendo ${Math.round(removal)}/ano — ainda insuficiente`;
    statusCls = "warn";
  } else {
    statusText = "Sem intervenção — a cascata se aproxima";
  }

  return (
    <footer className="deck">
      {/* ---- fleet zone ---- */}
      <div className="deck-zone deck-fleet">
        <button className="btn-deploy" data-tour-id="deploy-fleet" onClick={controls.deployFleet}>
          + Implantar Frota
        </button>
        <span className="fleet-badge">
          {fleets === 0 ? "0" : fleets}
        </span>
        <button className="btn-text" onClick={controls.recallFleet} disabled={fleets === 0}>
          Recolher
        </button>
      </div>

      {/* ---- status zone ---- */}
      <div className="deck-zone deck-status">
        <span className={"status-dot " + (tooLate ? "dot-bad" : reverting ? "dot-ok" : fleets > 0 ? "dot-warn" : "dot-idle")} />
        <span className={"status-text " + statusCls}>{statusText}</span>
      </div>

      {/* ---- transport zone ---- */}
      <div className="deck-zone deck-transport" data-tour-id="transport-controls">
        <button className="btn-text" onClick={controls.toggle}>
          {playing ? "Pausar" : "Iniciar"}
        </button>
        <button className="btn-text mono" onClick={controls.cycleSpeed}>
          {speedLabel}
        </button>
        <button className="btn-text btn-reset" onClick={controls.reset}>
          Reiniciar
        </button>
        <a className="btn-exit" href="/" aria-label="Sair para o início">
          Sair
        </a>
      </div>
    </footer>
  );
}