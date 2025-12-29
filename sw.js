// Service Worker pour Garibobo Agenda PWA
// Version 25.3.0

const CACHE_NAME = 'garibobo-agenda-v25.3.0';
const RUNTIME_CACHE = 'garibobo-runtime-v25.3.0';

// Ressources critiques à mettre en cache lors de l'installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icons/Icon-192.png',
  '/icons/Icon-512.png',
  '/icons/Icon-maskable-192.png',
  '/icons/Icon-maskable-512.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des ressources critiques');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes vers des domaines externes (sauf fonts)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.origin.includes('fonts.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si en cache, retourner immédiatement
        if (cachedResponse) {
          // Mais essayer de mettre à jour en arrière-plan
          fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(event.request, response.clone());
                });
              }
            })
            .catch(() => {
              // Échec silencieux si pas de réseau
            });
          
          return cachedResponse;
        }

        // Sinon, aller chercher sur le réseau
        return fetch(event.request)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Cloner la réponse
            const responseToCache = response.clone();

            // Mettre en cache pour usage futur
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.log('[SW] Erreur fetch:', error);
            
            // Si c'est une page HTML, retourner une page offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Synchronisation en arrière-plan (si supporté)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Synchronisation des données...');
  // Logique de synchronisation si nécessaire
}

// Notifications Push (si nécessaire dans le futur)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/icons/Icon-192.png',
    badge: '/icons/Icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Garibobo Agenda', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[SW] Service Worker Garibobo Agenda chargé');
