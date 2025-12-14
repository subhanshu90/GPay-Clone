// Service Worker for PWA with Smart Caching Strategy
const CACHE_NAME = 'geepay-v3';
const STATIC_CACHE = 'geepay-static-v3';

// Assets that should be cached for offline (images, fonts, etc)
const STATIC_ASSETS = [
    '/icon-192.png',
    '/icon-512.png',
    '/payment-success.mp3'
];

// Install event - cache static assets only
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control immediately
    );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // For static assets (images, fonts, audio): cache-first
    if (request.destination === 'image' ||
        request.destination === 'font' ||
        request.destination === 'audio' ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.mp3')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                return cached || fetch(request).then((response) => {
                    return caches.open(STATIC_CACHE).then((cache) => {
                        cache.put(request, response.clone());
                        return response;
                    });
                });
            })
        );
        return;
    }

    // For app code (HTML, JS, CSS): network-first with cache fallback
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache the fresh response for offline fallback
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(request).then((cached) => {
                    return cached || new Response('Offline - content not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
    );
});
