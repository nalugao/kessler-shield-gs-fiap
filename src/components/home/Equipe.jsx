import { useLanguage } from "../context/LanguageContext";
import "./equipe.css";

const EQUIPE_TEXT = {
  PT: {
    label: "06 — Quem Somos",
    title: "A EQUIPE",
    intro:
      "Estudantes de engenharia da FIAP construindo o futuro da limpeza orbital.",
    photoFallback: "Foto",
  },

  EN: {
    label: "06 — About Us",
    title: "THE TEAM",
    intro:
      "FIAP engineering students building the future of orbital cleanup.",
    photoFallback: "Photo",
  },
};

const MEMBROS = {
  PT: [
    {
      id: 1,
      foto: "/images/sophi.png",
      nome: "Sophia Coelho",
      cargo: "Front-end & Acessibilidade",
      descricao:
        "Responsável pela criação da área de contato. Também contribuiu com a acessibilidade, responsividade e tradução das telas. Colaborou também na correção de bugs críticos da aplicação.",
    },
    {
      id: 2,
      foto: "/images/nat.png",
      nome: "Natalia Lugão",
      cargo: "Front-end & Identidade Visual",
      descricao:
        "Responsável pelo desenvolvimento do front-end e identidade visual do projeto, garantindo uma experiência de usuário moderna, responsiva e visualmente consistente.",
    },
    {
      id: 3,
      foto: "/images/gab.png",
      nome: "Gabriel Soares",
      cargo: "Front-end & Design System",
      descricao:
        "Desenvolveu a página de Solução e a seção Quem Somos, construindo layouts em React com CSS Grid e responsividade mobile-first. Colaborou também na correção de bugs críticos da aplicação.",
    },
    {
      id: 4,
      foto: "/images/jeff.png",
      nome: "Jefferson Gomes",
      cargo: "Front-end & UI/UX",
      descricao:
        "Responsável pela criação da página financeira, aplicando responsividade mobile-first, organização de componentes em React, animações com Framer Motion, integração de assets visuais e padronização tipográfica.",
    },
    {
      id: 5,
      foto: "/images/andre.png",
      nome: "André Melo",
      cargo: "Desenvolvimento Criativo",
      descricao:
        "Responsável pelo desenvolvimento criativo do projeto, contribuindo para a apresentação da proposta, narrativa do problema e comunicação da solução.",
    },
  ],

  EN: [
    {
      id: 1,
      foto: "/images/sophi.png",
      nome: "Sophia Coelho",
      cargo: "Front-end & Accessibility",
      descricao:
        "Responsible for creating the contact area. Also contributed to accessibility, responsiveness and screen translation. Collaborated on fixing critical application bugs as well.",
    },
    {
      id: 2,
      foto: "/images/nat.png",
      nome: "Natália Lugão",
      cargo: "Front-end & Visual Identity",
      descricao:
        "Responsible for front-end development and the project’s visual identity, ensuring a modern, responsive and visually consistent user experience.",
    },
    {
      id: 3,
      foto: "/images/gab.png",
      nome: "Gabriel Soares",
      cargo: "Front-end & Design System",
      descricao:
        "Developed the Solution page and the About Us section, building React layouts with CSS Grid and mobile-first responsiveness. Also collaborated on fixing critical application bugs.",
    },
    {
      id: 4,
      foto: "/images/jeff.png",
      nome: "Jefferson Gomes",
      cargo: "Front-end & UI/UX",
      descricao:
        "Responsible for creating the financial page, applying mobile-first responsiveness, React component organization, Framer Motion animations, visual asset integration and typographic standardization.",
    },
    {
      id: 5,
      foto: "/images/andre.png",
      nome: "André Melo",
      cargo: "Pitch & Creative Development",
      descricao:
        "Responsible for the project’s creative development and pitch structure, contributing to the presentation of the proposal, problem narrative and solution communication.",
    },
  ],
};

const MembroCard = ({ membro, photoFallback }) => {
  return (
    <div className="membro-card">
      <div className="membro-foto">
        {membro.foto ? (
          <img src={membro.foto} alt={membro.nome} />
        ) : (
          <span>{photoFallback}</span>
        )}
      </div>

      <div className="membro-info">
        <h3 className="membro-nome">{membro.nome}</h3>
        <span className="membro-cargo">{membro.cargo}</span>
        <p className="membro-desc">{membro.descricao}</p>
      </div>
    </div>
  );
};

const Equipe = () => {
  const { language } = useLanguage();

  const text = EQUIPE_TEXT[language] || EQUIPE_TEXT.PT;
  const membros = MEMBROS[language] || MEMBROS.PT;

  return (
    <section className="section section--alt" id="quem-somos">
      <div className="wrap">
        <div className="section-head">
          <span className="label">{text.label}</span>

          <div className="divider"></div>

          <h2 className="section-title">{text.title}</h2>

          <p className="section-intro">{text.intro}</p>
        </div>

        <div className="equipe-grid">
          {membros.map((membro) => (
            <MembroCard
              key={membro.id}
              membro={membro}
              photoFallback={text.photoFallback}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Equipe;