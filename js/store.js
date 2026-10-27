// Everything you learn lives here first (on this device), then sync copies it to your account.
import { clean } from './pron.js';

const KEY = 'konus.v1';
const blank = () => ({
  v: 1,
  cards: {},
  progress: {},
  stats: { days: {} },
  settings: { name: 'Giosuè', showSpelling: true, voiceURI: '', rate: 0.9, settingsAt: 0 },
  metaAt: 0,
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const s = JSON.parse(raw);
    const b = blank();
    return { ...b, ...s, settings: { ...b.settings, ...s.settings }, stats: { ...b.stats, ...s.stats } };
  } catch { return blank(); }
}

let state = load();
const uiSubs = new Set();
let syncHook = null;
let saveTimer = null;

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
  }, 150);
}
function changed(kind, payload, remote) {
  persist();
  uiSubs.forEach((fn) => fn(kind));
  if (!remote && syncHook) syncHook(kind, payload);
}

export const dayKey = (t = Date.now()) => new Date(t).toLocaleDateString('en-CA');
export const cardId = (kind, tr) => `${kind === 'word' ? 'w' : 'p'}:${String(tr).split(/\s+/).map(clean).filter(Boolean).join('_')}`;

export const store = {
  get state() { return state; },
  subscribe(fn) { uiSubs.add(fn); return () => uiSubs.delete(fn); },
  setSyncHook(fn) { syncHook = fn; },

  cards: () => Object.values(state.cards).filter((c) => !c.deleted),
  allCardsIncludingDeleted: () => Object.values(state.cards),
  card: (id) => (state.cards[id] && !state.cards[id].deleted ? state.cards[id] : null),

  putCard(card, { remote = false } = {}) {
    const c = remote ? card : { ...card, updatedAt: Date.now() };
    state.cards[c.id] = c;
    changed('card', c.id, remote);
    return c;
  },
  deleteCard(id) {
    const c = state.cards[id];
    if (!c) return;
    state.cards[id] = { id, deleted: true, updatedAt: Date.now() };
    changed('card', id, false);
  },

  markSeeded() {
    state.seeded = true;
    persist();
  },
  markLesson(id) {
    if (!state.progress[id]) state.progress[id] = { at: Date.now() };
    state.metaAt = Date.now();
    changed('meta', null, false);
  },
  log(kind, n = 1) {
    const k = dayKey();
    const d = state.stats.days[k] || (state.stats.days[k] = {});
    d[kind] = (d[kind] || 0) + n;
    state.metaAt = Date.now();
    changed('meta', null, false);
  },
  setSettings(patch) {
    state.settings = { ...state.settings, ...patch, settingsAt: Date.now() };
    state.metaAt = Date.now();
    changed('meta', null, false);
  },

  // Merge the account copy of progress, stats and settings into this device.
  mergeMeta(remote) {
    if (!remote) return;
    for (const [id, v] of Object.entries(remote.progress || {})) {
      if (!state.progress[id] || v.at < state.progress[id].at) state.progress[id] = v;
    }
    for (const [day, v] of Object.entries(remote.stats?.days || {})) {
      const mine = state.stats.days[day] || (state.stats.days[day] = {});
      for (const [k, n] of Object.entries(v)) mine[k] = Math.max(mine[k] || 0, n);
    }
    if (remote.settings && (remote.settings.settingsAt || 0) > (state.settings.settingsAt || 0)) {
      const { voiceURI, rate } = state.settings;
      state.settings = { ...state.settings, ...remote.settings, voiceURI, rate };
    }
    changed('meta', null, true);
  },
  metaForSync() {
    const { name, showSpelling, settingsAt } = state.settings;
    return { progress: state.progress, stats: state.stats, settings: { name, showSpelling, settingsAt }, updatedAt: Date.now() };
  },

  replaceAll(next) {
    state = { ...blank(), ...next };
    changed('all', null, false);
  },
  reset() {
    const settings = state.settings;
    const tomb = Object.fromEntries(Object.keys(state.cards).map((id) => [id, { id, deleted: true, updatedAt: Date.now() }]));
    state = { ...blank(), cards: tomb, settings };
    state.metaAt = Date.now();
    changed('all', null, false);
  },

  streak() {
    const days = state.stats.days;
    const active = (k) => days[k] && Object.values(days[k]).some((n) => n > 0);
    let t = Date.now();
    if (!active(dayKey(t))) t -= 864e5;
    let n = 0;
    while (active(dayKey(t))) { n++; t -= 864e5; }
    return n;
  },
};

/* ---------- Your recordings, kept on this device only ---------- */

let dbp = null;
function db() {
  if (!dbp) {
    dbp = new Promise((resolve, reject) => {
      const r = indexedDB.open('konus', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('rec');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }
  return dbp;
}
export async function saveRecording(key, blob) {
  try {
    const d = await db();
    await new Promise((res, rej) => { const tx = d.transaction('rec', 'readwrite'); tx.objectStore('rec').put(blob, key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  } catch { /* recordings are a convenience; ignore storage failures */ }
}
export async function getRecording(key) {
  try {
    const d = await db();
    return await new Promise((res) => { const r = d.transaction('rec').objectStore('rec').get(key); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); });
  } catch { return null; }
}
