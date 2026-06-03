import "./centroReceitas.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const receitas = {
  b2b: {
    tipo: "B2B",
    titulo: "Seguradoras",
    valor: "US$ 580M",
    descricao:
      "Redução de sinistros e riscos para operadores de satélites e constelações."
  },

  b2g: {
    tipo: "B2G",
    titulo: "ADR-as-a-Service",
    valor: "€ por missão",
    descricao:
      "Contratos com governos e agências espaciais para remoção de detritos."
  },

  esg: {
    tipo: "ESG",
    titulo: "Créditos Orbitais",
    valor: "Novo Mercado",
    descricao:
      "Remoções verificadas transformadas em créditos de sustentabilidade orbital."
  }
};

export default function CentroReceitas() {
  const [ativo, setAtivo] = useState("b2b");

  return (
    <div className="centro-receitas">

      <div className="orbit-explorer">
        <div className="orbit orbit-1" />
        <div className="orbit orbit-2" />
        <div className="orbit orbit-3" />

        {/* B2B */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setAtivo("b2b")}
          className={`orbit-node orbit-node--b2b ${
            ativo === "b2b" ? "active" : ""
          }`}
        >
          B2B
        </motion.button>

        {/* B2G */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setAtivo("b2g")}
          className={`orbit-node orbit-node--b2g ${
            ativo === "b2g" ? "active" : ""
          }`}
        >
          B2G
        </motion.button>

        {/* ESG */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          onClick={() => setAtivo("esg")}
          className={`orbit-node orbit-node--esg ${
            ativo === "esg" ? "active" : ""
          }`}
        >
          ESG
        </motion.button>

        <div className="orbit-center">
          KS
        </div>
      </div>

      <div className="receita-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={ativo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <span className="receita-tipo">
              {receitas[ativo].tipo}
            </span>

            {/* 💡 Bloco corrigido aqui: dinâmico e sem dependências externas */}
            <span className="receita-valor">
              {receitas[ativo].valor}
            </span>

            <h3>
              {receitas[ativo].titulo}
            </h3>

            <p>
              {receitas[ativo].descricao}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
