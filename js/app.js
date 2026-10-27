import { UNITS, LESSONS, lessonById, COURSE_WORDS } from './course.js';
import * as P from './pron.js';
import * as S from './speech.js';
import * as srs from './srs.js';
import { store, cardId, saveRecording, getRecording } from './store.js';
import * as sync from './sync.js';
import { VOICES, SAMPLES } from './voices.js';

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
};

// Meaning of any word the app knows, from the course and your vocab.
function glossMap() {
  const m = new Map();
  for (const w of COURSE_WORDS) m.set(P.clean(w.tr), w.en);
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
  const h = new Date().getHours();
  const greet = h < 11 ? 'Günaydın' : h < 18 ? 'Merhaba' : 'İyi akşamlar';
  const cards = store.cards();
  const due = cards.filter((c) => srs.isDue(c)).length;
  const next = LESSONS.find((l) => !store.state.progress[l.id]);
  const done = LESSONS.filter((l) => store.state.progress[l.id]).length;
  const upcoming = cards.filter((c) => c.due && !srs.isDue(c)).sort((a, b) => a.due - b.due)[0];
  const streak = store.streak();
  const pool = LESSONS.flatMap((l) => l.items).filter((it) => P.tokens(it.tr).length > 1);
  const dayNo = Math.floor(Date.now() / 864e5);
  const potd = pool[dayNo % pool.length];

  view.innerHTML = `
  <section class="hello">
    <p class="eyebrow">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    <h1 class="display" lang="tr">${greet}, ${esc(s.name)}.</h1>
    <p class="say muted-say">${sayHTML(greet)}</p>
  </section>

  ${S.canListen() ? '' : `<p class="notice">${MIC_ERRORS.unsupported}</p>`}

  <div class="today-grid">
    <article class="panel">
      <p class="eyebrow">Review</p>
      ${due ? `<h2 class="big-num">${due}</h2><p class="muted">${due === 1 ? 'phrase is' : 'phrases and words are'} ready to practise. Reviewing right before you forget is what makes words stick.</p>
        <a class="btn primary" href="#review">${I.mic}<span>Start review</span></a>`
    : `<h2 class="big-num">0</h2><p class="muted">${upcoming ? `Nothing due. Next review in ${srs.fmt(upcoming.due - Date.now())}.` : 'Finish a lesson and its phrases start coming back here.'}</p>`}
    </article>
    <article class="panel">
      <p class="eyebrow">Next lesson</p>
      ${next ? `<h2 class="lesson-title">${esc(next.title)}</h2><p class="muted">Unit ${UNITS.indexOf(next.unit)} · ${esc(next.unit.title)}. ${esc(next.goal)}.</p>
        <a class="btn ${due ? '' : 'primary'}" href="#lesson/${next.id}">${I.arrow}<span>Start lesson</span></a>`
    : '<h2 class="lesson-title">Course complete</h2><p class="muted">Keep reviewing and add your own phrases. New lessons arrive with app updates.</p>'}
    </article>
  </div>

  <dl class="stats">
    <div><dt>Day streak</dt><dd>${streak}</dd></div>
    <div><dt>Phrases</dt><dd>${cards.filter((c) => c.kind === 'phrase').length}</dd></div>
    <div><dt>Words</dt><dd>${cards.filter((c) => c.kind === 'word').length}</dd></div>
    <div><dt>Lessons</dt><dd>${done}/${LESSONS.length}</dd></div>
  </dl>

  <section class="potd">
    <p class="eyebrow">Phrase of the day</p>
    ${phraseHTML(potd.tr, { size: 'lg' })}
    <p class="en">${esc(fill(potd.en))}</p>
    ${audioHTML(potd.tr)}
  </section>`;
  local = {};
}

/* ---------- Path ---------- */

function pathView() {
  const next = LESSONS.find((l) => !store.state.progress[l.id]);
  view.innerHTML = `
  <header class="page-head"><h1>Path</h1><p class="lede">From zero to talking with her family. Each lesson takes about ten minutes: hear it, echo it, understand it without text, then say it from memory.</p></header>
  ${UNITS.map((u, ui) => `
    <section class="unit">
      <header><p class="eyebrow">Unit ${ui}</p><h2>${esc(u.title)}</h2><p class="muted">${esc(u.blurb)}</p></header>
      <ol class="lessons">${u.lessons.map((l) => {
        const done = store.state.progress[l.id];
        const isNext = next && next.id === l.id;
        return `<li><a class="lrow ${done ? 'done' : ''} ${isNext ? 'next' : ''}" href="#lesson/${l.id}">
          <span class="lstate">${done ? I.check : ''}</span>
          <span class="ltext"><b>${esc(l.title)}</b><small>${esc(l.goal)} · ${plural(l.items.length, 'phrase', 'phrases')}</small></span>
          <span class="tag">${done ? 'Again' : isNext ? 'Next' : 'Open'}</span>
        </a></li>`;
      }).join('')}</ol>
    </section>`).join('')}`;
  local = {};
}

/* ---------- Sessions: lessons and reviews ---------- */

let session = null;
const GRADE = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };

function lessonView(id) {
  const l = lessonById(id);
  if (!l) { location.hash = '#path'; return; }
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
      <a class="iconlink" href="${s.kind === 'lesson' ? '#path' : '#today'}" aria-label="Close">${I.x}</a>
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
  };

  $('.speak', view)?.addEventListener('checked', (e) => {
    if (step.type === 'recall') reveal(S.suggestGrade(e.detail.score));
  });

  if (step.type !== 'recall') S.speak(fill(it.tr));
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
  const l = s.lesson;
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
  const idx = LESSONS.findIndex((x) => x.id === l.id);
  const nextL = LESSONS.slice(idx + 1).find((x) => !store.state.progress[x.id]) || LESSONS[idx + 1];
  view.innerHTML = `<section class="done"><p class="eyebrow">Lesson done</p><h1 lang="tr">Aferin!</h1><p class="say muted-say">${sayHTML('Aferin')}</p>
    <p class="lede">Well done. ${phrases || words ? `Saved ${plural(phrases, 'phrase', 'phrases')} and ${plural(words, 'word', 'words')} to your vocab.` : 'Everything here was already in your vocab.'} They come back for review in a few days.</p>
    <div class="row">${nextL ? `<a class="btn primary" href="#lesson/${nextL.id}">${I.arrow}<span>Next: ${esc(nextL.title)}</span></a>` : ''}<a class="btn" href="#path">Back to path</a></div></section>`;
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
  detailView(c.tr, c.en, { card: c });
}

function wordView(text) {
  const k = P.clean(text);
  const card = store.card(cardId('word', text));
  const cw = COURSE_WORDS.find((w) => P.clean(w.tr) === k);
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

const ROUTES = { today: todayView, path: pathView, lesson: lessonView, review: reviewView, vocab: vocabView, item: itemView, word: wordView, pronounce: pronounceView, add: addView, settings: settingsView };
const TAB_OF = { today: 'today', review: 'today', path: 'path', lesson: 'path', vocab: 'vocab', item: 'vocab', add: 'vocab', word: 'pronounce', pronounce: 'pronounce', settings: '' };
let cleanup = null;
let current = '';

function render() {
  const [name, ...rest] = (location.hash.slice(1) || 'today').split('/');
  const route = ROUTES[name] ? name : 'today';
  const arg = decodeURIComponent(rest.join('/'));
  cleanup?.(); cleanup = null;
  S.stopListening();
  if (recorder) { recorder.stop(); recorder = null; }
  S.stopSpeaking();
  current = route;
  document.body.classList.toggle('focus', route === 'lesson' || route === 'review');
  $$('.tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === TAB_OF[route]));
  if (route !== 'lesson' && route !== 'review' && session?.finished) session = null;
  ROUTES[route](arg);
  if (route !== 'lesson' && route !== 'review') window.scrollTo(0, 0);
}

function shell() {
  $('#tabs').innerHTML = [['today', 'Today', I.today], ['path', 'Path', I.path], ['vocab', 'Vocab', I.vocab], ['pronounce', 'Pronounce', I.pron]]
    .map(([k, t, ic]) => `<a href="#${k}" data-tab="${k}">${ic}<span>${t}</span></a>`).join('');
  $('#settings-link').innerHTML = I.sliders;
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
  if (kind === 'meta' || kind === 'all') { S.setVoice(settings().voiceURI, settings().rate); S.setRecordedVoice(settings().recordedVoice); }
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
