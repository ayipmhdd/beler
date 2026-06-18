const CACHE_NAME = 'math-brain-v1';
const urlsToCache = [
    './',
    './index.html',
    './script.js',
    './manifest.json',
    './tailwindcss.js'
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

// Activate Event: Claim clients to take over the active pages immediately
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// Fetch Event: Strict Cache-First Strategy with Network Fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return cached response if found, otherwise attempt network fetch
            return response || fetch(event.request).catch(err => {
                console.error('Network request failed and asset not found in cache:', event.request.url, err);
            });
        })
    );
});