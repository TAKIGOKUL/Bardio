import { NAV, ACCENT } from '../data.js';
import Glyph from './Glyph.jsx';

export default function BottomNav({ screen, go }) {
  return (
    <nav className="bottom-nav">
      {NAV.map(({ key, target }) => {
        const active = screen === target;
        return (
          <button
            key={key}
            className="nav-item"
            onClick={() => go(target)}
            aria-label={target}
            aria-current={active}
          >
            <Glyph name={key} active={active} size={4} gap={2} />
            <span
              className="nav-indicator"
              style={{ background: active ? ACCENT : 'transparent' }}
            />
          </button>
        );
      })}
    </nav>
  );
}
