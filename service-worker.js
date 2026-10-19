/**
 * Service Worker: service-worker.js
 * Website: MIRAI NO HANA (Mirai no Webu)
 * Dihasilkan otomatis oleh: skrip/arsip/build_precache_list.py
 * Versi Cache: mirai-app-shell-b901a46b5c4d
 */

const CACHE_NAME = "mirai-app-shell-b901a46b5c4d";
const DATA_CACHE_NAME = "mirai-data-cache-v1";
const OFFLINE_URL = "offline.html";

// Berkas precache app shell minimal (hanya 5 file inti paling ringan)
const PRECACHE_URLS = [
  "offline.html",
  "css/pages/global.css",
  "css/pages/navbar-hero-footer.css",
  "js/main.js",
  "images/mirai/logo/MNH1-nav.png"
];
const PRECACHE_ASSETS = PRECACHE_URLS;

// 1. Install: Simpan hanya 5 berkas inti ke dalam cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (err) {
        console.warn("[SW] Bulk cache.addAll gagal, melakukan caching modular per-berkas:", err);
        await Promise.allSettled(PRECACHE_URLS.map((asset) => cache.add(asset)));
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate: Hapus cache usang dan ambil alih klien aktif
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== DATA_CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Strategi Cache-First (0ms) untuk Gambar, Font, dan Data JSON lokal
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Abaikan non-GET requests
  if (req.method !== "GET") return;

  // STRATEGI A: Cache-First untuk seluruh file gambar (.png, .jpg, .jpeg, .webp, .svg, .ico), font, dan data JSON
  const isImageRequest = /\.(png|jpe?g|webp|svg|ico)$/i.test(url.pathname);
  const isFontRequest = url.hostname.includes("fonts.gstatic.com") || url.hostname.includes("fonts.googleapis.com") || /\.(woff2?|ttf|otf|eot)$/i.test(url.pathname);
  const isDataRequest = url.pathname.includes("/data/") && url.pathname.endsWith(".json");

  if (isImageRequest || isFontRequest || isDataRequest) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(req).then((cachedResponse) => {
          // Jika ada di cache, kembalikan instan dalam 0ms tanpa jaringan!
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(req).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(req, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);
        });
      })
    );
    return;
  }

  // STRATEGI B: Stale-While-Revalidate untuk halaman web & app shell, fallback ke offline.html
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(req, networkResponse.clone());
          }
          return networkResponse;
        }).catch(async () => {
          // Jika offline dan navigasi halaman gagal, tampilkan offline.html
          if (req.mode === "navigate") {
            const fallback = await cache.match(OFFLINE_URL);
            if (fallback) return fallback;
            const anyOffline = await caches.match("offline.html");
            if (anyOffline) return anyOffline;
          }
          return cachedResponse;
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
