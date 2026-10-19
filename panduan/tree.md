# Struktur Direktori Proyek Mirai no Webu

Dokumen ini memetakan seluruh susunan berkas, folder, modul stylesheet, halaman web, aset gambar, basis data, dan logika skrip yang aktif di website **Mirai no Webu**.
Struktur direktori menerapkan standar **Feature-Based Asset Colocation**, **Modular CSS Architecture**, dan **Clean Root Standard**:

```text
Mirai-No-Webu/
├── index.html                      # Gerbang utama website (Beranda)
├── 404.html                        # Halaman penanganan tautan salah / tidak ditemukan bertema Sora
├── offline.html                    # Halaman fallback ramah pengunjung saat perangkat offline (PWA)
├── favicon.ico                     # Ikon favicon tab peramban web resmi klub (Logo lingkaran NK)
├── favicon.png                     # Favicon PNG resolusi tinggi logo lingkaran NK
├── manifest.webmanifest            # Konfigurasi PWA Web App Manifest (standalone, theme_color #e91e63, icons)
├── service-worker.js               # Service Worker PWA (precache app shell, cache-first data, stale-while-revalidate)
├── robots.txt                      # Konfigurasi perayapan mesin pencari (SEO)
├── sitemap.xml                     # Peta situs XML 32 halaman resmi website
├── README.md                       # Profil utama repositori & dokumentasi Sources & Credits
├── cspell.json                     # Konfigurasi Code Spell Checker (kamus & ignorasi kata bilingual)
├── .vscode/                        # Konfigurasi workspace editor VS Code / Antigravity
│   ├── settings.json               # Pengaturan workspace, formatOnSave, search.exclude, & watcherExclude
│   └── extensions.json             # Rekomendasi 9 ekstensi resmi VS Code untuk developer proyek
│
├── css/                            # Master & Arsitektur Stylesheet Berbasis Halaman
│   ├── style.css                   # Master CSS Index (Memanggil @import Google Fonts & 11 file css/pages/)
│   └── pages/                      # Sub-folder stylesheet 100% intuitif per-halaman web
│       ├── global.css              # Variabel :root, reset, sistem background selang-seling, tombol dasar, dark mode, 404, animasi
│       ├── navbar-hero-footer.css  # Floating navbar, off-canvas sidebar nav, hero banners, hero guardrail, & footer
│       ├── beranda.css             # Apa itu web, start-grid, aktivitas beranda (2 kartu besar), masukan & saran, quote slider
│       ├── kelas-materi.css        # Alur kelas, kelas dasar (#dasar), kelas lanjutan (#lanjutan), buuku lesson, kurikulum, kuis latihan
│       ├── kamus.css               # Kamus kana & kanji, stage goresan KanjiVG, kanvas Yoon, quick stroke button
│       ├── program-fasilitas-divisi.css     # Hub kegiatan, 5 halaman proker, 4 divisi resmi, fasilitas klub (format landscape), slider galeri
│       ├── tentang.css             # Profil klub, bendera, logo, slogan, visi misi, timeline angkatan 1-8, Sora RPG, prestasi, haori, FAQ
│       ├── rekomendasi-motivasi.css # Kata motivasi anime (3 box), rekomendasi pop culture, & media legal
│       ├── peringkat.css           # Multi-leaderboard keaktifan rajio, presensi kehadiran, podium rank 1-3, tabel skor, modal riwayat
│       ├── lomba.css               # Papan info lomba/acara, kartu event bertumpuk vertikal, poster carousel kiri-kanan, modal juknis
│       └── toko.css                # Etalase atribut & F&B konbini, Shopee-style 185px, poster carousel Haori/KTA, drawer keranjang
│
├── js/                             # Logika JavaScript Modular
│   ├── main.js                     # Logika navbar, sidebar mobile, launcher Sora, dan tema
│   ├── kelas-latihan.js                   # Master interaksi kuis, kartu, & efek interaktif global
│   ├── leaderboard-data.js         # Master data profil peringkat & prestasi
│   ├── sora.js                     # Logika bot obrolan & fallback jawaban cerdas Sora
│   ├── kamus-kanji-data.js               # Basis data embedded 2.211 Kanji Joyo & JLPT
│   ├── kamus-kanji.js                    # Mesin pencari & filter ensiklopedia Kanji
│   ├── kamus-kana.js                     # Logika audio pelafalan & kartu Kana
│   ├── stroke.js                   # Animasi kanvas urutan goresan Yoon & kanji
│   ├── stroke-data.js              # Vektor koordinat garis KanjiVG terkurasi (dikecualikan dari watcher)
│   ├── stroke-overrides.js         # Lapisan override proteksi perbaikan manual & varian goresan
│   ├── carousel.js                 # Logika slider / carousel umum
│   ├── program-slider.js            # Slider khusus halaman kegiatan & proker
│   ├── kamus-translator.js               # Mesin terjemahan adaptif otomatis (ja-id / id-ja), keyboard draggable/resizable, & generator nama KTA
│   ├── quiz-divisi.js              # Kuis kepribadian & tes kecocokan 4 divisi
│   └── api.js                      # Koneksi endpoint data
│
├── panduan/                        # Dokumentasi & Panduan Proyek
│   ├── PANDUAN-DEVELOPER.md        # Buku panduan serah-terima pengurus & developer klub
│   ├── CONTEKAN-TAG.md             # Acuan cepat pemetaan halaman -> CSS -> JS (Otak Otomatis)
│   ├── tree.md                     # Peta struktur direktori lengkap proyek ini
│   ├── agent.md                    # Pedoman aturan desain, protokol eksekusi cepat, dan persona AI
│   └── ai-configs/                 # Konfigurasi AI Assistant (Clean Root Standard)
│       ├── .cursorrules            # Aturan otomatis untuk Cursor AI
│       ├── copilot-instructions.md # Instruksi otomatis untuk GitHub Copilot
│       └── README.md               # Panduan penggunaan AI rules di berbagai editor
│
├── data/                           # Basis Data Lokal JSON (Menyuplai Kamus & Latihan)
│   ├── README.md                   # Dokumentasi relasi & fungsi basis data JSON
│   ├── kamus-kana.json                   # Database aksara Hiragana & Katakana
│   ├── kanji-index.json            # Index ringkas 2.211 Kanji Joyo/JLPT untuk pencarian & filter kilat
│   ├── kanji/                      # Chunk detail kanji per JLPT (dimuat on-demand / idle)
│   │   ├── n5.json                 # Detail contoh kata & kalimat JLPT N5 (58 KB)
│   │   ├── n4.json                 # Detail contoh kata & kalimat JLPT N4 (135 KB)
│   │   ├── n3.json                 # Detail contoh kata & kalimat JLPT N3 (320 KB)
│   │   ├── n2.json                 # Detail contoh kata & kalimat JLPT N2 (280 KB)
│   │   └── n1.json                 # Detail contoh kata & kalimat JLPT N1 (734 KB)
│   ├── kamus-kanji.json                  # Database lengkap master 2.211 karakter Jōyō & JLPT (Single Source of Truth)
│   ├── kanji-meta.json             # Metadata radikal, level JLPT, & jumlah goresan
│   ├── stroke-master.json          # Master data koordinat goresan 2.375 karakter (Single Source of Truth)
│   ├── strokes/                    # Chunk koordinat vektor goresan per JLPT (dimuat on-demand)
│   │   ├── n5.json                 # Vektor goresan JLPT N5 (59 KB)
│   │   ├── n4.json                 # Vektor goresan JLPT N4 (174 KB)
│   │   ├── n3.json                 # Vektor goresan JLPT N3 (436 KB)
│   │   ├── n2.json                 # Vektor goresan JLPT N2 (448 KB)
│   │   └── n1.json                 # Vektor goresan JLPT N1 (1.695 KB)
│   ├── stroke-overrides.json       # Basis data lapisan override perbaikan goresan & varian kyōkasho
│   ├── stroke-coverage-manifest.json # Laporan manifest validasi cakupan data goresan
│   └── STROKES-LICENSE.md          # Lisensi data urutan goresan KanjiVG
│
├── tentang/                        # Halaman Profil Lengkap Klub Mirai No Hana
│   ├── index.html                  # Sejarah klub, filosofi bunga, bendera, Haori, dan 11 profil pengurus
│   └── images/                     # Aset foto spesifik halaman Tentang
│       ├── anggota/                # Dokumentasi foto anggota kepengurusan (1.jpg - 8.jpg)
│       └── identitas/              # Foto Haori resmi (depan/belakang), IDC, lanyard, nametag, & pin
│
├── lomba/                          # Halaman Informasi Kompetisi & Matsuri
│   ├── index.html                  # Informasi agenda lomba & festival jejepangan (3 halaman)
│   └── images/                     # Poster resmi lomba (ITS 1 & 2, UNAIR, UNESA 1 & 2)
│
├── kegiatan/                       # Halaman Program Kerja Unggulan & Fasilitas
│   ├── index.html                  # Hub Program & Fasilitas (4 Divisi, 5 Proker, Fasilitas, & Galeri Foto)
│   ├── kimi-to-nippon.html         # 1. Kimi To Nippon (Orientasi anggota baru klub)
│   ├── nihon-go-rajio.html         # 2. Nihon Go Rajio (Siaran radio mingguan sekolah)
│   ├── konbini.html                # 3. Mirai no Konbini (Bazaar & merchandise kreatif)
│   ├── ramadhan.html               # 4. Mirai no Ramadhan (Bakti sosial & takjil puasa)
│   ├── tomodachi.html              # 5. Tomodachi (Forum jejaring & perkenalan anggota)
│   └── images/                     # Aset spesifik program kerja & dokumentasi
│       ├── KTN.png                 # Logo Kimi To Nippon
│       ├── NGR.png                 # Logo Nihon Go Rajio
│       ├── Mirainokonbini.png       # Logo Mirai no Konbini
│       ├── Ramadhan.jpeg           # Logo Mirai no Ramadhan
│       ├── Miraimatsuri.png        # Logo Miraimatsuri
│       └── dokumentasi/            # Foto dokumentasi kegiatan landscape & portrait
│
├── toko/                           # Toko Resmi & Mirai no Konbini (Atribut, Cinderamata, & F&B)
│   └── index.html                  # Etalase produk Haori, merchandise, F&B konbini, keranjang, & GForm
│
├── kelas/                          # Halaman Modul Kelas & Kurikulum Pembelajaran Mandiri
│   ├── index.html                  # Hub utama terpadu (Kelas Dasar, Kelas Lanjutan, & Kurikulum Dokumen)
│   ├── latihan.html                # Kuis interaktif mandiri aksara Kana (20 soal & goresan kanvas)
│   ├── motivasi.html               # Kumpulan kata motivasi & mutiara bahasa Jepang
│   └── kurikulum/                  # Dokumen kurikulum & tata cara pengajaran (PDF)
│       ├── kurikulum-pembelajaran.pdf
│       ├── tata-cara-mengajar.pdf
│       └── README.txt
│
├── divisi/                         # Halaman 4 Divisi Resmi Klub
│   ├── index.html                  # Hub ringkasan struktur 4 divisi resmi
│   ├── bahasa.html                 # Divisi Bahasa & Budaya
│   ├── cosplay.html                # Divisi Cosplay & Seni Peran
│   ├── desain.html                 # Divisi Desain & Kreatif
│   └── kewirausahaan.html          # Divisi Kewirausahaan
│
├── kamus/                          # Kamus Interaktif & Ensiklopedia Aksara
│   ├── index.html                  # Kamus interaktif Kana (Hiragana & Katakana) serta pencarian Kanji
│   └── kanji.html                  # Ensiklopedia lengkap 2.136+ karakter Jōyō Kanji
│
├── peringkat/                      # Papan Peringkat (Leaderboard)
│   └── index.html                  # Leaderboard keaktifan Rajio, presensi kehadiran, & galeri prestasi siswa
│
├── rekomendasi/                    # Rekomendasi Media Belajar Budaya Jepang
│   └── index.html                  # Rekomendasi anime, film layar lebar, musik, dan konten kebudayaan
│
├── sora/                           # Ruang Asisten Obrolan Maskot Sora
│   ├── index.html                  # Halaman antarmuka obrolan interaktif Sora
│   └── images/                     # Aset khusus maskot Sora (soracarousel.png, sorachat.jpeg)
│
├── materi/                         # Buku Modul Pembelajaran Detail (Mirai no Buuku)
│   ├── dasar/
│   │   ├── index.html              # Daftar isi modul dasar
│   │   ├── hiragana.html           # Modul lengkap aksara Hiragana
│   │   ├── katakana.html           # Modul lengkap aksara Katakana
│   │   └── jikoshokai.html         # Modul perkenalan diri (Jikoshoukai)
│   └── lanjutan/
│       ├── index.html              # Daftar isi modul lanjutan
│       ├── kanji.html              # Panduan aksara Kanji & JLPT
│       └── grammar.html            # Panduan tata bahasa (Bunpou) lanjutan
│
├── skrip/                          # Pemeliharaan Kode Python
│   ├── README.md                   # Panduan skrip pengembang
│   ├── laporan/                    # Laporan & alat review visual otomatis
│   │   ├── stroke-review.html      # Alat review visual goresan mandiri (statis tanpa server)
│   │   ├── page-weight.md          # Laporan audit statis bobot halaman, aset, & ukuran transfer
│   │   └── perlu-terjemah.md       # Daftar 6 kanji yang memerlukan penerjemahan manual oleh pengurus
│   └── arsip/                      # Arsip skrip otomasi & pipeline (dikecualikan dari watcher)
│       ├── clean_kanji_data.py     # Pembersih duplikasi arti kata, kalimat template, & pemilih example_word
│       ├── build_data_chunks.py    # Generator chunk kanji & stroke lokal (offline-first & modular)
│       ├── build_precache_list.py  # Pembangun otomatis berkas precache & service-worker.js berbasis hash
│       ├── generate_pwa_icons.py   # Generator ikon PWA 192x192 & 512x512 dari logo resmi klub
│       ├── add_meta_tags.py        # Skrip batch injeksi meta tag SEO, Open Graph, twitter card, & sitemap
│       ├── build_stroke_review.py  # Pembangun antarmuka review visual goresan statis
│       ├── generate_stroke_overrides.py # Generator lapisan override label & varian kyōkasho
│       ├── fetch_kanjivg_strokes.py # Pipeline sinkronisasi & ekstraksi KanjiVG resmi (anti-overwrite)
│       ├── validate_stroke_data.py # Validator integritas struktur SVG & akurasi goresan
│       ├── test_stroke_engine.py   # Pengujian otomatis logika engine stroke & override
│       ├── test_kanji_engine.py    # Pengujian otomatis logika offline kanji, ranked search, & budget
│       ├── test_progress_engine.py # Pengujian unit test mesin progres mirai_progress_v1 & mini kuis
│       ├── test_mobile_responsiveness.py # Pengujian DOM mobile 360/390/430px, floating buttons, & aksesibilitas
│       ├── optimize_assets.py      # Otomasi atribut gambar (lazy/width/height) & link preconnect
│       ├── update_translator_and_keyboard.py # Otomasi penerjemah adaptif, tata letak laptop, & keyboard draggable/resizable
│       ├── fix_namegen_ui.py       # Perbaikan tata letak & UI/UX Generator Nama Jepang & KTA digital
│       ├── update_stroke_studio.py # Studio Goresan Interaktif 3 kotak, kanvas mandiri, auto-play, & lapor goresan pill
│       ├── fix_kegiatan_photos.py  # Pemulihan bentuk slider foto kegiatan & pembersihan banner kuis divisi
│       ├── reduce_lomba_pages.py   # Penyesuaian jumlah kartu kegiatan lomba & acara menjadi 3 halaman
│       ├── optimize_web_performance.py # Kompresi fisik gambar, WebP hero, preload, prefetch & SW cache-first
│       ├── apply_pattern_sweet_spot.py # Kunci Titik Emas 4 pattern (c1w 15%, c1b 11%, w1w 10%, w1b 13%)
│       ├── update_light_pattern_opacity.py # Penyesuaian visibilitas pola motif cerah (0.085) agar lebih jelas & anggun
│       ├── stamp_asset_versions.py # Cache-busting otomatis berbasis hash SHA-256 pada seluruh HTML
│       ├── report_page_weight.py   # Skrip analisis & pembuat laporan bobot halaman
│       ├── sync_datasets.py        # Sinkronisasi dataset kanji & perbaikan metadata
│       └── format_project.py       # Pemformat dan pembersih kode proyek
│
└── images/mirai/                   # Aset Bersama (Shared Global Assets)
    ├── background/                 # Pola Wagara master CSS (w1b, w1w, c1b, c1w, w2w, chat, Sora)
    ├── logo/                       # Logo resmi klub (MNH1.png, MNH1-nav.png, icon-192.png, icon-512.png)
    ├── icon/                       # Ikon chibi Genshin Impact (Al, Ay, Chi, Fa, Fu, Hu, Ka, Ki, Lo, dll.)
    ├── karakter/                   # Foto karakter anime kutipan (luf, ere, nar, dek, tan)
    ├── produk/                     # Foto produk konbini (oni, tak, dan, mat, teh)
    ├── stiker/                     # 28 stiker komunitas ekspresi karakter anime
    └── goresan-acuan/              # Direktori gambar acuan resmi bentuk goresan (<hex>.png)
```
