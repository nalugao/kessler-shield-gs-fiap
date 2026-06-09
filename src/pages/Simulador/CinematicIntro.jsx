import { useCallback, useEffect, useRef } from "react";

const CINEMATIC_FALLBACK_MS = 10000;

export default function CinematicIntro({ onComplete }) {
  const doneRef = useRef(false);
  const sceneRef = useRef(null);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    document.body.classList.add("cinematic-active");

    const onKeyDown = (event) => {
      if (
        event.key === "Escape" ||
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        finish();
      }
    };

    const timer = window.setTimeout(finish, CINEMATIC_FALLBACK_MS);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("cinematic-active");
    };
  }, [finish]);

  const onSceneAnimationEnd = useCallback(
    (event) => {
      if (
        event.target === sceneRef.current &&
        event.animationName === "cinematic-scene"
      ) {
        finish();
      }
    },
    [finish]
  );

  return (
    <section
      ref={sceneRef}
      className="cinematic-intro"
      aria-labelledby="cinematic-title"
      aria-modal="true"
      role="dialog"
      onAnimationEnd={onSceneAnimationEnd}
    >
      <div className="cin-stars cin-stars--far" aria-hidden="true" />
      <div className="cin-stars cin-stars--mid" aria-hidden="true" />
      <div className="cin-stars cin-stars--near" aria-hidden="true" />
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="cin-planet" aria-hidden="true" />

      <div className="cinematic-prologue">
        <p className="cinematic-kicker">Simulador · Órbita Baixa Terrestre</p>
        <h2 id="cinematic-title">Você está<br />no controle</h2>
      </div>

      <div className="cinematic-crawl-wrap" aria-hidden="true">
        <div className="cinematic-crawl">
          <p className="cinematic-episode">MISSÃO ATIVA</p>
          <p className="cinematic-lead">
            A órbita está se tornando inabitável.<br/>
            Implante frotas de coleta, monitore os índices
            e evite o ponto sem retorno.
          </p>
          <p className="cinematic-final">
            Cada decisão tem consequências.<br />
            O relógio já está correndo.
          </p>
        </div>
      </div>

      <div className="cinematic-horizon" aria-hidden="true" />

      <div className="cinematic-actions">
        <button className="cinematic-skip" type="button" onClick={finish}>
          Pular introdução
        </button>
        <button className="cinematic-start" type="button" onClick={finish}>
          ▶ Assumir o controle
        </button>
      </div>
    </section>
  );
}