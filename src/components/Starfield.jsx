import { useEffect, useRef } from 'react';

// Céu estrelado em canvas, redesenhado uma vez e em cada resize.
export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let raf = null;
    let resizeTo = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 6500);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.3 + 0.2, o: Math.random() * 0.7 + 0.12,
          tw: Math.random() * 0.4 + 0.05, ph: Math.random() * Math.PI * 2,
        });
      }
    }
    function draw(t) {
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        let o = s.o + Math.sin(t * 0.001 + s.ph) * s.tw;
        if (o < 0) o = 0;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + o + ')'; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    function drawStatic() {
      for (const s of stars) {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + s.o + ')'; ctx.fill();
      }
    }

    build();
    if (reduce) drawStatic(); else raf = requestAnimationFrame(draw);

    const onResize = () => {
      clearTimeout(resizeTo);
      resizeTo = setTimeout(() => { build(); if (reduce) drawStatic(); }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTo);
    };
  }, []);

  return <canvas id="starfield" ref={ref} />;
}
