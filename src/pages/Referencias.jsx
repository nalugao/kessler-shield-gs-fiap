import { useMemo, useState } from "react";
import { PageHero } from "../components/ui.jsx";
import RefCard from "../components/RefCard.jsx";
import {
  getReferences,
  getRefFilters,
  getRefPageText,
} from "../data/references.js";
import { useLanguage } from "../components/context/LanguageContext";
import "./referencias.css";

const Referencias = () => {
  const { language } = useLanguage();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("todos");

  const references = useMemo(() => getReferences(language), [language]);
  const refFilters = useMemo(() => getRefFilters(language), [language]);
  const pageText = useMemo(() => getRefPageText(language), [language]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return references.filter((reference) => {
      const matchFilter =
        filter === "todos" || reference.tags.includes(filter);

      const searchableContent = `
        ${reference.title}
        ${reference.desc}
        ${reference.source}
        ${reference.labels.join(" ")}
      `.toLowerCase();

      const matchSearch = !q || searchableContent.includes(q);

      return matchFilter && matchSearch;
    });
  }, [query, filter, references]);

  return (
    <main className="page">
      <PageHero title={pageText.title} lead={pageText.lead}>
        <div className="ref-controls">
          <div className="search-bar">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7de8c8"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={pageText.searchPlaceholder}
            />
          </div>

          <div className="filters">
            {refFilters.map((filterItem) => (
              <button
                key={filterItem.key}
                type="button"
                className={`filter ${
                  filter === filterItem.key ? "active" : ""
                }`}
                onClick={() => setFilter(filterItem.key)}
              >
                {filterItem.label}
              </button>
            ))}
          </div>

          <div className="ref-count">
            <b>{filtered.length}</b> {pageText.countMiddle}{" "}
            {references.length} {pageText.countLabel}
          </div>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="ref-grid-3">
            {filtered.map((reference) => (
              <RefCard key={reference.id} data={reference} variant="full" />
            ))}

            {filtered.length === 0 && (
              <div className="no-results">{pageText.noResults}</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Referencias;