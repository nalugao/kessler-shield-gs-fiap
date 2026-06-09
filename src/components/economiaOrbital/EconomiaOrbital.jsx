  import "./economiaOrbital.css";
  import CentroReceitas from "../centroReceitas/CentroReceitas";
  import { useLanguage } from "../context/LanguageContext";

  const ECONOMIA_ORBITAL_TEXT = {
    PT: {
      tag: "ECONOMIA ORBITAL",
      title: "FINANCIANDO O FUTURO DO ESPAÇO",
      description:
        "Três modelos complementares de receita. Uma única missão: manter a órbita terrestre segura para as próximas gerações.",
    },

    EN: {
      tag: "ORBITAL ECONOMY",
      title: "FINANCING THE FUTURE OF SPACE",
      description:
        "Three complementary revenue models. One single mission: keeping Earth's orbit safe for future generations.",
    },
  };

  export default function EconomiaOrbital() {
    const { language } = useLanguage();

    const text = ECONOMIA_ORBITAL_TEXT[language] || ECONOMIA_ORBITAL_TEXT.PT;

    return (
      <section className="finance-hero">
        <div className="finance-hero__content">
          <span className="finance-hero__tag">{text.tag}</span>

          <h1>{text.title}</h1>

          <p>{text.description}</p>
        </div>

        <CentroReceitas />
      </section>
    );
  }