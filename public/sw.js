const CACHE_NAME = '365-days-challenge-app-version-1.0.1'

const urlsToCache = [
  '/',
  '/js/script.js',
  '/images/maxim-kirshin.jpeg',
  '/images/evgeniy-razboynikov.jpeg',
  '/images/ruslan-bekshenev.jpg',
  '/images/maxim-petrov.jpeg',
  '/svg/sprite.svg',
  '/fonts/Montserrat/Montserrat-Bold.ttf',
  '/fonts/Montserrat/Montserrat-Regular.ttf',
  '/manifest.json',
  '/icon-192x192.png',
  '/favicon.ico',
  '/vendor/popper.min.js',
  '/vendor/pulltorefresh.min.js',
  '/css/style.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache)
    })
  )
})

// Cache and return requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log('[MATCHED]: ' + event.request.url)
        return response
      }
      console.log('[NOT MATCHED]: ' + event.request.url)
      return fetch(event.request)
    })
  )
})

// Update a service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
