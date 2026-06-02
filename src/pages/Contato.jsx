import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../components/context/LanguageContext";
import NewsletterForm from "../components/contact/NewsletterForm";
import DonationForm from "../components/contact/DonationForm";
import "./contato.css";

export default function Contato() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
        <span className="section-tag">{t("contatoTag")}</span>

        <h1>{t("contatoTitulo")}</h1>

        <p>{t("contatoTexto")}</p>

        <div className="contact-tabs">
          <button
            type="button"
            className={activeForm === "newsletter" ? "tab-button active" : "tab-button"}
            onClick={() => handleChangeForm("newsletter")}
          >
            {t("tabNewsletter")}
          </button>

          <button
            type="button"
            className={activeForm === "doacao" ? "tab-button active" : "tab-button"}
            onClick={() => handleChangeForm("doacao")}
          >
            {t("tabDoacao")}
          </button>
        </div>
      </section>

      {activeForm === "newsletter" && (
        <section id="newsletter" className="contact-section">
          <div className="contact-content">
            <div>
              <span className="section-tag">{t("newsletterTag")}</span>

              <h2>{t("newsletterTitulo")}</h2>

              <p>{t("newsletterTexto")}</p>
            </div>

            <NewsletterForm />
          </div>
        </section>
      )}

      {activeForm === "doacao" && (
        <section id="doacao" className="contact-section">
          <div className="contact-content">
            <div>
              <span className="section-tag">{t("investirTag")}</span>

              <h2>{t("investirTitulo")}</h2>

              <p>{t("investirTexto")}</p>
            </div>

            <DonationForm />
          </div>
        </section>
      )}
    </main>
  );
}