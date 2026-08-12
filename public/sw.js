// Service Worker de Cuenta Clara
// Estrategia "stale-while-revalidate": sirve del caché al instante si existe
// (para que la app abra rápido y no se quede en blanco con mala conexión),
// y en paralelo pide la versión más reciente por red para refrescar el caché.
const CACHE_NAME = "cuenta-clara-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Solo GET del propio origen; todo lo demás (APIs externas, POST, etc.) pasa de largo.
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
