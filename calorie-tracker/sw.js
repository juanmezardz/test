/* Macro Tracker service worker — offline shell.
   Bump CACHE when you change any shell file. */
var CACHE = 'macro-tracker-v1';
var SHELL = [
  './',
  'index.html',
  'tracker.html',
  'setup-interview.html',
  'manifest.webmanifest',
  'icon-192.webp',
  'icon-512.webp',
  'icon-maskable-512.webp',
  'apple-touch-icon.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      // add one at a time so a single missing file can't fail the whole install
      return Promise.all(SHELL.map(function(url){
        return c.add(new Request(url, {cache:'reload'})).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Pages: network first, so a redeploy lands immediately; cache is the offline fallback.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(hit){ return hit || caches.match('tracker.html'); });
      })
    );
    return;
  }

  // Everything else: cache first, refill in the background.
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      });
    })
  );
});

// lets the page trigger an immediate update
self.addEventListener('message', function(e){
  if (e.data === 'skip-waiting') self.skipWaiting();
});
