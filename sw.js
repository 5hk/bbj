const CACHE_NAME = 'plan-g-v9';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/sections.css',
  '/styles/animations.css',
  '/scripts/main.js',
  '/scripts/i18n-init.js',
  '/scripts/language-switcher.js',
  '/scripts/meta-tags-updater.js',
  '/scripts/custom-select.js',
  '/scripts/releases-data.js',
  '/scripts/releases.js',
  '/images/logo.jpeg',
  '/images/og/og-image.jpg',
  '/locales/ko/translation.json',
  '/locales/en/translation.json',
  '/locales/es/translation.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          if (event.request.url.startsWith(self.location.origin)) {
            const responseToCache = response.clone();
            
            const requestUrl = new URL(event.request.url);
            const requestToCache = new Request(requestUrl.pathname);

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(requestToCache, responseToCache);
              })
              .catch((error) => {
                console.error('Cache put failed:', error);
              });
          }

          return response;
        }).catch((error) => {
          console.error('Fetch failed:', error);
          // You can return a custom offline page here
          // return caches.match('/offline.html');
        });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

