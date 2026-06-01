import { Link } from "react-router-dom"
import './hero.css'
const Hero = () => {
    return (
        <section className="hero-page">
            <h1 className="hero-title">
                Kessler<br />
                <span className="hero-title-span">Shield</span>
            </h1>

            <p className="hero-subtitle">Captura de detritos por Polímero Expansível</p>

            <p className="hero-tagline">
                O espaço está ficando inacessível.{" "}
                <em className="hero-em">Cada colisão gera mil novos fragmentos.</em>
                <br />
                Nós encerramos esse ciclo antes que ele encerre o nosso acesso ao espaço.
            </p>

            <div className="hero-buttom">
                <Link to="/problema">
                    <button className="btn-primary">Entender o problema →</button>
                </Link>
                <Link to="/solucao">
                    <button className="btn-outline">Ver a solução</button>
                </Link>
            </div>

        </section>
    )
}

export default Hero