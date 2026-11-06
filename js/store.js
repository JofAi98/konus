// Everything you learn lives here first (on this device), then sync copies it to your account.
import { L, P } from './lang.js';

let KEY = L.storeKey;
const blank = () => ({
  v: 1,
  cards: {},
  progress: {},
  words: {},
  stats: { days: {} },
  tests: {}, // placement results, by level
  study: {}, // rules to study after a test: { at, done }
  settings: { name: 'Giosuè', showSpelling: true, recordedVoice: L.defaultVoice, voiceURI: '', rate: 0.9, volume: 0.7, settingsAt: 0 },
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

// Weekly streak: a day counts once you earn DAY_XP in it, a week once WEEK_GOAL of its days count.
export const WEEK_GOAL = 3;
export const DAY_XP = 30;
// Days from before XP existed count if anything was practised on them.
const dayXP = (d) => (!d ? 0 : d.xp ?? (Object.values(d).some((n) => n > 0) ? DAY_XP : 0));
const monday = (t = Date.now()) => {
  const d = new Date(t);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};
export const weekDays = (t) => {
  const m = monday(t);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(m); d.setDate(m.getDate() + i); return dayKey(d); });
};
export const cardId = (kind, tr) => `${kind === 'word' ? 'w' : 'p'}:${String(tr).split(/\s+/).map(P.clean).filter(Boolean).join('_')}`;

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

  // Write this language to the device now: it is about to be swapped for another.
  save() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
  },
  // Load the language that has just become active. Your name, speed and volume come along.
  reload() {
    const { name, rate, volume } = state.settings;
    KEY = L.storeKey;
    state = load();
    state.settings = { ...state.settings, name, rate, volume };
    changed('all', null, true);
  },

  // A finished placement test. Each rule it caught goes on the study list, or back on it.
  saveTest(level, result) {
    state.tests[level] = result;
    for (const id of result.rules) state.study[id] = { ...state.study[id], at: result.at, level };
    state.metaAt = Date.now();
    changed('meta', null, false);
  },
  studyDone(id) {
    state.study[id] = { ...state.study[id], done: Date.now() };
    state.metaAt = Date.now();
    changed('meta', null, false);
  },
  // A test in progress, kept on this device so a closed app doesn't lose it.
  setRun(run) {
    state.run = run;
    persist();
  },

  markSeeded(batch) {
    state.seeded = batch;
    persist();
  },
  // One right answer for a theme word; returns its new count.
  wordHit(key, max) {
    const w = state.words[key] || { n: 0 };
    if (w.n >= max) return w.n;
    state.words[key] = { n: w.n + 1, at: Date.now() };
    state.metaAt = Date.now();
    changed('meta', null, false);
    return w.n + 1;
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
    for (const [k, v] of Object.entries(remote.words || {})) {
      if (!state.words[k] || v.n > state.words[k].n) state.words[k] = v;
    }
    for (const [day, v] of Object.entries(remote.stats?.days || {})) {
      const mine = state.stats.days[day] || (state.stats.days[day] = {});
      for (const [k, n] of Object.entries(v)) mine[k] = Math.max(mine[k] || 0, n);
    }
    for (const [k, v] of Object.entries(remote.tests || {})) {
      if (!state.tests[k] || v.at > state.tests[k].at) state.tests[k] = v;
    }
    for (const [k, v] of Object.entries(remote.study || {})) {
      const mine = state.study[k] || {};
      state.study[k] = { ...v, at: Math.max(mine.at || 0, v.at || 0), done: Math.max(mine.done || 0, v.done || 0) };
    }
    if (remote.settings && (remote.settings.settingsAt || 0) > (state.settings.settingsAt || 0)) {
      const { voiceURI, rate, volume } = state.settings;
      state.settings = { ...state.settings, ...remote.settings, voiceURI, rate, volume };
    }
    changed('meta', null, true);
  },
  metaForSync() {
    const { name, showSpelling, recordedVoice, settingsAt } = state.settings;
    return { progress: state.progress, words: state.words, stats: state.stats, tests: state.tests, study: state.study, settings: { name, showSpelling, recordedVoice, settingsAt }, updatedAt: Date.now() };
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

  // This week, Monday to Sunday: each day's XP and whether it counts.
  week(t = Date.now()) {
    const today = dayKey();
    const days = weekDays(t).map((k) => ({ k, xp: dayXP(state.stats.days[k]), today: k === today, future: k > today }));
    days.forEach((d) => { d.on = d.xp >= DAY_XP; });
    return { days, count: days.filter((d) => d.on).length };
  },
  // Weeks in a row with at least WEEK_GOAL practice days. This week joins once it reaches
  // the goal; until Sunday is over it can't break the streak.
  weekStreak() {
    const m = monday();
    let n = this.week(m).count >= WEEK_GOAL ? 1 : 0;
    for (;;) {
      m.setDate(m.getDate() - 7);
      if (this.week(m).count < WEEK_GOAL) return n;
      n++;
    }
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
