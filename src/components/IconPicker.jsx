import Glyph from './Glyph.jsx';

export default function IconPicker({ options }) {
  return (
    <div className="icon-picker">
      {options.map((opt) => (
        <button key={opt.label} className="icon-picker-item" onClick={opt.onSelect}>
          <span className={'icon-picker-circle' + (opt.active ? ' icon-picker-circle-active' : '')}>
            <Glyph name={opt.glyph} active={false} size={4} gap={2} dim={opt.active ? '#0a1400' : '#888'} />
          </span>
          <span className="icon-picker-label">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
