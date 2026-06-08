const ENTITIES = [
  {
    label: "Satélites ativos",
    kind: "sat",
  },
  {
    label: "Lixo espacial",
    kind: "debris",
  },
  {
    label: "Frota de coleta",
    kind: "fleet",
  },
  {
    label: "Destruídos",
    kind: "destroyed",
  },
];

export default function GlobeLegend() {
  return (
    <nav className="globe-legend" data-tour-id="globe-legend" aria-label="Legenda dos pontos orbitais">
      {ENTITIES.map((e) => (
        <div className="globe-legend-item" key={e.label}>
          <span className={"globe-marker globe-marker-" + e.kind} aria-hidden="true" />
          <span className="globe-legend-label">{e.label}</span>
        </div>
      ))}
    </nav>
  );
}
