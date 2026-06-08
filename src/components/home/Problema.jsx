import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./problema.css";
import "../../index.css";

const PROBLEMA_TEXT = {
  PT: {
    label: "01 — O Problema",
    title: (
      <>
        A Síndrome
        <br />
        de Kessler
      </>
    ),
    intro:
      "Uma reação em cadeia teórica em que a densidade de objetos na órbita baixa é alta o suficiente para que colisões gerem mais detritos — tornando faixas inteiras da órbita inutilizáveis por gerações.",
    button: "Ver análise completa",
    stats: [
      {
        value: "~40.000",
        desc: "objetos rastreados em órbita pelas redes de vigilância espacial",
        source: "Fonte: ESA Space Debris Office",
      },
      {
        value: ">1,2M",
        desc: "fragmentos maiores que 1 cm — pequenos demais para rastrear, letais o suficiente para destruir",
        source: "Fonte: ESA / Modelo MASTER",
      },
      {
        value: "~10 km/s",
        desc: "velocidade média relativa de colisão — energia comparável a uma granada",
        source: "Fonte: NASA ODPO",
      },
      {
        value: "~US$580M",
        desc: "mercado anual de seguro espacial sob risco crescente de sinistros",
        source: "Fonte: Análise de mercado",
      },
    ],
  },

  EN: {
    label: "01 — The Problem",
    title: (
      <>
        The Kessler
        <br />
        Syndrome
      </>
    ),
    intro:
      "A theoretical chain reaction in which the density of objects in low Earth orbit becomes high enough for collisions to generate even more debris — making entire orbital regions unusable for generations.",
    button: "See full analysis",
    stats: [
      {
        value: "~40,000",
        desc: "objects tracked in orbit by space surveillance networks",
        source: "Source: ESA Space Debris Office",
      },
      {
        value: ">1.2M",
        desc: "fragments larger than 1 cm — too small to track, but lethal enough to destroy",
        source: "Source: ESA / MASTER Model",
      },
      {
        value: "~10 km/s",
        desc: "average relative collision speed — energy comparable to a grenade",
        source: "Source: NASA ODPO",
      },
      {
        value: "~US$580M",
        desc: "annual space insurance market under growing claims risk",
        source: "Source: Market analysis",
      },
    ],
  },
};

const Problema = () => {
  const { language } = useLanguage();

  const text = PROBLEMA_TEXT[language] || PROBLEMA_TEXT.PT;

  return (
    <section className="section" id="problema">
      <div className="wrap">
        <div className="split">
          <div>
            <span className="section-label">{text.label}</span>

            <h2 className="section-title">{text.title}</h2>

            <p className="section-intro">{text.intro}</p>

            <div className="section-link">
              <Link to="/problema" className="btn btn--ghost">
                {text.button} <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="stat-grid">
            {text.stats.map((stat) => (
              <div className="stat-cell" key={stat.value}>
                <div className="num">{stat.value}</div>
                <div className="desc">{stat.desc}</div>
                <div className="src">{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problema;