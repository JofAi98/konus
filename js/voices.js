// The voices you can choose from in Settings, and how a phrase finds its audio file.
// Recorded voices are Microsoft neural voices, saved once as mp3 files in audio/<id>/.
import { trLower } from './pron.js';

export const VOICES = [
  { id: 'emel', name: 'Emel', native: true, full: true, about: 'Turkish, female. Natural and clear.' },
  { id: 'ava', name: 'Ava', native: false, full: false, about: 'Multilingual, female. Very expressive; may carry a slight foreign accent.' },
  { id: 'andrew', name: 'Andrew', native: false, full: false, about: 'Multilingual, male. Warm, conversational.' },
  { id: 'emma', name: 'Emma', native: false, full: false, about: 'Multilingual, female. Bright and clear.' },
  { id: 'brian', name: 'Brian', native: false, full: false, about: 'Multilingual, male. Relaxed and casual.' },
  { id: 'seraphina', name: 'Seraphina', native: false, full: false, about: 'Multilingual, female. Soft and smooth.' },
  { id: 'giuseppe', name: 'Giuseppe', native: false, full: false, about: 'Multilingual, male. An Italian voice speaking Turkish.' },
];

// Sentences every voice has, so you can compare them side by side.
export const SAMPLES = [
  'Merhaba, nasılsın?',
  'Seni çok seviyorum.',
  'Teşekkür ederim, çok lezzetli!',
  'Yavaş konuşur musun?',
  'Görüşürüz, iyi geceler.',
];

export const audioKey = (text) => trLower(text).replace(/[’'`]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

// FNV-1a over the UTF-8 bytes: a short, stable file name for each phrase.
export function audioHash(text) {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(audioKey(text))) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
