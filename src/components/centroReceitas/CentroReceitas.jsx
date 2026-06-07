import "./centroReceitas.css";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import terraImg from "../../assets/terra.gif";
import sateliteB2B from "../../assets/satelite-b2b.png";
import sateliteB2G from "../../assets/satelite-b2g.png";
import sateliteESG from "../../assets/satelite-esg.png";

import mercados from "../../data/mercados";

function NumeroAnimado({ valor, moeda = "" }) {
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
      {moeda} {numero}
    </>
  );
}

export default function CentroReceitas() {
  const [ativo, setAtivo] = useState(null);

  const mercadoAtivo = ativo ? mercados[ativo] : null;

  function selecionarMercado(id) {
    setAtivo(id);
  }

  function fecharPopup() {
    setAtivo(null);
  }

  return (
    <div
      id="modelos-receita"
      className={`centro-receitas d-flex justify-content-center align-items-center ${
        ativo ? "is-exploring" : ""
      }`}
    >
      <motion.div
        className="orbit-explorer"
        animate={{ scale: ativo ? 1.02 : 1 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        <div className="planet-core">
          <div className="planet-sphere planet-sphere--earth">
            <img
              src={terraImg}
              alt="Planeta Terra"
              className="planet-earth-image"
            />
          </div>

          <span className="planet-name planet-name--earth">Terra</span>
        </div>

        <div className="orbit-lane orbit-lane--b2b">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => selecionarMercado("b2b")}
            className={`planet-node planet-node--b2b ${
              ativo === "b2b" ? "active" : ""
            }`}
          >
            <span className="satellite-visual satellite-visual--b2b">
              <img
                src={sateliteB2B}
                alt="Satélite do modelo B2B"
                className="satellite-image"
              />
            </span>

            <span className="planet-name">B2B</span>
          </motion.button>
        </div>

        <div className="orbit-lane orbit-lane--b2g">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => selecionarMercado("b2g")}
            className={`planet-node planet-node--b2g ${
              ativo === "b2g" ? "active" : ""
            }`}
          >
            <span className="satellite-visual satellite-visual--b2g">
              <img
                src={sateliteB2G}
                alt="Satélite do modelo B2G"
                className="satellite-image"
              />
            </span>

            <span className="planet-name">B2G</span>
          </motion.button>
        </div>

        <div className="orbit-lane orbit-lane--esg">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => selecionarMercado("esg")}
            className={`planet-node planet-node--esg ${
              ativo === "esg" ? "active" : ""
            }`}
          >
            <span className="satellite-visual satellite-visual--esg">
              <img
                src={sateliteESG}
                alt="Satélite do modelo ESG"
                className="satellite-image"
              />
            </span>

            <span className="planet-name">ESG</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {ativo && mercadoAtivo && (
          <motion.div
            className="modal fade show d-block market-modal"
            tabIndex="-1"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fecharPopup}
          >
            <div
              className="modal-dialog modal-dialog-centered market-modal-dialog"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                key={`popup-${ativo}`}
                className={`modal-content market-popup market-popup--${ativo}`}
                initial={{ opacity: 0, scale: 0.9, y: 32 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 32 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <button
                  type="button"
                  className="market-popup__close"
                  onClick={fecharPopup}
                  aria-label="Fechar janela"
                >
                  ×
                </button>

                <div className="modal-body market-popup__body">
                  <span className="receita-tipo">{mercadoAtivo.tipo}</span>

                  <h3 className="market-popup__title">
                    {mercadoAtivo.titulo}
                  </h3>

                  <p className="market-popup__subtitle">
                    {mercadoAtivo.subtitulo}
                  </p>

                  <strong className="market-popup__value">
                    {mercadoAtivo.valor ? (
                      <NumeroAnimado
                        valor={mercadoAtivo.valor}
                        moeda={mercadoAtivo.moeda}
                      />
                    ) : (
                      mercadoAtivo.valorTexto
                    )}
                  </strong>

                  <span className="market-popup__highlight">
                    {mercadoAtivo.destaque}
                  </span>

                  <p className="market-popup__description">
                    {mercadoAtivo.descricao}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}