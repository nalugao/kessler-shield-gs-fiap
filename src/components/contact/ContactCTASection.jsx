import { Link } from "react-router-dom";
import "../../pages/contato.css";

export default function ContactCTASection() {
  return (
    <section className="home-contact-section">
      <article className="home-contact-card">
        <h3>Newsletter</h3>

        <p>
          Receba atualizações sobre o projeto, lançamentos e resultados das
          missões.
        </p>

        <Link to="/contato#newsletter" className="outline-button">
          Assinar →
        </Link>
      </article>

      <article className="home-contact-card">
        <h3>Investir na causa</h3>

        <p>
          Seja um design partner ou apoiador da nossa fase de demonstração
          orbital.
        </p>

        <Link to="/contato#doacao" className="primary-button small">
          Entrar em contato →
        </Link>
      </article>
    </section>
  );
}