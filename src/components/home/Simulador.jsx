import { Link } from "react-router-dom";
import Reveal from "../Reveal.jsx";
import { useLanguage } from "../context/LanguageContext";
import "./simulador.css";

const SIMULADOR_TEXT = {
  PT: {
    label: "Ferramenta interativa",
    titleStart: "Veja a",
    titleHighlight: "Síndrome de Kessler",
    titleEnd: "em ação",
    description:
      "Ajuste a densidade orbital, dispare colisões e observe a reação em cadeia se propagar em tempo real. Depois, ative o Poly-Catch System e veja a diferença.",
    button: "Abrir o simulador",
    note: "Sem instalação · roda no navegador",
  },

  EN: {
    label: "Interactive tool",
    titleStart: "See the",
    titleHighlight: "Kessler Syndrome",
    titleEnd: "in action",
    description:
      "Adjust orbital density, trigger collisions and watch the chain reaction spread in real time. Then activate the Poly-Catch System and see the difference.",
    button: "Open simulator",
    note: "No installation · runs in the browser",
  },
};

export default function Simulador() {
  const { language } = useLanguage();

  const text = SIMULADOR_TEXT[language] || SIMULADOR_TEXT.PT;

  return (
    <section className="section sim-cta-section" id="simulador">
      <div className="wrap">
        <Reveal className="sim-cta">
          <div className="sim-cta-orbit" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <ellipse
                cx="100"
                cy="100"
                rx="82"
                ry="34"
                fill="none"
                stroke="rgba(125,232,200,0.35)"
                strokeWidth="1"
                transform="rotate(-22 100 100)"
              />

              <ellipse
                cx="100"
                cy="100"
                rx="60"
                ry="78"
                fill="none"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1"
                transform="rotate(18 100 100)"
              />

              <circle
                cx="100"
                cy="100"
                r="16"
                fill="none"
                stroke="var(--mint)"
                strokeWidth="1"
              />

              <circle cx="100" cy="100" r="4" fill="var(--mint)" />

              <g className="orbit-rot spin-2">
                <circle cx="170" cy="86" r="3.5" fill="var(--danger)" />
              </g>

              <g className="orbit-rot spin-1">
                <rect
                  x="18"
                  y="97"
                  width="9"
                  height="6"
                  rx="1"
                  fill="var(--mint)"
                />
              </g>
            </svg>
          </div>

          <div className="sim-cta-body">
            <span className="label">{text.label}</span>

            <h2 className="sim-cta-title">
              {text.titleStart}{" "}
              <span className="mint">{text.titleHighlight}</span>{" "}
              {text.titleEnd}
            </h2>

            <p className="sim-cta-text">{text.description}</p>
          </div>

          <div className="sim-cta-action">
            <Link to="/simulador" className="btn btn--primary btn--lg">
              {text.button} <span className="arrow">→</span>
            </Link>

            <span className="sim-cta-note">{text.note}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}