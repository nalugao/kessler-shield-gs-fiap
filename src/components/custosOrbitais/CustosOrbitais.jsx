import "./custosOrbitais.css";

const custos = [
  {
    nome: "Hardware",
    valor: "US$ 10–30",
    unidade: "milhões",
    detalhes: ["Satélite-caçador", "Sistema de captura", "Sensores orbitais"],
    explicacao:
      "Faixa estimada para spacecraft buses pequenos e subsistemas embarcados, baseada em referências públicas de SmallSats."
  },
  {
    nome: "Lançamento",
    valor: "US$ 350 mil–1,4",
    unidade: "milhão",
    detalhes: ["Carona espacial", "Inserção orbital", "Até ~200 kg"],
    explicacao:
      "Estimativa baseada em programas de carona espacial, nos quais múltiplas cargas compartilham o mesmo lançamento."
  },
  {
    nome: "Software",
    valor: "US$ 500 mil–3",
    unidade: "milhões",
    detalhes: ["Rastreamento", "Telemetria", "Motor de risco"],
    explicacao:
      "Estimativa acadêmica para sistemas de rastreamento, telemetria, análise de risco e interface de missão."
  }
];

export default function CustosOrbitais() {
  return (
    <section className="orbital-costs">
      <div className="costs-header">
        <span className="section-kicker">ESTRUTURA DE CUSTOS</span>

        <h2>
          Três camadas para
          <br />
          colocar a missão em órbita.
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
        SmallSats. Os valores não representam orçamento oficial do Kessler
        Shield.
      </p>
    </section>
  );
}