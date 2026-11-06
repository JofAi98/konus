// Spanish: everything the shared app needs to teach this language.
import * as P from './pron.js';
import { LESSONS, lessonById, COURSE_WORDS } from './course.js';
import { DRILLS, drillById } from './drills.js';
import { DIALOGUES, dialogueById, WHO } from './dialogues.js';
import { STORIES, storyById } from './stories.js';
import { THEMES, NEED, themeById, wordKey } from './themes.js';
import { TESTS, partTitle } from './tests.js';
import { RULES, ruleById } from './rules.js';

const VOICES = [
  { id: 'elvira', name: 'Elvira', native: true, full: true, about: 'Spain, female. Natural and clear.' },
  { id: 'alvaro', name: 'Álvaro', native: true, full: false, about: 'Spain, male. Warm and friendly.' },
  { id: 'ximena', name: 'Ximena', native: true, full: false, about: 'Spain, female. Lighter and younger.' },
];

// Sentences every voice has, so you can compare them side by side.
const SAMPLES = [
  '¡Hola! ¿Qué tal?',
  'Te echo de menos.',
  'Muchas gracias, está muy rico.',
  '¿Puedes hablar más despacio?',
  'Hasta luego, buenas noches.',
];

export default {
  id: 'es',
  other: 'tr',
  name: 'Spanish',
  tag: 'es',
  locale: 'es-ES',
  voiceRe: /^es/i,
  brand: 'Habla',
  flag: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>',
  storeKey: 'konus.es.v1',
  cloudPath: ['langs', 'es'],
  recPrefix: 'es|',
  backupSuffix: 'spanish-',
  defaultVoice: 'elvira',

  P, LESSONS, lessonById, COURSE_WORDS, DRILLS, drillById, DIALOGUES, dialogueById, WHO,
  STORIES, storyById, THEMES, NEED, themeById, wordKey, VOICES, SAMPLES,
  NEXT_RANK: { A2: [] },
  TESTS, partTitle, RULES, ruleById,

  seeds: [
    [1, '¡Hola!', 'Hello!', 'known'],
    [1, 'Muchas gracias.', 'Thank you very much.', 'known'],
  ],
  greet: (hour) => (hour < 14 ? 'Buenos días' : hour < 21 ? 'Buenas tardes' : 'Buenas noches'),
  praise: '¡Muy bien!',
  praiseWord: 'Muy bien',
  great: '¡Genial!',
  congrats: '¡Enhorabuena!',
  chinUp: '¡Ánimo, sigue!',
  rankNames: { A1: 'Principiante', A2: 'Elemental' },
  a2ThemesNote: '',
  // Theme words come with their article, but saying the bare word is right too.
  bare: (tr) => tr.replace(/^(?:el|la|los|las)\s+/i, ''),
  // Spanish changes the end of a word, so hablo, hablas and hablar count as one.
  knowsWord(known, w) {
    if (known.has(w)) return true;
    for (const k of known) {
      const m = Math.min(k.length, w.length);
      if (m < 4 || Math.abs(k.length - w.length) > 3) continue;
      let i = 0;
      while (i < m && k[i] === w[i]) i++;
      if (i >= Math.max(4, m - 2)) return true;
    }
    return false;
  },
  stressNote: (words) => (words.some((w) => P.CLITICS.has(P.clean(w)))
    ? 'Small words like el, de and que carry no stress: they lean on the next word.'
    : 'Words ending in a vowel, n or s stress the one but last syllable; others stress the last. A written accent overrides both.'),
  pron: {
    lede: 'Spanish is spelled almost exactly as it sounds, and most of it already sounds like Italian. Learn these few differences and you can read any word aloud. The real traps are the ones where your Italian eye sees a familiar letter.',
    lineExample: 'Muchas gracias',
    lineNote: 'It spells each sound the way you would read it in English, with Italian vowels. The highlighted syllable carries the stress. th is the "th" of "think", kh a rough breath from the throat.',
    rulesTitle: 'Stress in three rules',
    rules: (say) => [
      `<b>Words ending in a vowel, n or s stress the one but last syllable.</b> ${say('casa')}, ${say('hablan')}, ${say('zapatos')}.`,
      `<b>All other words stress the last syllable.</b> ${say('hablar')}, ${say('ciudad')}, ${say('español')}.`,
      `<b>A written accent overrides both, and tells you exactly where to lean.</b> ${say('café')}, ${say('también')}, ${say('árbol')}, ${say('teléfono')}. That is the only exception there is.`,
    ],
    rulesNote: 'One more for Italians: Spanish has almost no double letters. Only rr and ll are common, and neither is a long sound. Don\'t hold anything: <span lang="es">mamá</span>, <span lang="es">todo</span>, <span lang="es">pequeño</span>.',
  },
  add: {
    askExample: 'I can\'t wait to see you',
    answerExample: 'Tengo muchas ganas de verte | I can\'t wait to see you',
    handExample: 'Tengo muchas ganas de verte',
    handMeaning: 'I can\'t wait to see you',
  },
  settings: {
    spellNote: 'Turn it off to learn from sound only: you\'ll see just the sound line. Spanish spelling is so regular that reading comes almost free later.',
    deviceAbout: 'Built into this phone or computer (Mónica). Reads anything, sounds more robotic.',
    noDevice: 'No Spanish device voice found yet.',
    betterMac: 'System Settings, Accessibility, Spoken Content, System voice, Manage Voices. Find Spanish (Spain) and download Mónica (Enhanced).',
    betterPhone: 'Settings, Accessibility, Spoken Content, Voices, Spanish (Spain). Download Mónica (Enhanced).',
    voiceGroups: [
      ['Spain · whole course recorded', (v) => v.full],
      ['Spain · samples only', (v) => !v.full, 'If you like one of these better, ask Claude to record the whole course in it.'],
    ],
  },
  noVoice: 'No Spanish voice on this device. iPhone: Settings, Accessibility, Spoken Content, Voices, Spanish (Spain).',
};
