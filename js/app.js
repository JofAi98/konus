import { UNITS, LESSONS, lessonById, COURSE_WORDS } from './course.js';
import * as P from './pron.js';
import * as S from './speech.js';
import * as srs from './srs.js';
import { store, cardId, saveRecording, getRecording, dayKey } from './store.js';
import * as sync from './sync.js';
import { VOICES, SAMPLES } from './voices.js';
import { PATH, KIND, XP, DAILY_GOAL, NEXT_RANK, FEATURES, TUTORIAL, HUNTER, LADDER, hunterRank, XP_PER_LEVEL, levelInfo, xpToReach, rankOf, rankIndex, isOpen, featureOpen, unlocksAt } from './levels.js';
import { DRILLS, drillById } from './drills.js';
import { DIALOGUES, dialogueById, WHO } from './dialogues.js';
import { STORIES, storyById } from './stories.js';

/* ---------- helpers ---------- */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const view = $('#view');
const settings = () => store.state.settings;
const fill = (s) => String(s ?? '').replaceAll('{name}', settings().name || 'Giosuè');
const upper = (s) => s.replace(/ə/g, 'Ə').toUpperCase();
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const kindOf = (tr) => (P.tokens(tr).length > 1 ? 'phrase' : 'word');
const recKey = (tr) => cardId(kindOf(tr), fill(tr));

const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  play: svg('<path d="M7 4.8v14.4L19 12z" fill="currentColor" stroke="none"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
  rec: svg('<circle cx="12" cy="12" r="5.5" fill="currentColor" stroke="none"/>'),
  stop: svg('<rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  back: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  today: svg('<path d="M4 10.5L12 4l8 6.5V20h-5.5v-6h-5v6H4z"/>'),
  path: svg('<circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="5.5" r="2"/><path d="M8 18.5h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/>'),
  vocab: svg('<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19v3H7.5"/>'),
  pron: svg('<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>'),
  sliders: svg('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  ear: svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="1.5"/><rect x="16.5" y="14" width="4" height="6" rx="1.5"/>'),
  copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>'),
  lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>'),
  star: svg('<path d="M12 3.8l2.5 5.2 5.6.7-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.7z"/>'),
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Meaning of any word the app knows, from the course and your vocab.
const EXTRA_WORDS = [
  ...DRILLS.flatMap((d) => d.items.flatMap((it) => it.words)),
  ...DIALOGUES.flatMap((d) => d.lines.flatMap((l) => l.words)),
  ...STORIES.flatMap((st) => st.lines.flatMap((l) => l.words)),
];
function glossMap() {
  const m = new Map();
  for (const w of COURSE_WORDS) m.set(P.clean(w.tr), w.en);
  for (const w of EXTRA_WORDS) if (!m.has(P.clean(w.tr))) m.set(P.clean(w.tr), w.en);
  for (const c of store.cards()) if (c.kind === 'word' && !m.has(P.clean(c.tr))) m.set(P.clean(c.tr), c.en);
  return m;
}

/* ---------- building blocks ---------- */

function sayHTML(text) {
  return P.tokens(fill(text)).map((t) => {
    const r = P.respellWord(t);
    return `<span class="sw">${r.say.map((s, i) => (i === r.stress ? `<b>${esc(upper(s))}</b>` : esc(s))).join('<i>-</i>')}</span>`;
  }).join(' ');
}

function phraseHTML(tr, { size = 'xl', spelling = settings().showSpelling } = {}) {
  return `<div class="phrase ${size}${spelling ? '' : ' nospell'}">
    ${spelling ? `<p class="tr" lang="tr">${esc(fill(tr))}</p>` : ''}
    <p class="say" aria-label="How to say it">${sayHTML(tr)}</p>
  </div>`;
}

const audioHTML = (tr) => `<div class="audio">
  <button class="btn" data-act="play" data-text="${esc(tr)}">${I.play}<span>Listen</span></button>
  <button class="btn ghost" data-act="play" data-slow="1" data-text="${esc(tr)}"><span>Slow</span></button>
</div>`;

const speakHTML = (tr) => `<div class="speak" data-target="${esc(tr)}" data-key="${esc(recKey(tr))}">
  <div class="speak-row">
    <button class="btn mic" data-act="check">${I.mic}<span>Say it</span></button>
    <button class="btn ghost" data-act="rec">${I.rec}<span>Record</span></button>
  </div>
  <div class="result" aria-live="polite"></div>
  <div class="mine" hidden>
    <canvas class="wave" aria-hidden="true"></canvas>
    <div class="row">
      <button class="btn ghost small" data-act="playmine">${I.play}<span>My recording</span></button>
      <button class="btn ghost small" data-act="compare">${I.ear}<span>Native, then mine</span></button>
    </div>
  </div>
</div>`;

function breakdownHTML(it) {
  const words = (it.words || []).filter((w) => P.clean(w.tr) !== P.clean(it.tr));
  if (!words.length) return '';
  return `<ul class="breakdown">${words.map((w) => `<li><a href="#word/${encodeURIComponent(w.tr)}" lang="tr">${esc(w.tr)}</a><span>${esc(w.en)}</span></li>`).join('')}</ul>`;
}

const strengthPct = (c) => Math.round(srs.retrievability(c) * 100);

function hydrateRecordings(root = view) {
  $$('.speak', root).forEach(async (panel) => {
    const blob = await getRecording(panel.dataset.key);
    if (blob && panel.isConnected) showMine(panel, blob);
  });
}

function showMine(panel, blob) {
  panel._blob = blob;
  const mine = $('.mine', panel);
  mine.hidden = false;
  S.drawWave(blob, $('.wave', mine));
}

/* ---------- Levels and XP ---------- */

const me = () => {
  const rank = rankOf(store.state.progress);
  const m = { rank, progress: store.state.progress, ...levelInfo(store.state.stats, rank) };
  m.hunter = hunterRank(m);
  return m;
};
const isDone = (id) => !!store.state.progress[id];
const pathItem = (id) => PATH.find((p) => p.id === id);
// During the tutorial (rank F), its five steps come first.
const nextUp = (m = me()) => (m.hunter.id === 'F' && PATH.find((p) => TUTORIAL.includes(p.id) && !isDone(p.id)))
  || PATH.find((p) => !isDone(p.id) && isOpen(p, m));

const badgeHTML = (h, size = '') => `<span class="hbadge r-${h.letter}${size ? ' ' + size : ''}" role="img" aria-label="Rank ${h.id}">
  <svg viewBox="0 0 64 72" aria-hidden="true"><path d="M32 3L59 14v22c0 16-11.5 28-27 33C16.5 64 5 52 5 36V14z"/></svg>
  <span class="hl">${h.letter}${h.plus ? '<sup>+</sup>' : ''}</span>
</span>`;

const RANK_LINES = {
  E: 'Tutorial complete. You\'re on the A1 course now.',
  'E+': 'The second half of A1. The A1 exam opens at level 30.',
  D: 'You passed A1. Everything in A2 is open.',
  'D+': 'The second half of A2.',
  C: 'You passed A2. Welcome to B1.',
};

function rankUp(h) {
  const el = document.createElement('div');
  el.className = 'levelup rankup';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'ru-title');
  el.innerHTML = `<div class="lu-card center r-${h.letter}">
    <p class="eyebrow">Rank up</p>
    ${badgeHTML(h, 'xl')}
    <h2 id="ru-title" class="lu-num">Rank ${h.id}</h2>
    <p class="muted">${h.cefr ? `European level ${h.cefr}. ` : ''}${esc(RANK_LINES[h.id] || '')}</p>
    <p class="small">Next: ${esc(h.next)}</p>
    <button class="btn primary">Continue</button>
  </div>`;
  el.querySelector('button').addEventListener('click', () => el.remove());
  document.body.append(el);
  el.querySelector('button').focus();
}
const xpToGo = (level, m = me()) => xpToReach(level, m);

// XP only counts at your own rank: an A1 phrase earns XP while you're A1, a B1 phrase while you're B1.
// xpFrom is the rank of what's on screen; null means it belongs to your rank (like phrases you add).
let xpFrom = null;
const cardRank = (c) => (c?.src === 'known' ? 'A1' : pathItem(c?.src)?.rank || null);
let belowNoted = false;

// The next level (within A1) that opens something, and what it opens.
function nextUnlock(m = me()) {
  if (m.rank.id !== 'A1') return null;
  for (let L = m.level + 1; L <= 30; L++) {
    const items = unlocksAt(L);
    if (items.length) return { level: L, items };
  }
  return null;
}

function award(n, from = xpFrom) {
  if (!n) return;
  const m = me();
  if (from && rankIndex(from) < rankIndex(m.rank.id)) {
    if (!belowNoted) { belowNoted = true; xpPop(`${from} practice · no XP`); }
    return;
  }
  const before = m.level;
  if (!store.state.stats.days[dayKey()]?.xp) n += XP.daily; // first practice of the day
  store.log('xp', n);
  if (m.rank.id !== 'A1') store.log('xp_' + m.rank.id, n);
  xpPop(`+${n} XP`);
  const after = me().level;
  if (after > before) levelUp(before, after);
  drawLevelChip();
}

function xpPop(text) {
  const el = document.createElement('div');
  el.className = 'xp-pop';
  el.setAttribute('aria-hidden', 'true');
  el.textContent = text;
  document.body.append(el);
  setTimeout(() => el.remove(), 1500);
}

function levelUp(from, to) {
  const opened = [];
  for (let L = from + 1; L <= to; L++) opened.push(...unlocksAt(L));
  const nx = nextUnlock();
  document.querySelector('.levelup:not(.rankup)')?.remove();
  const el = document.createElement('div');
  el.className = 'levelup';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'lu-title');
  el.innerHTML = `<div class="lu-card">
    <p class="eyebrow">Level up · <span lang="tr">Tebrikler!</span></p>
    <h2 id="lu-title" class="lu-num">Level ${to}</h2>
    ${opened.length ? `<p class="muted small">Now open:</p><ul class="lu-list">${opened.map((o) => `<li><b>${esc(o.title)}</b><span>${esc(o.sub)}</span></li>`).join('')}</ul>`
    : `<p class="muted">${nx ? `Level ${nx.level} opens ${esc(nx.items.map((i) => i.title).join(', '))}.` : `Keep going: the ${esc(me().rank.id)} exam opens at level ${me().rank.examAt}.`}</p>`}
    <button class="btn primary">Continue</button>
  </div>`;
  el.querySelector('button').addEventListener('click', () => el.remove());
  document.body.append(el);
  el.querySelector('button').focus();
}

let shownRank = null;
function drawLevelChip() {
  const el = $('#lvl');
  if (!el) return;
  const m = me();
  const h = m.hunter;
  el.innerHTML = `<b class="r-${h.letter}">${h.id}</b> Lv ${m.level}`;
  el.setAttribute('aria-label', `Rank ${h.id}${h.cefr ? ` (${h.cefr})` : ''}, level ${m.level}`);
  if (shownRank && HUNTER.indexOf(h.id) > HUNTER.indexOf(shownRank)) rankUp(h);
  shownRank = h.id;
}

function levelCardHTML(m = me()) {
  const pct = Math.round((m.into / XP_PER_LEVEL) * 100);
  const today = store.state.stats.days[dayKey()]?.xp || 0;
  const nx = nextUnlock(m);
  const h = m.hunter;
  return `<section class="levelcard">
    <div class="lv-head">
      ${badgeHTML(h)}
      <div class="lv-text">
        <p class="eyebrow">Rank ${h.id} · ${h.cefr ? `${h.cefr} ${esc(m.rank.name)}` : 'Tutorial'}</p>
        <h2 class="lv-num">Level ${m.level}</h2>
        <p class="muted small">${m.rankXp.toLocaleString('en-GB')} XP in ${m.rank.id}</p>
      </div>
    </div>
    <div class="meter" role="progressbar" aria-label="${m.capped ? 'Top level of this rank' : `Progress to level ${m.level + 1}`}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
    <p class="muted small">${m.capped ? `Level ${m.level} is the top of ${m.rank.id}. Pass the <a href="#exam/${m.rank.id}">${m.rank.id} exam</a> to go on.` : `${XP_PER_LEVEL - m.into} XP to level ${m.level + 1}`}</p>
    <div class="goal">
      <span class="eyebrow">Today</span>
      <div class="meter amber" role="progressbar" aria-label="Daily goal" aria-valuemin="0" aria-valuemax="${DAILY_GOAL}" aria-valuenow="${Math.min(today, DAILY_GOAL)}"><span style="width:${Math.min(100, (today / DAILY_GOAL) * 100)}%"></span></div>
      <span class="goal-num">${today} / ${DAILY_GOAL} XP</span>
    </div>
    ${nx ? `<p class="small next-unlock">Level ${nx.level} opens ${esc(nx.items.map((i) => i.title).join(', '))}.</p>` : ''}
    ${h.id === 'F' ? `<div class="tutorial">
      <p class="eyebrow">Tutorial · ${h.tutorialDone} of ${TUTORIAL.length} · finish it to reach rank E</p>
      <ol class="tut-list">${TUTORIAL.map((id) => { const p = pathItem(id); return `<li><a class="${isDone(id) ? 'done' : ''}" href="${p.href}"><span class="lstate">${isDone(id) ? I.check : ''}</span><span>${esc(p.title)}</span><small>${KIND[p.kind]}</small></a></li>`; }).join('')}</ol>
    </div>` : `<p class="small next-rank">Next rank: ${esc(h.next)}</p>`}
  </section>`;
}

function lockedView(item) {
  const m = me();
  const above = rankIndex(item.rank || 'A1') > rankIndex(m.rank.id);
  view.innerHTML = `<button class="backlink" data-act="back">${I.back}<span>Back</span></button>
  <section class="done">
    <p class="eyebrow">${esc(KIND[item.kind] || 'Exam')} · Locked</p>
    <h1>${esc(item.title)}</h1>
    <p class="lede">${above ? `Opens when you pass the ${m.rank.id} exam.` : `Opens at level ${item.level}. You're level ${m.level}, with ${xpToGo(item.level, m)} XP to go.`} Lessons, reviews, drills and every sentence you say out loud earn XP.</p>
    <div class="row"><a class="btn primary" href="#today">Back to Today</a><a class="btn" href="#path">Open the path</a></div>
  </section>`;
  local = {};
}

// Words from a finished drill, dialogue or story go to your vocab.
function saveWords(words, src) {
  const now = Date.now();
  let n = 0;
  for (const w of words) {
    const id = cardId('word', w.tr);
    if (store.card(id)) continue;
    store.putCard(srs.grade({ id, kind: 'word', tr: w.tr, en: w.en, src, added: now }, 3, now));
    n++;
  }
  return n;
}

const nextButtonHTML = () => {
  const nx = nextUp();
  return nx ? `<a class="btn primary" href="${nx.href}">${I.arrow}<span>Next: ${esc(nx.title)}</span></a>` : '';
};

/* ---------- speaking: check, record, compare ---------- */

let listeningBtn = null;
let recorder = null;

const MIC_ERRORS = {
  'not-allowed': 'Microphone access is blocked. Allow it for this site in the browser (the icon next to the address), then try again.',
  'service-not-allowed': 'Speech checking is turned off on this device. On a Mac or iPhone, turn on Dictation in Settings, then try again.',
  network: 'Speech checking needs an internet connection in this browser.',
  'language-not-supported': 'This browser cannot recognise Turkish. Try Chrome or Safari.',
  'audio-capture': 'No microphone was found.',
  unsupported: 'This browser cannot check speech. Chrome, Edge and Safari can. You can still say it out loud and compare by ear.',
};

function resultHTML(res) {
  const pct = Math.round(res.score * 100);
  const verdict = pct >= 95 ? 'Clear. A Turkish ear understood every word.' : pct >= 75 ? 'Close. Most of it came through.' : 'Not yet. Listen again, then say it slowly.';
  const tone = pct >= 95 ? 'ok' : pct >= 75 ? 'close' : 'miss';
  const hints = [];
  const seen = new Set();
  for (const w of res.words) for (const h of w.hints) {
    const k = h.expect + '>' + h.got;
    if (!seen.has(k) && h.tip) { seen.add(k); hints.push({ ...h, word: w.word }); }
  }
  return `<div class="verdict ${tone}"><span class="pct">${pct}%</span><span>${verdict}</span></div>
    <p class="chips">${res.words.map((w) => `<span class="chip ${w.status}" lang="tr">${esc(w.word)}</span>`).join(' ')}</p>
    ${res.heardText ? `<p class="heard">Heard: <span lang="tr">“${esc(res.heardText)}”</span></p>` : ''}
    ${hints.length ? `<ul class="hints">${hints.map((h) => `<li><b lang="tr">${esc(h.expect)}</b> in <span lang="tr">${esc(h.word)}</span> came out as <b lang="tr">${esc(h.got || 'nothing')}</b>. ${esc(h.tip)}</li>`).join('')}</ul>` : ''}`;
}

const globalActions = {
  play: async (el) => {
    el.classList.add('busy');
    await S.speak(fill(el.dataset.text), { slow: el.dataset.slow === '1' });
    el.classList.remove('busy');
  },
  back: () => history.back(),
  locked: (el) => {
    const m = me();
    if (el.dataset.rank) { toast(`Opens when you pass the ${m.rank.id} exam. The exam opens at level 30.`); return; }
    const L = +el.dataset.level;
    toast(`Opens at level ${L}. You're level ${m.level}, with ${xpToGo(L, m)} XP to go.`);
  },
  async check(el) {
    const panel = el.closest('.speak');
    const box = $('.result', panel);
    const label = $('span', el);
    if (listeningBtn) { S.stopListening(); return; }
    if (!S.canListen()) { box.innerHTML = `<p class="notice">${MIC_ERRORS.unsupported}</p>`; return; }
    S.stopSpeaking();
    listeningBtn = el;
    el.classList.add('live');
    label.textContent = 'Listening. Tap to stop';
    box.innerHTML = '<p class="interim">Speak now</p>';
    try {
      const alts = await S.listen({ onInterim: (t) => { const p = $('.interim', box); if (p) p.textContent = t; } });
      if (!alts.length) {
        box.innerHTML = '<p class="notice">Nothing came through. Tap Say it and speak a little louder.</p>';
      } else {
        const res = S.compare(fill(panel.dataset.target), alts, { skip: [settings().name] });
        box.innerHTML = resultHTML(res);
        store.log('spoken');
        award(XP.spoken + (res.score >= 0.9 ? XP.clear : 0));
        panel.dispatchEvent(new CustomEvent('checked', { detail: res, bubbles: true }));
      }
    } catch (err) {
      box.innerHTML = `<p class="notice">${esc(MIC_ERRORS[err.message] || 'Speech checking stopped: ' + err.message)}</p>`;
    } finally {
      listeningBtn = null;
      el.classList.remove('live');
      label.textContent = 'Say it';
    }
  },
  async rec(el) {
    const panel = el.closest('.speak');
    const label = $('span', el);
    if (recorder) {
      const r = recorder; recorder = null;
      const blob = await r.stop();
      el.classList.remove('live'); label.textContent = 'Record';
      await saveRecording(panel.dataset.key, blob);
      showMine(panel, blob);
      return;
    }
    if (!S.canRecord()) { $('.result', panel).innerHTML = `<p class="notice">${MIC_ERRORS.unsupported}</p>`; return; }
    try {
      S.stopSpeaking();
      recorder = await S.startRecording();
      el.classList.add('live'); label.textContent = 'Stop';
    } catch {
      $('.result', panel).innerHTML = `<p class="notice">${MIC_ERRORS['not-allowed']}</p>`;
    }
  },
  playmine: (el) => { const p = el.closest('.speak'); if (p._blob) S.playBlob(p._blob); },
  async compare(el) {
    const p = el.closest('.speak');
    if (!p._blob) return;
    await S.speak(fill(p.dataset.target));
    await new Promise((r) => setTimeout(r, 350));
    await S.playBlob(p._blob);
  },
};

let local = {};
view.addEventListener('click', (e) => {
  const a = e.target.closest('[data-act]');
  if (!a || !view.contains(a)) return;
  const fn = local[a.dataset.act] || globalActions[a.dataset.act];
  if (fn) { e.preventDefault(); fn(a, e); }
});

/* ---------- Today ---------- */

function todayView() {
  const s = settings();
  const m = me();
  const h = new Date().getHours();
  const greet = h < 11 ? 'Günaydın' : h < 18 ? 'Merhaba' : 'İyi akşamlar';
  const cards = store.cards();
  const due = cards.filter((c) => srs.isDue(c)).length;
  const next = nextUp(m);
  const nx = nextUnlock(m);
  const upcoming = cards.filter((c) => c.due && !srs.isDue(c)).sort((a, b) => a.due - b.due)[0];
  const streak = store.streak();
  const pool = LESSONS.filter((l) => isOpen(pathItem(l.id), m)).flatMap((l) => l.items).filter((it) => P.tokens(it.tr).length > 1);
  const dayNo = Math.floor(Date.now() / 864e5);
  const potd = pool[dayNo % pool.length];

  view.innerHTML = `
  <section class="hello">
    <p class="eyebrow">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    <h1 class="display" lang="tr">${greet}, ${esc(s.name)}.</h1>
    <p class="say muted-say">${sayHTML(greet)}</p>
  </section>

  ${S.canListen() ? '' : `<p class="notice">${MIC_ERRORS.unsupported}</p>`}

  ${levelCardHTML(m)}

  <div class="today-grid">
    <article class="panel">
      <p class="eyebrow">Review</p>
      ${due ? `<h2 class="big-num">${due}</h2><p class="muted">${due === 1 ? 'phrase is' : 'phrases and words are'} ready to practise. Reviewing right before you forget is what makes words stick.</p>
        <a class="btn primary" href="#review">${I.mic}<span>Start review</span></a>`
    : `<h2 class="big-num">0</h2><p class="muted">${upcoming ? `Nothing due. Next review in ${srs.fmt(upcoming.due - Date.now())}.` : 'Finish a lesson and its phrases start coming back here.'}</p>`}
    </article>
    <article class="panel">
      <p class="eyebrow">Up next${next ? ' · ' + KIND[next.kind] : ''}</p>
      ${next ? `<h2 class="lesson-title">${esc(next.title)}</h2><p class="muted">${esc(next.sub)}</p>
        <a class="btn ${due ? '' : 'primary'}" href="${next.href}">${I.arrow}<span>Start</span></a>`
    : `<h2 class="lesson-title">All caught up</h2><p class="muted">Everything open so far is done. Review, replay a dialogue, and ${nx ? `level ${nx.level} opens more` : 'keep practising'}.</p>
        <a class="btn" href="#path">Open the path</a>`}
    </article>
  </div>

  <dl class="stats">
    <div><dt>Day streak</dt><dd>${streak}</dd></div>
    <div><dt>Phrases</dt><dd>${cards.filter((c) => c.kind === 'phrase').length}</dd></div>
    <div><dt>Words</dt><dd>${cards.filter((c) => c.kind === 'word').length}</dd></div>
    <div><dt>Done</dt><dd>${PATH.filter((p) => isDone(p.id)).length}/${PATH.length}</dd></div>
  </dl>

  ${potd ? `<section class="potd">
    <p class="eyebrow">Phrase of the day</p>
    ${phraseHTML(potd.tr, { size: 'lg' })}
    <p class="en">${esc(fill(potd.en))}</p>
    ${audioHTML(potd.tr)}
  </section>` : ''}`;
  local = {};
}

/* ---------- Path ---------- */

const pathUI = { kind: 'all' };

function pathView() {
  const m = me();
  const next = nextUp(m);
  const shown = PATH.filter((p) => p.rank === 'A1' && (pathUI.kind === 'all' || p.kind === pathUI.kind));
  const groups = new Map();
  for (const p of shown) { if (!groups.has(p.level)) groups.set(p.level, []); groups.get(p.level).push(p); }
  const feats = pathUI.kind === 'all' ? FEATURES : [];
  for (const f of feats) if (!groups.has(f.level)) groups.set(f.level, []);
  const levels = [...groups.keys()].sort((a, b) => a - b);
  const here = Math.max(...levels.filter((L) => L <= m.level), levels[0]);
  const passedA1 = rankIndex(m.rank.id) > 0;

  const row = (p) => {
    const open = isOpen(p, m);
    const done = isDone(p.id);
    const isNext = next?.id === p.id;
    return `<li><a class="lrow${done ? ' done' : ''}${isNext ? ' next' : ''}${open ? '' : ' locked'}" href="${open ? p.href : '#path'}"${open ? '' : ` data-act="locked" data-level="${p.level}"`}>
      <span class="lstate">${done ? I.check : open ? '' : I.lock}</span>
      <span class="ltext"><b>${esc(p.title)}</b><small>${esc(p.sub)}</small></span>
      <span class="tag k-${p.kind}">${KIND[p.kind]}</span>
    </a></li>`;
  };
  const featRow = (f) => {
    const open = featureOpen(f.id, m);
    const href = f.id === 'mock' ? '#exam/mock' : f.id === 'exam' ? '#exam/A1' : '';
    const done = f.id === 'exam' && passedA1;
    const inner = `<span class="lstate">${done ? I.check : open ? I.star : I.lock}</span>
      <span class="ltext"><b>${esc(f.title)}</b><small>${esc(f.sub)}</small></span>
      <span class="tag ${href ? 'k-exam' : ''}">${href ? 'Exam' : 'Unlock'}</span>`;
    if (href && open) return `<li><a class="lrow feature${done ? ' done' : ''}" href="${href}">${inner}</a></li>`;
    return `<li><div class="lrow feature${open ? '' : ' locked'}"${open ? '' : ` data-act="locked" data-level="${f.level}" role="button" tabindex="0"`}>${inner}</div></li>`;
  };

  view.innerHTML = `
  <header class="page-head"><h1>Path</h1><p class="lede">Practice at your rank earns XP, and levels open the course step by step. By level 20 the whole A1 course is open. Level 30 is the top of A1: the A1 exam opens there, and passing it takes you to A2.</p></header>

  ${levelCardHTML(m)}

  <details class="howto levels-help"><summary>How levels work</summary>
    <p><b>XP.</b> A lesson or Build drill earns ${XP.lesson}, a dialogue ${XP.dialogue}, a story ${XP.story}, each review ${XP.review}, and each sentence you say out loud ${XP.spoken} (${XP.spoken + XP.clear} when it comes through clearly). Your first practice each day adds ${XP.daily}. Doing something again earns ${XP.again}.</p>
    <p><b>XP comes from your rank.</b> Only practice at your own rank counts. While you're A1, A1 phrases earn XP; once you're B1, it takes B1 phrases to earn the same XP. Older material stays open for practice, without XP.</p>
    <p><b>Levels.</b> Every level costs the same ${XP_PER_LEVEL} XP. About ${DAILY_GOAL} XP a day, 15 to 20 minutes, reaches level 20 in a month. Each rank has 30 levels: A1 is 1 to 30, A2 is 31 to 60, and so on. The last level of a rank is its cap. Reaching it means you've done that rank's work, and its exam opens.</p>
    <p><b>Ranks.</b> Ranks follow the European levels: A1, A2, B1, B2, C1, C2. In A1, levels open lessons, drills, dialogues and stories step by step. The A1 exam opens at level 30: 20 questions of listening, speaking and conversation. Score 80% to reach A2, which opens all A2 grammar, vocabulary, dialogues and stories at once. If you don't pass, it shows what to revise; try again the next day.</p>
    <p><b>Hunter ranks.</b> On top of the European levels you carry a rank from F to S. F is the tutorial: the three Sounds lessons, the first Build drill and the first dialogue. Finish them to reach E. Each European level has a plain rank and a + rank for its second half.</p>
    <ul class="ladder">${LADDER.map(([id, cefr, name]) => `<li class="${id === m.hunter.id ? 'on' : ''}">${badgeHTML({ id, letter: id[0], plus: id.endsWith('+') }, 'sm')}<b>${cefr || 'Tutorial'}</b><span>${esc(name)}</span></li>`).join('')}</ul>
    <p><b>What A1 means.</b> You can introduce yourself, ask and answer simple questions, and get through everyday moments like a meal, a café or a phone call, if people speak slowly.</p>
  </details>

  <div class="filters" role="tablist">${[['all', 'All'], ['lesson', 'Lessons'], ['drill', 'Build'], ['dialogue', 'Talk'], ['story', 'Stories']].map(([k, t]) => `<button class="filter${pathUI.kind === k ? ' on' : ''}" data-act="pfilter" data-k="${k}" role="tab" aria-selected="${pathUI.kind === k}">${t}</button>`).join('')}</div>

  <h2 class="rank-title"><span class="rank-badge small">A1</span>Beginner <span lang="tr" class="muted">Başlangıç</span><span class="ranks-note">Ranks F, E, E+</span></h2>
  ${levels.map((L) => {
    const items = groups.get(L);
    const fs = feats.filter((f) => f.level === L);
    if (!items.length && !fs.length) return '';
    return `<section class="lvl-group${L <= m.level ? ' reached' : ''}" id="lv-${L}">
      <header class="lvl-head"><span class="lvl-n">Level ${L}</span>${L === here ? '<span class="tag on">You are here</span>' : ''}</header>
      <ol class="lessons">${items.map(row).join('')}${fs.map(featRow).join('')}</ol>
    </section>`;
  }).join('')}

  <h2 class="rank-title${passedA1 ? '' : ' locked'}"><span class="rank-badge small">A2</span>Elementary <span lang="tr" class="muted">Temel</span><span class="ranks-note">Ranks D, D+</span></h2>
  <p class="muted small">${passedA1 ? 'Open. These arrive in app updates as they are written.' : 'Pass the A1 exam to open all of this at once.'}</p>
  <ol class="lessons">${NEXT_RANK.A2.filter((p) => pathUI.kind === 'all' || p.kind === pathUI.kind).map((p) => `<li><div class="lrow locked"${passedA1 ? '' : ' data-act="locked" data-rank="A2" role="button" tabindex="0"'}>
    <span class="lstate">${passedA1 ? '' : I.lock}</span><span class="ltext"><b>${esc(p.title)}</b><small>${esc(p.sub)}</small></span><span class="tag k-${p.kind}">${passedA1 ? 'Soon' : KIND[p.kind]}</span>
  </div></li>`).join('')}</ol>`;

  local = { pfilter: (el) => { pathUI.kind = el.dataset.k; pathView(); } };
}

/* ---------- Sessions: lessons and reviews ---------- */

let session = null;
const GRADE = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };

function lessonView(id) {
  const l = lessonById(id);
  if (!l) { location.hash = '#path'; return; }
  if (!isOpen(pathItem(id), me())) { lockedView(pathItem(id)); return; }
  xpFrom = pathItem(id).rank;
  if (!session || session.id !== 'L:' + id || session.finished) {
    const steps = [
      ...l.items.map((it, i) => ({ type: 'learn', it, n: i + 1 })),
      ...shuffle(l.items).map((it) => ({ type: 'blind', it })),
      ...shuffle(l.items).map((it) => ({ type: 'recall', it })),
    ];
    session = { id: 'L:' + id, kind: 'lesson', lesson: l, steps, i: 0, grades: {}, requeued: new Set() };
  }
  drawStep();
}

function reviewView() {
  if (!session || session.id !== 'R' || session.finished) {
    const due = store.cards().filter((c) => srs.isDue(c)).sort((a, b) => a.due - b.due).slice(0, 40);
    session = { id: 'R', kind: 'review', steps: shuffle(due).map((c) => ({ type: 'recall', it: { tr: c.tr, en: c.en, words: [], cardId: c.id } })), i: 0, grades: {}, requeued: new Set(), count: 0 };
  }
  if (!session.steps.length) {
    view.innerHTML = `<section class="done"><h1>Nothing to review</h1><p class="lede">Everything you know is fresh. Come back later, or start the next lesson.</p><a class="btn primary" href="#today">Back to Today</a></section>`;
    local = {};
    return;
  }
  drawStep();
}

function drillView(id) {
  const d = drillById(id);
  if (!d) { location.hash = '#path'; return; }
  if (!isOpen(pathItem(id), me())) { lockedView(pathItem(id)); return; }
  xpFrom = pathItem(id).rank;
  if (!session || session.id !== 'D:' + id || session.finished) {
    session = { id: 'D:' + id, kind: 'drill', drill: d, steps: [{ type: 'intro' }, ...d.items.map((it, i) => ({ type: 'build', it, n: i + 1 }))], i: 0, grades: {}, requeued: new Set(), ok: 0 };
  }
  drawStep();
}

function cardFor(it) {
  if (it.cardId) return store.card(it.cardId) || { id: it.cardId };
  const tr = fill(it.tr);
  const id = cardId(kindOf(tr), tr);
  return store.card(id) || { id, kind: kindOf(tr), tr, en: fill(it.en) };
}

function drawStep() {
  const s = session;
  const step = s.steps[s.i];
  const total = s.steps.length;
  const it = step.it;
  let body = '';
  s.revealed = false;
  if (s.kind === 'review') xpFrom = cardRank(store.card(it.cardId));

  if (step.type === 'learn') {
    body = `<p class="eyebrow">New · ${step.n} of ${s.lesson.items.length}</p>
      ${phraseHTML(it.tr)}
      <p class="en">${esc(fill(it.en))}</p>
      ${audioHTML(it.tr)}
      ${it.note ? `<p class="note">${esc(fill(it.note))}</p>` : ''}
      ${breakdownHTML(it)}
      <p class="eyebrow step-label">Echo it</p>
      ${speakHTML(it.tr)}
      <div class="next"><button class="btn primary" data-act="next">Next ${I.arrow}</button></div>`;
  } else if (step.type === 'blind') {
    body = `<p class="eyebrow">Listen · no text</p>
      <h2 class="prompt">What does it mean?</h2>
      <div class="audio big">
        <button class="btn primary" data-act="play" data-text="${esc(it.tr)}">${I.play}<span>Listen again</span></button>
        <button class="btn ghost" data-act="play" data-slow="1" data-text="${esc(it.tr)}"><span>Slow</span></button>
      </div>
      <div class="answer" hidden>${phraseHTML(it.tr, { size: 'lg' })}<p class="en">${esc(fill(it.en))}</p></div>
      <div class="next"><button class="btn primary" data-act="reveal">Show</button></div>`;
  } else if (step.type === 'intro') {
    const d = s.drill;
    body = `<p class="eyebrow">Build · ${esc(d.goal)}</p>
      <h1 class="prompt">${esc(d.title)}</h1>
      ${d.intro.map((t) => `<p class="lede">${esc(t)}</p>`).join('')}
      <table class="pattern"><tbody>${d.table.map(([tr, en]) => `<tr><td><button class="linkbtn" data-act="play" data-text="${esc(tr)}" lang="tr">${esc(tr)}</button></td><td>${esc(en)}</td></tr>`).join('')}</tbody></table>
      <p class="muted small">Next: ${d.items.length} sentences. Read the English, say it in Turkish out loud, then check. Each one changes a single piece from the one before.</p>
      <div class="next"><button class="btn primary" data-act="next">Start building ${I.arrow}</button></div>`;
  } else if (step.type === 'build') {
    const prev = s.steps[s.i - 1]?.type === 'build' ? s.steps[s.i - 1].it : null;
    body = `<p class="eyebrow">Build · ${step.n ? `${step.n} of ${s.drill.items.length}` : 'one more time'}</p>
      ${prev ? `<p class="last">Before: <span lang="tr">${esc(fill(prev.tr))}</span></p>` : ''}
      <h2 class="prompt">${esc(fill(it.en))}</h2>
      ${it.words.length ? `<p class="hint">${it.words.map((w) => `<span lang="tr">${esc(w.tr)}</span> ${esc(w.en)}`).join(' · ')}</p>` : ''}
      ${speakHTML(it.tr)}
      <div class="answer" hidden>${phraseHTML(it.tr, { size: 'lg' })}${audioHTML(it.tr)}${it.note ? `<p class="note">${esc(it.note)}</p>` : ''}</div>
      <div class="next"><button class="btn" data-act="reveal">Show answer</button></div>`;
  } else {
    const card = cardFor(it);
    body = `<p class="eyebrow">${s.kind === 'review' ? 'Review' : 'From memory'} · say it in Turkish</p>
      <h2 class="prompt">${esc(fill(it.en))}</h2>
      ${speakHTML(it.tr)}
      <div class="answer" hidden>${phraseHTML(it.tr, { size: 'lg' })}${audioHTML(it.tr)}</div>
      <div class="next" data-card="${esc(card.id)}"><button class="btn" data-act="reveal">Show answer</button></div>`;
  }

  view.innerHTML = `<div class="session">
    <div class="sbar">
      <a class="iconlink" href="${s.kind === 'review' ? '#today' : '#path'}" aria-label="Close">${I.x}</a>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${s.i}"><span style="width:${(s.i / total) * 100}%"></span></div>
      <span class="count">${s.i + 1}/${total}</span>
    </div>
    <div class="stage">${body}</div>
  </div>`;
  hydrateRecordings();

  local = {
    next: () => advance(),
    reveal: () => reveal(),
    blind: (el) => {
      if (el.dataset.ok === '0' && !s.requeued.has('b' + it.tr)) { s.requeued.add('b' + it.tr); s.steps.push({ type: 'blind', it }); }
      advance();
    },
    grade: (el) => gradeStep(+el.dataset.g),
    built: (el) => {
      if (el.dataset.ok === '0') {
        if (!s.requeued.has('d' + it.tr)) { s.requeued.add('d' + it.tr); s.steps.push({ type: 'build', it }); }
      } else if (step.n) s.ok++;
      advance();
    },
  };

  $('.speak', view)?.addEventListener('checked', (e) => {
    if (step.type === 'recall') reveal(S.suggestGrade(e.detail.score));
    if (step.type === 'build') reveal(e.detail.score >= 0.75 ? 'ok' : 'miss');
  });

  if (step.type === 'learn' || step.type === 'blind') S.speak(fill(it.tr));
}

function reveal(suggest) {
  const s = session;
  const step = s.steps[s.i];
  if (s.revealed && !suggest) return;
  s.revealed = true;
  const ans = $('.answer', view);
  if (ans) ans.hidden = false;
  const next = $('.next', view);
  if (step.type === 'blind') {
    next.innerHTML = `<button class="btn" data-act="blind" data-ok="0">Didn't get it</button><button class="btn primary" data-act="blind" data-ok="1">Got it</button>`;
    S.speak(fill(step.it.tr));
  } else if (step.type === 'build') {
    next.innerHTML = `<button class="btn${suggest === 'miss' ? ' primary' : ''}" data-act="built" data-ok="0">Missed it</button><button class="btn${suggest === 'miss' ? '' : ' primary'}" data-act="built" data-ok="1">Got it</button>`;
    S.speak(fill(step.it.tr));
  } else {
    const card = cardFor(step.it);
    const pv = srs.preview(card);
    next.innerHTML = `<div class="grades" role="group" aria-label="How well did you know it?">${[1, 2, 3, 4].map((g) => `
      <button class="grade g${g}${suggest === g ? ' sug' : ''}" data-act="grade" data-g="${g}"><span>${GRADE[g]}</span><small>${pv[g - 1]}</small></button>`).join('')}</div>
      <p class="grade-help">${suggest ? 'Suggested from what the microphone heard. Change it if you disagree.' : 'Be honest: the schedule adapts to it.'}</p>`;
    if (!suggest) S.speak(fill(step.it.tr));
  }
}

function gradeStep(g) {
  const s = session;
  const it = s.steps[s.i].it;
  if (s.kind === 'review') {
    const card = store.card(it.cardId);
    if (card) store.putCard(srs.grade(card, g));
    store.log('reviews');
    award(XP.review, cardRank(card));
    s.count++;
  } else {
    s.grades[it.tr] = g;
  }
  if (g === 1 && !s.requeued.has('r' + it.tr)) { s.requeued.add('r' + it.tr); s.steps.push({ type: 'recall', it }); }
  advance();
}

function advance() {
  S.stopListening();
  S.stopSpeaking();
  session.i++;
  if (session.i >= session.steps.length) finish();
  else { drawStep(); view.focus({ preventScroll: true }); window.scrollTo(0, 0); }
}

function finish() {
  const s = session;
  s.finished = true;
  local = {};
  if (s.kind === 'review') {
    view.innerHTML = `<section class="done"><p class="eyebrow">Review done</p><h1 lang="tr">Aferin!</h1><p class="say muted-say">${sayHTML('Aferin')}</p>
      <p class="lede">Well done. You practised ${plural(s.count, 'card', 'cards')}. Each one comes back right before you would forget it.</p>
      <div class="row"><a class="btn primary" href="#today">Back to Today</a></div></section>`;
    return;
  }
  if (s.kind === 'drill') {
    const d = s.drill;
    const first = !isDone(d.id);
    const words = saveWords(d.items.flatMap((it) => it.words), d.id);
    store.markLesson(d.id);
    store.log('lessons');
    award(first ? XP.drill : XP.again);
    view.innerHTML = `<section class="done"><p class="eyebrow">Build done</p><h1 lang="tr">Aferin!</h1><p class="say muted-say">${sayHTML('Aferin')}</p>
      <p class="lede">You built ${plural(s.ok, 'sentence', 'sentences')} out of ${d.items.length} on the first try.${words ? ` Saved ${plural(words, 'new word', 'new words')} to your vocab.` : ''} Do it again any time: speed comes from repetition.</p>
      <div class="row">${nextButtonHTML()}<a class="btn" href="#path">Back to path</a></div></section>`;
    return;
  }
  const l = s.lesson;
  const first = !isDone(l.id);
  const now = Date.now();
  let phrases = 0, words = 0;
  for (const it of l.items) {
    const tr = fill(it.tr);
    const kind = kindOf(tr);
    const id = cardId(kind, tr);
    if (!store.card(id)?.s) {
      store.putCard(srs.grade({ ...(store.card(id) || {}), id, kind, tr, en: fill(it.en), src: l.id, added: now }, s.grades[it.tr] ?? 3, now));
      kind === 'phrase' ? phrases++ : words++;
    }
    for (const w of it.words) {
      const wid = cardId('word', w.tr);
      if (store.card(wid)) continue;
      store.putCard(srs.grade({ id: wid, kind: 'word', tr: w.tr, en: w.en, src: l.id, added: now }, 3, now));
      words++;
    }
  }
  store.markLesson(l.id);
  store.log('lessons');
  award(first ? XP.lesson : XP.again);
  view.innerHTML = `<section class="done"><p class="eyebrow">Lesson done</p><h1 lang="tr">Aferin!</h1><p class="say muted-say">${sayHTML('Aferin')}</p>
    <p class="lede">Well done. ${phrases || words ? `Saved ${plural(phrases, 'phrase', 'phrases')} and ${plural(words, 'word', 'words')} to your vocab.` : 'Everything here was already in your vocab.'} They come back for review in a few days.</p>
    <div class="row">${nextButtonHTML()}<a class="btn" href="#path">Back to path</a></div></section>`;
}

/* ---------- Talk: dialogues ---------- */

let talk = null;
let playToken = 0; // bumped to stop a scene or story that is playing
const listenUI = { english: false, fast: false, text: false };
const fastOn = () => listenUI.fast && featureOpen('fast', me());

const fastSwitchHTML = () => (featureOpen('fast', me())
  ? `<label class="switch"><input id="fast" type="checkbox" ${listenUI.fast ? 'checked' : ''}><span>Native speed</span></label>` : '');
const bindFast = () => $('#fast')?.addEventListener('change', (e) => { listenUI.fast = e.target.checked; });

function bubbleHTML(line, i, { showEn = listenUI.english } = {}) {
  return `<li class="bubble${line.who === 'you' ? ' mine' : ''}" data-i="${i}">
    <span class="who">${esc(WHO[line.who])}</span>
    <button class="btext" data-act="playline" data-i="${i}">
      <span class="btr" lang="tr">${esc(fill(line.tr))}</span>
      <span class="ben"${showEn ? '' : ' hidden'}>${esc(fill(line.en))}</span>
    </button>
  </li>`;
}

function talkView(id) {
  const d = dialogueById(id);
  if (!d) { location.hash = '#path'; return; }
  if (!isOpen(pathItem(id), me())) { lockedView(pathItem(id)); return; }
  xpFrom = d.rank;
  talk = { d, mode: 'intro', i: 0, scores: {}, listened: false };
  drawTalkIntro();
}

function drawTalkIntro() {
  playToken++;
  S.stopSpeaking();
  const { d } = talk;
  const m = me();
  const cast = [...new Set(d.lines.map((l) => l.who))].map((w) => WHO[w]).join(', ');
  const mine = d.lines.filter((l) => l.who === 'you').length;
  view.innerHTML = `
  <div class="sbar"><a class="iconlink" href="#path" aria-label="Close">${I.x}</a><span class="eyebrow">Talk${isDone(d.id) ? ' · done' : ''}</span></div>
  <header class="page-head"><h1>${esc(d.title)}</h1><p class="lede">${esc(d.scene)}</p>
    <p class="muted small">${esc(cast)} · ${d.lines.length} lines, ${mine} of them yours</p></header>
  <div class="modes">
    <button class="mode" data-act="talkmode" data-m="listen">${I.ear}<b>Listen</b><small>Hear the whole scene with the text. Tap a line to hear it again.</small></button>
    <button class="mode main" data-act="talkmode" data-m="play">${I.mic}<b>Play your part</b><small>They speak, you answer out loud. Your line is cued in English.</small></button>
    ${featureOpen('nohints', m)
    ? `<button class="mode" data-act="talkmode" data-m="nohints">${I.mic}<b>No hints</b><small>Answer from the situation alone. The English cue stays hidden until you ask.</small></button>`
    : `<div class="mode locked" data-act="locked" data-level="15" role="button" tabindex="0">${I.lock}<b>No hints</b><small>Opens at level 15</small></div>`}
  </div>
  ${fastSwitchHTML()}`;
  bindFast();
  local = { talkmode: (el) => startTalk(el.dataset.m) };
}

function talkActions() {
  return {
    talkmode: (el) => startTalk(el.dataset.m),
    talkexit: () => drawTalkIntro(),
    playline: (el) => { playToken++; S.speak(fill(talk.d.lines[+el.dataset.i].tr), { fast: fastOn() }); },
    toggleen: (el) => {
      listenUI.english = !listenUI.english;
      $$('.chat .ben', view).forEach((b) => { b.hidden = !listenUI.english; });
      el.textContent = listenUI.english ? 'Hide English' : 'Show English';
    },
    replay: () => playScene(),
    hint: (el) => { el.hidden = true; $('.hintline', view).hidden = false; },
    talkreveal: () => talkAnswered(0),
    talknext: () => { $('#turn').innerHTML = ''; talk.i++; talkStep(); },
  };
}

async function playScene() {
  const token = ++playToken;
  S.stopSpeaking();
  const items = $$('.chat .bubble', view);
  for (let i = 0; i < talk.d.lines.length; i++) {
    if (token !== playToken) return;
    items.forEach((b, j) => b.classList.toggle('now', j === i));
    items[i]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    await S.speak(fill(talk.d.lines[i].tr), { fast: fastOn() });
    await wait(250);
  }
  if (token !== playToken) return;
  items.forEach((b) => b.classList.remove('now'));
  if (!talk.listened) { talk.listened = true; award(XP.listen); }
}

function startTalk(mode) {
  playToken++;
  S.stopSpeaking();
  talk.mode = mode;
  window.scrollTo(0, 0);
  if (mode === 'listen') {
    view.innerHTML = `
    <div class="sbar"><button class="iconlink" data-act="talkexit" aria-label="Back">${I.back}</button><span class="eyebrow">Listen · ${esc(talk.d.title)}</span></div>
    <ol class="chat">${talk.d.lines.map((l, i) => bubbleHTML(l, i)).join('')}</ol>
    <div class="row">
      <button class="btn" data-act="replay">${I.play}<span>Play again</span></button>
      <button class="btn" data-act="toggleen">${listenUI.english ? 'Hide English' : 'Show English'}</button>
      <button class="btn primary" data-act="talkmode" data-m="play">${I.mic}<span>Play your part</span></button>
    </div>`;
    local = talkActions();
    playScene();
    return;
  }
  talk.i = 0;
  talk.scores = {};
  view.innerHTML = `
  <div class="sbar">
    <button class="iconlink" data-act="talkexit" aria-label="Back">${I.back}</button>
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${talk.d.lines.length}"><span style="width:0%"></span></div>
    <span class="count"></span>
  </div>
  <ol class="chat" id="chat"></ol>
  <div id="turn"></div>`;
  local = talkActions();
  talkStep();
}

function talkBar() {
  const n = talk.d.lines.length;
  const bar = $('.sbar .progress span', view);
  if (bar) bar.style.width = `${(Math.min(talk.i, n) / n) * 100}%`;
  const c = $('.sbar .count', view);
  if (c) c.textContent = `${Math.min(talk.i + 1, n)}/${n}`;
}

function addBubble(i) {
  const chat = $('#chat');
  if (!chat || chat.querySelector(`[data-i="${i}"]`)) return;
  chat.insertAdjacentHTML('beforeend', bubbleHTML(talk.d.lines[i], i, { showEn: false }));
  chat.lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

async function talkStep() {
  const { d } = talk;
  const token = playToken;
  talkBar();
  while (talk.i < d.lines.length && d.lines[talk.i].who !== 'you') {
    addBubble(talk.i);
    await S.speak(fill(d.lines[talk.i].tr), { fast: fastOn() });
    if (token !== playToken) return;
    await wait(300);
    if (token !== playToken) return;
    talk.i++;
    talkBar();
  }
  if (talk.i >= d.lines.length) { talkDone(); return; }
  const line = d.lines[talk.i];
  const hints = talk.mode !== 'nohints';
  $('#turn').innerHTML = `<div class="turn">
    <p class="eyebrow">Your turn</p>
    ${hints ? `<h2 class="prompt">${esc(fill(line.en))}</h2>`
    : `<h2 class="prompt">What do you say?</h2><button class="btn ghost small" data-act="hint">Show the English</button><p class="hintline en" hidden>${esc(fill(line.en))}</p>`}
    ${speakHTML(line.tr)}
    <div class="next"><button class="btn ghost" data-act="talkreveal">Show my line</button></div>
  </div>`;
  hydrateRecordings($('#turn'));
  $('#turn .speak').addEventListener('checked', (e) => talkAnswered(e.detail.score));
  $('#turn').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function talkAnswered(score) {
  const first = !(talk.i in talk.scores);
  talk.scores[talk.i] = Math.max(talk.scores[talk.i] ?? 0, score || 0);
  if (!first) return;
  addBubble(talk.i);
  S.speak(fill(talk.d.lines[talk.i].tr), { fast: fastOn() });
  $('#turn .next').innerHTML = `<button class="btn primary" data-act="talknext">Continue ${I.arrow}</button>`;
}

function talkDone() {
  const { d } = talk;
  talkBar();
  const mine = d.lines.map((l, i) => [l, i]).filter(([l]) => l.who === 'you');
  const clear = mine.filter(([, i]) => (talk.scores[i] || 0) >= 0.75).length;
  const first = !isDone(d.id);
  const now = Date.now();
  let saved = 0;
  for (const [l, i] of mine) {
    const tr = fill(l.tr);
    const kind = kindOf(tr);
    const id = cardId(kind, tr);
    if (store.card(id)) continue;
    store.putCard(srs.grade({ id, kind, tr, en: fill(l.en), src: d.id, added: now }, (talk.scores[i] || 0) >= 0.75 ? 3 : 2, now));
    saved++;
  }
  saveWords(d.lines.flatMap((l) => l.words), d.id);
  store.markLesson(d.id);
  store.log('lessons');
  award(first ? XP.dialogue : XP.again);
  $('#turn').innerHTML = `<section class="done">
    <p class="eyebrow">Scene done</p><h1 lang="tr">Aferin!</h1>
    <p class="lede">${S.canListen() ? `${clear} of ${mine.length} of your lines came through clearly. ` : ''}${saved ? `Saved ${plural(saved, 'line', 'lines')} you said to your vocab, so they come back in review.` : 'Your lines are already in your vocab.'}</p>
    <div class="row"><button class="btn" data-act="talkmode" data-m="${talk.mode}">Play it again</button>${nextButtonHTML()}<a class="btn" href="#path">Back to path</a></div>
  </section>`;
}

/* ---------- Stories ---------- */

// Words you've met: your vocab plus everything in the lessons, drills, dialogues and stories you've finished.
function metWords() {
  const known = new Set();
  const add = (t) => P.tokens(fill(t)).forEach((w) => known.add(P.clean(w)));
  const addAll = (lines) => lines.forEach((l) => { add(l.tr); (l.words || []).forEach((w) => add(w.tr)); });
  for (const c of store.cards()) add(c.tr);
  for (const l of LESSONS) if (isDone(l.id)) addAll(l.items);
  for (const d of DRILLS) if (isDone(d.id)) addAll(d.items);
  for (const d of DIALOGUES) if (isDone(d.id)) addAll(d.lines);
  for (const st of STORIES) if (isDone(st.id)) addAll(st.lines);
  return known;
}

// Turkish stacks endings on a root, so a word counts as known when you know its root:
// "telefon" covers "telefonumu", "gel" covers "gelelim".
function knowsWord(known, w) {
  if (known.has(w)) return true;
  for (const k of known) {
    if (k.length >= 3 && w.startsWith(k)) return true;
    const m = Math.min(k.length, w.length);
    if (m < 4) continue;
    let i = 0;
    while (i < m && k[i] === w[i]) i++;
    if (i >= Math.min(5, m)) return true;
  }
  return false;
}

function storyWords(st, known = metWords()) {
  const name = P.clean(settings().name);
  const words = [...new Set(st.lines.flatMap((l) => P.tokens(fill(l.tr)).map(P.clean)))].filter((w) => w && w !== name);
  const pct = words.length ? Math.round((words.filter((w) => knowsWord(known, w)).length / words.length) * 100) : 100;
  const seen = new Set();
  const fresh = st.lines.flatMap((l) => l.words).filter((w) => {
    const k = P.clean(w.tr);
    if (seen.has(k)) return false;
    seen.add(k);
    return !P.tokens(w.tr).every((t) => knowsWord(known, P.clean(t)));
  });
  return { pct, fresh };
}

// Each word becomes a button: tap it to hear it and see what it means.
function tapWordsHTML(text) {
  return fill(text).split(/(\s+)/).map((chunk) => {
    const m = chunk.match(/^([^\p{L}]*)([\p{L}’']+?)([^\p{L}]*)$/u);
    if (!m) return esc(chunk);
    return `${esc(m[1])}<button class="w" data-act="gloss" data-w="${esc(m[2])}">${esc(m[2])}</button>${esc(m[3])}`;
  }).join('');
}

function storyView(id) {
  const st = storyById(id);
  if (!st) { location.hash = '#path'; return; }
  if (!isOpen(pathItem(id), me())) { lockedView(pathItem(id)); return; }
  xpFrom = st.rank;
  const answers = {};
  const { pct, fresh } = storyWords(st);
  view.innerHTML = `
  <div class="sbar"><a class="iconlink" href="#path" aria-label="Close">${I.x}</a><span class="eyebrow">Story${isDone(st.id) ? ' · done' : ''}</span></div>
  <header class="page-head"><h1 lang="tr">${esc(st.title)}</h1><p class="lede">${esc(st.en)}</p>
    <p class="muted small">You know ${pct}% of the words in this story${fresh.length ? '. The rest are below' : ''}.</p></header>
  ${fresh.length ? `<section class="block"><h3>New in this story</h3>
    <div class="newwords">${fresh.map((w) => `<button class="newword" data-act="play" data-text="${esc(w.tr)}"><b lang="tr">${esc(w.tr)}</b><span>${esc(w.en)}</span></button>`).join('')}</div>
  </section>` : ''}
  <p class="note">${fresh.length ? 'Tap each new word to hear it. Then listen' : 'Listen'} without the text and follow what you can, and answer the questions. Show the text, or tap a word, only when you need to.</p>
  <div class="row">
    <button class="btn primary" data-act="storyplay">${I.play}<span>Play the story</span></button>
    <button class="btn" data-act="storytext">${listenUI.text ? 'Hide text' : 'Show text'}</button>
  </div>
  ${fastSwitchHTML()}
  <ol class="story${listenUI.text ? '' : ' notext'}">${st.lines.map((l, i) => `<li class="sline" data-i="${i}">
    <button class="play-mini" data-act="storyline" data-i="${i}" aria-label="Play line ${i + 1}">${I.play}</button>
    <div class="sbody"><p class="str" lang="tr">${tapWordsHTML(l.tr)}</p><p class="sen" hidden>${esc(fill(l.en))}</p></div>
    <button class="en-btn" data-act="storyen" data-i="${i}" aria-label="Show the English">EN</button>
  </li>`).join('')}</ol>
  <section class="block"><h3>Questions</h3>
    ${st.questions.map((q, qi) => `<div class="mcq"><p><b>${qi + 1}.</b> ${esc(fill(q.q))}</p>
      <div class="opts">${q.options.map((o, oi) => `<button class="opt" data-act="answer" data-q="${qi}" data-o="${oi}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
  </section>
  <div id="story-end"></div>`;
  bindFast();

  const playFrom = async (start, only = false) => {
    const token = ++playToken;
    S.stopSpeaking();
    const rows = $$('.sline', view);
    for (let i = start; i < (only ? start + 1 : st.lines.length); i++) {
      if (token !== playToken) return;
      rows.forEach((r, j) => r.classList.toggle('now', j === i));
      if (!only) rows[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      await S.speak(fill(st.lines[i].tr), { fast: fastOn() });
      await wait(only ? 0 : 350);
    }
    if (token === playToken) rows.forEach((r) => r.classList.remove('now'));
  };

  local = {
    storyplay: () => playFrom(0),
    storyline: (el) => playFrom(+el.dataset.i, true),
    storytext: (el) => {
      listenUI.text = !listenUI.text;
      $('.story', view).classList.toggle('notext', !listenUI.text);
      el.textContent = listenUI.text ? 'Hide text' : 'Show text';
    },
    storyen: (el) => { const p = $('.sen', el.closest('.sline')); p.hidden = !p.hidden; },
    gloss: (el) => {
      const w = el.dataset.w;
      const gl = glossMap();
      const extra = st.lines.flatMap((l) => l.words).find((x) => P.clean(x.tr) === P.clean(w));
      const mean = gl.get(P.clean(w)) || extra?.en;
      playToken++;
      S.speak(w);
      toast(mean ? `${w}: ${mean}` : `${w}: not in your vocab yet. Show the English for the whole line.`);
    },
    answer: (el) => {
      const qi = +el.dataset.q;
      if (qi in answers) return;
      answers[qi] = +el.dataset.o;
      const q = st.questions[qi];
      $$('.opt', el.closest('.mcq')).forEach((b, j) => {
        b.disabled = true;
        if (j === q.a) b.classList.add('right');
        else if (j === answers[qi]) b.classList.add('wrong');
      });
      if (Object.keys(answers).length < st.questions.length) return;
      const right = st.questions.filter((qq, i) => answers[i] === qq.a).length;
      const first = !isDone(st.id);
      saveWords(st.lines.flatMap((l) => l.words), st.id);
      store.markLesson(st.id);
      store.log('lessons');
      award((first ? XP.story : XP.again) + right * XP.answer);
      $('#story-end').innerHTML = `<section class="done">
        <p class="eyebrow">Story done</p><h1 lang="tr">${right === st.questions.length ? 'Harika!' : 'Aferin!'}</h1>
        <p class="lede">${right} of ${st.questions.length} right. ${right < st.questions.length ? 'Show the text and listen once more: the answers are all in there.' : 'You followed the whole story by ear.'}</p>
        <div class="row">${nextButtonHTML()}<a class="btn" href="#path">Back to path</a></div>
      </section>`;
    },
  };
}

/* ---------- Exams ---------- */

let exam = null;
const PASS = 0.8;

function examView(kind) {
  const m = me();
  const mock = kind === 'mock';
  if (!mock && kind !== 'A1') { location.hash = '#path'; return; }
  const passed = !!store.state.progress['rank:A2'];
  const open = mock ? featureOpen('mock', m) : (m.level >= 30 || passed);
  if (!open) { lockedView({ kind: 'exam', rank: 'A1', title: mock ? 'Practice exam' : 'A1 exam', level: mock ? 20 : 30 }); return; }
  const failedToday = !mock && !passed && store.state.stats.days[dayKey()]?.examFail;
  view.innerHTML = `
  <div class="sbar"><a class="iconlink" href="#path" aria-label="Close">${I.x}</a><span class="eyebrow">${mock ? 'Practice exam' : 'Rank exam'}</span></div>
  <header class="page-head"><h1>${mock ? 'A1 practice exam' : 'A1 exam'}</h1>
    <p class="lede">${mock ? 'The same format as the real exam. Take it as often as you like.' : passed ? `You passed on ${new Date(store.state.progress['rank:A2'].at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}. Take it again any time for practice.` : 'Pass it to become A2. Everything in A2 opens at once: grammar, vocabulary, dialogues and stories.'}</p></header>
  <ol class="exam-parts">
    <li><b>Listening</b><span>6 questions. Hear a sentence, choose what it means.</span></li>
    <li><b>Speaking</b><span>8 questions. Read the English, say it in Turkish.</span></li>
    <li><b>Conversation</b><span>6 questions. Hear a line, choose the right answer.</span></li>
  </ol>
  <p class="muted small">Pass mark: ${Math.round(20 * PASS)} of 20. ${mock ? '' : 'If you don\'t pass, you can try again tomorrow.'}${S.canListen() ? '' : ' This browser can\'t check speech, so in the speaking part you mark yourself.'}</p>
  ${failedToday ? '<p class="notice">Not this time. The exam opens again tomorrow: until then, the practice exam and your reviews are the best preparation.</p>'
    : `<div class="row"><button class="btn primary" data-act="exstart">${I.arrow}<span>Start</span></button></div>`}`;
  xpFrom = 'A1';
  local = { exstart: () => { exam = buildExam(mock); drawExamQ(); } };
}

function buildExam(mock) {
  const seen = new Set();
  const pool = shuffle([...LESSONS.flatMap((l) => l.items), ...DRILLS.flatMap((d) => d.items)]
    .filter((it) => P.tokens(it.tr).length > 1 && !it.tr.includes('{') && !seen.has(it.tr) && seen.add(it.tr)));
  const others = (en) => shuffle(pool.filter((o) => o.en !== en)).slice(0, 3).map((o) => o.en);
  const listen = pool.slice(0, 6).map((it) => ({ type: 'listen', it, options: shuffle([it.en, ...others(it.en)]), answer: it.en }));
  const speak = pool.slice(6, 14).map((it) => ({ type: 'speak', it }));
  const yours = DIALOGUES.flatMap((d) => d.lines.filter((l) => l.who === 'you' && !l.tr.includes('{')));
  const turns = DIALOGUES.flatMap((d) => d.lines.slice(0, -1).map((l, i) => [l, d.lines[i + 1]])).filter(([a, b]) => a.who !== 'you' && b.who === 'you' && !a.tr.includes('{'));
  const convo = shuffle(turns).slice(0, 6).map(([cue, reply]) => ({
    type: 'convo', cue, answer: reply.tr, options: shuffle([reply.tr, ...shuffle(yours.filter((l) => l.tr !== reply.tr)).slice(0, 2).map((l) => l.tr)]),
  }));
  return { mock, qs: [...listen, ...speak, ...convo], i: 0, right: 0 };
}

function drawExamQ() {
  const e = exam;
  const q = e.qs[e.i];
  const n = e.qs.length;
  q.done = false;
  let body = '';
  if (q.type === 'listen') {
    body = `<p class="eyebrow">Listening · ${e.i + 1} of ${n}</p>
      <h2 class="prompt">What does it mean?</h2>
      <div class="audio big"><button class="btn primary" data-act="play" data-text="${esc(q.it.tr)}">${I.play}<span>Listen again</span></button></div>
      <div class="opts col">${q.options.map((o, oi) => `<button class="opt" data-act="exans" data-o="${oi}">${esc(fill(o))}</button>`).join('')}</div>`;
  } else if (q.type === 'speak') {
    body = `<p class="eyebrow">Speaking · ${e.i + 1} of ${n}</p>
      <h2 class="prompt">${esc(fill(q.it.en))}</h2>
      ${S.canListen() ? speakHTML(q.it.tr) : '<p class="muted">Say it out loud, then show the answer and mark yourself honestly.</p>'}
      <div class="answer" hidden>${phraseHTML(q.it.tr, { size: 'lg' })}</div>
      <div class="next"><button class="btn ghost" data-act="exshow">${S.canListen() ? 'I don\'t know' : 'Show the answer'}</button></div>`;
  } else {
    body = `<p class="eyebrow">Conversation · ${e.i + 1} of ${n}</p>
      <p class="muted">${esc(WHO[q.cue.who])} says:</p>
      <h2 class="prompt">What do you answer?</h2>
      <div class="audio big"><button class="btn primary" data-act="play" data-text="${esc(q.cue.tr)}">${I.play}<span>Listen again</span></button></div>
      <div class="opts col">${q.options.map((o, oi) => `<button class="opt" data-act="exans" data-o="${oi}" lang="tr">${esc(fill(o))}</button>`).join('')}</div>`;
  }
  view.innerHTML = `<div class="session">
    <div class="sbar">
      <a class="iconlink" href="#path" aria-label="Leave the exam">${I.x}</a>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${e.i}"><span style="width:${(e.i / n) * 100}%"></span></div>
      <span class="count">${e.i + 1}/${n}</span>
    </div>
    <div class="stage">${body}<div class="exnext"></div></div>
  </div>`;
  window.scrollTo(0, 0);

  const settle = (ok) => {
    if (q.done) return;
    q.done = true;
    if (ok) e.right++;
    $('.exnext', view).innerHTML = `<p class="verdict ${ok ? 'ok' : 'miss'}"><span>${ok ? 'Right.' : 'Not this one.'}</span></p>
      <div class="next"><button class="btn primary" data-act="exnext">${e.i + 1 < n ? 'Next' : 'See result'} ${I.arrow}</button></div>`;
  };

  local = {
    exans: (el) => {
      if (q.done) return;
      const pick = q.options[+el.dataset.o];
      $$('.opt', view).forEach((b, j) => {
        b.disabled = true;
        if (q.options[j] === q.answer) b.classList.add('right');
        else if (b === el) b.classList.add('wrong');
      });
      settle(pick === q.answer);
    },
    exshow: () => {
      $('.answer', view).hidden = false;
      S.speak(fill(q.it.tr));
      if (S.canListen()) { settle(false); return; }
      $('.next', view).innerHTML = `<button class="btn" data-act="exself" data-ok="0">I got it wrong</button><button class="btn primary" data-act="exself" data-ok="1">I said it right</button>`;
    },
    exself: (el) => { $('.next', view).innerHTML = ''; settle(el.dataset.ok === '1'); },
    exnext: () => { e.i++; if (e.i < n) drawExamQ(); else examResult(); },
  };
  $('.speak', view)?.addEventListener('checked', (ev) => {
    if (q.done) return;
    $('.answer', view).hidden = false;
    $('.next', view).innerHTML = '';
    settle(ev.detail.score >= 0.75);
  });
  if (q.type === 'listen') S.speak(fill(q.it.tr));
  if (q.type === 'convo') S.speak(fill(q.cue.tr));
}

function examResult() {
  const e = exam;
  const n = e.qs.length;
  const pass = e.right / n >= PASS;
  const wasA1 = !store.state.progress['rank:A2'];
  if (e.mock) award(XP.again);
  else if (pass && wasA1) { store.markLesson('rank:A2'); award(XP.exam, null); }
  else if (pass) award(XP.again);
  else store.log('examFail');
  exam = null;
  view.innerHTML = `<section class="done">
    <p class="eyebrow">${e.mock ? 'Practice exam' : 'A1 exam'} · result</p>
    <h1 class="big-num">${e.right} / ${n}</h1>
    <h2 class="lesson-title" lang="tr">${pass ? 'Tebrikler!' : 'Olsun, devam!'}</h2>
    <p class="lede">${pass
    ? (e.mock ? 'That would pass the real exam.' : wasA1 ? 'You\'re A2 now. Everything in A2 is open, and the path shows what\'s coming.' : 'Passed again.')
    : `You need ${Math.round(n * PASS)} to pass. ${e.mock ? 'Review, replay a few dialogues, and try again.' : 'Try again tomorrow. Until then, the practice exam and your reviews are the best preparation.'}`}</p>
    <div class="row"><a class="btn primary" href="#path">Back to path</a>${e.mock ? '<a class="btn" href="#exam/mock">Take it again</a>' : ''}</div>
  </section>`;
  local = {};
  drawLevelChip();
}

/* ---------- Vocab ---------- */

const vocabUI = { q: '', filter: 'all' };

function vocabView() {
  const cards = store.cards();
  view.innerHTML = `
  <header class="page-head row-between"><div><h1>Vocab</h1><p class="lede">${plural(cards.filter((c) => c.kind === 'phrase').length, 'phrase', 'phrases')} and ${plural(cards.filter((c) => c.kind === 'word').length, 'word', 'words')}, saved as you learn.</p></div>
    <a class="btn" href="#add">${I.plus}<span>Add</span></a></header>
  <div class="searchbar">${I.search}<input id="vq" type="search" placeholder="Search Turkish or English" value="${esc(vocabUI.q)}" autocomplete="off" aria-label="Search vocab"></div>
  <div class="filters" role="tablist">${[['all', 'All'], ['phrase', 'Phrases'], ['word', 'Words'], ['weak', 'Weak'], ['mine', 'Added by me']].map(([k, t]) => `<button class="filter${vocabUI.filter === k ? ' on' : ''}" data-act="filter" data-f="${k}" role="tab" aria-selected="${vocabUI.filter === k}">${t}</button>`).join('')}</div>
  <ul class="vlist" id="vlist"></ul>`;
  local = { filter: (el) => { vocabUI.filter = el.dataset.f; vocabView(); } };
  $('#vq').addEventListener('input', (e) => { vocabUI.q = e.target.value; drawVocabList(); });
  drawVocabList();
}

function drawVocabList() {
  const list = $('#vlist');
  if (!list) return;
  const q = P.trLower(vocabUI.q.trim());
  const spell = settings().showSpelling;
  let cards = store.cards();
  if (vocabUI.filter === 'phrase' || vocabUI.filter === 'word') cards = cards.filter((c) => c.kind === vocabUI.filter);
  if (vocabUI.filter === 'weak') cards = cards.filter((c) => c.lapses > 0 || (c.s && srs.retrievability(c) < 0.85));
  if (vocabUI.filter === 'mine') cards = cards.filter((c) => c.src === 'mine');
  if (q) cards = cards.filter((c) => P.trLower(c.tr).includes(q) || P.trLower(c.en).includes(q) || P.clean(c.tr).includes(P.clean(q)));
  cards.sort((a, b) => (b.added || 0) - (a.added || 0));
  if (!store.cards().length) {
    list.innerHTML = `<li class="empty"><p>Words you learn appear here automatically.</p><a class="btn primary" href="#lesson/${LESSONS[0].id}">Start with the sounds</a></li>`;
    return;
  }
  if (!cards.length) { list.innerHTML = '<li class="empty"><p>Nothing matches.</p></li>'; return; }
  list.innerHTML = cards.slice(0, 400).map((c) => {
    const pct = c.s ? strengthPct(c) : 0;
    return `<li class="vrow">
      <button class="play-mini" data-act="play" data-text="${esc(c.tr)}" aria-label="Listen to ${esc(c.tr)}">${I.play}</button>
      <a class="vmain" href="#item/${encodeURIComponent(c.id)}">
        ${spell ? `<span class="vtr" lang="tr">${esc(c.tr)}</span>` : ''}
        <span class="vsay${spell ? '' : ' solo'}">${sayHTML(c.tr)}</span>
        <span class="ven">${esc(c.en)}</span>
      </a>
      <span class="strength" title="Memory strength ${pct}%"><i style="width:${pct}%"></i></span>
    </li>`;
  }).join('');
}

/* ---------- One word or phrase, in full ---------- */

function detailView(tr, en, { card = null, note = '' } = {}) {
  const words = P.tokens(fill(tr));
  const gl = glossMap();
  const tips = new Map();
  for (const w of words) for (const t of P.soundTips(w)) tips.set(t.k, t);
  const isPhrase = words.length > 1;
  const pct = card?.s ? strengthPct(card) : null;
  const inVocab = !!card;
  const confirmDelete = { armed: false };

  view.innerHTML = `
  <button class="backlink" data-act="back">${I.back}<span>Back</span></button>
  <p class="eyebrow">${isPhrase ? 'Phrase' : 'Word'}</p>
  ${phraseHTML(tr)}
  <p class="en">${esc(fill(en || '')) || '<span class="muted">No meaning saved yet.</span>'}</p>
  ${audioHTML(tr)}
  ${note ? `<p class="note">${esc(note)}</p>` : ''}

  <section class="block">
    <h3>Syllables and stress</h3>
    <div class="syllables">${words.map((w) => {
      const r = P.respellWord(w);
      if (r.stress < 0) return `<div class="sword"><span class="syl"><span lang="tr">${esc(r.syl[0])}</span><small>${esc(r.say[0])}</small></span></div>`;
      return `<div class="sword">${r.syl.map((sy, i) => `<span class="syl${i === r.stress ? ' st' : ''}"><span lang="tr">${esc(sy)}</span><small>${esc(i === r.stress ? upper(r.say[i]) : r.say[i])}</small></span>`).join('')}</div>`;
    }).join('')}</div>
    <p class="muted small">The highlighted syllable is a little louder and higher. ${words.some((w) => P.CLITICS.has(P.clean(w))) ? 'Small question words like mi and mı carry no stress: your voice rises on the word just before them.' : 'Most Turkish words stress the last syllable.'}</p>
  </section>

  ${tips.size ? `<section class="block"><h3>Sounds to watch</h3><ul class="tips">${[...tips.values()].map((t) => `<li><span class="letter" lang="tr">${t.k === '2x' ? 'kk' : esc(t.k)}</span><p>${esc(t.tip)}</p></li>`).join('')}</ul></section>` : ''}

  <section class="block"><h3>Say it</h3>${speakHTML(tr)}</section>

  ${isPhrase ? `<section class="block"><h3>Word by word</h3><ul class="breakdown">${words.map((w) => `<li><a href="#word/${encodeURIComponent(w)}" lang="tr">${esc(w)}</a><span>${esc(gl.get(P.clean(w)) || '')}</span></li>`).join('')}</ul></section>` : ''}

  <section class="block">
    <h3>Memory</h3>
    ${inVocab ? `<dl class="memory">
        <div><dt>Strength</dt><dd>${pct === null ? 'New' : pct + '%'}</dd></div>
        <div><dt>Next review</dt><dd>${card.due ? (srs.isDue(card) ? 'Today' : 'in ' + srs.fmt(card.due - Date.now())) : 'Today'}</dd></div>
        <div><dt>Reviews</dt><dd>${card.reps || 0}</dd></div>
      </dl>
      <button class="btn ghost danger" data-act="del">Remove from vocab</button>`
    : '<p class="muted">Not in your vocab yet.</p><button class="btn primary" data-act="save">Save to vocab</button>'}
  </section>`;
  hydrateRecordings();

  local = {
    save: () => {
      const t = fill(tr);
      const kind = kindOf(t);
      const c = store.putCard({ id: cardId(kind, t), kind, tr: t, en: fill(en || ''), src: 'mine', added: Date.now(), due: Date.now() });
      detailView(tr, en, { card: c, note });
    },
    del: (el) => {
      if (!confirmDelete.armed) { confirmDelete.armed = true; el.textContent = 'Tap again to remove'; return; }
      store.deleteCard(card.id);
      history.back();
    },
  };
}

function itemView(id) {
  const c = store.card(id);
  if (!c) { view.innerHTML = '<p class="notice">This card is no longer in your vocab.</p><a class="btn" href="#vocab">Back to vocab</a>'; local = {}; return; }
  xpFrom = cardRank(c);
  detailView(c.tr, c.en, { card: c });
}

function wordView(text) {
  const k = P.clean(text);
  const card = store.card(cardId('word', text));
  const cw = COURSE_WORDS.find((w) => P.clean(w.tr) === k);
  xpFrom = card ? cardRank(card) : cw ? 'A1' : null;
  detailView(card?.tr || cw?.tr || text, card?.en || cw?.en || glossMap().get(k) || '', { card });
}

/* ---------- Pronounce ---------- */

const pronUI = { q: '' };

function pronounceView() {
  view.innerHTML = `
  <header class="page-head"><h1>Pronounce</h1>
    <p class="lede">Turkish is written exactly as it sounds. Learn these sounds once and you can say any word, even one you have never seen. Most of them already exist in Italian.</p></header>

  <section class="block">
    <h2 class="h2">The sound line</h2>
    <p>Under every phrase you'll see a line like <span class="say inline">${sayHTML('Teşekkür ederim')}</span>. It spells each sound the way you would read it in English, with Italian vowels. The highlighted syllable carries the stress. ə stands for the Turkish ı.</p>
  </section>

  <section class="block">
    <h2 class="h2">Sound guide</h2>
    <ul class="sounds">${P.SOUNDS.map((s) => `<li>
      <span class="letter" lang="tr">${s.k === '2x' ? 'kk' : esc(s.k)}</span>
      <div><p class="like">Sounds like <b>${esc(s.say)}</b></p><p>${esc(s.tip)}</p></div>
      <button class="btn ghost small" data-act="play" data-text="${esc(s.ex)}">${I.play}<span lang="tr">${esc(s.ex)}</span><small>${esc(s.exEn)}</small></button>
    </li>`).join('')}</ul>
  </section>

  <section class="block">
    <h2 class="h2">Stress in three rules</h2>
    <ol class="rules">
      <li><b>Most words stress the last syllable.</b> <span class="say inline">${sayHTML('güzel')}</span>, <span class="say inline">${sayHTML('teşekkürler')}</span>. Adding endings moves the stress along: <span class="say inline">${sayHTML('akşam')}</span>, <span class="say inline">${sayHTML('akşamlar')}</span>.</li>
      <li><b>In "-iyor" verbs, the vowel before "yor" is stressed.</b> <span class="say inline">${sayHTML('seviyorum')}</span>. With "not" (-m-), it moves one step back: <span class="say inline">${sayHTML('anlamıyorum')}</span>.</li>
      <li><b>Question words mi, mı, mu, mü are never stressed.</b> Your voice rises on the word before them: <span class="say inline">${sayHTML('Hazır mısın')}</span>.</li>
    </ol>
    <p class="muted small">Common exceptions, like <span lang="tr">merhaba</span>, <span lang="tr">nasıl</span> and place names, are marked correctly in every sound line.</p>
  </section>

  <section class="block">
    <h2 class="h2">Every word</h2>
    <div class="searchbar">${I.search}<input id="pq" type="search" placeholder="Search words" value="${esc(pronUI.q)}" autocomplete="off" aria-label="Search words"></div>
    <ul class="wlist" id="wlist"></ul>
  </section>`;
  local = {};
  $('#pq').addEventListener('input', (e) => { pronUI.q = e.target.value; drawWordList(); });
  drawWordList();
}

function drawWordList() {
  const list = $('#wlist');
  const q = P.trLower(pronUI.q.trim());
  const map = new Map();
  for (const w of COURSE_WORDS) map.set(P.clean(w.tr), w);
  for (const c of store.cards()) if (c.kind === 'word' && !map.has(P.clean(c.tr))) map.set(P.clean(c.tr), { tr: c.tr, en: c.en });
  let words = [...map.values()].sort((a, b) => P.trLower(a.tr).localeCompare(P.trLower(b.tr), 'tr'));
  if (q) words = words.filter((w) => P.trLower(w.tr).includes(q) || P.trLower(w.en).includes(q));
  list.innerHTML = words.map((w) => `<li><a href="#word/${encodeURIComponent(w.tr)}"><span class="wtr" lang="tr">${esc(w.tr)}</span><span class="wsay">${sayHTML(w.tr)}</span><span class="wen">${esc(w.en)}</span></a></li>`).join('') || '<li class="empty"><p>Nothing matches.</p></li>';
}

/* ---------- Add your own ---------- */

function askPrompt(en) {
  return `I'm learning to SPEAK Turkish. I'm a beginner and a native Italian speaker.
How do I say this in natural, everyday spoken Turkish: "${en}"

Reply ONLY with lines in this exact format, nothing else:
Turkish | English meaning

First line: the full Turkish phrase and its meaning.
Then one line for each word in the phrase, with what that word means on its own.`;
}

function parseLines(text) {
  return text.split(/\n+/).map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/\*\*/g, '').trim())
    .filter((l) => l.includes('|'))
    .map((l) => { const [tr, ...rest] = l.split('|'); return { tr: tr.trim().replace(/^["“]|["”]$/g, ''), en: rest.join('|').trim() }; })
    .filter((x) => x.tr && x.en && /\p{L}/u.test(x.tr));
}

function addCards(rows) {
  const now = Date.now();
  let added = 0;
  rows.forEach((r, i) => {
    const kind = kindOf(r.tr);
    const id = cardId(kind, r.tr);
    if (store.card(id)) return;
    store.putCard({ id, kind, tr: r.tr, en: r.en, src: 'mine', added: now + i, due: now });
    added++;
  });
  return added;
}

function addView() {
  view.innerHTML = `
  <button class="backlink" data-act="back">${I.back}<span>Back</span></button>
  <header class="page-head"><h1>Add to vocab</h1><p class="lede">Anything you want to be able to say. It joins your reviews today.</p></header>

  <section class="panel">
    <h2 class="h2">Ask Claude</h2>
    <p class="muted">Free with your Claude subscription. Type what you want to say, copy the question, paste it into Claude, then paste Claude's answer here.</p>
    <label for="ask-en">What do you want to say?</label>
    <input id="ask-en" type="text" placeholder="I can't wait to see you" autocomplete="off">
    <div class="row">
      <button class="btn primary" data-act="copyask">${I.copy}<span>Copy question</span></button>
      <a class="btn" href="https://claude.ai/new" target="_blank" rel="noopener">Open Claude</a>
    </div>
    <textarea id="ask-fallback" class="fallback" rows="6" hidden readonly></textarea>
    <label for="ask-paste">Claude's answer</label>
    <textarea id="ask-paste" rows="5" placeholder="Seni görmek için sabırsızlanıyorum | I can't wait to see you"></textarea>
    <div class="row"><button class="btn" data-act="importask">${I.plus}<span>Add these</span></button></div>
    <p class="formmsg" id="ask-msg" aria-live="polite"></p>
  </section>

  <section class="panel">
    <h2 class="h2">Add by hand</h2>
    <label for="man-tr">Turkish</label>
    <input id="man-tr" type="text" lang="tr" autocomplete="off" placeholder="Seni çok seviyorum">
    <label for="man-en">Meaning</label>
    <input id="man-en" type="text" autocomplete="off" placeholder="I love you very much">
    <div class="row"><button class="btn" data-act="addman">${I.plus}<span>Save</span></button></div>
    <p class="formmsg" id="man-msg" aria-live="polite"></p>
  </section>`;

  local = {
    async copyask() {
      const en = $('#ask-en').value.trim();
      const msg = $('#ask-msg');
      if (!en) { msg.textContent = 'Type what you want to say first.'; $('#ask-en').focus(); return; }
      const text = askPrompt(en);
      try {
        await navigator.clipboard.writeText(text);
        msg.textContent = 'Copied. Paste it into Claude.';
      } catch {
        const fb = $('#ask-fallback');
        fb.hidden = false; fb.value = text; fb.select();
        msg.textContent = 'Copy the selected text above, then paste it into Claude.';
      }
    },
    importask() {
      const rows = parseLines($('#ask-paste').value);
      const msg = $('#ask-msg');
      if (!rows.length) { msg.textContent = 'No lines in the "Turkish | meaning" format were found.'; return; }
      const n = addCards(rows);
      msg.textContent = n ? `Added ${plural(n, 'card', 'cards')} to your vocab.` : 'All of these were already in your vocab.';
      if (n) $('#ask-paste').value = '';
    },
    addman() {
      const tr = $('#man-tr').value.trim();
      const en = $('#man-en').value.trim();
      const msg = $('#man-msg');
      if (!tr || !en) { msg.textContent = 'Fill in both the Turkish and the meaning.'; return; }
      const n = addCards([{ tr, en }]);
      msg.textContent = n ? 'Saved.' : 'That one is already in your vocab.';
      if (n) { $('#man-tr').value = ''; $('#man-en').value = ''; }
    },
  };
}

/* ---------- Settings ---------- */

const voiceUI = { sample: 0 };

function settingsView() {
  const s = settings();
  const voices = S.turkishVoices();
  const st = sync.status();
  const reset = { armed: false };

  view.innerHTML = `
  <header class="page-head"><h1>Settings</h1></header>

  <section class="block">
    <h2 class="h2">You</h2>
    <label for="set-name">Your name</label>
    <input id="set-name" type="text" value="${esc(s.name)}" autocomplete="given-name">
    <label class="switch"><input id="set-spell" type="checkbox" ${s.showSpelling ? 'checked' : ''}><span>Show Turkish spelling</span></label>
    <p class="muted small">Turn it off to learn from sound only: you'll see just the sound line. Turkish spelling is so regular that reading comes almost free later.</p>
  </section>

  <section class="block" id="voice">
    <h2 class="h2">Voice</h2>
    <p class="muted small">Pick a sentence, play it in each voice, and choose the one you want to learn from.</p>
    <div class="filters samples" aria-label="Sample sentence">${SAMPLES.map((t, i) => `<button class="filter${i === voiceUI.sample ? ' on' : ''}" data-act="sample" data-i="${i}" lang="tr">${esc(t)}</button>`).join('')}</div>
    <div id="voices"></div>
    <label for="set-rate">Speed <output id="rate-out">${Math.round(s.rate * 100)}%</output></label>
    <input id="set-rate" type="range" min="0.6" max="1.1" step="0.05" value="${s.rate}">
    <details class="howto"><summary>Device voice settings</summary>
      <p>The device voice reads anything without a recording, like phrases you add yourself.</p>
      ${voices.length ? `<label for="set-voice">Device voice</label>
        <select id="set-voice"><option value="">Best available</option>${voices.map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.voiceURI ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select>`
      : '<p class="notice">No Turkish device voice found yet.</p>'}
      <p><b>Better device voice, Mac:</b> System Settings, Accessibility, Spoken Content, System voice, Manage Voices. Find Turkish and download Yelda (Enhanced).</p>
      <p><b>iPhone:</b> Settings, Accessibility, Spoken Content, Voices, Turkish. Download Yelda (Enhanced).</p>
    </details>
  </section>

  <section class="block">
    <h2 class="h2">Sync</h2>
    <div id="sync-panel"></div>
  </section>

  <section class="block">
    <h2 class="h2">Backup</h2>
    <p class="muted small">A copy of everything as one file. Useful before switching phones.</p>
    <div class="row">
      <button class="btn" data-act="export">Download backup</button>
      <label class="btn" for="imp-file">Restore from file</label>
      <input id="imp-file" type="file" accept="application/json,.json" hidden>
    </div>
    <p class="formmsg" id="bk-msg" aria-live="polite"></p>
  </section>

  <section class="block">
    <h2 class="h2">Start over</h2>
    <button class="btn ghost danger" data-act="reset">Erase all progress</button>
  </section>

  <p class="muted small foot">Konuş · Free and open. Your recordings never leave this device.</p>`;

  const authSubmit = async (create) => {
    const email = $('#au-email').value.trim();
    const pass = $('#au-pass').value;
    const msg = $('#au-msg');
    if (!email || !pass) { msg.textContent = 'Type your email and a password.'; return; }
    msg.textContent = create ? 'Creating your account…' : 'Signing in…';
    const err = await sync.signIn(email, pass, create);
    if (err && $('#au-msg')) $('#au-msg').textContent = err;
  };

  const drawSync = (st2) => {
    const el = $('#sync-panel');
    if (!el) return;
    if (st2.state === 'off') el.innerHTML = '<p class="muted">Sync is not set up yet. Progress is saved on this device. Once Firebase is connected (free), sign in here and your vocab follows you to every device.</p>';
    else if (st2.state === 'loading') el.innerHTML = '<p class="muted">Connecting…</p>';
    else if (st2.state === 'signed-out') {
      el.innerHTML = `<p class="muted">Use the same email and password on each device. Everything you learn then syncs automatically.</p>
        <form id="auth-form" class="authform" novalidate>
          <label for="au-email">Email</label>
          <input id="au-email" type="email" autocomplete="username" inputmode="email" required>
          <label for="au-pass">Password</label>
          <input id="au-pass" type="password" autocomplete="current-password" minlength="6" required>
          <div class="row">
            <button class="btn primary" type="submit">Sign in</button>
            <button class="btn" type="button" data-act="signup">Create account</button>
            <button class="btn ghost" type="button" data-act="forgot">Forgot password</button>
          </div>
          <p class="formmsg" id="au-msg" aria-live="polite"></p>
        </form>`;
      $('#auth-form').addEventListener('submit', (e) => { e.preventDefault(); local.signin(); });
    }
    else if (st2.state === 'error') el.innerHTML = `<p class="notice">${esc(st2.error)}</p>`;
    else el.innerHTML = `<p>Synced as <b>${esc(st2.email)}</b>${st2.lastSync ? `, last at ${new Date(st2.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}.</p>${st2.error ? `<p class="notice">${esc(st2.error)}</p>` : ''}<button class="btn ghost" data-act="signout">Sign out</button>`;
  };
  drawSync(st);
  const off = sync.onStatus(drawSync);
  cleanup = off;

  const voiceRow = (v) => {
    const inUse = (settings().recordedVoice || 'emel') === v.id;
    return `<li class="voice${inUse ? ' chosen' : ''}">
      <button class="play-mini" data-act="tryvoice" data-v="${v.id}" aria-label="Play ${esc(v.name)}">${I.play}</button>
      <div class="vinfo"><b>${esc(v.name)}</b><small>${esc(v.about)}</small></div>
      ${v.full ? (inUse ? '<span class="tag on">In use</span>' : `<button class="btn small" data-act="usevoice" data-v="${v.id}">Use</button>`) : '<span class="tag">Sample</span>'}
    </li>`;
  };
  const drawVoices = () => {
    const device = { id: 'device', name: 'Device voice', full: true, about: 'Built into this phone or computer (Yelda). Reads anything, sounds more robotic.' };
    $('#voices').innerHTML = `
      <h3 class="vgroup">Native Turkish · whole course recorded</h3>
      <ul class="voices">${VOICES.filter((v) => v.native).map(voiceRow).join('')}${voiceRow(device)}</ul>
      <h3 class="vgroup">Multilingual · samples only</h3>
      <p class="muted small">These speak Turkish as a second language. If you like one, ask Claude to record the whole course in it.</p>
      <ul class="voices">${VOICES.filter((v) => !v.native).map(voiceRow).join('')}</ul>`;
  };
  drawVoices();

  $('#set-name').addEventListener('change', (e) => store.setSettings({ name: e.target.value.trim() || 'Giosuè' }));
  $('#set-spell').addEventListener('change', (e) => store.setSettings({ showSpelling: e.target.checked }));
  $('#set-voice')?.addEventListener('change', (e) => { store.setSettings({ voiceURI: e.target.value }); S.setVoice(e.target.value, settings().rate); });
  $('#set-rate').addEventListener('input', (e) => { $('#rate-out').textContent = Math.round(e.target.value * 100) + '%'; });
  $('#set-rate').addEventListener('change', (e) => { store.setSettings({ rate: +e.target.value }); S.setVoice(settings().voiceURI, +e.target.value); });
  $('#imp-file').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data.cards) throw new Error('bad');
      store.replaceAll(data);
      $('#bk-msg').textContent = `Restored ${Object.keys(data.cards).length} cards.`;
    } catch { $('#bk-msg').textContent = 'That file is not a Konuş backup.'; }
  });

  local = {
    sample(el) {
      voiceUI.sample = +el.dataset.i;
      $$('.samples .filter', view).forEach((b) => b.classList.toggle('on', b === el));
    },
    tryvoice: async (el) => {
      el.classList.add('busy');
      await S.playVoice(el.dataset.v, SAMPLES[voiceUI.sample]);
      el.classList.remove('busy');
    },
    usevoice(el) {
      store.setSettings({ recordedVoice: el.dataset.v });
      S.setRecordedVoice(el.dataset.v);
      drawVoices();
    },
    signin: () => authSubmit(false),
    signup: () => authSubmit(true),
    async forgot() {
      const email = $('#au-email').value.trim();
      const msg = $('#au-msg');
      if (!email) { msg.textContent = 'Type your email first, then tap Forgot password.'; return; }
      const err = await sync.resetPassword(email);
      msg.textContent = err || `A reset link is on its way to ${email}.`;
    },
    signout: () => sync.signOut(),
    export() {
      const blob = new Blob([JSON.stringify(store.state, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `konus-backup-${new Date().toLocaleDateString('en-CA')}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    reset(el) {
      if (!reset.armed) { reset.armed = true; el.textContent = 'Tap again to erase everything'; return; }
      store.reset();
      el.textContent = 'Erased';
    },
  };
}

/* ---------- router and shell ---------- */

const ROUTES = { today: todayView, path: pathView, lesson: lessonView, review: reviewView, drill: drillView, talk: talkView, story: storyView, exam: examView, vocab: vocabView, item: itemView, word: wordView, pronounce: pronounceView, add: addView, settings: settingsView };
const TAB_OF = { today: 'today', review: 'today', path: 'path', lesson: 'path', drill: 'path', talk: 'path', story: 'path', exam: 'path', vocab: 'vocab', item: 'vocab', add: 'vocab', word: 'pronounce', pronounce: 'pronounce', settings: '' };
const SESSIONS = new Set(['lesson', 'review', 'drill']);
const FOCUS = new Set(['lesson', 'review', 'drill', 'talk', 'story', 'exam']);
let cleanup = null;
let current = '';

function render() {
  const [name, ...rest] = (location.hash.slice(1) || 'today').split('/');
  const route = ROUTES[name] ? name : 'today';
  const arg = decodeURIComponent(rest.join('/'));
  cleanup?.(); cleanup = null;
  playToken++;
  xpFrom = null;
  belowNoted = false;
  document.querySelector('.levelup')?.remove();
  S.stopListening();
  if (recorder) { recorder.stop(); recorder = null; }
  S.stopSpeaking();
  current = route;
  document.body.classList.toggle('focus', FOCUS.has(route));
  $$('.tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === TAB_OF[route]));
  if (!SESSIONS.has(route) && session?.finished) session = null;
  ROUTES[route](arg);
  window.scrollTo(0, 0);
}

function shell() {
  $('#tabs').innerHTML = [['today', 'Today', I.today], ['path', 'Path', I.path], ['vocab', 'Vocab', I.vocab], ['pronounce', 'Pronounce', I.pron]]
    .map(([k, t, ic]) => `<a href="#${k}" data-tab="${k}">${ic}<span>${t}</span></a>`).join('');
  $('#settings-link').innerHTML = I.sliders;
  drawLevelChip();
  sync.onStatus((st) => {
    const el = $('#sync');
    const map = { on: 'Synced', 'signed-out': 'Sign in to sync', error: 'Sync paused' };
    el.hidden = !map[st.state];
    el.textContent = map[st.state] || '';
    el.className = `sync ${st.state}`;
  });
}

let redrawTimer = null;
store.subscribe((kind) => {
  if (kind === 'meta' || kind === 'all') { S.setVoice(settings().voiceURI, settings().rate); S.setRecordedVoice(settings().recordedVoice); drawLevelChip(); }
  if (!['today', 'path'].includes(current) && !(current === 'vocab' && kind !== 'meta')) return;
  clearTimeout(redrawTimer);
  redrawTimer = setTimeout(() => {
    if (current === 'vocab') drawVocabList();
    else ROUTES[current]();
  }, 200);
});

document.addEventListener('keydown', (e) => {
  if (!document.body.classList.contains('focus') || e.target.closest('input, textarea, select') || e.metaKey || e.ctrlKey) return;
  const click = (sel) => { const b = $(sel, view); if (b) { e.preventDefault(); b.click(); } };
  if (e.key === ' ') click('[data-act="play"]');
  else if (e.key === 'Enter') click('.next .btn.primary, .next [data-act="reveal"]');
  else if (e.key.toLowerCase() === 'm') click('[data-act="check"]');
  else if (['1', '2', '3', '4'].includes(e.key)) click(`[data-act="grade"][data-g="${e.key}"]`);
});

// The phrases you already knew before starting, added once per device.
const ALREADY_KNOWN = [['Merhaba!', 'Hello!'], ['Seni seviyorum.', 'I love you.']];
function seedKnown() {
  if (store.state.seeded) return;
  const now = Date.now();
  for (const [tr, en] of ALREADY_KNOWN) {
    const kind = kindOf(tr);
    const id = cardId(kind, tr);
    if (!store.card(id)) store.putCard(srs.grade({ id, kind, tr, en, src: 'known', added: now }, 3, now));
  }
  store.markSeeded();
}

for (const type of ['touchend', 'click']) document.addEventListener(type, S.unlockAudio, { capture: true, once: true });

let toastTimer = null;
function toast(text) {
  let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.append(el); }
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 6000);
}
window.addEventListener('speech-error', (e) => {
  const noVoice = ['language-unavailable', 'voice-unavailable', 'synthesis-unavailable'].includes(e.detail);
  toast(noVoice
    ? 'No Turkish voice on this device. iPhone: Settings, Accessibility, Spoken Content, Voices, Turkish.'
    : 'The audio could not play. Check that silent mode is off and the volume is up, then tap again.');
});

S.setVoice(settings().voiceURI, settings().rate);
S.setRecordedVoice(settings().recordedVoice);
seedKnown();
shell();
window.addEventListener('hashchange', render);
render();
sync.init();
