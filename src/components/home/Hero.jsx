import { Link } from "react-router-dom"
import './hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title">KESSLER<span className="mint">SHIELD</span></h1>
            <p className="hero-sub">Captura de detritos por Polímero Expansível</p>
            <p className="hero-tagline">
              O espaço está ficando inacessível. <strong>Cada colisão gera mil novos fragmentos.</strong> Nós encerramos esse ciclo antes que ele encerre o nosso acesso ao espaço.
            </p>
            <div className="hero-cta">
              <Link to="/#problema" className="btn btn--primary">Entenda o problema</Link>
              <Link to="/#solucao" className="btn btn--outline">Conheça o sistema <span className="arrow">→</span></Link>
            </div>
            <div className="hero-stats">
              <h2 className="stats-title">Entenda o projeto</h2>
              <div className="hero-video">
                <iframe
                  src="https://www.youtube.com/embed/SEU_ID_AQUI"
                  title="Kessler Shield"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero