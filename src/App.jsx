import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import {
  ACCENT, TITLES, flowDetail,
  DEFAULT_FLOWS, DEFAULT_SWITCHES, ENGINES, TAGS
} from './data.js';
import { fetchNews } from './news.js';
import { speak } from './tts.js';
import ScreenHeader from './components/ScreenHeader.jsx';
import BottomNav from './components/BottomNav.jsx';
import BulletToast from './components/BulletToast.jsx';
import Home from './screens/Home.jsx';
import Flows from './screens/Flows.jsx';
import Voice from './screens/Voice.jsx';
import Nfc from './screens/Nfc.jsx';
import Settings from './screens/Settings.jsx';
import News from './screens/News.jsx';

const DEFAULT_WAKE = 'Hey Bardio';

const TTS_STATUS = {
  spoken: 'System TTS',
  'no-voices': 'no system voice installed',
  error: 'speech failed',
  unsupported: 'speech not supported here'
};

const pad = (n) => String(n).padStart(2, '0');

const FLOWS_KEY = 'bardio.flows';

function loadFlows() {
  try {
    const raw = localStorage.getItem(FLOWS_KEY);
    if (!raw) return DEFAULT_FLOWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_FLOWS;
  } catch {
    return DEFAULT_FLOWS;
  }
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [now, setNow] = useState(new Date());
  const [wave, setWave] = useState(() => Array.from({ length: 24 }, () => 3 + Math.floor(Math.random() * 6)));
  const [filter, setFilter] = useState('ALL');
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [tagIdx, setTagIdx] = useState(0);
  const [programState, setProgramState] = useState('idle');
  const [engine, setEngine] = useState('System TTS');
  const [wake, setWakeState] = useState(DEFAULT_WAKE);
  const [flows, setFlows] = useState(loadFlows);
  const [switches, setSwitches] = useState(DEFAULT_SWITCHES);
  const [newsFilter, setNewsFilter] = useState('KERALA');
  const [newsIdx, setNewsIdx] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [toast, setToast] = useState(null);
  const [bt, setBt] = useState({ connected: false, connecting: false, name: null, battery: null });

  const toastTimer = useRef(null);
  const toastSeq = useRef(0);
  const btDeviceRef = useRef(null);
  const newsCache = useRef({});
  const newsReqId = useRef(0);

  const notify = (text, duration = 4600) => {
    toastSeq.current += 1;
    setToast({ id: toastSeq.current, text, duration });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    const t1 = setInterval(() => setNow(new Date()), 1000);
    const t3 = setInterval(() => {
      setWave((w) => w.map((v) => Math.max(1, Math.min(11, v + (Math.random() > 0.5 ? 2 : -2)))));
    }, 140);
    return () => { clearInterval(t1); clearInterval(t3); };
  }, []);

  const loadNews = (topic) => {
    if (newsCache.current[topic]) {
      setNewsItems(newsCache.current[topic]);
      setNewsLoading(false);
      setNewsError(null);
      return;
    }
    const reqId = ++newsReqId.current;
    setNewsLoading(true);
    setNewsError(null);
    fetchNews(topic)
      .then((items) => {
        if (reqId !== newsReqId.current) return;
        newsCache.current[topic] = items;
        setNewsItems(items);
        setNewsLoading(false);
      })
      .catch(() => {
        if (reqId !== newsReqId.current) return;
        setNewsError('Could not load headlines');
        setNewsLoading(false);
      });
  };

  useEffect(() => { loadNews(newsFilter); }, [newsFilter]);

  const newsFilterRef = useRef(newsFilter);
  useEffect(() => { newsFilterRef.current = newsFilter; }, [newsFilter]);

  useEffect(() => {
    const REFRESH_MS = 6 * 60 * 60 * 1000;
    const id = setInterval(() => {
      newsCache.current = {};
      loadNews(newsFilterRef.current);
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const announcedRef = useRef(new Set());

  const announceFlow = async (f) => {
    const line = `${f.name} workflow starting now. ${flowDetail(f.actions)}`;
    if (engine === 'System TTS') {
      const status = await speak(line);
      notify(status === 'spoken' ? `${f.name} workflow · System TTS` : `${f.name} workflow · ${TTS_STATUS[status]}`, 5200);
      return;
    }
    notify(`${f.name} workflow starting` + (bt.connected ? ` · speaking to ${bt.name}` : ''), 5200);
  };

  useEffect(() => {
    const hhmm = pad(now.getHours()) + ':' + pad(now.getMinutes());
    const dateKey = now.toDateString();
    flows.forEach((f) => {
      if (!f.enabled || f.next !== hhmm) return;
      const key = dateKey + '|' + f.name;
      if (announcedRef.current.has(key)) return;
      announcedRef.current.add(key);
      announceFlow(f);
    });
  }, [now, flows]);

  useEffect(() => {
    try { localStorage.setItem(FLOWS_KEY, JSON.stringify(flows)); } catch { /* storage unavailable */ }
  }, [flows]);

  const go = (target) => () => setScreen(target);

  const countdown = useMemo(() => {
    const next = new Date(now);
    next.setHours(7, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const diff = Math.floor((next - now) / 1000);
    return pad(Math.floor(diff / 3600)) + ':' + pad(Math.floor(diff / 60) % 60);
  }, [now]);

  const titles = TITLES();

  const speakNow = () => notify(`Listening for "${wake}"…`);

  const runMorning = async () => {
    if (engine === 'System TTS') {
      const status = await speak('Good morning. Here is your BARDio morning brief.');
      notify('Morning brief running · ' + TTS_STATUS[status], 5200);
      return;
    }
    notify('Morning brief running' + (bt.connected ? ` · speaking to ${bt.name}` : ''), 5200);
  };

  const readNews = async () => {
    if (!headlines.length) { notify('No headlines to read'); return; }
    if (engine === 'System TTS') {
      const lines = headlines.slice(0, 4).map((h) => h.title).join('. ');
      const status = await speak(`${newsFilter} bulletin. ${lines}`);
      notify(
        status === 'spoken'
          ? `Reading bulletin · ${headlines.length} stories · System TTS`
          : `Reading bulletin · ${TTS_STATUS[status]}`,
        5200
      );
      return;
    }
    notify(`Reading bulletin · ${headlines.length} stories` + (bt.connected ? ` · ${bt.name}` : ''), 5200);
  };

  const reconnectDevice = async () => {
    if (!navigator.bluetooth) {
      notify('Web Bluetooth not supported in this browser');
      return;
    }
    setBt((b) => ({ ...b, connecting: true }));
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });
      btDeviceRef.current = device;
      notify(`Connecting to ${device.name || 'device'}…`);

      device.addEventListener('gattserverdisconnected', () => {
        setBt((b) => ({ ...b, connected: false, connecting: false }));
        notify(`${device.name || 'Device'} disconnected`);
      });

      const server = await device.gatt.connect();
      let battery = null;
      try {
        const service = await server.getPrimaryService('battery_service');
        const characteristic = await service.getCharacteristic('battery_level');
        const value = await characteristic.readValue();
        battery = value.getUint8(0);
      } catch {
        // device doesn't expose a standard battery service — that's fine
      }

      setBt({ connected: true, connecting: false, name: device.name || 'Unnamed device', battery });
      notify(`Connected to ${device.name || 'device'}`);
    } catch (err) {
      setBt((b) => ({ ...b, connecting: false }));
      notify(err && err.name === 'NotFoundError' ? 'No device selected' : 'Bluetooth connection failed');
    }
  };

  const disconnectDevice = () => {
    const device = btDeviceRef.current;
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
    } else {
      setBt((b) => ({ ...b, connected: false, connecting: false }));
      notify(bt.connected && bt.name ? `${bt.name} disconnected` : 'No device connected');
    }
  };

  const activeCount = flows.filter((f) => f.enabled).length;

  const tiles = [
    { title: 'Next up', sub: 'Morning brief · 07:00', meta: 'T-' + countdown, metaColor: ACCENT, glyphKey: 'morning', active: true, open: go('flows') },
    { title: 'Workflows', sub: activeCount + ' scheduled', meta: null, glyphKey: 'focus', active: false, open: go('flows') },
    { title: 'Voice', sub: 'Wake armed · offline', meta: null, glyphKey: 'voice', active: false, open: go('voice') },
    { title: 'NFC tags', sub: '6 tags mapped', meta: null, glyphKey: 'nfc', active: false, open: go('nfc') },
    { title: 'News', sub: 'Bulletin · 4 stories', meta: null, glyphKey: 'news', active: false, open: go('news') },
    { title: 'Settings', sub: 'Wake word · Bluetooth', meta: null, glyphKey: 'gear', active: false, open: go('settings') }
  ];

  const flowRows = flows
    .filter((f) => filter === 'ALL' || f.slot === filter)
    .map((f) => ({
      name: f.name, detail: flowDetail(f.actions), next: f.enabled ? f.next : '—',
      fg: f.enabled ? '#fff' : '#666', enabled: f.enabled,
      toggle: () => setFlows((fs) => fs.map((x) => x.name === f.name ? { ...x, enabled: !x.enabled } : x))
    }));

  const waveCols = wave.map((v) => ({
    cells: Array.from({ length: 11 }, (_, i) => {
      const dist = Math.abs(i - 5), h = Math.round(v / 2);
      return { bg: dist <= h ? (dist <= 1 ? ACCENT : '#777') : '#161616' };
    })
  }));

  const tags = TAGS.map((t, i) => ({
    place: t.place, workflow: t.workflow, key: t.key,
    selected: i === tagIdx,
    select: () => { setTagIdx(i); setProgramState('idle'); }
  }));

  const engines = ENGINES.map((e) => ({
    label: e.short, glyph: e.glyph,
    active: engine === e.name,
    onSelect: () => setEngine(e.name)
  }));

  const switchRows = switches.map((sw) => ({
    label: sw.label, note: sw.note, on: sw.on,
    toggle: () => setSwitches((ss) => ss.map((x) => x.label === sw.label ? { ...x, on: !x.on } : x))
  }));

  const headlines = newsItems.map((n, i) => ({
    ...n,
    selected: newsIdx === i,
    tagColor: newsIdx === i ? ACCENT : '#666',
    select: () => setNewsIdx(i)
  }));

  const title = titles[screen];
  const pageSub = screen === 'flows'
    ? activeCount + ' active of ' + flows.length
    : screen === 'voice'
      ? `Wake phrase · "${wake}"`
      : title.s;

  const headerAction = screen === 'home' && (
    <div className="header-actions">
      <button className="header-mic-btn" onClick={speakNow} aria-label="Talk to BARDio">
        <span className="header-mic-dot" />
      </button>
      <button className="header-action" onClick={runMorning} aria-label="Run morning brief">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M7 5v14l12-7z" />
        </svg>
        Run brief
      </button>
    </div>
  );

  return (
    <div className="app">
      <ScreenHeader title={title.t} sub={pageSub} action={headerAction} />

      <main className="app-body">
        {screen === 'home' && (
          <Home
            device={{
              name: bt.connected ? bt.name : 'No device connected',
              status: bt.connecting
                ? 'Bluetooth · Connecting…'
                : bt.connected
                  ? 'Bluetooth · Connected'
                  : 'Bluetooth · Not connected',
              battery: bt.connected ? bt.battery : null
            }}
            tiles={tiles}
            onReconnect={reconnectDevice}
            onDisconnect={disconnectDevice}
            connecting={bt.connecting}
          />
        )}
        {screen === 'flows' && (
          <Flows
            filter={filter}
            setFilter={setFilter}
            rows={flowRows}
            onAdd={(f) => setFlows((fs) => [...fs, { ...f, enabled: true }])}
          />
        )}
        {screen === 'voice' && (
          <Voice
            voiceState={['LISTENING', 'ACTIVE', 'PROCESSING'][voiceIdx]}
            voiceMeta={['WAKE ARMED', 'CAPTURING', 'INTENT MATCH'][voiceIdx]}
            waveCols={waveCols}
            lastCommand={`"${wake}, focus mode for ninety minutes"`}
            lastResponse="Focus block engaged. Ninety minutes. Notifications suppressed. I will check in at the halfway mark."
            onCycle={() => setVoiceIdx((v) => (v + 1) % 3)}
          />
        )}
        {screen === 'nfc' && (
          <Nfc
            tags={tags}
            selectedTag={TAGS[tagIdx].workflow}
            showStatus={programState !== 'idle'}
            statusState={programState === 'writing' ? 'loading' : 'saved'}
            onProgram={() => {
              setProgramState('writing');
              setTimeout(() => setProgramState('done'), 1400);
            }}
          />
        )}
        {screen === 'settings' && (
          <Settings
            device={bt.connected ? bt.name : 'No device connected'}
            wakeInput={wake}
            setWake={(ev) => setWakeState(ev.target.value)}
            engines={engines}
            switches={switchRows}
          />
        )}
        {screen === 'news' && (
          <News
            newsFilter={newsFilter}
            setNewsFilter={(f) => { setNewsFilter(f); setNewsIdx(0); }}
            headlines={headlines}
            onRead={readNews}
            loading={newsLoading}
            error={newsError}
            onRetry={() => { delete newsCache.current[newsFilter]; loadNews(newsFilter); }}
          />
        )}
      </main>

      <BulletToast toast={toast} />
      <BottomNav screen={screen} go={(t) => setScreen(t)} />
    </div>
  );
}
