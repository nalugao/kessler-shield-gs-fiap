import { Link } from "react-router-dom";
import './problema.css'
import '../../index.css'

const Problema = () => {
    return (
        <section className="section" id="problema">
            <div className="wrap">
                <div className="split">

                    <div>
                        <span className="section-label">01 — O Problema</span>
                        <h2 className="section-title">
                            A Síndrome<br />de Kessler
                        </h2>
                        <p className="section-intro">
                            Uma reação em cadeia teórica em que a densidade de objetos na órbita
                            baixa é alta o suficiente para que colisões gerem mais detritos —
                            tornando faixas inteiras da órbita inutilizáveis por gerações.
                        </p>
                        <div className="section-link">
                            <Link to="/problema" className="btn btn--ghost">
                                Ver análise completa <span className="arrow">→</span>
                            </Link>
                        </div>
                    </div>

                    <div className="stat-grid">
                        <div className="stat-cell">
                            <div className="num">~40.000</div>
                            <div className="desc">objetos rastreados em órbita pelas redes de vigilância espacial</div>
                            <div className="src">Fonte: ESA Space Debris Office</div>
                        </div>
                        <div className="stat-cell">
                            <div className="num">&gt;1,2M</div>
                            <div className="desc">fragmentos maiores que 1 cm — pequenos demais para rastrear, letais o suficiente para destruir</div>
                            <div className="src">Fonte: ESA / Modelo MASTER</div>
                        </div>
                        <div className="stat-cell">
                            <div className="num">~10 km/s</div>
                            <div className="desc">velocidade média relativa de colisão — energia comparável a uma granada</div>
                            <div className="src">Fonte: NASA ODPO</div>
                        </div>
                        <div className="stat-cell">
                            <div className="num">~US$580M</div>
                            <div className="desc">mercado anual de seguro espacial sob risco crescente de sinistros</div>
                            <div className="src">Fonte: Análise de mercado</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Problema