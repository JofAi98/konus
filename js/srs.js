// FSRS v4.5 scheduler (after open-spaced-repetition/fsrs.js, MIT).
// Grades: 1 Again, 2 Hard, 3 Good, 4 Easy.

const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const DECAY = -0.5;
const FACTOR = 19 / 81;
const RETENTION = 0.9;
export const DAY = 864e5;
const MIN = 6e4;

const clampD = (d) => Math.min(10, Math.max(1, d));
const initD = (g) => clampD(W[4] - (g - 3) * W[5]);

export function retrievability(c, now = Date.now()) {
  if (!c || !c.s || !c.last) return 0;
  const t = Math.max(0, (now - c.last) / DAY);
  return Math.pow(1 + (FACTOR * t) / c.s, DECAY);
}

function nextState(c, g, now) {
  if (!c.s) return { s: W[g - 1], d: initD(g) };
  const r = retrievability(c, now);
  let d = c.d - W[6] * (g - 3);
  d = clampD(W[7] * initD(4) + (1 - W[7]) * d);
  let s;
  if (g === 1) {
    s = Math.min(c.s, W[11] * Math.pow(c.d, -W[12]) * (Math.pow(c.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
  } else {
    s = c.s * (Math.exp(W[8]) * (11 - c.d) * Math.pow(c.s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1) + 1);
  }
  return { s: Math.max(0.1, s), d };
}

function intervalMs(s, g, isNew) {
  if (g === 1) return (isNew ? 1 : 10) * MIN;
  const days = (s / FACTOR) * (Math.pow(RETENTION, 1 / DECAY) - 1);
  if (g === 2 && days < 1) return 12 * 60 * MIN;
  return Math.max(1, Math.round(days)) * DAY;
}

export function grade(c, g, now = Date.now()) {
  const isNew = !c.s;
  const { s, d } = nextState(c, g, now);
  return {
    ...c, s, d,
    reps: (c.reps || 0) + 1,
    lapses: (c.lapses || 0) + (g === 1 && !isNew ? 1 : 0),
    last: now,
    due: now + intervalMs(s, g, isNew),
    updatedAt: now,
  };
}

export function preview(c, now = Date.now()) {
  return [1, 2, 3, 4].map((g) => fmt(grade(c, g, now).due - now));
}

export function fmt(ms) {
  if (ms < 60 * MIN) return `${Math.max(1, Math.round(ms / MIN))}m`;
  if (ms < DAY) return `${Math.round(ms / (60 * MIN))}h`;
  const d = Math.round(ms / DAY);
  if (d < 31) return `${d}d`;
  if (d < 365) return `${Math.round(d / 30)}mo`;
  return `${(d / 365).toFixed(1)}y`;
}

export const endOfToday = () => { const t = new Date(); t.setHours(23, 59, 59, 999); return t.getTime(); };
export const isDue = (c, now = Date.now()) => !c.deleted && c.due && c.due <= Math.max(now, endOfToday());
