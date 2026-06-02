import "./economiaOrbital.css";
import CentroReceitas from "../centroReceitas/CentroReceitas";

export default function EconomiaOrbital() {
  return (
    <section className="finance-hero">

      <div className="finance-hero__content">

        <span className="finance-hero__tag">
          ECONOMIA ORBITAL
        </span>

        <h1>
          FINANCIANDO
          <br />
          O FUTURO
          <br />
          DO ESPAÇO
        </h1>

        <p>
          Três modelos complementares de receita.
          Uma única missão:
          manter a órbita terrestre segura para as próximas gerações.
        </p>

        <button className="finance-hero__button">
          Explorar Modelos de Receita
        </button>

      </div>

      <CentroReceitas />

    </section>
  );
}