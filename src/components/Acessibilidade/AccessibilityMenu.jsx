import { useState } from "react";
import AudioReader from "../LeitorDeAudio/AudioReader";
import Acessibilidade from "../../assets/Acessibilidade.png";
import "./AccessibilityMenu.css";

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioAtivo, setAudioAtivo] = useState(false);

  const abrirVLibras = () => {
    const btn = document.querySelector("[vw-access-button]");

    if (btn) {
      btn.classList.add("active");
      btn.style.display = "block";
      btn.style.visibility = "visible";
      btn.style.opacity = "1";
      btn.click();

      setTimeout(() => {
        btn.style.display = "none";
      }, 500);
    }

    const wrapper = document.querySelector("[vw]");

    if (wrapper) {
      wrapper.classList.add("active");
    }

    setIsOpen(false);
  };

  const abrirUserWay = () => {
    if (window.UserWay) {
      window.UserWay.widgetOpen();
    }

    setIsOpen(false);
  };

  const items = [
    {
      label: "VLibras",
      icon: "👋",
      type: "vlibras",
      onClick: abrirVLibras,
    },
    {
      label: "Leitor de Tela",
      icon: "🔊",
      type: "audio",
      onClick: () => {
        setAudioAtivo(true);
        setIsOpen(false);
      },
    },
    {
      label: "Acessibilidade",
      icon: "👤",
      type: "userway",
      onClick: abrirUserWay,
    },
  ];

  return (
    <>
      {audioAtivo && <AudioReader onClose={() => setAudioAtivo(false)} />}

      <div className="accessibility-menu">
        {isOpen && (
          <div className="accessibility-options">
            {items.map((item, index) => (
              <div
                key={index}
                className="accessibility-item"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="accessibility-label">{item.label}</span>

                <button
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.label}
                  className={`accessibility-option-btn ${item.type}`}
                >
                  <span className="accessibility-option-icon">
                    {item.icon}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu de acessibilidade"}
          className={isOpen ? "accessibility-main-btn active" : "accessibility-main-btn"}
        >
          {isOpen ? (
            <span className="accessibility-close-icon">✕</span>
          ) : (
            <img
              src={Acessibilidade}
              alt="Abrir menu de acessibilidade"
              className="accessibility-main-img"
            />
          )}
        </button>
      </div>
    </>
  );
};

export default AccessibilityMenu;