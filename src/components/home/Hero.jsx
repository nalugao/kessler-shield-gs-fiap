import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./hero.css";

const HERO_TEXT = {
  PT: {
    titlePartOne: "KESSLER",
    titlePartTwo: "SHIELD",
    subtitle: "Captura de detritos por Polímero Expansível",
    taglineStart: "O espaço está ficando inacessível.",
    taglineStrong: "Cada colisão gera mil novos fragmentos.",
    taglineEnd:
      "Nós encerramos esse ciclo antes que ele encerre o nosso acesso ao espaço.",
    primaryButton: "Conheça o sistema",
    secondaryButton: "Entenda o problema",
    statsTitle: "Entenda o projeto",
    videoTitle: "Kessler Shield",
  },

  EN: {
    titlePartOne: "KESSLER",
    titlePartTwo: "SHIELD",
    subtitle: "Debris capture through Expandable Polymer",
    taglineStart: "Space is becoming inaccessible.",
    taglineStrong: "Each collision creates thousands of new fragments.",
    taglineEnd: "We stop this cycle before it ends our access to space.",
    primaryButton: "Explore the system",
    secondaryButton: "Understand the problem",
    statsTitle: "Understand the project",
    videoTitle: "Kessler Shield",
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
              {text.taglineStart} <strong>{text.taglineStrong}</strong>{" "}
              {text.taglineEnd}
            </p>

            <div className="hero-cta">
              <Link to="/#solucao" className="btn btn--primary">
                {text.primaryButton} <span className="arrow">→</span>
              </Link>

              <Link to="/#problema" className="btn btn--outline">
                {text.secondaryButton}
              </Link>
            </div>

            <div className="hero-video-area">
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
          </div>

          <div className="hero-visual">
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;