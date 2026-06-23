const CACHE_NAME = 'math-brain-v9';
const urlsToCache = [
    './',
    './index.html',
    './script.js',
    './core/state.js',
    './components/home.js',
    './components/modelSelection.js',
    './modules/matematika/mathConfig.js',
    './modules/matematika/mathGame.js',
    './modules/matematika/mathResult.js',
    './modules/english/engConfig.js',
    './modules/english/engGame.js',
    './manifest.json',
    './tailwindcss.js',
    './assets/cat-drooling.jpg',
    './assets/sound-effects/subway-surfers-revive.mp3'
];

// Install Event: Cache essential assets and skip waiting for immediate control
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate Event: Clean up old caches and take over immediate control
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Network-First for HTML docs (supports pull-to-refresh), Cache-First for assets
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const isHtmlDoc = event.request.mode === 'navigate' ||
        url.pathname === '/' ||
        url.pathname.endsWith('/index.html');

    if (isHtmlDoc) {
        // Network-first: allows pull-to-refresh to reload fresh content
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Update cache with fresh response
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request)) // Offline fallback
        );
    } else {
        // Cache-first for all other assets (JS, CSS, images, audio)
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request).catch(err => {
                    console.error('Network request failed and asset not found in cache:', event.request.url, err);
                });
            })
        );
    }
});