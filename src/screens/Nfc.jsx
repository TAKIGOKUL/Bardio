import Glyph from '../components/Glyph.jsx';

export default function Nfc({ tags, selectedTag, showStatus, statusState, onProgram }) {
  return (
    <div className="screen nfc-screen">
      <div className="tag-grid">
        {tags.map((t) => (
          <button
            key={t.place}
            className={'tag-card' + (t.selected ? ' tag-card-active' : '')}
            onClick={t.select}
          >
            <div className="tag-body">
              <span className="tag-place">{t.place}</span>
              <span className="tag-workflow mono">{t.workflow}</span>
            </div>
            <Glyph name={t.key} active={false} size={4} gap={2} dim={t.selected ? '#0a1400' : '#777'} />
          </button>
        ))}
      </div>

      <div className="nfc-program">
        <p className="nfc-selected mono">SELECTED · <span style={{ color: 'var(--accent)' }}>{selectedTag}</span></p>
        <button className="primary-btn" onClick={onProgram}>
          Program tag
        </button>
        {showStatus && (
          <p className="nfc-status mono">
            {statusState === 'loading' ? 'Writing NDEF record…' : 'Saved to tag ✓'}
          </p>
        )}
      </div>
    </div>
  );
}
