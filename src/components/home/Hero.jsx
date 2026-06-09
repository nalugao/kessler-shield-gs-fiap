import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./hero.css";
<<<<<<< Updated upstream
=======
import OrbitalVis from "./OrbitalVis";
>>>>>>> Stashed changes

const HERO_TEXT = {
  PT: {
    titlePartOne: "KESSLER",
    titlePartTwo: "SHIELD",
    subtitle: "Captura de detritos por Polímero Expansível",
    taglineStart: "O espaço está ficando inacessível.",
    taglineStrong: "Cada colisão gera mil novos fragmentos.",
    taglineEnd:
      "Nós encerramos esse ciclo antes que ele encerre o nosso acesso ao espaço.",
<<<<<<< Updated upstream
    primaryButton: "Entenda o problema",
    secondaryButton: "Conheça o sistema",
    statsTitle: "Entenda o projeto",
    videoTitle: "Kessler Shield",
=======
    primaryButton: "Conheça o sistema",
    secondaryButton: "Entenda o problema",
    stats: [
      {
        value: "40K",
        label: "objetos rastreados",
      },
      {
        value: "1,2M+",
        label: "fragmentos >1cm",
      },
      {
        value: "10 km/s",
        label: "velocidade de impacto",
      },
    ],
>>>>>>> Stashed changes
  },

  EN: {
    titlePartOne: "KESSLER",
    titlePartTwo: "SHIELD",
    subtitle: "Debris capture through Expandable Polymer",
    taglineStart: "Space is becoming inaccessible.",
    taglineStrong: "Each collision creates thousands of new fragments.",
<<<<<<< Updated upstream
    taglineEnd: "We stop this cycle before it ends our access to space.",
    primaryButton: "Understand the problem",
    secondaryButton: "Explore the system",
    statsTitle: "Understand the project",
    videoTitle: "Kessler Shield",
=======
    taglineEnd:
      "We stop this cycle before it ends our access to space.",
    primaryButton: "Explore the system",
    secondaryButton: "Understand the problem",
    stats: [
      {
        value: "40K",
        label: "tracked objects",
      },
      {
        value: "1.2M+",
        label: "fragments >1cm",
      },
      {
        value: "10 km/s",
        label: "impact speed",
      },
    ],
>>>>>>> Stashed changes
  },
};

const Hero = () => {
  const { language } = useLanguage();

  const text = HERO_TEXT[language] || HERO_TEXT.PT;

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title">
              {text.titlePartOne}
              <span className="mint">{text.titlePartTwo}</span>
            </h1>

            <p className="hero-sub">{text.subtitle}</p>

            <p className="hero-tagline">
              {text.taglineStart}{" "}
              <strong>{text.taglineStrong}</strong>{" "}
              {text.taglineEnd}
            </p>

            <div className="hero-cta">
<<<<<<< Updated upstream
              <Link to="/#problema" className="btn btn--primary">
                {text.primaryButton}
              </Link>

              <Link to="/#solucao" className="btn btn--outline">
                {text.secondaryButton} <span className="arrow">→</span>
              </Link>
            </div>

            <div className="hero-stats">
              <h2 className="stats-title">{text.statsTitle}</h2>

              <div className="hero-video">
                <iframe
                  src="https://www.youtube.com/embed/SEU_ID_AQUI"
                  title={text.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
=======
              <Link to="/#solucao" className="btn btn--primary">
                {text.primaryButton} <span className="arrow">→</span>
              </Link>

              <Link to="/problema" className="btn btn--outline">
                {text.secondaryButton}
              </Link>
            </div>

            <div className="hero-stats">
              {text.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="s-num">{stat.value}</div>
                  <div className="s-lab">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <OrbitalVis />
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;