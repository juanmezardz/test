// Service worker de Defensoras de las Tablas: red primero, caché como respaldo,
// para que las actualizaciones lleguen solas y el juego funcione sin internet.
const CACHE = 'defensoras-v10';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // 'no-cache' salta el caché HTTP del navegador y revalida con el servidor
  // (ETag), así las actualizaciones publicadas llegan sin esperas dobles
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(res => {
      if (res.ok && new URL(e.request.url).origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(m =>
        m || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error())
      )
    )
  );
});
