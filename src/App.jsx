import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Referencias from "./pages/Referencias";
import ContatoPage from "./pages/Contato";
import SolucaoPage from "./pages/Solucao";

import Starfield from "./components/Starfield";
import ScrollManager from "./components/ScrollManager";
import { LanguageProvider } from "./components/context/LanguageContext";

function Financeiro() {
  return (
    <main className="page-placeholder">
      <h1>Financeiro</h1>
      <p>Página financeira do projeto em construção.</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="space-bg" />
        <Starfield />
        <ScrollManager />

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/solucao" element={<SolucaoPage />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/referencias" element={<Referencias />} />
            <Route path="/contato" element={<ContatoPage />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;