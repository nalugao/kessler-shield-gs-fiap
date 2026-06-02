import { Link } from "react-router-dom"
import './financeiro.css'

const Financeiro = () => {
    return (
        < section className="section" id="financeiro" >
            <div className="wrap">

                <div className="section-head">
                    <p>03 — Financeiro</p>
                    <div className="badge-wrapper">
                    </div>
                    <h2 className="section-title">Três frentes de receita</h2>
                    <p className="section-intro">Um modelo que monetiza a remoção de detritos por três ângulos complementares — risco, serviço e sustentabilidade.</p>
                </div>

                <div className="rev-grid">
                    <div className="rev-card">
                        <span className="rev-tag">B2B</span>
                        <h4>Seguradoras</h4>
                        <p>Redução de prêmios e sinistros para operadores de constelações. Cada detrito removido baixa a probabilidade de perda total de ativos em órbita.</p>
                        <div className="metric">
                            US$580M
                            <span>mercado endereçável / ano</span>
                        </div>
                    </div>
                    <div className="rev-card">
                        <span className="rev-tag">B2G</span>
                        <h4>ADR-as-a-Service</h4>
                        <p>Contratos de remoção sob demanda para agências espaciais e governos. Remoção priorizada de objetos de alto risco em órbitas críticas.</p>
                        <div className="metric">
                            € por missão
                            <span>contratos plurianuais</span>
                        </div>
                    </div>
                    <div className="rev-card">
                        <span className="rev-tag">ESG</span>
                        <h4>Créditos Orbitais</h4>
                        <p>Tokenização de remoções verificadas como créditos de sustentabilidade orbital — um novo mercado análogo ao de carbono.</p>
                        <div className="metric">
                            Novo mercado
                            <span>créditos verificáveis</span>
                        </div>
                    </div>
                </div>

                <div className="section-link">
                    <Link to="/financeiro" className="btn btn--ghost">
                        Ver projeção financeira <span className="arrow">→</span>
                    </Link>
                </div>

            </div>
        </section >
    )
}

export default Financeiro