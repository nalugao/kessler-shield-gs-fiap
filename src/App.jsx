import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Referencias from "./pages/Referencias"
import SolucaoPage from "./pages/Solucao";
import SimuladorPage from "./pages/Simulador/src/app/SimuladorPage";
import Financeiro from "./pages/Financeiro";
import Starfield from "./components/Starfield";
import ScrollManager from "./components/ScrollManager";
import ScrollRocket from "./components/ScrollRocket";
import { LanguageProvider } from "./components/context/LanguageContext";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="space-bg" />
        <Starfield />
        <ScrollManager />
        <ScrollRocket />

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/simulador" element={<SimuladorPage />} />
            <Route path="/solucao" element={<SolucaoPage />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/referencias" element={<Referencias />} />
            <Route path="/contato" element={<Navigate to="/#contato" replace />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;