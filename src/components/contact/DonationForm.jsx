import { useState } from "react";
import { saveLead, isValidEmail } from "../../data/formStorage";

export default function DonationForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipoInteresse: "",
    valor: "",
    mensagem: "",
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

    if (!formData.telefone.trim()) {
      newErrors.telefone = true;
    }

    if (!formData.tipoInteresse) {
      newErrors.tipoInteresse = true;
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = true;
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

    saveLead("kessler_donations", formData);

    setFeedback({
      type: "success",
      message: "Mensagem enviada! Entraremos em contato sobre a causa.",
    });

    setFormData({
      nome: "",
      email: "",
      telefone: "",
      tipoInteresse: "",
      valor: "",
      mensagem: "",
      autorizacao: false,
    });

    setErrors({});
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="donation-nome">Nome *</label>
          <input
            id="donation-nome"
            name="nome"
            type="text"
            placeholder="Digite seu nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? "input-error" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="donation-email">E-mail *</label>
          <input
            id="donation-email"
            name="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="donation-telefone">Telefone *</label>
          <input
            id="donation-telefone"
            name="telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
            className={errors.telefone ? "input-error" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="donation-tipo">Tipo de interesse *</label>
          <select
            id="donation-tipo"
            name="tipoInteresse"
            value={formData.tipoInteresse}
            onChange={handleChange}
            className={errors.tipoInteresse ? "input-error" : ""}
          >
            <option value="">Selecione uma opção</option>
            <option value="doacao">Doação</option>
            <option value="investidor">Investidor</option>
            <option value="design-partner">Design Partner</option>
            <option value="parceria">Parceria acadêmica</option>
            <option value="apoio-tecnico">Apoio técnico</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="donation-valor">Valor estimado ou forma de apoio</label>
        <input
          id="donation-valor"
          name="valor"
          type="text"
          placeholder="Ex: R$ 100, mentoria, tecnologia, divulgação..."
          value={formData.valor}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="donation-mensagem">Mensagem *</label>
        <textarea
          id="donation-mensagem"
          name="mensagem"
          placeholder="Conte como deseja apoiar o projeto"
          value={formData.mensagem}
          onChange={handleChange}
          className={errors.mensagem ? "input-error" : ""}
        />
      </div>

      <label
        className={
          errors.autorizacao
            ? "checkbox-group checkbox-error"
            : "checkbox-group"
        }
        htmlFor="donation-autorizacao"
      >
        <input
          id="donation-autorizacao"
          name="autorizacao"
          type="checkbox"
          checked={formData.autorizacao}
          onChange={handleChange}
        />
        <span>Autorizo o contato da equipe Kessler Shield. *</span>
      </label>

      <button type="submit" className="primary-button">
        Enviar interesse →
      </button>

      {feedback && (
        <p className={`form-feedback ${feedback.type}`}>
          {feedback.message}
        </p>
      )}
    </form>
  );
}