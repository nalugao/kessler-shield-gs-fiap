import './equipe.css'

const membros = [
  {
    id: 1,
    foto: "/images/sophi.png",
    nome: "Sophia Coelho",
    cargo: "Front-end & Acessibilidade",
    descricao: "Responsável pela criação da área de contato. Também contribuiu com a acessibilidade, responsividade e tradução das telas. Colaborou também na correção de bugs críticos da aplicação."
  },
  {
    id: 2,
    foto: "/images/nat.png",
    nome: "Natália Lugão",
    cargo: "Cargo / Função",
    descricao: "Responsável pelo desenvolvimento do front-end e identidade visual do projeto, garantindo a experiência do usuário."
  },
  {
    id: 3,
    foto: "/images/gab.png",
    nome: "Gabriel Soares",
    cargo: "Front-end & Design System",
    descricao: "Desenvolveu a página de Solução e a seção Quem Somos, construindo layouts em React com CSS Grid, responsividade mobile-first. Colaborou também na correção de bugs críticos da aplicação. "
  },
  {
    id: 4,
    foto: "/images/jeff.png",
    nome: "Jefferson Gomes",
    cargo: "Front-end & UI/UX",
    descricao: "Responsável pela criação da página financeira, aplicando responsividade mobile-first, organização de componentes em React, animações com Framer Motion, integração de assets visuais e padronização tipográfica."
  },
  {
    id: 5,
    foto: "/images/andre.png",
    nome: "André Melo",
    cargo: "Cargo / Função",
    descricao: "Responsável pelo desenvolvimento do front-end e identidade visual do projeto, garantindo a experiência do usuário."
  }
]

const MembroCard = ({ membro }) => (
  <div className="membro-card">
    <div className="membro-foto">
      {membro.foto
        ? <img src={membro.foto} alt={membro.nome} />
        : <span>Foto</span>
      }
    </div>
    <div className="membro-info">
      <h3 className="membro-nome">{membro.nome}</h3>
      <span className="membro-cargo">{membro.cargo}</span>
      <p className="membro-desc">{membro.descricao}</p>
    </div>
  </div>
)

const Equipe = () => {
  const top = membros.slice(0, 3)
  const bottom = membros.slice(3)

  return (
    <section className="section section--alt" id="quem-somos">
      <div className="wrap">

        <div className="section-head">
          <span className="label">06 — Quem Somos</span>
          <div className="divider"></div>
          <h2 className="section-title">A EQUIPE</h2>
          <p className="section-intro">
            Estudantes de engenharia da FIAP construindo o futuro da limpeza orbital.
          </p>
        </div>

        <div className="equipe-grid">
          {membros.map(m => <MembroCard key={m.id} membro={m} />)}
        </div>

      </div>
    </section>
  )
}

export default Equipe