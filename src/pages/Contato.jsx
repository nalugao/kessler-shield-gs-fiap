import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import NewsletterForm from "../components/contact/NewsletterForm";
import DonationForm from "../components/contact/DonationForm";

import "./contato.css";

export default function Contato() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState("newsletter");

  useEffect(() => {
    const hash = location.hash.replace("#", "");

    if (hash === "newsletter" || hash === "doacao") {
      setActiveForm(hash);
    }
  }, [location.hash]);

  function handleChangeForm(formName) {
    setActiveForm(formName);
    navigate(`/contato#${formName}`);
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <span className="section-tag">Contato</span>

        <h1>Conecte-se com a missão Kessler Shield</h1>

        <p>
          Receba novidades sobre o projeto, acompanhe os avanços da solução e
          entre em contato para apoiar a causa contra o lixo espacial.
        </p>

        <div className="contact-tabs">
          <button
            type="button"
            className={activeForm === "newsletter" ? "tab-button active" : "tab-button"}
            onClick={() => handleChangeForm("newsletter")}
          >
            Newsletter
          </button>

          <button
            type="button"
            className={activeForm === "doacao" ? "tab-button active" : "tab-button"}
            onClick={() => handleChangeForm("doacao")}
          >
            Doação / Investimento
          </button>
        </div>
      </section>

      {activeForm === "newsletter" && (
        <section id="newsletter" className="contact-section">
          <div className="contact-content">
            <div>
              <span className="section-tag">Newsletter</span>

              <h2>Receba atualizações da missão</h2>

              <p>
                Acompanhe lançamentos, resultados, estudos e novidades sobre o
                desenvolvimento do Kessler Shield.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </section>
      )}

      {activeForm === "doacao" && (
        <section id="doacao" className="contact-section">
          <div className="contact-content">
            <div>
              <span className="section-tag">Investir na causa</span>

              <h2>Apoie uma solução para proteger a órbita terrestre</h2>

              <p>
                Seja apoiador, investidor, parceiro acadêmico ou design partner
                na fase de demonstração orbital do projeto.
              </p>
            </div>

            <DonationForm />
          </div>
        </section>
      )}
    </main>
  );
}