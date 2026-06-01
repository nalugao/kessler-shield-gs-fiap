import { Link } from "react-router-dom"
import './solucao.css'

const STEPS = [
    {
        num: "01",
        text: (
            <>
                A <strong>Nave-Mãe (Carrier)</strong> orbita em LEO carregando módulos
                de espuma e CubeSats de disparo
            </>
        ),
    },
    {
        num: "02",
        text: "Software de telemetria identifica detritos em rota de colisão com satélites ativos",
    },
    {
        num: "03",
        text: (
            <>
                Um <strong>CubeSat 12U</strong> é despachado e libera espuma expansível
                ao contato com o detrito
            </>
        ),
    },
    {
        num: "04",
        text: "O arrasto atmosférico aumentado pelo volume da espuma provoca a reentrada natural do detrito em semanas",
    },
];

const Solucao = () => {
    return (
        <section className="ks-section">
            <p className="section-label">02 — A Solução</p>
            <h2 className="section-title">
                Captura de detritos por Polímero Expansível
            </h2>
            <div className="linha" />
            <p className="section-body">
                Utilizamos polímero expansível (espuma) disparado por CubeSats para
                capturar e desorbitar detritos espaciais. Sem braços robóticos, sem
                risco de nova colisão.
            </p>

            <div className="card">
                {STEPS.map((step) => (
                    <div key={step.num} className="step">
                        <span className="stepNum">{step.num}</span>
                        <span className="stepText">{step.text}</span>
                    </div>
                ))}
            </div>

            <Link to="/solucao">
                <button className="btn-outline">Ver a solução completa →</button>
            </Link>
        </section>
    )
}

export default Solucao