// Turkish: everything the shared app needs to teach this language.
import * as P from './pron.js';
import { LESSONS, lessonById, COURSE_WORDS } from './course.js';
import { DRILLS, drillById } from './drills.js';
import { DIALOGUES, dialogueById, WHO } from './dialogues.js';
import { STORIES, storyById } from './stories.js';
import { THEMES, NEED, themeById, wordKey } from './themes.js';
import { VOICES, SAMPLES } from './voices.js';

// What the next rank holds, shown locked until its exam is passed.
const NEXT_RANK = {
  A2: [
    { kind: 'drill', title: 'Habits: -ir and -er', sub: 'I usually drink tea. Do you smoke?' },
    { kind: 'drill', title: 'The object: -i', sub: 'The film, the book, her mother: when Turkish marks "the"' },
    { kind: 'drill', title: 'With: -le', sub: 'With you, by bus, coffee with milk' },
    { kind: 'drill', title: 'More and most: daha, en', sub: 'Better, the best, the most beautiful' },
    { kind: 'drill', title: 'Must and need: -meli, lazım', sub: 'I have to go, you should rest' },
    { kind: 'drill', title: 'Was and were: -di after nouns', sub: 'I was at home, it was cold' },
    { kind: 'drill', title: 'If: -se', sub: 'If you come, if it rains' },
    { kind: 'drill', title: 'When and while: -ince, -ken', sub: 'When I arrive, while I was cooking' },
    { kind: 'drill', title: 'They say: -miş', sub: 'Things you heard but didn\'t see' },
    { kind: 'dialogue', title: 'At the doctor', sub: 'Say what hurts and understand the answer' },
    { kind: 'dialogue', title: 'On the phone with her grandmother', sub: 'No face to help you: only your ears' },
    { kind: 'dialogue', title: 'A small argument', sub: 'Disagree kindly, then make up' },
    { kind: 'story', title: 'Bayram', sub: 'A holiday visit to the whole family' },
    { kind: 'lesson', title: 'Feelings and opinions', sub: 'I think, I feel, I\'m not sure' },
    { kind: 'lesson', title: 'Home and family words', sub: 'Every relative has its own name in Turkish' },
  ],
};

export default {
  id: 'tr',
  name: 'Turkish',
  tag: 'tr', // the html lang attribute
  locale: 'tr-TR', // speech recognition and the device voice
  voiceRe: /^tr/i,
  brand: 'Konuş',
  storeKey: 'konus.v1',
  cloudPath: [], // where this language lives under your account
  recPrefix: '', // keeps recordings of look-alike words apart
  backupSuffix: '',
  defaultVoice: 'emel',

  P, LESSONS, lessonById, COURSE_WORDS, DRILLS, drillById, DIALOGUES, dialogueById, WHO,
  STORIES, storyById, THEMES, NEED, themeById, wordKey, VOICES, SAMPLES, NEXT_RANK,

  seeds: [
    [1, 'Merhaba!', 'Hello!', 'known'],
    [1, 'Seni seviyorum.', 'I love you.', 'known'],
    [2, 'Konuş!', 'Speak! Talk! (and the name of this app)', 'mine'],
  ],
  greet: (hour) => (hour < 11 ? 'Günaydın' : hour < 18 ? 'Merhaba' : 'İyi akşamlar'),
  praise: 'Aferin!', // said aloud when you finish something
  praiseWord: 'Aferin',
  great: 'Harika!',
  congrats: 'Tebrikler!',
  chinUp: 'Olsun, devam!',
  rankNames: { A1: 'Başlangıç', A2: 'Temel' },
  a2ThemesNote: 'A2 themes (travel, health, the home in detail, opinions) open with rank D.',
  // Turkish stacks endings on a root, so a word counts as known when you know its root:
  // "telefon" covers "telefonumu", "gel" covers "gelelim".
  knowsWord(known, w) {
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
  },
  stressNote: (words) => (words.some((w) => P.CLITICS.has(P.clean(w)))
    ? 'Small question words like mi and mı carry no stress: your voice rises on the word just before them.'
    : 'Most Turkish words stress the last syllable.'),
  pron: {
    lede: 'Turkish is written exactly as it sounds. Learn these sounds once and you can say any word, even one you have never seen. Most of them already exist in Italian.',
    lineExample: 'Teşekkür ederim',
    lineNote: 'It spells each sound the way you would read it in English, with Italian vowels. The highlighted syllable carries the stress. ə stands for the Turkish ı.',
    rulesTitle: 'Stress in three rules',
    rules: (say) => [
      `<b>Most words stress the last syllable.</b> ${say('güzel')}, ${say('teşekkürler')}. Adding endings moves the stress along: ${say('akşam')}, ${say('akşamlar')}.`,
      `<b>In "-iyor" verbs, the vowel before "yor" is stressed.</b> ${say('seviyorum')}. With "not" (-m-), it moves one step back: ${say('anlamıyorum')}.`,
      `<b>Question words mi, mı, mu, mü are never stressed.</b> Your voice rises on the word before them: ${say('Hazır mısın')}.`,
    ],
    rulesNote: 'Common exceptions, like <span lang="tr">merhaba</span>, <span lang="tr">nasıl</span> and place names, are marked correctly in every sound line.',
  },
  add: {
    askExample: 'I can\'t wait to see you',
    answerExample: 'Seni görmek için sabırsızlanıyorum | I can\'t wait to see you',
    handExample: 'Seni çok seviyorum',
    handMeaning: 'I love you very much',
  },
  settings: {
    spellNote: 'Turn it off to learn from sound only: you\'ll see just the sound line. Turkish spelling is so regular that reading comes almost free later.',
    deviceAbout: 'Built into this phone or computer (Yelda). Reads anything, sounds more robotic.',
    noDevice: 'No Turkish device voice found yet.',
    betterMac: 'System Settings, Accessibility, Spoken Content, System voice, Manage Voices. Find Turkish and download Yelda (Enhanced).',
    betterPhone: 'Settings, Accessibility, Spoken Content, Voices, Turkish. Download Yelda (Enhanced).',
    voiceGroups: [
      ['Native Turkish · whole course recorded', (v) => v.native],
      ['Multilingual · samples only', (v) => !v.native, 'These speak Turkish as a second language. If you like one, ask Claude to record the whole course in it.'],
    ],
  },
  noVoice: 'No Turkish voice on this device. iPhone: Settings, Accessibility, Spoken Content, Voices, Turkish.',
};
