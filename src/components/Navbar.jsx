import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inicioDropdownOpen, setInicioDropdownOpen] = useState(false);

  const { language, changeLanguage, t } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();

  function tf(key, fallback) {
    const translated = t(key);

    if (!translated || translated === key) {
      return fallback;
    }

    return translated;
  }

  function closeMenu() {
    setMenuOpen(false);
    setInicioDropdownOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
    setInicioDropdownOpen(false);
  }

  function toggleInicioDropdown() {
    setInicioDropdownOpen((prev) => !prev);
  }

  function goToHomeSection(sectionId) {
    closeMenu();

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark">KS</span>
          <span className="logo-text">Kessler Shield</span>
        </NavLink>

        <button
          className={menuOpen ? "menu-button active" : "menu-button"}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={menuOpen ? "navbar-menu open" : "navbar-menu"}>
          <div
            className={
              inicioDropdownOpen
                ? "navbar-dropdown open"
                : "navbar-dropdown"
            }
          >
            <button
              type="button"
              className={
                location.pathname === "/"
                  ? "dropdown-toggle active"
                  : "dropdown-toggle"
              }
              onClick={toggleInicioDropdown}
              aria-expanded={inicioDropdownOpen}
            >
              {t("navInicio")}
              <span className="dropdown-arrow">▾</span>
            </button>

            <div className="dropdown-menu">
              <button
                type="button"
                className="dropdown-item-button"
                onClick={() => goToHomeSection("problema")}
              >
                {tf("navProblema", "O Problema")}
              </button>

              <button
                type="button"
                className="dropdown-item-button"
                onClick={() => goToHomeSection("solucao")}
              >
                {tf("navSolucaoResumo", "A Solução")}
              </button>

              <button
                type="button"
                className="dropdown-item-button"
                onClick={() => goToHomeSection("financeiro")}
              >
                {tf("navFinanceiroResumo", "Financeiro")}
              </button>

              <button
                type="button"
                className="dropdown-item-button"
                onClick={() => goToHomeSection("referencias")}
              >
                {tf("navReferenciasResumo", "Referências")}
              </button>

              <button
                type="button"
                className="dropdown-item-button"
                onClick={() => goToHomeSection("contato")}
              >
                {t("navContato")}
              </button>
                            <button
                type="button"
                className="dropdown-item-button"
                onClick={() => goToHomeSection("Quem Somos")}
              >
                {t("navQuemSomos")}
              </button>
            </div>
          </div>

          <NavLink to="/solucao" onClick={closeMenu}>
            {t("navSolucao")}
          </NavLink>

          <NavLink to="/financeiro" onClick={closeMenu}>
            {t("navFinanceiro")}
          </NavLink>

          <NavLink to="/referencias" onClick={closeMenu}>
            {t("navReferencias")}
          </NavLink>

          <div className="language-switch" aria-label="Selecionar idioma">
            <span className="language-icon">🌐</span>

            <button
              type="button"
              className={
                language === "PT"
                  ? "language-option active"
                  : "language-option"
              }
              onClick={() => changeLanguage("PT")}
            >
              PT
            </button>

            <span className="language-divider">/</span>

            <button
              type="button"
              className={
                language === "EN"
                  ? "language-option active"
                  : "language-option"
              }
              onClick={() => changeLanguage("EN")}
            >
              EN
            </button>
          </div>

          <NavLink
            to="/simulador"
            className="navbar-cta"
            onClick={closeMenu}
          >
            {t("navSimulador")} →
          </NavLink>
        </div>
      </nav>
    </header>
  );
}