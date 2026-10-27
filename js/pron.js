// Turkish is spelled the way it sounds, so syllables, stress and an easy
// respelling can all be computed from the written word.

const VOWELS = 'aeıioöuüâîû';
const FRONT = 'eiöüî';

export const trLower = (s) => String(s).toLocaleLowerCase('tr');
export const clean = (w) => trLower(w).replace(/[^a-zçğıöşüâîû]/g, '');
const isV = (c) => !!c && VOWELS.includes(c);

// Words whose stress is NOT on the last syllable (index from the start).
// Everything else follows the default rule: last syllable.
export const STRESS = {
  merhaba: 0, nasıl: 0, nasılsın: 0, nasılsınız: 0, evet: 0, hayır: 0, lütfen: 0,
  şimdi: 0, değil: 0, hoşça: 0, teyze: 0, amca: 0, olsun: 0, gelsin: 0, daha: 0,
  burası: 0, burada: 0, nerede: 0, neredesin: 0, nerelisin: 0, neden: 0, hangisi: 0,
  hadi: 0, bana: 0, bence: 0, açım: 0, türksün: 0, varsın: 0, yarın: 0, hafta: 0,
  lira: 0, türkçe: 0, türkçede: 0, türkiyeyi: 0, kartla: 0,
  iyiyim: 1, mutluyum: 1, yorgunum: 1, güzelsin: 1, seninle: 1, ederim: 1, dilerim: 1,
  günaydın: 1, italya: 1, italyada: 1, anlamadım: 1, yapalım: 1, gidelim: 1, istersin: 1,
  italyanım: 2, yapacaksın: 2, izleyelim: 2, birlikteyiz: 2,
  italyalıyım: 3, arayacağım: 3, heyecanlıyım: 3,
};

// Little words that lean on the word before them and carry no stress.
export const CLITICS = new Set([
  'mi', 'mı', 'mu', 'mü', 'misin', 'mısın', 'musun', 'müsün', 'miyim', 'mıyım', 'muyum', 'müyüm',
  'miyiz', 'mıyız', 'muyuz', 'müyüz', 'misiniz', 'mısınız', 'musunuz', 'müsünüz', 'de', 'da', 'ki',
]);

export function syllables(word) {
  const w = clean(word);
  const vi = [];
  for (let i = 0; i < w.length; i++) if (isV(w[i])) vi.push(i);
  if (vi.length <= 1) return w ? [w] : [];
  const cuts = [];
  for (let k = 0; k < vi.length - 1; k++) {
    const a = vi[k], b = vi[k + 1];
    cuts.push(b - a - 1 === 0 ? b : b - 1);
  }
  const out = [];
  let start = 0;
  for (const c of cuts) { out.push(w.slice(start, c)); start = c; }
  out.push(w.slice(start));
  return out;
}

export function stressIndex(word, syl = syllables(word)) {
  const w = clean(word);
  if (CLITICS.has(w)) return -1;
  if (w in STRESS) return Math.min(STRESS[w], syl.length - 1);
  // Present tense -iyor: stress falls on the vowel right before "yor".
  // If that vowel follows the negative "m", stress moves one syllable back.
  const m = w.match(/^(.*?)([ıiuü])yor/);
  if (m) {
    const pos = m[1].length;
    let acc = 0, idx = syl.length - 1;
    for (let i = 0; i < syl.length; i++) { if (pos < acc + syl[i].length) { idx = i; break; } acc += syl[i].length; }
    if (m[1].endsWith('m') && idx > 0) idx -= 1;
    return idx;
  }
  return syl.length - 1;
}

const MAP = { c: 'j', ç: 'ch', ş: 'sh', ı: 'ə', j: 'zh', â: 'a', î: 'i', û: 'u' };
const V2SAY = (v) => MAP[v] || v;

// Respell one word into English-and-Italian-friendly sounds, syllable by syllable.
export function respellWord(word) {
  const w = clean(word);
  const syl = syllables(w);
  const say = [];
  let gi = 0;
  for (const s of syl) {
    let out = '';
    for (let k = 0; k < s.length; k++, gi++) {
      const ch = w[gi];
      if (ch === 'ğ') {
        const prev = w[gi - 1] || '';
        const next = w[gi + 1] || '';
        if (prev && FRONT.includes(prev) && isV(next)) out += 'y';
        else if (isV(next)) out += '';
        else out += V2SAY(prev);
        continue;
      }
      out += V2SAY(ch);
    }
    say.push(out);
  }
  return { word: w, syl, say, stress: stressIndex(w, syl) };
}

const up = (s) => s.replace(/ə/g, 'Ə').toUpperCase();

export function respellText(text) {
  return tokens(text).map((t) => {
    const r = respellWord(t);
    return r.say.map((s, i) => (i === r.stress ? up(s) : s)).join('-');
  }).join(' ');
}

export const tokens = (text) => String(text).split(/\s+/).map((t) => t.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')).filter((t) => clean(t));

// What each special letter sounds like, compared with Italian.
export const SOUNDS = [
  { k: 'c', say: 'j', ex: 'can', exEn: 'soul, dear', tip: 'Like Italian "gi" in "giorno", or English "j" in "jam". "can" sounds like "jan".' },
  { k: 'ç', say: 'ch', ex: 'çay', exEn: 'tea', tip: 'Like Italian "ci" in "ciao", or English "ch" in "chat".' },
  { k: 'ş', say: 'sh', ex: 'şeker', exEn: 'sugar', tip: 'Like Italian "sc" in "scena", or English "sh" in "shop".' },
  { k: 'ı', say: 'ə', ex: 'kız', exEn: 'girl', tip: 'No Italian equivalent. Say "i", then pull your tongue back and relax your lips. Close to the "e" in English "the". Written ə in the sound line.' },
  { k: 'ö', say: 'ö', ex: 'göz', exEn: 'eye', tip: 'Say "e" while rounding your lips, as in French "peu" or the "ö" of Lombard and Piedmontese.' },
  { k: 'ü', say: 'ü', ex: 'gül', exEn: 'rose', tip: 'Say "i" while rounding your lips, as in French "tu" or Lombard "ü".' },
  { k: 'ğ', say: '—', ex: 'dağ', exEn: 'mountain', tip: 'Silent. It stretches the vowel before it: "dağ" is "daa". Between e and i it becomes a light "y": "değil" is "deyil".' },
  { k: 'h', say: 'h', ex: 'hayır', exEn: 'no', tip: 'Always pronounced, with breath, as in English "hello". Italians tend to drop it. Push the air out.' },
  { k: 'g', say: 'g', ex: 'gel', exEn: 'come', tip: 'Always hard, as in "gatto", even before e and i. "gel" sounds like Italian "ghel".' },
  { k: 'k', say: 'k', ex: 'kedi', exEn: 'cat', tip: 'Always hard. "kedi" sounds like Italian "chedi".' },
  { k: 's', say: 's', ex: 'su', exEn: 'water', tip: 'Always a sharp "s" as in "sole", never the buzzing "s" of "rosa".' },
  { k: 'z', say: 'z', ex: 'göz', exEn: 'eye', tip: 'The buzzing "s" of Italian "rosa". Never the "ts" of "pizza".' },
  { k: 'y', say: 'y', ex: 'yok', exEn: 'there isn\'t', tip: 'Like Italian "i" in "ieri". "yok" sounds like "iok".' },
  { k: 'j', say: 'zh', ex: 'jilet', exEn: 'razor blade', tip: 'Like French "j" in "journal". Rare, mostly in borrowed words.' },
  { k: 'r', say: 'r', ex: 'bir', exEn: 'one', tip: 'Tapped like the Italian r. At the end of a word it goes soft, almost whispered.' },
  { k: 'v', say: 'v', ex: 'evet', exEn: 'yes', tip: 'A soft v. Between vowels it can drift towards a "w".' },
  { k: '2x', say: 'kk', ex: 'teşekkür', exEn: 'thanks', tip: 'Double letters are held longer, exactly like Italian "notte" or "ecco". This one is your advantage.' },
];

// On a word's own page, only the sounds that differ from Italian are worth a note.
const WATCH = new Set(['c', 'ç', 'ş', 'ı', 'ö', 'ü', 'ğ', 'h', 'j']);

export function soundTips(word) {
  const w = clean(word);
  const tips = SOUNDS.filter((s) => WATCH.has(s.k) && w.includes(s.k));
  const doubled = [...w].some((c, i) => i > 0 && c === w[i - 1] && !isV(c));
  if (doubled) tips.push(SOUNDS.find((s) => s.k === '2x'));
  return tips;
}
