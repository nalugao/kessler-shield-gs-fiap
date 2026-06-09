import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./financeiro.css";

const FINANCEIRO_TEXT = {
  PT: {
    label: "03 — Financeiro",
    title: "Três frentes de receita",
    intro:
      "Um modelo que monetiza a remoção de detritos por três ângulos complementares — risco, serviço e sustentabilidade.",
    button: "Ver projeção financeira",
    cards: [
      {
        tag: "B2B",
        title: "Seguradoras",
        description:
          "Redução de prêmios e sinistros para operadores de constelações. Cada detrito removido baixa a probabilidade de perda total de ativos em órbita.",
        metric: "US$580M",
        metricLabel: "mercado endereçável / ano",
      },
      {
        tag: "B2G",
        title: "ADR-as-a-Service",
        description:
          "Contratos de remoção sob demanda para agências espaciais e governos. Remoção priorizada de objetos de alto risco em órbitas críticas.",
        metric: "Por contrato",
        metricLabel: "contratos plurianuais",
      },
      {
        tag: "ESG",
        title: "Créditos Orbitais",
        description:
          "Tokenização de remoções verificadas como créditos de sustentabilidade orbital — um novo mercado análogo ao de carbono.",
        metric: "Novo mercado",
        metricLabel: "créditos verificáveis",
      },
    ],
  },

  EN: {
    label: "03 — Financial",
    title: "Three revenue streams",
    intro:
      "A model that monetizes debris removal through three complementary angles — risk, service and sustainability.",
    button: "See financial projection",
    cards: [
      {
        tag: "B2B",
        title: "Insurance companies",
        description:
          "Reduction of premiums and claims for constellation operators. Each removed debris object lowers the probability of total asset loss in orbit.",
        metric: "US$580M",
        metricLabel: "addressable market / year",
      },
      {
        tag: "B2G",
        title: "ADR-as-a-Service",
        description:
          "On-demand removal contracts for space agencies and governments. Prioritized removal of high-risk objects in critical orbits.",
        metric: "On contract",
        metricLabel: "multi-year contracts",
      },
      {
        tag: "ESG",
        title: "Orbital Credits",
        description:
          "Tokenization of verified removals as orbital sustainability credits — a new market similar to carbon credits.",
        metric: "New market",
        metricLabel: "verifiable credits",
      },
    ],
  },
};

const Financeiro = () => {
  const { language } = useLanguage();

  const text = FINANCEIRO_TEXT[language] || FINANCEIRO_TEXT.PT;

  return (
    <section className="section" id="financeiro">
      <div className="wrap">
        <div className="section-head">
          <p>{text.label}</p>

          <div className="badge-wrapper"></div>
                    <div className="divider"></div>


          <h2 className="section-title">{text.title}</h2>

          <p className="section-intro">{text.intro}</p>
        </div>

        <div className="rev-grid">
          {text.cards.map((card) => (
            <div className="rev-card" key={card.title}>
              <span className="rev-tag">{card.tag}</span>

              <h4>{card.title}</h4>

              <p>{card.description}</p>

              <div className="metric">
                {card.metric}
                <span>{card.metricLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="section-link">
          <Link to="/financeiro" className="btn btn--ghost">
            {text.button} <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Financeiro;