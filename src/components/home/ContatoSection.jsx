import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./contato.css";
import "../../index.css";

const initialNewsletter = {
  nome: "",
  email: "",
  autorizacao: false,
};

const initialInvestimento = {
  nome: "",
  email: "",
  telefone: "",
  tipoInteresse: "",
  mensagem: "",
  autorizacao: false,
};

const ContatoSection = () => {
  const { t } = useLanguage();

  const [activeForm, setActiveForm] = useState(null);

  const [newsletter, setNewsletter] = useState(initialNewsletter);
  const [investimento, setInvestimento] = useState(initialInvestimento);

  const [newsletterErrors, setNewsletterErrors] = useState({});
  const [investimentoErrors, setInvestimentoErrors] = useState({});

  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [investimentoSuccess, setInvestimentoSuccess] = useState(false);

  useEffect(() => {
    function openFormByHash() {
      const hash = window.location.hash.replace("#", "");

      if (hash === "newsletter") {
        setActiveForm("newsletter");

        setTimeout(() => {
          document.getElementById("newsletter-form")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      }

      if (hash === "doacao") {
        setActiveForm("investimento");

        setTimeout(() => {
          document.getElementById("investimento-form")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      }
    }

    openFormByHash();

    window.addEventListener("hashchange", openFormByHash);

    return () => {
      window.removeEventListener("hashchange", openFormByHash);
    };
  }, []);

  function createId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function openForm(formName) {
    setActiveForm(formName);

    setTimeout(() => {
      const targetId =
        formName === "newsletter" ? "newsletter-form" : "investimento-form";

      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function closeForm() {
    setActiveForm(null);
    setNewsletterErrors({});
    setInvestimentoErrors({});
    setNewsletterSuccess(false);
    setInvestimentoSuccess(false);
  }

  function handleNewsletterChange(event) {
    const { name, value, type, checked } = event.target;

    setNewsletter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleInvestimentoChange(event) {
    const { name, value, type, checked } = event.target;

    setInvestimento((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validateNewsletter() {
    const errors = {};

    if (!newsletter.nome.trim()) {
      errors.nome = t("errorName");
    }

    if (!newsletter.email.trim()) {
      errors.email = t("errorEmailRequired");
    } else if (!isValidEmail(newsletter.email)) {
      errors.email = t("errorEmailInvalid");
    }

    if (!newsletter.autorizacao) {
      errors.autorizacao = t("errorNewsletterPermission");
    }

    return errors;
  }

  function validateInvestimento() {
    const errors = {};

    if (!investimento.nome.trim()) {
      errors.nome = t("errorName");
    }

    if (!investimento.email.trim()) {
      errors.email = t("errorEmailRequired");
    } else if (!isValidEmail(investimento.email)) {
      errors.email = t("errorEmailInvalid");
    }

    if (!investimento.tipoInteresse) {
      errors.tipoInteresse = t("errorInterest");
    }

    if (!investimento.mensagem.trim()) {
      errors.mensagem = t("errorMessage");
    }

    if (!investimento.autorizacao) {
      errors.autorizacao = t("errorContactPermission");
    }

    return errors;
  }

  function saveToLocalStorage(key, data) {
    const currentData = JSON.parse(localStorage.getItem(key)) || [];

    const newData = {
      id: createId(),
      ...data,
      criadoEm: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify([...currentData, newData]));
  }

  function handleNewsletterSubmit(event) {
    event.preventDefault();

    const errors = validateNewsletter();
    setNewsletterErrors(errors);

    if (Object.keys(errors).length > 0) {
      setNewsletterSuccess(false);
      return;
    }

    saveToLocalStorage("kessler_newsletter", newsletter);

    setNewsletter(initialNewsletter);
    setNewsletterErrors({});
    setNewsletterSuccess(true);
  }

  function handleInvestimentoSubmit(event) {
    event.preventDefault();

    const errors = validateInvestimento();
    setInvestimentoErrors(errors);

    if (Object.keys(errors).length > 0) {
      setInvestimentoSuccess(false);
      return;
    }

    saveToLocalStorage("kessler_investidores", investimento);

    setInvestimento(initialInvestimento);
    setInvestimentoErrors({});
    setInvestimentoSuccess(true);
  }

  return (
    <section className="section contact-section" id="contato">
      <div className="wrap">
        <div className="section-head">
          <p>{t("contactSectionNumber")}</p>

          <h2 className="section-title">{t("contactTitle")}</h2>

          <span className="contact-subtitle">{t("contactSubtitle")}</span>
        </div>

        <div className="contact-grid">
          <article
            className={
              activeForm === "newsletter"
                ? "contact-card contact-card-active"
                : "contact-card"
            }
            id="newsletter"
          >
            <div className="contact-card-header">
              <span className="contact-card-tag">
                {t("contactNewsletterTag")}
              </span>

              <h4>{t("contactNewsletterTitle")}</h4>
            </div>

            <p>{t("contactNewsletterText")}</p>

            <button
              type="button"
              className="btn btn--primary contact-open-button"
              onClick={() => openForm("newsletter")}
            >
              {t("contactNewsletterButton")} →
            </button>
          </article>

          <article
            className={
              activeForm === "investimento"
                ? "contact-card contact-card-active"
                : "contact-card"
            }
            id="doacao"
          >
            <div className="contact-card-header">
              <span className="contact-card-tag">{t("contactInvestTag")}</span>

              <h4>{t("contactInvestTitle")}</h4>
            </div>

            <p>{t("contactInvestText")}</p>

            <button
              type="button"
              className="btn btn--primary contact-open-button"
              onClick={() => openForm("investimento")}
            >
              {t("contactInvestButton")} →
            </button>
          </article>
        </div>

        {activeForm === "newsletter" && (
          <div className="contact-form-panel" id="newsletter-form">
            <div className="form-panel-header">
              <div>
                <span className="contact-card-tag">
                  {t("newsletterFormTag")}
                </span>

                <h3>{t("newsletterFormTitle")}</h3>
              </div>

              <button
                type="button"
                className="form-close-button"
                onClick={closeForm}
                aria-label={t("formCloseLabel")}
              >
                ×
              </button>
            </div>

            <form className="contact-form" onSubmit={handleNewsletterSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newsletter-nome">
                    {t("newsletterNameLabel")}
                  </label>

                  <input
                    id="newsletter-nome"
                    type="text"
                    name="nome"
                    placeholder={t("newsletterNamePlaceholder")}
                    value={newsletter.nome}
                    onChange={handleNewsletterChange}
                    className={newsletterErrors.nome ? "input-error" : ""}
                  />

                  {newsletterErrors.nome && (
                    <small>{newsletterErrors.nome}</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newsletter-email">
                    {t("newsletterEmailLabel")}
                  </label>

                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder={t("newsletterEmailPlaceholder")}
                    value={newsletter.email}
                    onChange={handleNewsletterChange}
                    className={newsletterErrors.email ? "input-error" : ""}
                  />

                  {newsletterErrors.email && (
                    <small>{newsletterErrors.email}</small>
                  )}
                </div>
              </div>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="autorizacao"
                  checked={newsletter.autorizacao}
                  onChange={handleNewsletterChange}
                />

                <span>{t("newsletterPermission")}</span>
              </label>

              {newsletterErrors.autorizacao && (
                <small className="checkbox-error">
                  {newsletterErrors.autorizacao}
                </small>
              )}

              {newsletterSuccess && (
                <div className="form-success">{t("newsletterSuccess")}</div>
              )}

              <button type="submit" className="btn btn--primary form-submit">
                {t("newsletterSubmit")} →
              </button>
            </form>
          </div>
        )}

        {activeForm === "investimento" && (
          <div className="contact-form-panel" id="investimento-form">
            <div className="form-panel-header">
              <div>
                <span className="contact-card-tag">{t("investFormTag")}</span>

                <h3>{t("investFormTitle")}</h3>
              </div>

              <button
                type="button"
                className="form-close-button"
                onClick={closeForm}
                aria-label={t("formCloseLabel")}
              >
                ×
              </button>
            </div>

            <form className="contact-form" onSubmit={handleInvestimentoSubmit}>
              <div className="form-group">
                <label htmlFor="investimento-nome">
                  {t("investNameLabel")}
                </label>

                <input
                  id="investimento-nome"
                  type="text"
                  name="nome"
                  placeholder={t("investNamePlaceholder")}
                  value={investimento.nome}
                  onChange={handleInvestimentoChange}
                  className={investimentoErrors.nome ? "input-error" : ""}
                />

                {investimentoErrors.nome && (
                  <small>{investimentoErrors.nome}</small>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="investimento-email">
                    {t("investEmailLabel")}
                  </label>

                  <input
                    id="investimento-email"
                    type="email"
                    name="email"
                    placeholder={t("investEmailPlaceholder")}
                    value={investimento.email}
                    onChange={handleInvestimentoChange}
                    className={investimentoErrors.email ? "input-error" : ""}
                  />

                  {investimentoErrors.email && (
                    <small>{investimentoErrors.email}</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="investimento-telefone">
                    {t("investPhoneLabel")}
                  </label>

                  <input
                    id="investimento-telefone"
                    type="tel"
                    name="telefone"
                    placeholder={t("investPhonePlaceholder")}
                    value={investimento.telefone}
                    onChange={handleInvestimentoChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tipoInteresse">
                  {t("investInterestLabel")}
                </label>

                <select
                  id="tipoInteresse"
                  name="tipoInteresse"
                  value={investimento.tipoInteresse}
                  onChange={handleInvestimentoChange}
                  className={
                    investimentoErrors.tipoInteresse ? "input-error" : ""
                  }
                >
                  <option value="">{t("investInterestDefault")}</option>
                  <option value="investidor">
                    {t("investInterestInvestor")}
                  </option>
                  <option value="parceiro">
                    {t("investInterestPartner")}
                  </option>
                  <option value="pesquisa">
                    {t("investInterestResearch")}
                  </option>
                  <option value="agencia">{t("investInterestAgency")}</option>
                  <option value="outro">{t("investInterestOther")}</option>
                </select>

                {investimentoErrors.tipoInteresse && (
                  <small>{investimentoErrors.tipoInteresse}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="investimento-mensagem">
                  {t("investMessageLabel")}
                </label>

                <textarea
                  id="investimento-mensagem"
                  name="mensagem"
                  placeholder={t("investMessagePlaceholder")}
                  rows="5"
                  value={investimento.mensagem}
                  onChange={handleInvestimentoChange}
                  className={investimentoErrors.mensagem ? "input-error" : ""}
                ></textarea>

                {investimentoErrors.mensagem && (
                  <small>{investimentoErrors.mensagem}</small>
                )}
              </div>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="autorizacao"
                  checked={investimento.autorizacao}
                  onChange={handleInvestimentoChange}
                />

                <span>{t("investPermission")}</span>
              </label>

              {investimentoErrors.autorizacao && (
                <small className="checkbox-error">
                  {investimentoErrors.autorizacao}
                </small>
              )}

              {investimentoSuccess && (
                <div className="form-success">{t("investSuccess")}</div>
              )}

              <button type="submit" className="btn btn--primary form-submit">
                {t("investSubmit")} →
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContatoSection;