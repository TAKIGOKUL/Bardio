export default function Chips({ options, value, onToggle }) {
  return (
    <div className="chips">
      {options.map((opt) => {
        const active = value.includes(opt.key);
        return (
          <button
            key={opt.key}
            className={'chip' + (active ? ' chip-active' : '')}
            onClick={() => onToggle(opt.key)}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
