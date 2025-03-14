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
  '/assets/images/nome_benjamin.png',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Se a solicitação não começa com a origem (recursos externos como Google Fonts)
  if (!event.request.url.startsWith(self.location.origin)) {
    // Para recursos externos, simplesmente deixe o navegador lidar com eles
    // Não intervenha no processo padrão
    return;
  }
  
  // Para recursos da mesma origem, trate-os normalmente
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorne a resposta
        if (response) {
          return response;
        }
        
        // Clone a solicitação
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Verifique se recebemos uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone a resposta
            const responseToCache = response.clone();
            
            // Abra o cache e armazene a resposta
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            // Falha na rede - retorne a página offline para navegação
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Para outros tipos de solicitações, registre o erro
            console.error('Erro ao buscar recurso:', error);
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
            console.log('Eliminando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});