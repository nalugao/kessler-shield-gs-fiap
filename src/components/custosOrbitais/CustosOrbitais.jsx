import "./custosOrbitais.css";
import custos from "../../data/custos";


export default function CustosOrbitais() {
  return (
    <section className="orbital-costs">
      <div className="costs-header">
        <span className="section-kicker">ESTRUTURA DE CUSTOS</span>

        <h2>
          Três camadas para colocar a missão em órbita.
        </h2>

        <p>
          Hardware, lançamento e software formam a base operacional do Kessler
          Shield — cada camada com impacto financeiro e técnico diferente.
        </p>
      </div>

      <div className="costs-grid">
        {custos.map((custo) => (
          <article className="cost-item" key={custo.nome}>
            <div className="cost-top">
              <span className="cost-name">{custo.nome}</span>
            </div>

            <div className="cost-main-value">
              <strong>{custo.valor}</strong>
              <span className="cost-unit">{custo.unidade}</span>
            </div>

            <div className="cost-details">
              <ul>
                {custo.detalhes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p>{custo.explicacao}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="costs-note">
        * Valores estimados para fins de prototipação acadêmica, baseados em
          referências públicas de mercado, programas rideshare e estudos sobre
          SmallSats. Os valores representam ordens de grandeza conceituais e não
          correspondem a orçamento oficial, cotação industrial ou custo final de missão
          do Kessler Shield.
      </p>
    </section>
  );
}