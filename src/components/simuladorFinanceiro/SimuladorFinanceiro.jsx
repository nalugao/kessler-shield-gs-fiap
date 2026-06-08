import { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./simuladorFinanceiro.css";
import terraImg from "../../assets/terra.gif";

const SIMULADOR_FINANCEIRO_TEXT = {
  PT: {
    kicker: "SIMULADOR FINANCEIRO",
    titleLine1: "Remova detritos.",
    titleLine2: "Reduza risco.",
    titleLine3: "Gere valor.",
    description:
      "Ajuste a quantidade de detritos removidos e veja como o modelo financeiro do Kessler Shield reage em tempo real.",
    sliderLabel: "Detritos removidos",
    riskReduction: "Redução de risco",
    revenue: "Faturamento",
    revenueUnit: "Milhões",
    orbitalCredits: "Créditos orbitais",
    orbitAriaLabel: "Simulação orbital",
    earthAlt: "Planeta Terra",
  },

  EN: {
    kicker: "FINANCIAL SIMULATOR",
    titleLine1: "Remove debris.",
    titleLine2: "Reduce risk.",
    titleLine3: "Generate value.",
    description:
      "Adjust the amount of removed debris and see how Kessler Shield's financial model reacts in real time.",
    sliderLabel: "Removed debris",
    riskReduction: "Risk reduction",
    revenue: "Revenue",
    revenueUnit: "Million",
    orbitalCredits: "Orbital credits",
    orbitAriaLabel: "Orbital simulation",
    earthAlt: "Planet Earth",
  },
};

export default function SimuladorFinanceiro() {
  const { language } = useLanguage();
  const text =
    SIMULADOR_FINANCEIRO_TEXT[language] || SIMULADOR_FINANCEIRO_TEXT.PT;

  const [removedDebris, setRemovedDebris] = useState(120);

  const dados = useMemo(() => {
    const riskReduction = Math.min(Math.round(removedDebris * 0.12), 72);
    const revenue = (removedDebris * 25000) / 1000000;
    const credits = Math.round(removedDebris * 3.5);
    const debrisLeft = Math.max(24 - Math.floor(removedDebris / 25), 4);

    return {
      riskReduction,
      revenue: revenue.toFixed(1),
      credits,
      debrisLeft,
    };
  }, [removedDebris]);

  return (
    <section className="finance-simulator">
      <div className="simulator-content">
        <span className="section-kicker">{text.kicker}</span>

        <h2>
          {text.titleLine1}
          <br />
          {text.titleLine2}
          <br />
          {text.titleLine3}
        </h2>

        <p>{text.description}</p>

        <div className="slider-area">
          <div className="slider-header">
            <span>{text.sliderLabel}</span>
            <strong>{removedDebris}</strong>
          </div>

          <input
            type="range"
            min="0"
            max="500"
            value={removedDebris}
            onChange={(event) => setRemovedDebris(Number(event.target.value))}
            aria-label={text.sliderLabel}
          />
        </div>

        <div className="simulator-metrics">
          <article>
            <span>{text.riskReduction}</span>
            <strong>{dados.riskReduction}%</strong>
          </article>

          <article>
            <span>{text.revenue}</span>
            <strong>
              US$ {dados.revenue} {text.revenueUnit}
            </strong>
          </article>

          <article>
            <span>{text.orbitalCredits}</span>
            <strong>{dados.credits}</strong>
          </article>
        </div>
      </div>

      <div className="simulator-orbit" aria-label={text.orbitAriaLabel}>
        <div className="simulator-earth">
          <img
            src={terraImg}
            alt={text.earthAlt}
            className="simulator-earth-img"
          />
        </div>

        {Array.from({ length: dados.debrisLeft }).map((_, index) => (
          <span
            key={`debris-${index}`}
            className="debris-dot"
            style={{
              "--angle": `${index * (360 / dados.debrisLeft)}deg`,
              "--radius": `calc(var(--debris-radius-base) + ${
                (index % 3) * 1.35
              }rem)`,
            }}
          />
        ))}

        {Array.from({ length: 7 }).map((_, index) => (
          <span
            key={`satellite-${index}`}
            className="protected-satellite"
            style={{
              "--angle": `${index * 52}deg`,
              "--radius": `calc(var(--satellite-radius-base) + ${
                (index % 2) * 2.8
              }rem)`,
            }}
          />
        ))}
      </div>
    </section>
  );
}