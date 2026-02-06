
self.addEventListener('install', e => {
  e.waitUntil(caches.open('angel-hub').then(c => c.addAll(['./'])));
});
