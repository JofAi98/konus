# Konuş

Learn to speak Turkish from zero. Speaking first: listen, echo, understand without text, then say it from memory. Built for an Italian speaker, in English.

- 11 units, 25 lessons, 167 phrases, 208 words
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

## Files

| File | What it does |
|---|---|
| `js/course.js` | All lessons. Add a unit here and push to publish it. |
| `js/pron.js` | Syllables, stress and the sound line. Stress exceptions go in `STRESS`. |
| `js/speech.js` | Recorded and device voices, speech checking, recording |
| `js/voices.js` | The voice list, sample sentences, audio file names |
| `audio/` | Recorded mp3s per voice; `tools/` records them |
| `js/srs.js` | Review scheduling (FSRS v4.5) |
| `js/store.js` | Saves everything on the device |
| `js/sync.js` | Syncs with Firebase when configured |
| `sw.js` | Offline support; always fetches the newest version first |
