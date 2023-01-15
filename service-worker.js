const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/transpoticons/7.png',
  '/transpoticons/7b.png',
  '/transpoticons/9.png',
  '/transpoticons/9b.png',
  '/transpoticons/10.png',
  '/transpoticons/10b.png',
  '/transpoticons/11.png',
  '/transpoticons/11b.png',
  '/transpoticons/12.png',
  '/transpoticons/12b.png',
  '/images/earth3Trans.png'
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        document.getElementById("#installicon").style.display = "none";
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});