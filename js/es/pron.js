// Spanish is spelled almost exactly as it sounds, and its written accents mark the stress,
// so syllables, stress and an easy respelling can all be computed from the written word.
// The sound line follows the voice you hear: Spain's Spanish, where z and soft c are "th".

const VOWELS = 'aeiouáéíóúü';
const STRONG = 'aeoáéó';
const CLUSTER = /^(?:[pbcgf][lr]|[td]r)$/; // these two consonants stay together: pa-dre, ha-blar

export const trLower = (s) => String(s).toLocaleLowerCase('es');
export const clean = (w) => trLower(w).replace(/[^a-záéíóúüñè]/g, '');
const isV = (c) => !!c && VOWELS.includes(c);
const soft = (c) => !!c && 'eiéí'.includes(c);

// What the speech check treats as the same word. Accents, h, b and v, and ll and y all sound
// alike, so a recogniser may write either one.
export const fold = (w) => w.replace(/[áéíóúü]/g, (c) => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u' }[c]))
  .replace(/v/g, 'b').replace(/ll/g, 'y').replace(/(^|[^c])h/g, '$1');

// Little words that lean on the next one and carry no stress.
export const CLITICS = new Set([
  'el', 'la', 'los', 'las', 'lo', 'de', 'del', 'a', 'al', 'en', 'con', 'por', 'y', 'e', 'o', 'u', 'que', 'si',
  'se', 'me', 'te', 'nos', 'os', 'le', 'les', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'sin', 'ni', 'un',
]);

// Your own name keeps its Italian sound inside Spanish sentences.
const OWN = { giosuè: { syl: ['gio', 'suè'], say: ['jo', 'zwe'], stress: 1 } };
const SAY_ONLY = { méxico: ['me', 'khi', 'ko'] }; // spelled with x, said with j

// Letters and letter pairs that make one sound.
function units(w) {
  const out = [];
  for (let i = 0; i < w.length; i++) {
    const c = w[i], n = w[i + 1];
    if (c === 'c' && n === 'h') { out.push('ch'); i++; }
    else if (c === 'l' && n === 'l') { out.push('ll'); i++; }
    else if (c === 'r' && n === 'r') { out.push('rr'); i++; }
    else if ((c === 'q' || c === 'g') && n === 'u' && soft(w[i + 2])) { out.push(c + 'u'); i++; }
    else out.push(c);
  }
  return out;
}

// y is a vowel at the end of a word and on its own: hoy, muy, y.
const asVowel = (u, i, all) => isV(u) || (u === 'y' && (i === all.length - 1 || !isV(all[i + 1])));
const weakAccent = (u) => u === 'í' || u === 'ú';

export function syllables(word) {
  const w = clean(word);
  if (OWN[w]) return OWN[w].syl;
  const all = units(w);
  // Each nucleus is a run of vowels that stay together. Two strong vowels split (te-a-tro),
  // and so does an accented i or u beside a strong one (dí-a); other pairs are one beat (bien).
  const nuclei = [];
  let k = 0;
  while (k < all.length) {
    if (!asVowel(all[k], k, all)) { k++; continue; }
    let start = k, end = k + 1;
    while (end < all.length && asVowel(all[end], end, all)) {
      const a = all[end - 1], b = all[end];
      const strongPair = STRONG.includes(a) && STRONG.includes(b);
      if (strongPair || weakAccent(a) || weakAccent(b)) { nuclei.push([start, end]); start = end; }
      end++;
    }
    nuclei.push([start, end]);
    k = end;
  }
  if (nuclei.length <= 1) return w ? [w] : [];
  const out = [];
  let from = 0;
  for (let n = 0; n < nuclei.length - 1; n++) {
    const gap = all.slice(nuclei[n][1], nuclei[n + 1][0]);
    let keep; // how many of the consonants between two vowels stay with the first
    if (gap.length <= 1) keep = 0;
    else if (gap.length === 2) keep = CLUSTER.test(gap.join('')) ? 0 : 1;
    else if (gap.length === 3) keep = CLUSTER.test(gap.slice(1).join('')) ? 1 : 2;
    else keep = 2;
    const cut = nuclei[n][1] + keep;
    out.push(all.slice(from, cut).join(''));
    from = cut;
  }
  out.push(all.slice(from).join(''));
  return out;
}

export function stressIndex(word, syl = syllables(word)) {
  const w = clean(word);
  if (OWN[w]) return OWN[w].stress;
  if (CLITICS.has(w)) return -1;
  const marked = syl.findIndex((s) => /[áéíóú]/.test(s));
  if (marked >= 0) return marked;
  if (syl.length < 2) return 0;
  return /[aeiouns]$/.test(w) ? syl.length - 2 : syl.length - 1;
}

const PLAIN = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u' };

// What one spelling unit sounds like, given its neighbours in the word. key is its entry in SOUNDS.
function soundOf(u, prev, next, first) {
  switch (u) {
    case 'ch': return ['ch', ''];
    case 'll': return ['y', 'll'];
    case 'rr': return ['rr', 'rr'];
    case 'qu': return ['k', 'qu'];
    case 'gu': return ['g' + 'h', 'gu'];
    case 'b': return ['b', ''];
    case 'v': return ['b', 'v'];
    case 'c': return soft(next?.[0]) ? ['th', 'ce, ci'] : ['k', ''];
    case 'z': return ['th', 'z'];
    case 'g': return soft(next?.[0]) ? ['kh', 'ge, gi'] : ['g', ''];
    case 'j': return ['kh', 'j'];
    case 'h': return ['', 'h'];
    case 'ñ': return ['ny', 'ñ'];
    case 'r': return first || 'nls'.includes(prev || '-') ? ['rr', 'rr'] : ['r', ''];
    case 's': return isV(prev?.slice(-1)) && isV(next?.[0]) ? ['s', 's'] : ['s', '']; // the place Italians buzz it
    case 'x': return ['ks', 'x'];
    case 'y': return isV(next?.[0]) ? ['y', 'y'] : ['i', ''];
    case 'd': return ['d', ''];
    case 'i': return isV(next?.[0]) && !STRONG.includes(prev?.slice(-1) || '-') ? ['y', ''] : ['i', ''];
    case 'u': return isV(next?.[0]) && !STRONG.includes(prev?.slice(-1) || '-') ? ['w', ''] : ['u', ''];
    case 'ü': return ['w', 'gü'];
    default: return [PLAIN[u] || u, ''];
  }
}

// A word letter by letter, grouped in syllables. Each entry: the spelling, its sound, and
// k, its entry in SOUNDS when it has one; st marks the stressed syllable.
export function spellOut(word) {
  const w = clean(word);
  const syl = syllables(w);
  const stress = stressIndex(w, syl);
  if (OWN[w]) return syl.map((s, n) => [{ c: s, k: s, say: OWN[w].say[n], st: n === stress, watch: false }]);
  const all = units(w);
  let i = 0;
  return syl.map((s, n) => {
    const parts = [];
    let len = 0;
    while (len < s.length) {
      const u = all[i];
      const heard = i < all.length - 1 && u === 'i' && !isV(all[i + 1]) ? ['i', ''] : soundOf(u, all[i - 1], all[i + 1], i === 0);
      // A vowel split from its neighbour keeps its full sound: dí-a, ma-rí-a.
      const closes = isV(u) && 'iu'.includes(u) && len + u.length === s.length;
      const [say, k] = closes && !'ü'.includes(u) ? [u, ''] : heard;
      parts.push({ c: u, k: k || u, say, st: n === stress && stress >= 0, watch: WATCH.has(k) });
      len += u.length;
      i++;
    }
    return parts;
  });
}

// Respell one word into English-and-Italian-friendly sounds, syllable by syllable.
export function respellWord(word) {
  const w = clean(word);
  if (OWN[w]) return { word: w, ...OWN[w] };
  const syl = syllables(w);
  const say = SAY_ONLY[w] || spellOut(w).map((parts) => parts.map((p) => p.say).join(''));
  return { word: w, syl, say, stress: stressIndex(w, syl) };
}

export function respellText(text) {
  return tokens(text).map((t) => {
    const r = respellWord(t);
    return r.say.map((s, i) => (i === r.stress ? s.toUpperCase() : s)).join('-');
  }).join(' ');
}

export const tokens = (text) => String(text).split(/\s+/).map((t) => t.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')).filter((t) => clean(t));

// The sounds that differ from Italian, or that an Italian eye misreads.
export const SOUNDS = [
  { k: 'j', say: 'kh', ex: 'jamón', exEn: 'ham', tip: 'A rough breath from the back of the throat, like clearing it gently, or German "Bach". Italian has no such sound: "h" of "hotel" said harder gets you close.' },
  { k: 'ge, gi', say: 'kh', ex: 'gente', exEn: 'people', tip: 'Before e and i, g is the same rough sound as j. "gente" is "KHEN-te", never the "gente" of Italian.' },
  { k: 'gu', say: 'gh', ex: 'guerra', exEn: 'war', tip: 'Before e and i, the u is silent, exactly like Italian "gh": "guerra" is "GHE-rra". To hear the u, Spanish writes ü: "vergüenza".' },
  { k: 'gü', say: 'gw', ex: 'vergüenza', exEn: 'shame', tip: 'The two dots switch the u back on: "gw". They appear only in güe and güi.' },
  { k: 'ce, ci', say: 'th', ex: 'gracias', exEn: 'thank you', tip: 'In Spain, before e and i, c is the "th" of English "think": tongue between the teeth. Never the Italian "ci" of "ciao". Most of Latin America says "s" here.' },
  { k: 'z', say: 'th', ex: 'zapato', exEn: 'shoe', tip: 'The same "th" of "think", before any vowel. Never the "ts" of "pizza" or the buzz of "zero".' },
  { k: 'qu', say: 'k', ex: 'queso', exEn: 'cheese', tip: 'Just "k": the u is silent. "queso" is "KE-so", "quien" is "kyen". Italian "qu" has a "w" in it, Spanish doesn\'t.' },
  { k: 'h', say: '—', ex: 'hola', exEn: 'hello', tip: 'Always silent, as in Italian "ho". "ch" is the only exception, and that is its own sound.' },
  { k: 'v', say: 'b', ex: 'vino', exEn: 'wine', tip: 'Spanish has no v sound. b and v are the same soft "b", with the lips barely touching: "vino" is "BI-no". Your Italian lips will want a v. Don\'t let them.' },
  { k: 'll', say: 'y', ex: 'calle', exEn: 'street', tip: 'Like Italian "i" in "ieri": "calle" is "KA-ye". Never the "gl" of "figlio", and never a long l.' },
  { k: 'y', say: 'y', ex: 'yo', exEn: 'I', tip: 'Before a vowel, the same sound as ll, a little firmer than Italian "i". On its own or at the end of a word it is a plain "i": "y", "hoy".' },
  { k: 'ñ', say: 'ny', ex: 'España', exEn: 'Spain', tip: 'Exactly Italian "gn" in "bagno". "año" sounds like "agno".' },
  { k: 'rr', say: 'rr', ex: 'perro', exEn: 'dog', tip: 'A strong rolled r, like Italian "rr" in "carro". A single r sounds this way too at the start of a word: "rojo".' },
  { k: 's', say: 's', ex: 'casa', exEn: 'house', tip: 'Always the sharp s of "sole", even between vowels. Italian "casa" with a buzz sounds foreign: Spanish "casa" has none.' },
  { k: 'x', say: 'ks', ex: 'taxi', exEn: 'taxi', tip: 'Between vowels it is "ks". At the start of a word, a plain "s". In México it is the rough j sound.' },
];

// On a word's own page, only the sounds that differ from Italian are worth a note.
export const WATCH_LETTERS = ['j', 'ge, gi', 'gu', 'gü', 'ce, ci', 'z', 'qu', 'h', 'v', 'll', 'ñ', 'rr', 's', 'x'];
const WATCH = new Set(WATCH_LETTERS);

export function soundTips(word) {
  const keys = new Set(spellOut(word).flat().filter((x) => x.watch).map((x) => x.k));
  return SOUNDS.filter((s) => keys.has(s.k));
}

// A dropped letter: only a lost rr has a tip worth showing in Spanish.
export const heldKey = (c) => (c === 'r' ? 'rr' : '');
