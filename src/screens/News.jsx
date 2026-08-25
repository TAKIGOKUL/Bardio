import { NEWS_TABS } from '../data.js';
import Segmented from '../components/Segmented.jsx';

export default function News({ newsFilter, setNewsFilter, headlines, onRead }) {
  return (
    <div className="screen">
      <Segmented options={NEWS_TABS} value={newsFilter} onChange={setNewsFilter} />

      <div className="list">
        {headlines.map((n) => (
          <button
            key={n.title}
            className={'row news-row' + (n.selected ? ' row-active' : '')}
            onClick={n.select}
          >
            <div className="row-body">
              <span className="row-title">{n.title}</span>
              <span className="row-sub">{n.source} · {n.length} · {n.time}</span>
            </div>
            <span className="mono row-tag" style={{ color: n.tagColor }}>{n.topic}</span>
          </button>
        ))}
      </div>

      <button className="primary-btn news-read-btn" onClick={onRead}>
        Read bulletin aloud
      </button>
    </div>
  );
}
