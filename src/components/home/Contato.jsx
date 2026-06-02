import { Link } from "react-router-dom";
import './contato.css';
import '../../index.css'

const Contato = () => {
  return (
    <section className="section" id="contato">
      <div className="wrap">

        <div className="section-head">
          <p>05 — Contato</p>
          <h2 className="section-title">Junte-se à missão</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h4>Newsletter</h4>
            <p>Atualizações trimestrais sobre o desenvolvimento do projeto, marcos técnicos e o estado da órbita baixa.</p>
            <Link to="/contato">
                <button className="btn btn--primary">Assinar →</button>
            </Link>
          </div>
          <div className="contact-card">
            <h4>Investir na causa</h4>
            <p>Buscamos parceiros de design, investidores-anjo e agências interessadas em testar a remoção ativa de detritos.</p>
            <Link to="/contato">
                <button className="btn btn--primary">Falar com a equipe →</button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Contato