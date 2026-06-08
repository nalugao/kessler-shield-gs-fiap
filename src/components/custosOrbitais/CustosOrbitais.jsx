import { useLanguage } from "../context/LanguageContext";
import "./custosOrbitais.css";
import { getCustos } from "../../data/custos";

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

export default function CustosOrbitais() {
  const { language } = useLanguage();

  const text = CUSTOS_TEXT[language] || CUSTOS_TEXT.PT;
  const custos = getCustos(language);

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