import Glyph from '../components/Glyph.jsx';
import DeviceArt from '../components/DeviceArt.jsx';

export default function Home({ device, tiles, onReconnect, onDisconnect, connecting }) {
  return (
    <div className="screen home-screen">
      <div className="device-card">
        <DeviceArt />
        <div className="device-info">
          <span className="device-name">{device.name}</span>
          <span className="device-status">{device.status}</span>
        </div>
        <div className="device-level">
          <div className="device-level-track">
            <div className="device-level-fill" style={{ width: (device.battery ?? 0) + '%' }} />
          </div>
          <span className="device-level-label mono">{device.battery != null ? device.battery + '%' : '—'}</span>
        </div>
      </div>

      <div className="device-actions">
        <button className="device-action" onClick={onReconnect} disabled={connecting}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          <span>{connecting ? 'Connecting…' : 'Reconnect'}</span>
        </button>
        <button className="device-action" onClick={onDisconnect}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          <span>Disconnect</span>
        </button>
      </div>

      <div className="tile-grid">
        {tiles.map((tile) => (
          <button key={tile.title} className="tile" onClick={tile.open}>
            <div className="tile-body">
              <span className="tile-title">{tile.title}</span>
              <span className="tile-sub">{tile.sub}</span>
            </div>
            <div className="tile-foot">
              <Glyph name={tile.glyphKey} active={tile.active} size={4} gap={2} />
              {tile.meta && (
                <span className="tile-meta mono" style={{ color: tile.metaColor }}>{tile.meta}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
