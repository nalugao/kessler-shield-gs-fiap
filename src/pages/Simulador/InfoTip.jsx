import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/** Render a LaTeX string to HTML via KaTeX. */
function Tex({ tex, display }) {
  const html = katex.renderToString(tex, { displayMode: !!display, throwOnError: false });
  return (
    <span
      className={display ? "tex-block" : "tex-inline"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * A small (i) that opens an explanation balloon: a one-line intro, the typeset
 * formula, and a legend defining every symbol in it. Fixed-positioned so it escapes
 * the rails' overflow; closes on outside click.
 *
 * @param {{title?:string, intro?:string, tex?:string, where?:[string,string][], note?:string}} p
 */
export default function InfoTip({ title, intro, tex, where = [], note }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const place = useCallback(() => {
    const btn = btnRef.current;
    const pop = popRef.current;
    if (!btn || !pop) return;

    const gap = 10;
    const margin = 12;
    const r = btn.getBoundingClientRect();
    const pr = pop.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(pr.width || 340, vw - margin * 2);
    const h = Math.min(pr.height || 260, vh - margin * 2);
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const centeredLeft = clamp(r.left + r.width / 2 - w / 2, margin, vw - w - margin);
    const centeredTop = clamp(r.top + r.height / 2 - h / 2, margin, vh - h - margin);

    const spaces = [
      { side: "right", value: vw - r.right },
      { side: "left", value: r.left },
      { side: "bottom", value: vh - r.bottom },
      { side: "top", value: r.top },
    ].sort((a, b) => b.value - a.value);

    const side = spaces[0].side;
    const next =
      side === "right"
        ? { placement: side, top: centeredTop, left: clamp(r.right + gap, margin, vw - w - margin) }
        : side === "left"
          ? { placement: side, top: centeredTop, left: clamp(r.left - w - gap, margin, vw - w - margin) }
          : side === "bottom"
            ? { placement: side, top: clamp(r.bottom + gap, margin, vh - h - margin), left: centeredLeft }
            : { placement: side, top: clamp(r.top - h - gap, margin, vh - h - margin), left: centeredLeft };
    setPos(next);
  }, []);

  const toggle = () => {
    if (open) return setOpen(false);
    setPos(null);
    setOpen(true);
  };

  useLayoutEffect(() => {
    if (!open) return;
    place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!btnRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDoc);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  return (
    <span className="infotip">
      <button ref={btnRef} className="infotip-btn" onClick={toggle} aria-label="Explicação">
        i
      </button>
      {open && (
        <div
          ref={popRef}
          className={"infotip-pop" + (pos ? "" : " infotip-pop-measuring")}
          role="dialog"
          data-placement={pos?.placement}
          style={{ position: "fixed", top: pos?.top ?? 0, left: pos?.left ?? 0 }}
        >
          {title && <div className="infotip-title">{title}</div>}
          {intro && <p className="infotip-intro">{intro}</p>}
          {tex && (
            <div className="formula">
              <Tex tex={tex} display />
            </div>
          )}
          {where.length > 0 && <div className="tex-where-label">onde</div>}
          {where.length > 0 && (
            <ul className="tex-where">
              {where.map(([sym, desc], i) => (
                <li key={i}>
                  <Tex tex={sym} />
                  <span className="tex-desc">{desc}</span>
                </li>
              ))}
            </ul>
          )}
          {note && <p className="infotip-note">{note}</p>}
        </div>
      )}
    </span>
  );
}