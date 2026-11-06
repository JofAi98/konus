// Prints every Spanish text the app can play, as JSON lines: {"hash": "...", "text": "..."}.
// Used by tools/make-audio.py to record the course. Run: node tools/audio-texts-es.mjs [samples]
import pack from '../js/es/pack.js';
import { audioHash } from '../js/voices.js';

const { P, LESSONS, COURSE_WORDS, DRILLS, DIALOGUES, STORIES, THEMES, SAMPLES, TESTS, RULES } = pack;
const NAME = 'Giosuè';
const fill = (s) => s.replaceAll('{name}', NAME);
const out = new Map();
const add = (t) => { const text = fill(t).trim(); if (!text) return; const h = audioHash(text, P.trLower); if (!out.has(h)) out.set(h, text); };

if (process.argv[2] === 'samples') {
  SAMPLES.forEach(add);
} else {
  SAMPLES.forEach(add);
  COURSE_WORDS.forEach((w) => add(w.tr));
  // Every sentence, every word in it, and every glossed word.
  const items = [
    ...LESSONS.flatMap((l) => l.items),
    ...DRILLS.flatMap((d) => [...d.items, ...d.table.map(([tr]) => ({ tr, words: [] }))]),
    ...DIALOGUES.flatMap((d) => d.lines),
    ...STORIES.flatMap((st) => st.lines),
    ...RULES.flatMap((r) => [...r.examples, ...r.table.map(([tr]) => ({ tr, words: [] }))]),
  ];
  for (const it of items) {
    add(it.tr);
    P.tokens(fill(it.tr)).forEach(add);
    it.words.forEach((w) => add(w.tr));
  }
  for (const t of THEMES) for (const w of t.words) { add(w.tr); P.tokens(w.tr).forEach(add); }
  P.SOUNDS.forEach((s) => add(s.ex));
  for (const q of Object.values(TESTS).flatMap((t) => t.sections.flatMap((s) => s.qs))) {
    for (const t of [q.say, q.tr].filter(Boolean)) { add(t); P.tokens(fill(t)).forEach(add); }
  }
  [pack.praise, pack.praiseWord, pack.great, pack.congrats, pack.chinUp, 'Buenos días', 'Buenas tardes', 'Buenas noches', 'Muchas gracias', 'casa', 'hablan', 'zapatos', 'hablar', 'ciudad', 'español', 'café', 'también', 'árbol', 'teléfono', '¡Hola!', 'Muchas gracias.'].forEach(add);
}
for (const [hash, text] of out) console.log(JSON.stringify({ hash, text }));
