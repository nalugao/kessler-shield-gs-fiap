import { Link, NavLink } from "react-router-dom";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useLanguage } from "../components/context/LanguageContext";
import "./footer.css";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = {
    github: "https://github.com/nalugao/kessler-shield-gs-fiap",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <section className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-mark">KS</span>
              <span className="footer-logo-text">Kessler Shield</span>
            </Link>

            <p className="footer-impact">{t("footerImpact")}</p>

            <p className="footer-description">{t("footerDescription")}</p>
          </div>
        </section>

        <section className="footer-main">
          <div className="footer-column">
            <h3>{t("footerNavigationTitle")}</h3>

            <nav
              className="footer-links"
              aria-label="Links de navegação do rodapé"
            >
              <NavLink to="/">{t("navInicio")}</NavLink>
              <NavLink to="/solucao">{t("navSolucao")}</NavLink>
              <NavLink to="/financeiro">{t("navFinanceiro")}</NavLink>
              <NavLink to="/referencias">{t("navReferencias")}</NavLink>
              <NavLink to="/simulador">{t("navSimulador")}</NavLink>
              <Link to="/#contato">{t("navContato")}</Link>
            </nav>
          </div>

          <div className="footer-column">
            <h3>{t("footerActionTitle")}</h3>

            <nav
              className="footer-links"
              aria-label="Links de ação do rodapé"
            >
              <Link to="/#newsletter">{t("footerNewsletter")}</Link>
              <Link to="/#doacao">{t("footerInvest")}</Link>
              <Link to="/simulador">{t("footerSimulator")}</Link>
              <Link to="/referencias">{t("footerScientificBase")}</Link>
            </nav>
          </div>

          <div className="footer-column">
            <h3>{t("footerContactTitle")}</h3>

            <div className="footer-contact-list">
              <a href="mailto:contato@kesslershield.dev">
                contato@kesslershield.dev
              </a>

              <span>{t("footerAcademicProject")}</span>
            </div>

            <div className="footer-socials">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub do projeto"
                title="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn do projeto"
                title="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do projeto"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </section>

        <section className="footer-bottom">
          <p>
            © {currentYear} Kessler Shield. {t("footerRights")}
          </p>

          <p>{t("footerNote")}</p>
        </section>
      </div>
    </footer>
  );
}