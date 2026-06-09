import { useLanguage } from "../context/LanguageContext";
import "./custosOrbitais.css";

const CUSTOS_TEXT = {
  PT: {
    kicker: "ESTRUTURA DE CUSTOS",
    title: "Três camadas para colocar a missão em órbita.",
    description:
      "Hardware, lançamento e software formam a base operacional do Kessler Shield — cada camada com impacto financeiro e técnico diferente.",
    note:
      "* Valores estimados para fins de prototipação acadêmica, baseados em referências públicas de mercado, programas rideshare e estudos sobre SmallSats. Os valores representam ordens de grandeza conceituais e não correspondem a orçamento oficial, cotação industrial ou custo final de missão do Kessler Shield.",
  },
  EN: {
    kicker: "COST STRUCTURE",
    title: "Three layers to put the mission into orbit.",
    description:
      "Hardware, launch and software form the operational base of Kessler Shield — each layer with a different financial and technical impact.",
    note:
      "* Estimated values for academic prototyping purposes, based on public market references, rideshare programs and SmallSat studies. These values represent conceptual orders of magnitude and do not correspond to an official budget, industrial quote or final mission cost for Kessler Shield.",
  },
};

const CUSTOS = {
  PT: [
    {
      nome: "Hardware",
      valor: "US$ 10–30",
      unidade: "milhões",
      detalhes: ["Plataforma SmallSat", "Sistema de captura", "Sensores e navegação orbital"],
      explicacao: "Faixa conceitual para um SmallSat mais sofisticado com subsistemas embarcados. O custo real depende de massa, propulsão, autonomia, redundância, TRL e complexidade da captura.",
    },
    {
      nome: "Lançamento",
      valor: "US$ 350 mil–1,4",
      unidade: "milhões",
      detalhes: ["Rideshare orbital", "Inserção em órbita baixa", "Referência até ~200 kg"],
      explicacao: "Estimativa baseada em referência pública de rideshare: US$ 350 mil para 50 kg e acréscimo por kg adicional. Não inclui todos os custos de integração, licenciamento, seguros e operação.",
    },
    {
      nome: "Software",
      valor: "US$ 500 mil–3",
      unidade: "milhões",
      detalhes: ["Rastreamento", "Telemetria", "Motor de risco e interface de missão"],
      explicacao: "Faixa conceitual para software de missão, simulação, telemetria, dashboard operacional e análise de risco. O custo real varia conforme criticidade, validação, integração com sensores e requisitos de segurança.",
    },
  ],
  EN: [
    {
      nome: "Hardware",
      valor: "US$ 10–30",
      unidade: "million",
      detalhes: ["SmallSat platform", "Capture system", "Sensors and orbital navigation"],
      explicacao: "Conceptual range for a more sophisticated SmallSat with embedded subsystems. Actual cost depends on mass, propulsion, autonomy, redundancy, TRL and capture complexity.",
    },
    {
      nome: "Launch",
      valor: "US$ 350K–1.4",
      unidade: "million",
      detalhes: ["Orbital rideshare", "Low orbit insertion", "Reference up to ~200 kg"],
      explicacao: "Estimate based on public rideshare reference: US$ 350K for 50 kg plus per-kg surcharge. Does not include all integration, licensing, insurance and operations costs.",
    },
    {
      nome: "Software",
      valor: "US$ 500K–3",
      unidade: "million",
      detalhes: ["Tracking", "Telemetry", "Risk engine and mission interface"],
      explicacao: "Conceptual range for mission software, simulation, telemetry, operational dashboard and risk analysis. Actual cost varies with criticality, validation, sensor integration and safety requirements.",
    },
  ],
};

export default function CustosOrbitais() {
  const { language } = useLanguage();

  const text = CUSTOS_TEXT[language] || CUSTOS_TEXT.PT;
  const custos = CUSTOS[language] || CUSTOS.PT;

  return (
    <section className="orbital-costs">
      <div className="costs-header">
        <span className="section-kicker">{text.kicker}</span>
        <h2>{text.title}</h2>
        <p>{text.description}</p>
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

      <p className="costs-note">{text.note}</p>
    </section>
  );
}