// The language you're learning right now. Each language is a pack: its course, its sounds,
// its voices and the words the app says in it. Everything else in the app is shared and reads
// the active pack through the live bindings below, so switching needs no reload.
import turkish from './tr-pack.js';
import spanish from './es/pack.js';

export const PACKS = { tr: turkish, es: spanish };
const KEY = 'konus.lang';

export let L, P, LESSONS, lessonById, COURSE_WORDS, DRILLS, drillById, DIALOGUES, dialogueById, WHO,
  STORIES, storyById, THEMES, NEED, themeById, wordKey, VOICES, SAMPLES, NEXT_RANK;

export function useLang(id) {
  L = PACKS[id] || turkish;
  ({ P, LESSONS, lessonById, COURSE_WORDS, DRILLS, drillById, DIALOGUES, dialogueById, WHO,
    STORIES, storyById, THEMES, NEED, themeById, wordKey, VOICES, SAMPLES, NEXT_RANK } = L);
  try { localStorage.setItem(KEY, L.id); } catch { /* private window: stays on this language for now */ }
}

useLang((() => { try { return localStorage.getItem(KEY); } catch { return null; } })());
