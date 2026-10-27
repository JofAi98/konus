// Listening (text to speech), checking (speech recognition) and recording.
import { trLower, SOUNDS } from './pron.js';

/* ---------- Turkish voice ---------- */

let voices = [];
let preferredURI = '';
let rate = 0.9;

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices().filter((v) => /^tr/i.test(v.lang));
}
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

export const canSpeak = () => 'speechSynthesis' in window;
export const turkishVoices = () => { loadVoices(); return voices; };
export function setVoice(uri, r) { preferredURI = uri || ''; if (r) rate = r; }

function pickVoice() {
  loadVoices();
  if (preferredURI) { const v = voices.find((x) => x.voiceURI === preferredURI); if (v) return v; }
  const score = (v) => (/premium|enhanced|natural|neural/i.test(v.name) ? 3 : 0) + (/google/i.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0);
  return [...voices].sort((a, b) => score(b) - score(a))[0] || null;
}

export function speak(text, { slow = false } = {}) {
  return new Promise((resolve) => {
    if (!canSpeak() || !text) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR';
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = slow ? Math.max(0.45, rate * 0.62) : rate;
    u.onend = u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

/* ---------- Speech recognition ---------- */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = () => !!SR;

let active = null;

export function listen({ onInterim } = {}) {
  if (!SR) return Promise.reject(new Error('unsupported'));
  if (active) { try { active.abort(); } catch { /* already stopped */ } }
  return new Promise((resolve, reject) => {
    const rec = new SR();
    active = rec;
    rec.lang = 'tr-TR';
    rec.interimResults = true;
    rec.maxAlternatives = 5;
    rec.continuous = false;
    let finals = [];
    rec.onresult = (e) => {
      const res = e.results[e.results.length - 1];
      if (res.isFinal) {
        finals = [];
        for (let i = 0; i < res.length; i++) finals.push({ text: res[i].transcript, conf: res[i].confidence });
      } else if (onInterim) onInterim(res[0].transcript);
    };
    rec.onerror = (e) => { active = null; if (e.error === 'no-speech' || e.error === 'aborted') resolve([]); else reject(new Error(e.error)); };
    rec.onend = () => { active = null; resolve(finals); };
    try { rec.start(); } catch (err) { active = null; reject(err); }
  });
}

export function stopListening() { if (active) { try { active.stop(); } catch { /* already stopped */ } } }

/* ---------- Comparing what it heard with what you meant ---------- */

const ONES = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
function numToTr(n) {
  if (n < 10) return ONES[n];
  if (n < 100) return [TENS[Math.floor(n / 10)], n % 10 ? ONES[n % 10] : ''].filter(Boolean).join(' ');
  if (n < 1000) { const h = Math.floor(n / 100); return [h > 1 ? ONES[h] : '', 'yüz', n % 100 ? numToTr(n % 100) : ''].filter(Boolean).join(' '); }
  if (n < 10000) { const t = Math.floor(n / 1000); return [t > 1 ? ONES[t] : '', 'bin', n % 1000 ? numToTr(n % 1000) : ''].filter(Boolean).join(' '); }
  return String(n);
}

export function normWords(s) {
  return trLower(s).replace(/[’'`]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
    .flatMap((t) => (/^\d+$/.test(t) ? numToTr(+t).split(' ') : [t]));
}

function lev(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d;
}
const sim = (a, b) => (a === b ? 1 : 1 - lev(a, b)[a.length][b.length] / Math.max(a.length, b.length, 1));

function alignWords(target, heard) {
  const n = target.length, m = heard.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const bt = Array.from({ length: n + 1 }, () => Array(m + 1).fill(''));
  for (let i = 1; i <= n; i++) { dp[i][0] = i; bt[i][0] = 'skipT'; }
  for (let j = 1; j <= m; j++) { dp[0][j] = j * 0.5; bt[0][j] = 'skipH'; }
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const s = sim(target[i - 1], heard[j - 1]);
    const opts = [[dp[i - 1][j - 1] + (1 - s), 'match'], [dp[i - 1][j] + 1, 'skipT'], [dp[i][j - 1] + 0.5, 'skipH']];
    opts.sort((a, b) => a[0] - b[0]);
    [dp[i][j], bt[i][j]] = opts[0];
  }
  const out = target.map((w) => ({ word: w, heard: '', score: 0 }));
  let i = n, j = m;
  while (i > 0 || j > 0) {
    const op = bt[i][j];
    if (op === 'match') { out[i - 1].heard = heard[j - 1]; out[i - 1].score = sim(target[i - 1], heard[j - 1]); i--; j--; }
    else if (op === 'skipT') i--;
    else j--;
  }
  return out;
}

// Turkish is spelled as it sounds, so a letter swap is a sound swap.
const PAIRS = { 'ş>s': 'ş', 'ç>c': 'ç', 'ç>s': 'ç', 'c>ç': 'c', 'ı>i': 'ı', 'i>ı': 'ı', 'ö>o': 'ö', 'ü>u': 'ü', 'ö>e': 'ö', 'ü>i': 'ü', 'u>ü': 'ü', 'o>ö': 'ö', 'z>s': 'z', 's>z': 's', 'k>g': 'k', 'g>k': 'g' };
const tipFor = (k) => SOUNDS.find((s) => s.k === k)?.tip;

function soundHints(target, heard) {
  if (!heard || target === heard) return [];
  const d = lev(target, heard);
  const hints = [];
  let i = target.length, j = heard.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && target[i - 1] === heard[j - 1] && d[i][j] === d[i - 1][j - 1]) { i--; j--; continue; }
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) {
      const key = `${target[i - 1]}>${heard[j - 1]}`;
      if (PAIRS[key]) hints.push({ expect: target[i - 1], got: heard[j - 1], tip: tipFor(PAIRS[key]) });
      i--; j--; continue;
    }
    if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      const c = target[i - 1];
      if (c === 'h') hints.push({ expect: 'h', got: '', tip: tipFor('h') });
      else if (target[i - 2] === c || target[i] === c) hints.push({ expect: c + c, got: c, tip: tipFor('2x') });
      i--; continue;
    }
    j--;
  }
  return hints.reverse();
}

export function compare(targetText, alternatives, { skip = [] } = {}) {
  const target = normWords(targetText);
  const skipSet = new Set(skip.flatMap((s) => normWords(s)));
  let best = null;
  for (const alt of alternatives) {
    const heard = normWords(alt.text);
    const words = alignWords(target, heard).map((w) => {
      const score = skipSet.has(w.word) ? 1 : w.score;
      const status = score >= 0.99 ? 'ok' : score >= 0.6 ? 'close' : 'miss';
      return { ...w, score, status, hints: status === 'close' ? soundHints(w.word, w.heard) : [] };
    });
    const score = words.length ? words.reduce((a, w) => a + w.score, 0) / words.length : 0;
    if (!best || score > best.score) best = { score, words, heardText: alt.text };
  }
  return best || { score: 0, words: target.map((w) => ({ word: w, heard: '', score: 0, status: 'miss', hints: [] })), heardText: '' };
}

export const suggestGrade = (score) => (score >= 0.95 ? 3 : score >= 0.75 ? 2 : 1);

/* ---------- Recording yourself ---------- */

export const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const mr = new MediaRecorder(stream);
  const chunks = [];
  mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  mr.start();
  return {
    stop: () => new Promise((resolve) => {
      mr.onstop = () => { stream.getTracks().forEach((t) => t.stop()); resolve(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })); };
      mr.stop();
    }),
  };
}

export function playBlob(blob) {
  return new Promise((resolve) => {
    const a = new Audio(URL.createObjectURL(blob));
    a.onended = a.onerror = () => { URL.revokeObjectURL(a.src); resolve(); };
    a.play().catch(() => resolve());
  });
}

export async function drawWave(blob, canvas) {
  const ctx = canvas.getContext('2d');
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = new AC();
  try {
    const buf = await ac.decodeAudioData(await blob.arrayBuffer());
    const data = buf.getChannelData(0);
    const w = canvas.width = canvas.clientWidth * devicePixelRatio;
    const h = canvas.height = canvas.clientHeight * devicePixelRatio;
    const step = Math.max(1, Math.floor(data.length / (w / (3 * devicePixelRatio))));
    const color = getComputedStyle(canvas).color;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    const bar = 2 * devicePixelRatio, gap = devicePixelRatio;
    let x = 0;
    for (let i = 0; i < data.length && x < w; i += step) {
      let peak = 0;
      for (let k = i; k < i + step && k < data.length; k++) peak = Math.max(peak, Math.abs(data[k]));
      const bh = Math.max(bar, peak * h * 0.95);
      ctx.fillRect(x, (h - bh) / 2, bar, bh);
      x += bar + gap;
    }
  } catch { /* undecodable recording: leave the canvas empty */ }
  ac.close?.();
}
