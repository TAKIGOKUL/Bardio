import { ACCENT } from '../data.js';

export default function Voice({ voiceState, voiceMeta, waveCols, lastCommand, lastResponse, onCycle }) {
  return (
    <div className="screen voice-screen">
      <button className="voice-state-btn" onClick={onCycle}>
        <span className="voice-state-circle">
          <span className="voice-state-pulse" />
        </span>
        <span className="voice-state-text mono">{voiceState}</span>
        <span className="voice-state-meta">{voiceMeta}</span>
      </button>

      <div className="wave-grid">
        {waveCols.map((col, ci) => (
          <div key={ci} className="wave-col">
            {col.cells.map((c, ri) => (
              <span key={ri} style={{ background: c.bg }} />
            ))}
          </div>
        ))}
      </div>

      <div className="transcript">
        <div className="row transcript-row">
          <span className="transcript-label mono">HEARD</span>
          <p>{lastCommand}</p>
        </div>
        <div className="row transcript-row">
          <span className="transcript-label mono" style={{ color: ACCENT }}>SAID</span>
          <p>{lastResponse}</p>
        </div>
      </div>
    </div>
  );
}
