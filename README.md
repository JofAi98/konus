# Konuş

Learn to speak Turkish from zero. Speaking first: listen, echo, understand without text, then say it from memory. Built for an Italian speaker, in English.

- 12 units, 29 lessons, 12 Build drills (grammar you say out loud), 12 dialogues you play a part in, 6 listening stories
- Themes: 15 A1 topics of 10 words each, one at a time. Hear them from English, guess them from Turkish; 3 right guesses and a word goes to your vocab
- Vocab filters by level and by topic
- Levels and ranks: practice earns XP, levels open content step by step, rank exams follow the European levels (A1 to C2)
- A sound line under every phrase (te-shek-**KÜR** e-**DE**-rim), computed from the spelling
- Speech checking with the browser's Turkish recognition, with sound-level hints
- Record yourself and play it right after the native voice
- Spaced review (FSRS) so each word comes back right before you'd forget it
- Vocab saves automatically; add your own phrases with the Claude app
- Works offline, installs on the iPhone home screen, updates itself
- Free: GitHub Pages hosting, Firebase free plan for sync

## Run it on your Mac

```bash
python3 -m http.server 5178
```

Open http://localhost:5178 in Chrome or Safari. The microphone works on localhost and on https.

## Put it online (GitHub Pages, free)

1. Create a GitHub account at github.com if you don't have one.
2. Log in from the terminal once: `gh auth login` (choose GitHub.com, HTTPS, log in with a web browser).
3. Create the repository and publish:
   ```bash
   git init && git add . && git commit -m "Konuş"
   gh repo create konus --public --source . --push
   gh api -X POST repos/{owner}/konus/pages -f "source[branch]=main" -f "source[path]=/"
   ```
4. After a minute the app is at `https://<your-username>.github.io/konus/`.

Every later `git push` updates the app. It picks up the new version the next time it's opened.

## Turn on sync (Firebase, free, no credit card)

1. Go to console.firebase.google.com and click **Create a project**. Name it `konus`. Turn Google Analytics off. Create.
2. **Build → Authentication → Get started.** Under Sign-in method choose **Email/password**, switch on the first option (leave email link off), Save.
3. **Build → Firestore Database → Create database.** Pick a location in Europe, start in **production mode**, Create. Open the **Rules** tab, replace everything with the contents of `firestore.rules`, Publish.
4. **Project settings** (gear icon) **→ General → Your apps → Web** (the `</>` icon). Nickname `Konuş`, don't tick Hosting, Register app. Copy the `firebaseConfig` block into `js/firebase-config.js`.
5. Push the change. Open the app, go to Settings, tap **Create account** once, then **Sign in** with the same email and password on each other device.

The Firebase config is not a secret: it only identifies the project. The rules in `firestore.rules` are what keep your data private to your account.

## Voices

The course is recorded with Microsoft neural voices: Emel (native Turkish) for every phrase and word, and six multilingual voices for the sample sentences in Settings. Anything without a recording, like phrases you add yourself, uses the device's Turkish voice.

After adding lessons, record the new phrases (existing files are kept):

```bash
pip install edge-tts
node tools/audio-texts.mjs | python3 tools/make-audio.py emel
```

To record the whole course in a multilingual voice, use its id from `js/voices.js` (for example `ava`), then set `full: true` for it there.

## Levels and ranks

Practice earns XP (a lesson or drill 30, a dialogue 25, a story 20, each review 2, each sentence said out loud 1 or 2, plus 10 for the first practice of the day). Only practice at your current rank counts: lower-rank material stays open but earns nothing. Every level costs 150 XP, and each rank holds 30 levels (A1 is 1 to 30, A2 is 31 to 60...). The last level of a rank is its cap, where its exam opens. XP is logged per day as `xp`, plus `xp_A2`, `xp_B1`... for ranks above A1.

Inside A1, each item on the path has a level that opens it; stories open at 10, no-hints role-play at 15, the practice exam at 20, native speed at 25. The A1 exam opens at level 30 (20 questions, pass at 80%, one try a day). Passing stores `rank:A2` in progress, which opens everything marked A2. The schedule lives in `js/levels.js`; each lesson, drill, dialogue and story sets its own `level`.

Hunter ranks sit on top of the European levels: F (tutorial), E (A1), E+ (A1+, level 20), D (A2), D+ (A2+, level 50), C (B1), C+ (level 80), B (B2), B+ (level 110), A (C1), A+ (level 140), S (C2). The tutorial is the three Sounds lessons, the first Build drill and the first dialogue.

## Files

| File | What it does |
|---|---|
| `js/course.js` | All lessons. Add a unit here and push to publish it. |
| `js/drills.js` | Build drills: a grammar pattern and sentences to build from English |
| `js/dialogues.js` | Talk: short scenes, your lines marked `you` |
| `js/stories.js` | Listening stories with questions |
| `js/themes.js` | Themes and their words, in the order they open |
| `js/levels.js` | XP, levels, ranks, the path and what each level opens |
| `js/pron.js` | Syllables, stress and the sound line. Stress exceptions go in `STRESS`. |
| `js/speech.js` | Recorded and device voices, speech checking, recording |
| `js/voices.js` | The voice list, sample sentences, audio file names |
| `audio/` | Recorded mp3s per voice; `tools/` records them |
| `js/srs.js` | Review scheduling (FSRS v4.5) |
| `js/store.js` | Saves everything on the device |
| `js/sync.js` | Syncs with Firebase when configured |
| `sw.js` | Offline support; always fetches the newest version first |
