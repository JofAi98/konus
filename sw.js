// Network first, so every app update arrives the next time you open it.
// The cached copy keeps the app working offline.
const CACHE = 'konus-v4';
const ASSETS = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/course.js', 'js/pron.js', 'js/speech.js', 'js/srs.js', 'js/store.js', 'js/sync.js', 'js/firebase-config.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((m) => m || caches.match('index.html'))),
  );
});
