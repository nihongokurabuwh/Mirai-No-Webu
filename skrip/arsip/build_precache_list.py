#!/usr/bin/env python3
"""
File: skrip/arsip/build_precache_list.py
Fungsi: Menghasilkan service-worker.js dengan precache minimal (5 file inti)
        dan strategi Cache-First (0ms) untuk seluruh gambar dan font.
"""

import hashlib
import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
SW_PATH = ROOT_DIR / "service-worker.js"

# 5 Berkas Inti Ringan Precache (Mencegah rebutan bandwidth saat awal loading)
MINIMAL_PRECACHE_FILES = [
    "offline.html",
    "css/pages/global.css",
    "css/pages/navbar-hero-footer.css",
    "js/main.js",
    "images/mirai/logo/MNH1-nav.png",
]

def compute_files_hash(file_list):
    hasher = hashlib.sha256()
    for rel_path in sorted(file_list):
        f = ROOT_DIR / rel_path
        if f.exists():
            hasher.update(f.read_bytes())
    return hasher.hexdigest()[:12]

def build_service_worker():
    all_precache_files = []
    for rel_path in MINIMAL_PRECACHE_FILES:
        p = ROOT_DIR / rel_path
        if p.exists():
            all_precache_files.append(rel_path)
        else:
            print(f"⚠️ Berkas precache tidak ditemukan: {rel_path}")

    version_hash = compute_files_hash(all_precache_files)
    cache_name = f"mirai-app-shell-{version_hash}"
    data_cache_name = "mirai-data-cache-v1"

    precache_json = json.dumps(all_precache_files, indent=2)

    sw_code = f"""/**
 * Service Worker: service-worker.js
 * Website: MIRAI NO HANA (Mirai no Webu)
 * Dihasilkan otomatis oleh: skrip/arsip/build_precache_list.py
 * Versi Cache: {cache_name}
 */

const CACHE_NAME = "{cache_name}";
const DATA_CACHE_NAME = "{data_cache_name}";
const OFFLINE_URL = "offline.html";

// Berkas precache app shell minimal (hanya 5 file inti paling ringan)
const PRECACHE_URLS = {precache_json};
const PRECACHE_ASSETS = PRECACHE_URLS;

// 1. Install: Simpan hanya 5 berkas inti ke dalam cache
self.addEventListener("install", (event) => {{
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {{
      try {{
        await cache.addAll(PRECACHE_URLS);
      }} catch (err) {{
        console.warn("[SW] Bulk cache.addAll gagal, melakukan caching modular per-berkas:", err);
        await Promise.allSettled(PRECACHE_URLS.map((asset) => cache.add(asset)));
      }}
    }}).then(() => self.skipWaiting())
  );
}});

// 2. Activate: Hapus cache usang dan ambil alih klien aktif
self.addEventListener("activate", (event) => {{
  event.waitUntil(
    caches.keys().then((cacheNames) => {{
      return Promise.all(
        cacheNames.map((name) => {{
          if (name !== CACHE_NAME && name !== DATA_CACHE_NAME) {{
            return caches.delete(name);
          }}
        }})
      );
    }}).then(() => self.clients.claim())
  );
}});

// 3. Fetch: Strategi Cache-First (0ms) untuk Gambar, Font, dan Data JSON lokal
self.addEventListener("fetch", (event) => {{
  const req = event.request;
  const url = new URL(req.url);

  // API terjemahan lintas-origin harus langsung ke jaringan, tidak masuk cache app-shell.
  if (url.origin !== self.location.origin) return;

  // Abaikan non-GET requests
  if (req.method !== "GET") return;

  // STRATEGI A: Cache-First untuk seluruh file gambar (.png, .jpg, .jpeg, .webp, .svg, .ico), font, dan data JSON
  const isImageRequest = /\\.(png|jpe?g|webp|svg|ico)$/i.test(url.pathname);
  const isFontRequest = url.hostname.includes("fonts.gstatic.com") || url.hostname.includes("fonts.googleapis.com") || /\\.(woff2?|ttf|otf|eot)$/i.test(url.pathname);
  const isDataRequest = url.pathname.includes("/data/") && url.pathname.endsWith(".json");

  if (isImageRequest || isFontRequest || isDataRequest) {{
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {{
        return cache.match(req).then((cachedResponse) => {{
          // Jika ada di cache, kembalikan instan dalam 0ms tanpa jaringan!
          if (cachedResponse) {{
            return cachedResponse;
          }}
          return fetch(req).then((networkResponse) => {{
            if (networkResponse && networkResponse.status === 200) {{
              cache.put(req, networkResponse.clone());
            }}
            return networkResponse;
          }}).catch(() => null);
        }});
      }})
    );
    return;
  }}

  // STRATEGI B: Stale-While-Revalidate untuk halaman web & app shell, fallback ke offline.html
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {{
      return cache.match(req).then((cachedResponse) => {{
        const fetchPromise = fetch(req).then((networkResponse) => {{
          if (networkResponse && networkResponse.status === 200) {{
            cache.put(req, networkResponse.clone());
          }}
          return networkResponse;
        }}).catch(async () => {{
          // Jika offline dan navigasi halaman gagal, tampilkan offline.html
          if (req.mode === "navigate") {{
            const fallback = await cache.match(OFFLINE_URL);
            if (fallback) return fallback;
            const anyOffline = await caches.match("offline.html");
            if (anyOffline) return anyOffline;
          }}
          return cachedResponse;
        }});

        return cachedResponse || fetchPromise;
      }});
    }})
  );
}});
"""

    SW_PATH.write_text(sw_code, encoding="utf-8")
    print(f"✔ service-worker.js berhasil dibuat ({len(all_precache_files)} berkas precache inti, hash: {version_hash})")

if __name__ == "__main__":
    build_service_worker()
