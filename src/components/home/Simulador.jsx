import { Link } from 'react-router-dom';
import Reveal from '../Reveal.jsx';
import './simulador.css';

export default function Simulador() {
  return (
    <section className="section sim-cta-section" id="simulador">
      <div className="wrap">
        <Reveal className="sim-cta">
          <div className="sim-cta-orbit" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <ellipse cx="100" cy="100" rx="82" ry="34" fill="none" stroke="rgba(125,232,200,0.35)" strokeWidth="1" transform="rotate(-22 100 100)" />
              <ellipse cx="100" cy="100" rx="60" ry="78" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" transform="rotate(18 100 100)" />
              <circle cx="100" cy="100" r="16" fill="none" stroke="var(--mint)" strokeWidth="1" />
              <circle cx="100" cy="100" r="4" fill="var(--mint)" />
              <g className="orbit-rot spin-2"><circle cx="170" cy="86" r="3.5" fill="var(--danger)" /></g>
              <g className="orbit-rot spin-1"><rect x="18" y="97" width="9" height="6" rx="1" fill="var(--mint)" /></g>
            </svg>
          </div>
          <div className="sim-cta-body">
            <span className="label">Ferramenta interativa</span>
            <h2 className="sim-cta-title">Veja a <span className="mint">Síndrome de Kessler</span> em ação</h2>
            <p className="sim-cta-text">Ajuste a densidade orbital, dispare colisões e observe a reação em cadeia se propagar em tempo real. Depois, ative o Poly-Catch System e veja a diferença.</p>
          </div>
          <div className="sim-cta-action">
            <Link to="/simulador" className="btn btn--primary btn--lg">Abrir o simulador <span className="arrow">→</span></Link>
            <span className="sim-cta-note">Sem instalação · roda no navegador</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}