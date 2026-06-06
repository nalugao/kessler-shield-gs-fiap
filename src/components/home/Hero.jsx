import { Link } from "react-router-dom"
import './hero.css'
import OrbitalVis from "./OrbitalVis"

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
                <Link to="/#solucao" className="btn btn--primary">Conheça o sistema <span className="arrow">→</span></Link>
                <Link to="/#problema" className="btn btn--outline">Entenda o problema</Link>
              </div>
              <div className="hero-stats">
                <div><div className="s-num">40K</div><div className="s-lab">objetos rastreados</div></div>
                <div><div className="s-num">1,2M+</div><div className="s-lab">fragmentos &gt;1cm</div></div>
                <div><div className="s-num">10 km/s</div><div className="s-lab">velocidade de impacto</div></div>
              </div>
            </div>
            <div className="hero-visual"><OrbitalVis /></div>
          </div>
        </div>
      </section>
    )
}

export default Hero