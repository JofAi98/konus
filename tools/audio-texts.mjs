// Prints every Turkish text the app can play, as JSON lines: {"hash": "...", "text": "..."}.
// Used by tools/make-audio.py to record the course. Run: node tools/audio-texts.mjs [samples]
import { LESSONS, COURSE_WORDS } from '../js/course.js';
import { SOUNDS, tokens } from '../js/pron.js';
import { SAMPLES, audioHash } from '../js/voices.js';
import { DRILLS } from '../js/drills.js';
import { DIALOGUES } from '../js/dialogues.js';
import { STORIES } from '../js/stories.js';

const NAME = 'Giosuè';
const fill = (s) => s.replaceAll('{name}', NAME);
const out = new Map();
const add = (t) => { const text = fill(t).trim(); if (!text) return; const h = audioHash(text); if (!out.has(h)) out.set(h, text); };

if (process.argv[2] === 'samples') {
  SAMPLES.forEach(add);
} else {
  SAMPLES.forEach(add);
  for (const l of LESSONS) {
    for (const it of l.items) {
      add(it.tr);
      tokens(fill(it.tr)).forEach(add);
      it.words.forEach((w) => add(w.tr));
    }
  }
  COURSE_WORDS.forEach((w) => add(w.tr));
  // Build drills, dialogues and stories: every sentence, every word in it, and every glossed word.
  const items = [
    ...DRILLS.flatMap((d) => [...d.items, ...d.table.map(([tr]) => ({ tr, words: [] }))]),
    ...DIALOGUES.flatMap((d) => d.lines),
    ...STORIES.flatMap((st) => st.lines),
  ];
  for (const it of items) {
    add(it.tr);
    tokens(fill(it.tr)).forEach(add);
    it.words.forEach((w) => add(w.tr));
  }
  ['Aferin', 'Harika'].forEach(add);
  SOUNDS.forEach((s) => add(s.ex));
  ['Günaydın', 'Merhaba', 'İyi akşamlar', 'Aferin', 'Merhaba, nasılsın?', 'Teşekkür ederim', 'güzel', 'teşekkürler', 'akşam', 'akşamlar', 'seviyorum', 'anlamıyorum', 'Hazır mısın', 'Merhaba!', 'Seni seviyorum.'].forEach(add);
}
for (const [hash, text] of out) console.log(JSON.stringify({ hash, text }));
