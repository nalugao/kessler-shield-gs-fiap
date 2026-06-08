import { useMemo, useState } from "react";
import "./simuladorFinanceiro.css";
import terraImg from "../../assets/terra.gif";

export default function SimuladorFinanceiro() {
  const [removedDebris, setRemovedDebris] = useState(120);

  const dados = useMemo(() => {
    const riskReduction = Math.min(Math.round(removedDebris * 0.12), 72);
    const revenue = (removedDebris * 25000) / 1000000;
    const credits = Math.round(removedDebris * 3.5);
    const debrisLeft = Math.max(24 - Math.floor(removedDebris / 25), 4);

    return {
      riskReduction,
      revenue: revenue.toFixed(1),
      credits,
      debrisLeft
    };
  }, [removedDebris]);

  return (
    <section className="finance-simulator">
      <div className="simulator-content">
        <span className="section-kicker">SIMULADOR FINANCEIRO</span>

        <h2>
          Remova detritos.
          <br />
          Reduza risco.
          <br />
          Gere valor.
        </h2>

        <p>
          Ajuste a quantidade de detritos removidos e veja como o modelo
          financeiro do Kessler Shield reage em tempo real.
        </p>

        <div className="slider-area">
          <div className="slider-header">
            <span>Detritos removidos</span>
            <strong>{removedDebris}</strong>
          </div>

          <input
            type="range"
            min="0"
            max="500"
            value={removedDebris}
            onChange={(event) => setRemovedDebris(Number(event.target.value))}
          />
        </div>

        <div className="simulator-metrics">
          <article>
            <span>Redução de risco</span>
            <strong>{dados.riskReduction}%</strong>
          </article>

          <article>
            <span>Faturamento</span>
            <strong>US$ {dados.revenue}Milhões</strong>
          </article>

          <article>
            <span>Créditos orbitais</span>
            <strong>{dados.credits}</strong>
          </article>
        </div>
      </div>

      <div className="simulator-orbit" aria-label="Simulação orbital">
        <div className="simulator-earth">
        <img
          src={terraImg}
          alt="Planeta Terra"
          className="simulator-earth-img"
        />
      </div>

        {Array.from({ length: dados.debrisLeft }).map((_, index) => (
  <span
    key={`debris-${index}`}
    className="debris-dot"
    style={{
      "--angle": `${index * (360 / dados.debrisLeft)}deg`,
      "--radius": `calc(var(--debris-radius-base) + ${(index % 3) * 1.35}rem)`
    }}
  />
))}

{Array.from({ length: 7 }).map((_, index) => (
  <span
    key={`satellite-${index}`}
    className="protected-satellite"
    style={{
      "--angle": `${index * 52}deg`,
      "--radius": `calc(var(--satellite-radius-base) + ${(index % 2) * 2.8}rem)`
    }}
  />
))}
      </div>
    </section>
  );
}