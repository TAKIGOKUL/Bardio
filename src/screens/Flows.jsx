import { useState } from 'react';
import Segmented from '../components/Segmented.jsx';
import Sheet from '../components/Sheet.jsx';
import Chips from '../components/Chips.jsx';
import { ACTIONS, FLOW_PRESETS } from '../data.js';

const TABS = ['ALL', 'AM', 'PM', 'NIGHT'];
const SLOTS = ['AM', 'PM', 'NIGHT'];

export default function Flows({ filter, setFilter, rows, onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [slot, setSlot] = useState('AM');
  const [actions, setActions] = useState([]);

  const reset = () => { setName(''); setTime('08:00'); setSlot('AM'); setActions([]); };

  const applyPreset = (p) => {
    setName(p.name);
    setTime(p.next);
    setSlot(p.slot);
    setActions(p.actions);
  };

  const toggleAction = (key) => {
    setActions((a) => a.includes(key) ? a.filter((k) => k !== key) : [...a, key]);
  };

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), next: time, slot, actions });
    reset();
    setOpen(false);
  };

  return (
    <div className="screen">
      <div className="flows-toolbar">
        <Segmented options={TABS} value={filter} onChange={setFilter} />
        <button className="add-btn" onClick={() => setOpen(true)} aria-label="Add workflow">+</button>
      </div>

      <div className="list">
        {rows.map((f) => (
          <div key={f.name} className="row flow-row">
            <div className="row-body">
              <span className="row-title" style={{ color: f.fg }}>{f.name}</span>
              <span className="row-sub">{f.detail}</span>
            </div>
            <span className="row-time mono" style={{ color: f.fg }}>{f.next}</span>
            <button
              className={'switch' + (f.enabled ? ' switch-on' : '')}
              onClick={f.toggle}
              aria-label={`Toggle ${f.name}`}
            >
              <span className="switch-knob" />
            </button>
          </div>
        ))}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="New workflow">
        <div className="sheet-field">
          <label className="section-label mono">PRESETS</label>
          <div className="chips">
            {FLOW_PRESETS.map((p) => (
              <button key={p.name} className="chip" onClick={() => applyPreset(p)}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-field">
          <label className="section-label mono">NAME</label>
          <input
            className="wake-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Commute"
          />
        </div>
        <div className="sheet-field">
          <label className="section-label mono">TIME</label>
          <input
            className="wake-input mono"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="sheet-field">
          <label className="section-label mono">SLOT</label>
          <Segmented options={SLOTS} value={slot} onChange={setSlot} />
        </div>
        <div className="sheet-field">
          <label className="section-label mono">ACTIONS</label>
          <Chips options={ACTIONS} value={actions} onToggle={toggleAction} />
        </div>
        <button className="primary-btn sheet-submit" onClick={submit} disabled={!name.trim()}>
          Add workflow
        </button>
      </Sheet>
    </div>
  );
}
