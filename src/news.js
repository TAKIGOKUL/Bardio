const LANG = 'en-IN';
const REGION = 'IN';
const CEID = 'IN:en';

const FEEDS = {
  KERALA: `https://news.google.com/rss/search?q=Kerala&hl=${LANG}&gl=${REGION}&ceid=${CEID}`,
  INDIA: `https://news.google.com/rss?hl=${LANG}&gl=${REGION}&ceid=${CEID}`,
  WORLD: `https://news.google.com/rss/headlines/section/topic/WORLD?hl=${LANG}&gl=${REGION}&ceid=${CEID}`,
  TECH: `https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=${LANG}&gl=${REGION}&ceid=${CEID}`
};

function relativeTime(dateStr) {
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.round(Math.max(0, Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours + 'h ago';
  return Math.round(hours / 24) + 'd ago';
}

// Google News RSS titles are formatted "Headline - Source"
function splitTitle(raw, fallbackSource) {
  const idx = raw.lastIndexOf(' - ');
  if (idx > -1) return { title: raw.slice(0, idx), source: raw.slice(idx + 3) };
  return { title: raw, source: fallbackSource || 'News' };
}

export async function fetchNews(topic) {
  const rssUrl = FEEDS[topic] || FEEDS.INDIA;
  const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl));
  if (!res.ok) throw new Error('News request failed');
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('News feed error');

  return data.items.slice(0, 8).map((item) => {
    const { title, source } = splitTitle(item.title || '', data.feed && data.feed.title);
    return { topic, title, source, time: relativeTime(item.pubDate), link: item.link };
  });
}
