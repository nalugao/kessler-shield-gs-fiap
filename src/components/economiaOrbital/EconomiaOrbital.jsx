import "./economiaOrbital.css";
import CentroReceitas from "../centroReceitas/CentroReceitas";

export default function EconomiaOrbital() {
  return (
    <section className="finance-hero">
      <div className="finance-hero__content">
        <span className="finance-hero__tag">ECONOMIA ORBITAL</span>

        <h1>
          FINANCIANDO O FUTURO DO ESPAÇO
        </h1>

        <p>
          Três modelos complementares de receita. Uma única missão: manter a
          órbita terrestre segura para as próximas gerações.
        </p>

       
      </div>

      <CentroReceitas />
    </section>
  );
}
