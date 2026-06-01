import { useState } from "react";
import { saveLead, isValidEmail } from "../../data/formStorage";

export default function NewsletterForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    autorizacao: false,
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: false,
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = true;
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      newErrors.email = true;
    }

    if (!formData.autorizacao) {
      newErrors.autorizacao = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      setFeedback({
        type: "error",
        message: "Preencha corretamente os campos obrigatórios.",
      });
      return;
    }

    saveLead("kessler_newsletter", formData);

    setFeedback({
      type: "success",
      message: "Inscrição realizada! Você receberá novidades sobre o projeto.",
    });

    setFormData({
      nome: "",
      email: "",
      autorizacao: false,
    });

    setErrors({});
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="newsletter-nome">Nome *</label>
        <input
          id="newsletter-nome"
          name="nome"
          type="text"
          placeholder="Digite seu nome"
          value={formData.nome}
          onChange={handleChange}
          className={errors.nome ? "input-error" : ""}
        />
      </div>

      <div className="form-group">
        <label htmlFor="newsletter-email">E-mail *</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
      </div>

      <label
        className={
          errors.autorizacao
            ? "checkbox-group checkbox-error"
            : "checkbox-group"
        }
        htmlFor="newsletter-autorizacao"
      >
        <input
          id="newsletter-autorizacao"
          name="autorizacao"
          type="checkbox"
          checked={formData.autorizacao}
          onChange={handleChange}
        />
        <span>Autorizo o recebimento de novidades sobre o projeto. *</span>
      </label>

      <button type="submit" className="primary-button">
        Assinar newsletter →
      </button>

      {feedback && (
        <p className={`form-feedback ${feedback.type}`}>
          {feedback.message}
        </p>
      )}
    </form>
  );
}