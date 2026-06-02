import { Link } from 'react-router-dom';
import { TAG_CLASS } from '../data/references.js';
import './RefCard.css';

// Card de referência científica, compartilhado entre a seção da Home e a página.
export default function RefCard({ data, variant = 'full' }) {
  const inner = (
    <>
      <div className="ref-tags">
        {data.labels.map((t) => <span className={`tag ${TAG_CLASS[t]}`} key={t}>{t}</span>)}
      </div>
      <h4>{data.title}</h4>
      <p>{data.desc}</p>
      {variant === 'full' && data.corrected}
      {variant === 'full' ? (
        <a className="ref-source" href={data.url} target="_blank" rel="noopener noreferrer">
          {data.source} <span>↗</span>
        </a>
      ) : (
        <span className="ref-source">{data.source} <span>↗</span></span>
      )}
    </>
  );

  if (variant === 'preview') {
    return <Link to="/referencias" className="ref-card">{inner}</Link>;
  }
  return <article className="ref-card">{inner}</article>;
}
