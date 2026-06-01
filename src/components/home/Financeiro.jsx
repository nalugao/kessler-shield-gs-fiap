import { Link } from "react-router-dom"
import './financeiro.css'

const REVENUE_MODELS = [
  {
    tag: "B2B",
    title: "Seguradoras",
    desc: "AXA XL, Munich Re — pagam para evitar apólices de $300M+",
  },
  {
    tag: "B2G",
    title: "ADR-aaS",
    desc: "NASA, ESA, Força Espacial — assinaturas anuais de órbitas limpas",
  },
  {
    tag: "ESG",
    title: "Créditos Orbitais",
    desc: "Créditos de limpeza orbital para operadoras como Starlink",
  },
];

const Financeiro = () => {
    return (
        <section className="ks-section">
            <p className="section-label">03 — Financeiro</p>
            <h2 className="section-title">
                Modelo de<br />Negócio
            </h2>
            <div className="linha" />

            <div className="partnerBadge">✦ Looking for design partners</div>

            <p className="section-body">
                Não vendemos &quot;limpeza do espaço&quot;. Vendemos{" "}
                <span className="highlight">redução de risco financeiro</span>{" "}
                para seguradoras, agências governamentais e operadoras de constelações.
            </p>

            <div className="finGrid">
                {REVENUE_MODELS.map((item) => (
                    <div key={item.tag} className="finItem">
                        <div className="tag">{item.tag}</div>
                        <div className="itemTitle">{item.title}</div>
                        <div className="itemDesc">{item.desc}</div>
                    </div>
                ))}
            </div>

            <Link to="/financeiro">
                <button className="btn-outline">Ver projeção financeira completa →</button>
            </Link>

        </section>
    )
}

export default Financeiro