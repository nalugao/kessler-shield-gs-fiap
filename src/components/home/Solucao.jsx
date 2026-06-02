import { Link } from "react-router-dom"
import './solucao.css'

const STEPS = [
    ['1', 'Aproximação', 'O satélite-caçador identifica o detrito e ajusta sua trajetória até uma janela de captura segura.'],
    ['2', 'Disparo da espuma', 'O polímero é ejetado e expande em segundos, envolvendo o detrito numa esfera macia e aderente.'],
    ['3', 'Aumento de arrasto', 'A esfera multiplica a área de superfície, elevando o arrasto atmosférico residual da órbita baixa.'],
    ['4', 'Reentrada', 'O conjunto perde altitude de forma controlada e queima por completo na atmosfera. Ciclo encerrado.'],
];

const Solucao = () => {
    return (
        <section className="section section--alt" id="solucao">
            <div className="wrap">

                <div className="section-head">
                    <p>02 — A Solução</p>
                    <h2 className="section-title">Captura de detritos por Polímero Expansível</h2>
                    <p className="section-intro">Um polímero expansível — espuma — projetado para capturar, frear e desorbitar detritos sem fragmentá-los. Captura passiva, sem garras, sem propelente de manobra fina.</p>
                </div>

                <div className="steps">
                    {STEPS.map(([n, h, p]) => (
                        <div className="step" key={n}>
                            <div className="step-num">{n}</div>
                            <span className="step-line" />
                            <h4>{h}</h4>
                            <p>{p}</p>
                        </div>
                    ))}
                </div>

                <div className="solucao-link">
                    <Link to="/#solucao" className="btn btn--ghost">
                        Ver a solução completa <span className="arrow">→</span>
                    </Link>
                </div>

            </div>
        </section>
    )
}

export default Solucao