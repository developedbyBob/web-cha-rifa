const CACHE_NAME = 'cha-benjamin-v1';
const urlsToCache = [
  '/',
  '/css/main.css',
  '/css/components/grid.css',
  '/css/components/modal.css',
  '/css/components/admin.css',
  '/js/utils.js',
  '/js/api.js',
  '/js/app.js',
  '/js/components/Grid.js',
  '/js/components/Modal.js',
  '/js/components/AdminPanel.js',
  '/assets/images/back-benjamim.png',
  '/assets/images/nome_benjamin.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
      .catch(() => {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
      })
  );
});

// Limpar caches antigos quando uma nova versão for ativada
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});