export default function Segmented({ options, value, onChange }) {
  return (
    <div className="segmented">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            className="segmented-item"
            onClick={() => onChange(opt)}
            aria-pressed={active}
          >
            <span className={'segmented-bar' + (active ? ' segmented-bar-active' : '')} />
            <span className={'segmented-label mono' + (active ? ' segmented-label-active' : '')}>
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}
