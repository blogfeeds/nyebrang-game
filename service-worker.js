// Nama cache yang akan digunakan
const CACHE_NAME = 'my-site-cache-v1';

// Daftar file yang ingin dicache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/gameplay.html',
  '/styles.css',
  '/script.js',
  '/nyebrang.png',
   '/nyebrang-icon-512.png',
    '/nyebrang-icon-180.png',
	 '/nyebrang-icon-167.png',
	  '/nyebrang-icon-152.png',
	  '/nyebrang-icon-192.png',
	  '/nyebrang-icon-128.png',
	  '/speakeron.png',
	  '/speakeroff.png',
	  '/audio.mp3',
	  'https://fonts.googleapis.com/css?family=Press+Start+2P',
];

// Event Install: Cache file saat Service Worker terinstal
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Event Activate: Membersihkan cache lama jika ada versi baru
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Event Fetch: Menyediakan file dari cache atau mengambil dari jaringan
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika file ditemukan di cache, gunakan yang dari cache
      return response || fetch(event.request);
    })
  );
});