import { createContext, useContext, useState } from "react";

const translations = {
  PT: {
    navInicio: "Início",
    navSolucao: "Solução",
    navFinanceiro: "Financeiro",
    navReferencias: "Referências",
    navContato: "Contato",
    navSimulador: "Simulador",

    contatoTag: "Contato",
    contatoTitulo: "Conecte-se com a missão Kessler Shield",
    contatoTexto:
      "Receba novidades sobre o projeto, acompanhe os avanços da solução e entre em contato para apoiar a causa contra o lixo espacial.",

    tabNewsletter: "Newsletter",
    tabDoacao: "Doação / Investimento",

    newsletterTag: "Newsletter",
    newsletterTitulo: "Receba atualizações da missão",
    newsletterTexto:
      "Acompanhe lançamentos, resultados, estudos e novidades sobre o desenvolvimento do Kessler Shield.",

    investirTag: "Investir na causa",
    investirTitulo: "Apoie uma solução para proteger a órbita terrestre",
    investirTexto:
      "Seja apoiador, investidor, parceiro acadêmico ou design partner na fase de demonstração orbital do projeto.",

    nome: "Nome",
    email: "E-mail",
    telefone: "Telefone",
    tipoInteresse: "Tipo de interesse",
    valor: "Valor estimado ou forma de apoio",
    mensagem: "Mensagem",

    placeholderNome: "Digite seu nome",
    placeholderEmail: "seuemail@exemplo.com",
    placeholderTelefone: "(11) 99999-9999",
    placeholderValor: "Ex: R$ 100, mentoria, tecnologia, divulgação...",
    placeholderMensagem: "Conte como deseja apoiar o projeto",

    selecioneOpcao: "Selecione uma opção",
    opcaoDoacao: "Doação",
    opcaoInvestidor: "Investidor",
    opcaoDesignPartner: "Design Partner",
    opcaoParceria: "Parceria acadêmica",
    opcaoApoioTecnico: "Apoio técnico",

    autorizoNewsletter:
      "Autorizo o recebimento de novidades sobre o projeto.",
    autorizoContato: "Autorizo o contato da equipe Kessler Shield.",

    btnAssinar: "Assinar newsletter",
    btnEnviarInteresse: "Enviar interesse",

    erroCampos: "Preencha corretamente os campos obrigatórios.",
    sucessoNewsletter:
      "Inscrição realizada! Você receberá novidades sobre o projeto.",
    sucessoDoacao:
      "Mensagem enviada! Entraremos em contato sobre a causa.",

    homeNewsletterTitulo: "Newsletter",
    homeNewsletterTexto:
      "Receba atualizações sobre o projeto, lançamentos e resultados das missões.",
    homeInvestirTitulo: "Investir na causa",
    homeInvestirTexto:
      "Seja um design partner ou apoiador da nossa fase de demonstração orbital.",
    homeBtnAssinar: "Assinar",
    homeBtnContato: "Entrar em contato",

    refHeroLabel: "04 — Referências",
    refHeroTitleBase: "Base",
    refHeroTitleAccent: "Científica",
    refHeroDescription:"Todos os dados do Kessler Shield foram verificados contra fontes primárias — agências espaciais, corretores especializados e literatura acadêmica revisada por pares. Números incorretos foram corrigidos e sinalizados.",
    contactSectionNumber: "05 — Contato",
    contactTitle: "Junte-se à missão",
    contactSubtitle:"Receba novidades do projeto ou fale com a equipe sobre possíveis parcerias, investimento e apoio à solução.",
    contactNewsletterTag: "Atualizações",
    contactNewsletterTitle: "Newsletter",
    contactNewsletterText:"Receba novidades sobre o desenvolvimento do Kessler Shield, marcos técnicos, pesquisa e riscos relacionados ao lixo espacial.",
    contactNewsletterButton: "Assinar",
    contactInvestTag: "Parcerias",
    contactInvestTitle: "Investir na causa",
    contactInvestText:"Buscamos parceiros de design, investidores-anjo, apoiadores e instituições interessadas em testar soluções contra detritos orbitais.",
    contactInvestButton: "Falar com a equipe",
  newsletterFormTag: "Newsletter",
  newsletterFormTitle: "Receber novidades",
  newsletterNameLabel: "Nome",
  newsletterNamePlaceholder: "Digite seu nome",
  newsletterEmailLabel: "E-mail",
  newsletterEmailPlaceholder: "seuemail@exemplo.com",
  newsletterPermission:"Autorizo o envio de novidades sobre o projeto.",
  newsletterSuccess: "Inscrição realizada com sucesso!",
  newsletterSubmit: "Assinar newsletter",
  investFormTag: "Parcerias",
  investFormTitle: "Falar com a equipe",
  investNameLabel: "Nome",
  investNamePlaceholder: "Digite seu nome",
  investEmailLabel: "E-mail",
  investEmailPlaceholder: "seuemail@exemplo.com",
  investPhoneLabel: "Telefone",
  investPhonePlaceholder: "(00) 00000-0000",
  investInterestLabel: "Tipo de interesse",
  investInterestDefault: "Selecione uma opção",
  investInterestInvestor: "Investidor",
  investInterestPartner: "Parceiro de design",
  investInterestResearch: "Pesquisa acadêmica",
  investInterestAgency: "Agência ou instituição",
  investInterestOther: "Outro",
  investMessageLabel: "Mensagem",
  investMessagePlaceholder:"Conte como você gostaria de contribuir com o projeto",
  investPermission:"Autorizo a equipe a entrar em contato comigo.",
  investSuccess:"Mensagem enviada com sucesso! Nossa equipe entrará em contato.",
investSubmit: "Enviar interesse",
formCloseLabel: "Fechar formulário",
errorName: "Informe seu nome.",
errorEmailRequired: "Informe seu e-mail.",
errorEmailInvalid: "Informe um e-mail válido.",
errorNewsletterPermission:
  "Você precisa autorizar o envio de novidades.",
errorInterest: "Selecione o tipo de interesse.",
errorMessage: "Escreva uma mensagem.",
errorContactPermission: "Você precisa autorizar o contato.",
    footerImpact: "Quando a órbita se torna infraestrutura, protegê-la vira missão.",
    footerDescription:"O Kessler Shield é uma proposta acadêmica para informar, simular e apresentar soluções contra o crescimento do lixo espacial em órbita terrestre.",
    footerStatus: "Missão em desenvolvimento",
    footerNavigationTitle: "Navegação",
    footerActionTitle: "Ação",
    footerContactTitle: "Contato",
    footerNewsletter: "Receber novidades",
    footerInvest: "Investir na causa",
    footerScientificBase: "Base científica",
    footerAcademicProject: "Projeto acadêmico",
    footerRights: "Todos os direitos reservados.",
    footerNote: "Construído para proteger o futuro das missões espaciais.",
    footerSimulator: "Acessar simulador",
  },

  EN: {
    navInicio: "Home",
    navSolucao: "Solution",
    navFinanceiro: "Financial",
    navReferencias: "References",
    navContato: "Contact",
    navSimulador: "Simulator",
    contatoTag: "Contact",
    contatoTitulo: "Connect with the Kessler Shield mission",
    contatoTexto:"Receive project updates, follow the solution progress and get in touch to support the fight against space debris.",
    tabNewsletter: "Newsletter",
    tabDoacao: "Donation / Investment",
    newsletterTag: "Newsletter",
    newsletterTitulo: "Receive mission updates",
    newsletterTexto:"Follow launches, results, studies and updates about the development of Kessler Shield.",
    investirTag: "Invest in the cause",
    investirTitulo: "Support a solution to protect Earth orbit",
    investirTexto:"Become a supporter, investor, academic partner or design partner in the project's orbital demonstration phase.",
    nome: "Name",
    email: "Email",
    telefone: "Phone",
    tipoInteresse: "Type of interest",
    valor: "Estimated amount or type of support",
    mensagem: "Message",
    placeholderNome: "Enter your name",
    placeholderEmail: "youremail@example.com",
    placeholderTelefone: "+55 11 99999-9999",
    placeholderValor: "Ex: $100, mentorship, technology, promotion...",
    placeholderMensagem: "Tell us how you want to support the project",
    selecioneOpcao: "Select an option",
    opcaoDoacao: "Donation",
    opcaoInvestidor: "Investor",
    opcaoDesignPartner: "Design Partner",
    opcaoParceria: "Academic partnership",
    opcaoApoioTecnico: "Technical support",
    autorizoNewsletter:"I authorize receiving updates about the project.",
    autorizoContato: "I authorize the Kessler Shield team to contact me.",
    btnAssinar: "Subscribe to newsletter",
    btnEnviarInteresse: "Send interest",
    erroCampos: "Please fill in the required fields correctly.",
    sucessoNewsletter:"Subscription completed! You will receive updates about the project.",
    sucessoDoacao:"Message sent! We will contact you about the cause.",
    homeNewsletterTitulo: "Newsletter",
    homeNewsletterTexto:"Receive updates about the project, launches and mission results.",
    homeInvestirTitulo: "Invest in the cause",
    homeInvestirTexto:"Become a design partner or supporter of our orbital demonstration phase.",
    homeBtnAssinar: "Subscribe",
    homeBtnContato: "Contact us",
    refHeroLabel: "04 — References",
    refHeroTitleBase: "Scientific",
    refHeroTitleAccent: "Basis",
    refHeroDescription:"All Kessler Shield data was verified against primary sources — space agencies, specialized brokers and peer-reviewed academic literature. Incorrect numbers were corrected and flagged.",
    contactSectionNumber: "05 — Contact",
contactTitle: "Join the mission",
contactSubtitle:"Get project updates or talk to our team about partnerships, investment and support for the solution.",
contactNewsletterTag: "Updates",
contactNewsletterTitle: "Newsletter",
contactNewsletterText:"Get updates about Kessler Shield development, technical milestones, research and risks related to space debris.",
contactNewsletterButton: "Subscribe",
contactInvestTag: "Partnerships",
contactInvestTitle: "Invest in the cause",
contactInvestText:"We are looking for design partners, angel investors, supporters and institutions interested in testing solutions against orbital debris.",
contactInvestButton: "Talk to the team",
newsletterFormTag: "Newsletter",
newsletterFormTitle: "Get updates",
newsletterNameLabel: "Name",
newsletterNamePlaceholder: "Enter your name",
newsletterEmailLabel: "Email",
newsletterEmailPlaceholder: "youremail@example.com",
newsletterPermission:"I authorize receiving updates about the project.",
newsletterSuccess: "Subscription completed successfully!",
newsletterSubmit: "Subscribe to newsletter",
investFormTag: "Partnerships",
investFormTitle: "Talk to the team",
investNameLabel: "Name",
investNamePlaceholder: "Enter your name",
investEmailLabel: "Email",
investEmailPlaceholder: "youremail@example.com",
investPhoneLabel: "Phone",
investPhonePlaceholder: "+1 000 000 0000",
investInterestLabel: "Type of interest",
investInterestDefault: "Select an option",
investInterestInvestor: "Investor",
investInterestPartner: "Design partner",
investInterestResearch: "Academic research",
investInterestAgency: "Agency or institution",
investInterestOther: "Other",
investMessageLabel: "Message",
investMessagePlaceholder:"Tell us how you would like to contribute to the project",
investPermission:"I authorize the team to contact me.",
investSuccess:"Message sent successfully! Our team will contact you.",
investSubmit: "Send interest",
formCloseLabel: "Close form",
errorName: "Enter your name.",
errorEmailRequired: "Enter your email.",
errorEmailInvalid: "Enter a valid email.",
errorNewsletterPermission:"You need to authorize receiving updates.",
errorInterest: "Select the type of interest.",
errorMessage: "Write a message.",
errorContactPermission: "You need to authorize contact.",
    footerImpact: "When orbit becomes infrastructure, protecting it becomes a mission.",
    footerDescription:"Kessler Shield is an academic proposal designed to inform, simulate and present solutions against the growth of space debris in Earth orbit.",
    footerStatus: "Mission in development",
    footerNavigationTitle: "Navigation",
    footerActionTitle: "Action",
    footerContactTitle: "Contact",
    footerNewsletter: "Receive updates",
    footerInvest: "Invest in the cause",
    footerScientificBase: "Scientific basis",
    footerAcademicProject: "Academic project",
    footerRights: "All rights reserved.",
    footerNote: "Built to protect the future of space missions.", 
    footerSimulator: "Open simulator",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("kessler_language") || "PT";
  });

  function changeLanguage(newLanguage) {
    setLanguage(newLanguage);
    localStorage.setItem("kessler_language", newLanguage);
  }

  function toggleLanguage() {
    changeLanguage(language === "PT" ? "EN" : "PT");
  }

  function t(key) {
    return translations[language][key] || key;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}