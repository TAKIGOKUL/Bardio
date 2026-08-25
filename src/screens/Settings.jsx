import IconPicker from '../components/IconPicker.jsx';

export default function Settings({ device, wakeInput, setWake, engines, switches }) {
  return (
    <div className="screen">
      <section className="settings-section">
        <h2 className="section-label mono">DEVICE</h2>
        <div className="row">
          <div className="row-body">
            <span className="row-title">{device}</span>
            <span className="row-sub">Bluetooth · paired</span>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="section-label mono">WAKE PHRASE</h2>
        <input
          className="wake-input mono"
          value={wakeInput}
          onChange={setWake}
          spellCheck={false}
        />
      </section>

      <section className="settings-section">
        <h2 className="section-label mono">VOICE ENGINE</h2>
        <IconPicker options={engines} />
      </section>

      <section className="settings-section">
        <h2 className="section-label mono">SYSTEM</h2>
        <div className="list">
          {switches.map((sw) => (
            <div key={sw.label} className="row">
              <div className="row-body">
                <span className="row-title">{sw.label}</span>
                <span className="row-sub">{sw.note}</span>
              </div>
              <button
                className={'switch' + (sw.on ? ' switch-on' : '')}
                onClick={sw.toggle}
                aria-label={`Toggle ${sw.label}`}
              >
                <span className="switch-knob" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
