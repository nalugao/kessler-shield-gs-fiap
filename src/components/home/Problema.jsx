import "./problema.css";
import "../../index.css";
import { Fragment } from 'react';
import Reveal from '../../components/Reveal.jsx';
import { useLanguage } from "../context/LanguageContext";

/* ---------- Textos i18n ---------- */
const PROBLEMA_TEXT = {
  PT: {
    label: "01 — O Problema",
    title: <>O risco de uma <span className="mint">reação em cadeia</span> no espaço.</>,
    lead: "Quando há muitos objetos em órbita, uma colisão pode gerar fragmentos que causam novas colisões — gerando ainda mais fragmentos. Assim, órbitas inteiras podem se tornar inviáveis por gerações.",
    chainLabel: "Como funciona a reação em cadeia",
    whyTitle: "Por que importa?",
    whyText: "Comunicações, GPS, clima, missões espaciais e acesso ao espaço podem ser seriamente afetados.",
    steps: [
      { n: 1, cap: 'Colisão entre objetos em órbita' },
      { n: 2, cap: 'A colisão gera milhares de fragmentos' },
      { n: 3, cap: 'Os fragmentos atingem outros objetos' },
      { n: 4, cap: 'Novas colisões geram ainda mais fragmentos' },
      { n: 5, cap: 'O processo pode se repetir indefinidamente' },
    ],
    stats: [
      { num: '~40.000', lab: '<b>objetos rastreados</b> em órbita pelas redes de vigilância espacial.', src: 'Fonte: ESA Space Debris Office' },
      { num: '>1,2M', lab: '<b>fragmentos maiores que 1 cm</b> — pequenos demais para rastrear, letais o suficiente para destruir.', src: 'Fonte: ESA / Modelo MASTER' },
      { num: '~10 km/s', lab: '<b>velocidade média</b> relativa de colisão — energia comparável a uma granada.', src: 'Fonte: NASA ODPO' },
      { num: '~US$580M', lab: '<b>mercado anual de seguro</b> espacial sob risco crescente de sinistros.', src: 'Fonte: Análise de mercado' },
    ],
  },
  EN: {
    label: "01 — The Problem",
    title: <>The risk of a <span className="mint">chain reaction</span> in space.</>,
    lead: "When there are too many objects in orbit, one collision can generate fragments that cause new collisions — creating even more debris. Entire orbital regions could become unusable for generations.",
    chainLabel: "How the chain reaction works",
    whyTitle: "Why does it matter?",
    whyText: "Communications, GPS, weather forecasting, space missions and access to space could all be seriously affected.",
    steps: [
      { n: 1, cap: 'Collision between objects in orbit' },
      { n: 2, cap: 'The collision generates thousands of fragments' },
      { n: 3, cap: 'Fragments strike other objects' },
      { n: 4, cap: 'New collisions create even more fragments' },
      { n: 5, cap: 'The process can repeat indefinitely' },
    ],
    stats: [
      { num: '~40,000', lab: '<b>tracked objects</b> in orbit by space surveillance networks.', src: 'Source: ESA Space Debris Office' },
      { num: '>1.2M', lab: '<b>fragments larger than 1 cm</b> — too small to track, lethal enough to destroy.', src: 'Source: ESA / MASTER Model' },
      { num: '~10 km/s', lab: '<b>average relative</b> collision speed — energy comparable to a grenade.', src: 'Source: NASA ODPO' },
      { num: '~US$580M', lab: '<b>annual space insurance</b> market under growing claims risk.', src: 'Source: Market analysis' },
    ],
  },
};

/* ---------- Cadeia de reação ---------- */
const COUNTS = [0, 5, 9, 13, 20];
const RED = [0, 2, 2, 4, 5];

function dots(count, seed, redCount) {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const out = [];
  for (let i = 0; i < count; i++) {
    const ang = rnd() * Math.PI * 2;
    const r = 14 + rnd() * 28;
    out.push({ x: 50 + Math.cos(ang) * r, y: 50 + Math.sin(ang) * r, red: i < redCount });
  }
  return out;
}

function ChainNode({ index }) {
  if (index === 0) {
    return (
      <div className="chain-node">
        <span className="chain-sat" style={{ left: '30%', top: '42%', transform: 'translate(-50%,-50%) rotate(-25deg)' }} />
        <span className="chain-sat" style={{ left: '54%', top: '50%', transform: 'translate(-50%,-50%) rotate(20deg)' }} />
        <span className="chain-dot red" style={{ left: '46%', top: '46%', width: '5px', height: '5px' }} />
      </div>
    );
  }
  return (
    <div className="chain-node">
      {dots(COUNTS[index], (index + 1) * 7919, RED[index]).map((d, i) => (
        <span key={i} className={`chain-dot ${d.red ? 'red' : ''}`} style={{ left: `${d.x}%`, top: `${d.y}%` }} />
      ))}
    </div>
  );
}

function ChainReaction({ steps }) {
  return (
    <div className="chain">
      {steps.map((s, i) => (
        <Fragment key={s.n}>
          <div className="chain-step">
            <ChainNode index={i} />
            <span className="chain-num">{s.n}</span>
            <span className="chain-cap">{s.cap}</span>
          </div>
          {i < steps.length - 1 && <span className="chain-arrow">›</span>}
        </Fragment>
      ))}
    </div>
  );
}

/* ---------- Componente principal ---------- */
export default function Problema() {
  const { language } = useLanguage();
  const t = PROBLEMA_TEXT[language] ?? PROBLEMA_TEXT.PT;

  return (
    <section className="section" id="problema">
      <div className="wrap">
        <div className="prob">
          <Reveal className="prob-left">
            <p>{t.label}</p>
            <h2 className="prob-title">{t.title}</h2>
            <p className="prob-lead">{t.lead}</p>

            <span className="chain-label">{t.chainLabel}</span>
            <ChainReaction steps={t.steps} />

            <div className="prob-why">
              <div>
                <h4>{t.whyTitle}</h4>
                <p>{t.whyText}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="prob-right">
            <div className="link-video">
              <video
                src="/debris.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <p className="video-fonte">Fonte: https://orbitaldebris.jsc.nasa.gov/modeling/</p>
            </div>
            <div className="stat-cards">
              {t.stats.map((s) => (
                <div className="stat-card" key={s.num}>
                  <div className="num">{s.num}</div>
                  <p className="lab" dangerouslySetInnerHTML={{ __html: s.lab }} />
                  <div className="src">{s.src}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}