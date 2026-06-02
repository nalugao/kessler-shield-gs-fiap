import { useMemo, useState } from 'react';
import { PageHero } from '../components/ui.jsx';
import RefCard from '../components/RefCard.jsx';
import { REFERENCES, REF_FILTERS } from '../data/references.js';
import './referencias.css';
// import { useLanguage } from "../components/context/LanguageContext";
// import { getSections } from "../data/refData";
import "./referencias.css";

const Referencias = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('todos');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REFERENCES.filter((r) => {
      const matchFilter = filter === 'todos' || r.tags.includes(filter);
      const blob = `${r.title} ${r.desc} ${r.source} ${r.labels.join(' ')}`.toLowerCase();
      const matchSearch = !q || blob.includes(q);
      return matchFilter && matchSearch;
    });
  }, [query, filter]);

  // const { language } = useLanguage();
  // const sections = getSections(language);

  return (
<main className="page">
      <PageHero
        title="Base científica"
        lead="Todos os dados do Kessler Shield foram verificados contra fontes primárias: agências espaciais, corretores especializados e literatura acadêmica revisada por pares. "
      >
        <div className="ref-controls">
          <div className="search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7de8c8" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, fonte ou tema..."
            />
          </div>
          <div className="filters">
            {REF_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="ref-count"><b>{filtered.length}</b> de {REFERENCES.length} referências</div>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="ref-grid-3">
            {filtered.map((r) => (
              <RefCard key={r.id} data={r} variant="full" />
            ))}
            {filtered.length === 0 && (
              <div className="no-results">Nenhuma referência encontrada. Tente outro termo ou filtro.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Referencias;
