import { useCallback, useEffect, useRef } from "react";

const CINEMATIC_FALLBACK_MS = 14200;

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
      if (event.key === "Escape" || event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
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

  const onSceneAnimationEnd = useCallback((event) => {
    if (event.target === sceneRef.current && event.animationName === "cinematic-scene") {
      finish();
    }
  }, [finish]);

  return (
    <section
      ref={sceneRef}
      className="cinematic-intro"
      aria-labelledby="cinematic-title"
      aria-modal="true"
      role="dialog"
      onAnimationEnd={onSceneAnimationEnd}
    >
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="cinematic-horizon" aria-hidden="true" />

      <div className="cinematic-prologue">
        <p className="cinematic-kicker">Kessler Shield</p>
        <h2 id="cinematic-title">Alerta orbital</h2>
      </div>

      <div className="cinematic-crawl-wrap" aria-hidden="true">
        <div className="cinematic-crawl">
          <p className="cinematic-lead">O pior está prestes a acontecer.</p>
          <p>A órbita está saturada de detritos.</p>
          <p>Uma colisão basta para iniciar a cascata.</p>
          <p>O ponto sem volta está próximo.</p>
          <p className="cinematic-final">Apenas você pode impedir isso.</p>
        </div>
      </div>

      <div className="cinematic-actions">
        <button className="cinematic-skip" type="button" onClick={finish}>
          Pular introdução
        </button>
        <button className="cinematic-start" type="button" onClick={finish}>
          Iniciar missão
        </button>
      </div>
    </section>
  );
}
