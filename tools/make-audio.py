"""Record the course audio with Microsoft neural voices (needs: pip install edge-tts).

    node tools/audio-texts.mjs | python3 tools/make-audio.py emel
    node tools/audio-texts.mjs samples | python3 tools/make-audio.py ava andrew

Writes audio/<voice>/<hash>.mp3 and audio/<voice>/index.json (the hashes it has).
Files that already exist are kept, so re-running only records what's new.
"""
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

VOICES = {
    'emel': 'tr-TR-EmelNeural',
    'ahmet': 'tr-TR-AhmetNeural',  # returned no audio in Oct 2026; try again later
    'ava': 'en-US-AvaMultilingualNeural',
    'andrew': 'en-US-AndrewMultilingualNeural',
    'emma': 'en-US-EmmaMultilingualNeural',
    'brian': 'en-US-BrianMultilingualNeural',
    'seraphina': 'de-DE-SeraphinaMultilingualNeural',
    'giuseppe': 'it-IT-GiuseppeMultilingualNeural',
}
ROOT = Path(__file__).resolve().parent.parent / 'audio'


async def record(voice, item, sem, stats):
    out = ROOT / voice / f"{item['hash']}.mp3"
    if out.exists() and out.stat().st_size > 0:
        stats['kept'] += 1
        return
    async with sem:
        for attempt in range(4):
            try:
                await asyncio.wait_for(edge_tts.Communicate(item['text'], VOICES[voice]).save(str(out)), timeout=30)
                if out.stat().st_size == 0:
                    raise RuntimeError('empty file')
                stats['new'] += 1
                return
            except Exception as err:  # network hiccups and stalls: wait and retry
                out.unlink(missing_ok=True)
                if attempt == 3:
                    stats['failed'].append((item['text'], str(err)))
                await asyncio.sleep(1.5 * (attempt + 1))


async def main(voices, items):
    sem = asyncio.Semaphore(6)
    for voice in voices:
        (ROOT / voice).mkdir(parents=True, exist_ok=True)
        stats = {'new': 0, 'kept': 0, 'failed': []}
        await asyncio.gather(*(record(voice, it, sem, stats) for it in items))
        have = sorted(p.stem for p in (ROOT / voice).glob('*.mp3') if p.stat().st_size > 0)
        (ROOT / voice / 'index.json').write_text(json.dumps(have))
        print(f"{voice}: {stats['new']} new, {stats['kept']} kept, {len(stats['failed'])} failed, {len(have)} total")
        for text, err in stats['failed'][:5]:
            print('  failed:', text, '-', err)


if __name__ == '__main__':
    names = sys.argv[1:]
    unknown = [n for n in names if n not in VOICES]
    if not names or unknown:
        sys.exit(f"Usage: ... | make-audio.py {' '.join(VOICES)}  (unknown: {unknown})")
    lines = [json.loads(line) for line in sys.stdin if line.strip()]
    asyncio.run(main(names, lines))
