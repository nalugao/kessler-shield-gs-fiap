// Visualização orbital — órbitas elípticas, detritos (vermelho) e satélite (verde-menta).
export default function OrbitalVis() {
  return (
    <div className="orbital" id="orbital-vis">
      <svg viewBox="0 0 500 500" role="img" aria-label="Visualização orbital com detritos e satélite">
        <ellipse className="orbit-path" cx="250" cy="250" rx="220" ry="95" transform="rotate(-18 250 250)" />
        <ellipse className="orbit-path active" cx="250" cy="250" rx="175" ry="155" transform="rotate(24 250 250)" />
        <ellipse className="orbit-path" cx="250" cy="250" rx="120" ry="200" transform="rotate(-8 250 250)" />
        <circle className="core" cx="250" cy="250" r="42" />
        <circle cx="250" cy="250" r="42" fill="none" stroke="rgba(125,232,200,0.25)" strokeWidth="1" strokeDasharray="3 5" />
        <g className="orbit-rot spin-1">
          <g transform="rotate(-18 250 250)">
            <circle className="debris debris-glow" cx="470" cy="250" r="3.5" />
            <circle className="debris" cx="30" cy="250" r="2.5" />
            <circle className="debris" cx="380" cy="195" r="2" />
          </g>
        </g>
        <g className="orbit-rot spin-2">
          <g transform="rotate(24 250 250)">
            <rect className="sat" x="421" y="244" width="11" height="11" rx="1.5" />
            <rect className="sat" x="411" y="247" width="8" height="5" opacity="0.6" />
            <rect className="sat" x="434" y="247" width="8" height="5" opacity="0.6" />
          </g>
        </g>
        <g className="orbit-rot spin-3">
          <g transform="rotate(-8 250 250)">
            <circle className="debris debris-glow" cx="250" cy="50" r="3" />
            <circle className="debris" cx="250" cy="450" r="2.2" />
            <circle className="debris" cx="305" cy="80" r="1.8" />
          </g>
        </g>
      </svg>
    </div>
  );
}
