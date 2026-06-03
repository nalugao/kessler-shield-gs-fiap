import "./centroReceitas.css";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const mercados = {
  b2b: {
    tipo: "B2B",
    titulo: "SEGURADORAS",
    subtitulo: "Risco convertido em receita recorrente",
    valor: 580,
    prefixo: "US$ ",
    sufixo: "M",
    destaque: "mercado endereçável / ano",
    descricao:
      "Redução de prêmios e sinistros para operadores de constelações. Cada detrito removido reduz a probabilidade de perda total de ativos em órbita."
  },

  b2g: {
    tipo: "B2G",
    titulo: "ADR-AS-A-SERVICE",
    subtitulo: "Remoção orbital como serviço",
    valorTexto: "€ por missão",
    destaque: "contratos plurianuais",
    descricao:
      "Contratos de remoção sob demanda para agências espaciais e governos. Objetos de alto risco são priorizados em órbitas críticas."
  },

  esg: {
    tipo: "ESG",
    titulo: "CRÉDITOS ORBITAIS",
    subtitulo: "Sustentabilidade orbital verificável",
    valorTexto: "Novo mercado",
    destaque: "créditos verificáveis",
    descricao:
      "Tokenização de remoções verificadas como créditos de sustentabilidade orbital, criando um mercado análogo ao de carbono para o ecossistema espacial."
  }
};

function NumeroAnimado({ valor, prefixo = "", sufixo = "" }) {
  const [numero, setNumero] = useState(0);

  useEffect(() => {
    if (!valor) return;

    let atual = 0;
    const incremento = Math.ceil(valor / 60);

    const intervalo = setInterval(() => {
      atual += incremento;

      if (atual >= valor) {
        atual = valor;
        clearInterval(intervalo);
      }

      setNumero(atual);
    }, 18);

    return () => clearInterval(intervalo);
  }, [valor]);

  return (
    <>
      {prefixo}
      {numero}
      {sufixo}
    </>
  );
}

export default function CentroReceitas() {
  const [ativo, setAtivo] = useState("b2b");
  const [modoAnalise, setModoAnalise] = useState(false);

  const mercadoAtivo = mercados[ativo];

  function selecionarMercado(id) {
    setAtivo(id);
    setModoAnalise(true);
  }

  return (
    <div
      id="modelos-receita"
      className={`centro-receitas ${modoAnalise ? "is-exploring" : ""}`}
    >
      <motion.div
        className="orbit-explorer"
        animate={{
          scale: modoAnalise ? 0.94 : 1
        }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        <div className="orbit orbit-1">
          <span className="orbit-marker" />
        </div>

        <div className="orbit orbit-2">
          <span className="orbit-marker orbit-marker--small" />
        </div>

        <div className="orbit orbit-3">
          <span className="orbit-marker orbit-marker--tiny" />
        </div>

        {Object.entries(mercados).map(([id, mercado]) => (
          <motion.button
            key={id}
            layoutId={`market-${id}`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => selecionarMercado(id)}
            className={`orbit-node orbit-node--${id} ${
              ativo === id ? "active" : ""
            }`}
          >
            {mercado.tipo}
          </motion.button>
        ))}

        <div className="orbit-center">KS</div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!modoAnalise && (
          <motion.div
            key="resumo"
            className="receita-panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
          >
            <span className="receita-tipo">{mercadoAtivo.tipo}</span>

            <span className="receita-valor">
              {mercadoAtivo.valor ? (
                <NumeroAnimado
                  valor={mercadoAtivo.valor}
                  prefixo={mercadoAtivo.prefixo}
                  sufixo={mercadoAtivo.sufixo}
                />
              ) : (
                mercadoAtivo.valorTexto
              )}
            </span>

            <h3>{mercadoAtivo.titulo}</h3>

            <p>{mercadoAtivo.descricao}</p>
          </motion.div>
        )}

        {modoAnalise && (
          <motion.div
            key={`analise-${ativo}`}
            className="analise-mercado"
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -28 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
      
            <span className="receita-tipo">{mercadoAtivo.tipo}</span>

            <h2>{mercadoAtivo.titulo}</h2>

            <p className="analise-subtitulo">{mercadoAtivo.subtitulo}</p>

            <strong className="analise-numero">
              {mercadoAtivo.valor ? (
                <NumeroAnimado
                  valor={mercadoAtivo.valor}
                  prefixo={mercadoAtivo.prefixo}
                  sufixo={mercadoAtivo.sufixo}
                />
              ) : (
                mercadoAtivo.valorTexto
              )}
            </strong>

            <span className="analise-destaque">
              {mercadoAtivo.destaque}
            </span>

            <p>{mercadoAtivo.descricao}</p>

            <div className="analise-hint">
              Clique em outro modelo orbital para trocar a análise.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}