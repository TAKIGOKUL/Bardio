export const ACCENT = '#c8ff00';
export const IDLE = '#2a2a2a';
export const DIM = '#1f1f1f';

// 3x3 dot-matrix glyph patterns, row-major, 1 = lit
export const GLYPH = {
  morning: [0, 1, 0, 1, 1, 1, 0, 1, 0],
  focus:   [1, 0, 1, 0, 1, 0, 1, 0, 1],
  workout: [1, 1, 1, 0, 1, 0, 1, 1, 1],
  sleep:   [0, 0, 1, 0, 1, 1, 1, 1, 0],
  meal:    [1, 0, 1, 1, 1, 1, 0, 1, 0],
  leaving: [1, 1, 0, 0, 1, 0, 0, 1, 1],
  voice:   [0, 1, 0, 0, 1, 0, 0, 1, 0],
  nfc:     [1, 0, 1, 1, 1, 1, 1, 0, 1],
  gear:    [1, 1, 1, 1, 0, 1, 1, 1, 1],
  home:    [0, 1, 0, 1, 1, 1, 1, 0, 1],
  news:    [1, 1, 1, 1, 1, 0, 1, 1, 1],
  lan:     [1, 1, 1, 1, 0, 0, 1, 1, 1],
  cloud:   [0, 1, 0, 1, 1, 1, 1, 1, 1],
  chip:    [1, 1, 1, 1, 0, 1, 1, 1, 1]
};

// Bottom nav — glyph key paired with the screen it opens.
export const NAV = [
  { key: 'home', target: 'home' },
  { key: 'morning', target: 'flows' },
  { key: 'voice', target: 'voice' },
  { key: 'news', target: 'news' },
  { key: 'gear', target: 'settings' }
];

// Composable preset actions a workflow can run, in priority/optimised order.
export const ACTIONS = [
  { key: 'brief',    label: 'Morning brief' },
  { key: 'weather',  label: 'Weather' },
  { key: 'tasks',    label: 'Tasks' },
  { key: 'traffic',  label: 'Traffic' },
  { key: 'music',    label: 'Music' },
  { key: 'silence',  label: 'Silence notifications' },
  { key: 'reminder', label: 'Reminder' },
  { key: 'recap',    label: 'Day recap' }
];
const ACTION_LABEL = Object.fromEntries(ACTIONS.map((a) => [a.key, a.label]));

export function flowDetail(actions) {
  if (!actions || !actions.length) return 'No actions';
  return actions.length + ' step' + (actions.length > 1 ? 's' : '') + ' · ' +
    actions.map((k) => ACTION_LABEL[k] || k).join(', ');
}

export const DEFAULT_FLOWS = [
  { name: 'Morning', enabled: true,  next: '07:00', slot: 'AM',    actions: ['brief', 'weather', 'tasks'] },
  { name: 'Focus',   enabled: true,  next: '09:30', slot: 'AM',    actions: ['silence', 'tasks'] },
  { name: 'Meal',    enabled: false, next: '13:00', slot: 'PM',    actions: ['reminder'] },
  { name: 'Workout', enabled: true,  next: '18:15', slot: 'PM',    actions: ['music', 'reminder'] },
  { name: 'Evening', enabled: false, next: '20:00', slot: 'PM',    actions: ['recap'] },
  { name: 'Sleep',   enabled: true,  next: '23:00', slot: 'NIGHT', actions: ['silence'] }
];

// One-tap presets offered in the Add Workflow sheet.
export const FLOW_PRESETS = [
  { name: 'Morning', next: '07:00', slot: 'AM',    actions: ['brief', 'weather', 'tasks'] },
  { name: 'Focus',   next: '09:30', slot: 'AM',    actions: ['silence', 'tasks'] },
  { name: 'Leaving', next: '08:30', slot: 'AM',    actions: ['traffic', 'music'] },
  { name: 'Meal',    next: '13:00', slot: 'PM',    actions: ['reminder'] },
  { name: 'Workout', next: '18:15', slot: 'PM',    actions: ['music', 'reminder'] },
  { name: 'Evening', next: '20:00', slot: 'PM',    actions: ['recap'] },
  { name: 'Sleep',   next: '23:00', slot: 'NIGHT', actions: ['silence'] }
];

export const DEFAULT_SWITCHES = [
  { label: 'Always listening', note: 'Porcupine low-power VAD', on: true },
  { label: 'Bluetooth auto-connect', note: 'Reconnect watchdog on drop', on: true },
  { label: 'NFC screen-off', note: 'Background dispatch', on: true },
  { label: 'Gemini online', note: 'Falls back to on-device', on: false }
];

export const ENGINES = [
  { name: 'System TTS', short: 'System', note: 'Browser speech synthesis', glyph: 'chip' },
  { name: 'Coqui XTTS v2', short: 'Coqui', note: 'LAN server · jenny (not connected)', glyph: 'lan' },
  { name: 'ElevenLabs', short: 'ElevenLabs', note: 'Cloud · George (not connected)', glyph: 'cloud' }
];

export const TAGS = [
  { place: 'Bedside', workflow: 'MORNING', key: 'morning' },
  { place: 'Study desk', workflow: 'FOCUS', key: 'focus' },
  { place: 'Kitchen', workflow: 'MEAL', key: 'meal' },
  { place: 'Front door', workflow: 'LEAVING', key: 'leaving' },
  { place: 'Gym bag', workflow: 'WORKOUT', key: 'workout' },
  { place: 'Bed frame', workflow: 'SLEEP', key: 'sleep' }
];

export const NEWS_TABS = ['KERALA', 'INDIA', 'WORLD', 'TECH'];

export const TITLES = () => ({
  home:     { t: 'BARDio', s: null },
  news:     { t: 'News', s: 'Morning bulletin · Kerala, India, world, tech' },
  flows:    { t: 'Workflows', s: null },
  voice:    { t: 'Voice', s: null },
  nfc:      { t: 'NFC tags', s: 'NDEF text record · 6 tags mapped' },
  settings: { t: 'Settings', s: 'Engine, wake word, system' }
});
