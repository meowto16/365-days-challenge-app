importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
)

const CACHE_NAME = '365-days-challenge-app-version-1.0.0'

const urlsToCache = ['/']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    })
  )
})

// Cache and return requests
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       if (response) {
//         return response
//       }
//       return fetch(event.request)
//     })
//   )
// })

// Update a service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['your-app-name']
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
