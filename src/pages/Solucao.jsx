import React from "react";
import "./solucao.css";

const missionSteps = [
  {
    id: 1,
    img: "/images/passo1.png",
    tagPrincipal: "Aproximação",
    tagSecundaria: "Sincronização Orbital",
    title: "A Dança Sincronizada",
    description:
      "No espaço, você não pode simplesmente ir atrás de algo. Pensem nisso como dois carros em uma rodovia rápida. O satélite-caçador precisa entrar na mesma pista e emparelhar com o lixo espacial, voando lado a lado, na mesma velocidade, para só então agir com segurança.",
    imgAlt: "Ilustração do satélite emparelhando com o detrito",
  },
  {
    id: 2,
    img: "/images/passo2.png",
    tagPrincipal: "Captura",
    tagSecundaria: "Polímero",
    title: "O Efeito Teia de Aranha",
    description:
      "A maioria dos detritos está girando descontroladamente. Tentar pegar isso com um braço robótico de metal é como tentar segurar uma faca que está caindo e girando no ar – é perigoso e pode quebrar o lixo em pedaços menores (piorando a Síndrome de Kessler). A espuma expansiva age como uma teia de aranha macia, que engole o objeto e trava o seu giro suavemente, absorvendo o impacto.",
    imgAlt: "Espuma expansiva capturando o lixo espacial",
  },
  {
    id: 3,
    img: "/images/passo3.png",
    tagPrincipal: "Arrasto",
    tagSecundaria: "Física",
    title: "O Paraquedas Invisível",
    description:
      "Como frear algo no espaço sem usar motores? Usando o formato! O lixo espacial sozinho é como uma bala de chumbo: corta o espaço facilmente. Quando a espuma infla ao redor dele, o conjunto se transforma em uma 'bola de praia' gigante e leve. Essa bola gigantesca começa a raspar no pouquinho de ar que existe nas bordas da atmosfera, e isso funciona como um paraquedas invisível, freando o objeto.",
    imgAlt: "Esfera sofrendo atrito com a atmosfera residual",
  },
  {
    id: 4,
    img: "/images/passo4.png",
    tagPrincipal: "Reentrada",
    tagSecundaria: "Desintegração",
    title: "A Lixeira Incineradora",
    description:
      "Como o nosso 'paraquedas de espuma' freou o lixo, a gravidade começa a puxá-lo para baixo. Quando ele entra na atmosfera mais densa da Terra, o atrito com o ar é tão forte que a espuma e o lixo simplesmente pegam fogo e se desintegram completamente. É uma limpeza que não deixa rastros, terminando como uma estrela cadente inofensiva.",
    imgAlt: "Conjunto queimando como estrela cadente na reentrada",
  },
];

export default function SolucaoKessler() {
  return (
    <section className="sol-section section">
      <div className="wrap">
        {/* Cabeçalho */}
        <div className="sol-header">
          <div className="divider"></div>
          <h2 className="sol-hero-title">MISSÃO DE LIMPEZA ORBITAL</h2>
        </div>

        {/* Etapas */}
        {missionSteps.map((step, index) => {
          const isEven = index % 2 === 0;
          return (
            <div className="sol-step" key={step.id}>
              <div className="sol-img" style={{ order: isEven ? 1 : 2 }}>
                <div className="sol-img-box">
                  {step.img ? (
                    <img src={step.img} alt={step.imgAlt} />
                  ) : (
                    <span>[ Imagem: {step.imgAlt} ]</span>
                  )}
                </div>
              </div>

              <div className="sol-body" style={{ order: isEven ? 2 : 1 }}>
                <span className="sol-num">0{step.id}</span>
                <div className="sol-tags">
                  <span className="sol-tag">{step.tagPrincipal}</span>
                  <span className="sol-tag sol-tag--purple">
                    {step.tagSecundaria}
                  </span>
                </div>
                <h3 className="sol-title">{step.title}</h3>
                <p className="sol-desc">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
