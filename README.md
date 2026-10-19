# 🌸 MIRAI NO WEBU (未来のウェブ)

> **Website Resmi & Platform Edukasi Terpadu Klub Bahasa & Kebudayaan Jepang MIRAI NO HANA**  
> SMA Wachid Hasyim 2 (SMASYIMDUTA) Taman, Sidoarjo, Jawa Timur.

[![Status](https://img.shields.io/badge/Status-Aktif%20%7C%20Produksi-success.svg)](#)
[![Tampilan](https://img.shields.io/badge/Arsitektur-Clean%20Root%20%7C%20Motion%20Engine-e91e63.svg)](#)
[![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-181717.svg)](#)
[![Lisensi](https://img.shields.io/badge/Lisensi-Edukasi%20Non--Komersial-blue.svg)](#)
[![Bahasa](https://img.shields.io/badge/Bahasa-Indonesia%20%7C%20%E6%97%A5%E6%9C%AC%E8%AA%9E-pink.svg)](#)

---

## 📑 Daftar Isi

1. [Tentang Mirai no Webu](#-1-tentang-mirai-no-webu)
2. [Visi, Misi, & Tujuan](#-2-visi-misi--tujuan)
3. [Daftar & Penjelasan Fitur Lengkap](#-3-daftar--penjelasan-fitur-lengkap)
4. [Arsitektur Direktori (Clean Root Standard)](#-4-arsitektur-direktori-clean-root-standard)
5. [Sumber Daya, Pustaka, & API (Sources & Credits)](#-5-sumber-daya-pustaka--api-sources--credits)
6. [Penafian Hak Cipta & Perlindungan Hukum (Legal Disclaimer & Fair Use)](#-6-penafian-hak-cipta--perlindungan-hukum-legal-disclaimer--fair-use)
7. [Kebijakan Penghapusan Konten (Notice & Take Down Policy)](#-7-kebijakan-penghapusan-konten-notice--take-down-policy)
8. [Panduan Menjalankan Proyek secara Lokal](#-8-panduan-menjalankan-proyek-secara-lokal)
9. [Kontak & Media Sosial](#-9-kontak--media-sosial)

---

## 🌸 1. Tentang Mirai no Webu

**Mirai no Webu (未来のウェブ)** adalah portal web edukasi terpadu dan media informasi resmi yang dirancang serta dikembangkan secara independen oleh kepengurusan **Klub Bahasa & Kebudayaan Jepang MIRAI NO HANA** di SMA Wachid Hasyim 2 Taman (SMASYIMDUTA) Sidoarjo.

Website ini lahir dari semangat para pengurus dan anggota untuk mendigitalkan proses belajar bahasa Jepang, mendokumentasikan kegiatan ekstrakurikuler, memfasilitasi 4 divisi karya siswa (Bahasa, Cosplay, Desain Grafis, dan Kewirausahaan), serta menyediakan platform mandiri yang dapat diakses secara gratis oleh seluruh siswa dan masyarakat pecinta budaya Jepang kapan saja dan di mana saja.

---

## 🎯 2. Visi, Misi, & Tujuan

### A. Visi
Menjadi platform digital ekstrakurikuler sekolah terdepan di Jawa Timur yang memadukan keindahan budaya tradisional Jepang, teknologi antarmuka web modern, dan metode pembelajaran bahasa yang interaktif dan menyenangkan.

### B. Misi
1. Menyediakan bahan belajar aksara (Hiragana, Katakana, Kanji) dan tata bahasa Jepang yang terstruktur, ramah pemula, dan dapat diakses secara gratis.
2. Memberikan fasilitas latihan interaktif mandiri dengan umpan balik visual langsung (*real-time tracing & scoring*).
3. Mendokumentasikan secara transparan seluruh program kerja, kalender kompetisi/festival, capaian prestasi lomba, serta profil kepengurusan klub.
4. Menjadi jembatan komunikasi dan jejaring antara pengurus, anggota aktif, alumni, dan komunitas jejepangan sekolah lain.

### C. Tujuan Pembuatan Website
* **Bebas Ketergantungan Server Berbayar**: Berjalan murni sebagai *Static Web Application* berkecepatan tinggi yang di-host di GitHub Pages.
* **Mendukung Pembelajaran Mandiri (Jisyū)**: Membantu siswa yang ingin mempelajari bahasa Jepang secara otodidak di luar jam tatap muka ekstrakurikuler mingguan.
* **Arsip Digital Abadi**: Menjadi rekaman jejak sejarah organisasi, regenerasi kepengurusan, dan galeri prestasi klub dari generasi ke generasi.

---

## ✨ 3. Daftar & Penjelasan Fitur Lengkap

Website **Mirai no Webu** terdiri dari berbagai modul tematik yang memiliki peran dan fungsinya masing-masing:

### 1. ⛩️ Gerbang Utama Beranda (`/index.html`)
* **Pusat Informasi & Showcase**: Menampilkan ringkasan seluruh pilar klub, filosofi nama bunga masa depan (*Mirai no Hana*), kartu fitur interaktif bermotif Wagara, slider kutipan harian, dan navigasi seluler off-canvas responsif.
* **Peluncur Cepat Sora**: Mengintegrasikan tombol widget mengambang (*floating drawer*) chatbot Sora bergaya minimalis untuk konsultasi cepat materi.

### 2. 📖 Modul Kelas & Kurikulum Terpadu (`/kelas/`)
* **Hub Terpadu Kelas & Kurikulum (`kelas/index.html`)**: Gerbang utama pembelajaran mandiri satu halaman yang menggabungkan:
  * **Seksi Kelas Dasar (`#dasar`)**: Akses cepat modul Latihan Kana, Kamus Hiragana, Kamus Katakana, dan Mirai no Buuku Dasar.
  * **Seksi Kelas Lanjutan (`#lanjutan`)**: Modul Kamus Kanji dan Mirai no Buuku Lanjutan berlatar obsidian elegan.
  * **Seksi Kurikulum & Tata Cara Pengajaran (`#kurikulum`)**: Pemetaan silabus kurikulum resmi dan panduan tutor lengkap dengan tombol unduhan & pratinjau dokumen PDF (*Kurikulum Pembelajaran* & *Tata Cara Mengajar*).
* **Latihan Mandiri Interaktif 20 Soal (`kelas/latihan.html`)**:
  * Bank soal 20 kuis teracak dinamis yang terdiri dari 10 soal pilihan ganda kana-romaji, 4 soal kosakata, 1 soal pasangkan kata, dan **5 Soal Tantangan Menulis Goresan Kana (Duolingo-Style Stroke Tracing)**.
  * Fitur tracing tulisan tangan dilengkapi kanvas kisi *Genkōyōshi* interaktif, panduan titik awal & garis putus-putus cerdas saat keliru, petunjuk Romaji tunggal di atas kanvas, serta algoritma toleransi kurva bersahabat (*menceng dikit tetap dinilai benar*).
* **Motivasi & Tips Belajar (`kelas/motivasi.html`)**: Panduan teknik belajar bahasa Jepang otodidak, kiat menghafal alfabet dengan mnemonik visual, penerapan filosofi *Kaizen*, dan rekomendasi manajemen waktu belajar.

### 3. 🔍 Kamus Interaktif & Ensiklopedia Kanji (`/kamus/`)
* **Kamus Utama (`kamus/index.html`)**: Mesin pencari kosakata interaktif yang mampu mengenali input Romaji, Aksara Kana, maupun Bahasa Indonesia. Menyediakan terjemahan arti, bacaan furigana, dan **animasi urutan goresan stroke (*stroke order animation*)** yang dapat diputar ulang per langkah.
* **Ensiklopedia Kanji (`kamus/kanji.html`)**: Katalog lengkap 2.136 karakter Jōyō Kanji standar Jepang. Dilengkapi penyaring tingkat ujian JLPT (N5, N4, N3, N2, N1), jumlah goresan (*stroke count*), arti kata dalam Bahasa Indonesia, bacaan On'yomi & Kun'yomi, serta contoh kata majemuk (*jukugo*).

### 4. 🎏 Program Kerja & Fasilitas (`/kegiatan/`)
* **Hub Program Kerja (`kegiatan/index.html`)**: Ringkasan etalase kegiatan 4 divisi klub dan fasilitas inventaris.
* **1. Kimi to Nippon / KTN (`kegiatan/kimi-to-nippon.html`)**: Program tahunan masa orientasi dan penyambutan anggota baru untuk mengenalkan budaya Jepang dan kehangatan keluarga klub.
* **2. Nihon Go Rajio / NJR (`kegiatan/nihon-go-rajio.html`)**: Program siaran radio sekolah mingguan yang mengudarakan lagu-lagu J-Pop, tips kosakata praktis, dan ulasan budaya pop Jepang.
* **3. Mirai no Konbini (`kegiatan/konbini.html`)**: Wadah bazaar dan kewirausahaan siswa yang memproduksi serta menjual kuliner khas Jepang dan merchandise kreatif karya anggota.
* **4. Mirai no Ramadhan (`kegiatan/ramadhan.html`)**: Kegiatan bakti sosial keagamaan di bulan suci Ramadhan berupa pembagian takjil gratis dan santunan masyarakat sekitar.
* **5. Tomodachi (`kegiatan/tomodachi.html`)**: Forum keakraban santai antar-anggota aktif dan temu alumni untuk mempererat silaturahmi dan *sharing session*.
* **Galeri Fasilitas**: Showcase inventaris resmi klub meliputi seragam Haori kustom, jubah Happi festival, pin lencana logam, lanyard, kartu identitas anggota (IDC), dan perpustakaan modul belajar.

### 5. 🛍️ Toko Resmi Klub & Mirai no Konbini (`/toko/index.html`)
* **Etalase Produk Terpadu**: Katalog 16 produk resmi mencakup busana Haori klub, jubah Happi festival, atribut identitas (IDC, pin, lanyard), stan kuliner Mirai no Konbini (onigiri, dorayaki, matcha), serta cinderamata kreatif buatan siswa.
* **Fitur Filter & Keranjang Belanja**: Penyaring kategori instan, pencarian nama produk, pengurutan harga/nama, serta simulasi keranjang belanja melayang (*floating cart*) yang otomatis menyalin rincian pesanan dan mengarahkannya ke formulir resmi Google Form.
* **Transparansi Kas Mandiri & FAQ**: Edukasi kewirausahaan siswa mengenai alokasi keuntungan untuk kas klub, panduan 4 langkah pemesanan, dan accordion FAQ pra-pesan.

### 6. 👥 Profil 4 Divisi Resmi (`/divisi/`)
* **Hub Divisi (`divisi/index.html`)**: Struktur 4 pilar minat & bakat siswa di Mirai no Hana.
* **Divisi Bahasa (`divisi/bahasa.html`)**: Berfokus pada penguasaan tata bahasa, percakapan (*kaiwa*), persiapan lomba pidato/cerdas cermat, dan sertifikasi JLPT.
* **Divisi Cosplay (`divisi/cosplay.html`)**: Berfokus pada seni peran karakter, perancangan busana (*costume making*), tata rias (*make up*), serta etika bercosplay yang positif.
* **Divisi Desain Grafis (`divisi/desain.html`)**: Berfokus pada pembuatan ilustrasi anime digital, desain poster kegiatan, visual media sosial, dan antarmuka web.
* **Divisi Kewirausahaan (`divisi/kewirausahaan.html`)**: Berfokus pada manajemen bazaar Mirai no Konbini, pengelolaan keuangan kas, dan produksi cinderamata klub.

### 7. 🏆 Papan Peringkat & Prestasi (`/peringkat/index.html`)
* **Gamifikasi Keaktifan**: Sistem rekapitulasi poin keaktifan, presensi latihan mingguan, dan kuis anggota. Menampilkan podium 3 besar bersih dengan avatar karakter chibi dan daftar peringkat keaktifan.
* **Etalase Piala Kejuaraan**: Dokumentasi rekam jejak kemenangan delegasi klub pada berbagai kompetisi tingkat kota, provinsi, hingga nasional.

### 8. 🎌 Kalender Lomba & Matsuri (`/lomba/index.html`)
* Papan pengumuman terpadu seputar 18 agenda kompetisi bahasa/budaya Jepang dan festival kebudayaan (Matsuri & Bunkasai) di lingkungan universitas Jawa Timur (seperti Bunkasai ITS, Bunkasai UNAIR, Matsuri UNESA, dll.).

### 9. 🎬 Rekomendasi Media Belajar (`/rekomendasi/index.html`)
* Kurasi judul anime, film drama, dan lagu Jepang ramah pelajar yang memiliki nilai edukasi tinggi untuk melatih kemampuan menyimak (*choukai*) dan menambah perbendaharaan kosakata.

### 10. 🌸 Profil Klub & Kepengurusan (`/tentang/index.html`)
* Sejarah pendirian klub, filosofi nama bunga masa depan (*Mirai no Hana*), lambang bendera organisasi, makna filosofis motif busana Haori/Happi, profil foto kepengurusan aktif dan demisioner, serta kanal formulir masukan, kritik, dan saran Google Form.

### 11. 🤖 Asisten Obrolan Maskot Sora (`/sora/index.html` & Widget Mengambang)
* Bot pendamping virtual bernama **Asora Aokita (Sora)** dengan persona gadis SMA yang ceria, ramah, dan suportif.
* Dilengkapi mesin penjawab offline lokal berbasis pola kata kunci (*fallbackReply*), generator stiker anime acak, serta dukungan format Markdown rapi via Marked.js & DOMPurify.

### 12. 💫 Mesin Gerakan Native (*Native Motion Engine*)
* **W3C View Transitions API**: Navigasi antar halaman berlangsung mulus dengan transisi *cross-fade* lembut tanpa jeda layar putih.
* **Page Entrance Motion**: Setiap halaman yang dimuat menampilkan animasi masuk lembut ke atas (`contentSlideIn` & `pageFadeIn`) dengan kurva *decelerate* modern `cubic-bezier(0.16, 1, 0.3, 1)`.
* **Automatic Scroll Reveal**: Seluruh kartu komponen otomatis terhubung ke `IntersectionObserver` di `main.js` dengan jeda kemunculan berjenjang (*stagger delay*).
* **Aksesibilitas Terjaga**: Mendukung penuh `@media (prefers-reduced-motion: reduce)` bagi pengguna yang sensitif terhadap animasi gerak.

### 13. 🚫 Halaman 404 Estetik (`/404.html`)
* Halaman penanganan tautan salah ketik berdesain elegan khas tema obsidian-pink Mirai no Hana, dilengkapi ilustrasi maskot Sora yang tersesat dan tombol kembali cepat ke Beranda, Kamus, atau Kelas.

### 14. 🌸 Hero Sticky Curtain Reveal & Akses Media Sosial Cepat (Universal)
* **Sticky Curtain Reveal & Scroll-Ascending Effect**: Seluruh banner hero website (`.hero`, `.page-hero`, `.proker-hero`, `.quest-hero`) menerapkan arsitektur *Sticky Curtain Reveal* (`position: sticky; top: 0; z-index: 1;`). Gambar latar Sora **ketinggal dan menetap diam di layar** tanpa pergeseran background (bebas celah hitam), sementara seksi materi/konten di bawahnya meluncur naik menutupi / "memakan" latar hero secara fisik dengan bayangan elevasi tebal dramatis dan background solid saat pengguna melakukan scrolling. Teks judul hero dan tombol medsos bergerak naik ke atas secara solid 100% tanpa style transparansi/opacity.
* **Akses Media Sosial Cepat**: Tombol lingkaran kaca mengambang vertikal di pojok kanan hero yang posisinya sejajar dengan teks judul hero menghubungkan pengunjung langsung ke [Instagram](https://www.instagram.com/mirainohana_smawh2) dan [TikTok](https://www.tiktok.com/@nihongo.kurabu.wh2) resmi klub. Dilengkapi integrasi penuh ke protokol auto-hide floating controls.

---

## 📂 4. Arsitektur Direktori (Clean Root Standard)

Repositori ini menerapkan standar **Clean Root Architecture** dan **Feature-Based Asset Colocation**, di mana berkas/foto yang spesifik berkaitan dengan modul tertentu berada di dalam folder modul tersebut:

```text
Mirai-No-Webu/
├── index.html                      # Gerbang utama website (Beranda)
├── 404.html                        # Halaman penanganan tautan salah / tidak ditemukan
├── README.md                       # Profil utama repositori & dokumentasi Sources & Credits
│
├── css/                            # Master Stylesheet Antarmuka
│   └── style.css                   # Master CSS (Tema Obsidian Wagara, Responsif, & Motion Engine)
│
├── js/                             # Logika Modular JavaScript (Vanilla JS Tanpa Framework)
│   ├── main.js                     # Navigasi, sidebar mobile, pipeline scroll reveal, & inisialisasi
│   ├── script.js                   # Mesin interaksi kartu wagara & animasi global
│   ├── kanji.js                    # Mesin pencari & penyaring ensiklopedia Kanji
│   ├── kana.js                     # Logika kartu alfabet Kana & pelafalan audio
│   ├── stroke.js                   # Mesin animasi urutan goresan kanji & yoon
│   ├── stroke-data.js              # Basis data vektor koordinat KanjiVG terkurasi
│   ├── leaderboard-data.js         # Master data profil peringkat & prestasi
│   ├── carousel.js                 # Logika slider / carousel galeri umum
│   ├── proker-slider.js            # Slider khusus halaman kegiatan & proker
│   ├── translator.js               # Mesin pembantu terjemahan kosakata
│   ├── api.js                      # Koneksi endpoint data kamus & kamus API
│   └── sora.js                     # Logika obrolan cerdas & respon offline maskot Sora
│
├── kelas/                          # Hub Pembelajaran Kelas & Kurikulum Mandiri
│   ├── index.html                  # Hub utama terpadu (Kelas Dasar, Kelas Lanjutan, & Kurikulum Dokumen)
│   ├── latihan.html                # Latihan mandiri 20 soal acak & Duolingo stroke tracing
│   ├── motivasi.html               # Artikel motivasi belajar otodidak
│   └── kurikulum/                  # Dokumen silabus kurikulum PDF resmi klub
│
├── kamus/                          # Kamus & Ensiklopedia Kanji
│   ├── index.html                  # Kamus interaktif pencarian Kana & Kanji
│   └── kanji.html                  # Direktori 2.136 Jōyō Kanji & detail radikal
│
├── kegiatan/                       # Program Kerja & Fasilitas
│   ├── index.html                  # Hub proker & etalase fasilitas
│   ├── kimi-to-nippon.html         # Proker 1: Kimi to Nippon (KTN)
│   ├── nihon-go-rajio.html         # Proker 2: Nihon Go Rajio (NJR)
│   ├── konbini.html                # Proker 3: Mirai no Konbini
│   ├── ramadhan.html               # Proker 4: Mirai no Ramadhan
│   ├── tomodachi.html              # Proker 5: Tomodachi
│   └── images/                     # Aset foto logo proker & dokumentasi kegiatan
│
├── toko/                           # Toko Resmi Klub & Mirai no Konbini
│   └── index.html                  # Etalase produk Haori, cinderamata, kuliner, & GForm
│
├── tentang/                        # Profil Lengkap Klub & Kepengurusan
│   ├── index.html                  # Sejarah, filosofi bendera, Haori, & 11 pengurus
│   └── images/                     # Aset foto anggota kepengurusan & busana identitas
│       ├── anggota/                # Foto pengurus (1.jpg - 8.jpg)
│       └── identitas/              # Foto Haori, Happi, IDC, lanyard, pin, & nametag
│
├── divisi/                         # Struktur 4 Divisi Resmi Klub
│   ├── index.html                  # Hub divisi
│   ├── bahasa.html                 # Divisi Bahasa
│   ├── cosplay.html                # Divisi Cosplay
│   ├── desain.html                 # Divisi Desain Grafis
│   └── kewirausahaan.html          # Divisi Kewirausahaan
│
├── lomba/                          # Informasi Matsuri & Kompetisi
│   ├── index.html                  # Informasi agenda lomba & festival jejepangan (3 halaman)
│   └── images/                     # Poster resmi kompetisi (ITS, UNAIR, UNESA)
│
├── peringkat/                      # Papan Peringkat & Prestasi
│   └── index.html                  # Papan poin keaktifan, podium juara, & etalase piala
│
├── rekomendasi/                    # Rekomendasi Media Belajar
│   └── index.html                  # Rekomendasi anime, film drama, & musik edukatif
│
├── sora/                           # Playground Asisten Chatbot Sora
│   ├── index.html                  # Antarmuka penuh obrolan Sora
│   └── images/                     # Banner profil etalase Sora & avatar chat
│
├── data/                           # Basis Data Lokal JSON (Menyuplai Kamus & Latihan)
│   ├── README.md                   # Dokumentasi relasi & struktur basis data JSON
│   ├── kana.json                   # Database aksara Hiragana & Katakana lengkap
│   ├── kanji.json                  # Database lengkap 2.136 karakter Jōyō Kanji
│   ├── kanji-meta.json             # Metadata radikal, level JLPT, & jumlah goresan
│   └── STROKES-LICENSE.md          # Lisensi resmi data goresan KanjiVG
│
├── panduan/                        # Dokumentasi Arsitektur & Panduan AI
│   ├── PANDUAN-DEVELOPER.md        # Buku panduan serah-terima pengurus & developer klub
│   ├── CONTEKAN-TAG.md             # Acuan cepat pemetaan halaman -> CSS -> JS
│   ├── tree.md                     # Peta pohon direktori komprehensif
│   ├── agent.md                    # Pedoman aturan desain, fungsi, dan persona asisten
│   └── ai-configs/                 # Konfigurasi AI Assistant (Cursor, Copilot, dll.)
│
├── skrip/                          # Skrip Otomasi & Pemeliharaan Kode Python
│   ├── README.md                   # Panduan kegunaan skrip pemeliharaan
│   └── *.py                        # Kumpulan skrip perbaikan tautan, kartu, & teks
│
└── images/                         # Aset Grafis Bersama (Shared Assets)
    └── mirai/
        ├── logo/                   # Logo resmi klub & favicon navigasi
        ├── background/             # Pola Wagara Jepang (Seigaiha, Kumo, Asanoha)
        ├── icon/                   # 20 Ikon chibi resmi Genshin Impact untuk profil/peringkat
        ├── karakter/               # Foto potret karakter anime kutipan (luf, ere, nar, dek, tan)
        ├── produk/                 # Foto produk kuliner & minuman konbini (oni, tak, dan, mat, teh)
        └── stiker/                 # Koleksi stiker anime ekspresi untuk reaksi obrolan
```

---

## 📜 5. Sumber Daya, Pustaka, & API (Sources & Credits)

Sebagai wujud integritas akademik, keterbukaan informasi, dan penghormatan setinggi-tingginya kepada para pencipta karya intelektual asli, seluruh sumber daya yang digunakan di website ini didokumentasikan secara transparan:

| Komponen / Aset | Sumber / Pengembang Asli | Lisensi / Distribusi | Fungsi & Peruntukan di Website |
| :--- | :--- | :--- | :--- |
| **Vektor Goresan Huruf** | [KanjiVG Project](https://kanjivg.tagaini.net) (Ulrich Apel & Kontributor) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Koordinat vektor kurva SVG untuk animasi urutan goresan karakter Kanji, Hiragana, Katakana, dan kombinasi Yoon di Kamus dan Latihan Mandiri. |
| **Tipografi Jepang** | [Noto Sans JP](https://fonts.google.com/specimen/Noto+Sans+JP) & [Noto Serif JP](https://fonts.google.com/specimen/Noto+Serif+JP) (Google Fonts) | SIL Open Font License 1.1 | Tipografi utama karakter kanji, hiragana, dan katakana agar tampil tajam dan standar. |
| **Tipografi Antarmuka** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Tokotype / Gumpita Rahayu) & [Nunito](https://fonts.google.com/specimen/Nunito) | SIL Open Font License 1.1 | Tipografi antarmuka teks bahasa Indonesia, judul section, dan tulisan alfabet Latin. |
| **Tipografi Aksen** | [M PLUS Rounded 1c](https://fonts.google.com/specimen/M+PLUS+Rounded+1c) (Coju Mairyo / Google Fonts) | SIL Open Font License 1.1 | Tipografi angka lencana, penanda Romaji, dan elemen visual ceria. |
| **Ikon Antarmuka** | [Font Awesome 6](https://fontawesome.com) (Fonticons, Inc.) | CC BY 4.0 / SIL OFL | Ikon navigasi, tombol media sosial, panah, dan indikator status. |
| **Stiker & Reaksi Anime** | Koleksi Komunitas Kreatif / [Pinterest](https://www.pinterest.com) | Fan Art / Non-Commercial Educational Fair Use | Ilustrasi ekspresi stiker reaksi obrolan asisten Sora dan pemanis interaksi. |
| **Ikon Chibi Karakter** | [HoYoverse / Cognosphere Pte., Ltd.](https://www.hoyoverse.com) (*Genshin Impact*) | Hak Cipta Milik HoYoverse (Digunakan secara Non-Komersial) | 20 avatar chibi resmi karakter game untuk lencana profil anggota, kartu modul, dan podium papan peringkat. |
| **Pola Tradisional Wagara** | Desain Motif Tradisional Jepang (Seigaiha, Asanoha, Kumo) | Public Domain Heritage | Pola tekstur latar belakang seksi selang-seling hitam dan putih. |
| **Poster Kompetisi & Acara** | Panitia Bunkasai ITS, UNAIR, UNESA | Materi Publikasi Publik Acara | Pengumuman kalender kegiatan kompetisi dan festival kebudayaan bagi anggota klub. |
| **Dokumentasi Foto & Busana** | Tim Dokumentasi & Desain Internal MIRAI NO HANA | Hak Cipta Internal Klub | Foto anggota kepengurusan, desain busana Haori/Happi, dan liputan program kerja. |
| **Basis Data Aksara & Kosakata** | [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) & [JMdict](https://www.edrdg.org/jmdict/j_jmdict.html) (EDRDG — Jim Breen dkk) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Basis data 2.211 Joyo & JLPT Kanji, arti bahasa Indonesia terkurasi, onyomi, kunyomi, dan contoh kosakata. Seluruh data merupakan karya terbuka komunitas nirlaba internasional. |
| **Pustaka Romaji ke Kana** | [WanaKana.js](https://wanakana.com) | MIT License | Konversi otomatis teks Romaji ke karakter Hiragana/Katakana di peramban. |
| **Markdown Parser** | [Marked.js](https://marked.js.org) (Christopher Jeffrey) | MIT License | Mengurai teks berformat Markdown pada gelembung percakapan asisten Sora. |
| **Pembersih Sanitasi HTML** | [DOMPurify](https://github.com/cure53/DOMPurify) (Cure53) | Apache-2.0 / MPL-2.0 | Mencegah celah kerentanan Cross-Site Scripting (XSS) pada antarmuka chat. |
| **API Pembantu Terjemahan** | [MyMemory Translated API](https://mymemory.translated.net) | Free Educational Tier | Endpoint pembantu terjemahan kosakata otomatis. |
| **Mesin Gerakan Antarmuka** | Native CSS3 & W3C Cross-Document View Transitions API | Standar Web Native (Zero Dependency) | Mesin transisi halaman mulus, cascading delays, dan scroll reveal tanpa library luar. |
| **Saluran Media Sosial Resmi** | [Instagram @mirainohana_smawh2](https://www.instagram.com/mirainohana_smawh2) & [TikTok @nihongo.kurabu.wh2](https://www.tiktok.com/@nihongo.kurabu.wh2) | Kanal Publik Resmi Klub | Saluran publikasi resmi klub, pengumuman kegiatan, dan interaksi multimedia anggota. |

---

## ⚖️ 6. Penafian Hak Cipta & Perlindungan Hukum (Legal Disclaimer & Fair Use)

Pernyataan ini dibuat sebagai landasan hukum yang sah dan itikad baik (*good faith declaration*) demi melindungi pengembang, pengurus klub, serta institusi sekolah:

### A. Sifat Proyek Murni Nirlaba & Edukasi Non-Komersial
Website **Mirai no Webu** adalah karya proyek ekstrakurikuler siswa yang bersifat **100% Non-Komersial dan Nirlaba (Non-Profit Educational Project)**.
* Website ini **TIDAK PERNAH** memungut biaya dari pengunjung, tidak menjual produk berhak cipta, tidak menampilkan iklan komersial berbayar (seperti Google AdSense atau banner afiliasi berbayar), dan tidak memonetisasi data pengguna dalam bentuk apa pun.
* Segala materi yang disajikan murni ditujukan sebagai media pembelajaran bahasa Jepang, apresiasi kebudayaan, dan arsip kegiatan sekolah bagi siswa-siswi SMA Wachid Hasyim 2 Taman beserta masyarakat umum.

### B. Hak Cipta Gambar, Fanart, & Media Visual dari Pihak Ketiga (Termasuk Pinterest)
* Pengembang menyadari bahwa beberapa aset visual ilustrasi, stiker reaksi ekspresi anime, dan gambar pendukung dihimpun dari platform publik seperti **Pinterest**, media sosial, dan forum komunitas penggemar pop-kultur Jepang.
* **Pengembang dan Pengurus Klub MIRAI NO HANA TIDAK PERNAH mengklaim kepemilikan hak cipta atas karya-karya ilustrasi pihak ketiga tersebut.** Seluruh hak cipta, merek dagang, dan hak kekayaan intelektual atas karya seni visual tetap sepenuhnya menjadi milik eksklusif masing-masing kreator asli, seniman (*artist/illustrator*), studio animasi, atau perusahaan pemegang lisensi aslinya.
* Karakter Chibi (seperti Albedo, Kamisato Ayaka, Tartaglia, Diluc, Fischl, Hu Tao, Kaedehara Kazuha, Klee, Nahida, Kujou Sara, Zhongli, dll.) merupakan kekayaan intelektual terdaftar milik **HoYoverse / Cognosphere Pte., Ltd. (Genshin Impact)**. Pemanfaatannya dalam website ini semata-mata sebagai bentuk apresiasi karya (*fan appreciation*) untuk memeriahkan lencana profil siswa non-komersial.

### C. Doktrin Penggunaan Wajar (Fair Use Disclaimer)
Penyertaan kutipan materi, karya seni pendukung, dan pustaka di dalam website ini memenuhi kriteria **Penggunaan Wajar (Fair Use)** yang diakui secara hukum:
1. **Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta (Pasal 44)**:
   > *"Penggunaan, pengambilan, penggandaan, dan/atau pengubahan suatu Ciptaan dan/atau produk Hak Terkait secara seluruh atau sebagian yang substansial tidak dianggap sebagai pelanggaran Hak Cipta jika sumbernya disebutkan atau dicantumkan secara lengkap untuk keperluan: a. pendidikan, penelitian, penulisan karya ilmiah, penyusunan laporan, penulisan kritik atau tinjauan suatu masalah dengan tidak merugikan kepentingan yang wajar dari Pencipta atau Pemegang Hak Cipta..."*
2. **United States Copyright Act of 1976 (17 U.S. Code § 107 - Fair Use)**:
   > Mengizinkan pemanfaatan materi berhak cipta untuk tujuan pengajaran, kritik, komentar, pelaporan berita, dan penelitian nirlaba.
3. **Konvensi Bern (Berne Convention for the Protection of Literary and Artistic Works - Article 10)** mengenai pemanfaatan wajar ilustrasi untuk sarana pengajaran (*teaching illustrations*).

---

## 📩 7. Kebijakan Penghapusan Konten (Notice & Take Down Policy)

Klub MIRAI NO HANA berkomitmen penuh untuk menghormati dan menjunjung tinggi hak moral serta hak ekonomi para seniman dan pemilik hak cipta.

Apabila Anda adalah pencipta asli, ilustrator, atau pemilik sah dari karya cipta (gambar, ilustrasi, foto, atau materi apa pun) yang ditampilkan di website ini, dan Anda:
1. **Menginginkan Pencantuman Kredit Nama/Tautan Portofolio** secara lebih eksplisit pada karya Anda; **ATAU**
2. **Berkeberatan atas penayangan karya tersebut** dan menghendaki agar karya Anda segera diturunkan/dihapus dari website kami;

Maka dengan penuh rasa hormat kami memohon agar Anda berkenan menghubungi tim pengembang kami terlebih dahulu melalui itikad baik (*amicable solution*) melalui:

* 📱 **Instagram Resmi**: [@mirainohana_smawh2](https://www.instagram.com/mirainohana_smawh2?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==) *(Kirimkan Direct Message dengan menyertakan tautan berkas & bukti kepemilikan hak cipta)*
* 🏫 **Sekretariat Klub**: Ekstrakurikuler Bahasa Jepang MIRAI NO HANA, SMA Wachid Hasyim 2 Taman, Sidoarjo, Jawa Timur.

**Komitmen Kami:**
Setelah menerima pesan dan verifikasi kepemilikan yang sah, tim pengembang akan segera menindaklanjuti permintaan Anda dengan **memperbarui atribusi kredit ATAU menghapus berkas gambar tersebut secara permanen dalam waktu maksimal 1 × 24 jam hingga 2 × 24 jam kerja**.

---

## 🚀 8. Panduan Menjalankan Proyek secara Lokal

Website ini dibangun menggunakan standar **Modern Native Web (HTML5, CSS3, Vanilla JavaScript)** tanpa memerlukan kompilasi rumit (*zero build-step*). Anda dapat langsung menjalankannya secara lokal:

### Opsi 1: Menggunakan Python 3 (Sangat Disarankan)
Buka terminal pada direktori repositori ini, kemudian ketik:
```bash
python3 -m http.server 8000
```
Buka browser dan kunjungi: `http://localhost:8000`

### Opsi 2: Menggunakan Ekstensi VS Code Live Server
1. Buka folder repositori di Visual Studio Code.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey).
3. Klik kanan pada berkas `index.html` dan pilih **Open with Live Server**.

---

## 🌸 9. Kontak & Media Sosial

* **Nama Organisasi**: Ekstrakurikuler Bahasa & Kebudayaan Jepang MIRAI NO HANA
* **Institusi Induk**: SMA Wachid Hasyim 2 (SMASYIMDUTA) Taman, Sidoarjo
* **Akun Instagram Resmi**: [@mirainohana_smawh2](https://www.instagram.com/mirainohana_smawh2?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==)
* **Akun TikTok Resmi**: [@nihongo.kurabu.wh2](https://www.tiktok.com/@nihongo.kurabu.wh2?is_from_webapp=1&sender_device=pc)
* **Repositori & Akun GitHub Resmi**: [nihongokurabuwh/Mirai-No-Webu](https://github.com/nihongokurabuwh/Mirai-No-Webu)
* **Tahun Operasional**: 2026 (Kabinet Sora)
* **Status Hosting**: GitHub Pages (`https://nihongokurabuwh.github.io/Mirai-No-Webu` / Repositori Mirai-No-Webu)

---
*Dokumen ini diperbarui secara berkala demi menjamin transparansi, integritas informasi, dan kepatuhan hukum hak cipta.*
