/**
 * File: js/program-slider.js
 * Fungsi: Pengendali interaktif slider galeri program kerja & dokumentasi kegiatan klub dengan touch swipe & tombol panah.
 * Penggunaan: kegiatan/index.html, kimi-to-nippon.html, konbini.html, nihon-go-rajio.html, ramadhan.html, tomodachi.html.
*/

function initIndependentSliders() {
const wrappers = document.querySelectorAll('.slider-wrapper');

wrappers.forEach((wrapper) => {
if (wrapper.dataset.sliderInitialized) return;
wrapper.dataset.sliderInitialized = 'true';

const slider = wrapper.querySelector('.independent-slider');
if (!slider) return;

const prevBtn = wrapper.querySelector('.prev-btn');
const nextBtn = wrapper.querySelector('.next-btn');

// Event Click Next (jika ada tombol)
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
  slider.scrollBy({ left: 250, behavior: 'smooth' });
  });
}

// Event Click Prev (jika ada tombol)
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
  slider.scrollBy({ left: -250, behavior: 'smooth' });
  });
}

// Auto-Slide Interval (setiap 3500ms)
let timer = null;
function startAutoSlide() {
  stopAutoSlide();
  timer = setInterval(() => {
  if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
  slider.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
  slider.scrollBy({ left: 250, behavior: 'smooth' });
  }
  }, 3500);
}

function stopAutoSlide() {
  if (timer) {
  clearInterval(timer);
  timer = null;
  }
}

startAutoSlide();

// Hentikan sementara saat di-hover atau disentuh agar interaksi user nyaman
wrapper.addEventListener('mouseenter', stopAutoSlide);
wrapper.addEventListener('mouseleave', startAutoSlide);
wrapper.addEventListener('touchstart', stopAutoSlide, { passive: true });
wrapper.addEventListener('touchend', startAutoSlide, { passive: true });

// Drag-to-scroll halus dengan Mouse / Trackpad click-drag
let isDown = false;
let startX = 0;
let scrollStart = 0;
let hasMoved = false;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  hasMoved = false;
  slider.classList.add('is-dragging');
  startX = e.pageX - slider.offsetLeft;
  scrollStart = slider.scrollLeft;
  stopAutoSlide();
});

window.addEventListener('mouseup', () => {
  if (isDown) {
  isDown = false;
  slider.classList.remove('is-dragging');
  startAutoSlide();
  }
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  hasMoved = true;
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.35;
  slider.scrollLeft = scrollStart - walk;
});

// Mencegah drag bawaan gambar browser saat drag manual
slider.querySelectorAll('img').forEach((img) => {
  img.addEventListener('dragstart', (e) => e.preventDefault());
  img.addEventListener('click', (e) => {
  if (hasMoved) {
  e.preventDefault();
  e.stopPropagation();
  }
  });
});

// Navigasi horizontal menggunakan wheel scroll mousepad / mouse
slider.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 6) {
  e.preventDefault();
  slider.scrollBy({ left: e.deltaY * 1.15, behavior: 'auto' });
  }
}, { passive: false });
});
}

// Slideable Horizontal Track untuk Divisi dan Program Kerja
// Mendukung drag mouse (desktop), touch swipe (mobile/tablet), dan mouse pad / trackpad gesture
function initCardSliders() {
const tracks = document.querySelectorAll('.division-grid, .program-grid');

tracks.forEach((track) => {
if (track.dataset.sliderInit) return;
track.dataset.sliderInit = 'true';

let isDown = false;
let startX = 0;
let scrollStart = 0;
let hasDragged = false;
let dragDist = 0;

// Cegah image ghost drag bawaan browser
track.querySelectorAll('img').forEach((img) => {
  img.addEventListener('dragstart', (e) => e.preventDefault());
});

track.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return; // Hanya tangani klik tombol kiri
  isDown = true;
  hasDragged = false;
  dragDist = 0;
  startX = e.pageX - track.offsetLeft;
  scrollStart = track.scrollLeft;
  track.classList.add('is-dragging');
});

window.addEventListener('mouseup', () => {
  if (!isDown) return;
  isDown = false;
  track.classList.remove('is-dragging');
  setTimeout(() => {
  hasDragged = false;
  dragDist = 0;
  }, 50);
});

track.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  const x = e.pageX - track.offsetLeft;
  const walk = x - startX;
  dragDist = Math.abs(walk);

  if (dragDist > 6) {
  hasDragged = true;
  e.preventDefault();
  track.scrollLeft = scrollStart - (walk * 1.3);
  }
});

// Cegah klik berpindah halaman jika user sedang melakukan drag geser kartu
track.addEventListener('click', (e) => {
  if (hasDragged || dragDist > 6) {
  e.preventDefault();
  e.stopPropagation();
  }
}, true);

// Navigasi horizontal menggunakan wheel / trackpad
track.addEventListener('wheel', (e) => {
  // Jika deltaX dominan (misal touchpad 2 jari swipe horizontal), biarkan native browser berjalan
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

  // Jika user menekan Shift sambil scroll wheel mouse
  if (e.shiftKey && Math.abs(e.deltaY) > 0) {
  e.preventDefault();
  track.scrollBy({ left: e.deltaY * 1.2, behavior: 'auto' });
  }
}, { passive: false });
});
}

function initAllSliders() {
initIndependentSliders();
initCardSliders();
}

// Tambahkan penjelajah program pada setiap halaman detail program kerja.
function addProgramExplorer() {
const main = document.querySelector('main#main-content');
const footer = document.querySelector('footer');
if (!main || !footer || document.querySelector('[data-program-explorer]')) return;

const page = location.pathname.split('/').pop();
const programs = [
  ['kimi-to-nippon.html', 'Kimi To Nippon', 'Orientasi hangat untuk mengenal keluarga besar Mirai no Hana.'],
  ['nihon-go-rajio.html', 'Nihon Go Rajio', 'Siaran radio sekolah dengan obrolan dan lagu Jejepangan.'],
  ['konbini.html', 'Konbini', 'Proyek kewirausahaan kreatif untuk kas dan kegiatan klub.'],
  ['ramadhan.html', 'Ramadhan', 'Aksi sosial dan kepedulian berbagi di bulan suci.'],
  ['tomodachi.html', 'Nihon Tomodachi', 'Kolaborasi budaya bersama sahabat dan komunitas luar.']
].filter(([href]) => href !== page);

if (programs.length !== 4) return;
const section = document.createElement('section');
section.className = 'proker-section program-explorer-section';
section.dataset.theme = 'dark';
section.dataset.programExplorer = '';
section.innerHTML = `
  <p class="proker-section-subtitle">EKSPLORASI PROGRAM</p>
  <h2 class="proker-section-title">Jelajahi program kerja lainnya.</h2>
  <div class="program-grid" style="margin-top:25px;">${programs.map(([href, title, desc], index) => `
    <a class="program-card-link" href="${href}"><article class="program-card">
      <img src="../images/mirai/logo/comingsoon.jpg" alt="Program ${title}" loading="lazy" decoding="async" width="2048" height="2048">
      <p class="card-number">Program ${index + 1}</p><h3>${title}</h3><p class="program-desc">${desc}</p>
      <span class="program-btn">Lihat Lebih Lanjut →</span>
    </article></a>`).join('')}</div>`;
footer.before(section);
initCardSliders();
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initAllSliders);
} else {
initAllSliders();
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', addProgramExplorer);
} else {
addProgramExplorer();
}

