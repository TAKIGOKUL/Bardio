import { NEWS_TABS } from '../data.js';
import Segmented from '../components/Segmented.jsx';

export default function News({ newsFilter, setNewsFilter, headlines, onRead, loading, error, onRetry }) {
  return (
    <div className="screen">
      <Segmented options={NEWS_TABS} value={newsFilter} onChange={setNewsFilter} />

      {loading && <p className="news-status mono">Loading headlines…</p>}

      {!loading && error && (
        <div className="news-status-block">
          <p className="news-status mono">{error}</p>
          <button className="secondary-btn" onClick={onRetry}>Retry</button>
        </div>
      )}

      {!loading && !error && headlines.length === 0 && (
        <p className="news-status mono">No headlines right now.</p>
      )}

      {!loading && !error && headlines.length > 0 && (
        <div className="list">
          {headlines.map((n) => (
            <a
              key={n.link || n.title}
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className={'row news-row' + (n.selected ? ' row-active' : '')}
              onClick={n.select}
            >
              <div className="row-body">
                <span className="row-title">{n.title}</span>
                <span className="row-sub">{n.source}{n.time ? ' · ' + n.time : ''}</span>
              </div>
              <span className="mono row-tag" style={{ color: n.tagColor }}>{n.topic}</span>
            </a>
          ))}
        </div>
      )}

      <button className="primary-btn news-read-btn" onClick={onRead} disabled={loading || !headlines.length}>
        Read bulletin aloud
      </button>
    </div>
  );
}
