import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import "./equipe.css";

const SOCIAL_LINKS = {
  andre: {
    linkedin: "https://www.linkedin.com/in/andr%C3%A9-melo-44b333a5",
    github: "https://github.com/andrefxm",
  },
  gabriel: {
    linkedin: "https://www.linkedin.com/in/gabriel-soares-1a63712bb/",
    github: "https://github.com/GabrielSiSo",
  },
  jefferson: {
    linkedin: "https://www.linkedin.com/in/jefferson-g-silva",
    github: "https://github.com/Jeffergs",
  },
  natalia: {
    linkedin: "https://linkedin.com/in/natalia-lugao",
    github: "https://github.com/nalugao",
  },
  sophia: {
    linkedin: "https://www.linkedin.com/in/sophia-heringer/",
    github: "https://github.com/Sophia-Coelho",
  },
};

const EQUIPE_TEXT = {
  PT: {
    label: "06 — Quem Somos",
    title: "A EQUIPE",
    intro:
      "Estudantes de engenharia da FIAP construindo o futuro da limpeza orbital.",
    photoFallback: "Foto",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
  },

  EN: {
    label: "06 — About Us",
    title: "THE TEAM",
    intro:
      "FIAP engineering students building the future of orbital cleanup.",
    photoFallback: "Photo",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
  },
};

const MEMBROS = {
  PT: [
    {
      id: 1,
      foto: "/images/andre.png",
      nome: "André Melo",
      cargo: "Desenvolvimento Criativo",
      descricao:
        "Responsável pelo desenvolvimento criativo do projeto, contribuindo para a apresentação da proposta, narrativa do problema e comunicação da solução.",
      ...SOCIAL_LINKS.andre,
    },
    {
      id: 2,
      foto: "/images/gab.png",
      nome: "Gabriel Soares",
      cargo: "Front-end & Design System",
      descricao:
        "Desenvolveu a página de Solução e a seção Quem Somos, construindo layouts em React com CSS Grid e responsividade mobile-first. Colaborou também na correção de bugs críticos da aplicação.",
      ...SOCIAL_LINKS.gabriel,
    },
    {
      id: 3,
      foto: "/images/jeff.png",
      nome: "Jefferson Gomes",
      cargo: "Front-end & UI/UX",
      descricao:
        "Responsável pela criação da página financeira, aplicando responsividade mobile-first, organização de componentes em React, animações com Framer Motion, integração de assets visuais e padronização tipográfica.",
      ...SOCIAL_LINKS.jefferson,
    },
    {
      id: 4,
      foto: "/images/nat.png",
      nome: "Natalia Lugão",
      cargo: "Front-end & Identidade Visual",
      descricao:
        "Responsável pelo desenvolvimento do front-end e identidade visual do projeto, garantindo uma experiência de usuário moderna, responsiva e visualmente consistente.",
      ...SOCIAL_LINKS.natalia,
    },
    {
      id: 5,
      foto: "/images/sophi.png",
      nome: "Sophia Coelho",
      cargo: "Front-end & Acessibilidade",
      descricao:
        "Responsável pela criação da área de contato. Também contribuiu com a acessibilidade, responsividade e tradução das telas. Colaborou também na correção de bugs críticos da aplicação.",
      ...SOCIAL_LINKS.sophia,
    },
  ],

  EN: [
    {
      id: 1,
      foto: "/images/andre.png",
      nome: "André Melo",
      cargo: "Pitch & Creative Development",
      descricao:
        "Responsible for the project’s creative development and pitch structure, contributing to the presentation of the proposal, problem narrative and solution communication.",
      ...SOCIAL_LINKS.andre,
    },
    {
      id: 2,
      foto: "/images/gab.png",
      nome: "Gabriel Soares",
      cargo: "Front-end & Design System",
      descricao:
        "Developed the Solution page and the About Us section, building React layouts with CSS Grid and mobile-first responsiveness. Also collaborated on fixing critical application bugs.",
      ...SOCIAL_LINKS.gabriel,
    },
    {
      id: 3,
      foto: "/images/jeff.png",
      nome: "Jefferson Gomes",
      cargo: "Front-end & UI/UX",
      descricao:
        "Responsible for creating the financial page, applying mobile-first responsiveness, React component organization, Framer Motion animations, visual asset integration and typographic standardization.",
      ...SOCIAL_LINKS.jefferson,
    },
    {
      id: 4,
      foto: "/images/nat.png",
      nome: "Natalia Lugão",
      cargo: "Front-end & Visual Identity",
      descricao:
        "Responsible for front-end development and the project’s visual identity, ensuring a modern, responsive and visually consistent user experience.",
      ...SOCIAL_LINKS.natalia,
    },
    {
      id: 5,
      foto: "/images/sophi.png",
      nome: "Sophia Coelho",
      cargo: "Front-end & Accessibility",
      descricao:
        "Responsible for creating the contact area. Also contributed to accessibility, responsiveness and screen translation. Collaborated on fixing critical application bugs as well.",
      ...SOCIAL_LINKS.sophia,
    },
  ],
};

const MembroCard = ({ membro, photoFallback, linkedinLabel, githubLabel }) => {
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

        <div
          className="membro-socials"
          aria-label={`Redes sociais de ${membro.nome}`}
        >
          <a
            href={membro.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn de ${membro.nome}`}
            className="social-btn linkedin"
          >
            <FaLinkedinIn aria-hidden="true" />
            <span>{linkedinLabel}</span>
          </a>

          <a
            href={membro.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub de ${membro.nome}`}
            className="social-btn github"
          >
            <FaGithub aria-hidden="true" />
            <span>{githubLabel}</span>
          </a>
        </div>
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
          <p >{text.label}</p>

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
              linkedinLabel={text.linkedinLabel}
              githubLabel={text.githubLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Equipe;