import { GLYPH, ACCENT, IDLE } from '../data.js';

export default function Glyph({ name, active = false, size = 6, gap = 3, dim = '#555' }) {
  const cells = GLYPH[name] || GLYPH.home;
  const cell = active ? ACCENT : dim;
  return (
    <div
      className="glyph"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(3, ${size}px)`,
        gap
      }}
    >
      {cells.map((v, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: 1,
            background: v ? cell : IDLE
          }}
        />
      ))}
    </div>
  );
}
