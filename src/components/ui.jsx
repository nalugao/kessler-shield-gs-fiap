// Pequenos componentes de UI compartilhados.
import './PageHero.css';

export function Badge({ children, pulse }) {
  return (
    <span className="badge">
      {pulse && <span className="pulse-dot" />}
      {children}
    </span>
  );
}

export function SectionLabel({ children }) {
  return (
    <>
      <span className="label">{children}</span>
      <div className="divider" />
    </>
  );
}

// Cabeçalho das sub-páginas. `title` e `lead` aceitam HTML (ex.: <br>, <em>).
export function PageHero({ label, title, lead, badge, children }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <SectionLabel>{label}</SectionLabel>
        {badge && <div style={{ margin: '0 0 1.5rem' }}>{badge}</div>}
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {lead && <p className="lead" dangerouslySetInnerHTML={{ __html: lead }} />}
        {children}
      </div>
    </section>
  );
}
