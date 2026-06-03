import "./custosOrbitais.css";

const custos = [
  {
    nome: "Hardware",
    nivel: 5,
    valor: "US$ 20M",
    detalhes: ["Satellite Hunter", "Foam Deployment", "Sensors"]
  },
  {
    nome: "Launch",
    nivel: 3,
    valor: "US$ 1.4M",
    detalhes: ["Rideshare", "Orbital insertion", "Mission logistics"]
  },
  {
    nome: "Software",
    nivel: 1,
    valor: "US$ 3M",
    detalhes: ["Tracking", "Telemetry", "Risk engine"]
  }
];

export default function CustosOrbitais() {
  return (
    <section className="orbital-costs">
      <div className="costs-header">
        <span className="section-kicker">ESTRUTURA DE CUSTOS</span>

        <h2>
          Cada órbita representa
          <br />
          uma camada de investimento.
        </h2>
      </div>

      <div className="costs-grid">
        {custos.map((custo) => (
          <article className="cost-item" key={custo.nome}>
            <span className="cost-name">{custo.nome}</span>

            <div className="cost-orbits">
              {Array.from({ length: custo.nivel }).map((_, index) => (
                <span key={index} />
              ))}
            </div>

            <div className="cost-details">
              <strong>{custo.valor}</strong>

              <ul>
                {custo.detalhes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}