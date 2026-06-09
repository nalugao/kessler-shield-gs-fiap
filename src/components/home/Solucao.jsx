import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./solucao.css";

const STEPS = {
  PT: [
    [
      "1",
      "Aproximação",
      "O satélite-caçador identifica o detrito e ajusta sua trajetória até uma janela de captura segura.",
    ],
    [
      "2",
      "Disparo da espuma",
      "O polímero é ejetado e expande em segundos, envolvendo o detrito numa esfera macia e aderente.",
    ],
    [
      "3",
      "Aumento de arrasto",
      "A esfera multiplica a área de superfície, elevando o arrasto atmosférico residual da órbita baixa.",
    ],
    [
      "4",
      "Reentrada",
      "O conjunto perde altitude de forma controlada e queima por completo na atmosfera. Ciclo encerrado.",
    ],
  ],

  EN: [
    [
      "1",
      "Approach",
      "The chaser satellite identifies the debris and adjusts its trajectory until it reaches a safe capture window.",
    ],
    [
      "2",
      "Foam deployment",
      "The polymer is ejected and expands within seconds, surrounding the debris in a soft and adhesive sphere.",
    ],
    [
      "3",
      "Drag increase",
      "The sphere multiplies the surface area, increasing the residual atmospheric drag in low Earth orbit.",
    ],
    [
      "4",
      "Reentry",
      "The combined object loses altitude in a controlled way and burns up completely in the atmosphere. Cycle complete.",
    ],
  ],
};

const SOLUCAO_TEXT = {
  PT: {
    eyebrow: "02 — A Solução",
    title: "Captura de detritos por Polímero Expansível",
    intro:
      "Um polímero expansível — espuma — projetado para capturar, frear e desorbitar detritos sem fragmentá-los. Captura passiva, sem garras, sem propelente de manobra fina.",
    button: "Ver a solução completa",
  },

  EN: {
    eyebrow: "02 — The Solution",
    title: "Debris capture through Expandable Polymer",
    intro:
      "An expandable polymer — foam — designed to capture, slow down and deorbit debris without fragmenting it. Passive capture, no claws, no fine maneuvering propellant.",
    button: "See the full solution",
  },
};

const Solucao = () => {
  const { language } = useLanguage();

  const text = SOLUCAO_TEXT[language] || SOLUCAO_TEXT.PT;
  const steps = STEPS[language] || STEPS.PT;

  return (
    <section className="section section--alt" id="solucao">
      <div className="wrap">
        <div className="section-head">
          <p>{text.eyebrow}</p>
          <div className="divider"></div>

          <h2 className="section-title">{text.title}</h2>

          <p className="section-intro">{text.intro}</p>
        </div>

        <div className="steps">
          {steps.map(([number, title, description]) => (
            <div className="step" key={number}>
              <div className="step-num">{number}</div>

              <span className="step-line" />

              <h4>{title}</h4>

              <p>{description}</p>
            </div>
          ))}
        </div>

        <div className="solucao-link">
          <Link to="/solucao" className="btn btn--ghost">
            {text.button} <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Solucao;