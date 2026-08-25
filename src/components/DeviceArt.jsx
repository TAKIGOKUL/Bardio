export default function DeviceArt() {
  const dots = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg viewBox="0 0 200 130" className="device-art" fill="none">
      <rect x="14" y="30" width="172" height="80" rx="18" stroke="#666" strokeWidth="2" />
      <line x1="46" y1="30" x2="30" y2="6" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <line x1="154" y1="30" x2="170" y2="6" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="70" r="20" stroke="#8a8a8a" strokeWidth="2" />
      <circle cx="48" cy="70" r="3" fill="var(--accent)" />
      <g>
        {dots.map((i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          return (
            <rect
              key={i}
              x={100 + col * 11}
              y={54 + row * 11}
              width="5"
              height="5"
              rx="1"
              fill="#444"
            />
          );
        })}
      </g>
    </svg>
  );
}
