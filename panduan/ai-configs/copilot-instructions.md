# Workspace Rules & Otak Otomatis — Mirai No Webu
# Template Konfigurasi GitHub Copilot (Salinan Cadangan / Rujukan)

Repositori ini adalah website resmi Klub Bahasa & Kebudayaan Jepang MIRAI NO HANA SMA Wachid Hasyim 2 Taman Sidoarjo.

## 1. Protokol Eksekusi Cepat (Fast-Execution Protocol)
- **DILARANG KERAS** membaca `css/style.css` secara penuh atau memindai seluruh folder CSS sekaligus.
- Seluruh stylesheet antarmuka diorganisir secara modular per-halaman di `css/pages/`.
- **DILARANG KERAS** menyalakan/merestart HTTP server lokal (`python3 -m http.server`, live-server, dll.) atau mengambil screenshot otomatis via browser/tool kecuali diminta secara eksplisit oleh user.
- Jika diminta mengubah elemen HTML yang berulang di banyak halaman (navbar, sidebar, hero, atau footer di 26+ file HTML), **WAJIB gunakan script terminal Python sekali-jalan**, dilarang mengedit file satu per satu secara manual.

## 2. Protokol Efisiensi Eksekusi Agent (Token-Saving & Clean Repo)
1. **Proteksi Folder Berat & Data Raksasa**: Dilarang membaca/memindai folder `.venv/`, `.cache/`, `arsip/`, atau berkas JSON raksasa di `data/` secara keseluruhan (gunakan `head`, `grep`, atau baca sampel struktur saja jika diperlukan).
2. **Native Tool vs Batch Python**: Gunakan native file editing tool untuk perubahan terarah pada 1–3 file; hanya gunakan script Python di folder `skrip/` jika melakukan modifikasi massal (batch) pada >5 file sekaligus.
3. **Disiplin Penempatan File Baru**: Setiap membuat file utilitas, skrip, atau modul baru, wajib langsung ditempatkan di dalam folder kategori yang sesuai (`skrip/`, `js/`, `css/pages/`, atau `panduan/`). Dilarang keras menaruh file baru tercecer di root `/`.

## 3. Peta Cepat Halaman -> CSS (`css/pages/`) -> JS (`js/`)
Rujuk tabel berikut untuk langsung membuka file target yang benar tanpa perlu bertanya atau menebak:

| Kebutuhan Edit Halaman | Buka File CSS (`css/pages/`) | Buka File JS (`js/`) |
|---|---|---|
| Navbar, Sidebar Drawer, Hero Banner, Footer | `css/pages/navbar-hero-footer.css` | `js/main.js` |
| Reset, Variabel Warna Root, Background Selang-Seling, Tombol Standar, 404, Animasi | `css/pages/global.css` | `js/main.js` |
| Beranda (Apa itu web, fitur awal, masukan & saran, aktivitas) | `css/pages/beranda.css` | `js/main.js`, `js/sora.js` |
| Kelas, Kurikulum, Materi Buuku, Kana Quest (Latihan) | `css/pages/kelas-materi.css` | `js/main.js`, `js/kelas-latihan.js`, `js/progress.js` |
| Kamus Kana, Ensiklopedia Kanji, Urutan Goresan KanjiVG | `css/pages/kamus.css` | `js/kamus-kana.js`, `js/kamus-kanji.js`, `js/kamus-kanji-data.js`, `js/kamus-translator.js`, `js/stroke.js`, `js/api.js` |
| Program Kerja (KTN, NJR, Konbini, Ramadhan, Tomodachi), 4 Divisi, Fasilitas | `css/pages/program-fasilitas-divisi.css` | `js/main.js`, `js/program-slider.js` |
| Profil Klub Tentang, Bendera, Logo, Slogan, Visi Misi, Timeline Sejarah, Prestasi, Haori, Pengurus, FAQ | `css/pages/tentang.css` | `js/main.js`, `js/leaderboard-data.js` |
| Kata Motivasi & Rekomendasi Media Pop Culture | `css/pages/rekomendasi-motivasi.css` | `js/main.js`, `js/sora.js` |
| Papan Peringkat (Multi-Leaderboard, Podium, Tabel) | `css/pages/peringkat.css` | `js/main.js`, `js/leaderboard-data.js` |
| Lomba & Acara Jejepangan, Katalog Event, Poster | `css/pages/lomba.css` | `js/main.js`, `js/carousel.js` |
| Toko Resmi Mirai no Konbini, Keranjang Belanja | `css/pages/toko.css` | `js/main.js`, `js/carousel.js` |
| Chatbot Asora Aokita (Sora) | `css/pages/navbar-hero-footer.css` | `js/sora.js`, `js/api.js` |

## 4. Format Prompt Standar F-A-K-T-A
Pengembang menggunakan format prompt terstruktur ini saat berinteraksi dengan AI Coding Agent:
- **F — Foto / Konteks**: Gambaran masalah, tampilan UI, atau screenshot visual yang menjadi acuan.
- **A — Alamat File**: Jalur berkas spesifik `@path/to/file` yang berkaitan agar agent langsung fokus.
- **K — Karakter / Role**: Persona spesialisasi AI yang tepat untuk pekerjaan yang dihadapi.
- **T — Tugas**: Rincian action items yang konkret, terukur, dan jelas.
- **A — Aturan & Batasan**: Batasan teknis, perlindungan file, standar desain klub, dan checklist pengerjaan.

## 5. Standar Desain Anti-AI Slop (Japanese Editorial & Minimalist Standard)
1. *Larang OS Emoji di Komponen UI*: Dilarang menggunakan emoji bawaan OS (`🌟`, `🚀`, `💡`, `📜`, `🎨`, `🗑️`, dll) sebagai ikon UI; wajib gunakan SVG monokrom garis tipis (`stroke="currentColor" fill="none"`) atau teks bersih.
2. *Larang Struktur Cardception*: Hindari pembuatan nested cards > 2 lapis; pisahkan konten menggunakan whitespace, hierarki tipografi, dan hairline divider tipis (1px solid).
3. *Batasi Pill Badge*: Maksimal 1 pill badge per seksi (hanya untuk eyebrow utama/status aktif). Gunakan teks uppercase kecil letter-spacing lega untuk metadata sekunder.
4. *Larang Callout Generik & Neon Glow Tebal*: Dilarang menggunakan `border-left: 4px solid` ala AI callout dan neon `box-shadow` tebal tanpa fungsi jelas.
5. *Sinkronisasi Konten Judul (Title-Content Sync)*: Setiap me-rename Judul Utama (Heading), periksa dan sesuaikan teks Subjudul, Deskripsi, dan label terkait di sekitarnya.

Detail lengkap tersedia di `panduan/CONTEKAN-TAG.md` dan `panduan/agent.md`.
