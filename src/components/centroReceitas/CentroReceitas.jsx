import "./centroReceitas.css";
import { motion } from "framer-motion";

export default function CentroReceitas() {
  return (
    <div className="orbit-explorer">

      <div className="orbit orbit-1" />
      <div className="orbit orbit-2" />
      <div className="orbit orbit-3" />

      <motion.button
        whileHover={{ scale: 1.1 }}
        className="orbit-node orbit-node--b2b"
      >
        B2B
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        className="orbit-node orbit-node--b2g"
      >
        B2G
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        className="orbit-node orbit-node--esg"
      >
        ESG
      </motion.button>

      <div className="orbit-center">
        KS
      </div>

    </div>
  );
}