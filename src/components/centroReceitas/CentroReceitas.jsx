import "./centroReceitas.css";
import { motion } from "framer-motion";

import terraImg from "../../assets/terra.gif";
import sateliteB2B from "../../assets/satelite-b2b.png";
import sateliteB2G from "../../assets/satelite-b2g.png";
import sateliteESG from "../../assets/satelite-esg.png";

export default function CentroReceitas() {
  return (
    <div
      id="modelos-receita"
      className="centro-receitas d-flex justify-content-center align-items-center"
    >
      <motion.div
        className="orbit-explorer"
        animate={{ scale: 1 }} //
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
        </div>

        <div className="orbit-lane orbit-lane--b2b">
          <div
            className="planet-node planet-node--b2b"
            aria-label="Modelo de receita B2B"
          >
            <motion.span
              className="satellite-visual satellite-visual--b2b"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <img
                src={sateliteB2B}
                alt="Satélite do modelo B2B"
                className="satellite-image"
              />
            </motion.span>

            <span className="planet-name">B2B</span>
          </div>
        </div>

        <div className="orbit-lane orbit-lane--b2g">
          <div
            className="planet-node planet-node--b2g"
            aria-label="Modelo de receita B2G"
          >
            <motion.span
              className="satellite-visual satellite-visual--b2g"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <img
                src={sateliteB2G}
                alt="Satélite do modelo B2G"
                className="satellite-image"
              />
            </motion.span>

            <span className="planet-name">B2G</span>
          </div>
        </div>

        <div className="orbit-lane orbit-lane--esg">
          <div
            className="planet-node planet-node--esg"
            aria-label="Modelo de receita ESG"
          >
            <motion.span
              className="satellite-visual satellite-visual--esg"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <img
                src={sateliteESG}
                alt="Satélite do modelo ESG"
                className="satellite-image"
              />
            </motion.span>

            <span className="planet-name">ESG</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}