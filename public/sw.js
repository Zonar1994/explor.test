// A basic service worker just to enable PWA installability.
// In a full implementation, this could use Workbox for robust offline caching.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser do its default thing
  // The mere presence of this fetch handler satisfies the PWA requirement
  event.respondWith(fetch(event.request));
});
