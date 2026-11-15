
const CACHE_NAME = "isfahan-pwa-v8";

const APP_FILES = [
  "./",
  "./index.html",
  "./about.html",
  "./places.html",
  "./chehel-sotoun.html",
  "./jame-mosque.html",
  "./khajoo.html",
  "./naqshe-jahan.html",
  "./se-o-se-pol.html",
  "./sheikh-lotfollah.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/logo.svg",
  "./images/chehel-sotoun.jpg",
  "./images/jame-mosque.jpg",
  "./images/jame-mosque.svg",
  "./images/khajoo.jpg",
  "./images/khajoo.svg",
  "./images/naqshe-jahan-dusk.jpg",
  "./images/naqshe-jahan.svg",
  "./images/se-o-se-pol-evening.jpg",
  "./images/se-o-se-pol-night.jpg",
  "./images/se-o-se-pol.svg",
  "./images/sheikh-lotfollah.jpg",
  "./images/sheikh-lotfollah.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache =>
                cache.put(event.request, copy)
              );
            }
            return response;
          })
          .catch(async () =>
            await caches.match("./index.html") ||
            new Response("صفحه در حالت آفلاین در دسترس نیست.", {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8"
              }
            })
          );
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache =>
              cache.put(event.request, copy)
            );
          }
          return response;
        })
        .catch(() => new Response(
          "این بخش در حالت آفلاین در دسترس نیست.", {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          }
        ));
    })
  );
});
