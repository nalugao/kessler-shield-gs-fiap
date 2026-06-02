import { Link } from 'react-router-dom';
import Reveal from '../Reveal.jsx';
import RefCard from '../RefCard.jsx';
import { REFERENCES } from '../../data/references.js';
import './referenciasSection.css';

export default function ReferenciasSection() {
  return (
    <section className="section section--alt" id="referencias">
      <div className="wrap">
        <Reveal className="section-head">
          <p>04 — Referências</p>
          <h2 className="section-title">Base científica</h2>
          <p className="section-intro">Cada número deste projeto é rastreável até uma fonte primária. Uma seleção das principais.</p>
        </Reveal>
        <Reveal className="ref-grid">
          {REFERENCES.slice(0, 4).map((r) => (
            <RefCard key={r.id} data={r} variant="preview" />
          ))}
        </Reveal>
        <Reveal style={{ marginTop: '2.5rem' }}>
          <Link to="/referencias" className="btn btn--ghost">Ver todas as referências <span className="arrow">→</span></Link>
        </Reveal>
      </div>
    </section>
  );
}
