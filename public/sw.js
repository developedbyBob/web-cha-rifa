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
  '/components/Grid.js',
  '/components/Modal.js',
  '/components/AdminPanel.js',
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
  // IMPORTANTE: Ignorar recursos externos (como fontes do Google)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request.clone())
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            // Retornar uma página offline para falhas de navegação
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Para outros recursos, deixe o erro propagar
            throw error;
          });
      })
  );
});

// Limpar caches antigos
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