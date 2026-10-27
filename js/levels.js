// Levels and ranks. Practice earns XP; each level needs a little more than the last.
// About 100 XP a day (15 to 20 minutes) reaches level 20 in a month.
// Ranks follow the European levels (A1 to C2). Inside A1, levels open things one by one.
// From A2 on, passing the rank exam opens everything in the new rank at once.
import { LESSONS } from './course.js';
import { DRILLS } from './drills.js';
import { DIALOGUES } from './dialogues.js';
import { STORIES } from './stories.js';

export const XP = {
  lesson: 30, drill: 30, dialogue: 25, story: 20, again: 10,
  review: 2, spoken: 1, clear: 1, answer: 2, listen: 5, daily: 10, exam: 100,
};
export const DAILY_GOAL = 100;

const A = 36;
export const xpForLevel = (level) => Math.round(A * Math.max(0, level - 1) ** 1.5);
export function levelFor(xp) {
  let L = 1;
  while (xpForLevel(L + 1) <= xp) L++;
  return L;
}

export const RANKS = [
  { id: 'A1', name: 'Beginner', tr: 'Başlangıç', examAt: 30 },
  { id: 'A2', name: 'Elementary', tr: 'Temel', examAt: 60 },
  { id: 'B1', name: 'Intermediate', tr: 'Orta', examAt: 100 },
  { id: 'B2', name: 'Upper intermediate', tr: 'Orta üstü', examAt: 150 },
  { id: 'C1', name: 'Advanced', tr: 'İleri', examAt: 200 },
  { id: 'C2', name: 'Mastery', tr: 'Ustalık', examAt: null },
];
export const rankIndex = (id) => RANKS.findIndex((r) => r.id === id);

// Reached ranks are kept in progress as "rank:A2" and so on.
export function rankOf(progress) {
  let r = RANKS[0];
  for (const next of RANKS.slice(1)) {
    if (progress['rank:' + next.id]) r = next;
    else break;
  }
  return r;
}

export const totalXP = (stats) => Object.values(stats.days || {}).reduce((sum, d) => sum + (d.xp || 0), 0);

// Abilities that open with a level rather than a piece of content.
export const FEATURES = [
  { id: 'stories', level: 10, title: 'Stories', sub: 'Short listening stories built from words you know' },
  { id: 'nohints', level: 15, title: 'Role-play without hints', sub: 'Your English cue stays hidden until you try' },
  { id: 'mock', level: 20, title: 'Practice exam', sub: 'A rehearsal of the A1 exam, as often as you like' },
  { id: 'fast', level: 25, title: 'Native speed', sub: 'Dialogues and stories a little faster than natural pace' },
  { id: 'exam', level: 30, title: 'A1 exam', sub: 'Pass it to reach A2 and open everything in it' },
];

export const KIND = { lesson: 'Lesson', drill: 'Build', dialogue: 'Talk', story: 'Story' };
const ORDER = { lesson: 0, drill: 1, dialogue: 2, story: 3 };

export const PATH = [
  ...LESSONS.map((l) => ({ kind: 'lesson', id: l.id, level: l.level, rank: l.rank, title: l.title, sub: l.goal, href: `#lesson/${l.id}` })),
  ...DRILLS.map((d) => ({ kind: 'drill', id: d.id, level: d.level, rank: d.rank, title: d.title, sub: d.goal, href: `#drill/${d.id}` })),
  ...DIALOGUES.map((d) => ({ kind: 'dialogue', id: d.id, level: d.level, rank: d.rank, title: d.title, sub: d.scene, href: `#talk/${d.id}` })),
  ...STORIES.map((s) => ({ kind: 'story', id: s.id, level: s.level, rank: s.rank, title: s.title, sub: s.en, href: `#story/${s.id}` })),
].sort((a, b) => rankIndex(a.rank) - rankIndex(b.rank) || a.level - b.level || ORDER[a.kind] - ORDER[b.kind]);

// What the next rank holds, shown locked until its exam is passed.
export const NEXT_RANK = {
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

export function isOpen(item, { level, rank, progress }) {
  if (progress[item.id]) return true;
  const have = rankIndex(rank.id ?? rank);
  const need = rankIndex(item.rank);
  if (need < have) return true;
  if (need > have) return false;
  return need > 0 || level >= item.level;
}

export const featureOpen = (id, { level, rank }) => rankIndex(rank.id ?? rank) > 0 || level >= FEATURES.find((f) => f.id === id).level;

// Everything a level opens, for the level-up screen and the "next unlock" line.
export function unlocksAt(level) {
  return [
    ...PATH.filter((p) => p.rank === 'A1' && p.level === level).map((p) => ({ title: p.title, sub: KIND[p.kind] })),
    ...FEATURES.filter((f) => f.level === level).map((f) => ({ title: f.title, sub: f.sub })),
  ];
}
