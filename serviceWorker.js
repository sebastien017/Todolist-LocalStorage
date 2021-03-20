const static_cache_name = "cache-todolist-v1";
const files = ["/", "/index.html"];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(static_cache_name).then(cache => {
            cache.addAll(files);
        })
    )
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            if(response) {
                return response;
            }

            let fetchRequest = e.request.clone();

            return fetch(fetchRequest).then(response => {
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }

            let responseToCache = response.clone();

            caches.open(static_cache_name).then(cache => {
                cache.put(e.request, responseToCache);
            });

            return response;

            });
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.add(
                keys.filter(key => key !== static_cache_name).map(key => caches.delete(key))
            )
        })
    );
});