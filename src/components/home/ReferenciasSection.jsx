import { useMemo } from "react";
import { Link } from "react-router-dom";
import Reveal from "../Reveal.jsx";
import RefCard from "../RefCard.jsx";
import { getReferences } from "../../data/references.js";
import { useLanguage } from "../context/LanguageContext";
import "./referenciasSection.css";

const SECTION_TEXT = {
  PT: {
    eyebrow: "04 — Referências",
    title: "Base científica",
    intro:
      "Cada número deste projeto é rastreável até uma fonte primária. Uma seleção das principais.",
    button: "Ver todas as referências",
  },

  EN: {
    eyebrow: "04 — References",
    title: "Scientific basis",
    intro:
      "Every number in this project can be traced back to a primary source. Here is a selection of the main ones.",
    button: "See all references",
  },
};

export default function ReferenciasSection() {
  const { language } = useLanguage();

  const text = SECTION_TEXT[language] || SECTION_TEXT.PT;

  const references = useMemo(() => {
    return getReferences(language);
  }, [language]);

  return (
    <section className="section section--alt" id="referencias">
      <div className="wrap">
        <Reveal className="section-head">
          <p>{text.eyebrow}</p>

          <h2 className="section-title">{text.title}</h2>

          <p className="section-intro">{text.intro}</p>
        </Reveal>

        <Reveal className="ref-grid">
          {references.slice(0, 4).map((reference) => (
            <RefCard key={reference.id} data={reference} variant="preview" />
          ))}
        </Reveal>

        <Reveal style={{ marginTop: "2.5rem" }}>
          <Link to="/referencias" className="btn btn--ghost">
            {text.button} <span className="arrow">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}