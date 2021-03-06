const activeCacheName = 'hypnotized-v1'

self.addEventListener('install', (e) => {
  const assets = [
    '/',
    'index.html',
    'index.js',
    'favicon.png',
    'thumb-001.png',
    'thumb-001.webp',
    'thumb-002.png',
    'thumb-002.webp'
  ]

  const action = caches.open(activeCacheName).then(cache => cache.addAll(assets))

  e.waitUntil(action)
})

self.addEventListener('activate', (e) => {
  const titles = [activeCacheName]

  const others = name => titles.indexOf(name) === -1
  const remove = name => caches.delete(name)

  const action = caches.keys().then(entries => Promise.all(entries.filter(others).map(remove)))

  e.waitUntil(action)
})

self.addEventListener('fetch', (e) => {
  // Skip SSE endpoint
  if (e.request.url.includes('/io')) {
    return
  }

  const action = caches.match(e.request).then((response) => {
    if (response) {
      return response
    }

    return fetch(e.request)
  })

  e.respondWith(action)
})
