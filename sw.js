// sw.js

const CACHE_NAME = 'deezer-manager-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/api.js',
    '/js/ui.js',
    '/js/storage.js'
];

// Instalar el Service Worker y guardar los archivos estáticos en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos cacheados exitosamente');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Interceptar peticiones para responder con caché si no hay red
self.addEventListener('fetch', event => {
    // Si la petición es hacia la API de Deezer, intentamos usar la red primero
    if (event.request.url.includes('api.deezer.com') || event.request.url.includes('corsproxy.io')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ data: [] }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
    } else {
        // Para los archivos estáticos (HTML, CSS, JS), usamos la estrategia "Cache First"
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});