import "./chamadaFinal.css";

export default function ChamadaFinal() {
  return (
    <section className="final-cta">
      <div className="cta-orbit">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            style={{
              "--angle": `${index * 20}deg`,
              "--delay": `${index * 0.12}s`
            }}
          />
        ))}
      </div>

      <div className="cta-content">
        <span className="section-kicker">ORBITAL SUSTAINABILITY</span>

        <h2>
          O futuro da economia espacial
          <br />
          depende de órbitas limpas.
        </h2>

        <p>
          Cada detrito removido protege satélites, comunicações, clima,
          navegação e a próxima geração de missões espaciais.
        </p>

        <a href="/contato" className="cta-button">
          Investir no Futuro <span>→</span>
        </a>
      </div>
    </section>
  );
}