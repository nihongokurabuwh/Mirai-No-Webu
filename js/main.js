/**
 * File: js/main.js
 * Fungsi: Pengendali UI global (navbar, sidebar drawer, hero sticky curtain, back-to-top, scroll reveal, dan tema).
 * Penggunaan: Universal di seluruh 30 halaman HTML website (index.html, tentang, kelas, kegiatan, divisi, lomba, toko, dll.).
*/

/* ==========================================================================
MIRAI AUDIO / SFX ENGINE (Web Audio API Synthesizer)
Menghadirkan sound effect UI yang jernih, responsif, dan terdengar jelas
di desktop & mobile tanpa ketergantungan aset eksternal.
========================================================================== */

const MiraiSound = {
audioCtx: null,
enabled: true,
lastPlayTime: 0,
lastClickTime: 0,

getContext() {
  if (!this.enabled) return null;
  const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtxClass) return null;
  if (!this.audioCtx) {
    this.audioCtx = new AudioCtxClass();
  }
  if (this.audioCtx.state === "suspended") {
    this.audioCtx.resume().catch(() => {});
  }
  return this.audioCtx;
},

unlock() {
  if (!this.enabled) return;
  const ctx = this.getContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
},

play(name) {
  if (!this.enabled) return;
  try {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (name) {
    case "click":
    case "tap": {
    // Hindari duplikasi klik beruntun dalam rentang 50ms
    if (Date.now() - this.lastClickTime < 50) return;
    this.lastClickTime = Date.now();
    this.lastPlayTime = Date.now();

    // 1. Transient attack (nada tinggi yang turun cepat: sensasi klik renyah)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1250, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.038);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    // 2. Body resonance (ketukan hangat)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(320, now);
    gain2.gain.setValueAtTime(0.20, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.04);
    break;
    }

    case "pop": {
    this.lastPlayTime = Date.now();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.05);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
    break;
    }

    case "success": {
    this.lastPlayTime = Date.now();
    // Nada perayaan 4 tingkat: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const noteStart = now + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.30, noteStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + 0.32);
    });
    break;
    }

    case "wrong": {
    this.lastPlayTime = Date.now();
    // Nada ganda penolakan/salah: 220Hz -> 160Hz
    const freqs = [220, 160];
    freqs.forEach((freq, idx) => {
      const noteStart = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(680, noteStart);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.30, noteStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + 0.15);
    });
    break;
    }

    case "toggle": {
    this.lastPlayTime = Date.now();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.setValueAtTime(880, now + 0.03);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
    break;
    }

    default:
    this.play("click");
    break;
    }
  } catch (e) {
    // Audio safe fallback
  }
},

playClickIfIdle() {
  if (Date.now() - this.lastClickTime < 35) return;
  this.play("click");
}
};

window.MiraiSound = MiraiSound;

/**
 * Text-to-Speech (TTS) Global Mirai no Webu
 * Mendukung pelafalan bahasa Jepang (ja-JP) dan bahasa Indonesia (id-ID)
 * serta mode Normal (0.92x) dan Slow-Mo (0.48x) untuk latihan pelafalan.
 * @param {string} text - Teks yang akan dibacakan
 * @param {string} [lang='ja-JP'] - Kode bahasa ('ja-JP' atau 'id-ID')
 * @param {boolean} [slow=false] - Jika true, gunakan kecepatan lambat (0.48x)
*/
function playGoogleTtsFallback(text, lang = "ja-JP", slow = false) {
  try {
    if (window._miraiTtsAudio) {
      window._miraiTtsAudio.pause();
      window._miraiTtsAudio = null;
    }
    const speed = slow ? "0.24" : "1";
    const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&ttsspeed=${speed}&q=${encodeURIComponent(text)}`;
    const audio = new Audio(ttsUrl);
    window._miraiTtsAudio = audio;
    audio.play().catch(() => {});
  } catch (e) {}
}
window.playGoogleTtsFallback = playGoogleTtsFallback;

function speakText(text, lang = "ja-JP", slow = false) {
  if (!text || typeof text !== "string") return;
  const cleanText = text
    .replace(/<[^>]*>/g, " ")
    .replace(/[（()）「」『』]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleanText) return;

  // 1. Coba browser Web Speech API (SpeechSynthesis)
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = slow ? 0.48 : (lang === "ja-JP" ? 0.92 : 1.0);
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      let hasMatchingVoice = false;
      if (voices && voices.length) {
        const prefix = lang.split("-")[0].toLowerCase();
        const matchingVoice =
          voices.find((v) => v.lang && v.lang.toLowerCase().replace("_", "-").startsWith(prefix)) ||
          voices.find((v) => v.lang && v.lang.toLowerCase().includes(prefix));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
          hasMatchingVoice = true;
        }
      }

      utterance.onerror = () => {
        playGoogleTtsFallback(cleanText, lang, slow);
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (err) {
      console.warn("TTS SpeechSynthesis warning:", err);
    }
  }

  // 2. Fallback Audio API jika SpeechSynthesis tidak tersedia
  playGoogleTtsFallback(cleanText, lang, slow);
}
window.speakText = speakText;

// Listener suara siap jika voice dimuat asinkron
if ("speechSynthesis" in window && window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.__speechVoicesReady = true;
  };
}

/**
 * Global Count-Up Number Animator for Mirai no Webu
 * Menghadirkan efek animasi angka yang menghitung dari 1 (atau 0) hingga angka hasil akhir.
 * Mendukung teks berformat dengan prefix dan suffix (contoh: "21", "28 Kali", "100%", "🔥 12", "6 Pasang", "1500 PTS").
 *
 * @param {HTMLElement|string} target - Elemen target atau selector CSS
 * @param {number|string} [customEndVal] - Nilai hasil akhir opsional
 * @param {object} [options] - Pengaturan opsional: { startVal, duration, onComplete }
*/
function animateCountUp(target, customEndVal, options = {}) {
const el = typeof target === "string" ? document.querySelector(target) : target;
if (!el) return;

if (el.__countUpAnimId) {
  cancelAnimationFrame(el.__countUpAnimId);
  el.__countUpAnimId = null;
}

let sourceText = "";
if (customEndVal !== undefined && customEndVal !== null) {
  sourceText = String(customEndVal).trim();
} else if (el.dataset.countTarget !== undefined) {
  sourceText = String(el.dataset.countTarget).trim();
} else {
  sourceText = (el.textContent || "").trim();
}

if (!sourceText) return;
el.dataset.countTarget = sourceText;

const match = sourceText.match(/^(.*?)(\d+[\d,.]*)(.*?)$/);
if (!match) {
  el.textContent = sourceText;
  return;
}

const prefix = match[1];
const rawNumStr = match[2];
const suffix = match[3];

const hasCommas = rawNumStr.includes(",");
const hasDots = rawNumStr.includes(".");
const isDecimal = hasDots && !hasCommas && /^\d+\.\d{1,2}$/.test(rawNumStr);

let targetVal = 0;
if (isDecimal) {
  targetVal = parseFloat(rawNumStr);
} else {
  targetVal = parseInt(rawNumStr.replace(/[.,]/g, ""), 10);
}

if (isNaN(targetVal)) {
  el.textContent = sourceText;
  return;
}

// Menghitung dari 1 ke angka hasil (atau dari 0 jika targetnya 0)
let startVal = options.startVal !== undefined
  ? Number(options.startVal)
  : (targetVal >= 1 ? 1 : 0);

if (startVal === targetVal) {
  el.textContent = sourceText;
  el.classList.remove("is-counting");
  el.classList.add("count-finished");
  return;
}

const diff = Math.abs(targetVal - startVal);
let duration = options.duration;
if (!duration) {
  if (diff <= 10) duration = 650;
  else if (diff <= 35) duration = 900;
  else if (diff <= 150) duration = 1150;
  else if (diff <= 1000) duration = 1350;
  else duration = 1550;
}

const startTime = performance.now();
el.classList.add("is-counting");
el.classList.remove("count-finished");

function frame(now) {
  const elapsed = now - startTime;
  const progress = Math.min(elapsed / duration, 1);

  // Ease-out cubic: cepat di awal dan melambat halus di akhir
  const ease = 1 - Math.pow(1 - progress, 3);
  const currentVal = startVal + (targetVal - startVal) * ease;

  let displayValStr = "";
  if (isDecimal) {
    displayValStr = currentVal.toFixed(1);
  } else {
    const rounded = Math.round(currentVal);
    displayValStr = hasCommas ? rounded.toLocaleString("en-US") : String(rounded);
  }

  el.textContent = `${prefix}${displayValStr}${suffix}`;

  if (progress < 1) {
    el.__countUpAnimId = requestAnimationFrame(frame);
  } else {
    el.textContent = sourceText;
    el.__countUpAnimId = null;
    el.classList.remove("is-counting");
    el.classList.add("count-finished");

    if (typeof options.onComplete === "function") {
    options.onComplete();
    }
  }
}

el.__countUpAnimId = requestAnimationFrame(frame);
}
window.animateCountUp = animateCountUp;

/**
 * Inisialisasi IntersectionObserver otomatis untuk elemen angka statistik
*/
function initGlobalCountUpObservers() {
const selector = ".prestasi-stat-num, [data-counter], [data-countup], .kwu-stat-box strong";
const elements = document.querySelectorAll(selector);
if (!elements.length) return;

if (!("IntersectionObserver" in window)) {
  elements.forEach((el) => animateCountUp(el));
  return;
}

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
    const el = entry.target;
    animateCountUp(el);
    obs.unobserve(el);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -20px 0px"
});

elements.forEach((el) => {
  if (!el.dataset.countTarget) {
    el.dataset.countTarget = el.textContent.trim();
  }
  observer.observe(el);
});
}
window.initGlobalCountUpObservers = initGlobalCountUpObservers;


function setupGlobalSoundClicks() {
// Unlock Web Audio context pada sentuhan atau interaksi pertama pengguna
["pointerdown", "touchstart", "click", "keydown"].forEach((evt) => {
  window.addEventListener(evt, () => {
    if (window.MiraiSound) {
    window.MiraiSound.unlock();
    const ctx = window.MiraiSound.getContext();
    if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
    }
    }
  }, { passive: true, capture: true });
});

const INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "summary",
  '[role="button"]',
  '[role="tab"]',
  '[role="switch"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="radio"]',
  'input[type="checkbox"]',
  "[data-expand-card]",
  "[data-expand-cta]",
  "[data-clickable]",
  "[data-action]",
  "[onclick]",
  ".card",
  "[class*='-card']",
  "[class*='card-']",
  ".btn",
  "[class*='-btn']",
  "[class*='btn-']",
  ".nav-card",
  ".activity-start-card",
  ".start-card",
  ".division-card",
  ".program-card",
  ".competition-card",
  ".product-card",
  ".lesson-card",
  ".material-card",
  ".mode-card",
  ".level-card",
  ".course-card",
  ".choice-card",
  ".memory-card",
  ".flashcard",
  ".card-toggle",
  ".tab-btn",
  ".filter-btn",
  ".accordion-header",
  ".accordion-btn",
  ".lightbox-close",
  ".lightbox-prev",
  ".lightbox-next",
  ".slider-btn",
  ".to-top",
  ".menu-toggle",
  ".hero-btn",
  ".script-tabs button",
  ".quick-pill-btn",
  ".custom-type-card",
  ".memory-diff-btn",
  ".palette-num-btn",
  ".kanji-cell",
  ".dict-tab-btn",
  ".quiz-chip",
  ".bunpou-chip",
  ".match-button"
].join(", ");

// Global click listener pada capture phase untuk tanggapan instan
document.addEventListener("click", (e) => {
  window.MiraiSound?.unlock();
  const target = e.target;
  if (!target) return;

  const el = target.closest(INTERACTIVE_SELECTOR);
  if (!el) return;

  // Jangan bersuara jika elemen disabled
  if (
    el.disabled ||
    el.getAttribute("aria-disabled") === "true" ||
    el.classList?.contains("disabled") ||
    el.classList?.contains("is-disabled")
  ) {
    return;
  }

  // Jangan bunyikan jika data-sound="none"
  if (el.dataset?.sound === "none") return;

  window.MiraiSound?.playClickIfIdle();
}, true);
}

// Inisialisasi listener klik audio secepat mungkin
setupGlobalSoundClicks();

// Cek status terkunci secepat mungkin untuk mencegah kedipan konten
(function checkComingSoonEarly() {
try {
  localStorage.removeItem("mnh_access_unlocked");
  const isUnlocked = sessionStorage.getItem("mnh_access_unlocked") === "true";
  const rawPath = (window.location.pathname || "").toLowerCase();
  const lockedDirs = ["/toko/", "/peringkat/", "/lomba/", "/kegiatan/", "/divisi/"];
  if (!isUnlocked && lockedDirs.some((dir) => rawPath.includes(dir))) {
    document.documentElement.classList.add("is-page-locked-early");
    if (document.body) {
    document.body.classList.add("is-page-locked");
    }
  }
} catch (e) {}
})();

document.addEventListener("DOMContentLoaded", () => {
normalizeNavigation();
registerServiceWorker();
renderMobileBottomNav();
setupThemeToggle();
setupMenu();
setupSidebarNav();
setupBackToTop();
setupQuickScrollThumb();
setupReveal();
setupHeroContentScroll();
setupInstagramFeedback();
setupLearningPanel();
setupManagementSlider();
setupImageLightbox();
setupUniversalFeedbackAndQuote();
setupExpandableCards();
initMiraiProgress();
initGlobalCountUpObservers();
initComingSoonSystem();
initSmartLinkPrefetcher();
window.initKanjiDictionary?.();
window.initSora?.();
});

function setupHeroContentScroll() {
// Efek sticky curtain dan ascending text (solid 100% tanpa transparansi) untuk seluruh hero
const hero = document.querySelector(".hero, .page-hero, .proker-hero, .quest-hero, .toko-hero, .class-hero, .about-hero, .activities-hero, .rekomendasi-hero, .peringkat-hero, .lomba-hero, .motivasi-hero");
if (!hero) return;

const heroContent = hero.querySelector(".hero-text-box, .hero-content, .proker-hero-inner, .page-hero > div:not(.hero-social-sidebar), .quest-hero > div:not(.hero-social-sidebar), .toko-hero > div:not(.hero-social-sidebar), div:not(.hero-social-sidebar):not(.proker-back-wrap)");
const heroSocial = hero.querySelector(".hero-social-sidebar");

let ticking = false;
let heroHeight = hero.offsetHeight || window.innerHeight;

window.addEventListener("resize", () => {
  heroHeight = hero.offsetHeight || window.innerHeight;
}, { passive: true });

function update() {
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollY <= heroHeight) {
    // Hero aktif di viewport
    hero.style.visibility = "visible";
    const translateY = scrollY * 1.0;

    if (heroContent) {
      heroContent.style.transform = `translate3d(0, -${translateY}px, 0)`;
    }
    if (heroSocial) {
      heroSocial.style.transform = `translate3d(0, -${translateY}px, 0)`;
    }
  } else {
    // Begitu seksi berikutnya sudah menutupi hero secara penuh,
    // sembunyikan hero agar background Sora tidak pernah tembus di seksi bawah!
    hero.style.visibility = "hidden";
    if (heroContent) {
      heroContent.style.transform = `translate3d(0, -${heroHeight}px, 0)`;
    }
    if (heroSocial) {
      heroSocial.style.transform = `translate3d(0, -${heroHeight}px, 0)`;
    }
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(update);
    ticking = true;
  }
}, { passive: true });

update();
}

function setupThemeToggle() {
// Website dikunci 100% pada Light Mode
try {
  localStorage.removeItem("mirai-no-hana-theme");
} catch (e) {}
document.body.classList.remove("theme-dark", "dark-mode");
const toggle = document.querySelector(".theme-toggle, .dark-mode-toggle");
if (toggle) toggle.remove();
}

function setupLearningPanel() {
}

function setupInstagramFeedback() {
const form = document.querySelector("[data-instagram-feedback]");
if (!form) return;

// Ganti nilai ini saat username Instagram resmi MIRAI NO HANA sudah tersedia.
const INSTAGRAM_USERNAME = "mirainohana.id";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const message = [
    "Halo MIRAI NO HANA, saya ingin menyampaikan masukan.",
    "",
    `Nama: ${formData.get("name")}`,
    `Kelas: ${formData.get("class")}`,
    `Pesan: ${formData.get("message")}`
  ].join("\n");

  navigator.clipboard?.writeText(message).catch(() => {});
  window.open(`https://ig.me/m/${INSTAGRAM_USERNAME}`, "_blank", "noopener,noreferrer");
});
}

function getAppBasePath() {
const logo = document.querySelector(".brand img, .sidebar-footer-logo");
if (logo) {
  const src = logo.getAttribute("src") || "";
  if (src.startsWith("../../")) return "../../";
  if (src.startsWith("../")) return "../";
}
const style = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
if (style) {
  const href = style.getAttribute("href") || "";
  if (href.startsWith("../../")) return "../../";
  if (href.startsWith("../")) return "../";
}
return "";
}

function normalizeNavigation() {
const basePath = getAppBasePath();
document.querySelectorAll('[data-nav-menu] a[href$="kanji.html"]').forEach((link) => {
  link.href = basePath + "kamus/index.html";
  link.textContent = "KAMUS";
});
document.querySelectorAll('[data-nav-menu] a[href$="about.html"]').forEach((link) => {
  link.href = basePath + "tentang/index.html";
});

// Aktifkan kembali seluruh tautan navigasi (lapisan Coming Soon telah dihapus).
document.querySelectorAll('[data-nav-menu] a.nav-coming-soon, .nav .links a.nav-coming-soon').forEach((link) => {
  const navText = link.querySelector('.nav-text');
  const label = navText ? navText.textContent.trim().toUpperCase() : link.textContent.replace('COMING SOON', '').trim().toUpperCase();
  const href = (label === 'HOME' || label === 'BERANDA') ? basePath + 'index.html' : label === 'KEGIATAN' ? basePath + 'kegiatan/index.html' : label === 'TENTANG' ? basePath + 'tentang/index.html' : link.getAttribute('href');
  link.setAttribute('href', href);
  link.removeAttribute('aria-disabled');
  link.removeAttribute('tabindex');
  link.removeAttribute('title');
  link.classList.remove('nav-coming-soon');
  link.textContent = label;
});

// Aktifkan kembali tautan brand yang sebelumnya dinonaktifkan.
document.querySelectorAll('.brand.brand-disabled').forEach((brand) => {
  brand.classList.remove('brand-disabled');
  brand.setAttribute('href', basePath + 'index.html');
  brand.removeAttribute('aria-disabled');
  brand.removeAttribute('tabindex');
  brand.removeAttribute('title');
});
}

function setupMenu() {
const toggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-nav-menu]");
if (!toggle || !menu) return;

toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});
}

function setupSidebarNav() {
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");
const sidebarNav = document.querySelector(".sidebar-nav");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

const openSidebar = () => {
  sidebarNav.classList.add("active");
  if (sidebarOverlay) sidebarOverlay.classList.add("active");
  document.body.classList.add("sidebar-open");
  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.style.opacity = "0";
    menuBtn.style.visibility = "hidden";
    menuBtn.style.pointerEvents = "none";
  }
};

const closeSidebar = () => {
  sidebarNav.classList.remove("active");
  if (sidebarOverlay) sidebarOverlay.classList.remove("active");
  document.body.classList.remove("sidebar-open");
  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.style.opacity = "";
    menuBtn.style.visibility = "";
    menuBtn.style.pointerEvents = "";
  }
};

if (menuBtn && sidebarNav && !menuBtn.dataset.sidebarInit) {
  menuBtn.dataset.sidebarInit = "true";
  menuBtn.addEventListener("click", openSidebar);
}

if (closeBtn && sidebarNav) {
  closeBtn.addEventListener("click", closeSidebar);
}

if (sidebarOverlay && sidebarNav) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

// Tutup saat tombol Escape ditekan
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebarNav && sidebarNav.classList.contains("active")) {
    closeSidebar();
  }
});
}

function setupBackToTop() {
const button = document.querySelector(".to-top");
if (!button) return;

if (!button.hasAttribute("aria-label")) {
  button.setAttribute("aria-label", "Kembali ke atas");
}

const update = () => button.classList.toggle("is-visible", window.scrollY > 480);
update();
window.addEventListener("scroll", update, { passive: true });
button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/**
 * Tombol Geser Cepat Pojok Kanan (Quick Drag-Scroll Thumb)
 * - Warna Pink Mirai No Hana
 * - Transparan (opacity 0.22) saat tidak disentuh / idle
 * - Terang & terlihat jelas (opacity 1) saat disentuh, di-hover, atau di-drag
 * - Berfungsi mulus di Mobile (Touch Drag) & Laptop (Mouse Drag)
 */
function setupQuickScrollThumb() {
  if (document.getElementById("quickScrollThumb")) return;

  const thumb = document.createElement("div");
  thumb.id = "quickScrollThumb";
  thumb.className = "quick-scroll-thumb";
  thumb.setAttribute("aria-label", "Geser Cepat Halaman");
  thumb.setAttribute("role", "scrollbar");
  thumb.setAttribute("aria-orientation", "vertical");
  thumb.setAttribute("title", "Tekan & geser untuk scroll cepat");
  thumb.innerHTML = `
    <div class="quick-scroll-icon">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>
      <span class="quick-scroll-bar"></span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div>
  `;
  document.body.appendChild(thumb);

  let isDragging = false;
  let scrollTimeout = null;
  let scrollRafId = null;
  let naturalScrollTicking = false;
  let startThumbOffsetY = 0;
  let targetScrollY = 0;

  // Pelacakan kecepatan gesek (flick velocity) untuk inersia halus di ponsel
  let lastTouchY = 0;
  let lastTouchTime = 0;
  let touchVelocityY = 0;

  // Ukuran metrik halaman & lintasan yang di-cache (ZERO LAYOUT REFLOW saat geser)
  let cachedMetrics = {
    topOffset: 80,
    maxTop: 500,
    trackHeight: 420,
    maxScroll: 1000
  };

  function measureMetrics() {
    const isMobile = window.innerWidth <= 768;
    const topOffset = isMobile ? 80 : 86;
    const bottomOffset = isMobile ? 138 : 115;
    const thumbHeight = isMobile ? 62 : 58;
    const winHeight = window.innerHeight;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    const maxScroll = Math.max(0, docHeight - winHeight);
    const maxTop = Math.max(topOffset, winHeight - bottomOffset - thumbHeight);
    const trackHeight = Math.max(1, maxTop - topOffset);

    cachedMetrics = { topOffset, maxTop, trackHeight, maxScroll };

    if (maxScroll <= 40) {
      thumb.style.display = "none";
    } else {
      thumb.style.display = "flex";
    }

    return cachedMetrics;
  }

  // Perbarui posisi thumb secara efisien saat pengguna scroll normal
  function updateThumbFromScroll() {
    if (isDragging) return; // Jangan timpa jika sedang di-drag jari
    if (cachedMetrics.maxScroll <= 0) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    const progress = Math.min(Math.max(0, currentScroll / cachedMetrics.maxScroll), 1);
    const thumbY = cachedMetrics.topOffset + progress * cachedMetrics.trackHeight;

    thumb.style.transform = `translate3d(0, ${Math.round(thumbY)}px, 0)`;
    thumb.setAttribute("aria-valuenow", Math.round(progress * 100));
  }

  // Handler Scroll Alami (Mouse wheel / sentuhan konten normal)
  function handleWindowScroll() {
    if (!naturalScrollTicking) {
      window.requestAnimationFrame(() => {
        updateThumbFromScroll();
        naturalScrollTicking = false;
      });
      naturalScrollTicking = true;
    }

    if (!isDragging) {
      thumb.classList.add("is-scrolling");
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        thumb.classList.remove("is-scrolling");
      }, 1000);
    }
  }

  window.addEventListener("scroll", handleWindowScroll, { passive: true });
  window.addEventListener("resize", () => {
    measureMetrics();
    updateThumbFromScroll();
  }, { passive: true });

  measureMetrics();
  updateThumbFromScroll();

  // =========================================================================
  // LOGIKA DRAGGING CEPAT (1:1 DENGAN JARI PENGGUNA, 60/120FPS GPU ACCELERATED)
  // =========================================================================
  function startDrag(clientY, isTouch = false) {
    isDragging = true;
    measureMetrics(); // Ukur dimensi sekali saja saat awal drag
    clearTimeout(scrollTimeout);

    // Nonaktifkan sementara smooth scroll di html agar gerakannya instan tanpa lag
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.userSelect = "none";

    const rect = thumb.getBoundingClientRect();
    startThumbOffsetY = clientY - rect.top;
    if (startThumbOffsetY < 0 || startThumbOffsetY > rect.height) {
      startThumbOffsetY = rect.height / 2;
    }

    lastTouchY = clientY;
    lastTouchTime = performance.now();
    touchVelocityY = 0;

    thumb.classList.add("is-dragging");
    if (isTouch) {
      thumb.classList.add("is-touching");
    }
  }

  function moveDrag(clientY) {
    if (!isDragging || cachedMetrics.maxScroll <= 0) return;

    const now = performance.now();
    const dt = now - lastTouchTime;
    if (dt > 4) {
      touchVelocityY = (clientY - lastTouchY) / dt; // pixel per millisecond
      lastTouchY = clientY;
      lastTouchTime = now;
    }

    // 1. Kunci posisi thumb LANGSUNG ke jari pengguna secara instan (1:1)
    const targetThumbY = clientY - startThumbOffsetY;
    const clampedThumbY = Math.min(Math.max(cachedMetrics.topOffset, targetThumbY), cachedMetrics.maxTop);

    thumb.style.transform = `translate3d(0, ${Math.round(clampedThumbY)}px, 0)`;

    // 2. Hitung target scroll proporsional
    const progress = Math.min(Math.max(0, (clampedThumbY - cachedMetrics.topOffset) / cachedMetrics.trackHeight), 1);
    targetScrollY = Math.round(progress * cachedMetrics.maxScroll);
    thumb.setAttribute("aria-valuenow", Math.round(progress * 100));

    // 3. Sinkronkan scroll halaman dengan display refresh rate (rAF)
    if (!scrollRafId) {
      scrollRafId = window.requestAnimationFrame(() => {
        window.scrollTo(0, targetScrollY);
        scrollRafId = null;
      });
    }
  }

  function endDrag(isTouch = false) {
    if (!isDragging) return;
    isDragging = false;

    if (scrollRafId) {
      window.cancelAnimationFrame(scrollRafId);
      scrollRafId = null;
    }
    // Pastikan scroll berada di posisi akhir yang tepat
    window.scrollTo(0, targetScrollY);

    document.documentElement.style.scrollBehavior = "";
    document.body.style.userSelect = "";
    thumb.classList.remove("is-dragging", "is-touching");

    // Efek momentum gesekan hape (Fling / Inertia) jika jari dilepas saat masih bergerak cepat
    if (isTouch && Math.abs(touchVelocityY) > 0.35) {
      const flingDistance = touchVelocityY * Math.min(cachedMetrics.maxScroll, 3000) * 0.14;
      const momentumTarget = Math.min(Math.max(0, targetScrollY + flingDistance), cachedMetrics.maxScroll);
      window.scrollTo({
        top: Math.round(momentumTarget),
        behavior: "smooth"
      });
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      thumb.classList.remove("is-scrolling");
    }, 1000);
  }

  // 1. INTERAKSI TOUCH (MOBILE / HP)
  thumb.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    startDrag(e.touches[0].clientY, true);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault(); // Mencegah konflik gesture bawaan browser
    moveDrag(e.touches[0].clientY);
  }, { passive: false });

  window.addEventListener("touchend", () => endDrag(true), { passive: true });
  window.addEventListener("touchcancel", () => endDrag(true), { passive: true });

  // 2. INTERAKSI MOUSE (LAPTOP / DESKTOP)
  thumb.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientY, false);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    moveDrag(e.clientY);
  });

  window.addEventListener("mouseup", () => endDrag(false));
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;

  window.addEventListener('load', () => {
    const basePath = getAppBasePath();
    const swUrl = basePath + 'service-worker.js';
    const scope = basePath || './';

    navigator.serviceWorker.register(swUrl, { scope })
      .then((reg) => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (!installingWorker) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] Versi baru Mirai no Webu siap digunakan offline.');
            }
          };
        };
      })
      .catch((err) => {
        console.warn('[PWA] Pendaftaran Service Worker ditangguhkan:', err);
      });
  });
}

function renderMobileBottomNav() {
  // Dinonaktifkan sesuai permintaan pengguna: Navigasi utama menggunakan tombol MENU melayang di pojok kanan atas
  const existingNav = document.querySelector(".mobile-bottom-nav");
  if (existingNav) existingNav.remove();
  document.body.classList.remove("has-bottom-nav");
}

function setupReveal() {
// 1. Daftarkan seluruh seksi halaman
// PENTING: Seksi pertama tepat di bawah hero (.hero + section, .page-hero + section, .toko-catalog-section)
// TIDAK BOLEH disembunyikan dengan opacity 0 karena berfungsi sebagai tirai penutup solid yang langsung terlihat di viewport awal (above the fold)
const heroExclusions = ":not(.hero):not(.page-hero):not(.about-hero):not(.lomba-hero):not(.activities-hero):not(.class-hero):not(.peringkat-hero):not(.rekomendasi-hero):not(.toko-hero):not(.motivasi-hero):not(.buuku-hero):not(.quest-hero)";

const sectionSelectors = [
  `main > section${heroExclusions}:not(.toko-catalog-section)`,
  ".proker-section",
  ".kegiatan-section",
  ".content-section",
  ".facility-section",
  ".division-section",
  ".learning-path",
  ".feedback-preview",
  ".home-activities-dark-section",
  ".journey-section",
  ".about-preview"
];

document.querySelectorAll(sectionSelectors.join(",")).forEach((sec) => {
  // Jangan beri section-reveal ke seksi pertama tepat di bawah hero
  if (sec.matches(".hero + section, .page-hero + section, .proker-hero + section, .quest-hero + section, .toko-catalog-section")) {
    sec.classList.remove("section-reveal");
    sec.classList.add("is-visible");
    return;
  }

  if (!sec.classList.contains("section-reveal")) {
    sec.classList.add("section-reveal");
  }
});

// 2. Daftarkan seluruh kartu komponen dan elemen kartu di dalam seksi
const cardSelectors = [
  "article",
  "[class*='-card']",
  ".journey-step",
  ".activity-item",
  ".mission-box",
  ".history-origin-card",
  ".pembina-card",
  ".feedback-card",
  ".home-about-banner",
  ".facility-card",
  ".podium-card",
  ".rek-card",
  ".event-card",
  ".course-card",
  ".class-card",
  ".division-card",
  ".program-card",
  ".management-card",
  ".haori-card",
  ".accessory-card"
];

document.querySelectorAll(cardSelectors.join(",")).forEach((card) => {
  // Jangan beri animasi scroll pada elemen di dalam hero, header, floating drawer chat, atau modal/latihan
  if (card.closest(".hero, .page-hero, .about-hero, .lomba-hero, .activities-hero, .class-hero, #drawer, #launcher, .sidebar-nav, .home-header, .lightbox, .modal, .practice-view, .result-view, [data-practice-view], [data-result-view]")) return;

  if (!card.classList.contains("motion-reveal") && !card.classList.contains("reveal")) {
    card.classList.add("motion-reveal");
    const parent = card.parentElement;
    if (parent) {
    const siblings = Array.from(parent.children).filter(c => c.matches(cardSelectors.join(",")));
    const index = siblings.indexOf(card);
    const stagger = ((index >= 0 ? index : 0) % 6) + 1;
    card.classList.add(`motion-delay-${stagger}`);
    }
  }
});

const targets = document.querySelectorAll(".section-reveal, .motion-reveal, .reveal");
if (!targets.length) return;

// Langsung aktifkan elemen yang sudah berada di dalam atau di atas viewport saat render awal (above the fold)
// agar konten tidak pernah tertahan sembunyi (blank/black void) saat pengguna pertama kali membuka halaman
targets.forEach((target) => {
  const rect = target.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    target.classList.add("is-visible");
  }
});

if (!("IntersectionObserver" in window)) {
  targets.forEach((target) => target.classList.add("is-visible"));
  return;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting || entry.intersectionRatio > 0) {
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.01,
  rootMargin: "0px 0px -10px 0px"
});

targets.forEach((target) => {
  if (!target.classList.contains("is-visible")) {
    observer.observe(target);
  }
});
}

function setupSora() {
let widget = document.querySelector("[data-sora]");
if (!widget && window.SoraService) {
  const basePath = getAppBasePath();
  widget = document.createElement("aside");
  widget.className = "sora-widget";
  widget.dataset.sora = "";
  widget.setAttribute("aria-label", "Asisten Sora");
  widget.innerHTML = [
    `<button class="sora-toggle" type="button" data-sora-toggle aria-expanded="false"><img src="${basePath}images/mirai/icon/Ay.png" alt=""><span>SORA</span></button>`,
    '<div class="sora-panel" data-sora-panel hidden><header><strong>Sora</strong><span>Teman belajar bahasa Jepangmu.</span><button class="sora-close" type="button" data-sora-close aria-label="Tutup Sora">×</button></header>',
    '<div class="sora-messages" data-sora-messages><p class="chat-message sora">Yatta! Aku Sora. Ada yang bisa kubantu?</p></div>',
    '<form class="sora-form" data-sora-form><input data-sora-input aria-label="Tanya Sora" placeholder="Tanya Sora sesuatu..." required><button type="submit">Kirim</button></form></div>'
  ].join("");
  document.body.appendChild(widget);
}
if (!widget || !window.SoraService) return;

const toggle = widget.querySelector("[data-sora-toggle]");
const panel = widget.querySelector("[data-sora-panel]");
const form = widget.querySelector("[data-sora-form]");
const input = widget.querySelector("[data-sora-input]");
const messages = widget.querySelector("[data-sora-messages]");
const close = widget.querySelector("[data-sora-close]");

toggle.addEventListener("click", () => {
  const isOpen = panel.hidden;
  panel.hidden = !isOpen;
  toggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("sora-widget-open", isOpen);
  if (isOpen) input.focus();
});

close?.addEventListener("click", () => {
  panel.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("sora-widget-open");
  toggle.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  appendMessage(messages, message, "user");
  input.value = "";
  const pending = appendMessage(messages, "Sora sedang mengetik…", "sora is-loading");
  try {
    const reply = await window.SoraService.sendMessage(message);
    pending.remove();
    appendMessage(messages, reply, "sora");
  } catch (error) {
    pending.remove();
    appendMessage(messages, error.message || "Maaf, Sora sedang mengalami gangguan. Coba lagi ya.", "sora is-error");
  }
});
}

function appendMessage(container, text, author) {
const message = document.createElement("p");
message.className = "chat-message " + author;
message.textContent = text;
container.appendChild(message);
container.scrollTop = container.scrollHeight;
return message;
}

function setupManagementSlider() {
const track = document.getElementById("mgmtSliderTrack");
if (!track) return;

const slides = track.querySelectorAll(".mgmt-slide");
const tabs = document.querySelectorAll(".mgmt-tab-btn");
const prevBtn = document.getElementById("mgmtPrevBtn");
const nextBtn = document.getElementById("mgmtNextBtn");
const indicator = document.getElementById("mgmtPageIndicator");
const totalSlides = slides.length;
let currentIndex = 0;

function updateState(index) {
  currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === currentIndex);
    tab.setAttribute("aria-selected", String(i === currentIndex));
  });
  if (indicator) {
    indicator.textContent = `${currentIndex + 1} dari ${totalSlides}`;
  }
  if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? "0.45" : "1";
  if (nextBtn) nextBtn.style.opacity = currentIndex === totalSlides - 1 ? "0.45" : "1";
}

function scrollToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
  const slideWidth = track.clientWidth;
  track.scrollTo({
    left: currentIndex * slideWidth,
    behavior: "smooth"
  });
  updateState(currentIndex);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetIndex = parseInt(tab.dataset.mgmtTarget, 10) || 0;
    scrollToSlide(targetIndex);
  });
});

prevBtn?.addEventListener("click", () => {
  scrollToSlide(currentIndex - 1);
});

nextBtn?.addEventListener("click", () => {
  scrollToSlide(currentIndex + 1);
});

let scrollTimeout;
track.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const slideWidth = track.clientWidth || 1;
    const newIndex = Math.round(track.scrollLeft / slideWidth);
    if (newIndex !== currentIndex) {
    updateState(newIndex);
    }
  }, 60);
}, { passive: true });

function syncManagementGridHeight() {
  const soraSlide = track.querySelector('.mgmt-slide[data-slide-index="0"]');
  const cloverGrid = track.querySelector('.mgmt-slide[data-slide-index="1"] .management-grid--11');
  if (soraSlide && cloverGrid) {
    const soraGrid = soraSlide.querySelector('.management-grid');
    if (soraGrid) {
    const soraHeight = soraGrid.getBoundingClientRect().height || soraGrid.offsetHeight;
    if (soraHeight > 100) {
    cloverGrid.style.maxHeight = `${Math.round(soraHeight)}px`;
    }
    }
  }
}

updateState(0);
syncManagementGridHeight();
window.addEventListener("resize", syncManagementGridHeight, { passive: true });
window.addEventListener("load", syncManagementGridHeight, { passive: true });
}

function setupImageLightbox() {
  let lightbox = null;
  let imgEl = null;
  let captionEl = null;

  // State zoom dan pan interaktif
  let currentScale = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let startPanX = 0;
  let startPanY = 0;
  let initialPinchDist = 0;
  let initialPinchScale = 1;

  function updateTransform(animate = true) {
    if (!imgEl) return;
    if (currentScale <= 1) {
      currentScale = 1;
      panX = 0;
      panY = 0;
      imgEl.style.transition = animate ? "transform 0.22s ease-out" : "none";
      imgEl.style.transform = "none";
      imgEl.style.cursor = "zoom-in";
      imgEl.classList.remove("is-zoomed");
    } else {
      imgEl.style.transition = animate ? "transform 0.22s ease-out" : "none";
      imgEl.style.transform = `scale(${currentScale}) translate(${panX / currentScale}px, ${panY / currentScale}px)`;
      imgEl.style.cursor = isPanning ? "grabbing" : "grab";
      imgEl.classList.add("is-zoomed");
    }
  }

  function resetZoom() {
    currentScale = 1;
    panX = 0;
    panY = 0;
    isPanning = false;
    updateTransform(false);
  }

  function createLightbox() {
    if (lightbox) return;
    lightbox = document.createElement("div");
    lightbox.id = "imgLightboxModal";
    lightbox.className = "img-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-label", "Pratinjau Foto");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML = [
      '<button class="img-lightbox-close" type="button" aria-label="Tutup Pratinjau">✕</button>',
      '<div class="img-lightbox-container">',
      '    <img class="img-lightbox-img" src="" alt="Pratinjau Foto" draggable="false">',
      '    <div class="img-lightbox-caption"></div>',
      '    <div class="img-lightbox-hint">Klik/Ketuk foto untuk perbesar/zoom • Geser untuk menggeser • Klik di luar atau ESC untuk menutup</div>',
      '</div>'
    ].join("");
    document.body.appendChild(lightbox);

    imgEl = lightbox.querySelector(".img-lightbox-img");
    captionEl = lightbox.querySelector(".img-lightbox-caption");
    const closeBtn = lightbox.querySelector(".img-lightbox-close");

    closeBtn.addEventListener("click", closeLightbox);

    // Klik di latar belakang gelap (luar gambar) menutup lightbox
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("img-lightbox-container")) {
        closeLightbox();
      }
    });

    // Klik foto di dalam lightbox: toggle zoom (1x <-> 2.4x)
    imgEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentScale === 1) {
        currentScale = 2.4;
        updateTransform(true);
      } else {
        resetZoom();
      }
    });

    // Desktop Mouse Drag untuk Pan saat Zoomed In
    imgEl.addEventListener("mousedown", (e) => {
      if (currentScale <= 1) return;
      isPanning = true;
      startPanX = e.clientX - panX;
      startPanY = e.clientY - panY;
      updateTransform(false);
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPanning || currentScale <= 1) return;
      panX = e.clientX - startPanX;
      panY = e.clientY - startPanY;
      updateTransform(false);
    });

    window.addEventListener("mouseup", () => {
      if (isPanning) {
        isPanning = false;
        updateTransform(false);
      }
    });

    // Desktop Mouse Wheel Zoom
    imgEl.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.35 : -0.35;
      const newScale = Math.min(Math.max(1, currentScale + delta), 4.5);
      if (newScale !== currentScale) {
        currentScale = newScale;
        if (currentScale === 1) {
          panX = 0;
          panY = 0;
        }
        updateTransform(true);
      }
    }, { passive: false });

    // Mobile Touch Gestures (Pinch-to-zoom & Touch Pan)
    imgEl.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        initialPinchScale = currentScale;
      } else if (e.touches.length === 1 && currentScale > 1) {
        isPanning = true;
        startPanX = e.touches[0].clientX - panX;
        startPanY = e.touches[0].clientY - panY;
      }
    }, { passive: true });

    imgEl.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = dist / initialPinchDist;
        currentScale = Math.min(Math.max(1, initialPinchScale * factor), 4.5);
        updateTransform(false);
      } else if (e.touches.length === 1 && isPanning && currentScale > 1) {
        e.preventDefault();
        panX = e.touches[0].clientX - startPanX;
        panY = e.touches[0].clientY - startPanY;
        updateTransform(false);
      }
    }, { passive: false });

    imgEl.addEventListener("touchend", (e) => {
      if (e.touches.length < 2) {
        initialPinchDist = 0;
      }
      if (e.touches.length === 0) {
        isPanning = false;
        if (currentScale < 1.08) {
          resetZoom();
        } else {
          updateTransform(false);
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  function openLightbox(sourceImg) {
    if (!sourceImg || !sourceImg.src) return;
    createLightbox();
    resetZoom();

    imgEl.src = sourceImg.currentSrc || sourceImg.src;
    const caption = sourceImg.alt || sourceImg.title || "";
    captionEl.textContent = caption;

    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    document.body.style.overflow = "";
    resetZoom();
    setTimeout(() => {
      if (imgEl && !lightbox.classList.contains("is-open")) {
        imgEl.src = "";
      }
    }, 260);
  }

  // Ekspos global agar bisa dipanggil langsung dari modul/komponen
  window.openImageLightbox = openLightbox;

  // Resolusi elemen gambar dari target event (mendukung wrapper/kartu)
  function resolveTargetImage(target) {
    if (!target) return null;
    let img = target.closest("img");
    if (!img) {
      const card = target.closest(".sora-carousel-card, #sora-scroll-box, .sora-full-carousel");
      if (card) img = card.querySelector("img");
    }
    return img;
  }

  // Deteksi klik ganda (double-click) untuk Desktop
  document.addEventListener("dblclick", (e) => {
    const img = resolveTargetImage(e.target);
    if (!img) return;
    if (img.closest(".img-lightbox") || img.closest("#launcher") || img.closest(".to-top")) return;
    if (!img.src) return;
    e.preventDefault();
    openLightbox(img);
  });

  // Deteksi ketukan ganda (double-tap) untuk Mobile (ketuk dua kali dalam 350ms)
  let lastTapTime = 0;
  let lastTapTarget = null;
  document.addEventListener("touchend", (e) => {
    const img = resolveTargetImage(e.target);
    if (!img) return;
    if (img.closest(".img-lightbox") || img.closest("#launcher") || img.closest(".to-top")) return;
    if (!img.src) return;

    const now = Date.now();
    const diff = now - lastTapTime;
    if (diff < 350 && diff > 40 && (lastTapTarget === img || lastTapTarget === e.target)) {
      e.preventDefault();
      openLightbox(img);
      lastTapTime = 0;
      lastTapTarget = null;
    } else {
      lastTapTime = now;
      lastTapTarget = img || e.target;
    }
  }, { passive: false });
}

/* ==========================================================================
UNIVERSAL SECTIONS: KRITIK & SARAN & FOOTER QUOTE SLIDER
- Kritik & Saran selalu hadir di seluruh halaman di atas Kutipan Inspiratif
- Sistem Warna Selang-Seling:
   * Seksi Sebelumnya PUTIH -> Feedback HITAM -> Quote PUTIH
   * Seksi Sebelumnya HITAM -> Feedback PUTIH -> Quote HITAM
- Proteksi kontras 100%: teks, kartu, badge, tombol selalu tajam dan terbaca
========================================================================== */

function detectIfPrecedingSectionIsDark(masukanEl) {
  // 1. Temukan elemen seksi tepat sebelum #masukan di dalam DOM
  let prev = masukanEl ? masukanEl.previousElementSibling : null;
  while (prev && (prev.tagName === "SCRIPT" || prev.tagName === "STYLE" || prev.getAttribute?.("aria-hidden") === "true")) {
    prev = prev.previousElementSibling;
  }

  // Jika elemen sebelumnya adalah <main> atau tidak ada (misal #masukan disisipkan langsung sebelum <footer>)
  if (!prev || prev.tagName === "MAIN") {
    const main = (prev && prev.tagName === "MAIN") ? prev : document.querySelector("main");
    if (main && main.lastElementChild && main.lastElementChild !== masukanEl) {
      let innerPrev = main.lastElementChild;
      while (innerPrev && (innerPrev.tagName === "SCRIPT" || innerPrev.tagName === "STYLE" || innerPrev.getAttribute?.("aria-hidden") === "true" || innerPrev === masukanEl)) {
        innerPrev = innerPrev.previousElementSibling;
      }
      if (innerPrev) {
        prev = innerPrev;
      }
    }
  }

  // 2. Evaluasi atribut data-theme seksi sebelumnya secara langsung (Universal Zebra: Data-Theme First)
  if (prev) {
    const dt = prev.getAttribute("data-theme") || (prev.dataset ? prev.dataset.theme : null);
    if (dt === "dark") return true;
    if (dt === "light") return false;

    // Selektor seksi Gelap (Hitam / Obsidian)
    if (prev.matches(".material-library, .media-rekomendasi-page, .peringkat-section, .motivasi-section, .error-404-container, .error-404-card")) {
      return true;
    }
    // Selektor seksi Terang (Putih Bersih)
    if (prev.matches(".home-activities-dark-section, .management-section, .toko-faq-white-section, .translator-studio-section, .dictionary-section, .lomba-catalog-section, .buuku-lesson, .lesson-article, .documentation-section, #minigames, .quest-section, #kurikulum, .division-section, .proker-section")) {
      return false;
    }
  }

  // 3. Halaman khusus yang seksi konten terakhirnya sudah pasti berlatar HITAM
  const path = (window.location.pathname || "").toLowerCase();
  if (document.body.classList.contains("page-peringkat") ||
    document.body.classList.contains("page-motivasi") ||
    document.body.classList.contains("page-404") ||
    path.includes("/peringkat/") ||
    path.includes("404")) {
    return true;
  }

  // 4. Deteksi dinamis fallback via getComputedStyle & luminansi
  if (prev) {
    let el = prev;
    while (el && el !== document.body && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      if (bg && bg !== "transparent" && !bg.startsWith("rgba(0, 0, 0, 0)")) {
        const rgb = bg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0], 10);
          const g = parseInt(rgb[1], 10);
          const b = parseInt(rgb[2], 10);
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          return luminance < 128;
        }
      }
      el = el.parentElement;
    }
  }

  return false;
}

function setupUniversalFeedbackAndQuote() {
  const footer = document.querySelector(".global-footer");
  if (!footer) return;

  const basePath = getAppBasePath();

  // 1. Dapatkan atau buat elemen #masukan (Kritik & Saran)
  let masukanEl = document.getElementById("masukan");

  if (!masukanEl) {
    masukanEl = document.createElement("section");
    masukanEl.className = "section feedback-preview";
    masukanEl.id = "masukan";
    masukanEl.setAttribute("aria-label", "Kritik dan Saran Klub Mirai no Hana");
    masukanEl.innerHTML = `
            <div class="feedback-feature-card" data-expand-card>
                <div class="feedback-feature-header">
                    <span class="feedback-feature-tag">
                        <span class="badge-dot"></span>
                        SUARA MIRAI NO HANA
                    </span>
                </div>
                <div class="feedback-feature-body stacked-layout">
                    <span class="card-sub-jp">ご意見・ご要望</span>
                    <h2 class="feedback-card-title">Kritik &amp;<br><span class="highlight">Saran.</span></h2>
                    <div class="card-collapsible-content">
                        <div class="card-collapsible-inner">
                            <p class="feedback-card-desc">Punya ide, saran kegiatan, atau kendala di website? Sampaikan lewat formulir ini agar Mirai no Hana terus berkembang!</p>
                        </div>
                    </div>
                    <div class="feedback-feature-action">
                        <a class="btn primary feedback-cta-btn" data-expand-cta href="https://forms.gle/dFPRM842xxKq5YMt9" target="_blank" rel="noopener noreferrer">
                            <span>GFORM KRITIK DAN SARAN</span>
                            <span class="btn-arrow">↗</span>
                        </a>
                    </div>
                </div>
                <button type="button" class="card-toggle" aria-expanded="false" aria-label="Buka tutup detail"></button>
                <img class="card-corner-chibi" src="${basePath}images/mirai/icon/Fa.png" alt="Mascot Feedback Mirai No Hana" aria-hidden="true">
            </div>
        `;
    footer.parentNode.insertBefore(masukanEl, footer);
  }

  masukanEl.classList.add("is-visible");

  // 1.5. Deteksi dan sinkronisasi keluarga pattern halaman (w1 vs c1)
  const isW1Page = document.body.classList.contains("page-kelas") ||
    document.body.classList.contains("page-latihan") ||
    document.body.classList.contains("page-materi") ||
    document.body.classList.contains("page-kegiatan") ||
    document.body.classList.contains("page-divisi") ||
    document.body.classList.contains("page-divisi-hub") ||
    document.body.classList.contains("page-ktn") ||
    document.body.classList.contains("page-konbini") ||
    document.body.classList.contains("page-njr") ||
    document.body.classList.contains("page-ramadhan") ||
    document.body.classList.contains("page-tomodachi") ||
    document.body.classList.contains("page-peringkat") ||
    document.body.classList.contains("page-tentang");

  const patternFamily = isW1Page ? "w1" : "c1";
  if (!document.body.dataset.patternFamily) {
    document.body.dataset.patternFamily = patternFamily;
  }
  masukanEl.dataset.patternFamily = patternFamily;
  if (footer) {
    footer.dataset.patternFamily = patternFamily;
  }

  // 2. Deteksi warna seksi sebelumnya (Preceding Section)
  const isPrecedingDark = detectIfPrecedingSectionIsDark(masukanEl);

  // 3. Terapkan kelas tema selang-seling pada #masukan:
  // Jika preceding gelap -> masukan PUTIH
  // Jika preceding terang -> masukan HITAM
  if (isPrecedingDark) {
    masukanEl.classList.remove("feedback-theme-dark");
    masukanEl.classList.add("feedback-theme-white");
    masukanEl.dataset.patternColor = "white";
    masukanEl.setAttribute("data-theme", "light");
  } else {
    masukanEl.classList.remove("feedback-theme-white");
    masukanEl.classList.add("feedback-theme-dark");
    masukanEl.dataset.patternColor = "dark";
    masukanEl.setAttribute("data-theme", "dark");
  }

  // 4. Setup Kutipan Motivasi Slider (Kecuali halaman arsip motivasi itu sendiri)
  if (!document.body.classList.contains("page-motivasi")) {
    let quoteSection = document.getElementById("footerQuoteSliderSection");
    if (!quoteSection) {
      quoteSection = initFooterQuoteSlider(footer, basePath);
    }
    quoteSection.dataset.patternFamily = patternFamily;

    // Terapkan tema selang-seling pada slider kutipan:
    // Jika preceding gelap -> masukan putih -> quote slider HITAM
    // Jika preceding terang -> masukan hitam -> quote slider PUTIH
    if (isPrecedingDark) {
      quoteSection.classList.remove("quote-theme-white");
      quoteSection.classList.add("quote-theme-dark");
      quoteSection.dataset.patternColor = "dark";
      quoteSection.setAttribute("data-theme", "dark");
    } else {
      quoteSection.classList.remove("quote-theme-dark");
      quoteSection.classList.add("quote-theme-white");
      quoteSection.dataset.patternColor = "white";
      quoteSection.setAttribute("data-theme", "light");
    }
  }

// 5. Inisialisasi kartu expandable jika belum terpasang
setupExpandableCards();
}

function setupFooterQuoteSlider() {
setupUniversalFeedbackAndQuote();
}

function initFooterQuoteSlider(footer, basePath) {
const quotes = [
  {
    id: 1,
    animeId: "one-piece",
    name: "Monkey D. Luffy",
    anime: "One Piece",
    animeRomaji: "One Piece",
    author: "Eiichiro Oda",
    seriesDisplay: "One Piece · Eiichiro Oda",
    image: "luf.jpeg",
    chibi: "Ay.png",
    kanji: "海賊王に、おれはなる！",
    romaji: "Kaizoku-ou ni, ore wa naru!",
    literal: 'Arti Harfiah: "Aku akan menjadi Raja Bajak Laut!"',
    meaningTitle: "Berani Memulai Mimpi Besar",
    meaningText: "Jangan ragu menetapkan impian hanya karena orang lain menganggapnya sulit. Ketika kita berani melangkah dengan sungguh-sungguh, jalan dan teman seperjuangan akan selalu menyertai perjalanan kita.",
    accent: "#ff4f91",
    glow: "rgba(255, 79, 145, 0.35)",
    line: "#ff4f91",
    border: "rgba(255, 79, 145, 0.3)",
    badgeBg: "rgba(255, 79, 145, 0.12)",
    badgeBorder: "rgba(255, 79, 145, 0.35)"
  },
  {
    id: 2,
    animeId: "attack-on-titan",
    name: "Eren Yeager",
    anime: "Attack on Titan",
    animeRomaji: "Shingeki no Kyojin",
    author: "Hajime Isayama",
    seriesDisplay: "Shingeki no Kyojin · Hajime Isayama",
    image: "ere.jpeg",
    chibi: "Ka.png",
    kanji: "心臓を捧げよ！",
    romaji: "Shinzou o sasageyo!",
    literal: 'Arti Harfiah: "Persembahkan hatimu!"',
    meaningTitle: "Dedikasi Sepenuh Hati",
    meaningText: "Mencurahkan hati berarti memberikan fokus, perhatian, dan ketulusan terbaik saat belajar maupun berkarya bersama klub. Hasil yang berharga lahir dari usaha yang kita perjuangkan dengan tulus.",
    accent: "#ff4f91",
    glow: "rgba(255, 79, 145, 0.35)",
    line: "#ff4f91",
    border: "rgba(255, 79, 145, 0.3)",
    badgeBg: "rgba(255, 79, 145, 0.12)",
    badgeBorder: "rgba(255, 79, 145, 0.35)"
  },
  {
    id: 3,
    animeId: "naruto",
    name: "Uzumaki Naruto",
    anime: "Naruto",
    animeRomaji: "Naruto",
    author: "Masashi Kishimoto",
    seriesDisplay: "Naruto · Masashi Kishimoto",
    image: "nar.jpeg",
    chibi: "Lo.png",
    kanji: "まっすぐ自分の言葉は曲げねぇ。それが俺の忍道だ！",
    romaji: "Massugu jibun no kotoba wa magenee. Sore ga ore no nindou da!",
    literal: 'Arti Harfiah: "Aku tidak akan menarik kembali kata-kataku. Itulah jalan ninjaku!"',
    meaningTitle: "Pegang Teguh Komitmen Diri",
    meaningText: "Saat kita menetapkan niat untuk menguasai bahasa dan keterampilan baru, jangan mudah goyah oleh rasa lelah. Konsistensi kecil setiap hari akan membentuk kemajuan yang nyata.",
    accent: "#ff4f91",
    glow: "rgba(255, 79, 145, 0.35)",
    line: "#ff4f91",
    border: "rgba(255, 79, 145, 0.3)",
    badgeBg: "rgba(255, 79, 145, 0.12)",
    badgeBorder: "rgba(255, 79, 145, 0.35)"
  },
  {
    id: 4,
    animeId: "my-hero-academia",
    name: "Midoriya Izuku (Deku)",
    anime: "My Hero Academia",
    animeRomaji: "Boku no Hero Academia",
    author: "Kohei Horikoshi",
    seriesDisplay: "Boku no Hero Academia · Kohei Horikoshi",
    image: "dek.jpeg",
    chibi: "Al.png",
    kanji: "限界を超えて、さらに向こうへ！プルス・ウルトラ！",
    romaji: "Genkai o koete, sara ni mukou e! Purusu Urutora! (Plus Ultra)",
    literal: 'Arti Harfiah: "Lampaui batas, melangkah lebih jauh lagi! Plus Ultra!"',
    meaningTitle: "Melangkah Sedikit Lebih Jauh",
    meaningText: "Rasa jenuh dan buntu adalah pertanda bahwa kemampuan kita sedang berkembang ke tingkat berikutnya. Istirahat sejenak bila perlu, lalu lanjutkan langkah untuk berkembang lebih baik dari kemarin.",
    accent: "#ff4f91",
    glow: "rgba(255, 79, 145, 0.35)",
    line: "#ff4f91",
    border: "rgba(255, 79, 145, 0.3)",
    badgeBg: "rgba(255, 79, 145, 0.12)",
    badgeBorder: "rgba(255, 79, 145, 0.35)"
  },
  {
    id: 5,
    animeId: "demon-slayer",
    name: "Tanjiro Kamado",
    anime: "Demon Slayer",
    animeRomaji: "Kimetsu no Yaiba",
    author: "Koyoharu Gotouge",
    seriesDisplay: "Kimetsu no Yaiba · Koyoharu Gotouge",
    image: "tan.jpeg",
    chibi: "Fu.png",
    kanji: "頑張れ炭治郎、頑張れ！俺は今までよくやってきた！",
    romaji: "Ganbare Tanjiro, ganbare! Ore wa ima made yoku yatte kita!",
    literal: 'Arti Harfiah: "Semangat Tanjiro, semangat! Selama ini aku sudah berjuang dengan baik!"',
    meaningTitle: "Hargai Setiap Proses Belajar",
    meaningText: "Belajar hal baru tentu ada jatuh bangunnya. Daripada menyalahkan diri saat salah menjawab soal atau kesulitan memahami materi, beri apresiasi pada proses latihan yang sudah kamu jalani.",
    accent: "#ff4f91",
    glow: "rgba(255, 79, 145, 0.35)",
    line: "#ff4f91",
    border: "rgba(255, 79, 145, 0.3)",
    badgeBg: "rgba(255, 79, 145, 0.12)",
    badgeBorder: "rgba(255, 79, 145, 0.35)"
  }
];

let currentIndex = 0;
let autoTimer = null;

const section = document.createElement("section");
section.className = "section-quote-slider";
section.id = "footerQuoteSliderSection";
section.setAttribute("aria-label", "Kata-Kata Motivasi Karakter Anime");
section.innerHTML = `
        <div class="footer-quote-slider-section">
            <div class="footer-quote-slider-header">
                <div class="footer-quote-header-left">
                    <p class="section-eyebrow"><span class="jp-kanji" lang="ja">名言コレクション</span></p>
                    <h2 class="heading footer-quote-heading">Kata-Kata Motivasi <span>Karakter Anime</span></h2>
                </div>
                <div class="footer-quote-controls">
                    <button type="button" class="footer-quote-btn" id="footerQuotePrevBtn" aria-label="Kutipan Sebelumnya">‹</button>
                    <span class="footer-quote-counter" id="footerQuoteCounter">1 / ${quotes.length}</span>
                    <button type="button" class="footer-quote-btn" id="footerQuoteNextBtn" aria-label="Kutipan Selanjutnya">›</button>
                </div>
            </div>
            <div class="footer-quote-card-container" id="footerQuoteCardContainer"></div>
            <div class="footer-quote-dots" id="footerQuoteDots">
                ${quotes.map((_, i) => `<button type="button" class="footer-quote-dot ${i === 0 ? "active" : ""}" data-quote-dot="${i}" aria-label="Pilih kutipan ${i + 1}"></button>`).join("")}
            </div>
        </div>
    `;

footer.parentNode.insertBefore(section, footer);

const cardContainer = section.querySelector("#footerQuoteCardContainer");
const counterEl = section.querySelector("#footerQuoteCounter");
const prevBtn = section.querySelector("#footerQuotePrevBtn");
const nextBtn = section.querySelector("#footerQuoteNextBtn");
const dots = section.querySelectorAll(".footer-quote-dot");

function renderSlide(index) {
  currentIndex = (index + quotes.length) % quotes.length;
  const q = quotes[currentIndex];

  cardContainer.innerHTML = `
            <article class="quote-card quote-slide-enter" data-anime="${q.animeId}" style="--quote-accent: #ff4f91; --quote-line: #ff4f91; --quote-border: rgba(255, 79, 145, 0.3);">
                <div class="quote-card-body">
                    <div class="quote-top-row">
                        <div class="quote-author-profile">
                            <div class="quote-avatar-wrap">
                                <img class="quote-avatar-img" src="${basePath}images/mirai/karakter/${q.image}" alt="${q.name}" width="96" height="96" loading="lazy" decoding="async">
                            </div>
                            <h3 class="quote-author-name">${q.name}</h3>
                            <p class="quote-author-series">${q.seriesDisplay}</p>
                        </div>
                        <div class="quote-box">
                            <h4 class="quote-kanji">${q.kanji}</h4>
                            <p class="quote-romaji">${q.romaji}</p>
                            <div class="quote-literal">
                                <span>${q.literal}</span>
                            </div>
                        </div>
                    </div>
                    <div class="quote-meaning-card">
                        <div class="quote-meaning-head">
                            <span class="quote-meaning-eyebrow">MAKNA KUTIPAN</span>
                            <h5 class="quote-meaning-title">${q.meaningTitle}</h5>
                        </div>
                        <p class="quote-meaning-body">${q.meaningText}</p>
                    </div>
                </div>
            </article>
        `;

  if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${quotes.length}`;

  section.style.setProperty("--quote-accent", q.accent);
  section.style.setProperty("--quote-glow", q.glow);
  section.style.setProperty("--quote-border", q.border);

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
    if (i === currentIndex) {
      dot.style.setProperty("--quote-accent", q.accent);
      dot.style.setProperty("--quote-glow", q.glow);
    }
  });
}

function startAutoTimer() {
  stopAutoTimer();
  autoTimer = setInterval(() => {
    renderSlide(currentIndex + 1);
  }, 6500);
}

function stopAutoTimer() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

prevBtn?.addEventListener("click", () => {
  renderSlide(currentIndex - 1);
  startAutoTimer();
});

nextBtn?.addEventListener("click", () => {
  renderSlide(currentIndex + 1);
  startAutoTimer();
});

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    renderSlide(i);
    startAutoTimer();
  });
});

section.addEventListener("mouseenter", stopAutoTimer);
section.addEventListener("mouseleave", startAutoTimer);

let touchStartX = 0;
section.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  stopAutoTimer();
}, { passive: true });

section.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diffX = touchEndX - touchStartX;
  if (Math.abs(diffX) > 45) {
    if (diffX < 0) {
    renderSlide(currentIndex + 1);
    } else {
    renderSlide(currentIndex - 1);
    }
  }
  startAutoTimer();
}, { passive: true });

renderSlide(0);
startAutoTimer();

return section;
}


function setupExpandableCards() {
const cards = document.querySelectorAll("[data-expand-card]");
if (!cards.length) return;

cards.forEach((card) => {
  if (card.dataset.expandBound === "true") return;
  card.dataset.expandBound = "true";

  const toggleBtn = card.querySelector(".card-toggle");
  const isAboutDrawerCard = card.classList.contains("about-drawer-card") || card.id === "mnhAboutDrawerCard";

  if (isAboutDrawerCard) {
    setupAboutDrawerCard(card, toggleBtn);
    return;
  }

  // Standard 2-step card logic for all other cards
  card.addEventListener("click", (e) => {
    if (card.classList.contains("card-coming-soon-locked") || !isAccessUnlocked()) {
    if (card.classList.contains("card-coming-soon-locked")) {
    e.preventDefault();
    e.stopPropagation();
    window.MiraiSound?.playClickIfIdle();
    openPasswordModal();
    return;
    }
    }

    const ctaBtn = e.target.closest("[data-expand-cta]");
    if (ctaBtn) {
    // Biarkan kombinasi Ctrl / Cmd / Shift / Alt klik membuka tab baru secara normal
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
    return;
    }

    // Jika kartu masih tertutup: buka kartu dulu dan batalkan navigasi
    if (!card.classList.contains("is-expanded")) {
    e.preventDefault();
    e.stopPropagation();
    toggleCard(card, true);
    return;
    }
    // Jika kartu sudah terbuka: navigasi berjalan normal, stop bubbling agar kartu tidak tertutup
    e.stopPropagation();
    return;
    }

    // Jika klik pada link atau tombol interaktif lain selain toggle
    const otherInteractive = e.target.closest("a, button:not(.card-toggle), input, textarea, select");
    if (otherInteractive) {
    return;
    }

    // Toggle buka / tutup kartu
    const nextState = !card.classList.contains("is-expanded");
    toggleCard(card, nextState);
  });

  // Handler khusus toggle button (keyboard accessible & click)
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const nextState = !card.classList.contains("is-expanded");
    toggleCard(card, nextState);
    });
  }
});

function toggleCard(card, shouldOpen) {
  // Multi-expand universal: kartu yang terbuka bisa lebih dari satu secara bersamaan,
  // kartu lain tidak tertutup otomatis dan hanya tertutup jika kartu bersangkutan diklik kembali.
  card.classList.toggle("is-expanded", shouldOpen);

  const toggleBtn = card.querySelector(".card-toggle");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    toggleBtn.setAttribute("aria-label", shouldOpen ? "Tutup detail kartu" : "Buka detail kartu");
  }
  window.MiraiSound?.play("toggle");
}

/**
   * Khusus Card Tentang Mirai no Hana:
   * Alur 3x Klik & Penutupan Bertahap:
   * - Klik 1 (card / tombol saat tertutup): buka deskripsi kartu (is-expanded: true, is-pulled: false)
   * - Klik 2 (card / tombol saat deskripsi buka): buka animasi laci logo NK (is-pulled: true)
   * - Klik 3 (tombol saat animasi logo NK buka): navigasi menuju halaman tujuan (tentang/index.html)
   * - Klik mundur 1 (card saat animasi logo NK buka): tutup animasi logo NK (is-pulled: false, deskripsi tetap buka)
   * - Klik mundur 2 (card saat deskripsi buka setelah animasi tutup): tutup deskripsi kartu (is-expanded: false)
*/
function setupAboutDrawerCard(card, toggleBtn) {
  function updateToggle(shouldOpen) {
    if (toggleBtn) {
    toggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    toggleBtn.setAttribute("aria-label", shouldOpen ? "Tutup detail kartu" : "Buka detail kartu");
    }
  }

  card.addEventListener("click", (e) => {
    if (card.classList.contains("card-coming-soon-locked")) {
    e.preventDefault();
    e.stopPropagation();
    window.MiraiSound?.playClickIfIdle();
    openPasswordModal();
    return;
    }

    const ctaBtn = e.target.closest("[data-expand-cta]");

    // 1. Aksi Klik pada Tombol CTA ("TENTANG MIRAI NO HANA ->")
    if (ctaBtn) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
    return;
    }

    // Klik 1: Jika kartu masih tertutup -> buka deskripsi
    if (!card.classList.contains("is-expanded")) {
    e.preventDefault();
    e.stopPropagation();
    card.classList.add("is-expanded");
    card.classList.remove("is-pulled");
    card.dataset.drawerPhase = "desc";
    updateToggle(true);
    return;
    }

    // Klik 2: Jika deskripsi sudah buka, tapi animasi logo NK belum buka -> buka animasi logo NK
    if (!card.classList.contains("is-pulled")) {
    e.preventDefault();
    e.stopPropagation();
    card.classList.add("is-pulled");
    card.dataset.drawerPhase = "logo";
    return;
    }

    // Klik 3: Jika animasi logo NK sudah buka -> pindah ke page yang dituju
    e.stopPropagation();
    return;
    }

    // Abaikan jika klik elemen interaktif lain selain toggle
    const otherInteractive = e.target.closest("a, input, textarea, select");
    if (otherInteractive) {
    return;
    }

    // 2. Aksi Klik pada Area Card atau Tombol Toggle
    // Klik 1: Jika kartu masih tertutup -> buka deskripsi
    if (!card.classList.contains("is-expanded")) {
    card.classList.add("is-expanded");
    card.classList.remove("is-pulled");
    card.dataset.drawerPhase = "desc";
    updateToggle(true);
    return;
    }

    // Klik mundur 1: Jika animasi logo NK sedang buka -> tutup animasi logo NK
    if (card.classList.contains("is-pulled")) {
    card.classList.remove("is-pulled");
    card.dataset.drawerPhase = "closing"; // Tandai fase penutupan mundur
    return;
    }

    // Klik mundur 2: Jika deskripsi buka dan animasi baru ditutup -> tutup deskripsi
    if (card.dataset.drawerPhase === "closing") {
    card.classList.remove("is-expanded");
    card.classList.remove("is-pulled");
    card.dataset.drawerPhase = "0";
    updateToggle(false);
    return;
    }

    // Klik 2 (fase maju): Jika deskripsi buka -> buka animasi logo NK
    card.classList.add("is-pulled");
    card.dataset.drawerPhase = "logo";
  });
}
}

/* ==========================================================================
5 EFEK MIKRO-INTERAKSI MODERN (GPU-Accelerated & 60fps)
========================================================================== */

/**
 * 1. Top Scroll Progress Bar
 * Membuat elemen progress bar di bagian paling atas viewport yang lebarnya
 * di-update menggunakan requestAnimationFrame saat user scroll.
*/
function setupScrollProgressBar() {
let bar = document.querySelector(".scroll-progress-bar");
if (!bar) {
  bar = document.createElement("div");
  bar.className = "scroll-progress-bar";
  document.body.prepend(bar);
}

let ticking = false;
function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
  bar.style.width = `${progress}%`;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });

window.addEventListener("resize", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });

updateProgress();
}

/**
 * 2. Ambient Sakura Petals pada Hero Banner
 * Menyuntikkan kontainer .hero-sakura-layer dan 10 partikel kelopak sakura
 * CSS murni (.hero-petal) ke dalam seluruh hero banner.
*/
function setupHeroSakuraPetals() {
if (window.innerWidth < 768) return;
const heroElements = document.querySelectorAll(".hero, .page-hero, .proker-hero, .quest-hero, .toko-hero");
if (!heroElements.length) return;

heroElements.forEach((hero) => {
  if (hero.querySelector(".hero-sakura-layer")) return;

  const layer = document.createElement("div");
  layer.className = "hero-sakura-layer";
  layer.setAttribute("aria-hidden", "true");

  // 10 partikel kelopak sakura dengan parameter acak
  for (let i = 0; i < 10; i++) {
    const petal = document.createElement("div");
    petal.className = "hero-petal";

    const left = Math.random() * 92 + 2; // 2% - 94%
    const width = 10 + Math.random() * 6; // 10px - 16px
    const height = width * 1.35;
    const duration = 8 + Math.random() * 6; // 8s - 14s
    const delay = -(Math.random() * duration); // Tersebar merata sejak awal
    const opacity = 0.5 + Math.random() * 0.35;

    petal.style.left = `${left.toFixed(1)}%`;
    petal.style.width = `${width.toFixed(1)}px`;
    petal.style.height = `${height.toFixed(1)}px`;
    petal.style.animationDuration = `${duration.toFixed(2)}s`;
    petal.style.animationDelay = `${delay.toFixed(2)}s`;
    petal.style.opacity = `${opacity.toFixed(2)}`;

    layer.appendChild(petal);
  }

  hero.appendChild(layer);
});
}

/**
 * 3. Interactive Spotlight Glow & 3D Tilt Halus pada Kartu
 * Pada perangkat hover: hover, menambahkan efek spotlight kursor (--mouse-x, --mouse-y)
 * dan kemiringan perspektif 3D halus (maksimal 3.5 derajat).
*/
function setupCardTiltAndSpotlight() {
const isHoverDevice = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (!isHoverDevice) return;

const cardSelectors = [
  ".start-card",
  ".activity-start-card",
  ".class-card",
  ".course-card",
  ".division-card",
  ".program-card",
  ".podium-card",
  ".toko-card"
];
const cards = document.querySelectorAll(cardSelectors.join(","));
if (!cards.length) return;

cards.forEach((card) => {
  if (!card.querySelector(".card-spotlight-glow")) {
    const glow = document.createElement("div");
    glow.className = "card-spotlight-glow";
    glow.setAttribute("aria-hidden", "true");
    card.appendChild(glow);
  }

  let rafId = null;

  card.addEventListener("mousemove", (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    // 3D Tilt: maksimal 3.5 derajat
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (((y - centerY) / centerY) * -3.5).toFixed(2);
    const rotateY = (((x - centerX) / centerX) * 3.5).toFixed(2);

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
  });

  card.addEventListener("mouseleave", () => {
    if (rafId) cancelAnimationFrame(rafId);
    card.style.transform = "none";
  });
});
}

/**
 * 4. Sakura Ripple Effect saat Klik / Tap
 * Memunculkan riak lingkaran sakura di titik koordinat klik yang membesar
 * dan memudar dalam 0.55 detik lalu otomatis dihapus.
*/
function setupSakuraRipple() {
const targetSelector = ".btn, button, .start-card, .class-card, .rek-cat-btn, .lb-tab-btn, .toko-cat-btn";

document.addEventListener("pointerdown", (e) => {
  const target = e.target.closest(targetSelector);
  if (!target) return;

  // Jangan picu ripple pada tombol yang dinonaktifkan
  if (target.disabled || target.getAttribute("aria-disabled") === "true") return;

  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 0.9;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Pastikan kontainer memiliki posisi non-static dan overflow hidden
  const comp = window.getComputedStyle(target);
  if (comp.position === "static") {
    target.style.position = "relative";
  }
  if (comp.overflow !== "hidden") {
    target.style.overflow = "hidden";
  }

  const ripple = document.createElement("span");
  ripple.className = "sakura-ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  target.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 550);
}, { passive: true });
}

/**
 * 5. Tab Cascade Transition
 * Memberikan animasi masuk fadeSlideUp setiap kali konten tab di Kamus,
 * Peringkat, Rekomendasi, Lomba, atau Toko berganti.
*/
function setupTabCascadeTransition() {
document.addEventListener("click", (e) => {
  const tabBtn = e.target.closest(".lb-tab-btn, .rek-cat-btn, .lomba-filter-chip, .toko-cat-btn, .mgmt-tab-btn, [role='tab'], .tab-btn");
  if (!tabBtn) return;

  requestAnimationFrame(() => {
    const targetContainers = document.querySelectorAll(
    "#eventsGrid, #tokoProductGrid, .lb-points-grid, .lb-podium-grid, .leaderboard-table-wrapper, .tab-pane.active, .tab-content.active, [data-tab-content].active, .kanji-grid, .mgmt-slider-container"
    );
    targetContainers.forEach((container) => {
    container.classList.remove("tab-cascade-animate");
    void container.offsetWidth; // Reflow trigger
    container.classList.add("tab-cascade-animate");
    });
  });
}, { passive: true });
}

/* ==========================================================================
MIRAI PROGRESS ENGINE (localStorage-based learning progress)
========================================================================== */

const MiraiProgressLegacy = {
STORAGE_KEY_COMPLETED: "mirai_completed_materi",
STORAGE_KEY_LAST: "mirai_last_materi",
STORAGE_KEY_WRONG: "mirai_wrong_questions",

TOTAL_MATERI: 8,

getCompleted() {
  try {
    const raw = localStorage.getItem(this.STORAGE_KEY_COMPLETED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
},

isCompleted(materiId) {
  if (!materiId) return false;
  return this.getCompleted().includes(materiId);
},

toggleCompleted(materiId) {
  if (!materiId) return false;
  let list = this.getCompleted();
  let newState = false;
  if (list.includes(materiId)) {
    list = list.filter((id) => id !== materiId);
    newState = false;
  } else {
    list.push(materiId);
    newState = true;
  }
  try {
    localStorage.setItem(this.STORAGE_KEY_COMPLETED, JSON.stringify(list));
  } catch (e) {
    console.warn("Gagal menyimpan progress materi:", e);
  }
  return newState;
},

getLastMateri() {
  try {
    const raw = localStorage.getItem(this.STORAGE_KEY_LAST);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch (e) {
    return null;
  }
},

setLastMateri(id, title, step, url) {
  if (!id || !url) return;
  try {
    const item = {
    id,
    title: title || id,
    step: step || "",
    url,
    timestamp: Date.now()
    };
    localStorage.setItem(this.STORAGE_KEY_LAST, JSON.stringify(item));
  } catch (e) {}
},

setupLessonPage() {
  const container = document.querySelector("[data-materi-id]");
  if (!container) return;

  const materiId = container.dataset.materiId;
  const materiTitle = container.dataset.materiTitle || document.title.split("—")[0].trim();
  const materiStep = container.dataset.materiStep || "Modul";

  // Otomatis simpan sebagai materi terakhir dibuka
  this.setLastMateri(materiId, materiTitle, materiStep, window.location.href);

  // Pengendali tombol "Tandai Materi Selesai"
  const toggleBtn = document.querySelector(".materi-complete-toggle");
  if (toggleBtn) {
    const updateBtnUI = (isDone) => {
    if (isDone) {
    toggleBtn.classList.add("is-active");
    toggleBtn.innerHTML = `<span>✓</span><span>Materi Selesai</span>`;
    toggleBtn.setAttribute("aria-pressed", "true");
    } else {
    toggleBtn.classList.remove("is-active");
    toggleBtn.innerHTML = `<span>○</span><span>Tandai Selesai</span>`;
    toggleBtn.setAttribute("aria-pressed", "false");
    }
    };

    updateBtnUI(this.isCompleted(materiId));

    toggleBtn.addEventListener("click", () => {
    const isNowDone = this.toggleCompleted(materiId);
    updateBtnUI(isNowDone);
    });
  }

  // Pengendali Kuis Cepat Pemahaman
  const quizCards = document.querySelectorAll(".buuku-quiz-card");
  quizCards.forEach((card) => {
    const optButtons = card.querySelectorAll(".buuku-quiz-opt-btn");
    const feedbackEl = card.querySelector(".buuku-quiz-feedback");

    optButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
    const isCorrect = btn.dataset.correct === "true";
    optButtons.forEach((b) => {
      b.disabled = true;
      if (b.dataset.correct === "true") {
        b.classList.add("is-correct");
      }
    });

    if (!isCorrect) {
      btn.classList.add("is-wrong");
    }

    if (feedbackEl) {
      feedbackEl.classList.add("is-visible");
      feedbackEl.classList.add(isCorrect ? "correct" : "wrong");
    }
    });
    });
  });
},

setupResumeBanner() {
  const isClassIndex = window.location.pathname.endsWith("/kelas/index.html") || window.location.pathname.endsWith("/kelas/");
  const isMateriDasarIndex = window.location.pathname.includes("/materi/dasar/index.html") || window.location.pathname.endsWith("/materi/dasar/");
  const isMateriLanjutanIndex = window.location.pathname.includes("/materi/lanjutan/index.html") || window.location.pathname.endsWith("/materi/lanjutan/");

  if (!isClassIndex && !isMateriDasarIndex && !isMateriLanjutanIndex) return;

  const completed = this.getCompleted();
  const lastMateri = this.getLastMateri();

  // 1. Beri badge "✓ Selesai" pada kartu modul yang link-nya cocok
  const cards = document.querySelectorAll(".material-card, .course-card");
  cards.forEach((card) => {
    const href = card.getAttribute("href") || "";
    const matchedId = completed.find((id) => {
    const shortName = id.replace("materi-dasar-", "").replace("materi-lanjutan-", "");
    return href.includes(shortName);
    });

    if (matchedId && !card.querySelector(".materi-status-badge")) {
    const badge = document.createElement("span");
    badge.className = "materi-status-badge is-completed";
    badge.innerHTML = "✓ Selesai";
    badge.style.marginLeft = "8px";
    const heading = card.querySelector("h3");
    if (heading) {
    heading.appendChild(badge);
    }
    }
  });

  // Hapus elemen banner jika sempat ter-render atau tersisa
  document.querySelectorAll(".progress-resume-banner").forEach((banner) => {
    banner.remove();
  });
}
};

if (!window.MiraiProgress) {
  window.MiraiProgress = MiraiProgressLegacy;
}

function initMiraiProgress() {
  if (window.MiraiProgress && typeof window.MiraiProgress.setupLessonPage === "function") {
    window.MiraiProgress.setupLessonPage();
    window.MiraiProgress.setupResumeBanner();
  } else if (window.MiraiProgress && typeof window.MiraiProgress.init === "function") {
    window.MiraiProgress.init();
  }
}

/* ==========================================================================
COMING SOON (SEGERA HADIR) & ACCESS CONTROL SYSTEM
- Kunci akses & efek blur untuk halaman/seksi berstatus "Segera Hadir"
- Tombol gembok di sebelah kata "MENU" pada sidebar (Merah: Terkunci, Hijau: Terbuka)
- Keamanan tingkat tinggi: Sandi di-hash dengan Salted SHA-256 (Anti-Bocor/Hack)
- Seksi terkunci: #kurikulum (kelas) & #studio-terjemahan (kamus)
- Halaman terkunci: Selain Beranda, Kelas, Kamus (Saran & Kritik BEBAS dari kunci)
========================================================================== */

const CS_SESSION_KEY = "mnh_access_unlocked";
const CS_SALT = "mirainohana_smawh2_salt_2026:";
const CS_TARGET_HASH = "619bb918bff1fddc0674c02a5513af80c8365b3fbaed0736f5e12b1d093f6733";

// Fungsi murni SHA-256 (Berjalan mandiri di semua peramban, offline & file://)
function sha256Sync(ascii) {
function rightRotate(value, amount) {
  return (value >>> amount) | (value << (32 - amount));
}
const words = [];
const asciiBitLength = ascii.length * 8;
let hash = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
];
const k = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];
let i, j;
for (i = 0; i < ascii.length; i++) {
  const jIdx = i >> 2;
  words[jIdx] = (words[jIdx] || 0) | (ascii.charCodeAt(i) << (24 - (i % 4) * 8));
}
const endIdx = asciiBitLength >> 5;
words[endIdx] = (words[endIdx] || 0) | (0x80 << (24 - (asciiBitLength % 32)));
words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

const w = new Array(64);
for (i = 0; i < words.length; i += 16) {
  const oldHash = hash.slice(0);
  for (j = 0; j < 64; j++) {
    if (j < 16) {
    w[j] = words[i + j] | 0;
    } else {
    const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
    const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
    w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }
    const s1_ = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
    const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
    const temp1 = (hash[7] + s1_ + ch + k[j] + w[j]) | 0;
    const s0_ = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
    const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
    const temp2 = (s0_ + maj) | 0;

    hash[7] = hash[6];
    hash[6] = hash[5];
    hash[5] = hash[4];
    hash[4] = (hash[3] + temp1) | 0;
    hash[3] = hash[2];
    hash[2] = hash[1];
    hash[1] = hash[0];
    hash[0] = (temp1 + temp2) | 0;
  }
  for (j = 0; j < 8; j++) {
    hash[j] = (hash[j] + oldHash[j]) | 0;
  }
}
let result = "";
for (i = 0; i < 8; i++) {
  for (j = 3; j >= 0; j--) {
    const b = (hash[i] >> (j * 8)) & 255;
    result += (b < 16 ? "0" : "") + b.toString(16);
  }
}
return result;
}

async function verifyAccessPassword(inputPassword) {
const salted = CS_SALT + (inputPassword || "").trim().toLowerCase();
try {
  if (window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(salted);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex === CS_TARGET_HASH;
  }
} catch (e) {}
return sha256Sync(salted) === CS_TARGET_HASH;
}

function isAccessUnlocked() {
try {
  return sessionStorage.getItem(CS_SESSION_KEY) === "true";
} catch (e) {
  return window.__mnhAccessUnlocked === true;
}
}

function setAccessUnlocked(val) {
try {
  if (val) {
    sessionStorage.setItem(CS_SESSION_KEY, "true");
  } else {
    sessionStorage.removeItem(CS_SESSION_KEY);
  }
} catch (e) {}
window.__mnhAccessUnlocked = Boolean(val);
}

function isCurrentPageComingSoon() {
const rawPath = (window.location.pathname || "").toLowerCase();
const lockedDirs = [
  "/toko/",
  "/peringkat/",
  "/lomba/",
    "/kegiatan/",
  "/divisi/"
];
return lockedDirs.some((dir) => rawPath.includes(dir));
}

function getComingSoonPageInfo() {
const rawPath = (window.location.pathname || "").toLowerCase();
if (rawPath.includes("/toko/")) {
  return {
    title: "Toko Resmi Klub",
    kanji: "公式ショップ",
    icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
    desc: "Katalog merchandise eksklusif klub Mirai No Hana sedang dipersiapkan dan akan segera dirilis resmi."
  };
}
if (rawPath.includes("/peringkat/")) {
  return {
    title: "Papan Peringkat Prestasi",
    kanji: "リーダーボード",
    icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>',
    desc: "Sistem papan peringkat dan leaderboard pencapaian belajar anggota klub sedang dalam tahap finalisasi data."
  };
}
if (rawPath.includes("/lomba/")) {
  return {
    title: "Informasi Lomba & Acara",
    kanji: "大会＆イベント",
    icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    desc: "Jadwal kompetisi, lomba internal/eksternal, serta festival kebudayaan Jepang akan segera diumumkan."
  };
}
if (rawPath.includes("/tentang/")) {
  return {
    title: "Profil Klub & Struktur",
    kanji: "クラブ概要",
    icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    desc: "Halaman informasi sejarah, visi misi, serta struktur kepengurusan resmi klub sedang disempurnakan."
  };
}
if (rawPath.includes("/kegiatan/")) {
  return {
    title: "Program Kerja & Kegiatan",
    kanji: "活動＆プログラム",
    icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    desc: "Dokumentasi dan jadwal program kerja tahunan klub sedang dalam proses kurasi konten interaktif."
  };
}
if (rawPath.includes("/divisi/")) {
  return {
    title: "Divisi & Kepengurusan Klub",
    kanji: "クラブ部門",
    icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',
    desc: "Detail informasi mengenai pembagian divisi minat dan bakat klub sedang dalam tahap penyempurnaan."
  };
}
const pageTitle = (document.title || "").split("-")[0].trim() || "Segera Hadir";
return {
  title: pageTitle,
  kanji: "近日公開",
  icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  desc: "Halaman ini sedang dalam tahap pengembangan dan persiapan konten resmi."
};
}

function ensurePasswordModal() {
if (document.getElementById("mnhPasswordModal")) return;

const modal = document.createElement("div");
modal.className = "password-modal-backdrop";
modal.id = "mnhPasswordModal";
modal.setAttribute("aria-hidden", "true");

modal.innerHTML = `
        <div class="password-modal-card" role="dialog" aria-modal="true" aria-labelledby="csModalTitle">
            <button type="button" class="password-modal-close" id="csModalCloseBtn" aria-label="Tutup Dialog">✕</button>
            <div class="password-modal-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
            <h3 class="password-modal-title" id="csModalTitle">Akses Khusus Pengurus</h3>
            <span class="password-modal-kanji">管理者アクセス制限</span>
            <p class="password-modal-desc">Halaman atau seksi ini berstatus <strong>Segera Hadir</strong>. Masukkan kata sandi pengurus untuk membuka seluruh akses fitur secara instan.</p>
            <form id="csPasswordForm" autocomplete="off" onsubmit="return false;">
                <div class="password-input-wrap">
                    <input type="password" class="password-modal-input" id="csPasswordInput" placeholder="Masukkan kata sandi..." autocomplete="current-password" spellcheck="false">
                    <button type="button" class="password-toggle-visibility" id="csPasswordToggleBtn" aria-label="Lihat kata sandi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                </div>
                <div class="password-modal-msg" id="csPasswordMsg" style="display: none;"></div>
                <div class="password-modal-actions">
                    <button type="button" class="password-btn-cancel" id="csModalCancelBtn">Batal</button>
                    <button type="submit" class="password-btn-submit" id="csModalSubmitBtn">Buka Akses</button>
                </div>
            </form>
        </div>
    `;

document.body.appendChild(modal);

const closeBtn = modal.querySelector("#csModalCloseBtn");
const cancelBtn = modal.querySelector("#csModalCancelBtn");
const toggleBtn = modal.querySelector("#csPasswordToggleBtn");
const form = modal.querySelector("#csPasswordForm");
const input = modal.querySelector("#csPasswordInput");

closeBtn?.addEventListener("click", closePasswordModal);
cancelBtn?.addEventListener("click", closePasswordModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closePasswordModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-active")) {
    closePasswordModal();
  }
});

toggleBtn?.addEventListener("click", () => {
  if (input.type === "password") {
    input.type = "text";
    toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    toggleBtn.setAttribute("aria-label", "Sembunyikan kata sandi");
  } else {
    input.type = "password";
    toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    toggleBtn.setAttribute("aria-label", "Lihat kata sandi");
  }
});

form?.addEventListener("submit", handlePasswordSubmit);
}

function openPasswordModal() {
ensurePasswordModal();
const modal = document.getElementById("mnhPasswordModal");
if (!modal) return;

const input = document.getElementById("csPasswordInput");
const msg = document.getElementById("csPasswordMsg");
if (input) {
  input.value = "";
  input.classList.remove("is-invalid");
}
if (msg) {
  msg.textContent = "";
  msg.style.display = "none";
  msg.className = "password-modal-msg";
}

modal.classList.add("is-active");
modal.setAttribute("aria-hidden", "false");
document.body.style.overflow = "hidden";

setTimeout(() => {
  input?.focus();
}, 120);
}

function closePasswordModal() {
const modal = document.getElementById("mnhPasswordModal");
if (!modal) return;
modal.classList.remove("is-active");
modal.setAttribute("aria-hidden", "true");

if (!document.body.classList.contains("is-page-locked")) {
  document.body.style.overflow = "";
}
}

let csFailedAttempts = 0;

async function handlePasswordSubmit(e) {
if (e) e.preventDefault();
const input = document.getElementById("csPasswordInput");
const msg = document.getElementById("csPasswordMsg");
const submitBtn = document.getElementById("csModalSubmitBtn");
if (!input || input.disabled) return;

const val = (input.value || "").trim().toLowerCase();

if (submitBtn) submitBtn.disabled = true;
const isCorrect = await verifyAccessPassword(val);
if (submitBtn) submitBtn.disabled = false;

if (isCorrect) {
  csFailedAttempts = 0;
  if (msg) {
    msg.className = "password-modal-msg is-success";
    msg.textContent = "✓ Kata sandi benar! Membuka seluruh akses...";
    msg.style.display = "block";
  }
  input.classList.remove("is-invalid");
  window.MiraiSound?.playClickIfIdle();

  setTimeout(() => {
    setAccessUnlocked(true);
    applyComingSoonState();
    closePasswordModal();
  }, 400);
} else {
  csFailedAttempts++;
  input.classList.remove("is-invalid");
  void input.offsetWidth;
  input.classList.add("is-invalid");

  if (msg) {
    msg.className = "password-modal-msg is-error";
    if (csFailedAttempts >= 3) {
    msg.textContent = "✕ Terlalu banyak percobaan gagal. Mohon tunggu 3 detik...";
    input.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    setTimeout(() => {
    input.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    msg.textContent = "✕ Kata sandi salah. Silakan coba lagi!";
    input.focus();
    }, 3000);
    } else {
    msg.textContent = "✕ Kata sandi salah. Akses ditolak!";
    }
    msg.style.display = "block";
  }

  setTimeout(() => {
    input.classList.remove("is-invalid");
  }, 450);

  input.focus();
  input.select();
}
}

function setupSidebarLockBtn(isUnlocked) {
const sidebarLabel = document.querySelector(".sidebar-header .sidebar-label");
if (!sidebarLabel) return;

let lockBtn = document.getElementById("sidebarLockBtn");
if (!lockBtn) {
  lockBtn = document.createElement("button");
  lockBtn.type = "button";
  lockBtn.id = "sidebarLockBtn";
  lockBtn.className = "sidebar-lock-btn";
  sidebarLabel.appendChild(lockBtn);

  lockBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.MiraiSound?.playClickIfIdle();
    if (isAccessUnlocked()) {
    const relock = confirm("Kunci kembali seluruh halaman dan seksi 'Segera Hadir'?");
    if (relock) {
    setAccessUnlocked(false);
    applyComingSoonState();
    }
    } else {
    openPasswordModal();
    }
  });
}

if (isUnlocked) {
  lockBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>';
  lockBtn.classList.add("is-unlocked");
  lockBtn.setAttribute("title", "Akses Pengurus Terbuka - Klik untuk mengunci kembali");
  lockBtn.setAttribute("aria-label", "Akses Pengurus Terbuka");
} else {
  lockBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
  lockBtn.classList.remove("is-unlocked");
  lockBtn.setAttribute("title", "Akses Terkunci (Segera Hadir) - Klik untuk memasukkan kata sandi");
  lockBtn.setAttribute("aria-label", "Akses Terkunci Segera Hadir");
}
}

function updateMenuComingSoonBadges(isUnlocked) {
const lockedWords = ["toko", "peringkat", "lomba", "kegiatan", "divisi"];
const navLinks = document.querySelectorAll(".sidebar-links a");

navLinks.forEach((link) => {
  const href = (link.getAttribute("href") || "").toLowerCase();
  const isLockedLink = lockedWords.some((word) => href.includes(word));

  const existingBadge = link.querySelector(".menu-coming-soon-badge");

  if (isLockedLink && !isUnlocked) {
    if (!existingBadge) {
    const badge = document.createElement("span");
    badge.className = "menu-coming-soon-badge";
    badge.textContent = "SEGERA HADIR";
    link.appendChild(badge);
    }
    if (!link.dataset.lockBound) {
    link.dataset.lockBound = "true";
    link.addEventListener("click", (e) => {
    if (!isAccessUnlocked()) {
      e.preventDefault();
      e.stopPropagation();
      window.MiraiSound?.playClickIfIdle();
      openPasswordModal();
    }
    });
    }
  } else {
    if (existingBadge) {
    existingBadge.remove();
    }
  }
});
}

function updatePageComingSoonOverlay(isUnlocked) {
const isLocked = !isUnlocked && isCurrentPageComingSoon();

if (isLocked) {
  document.body.classList.add("is-page-locked");

  let pageOverlay = document.getElementById("comingSoonPageOverlay");
  if (!pageOverlay) {
    const info = getComingSoonPageInfo();
    const homeUrl = getAppBasePath() + "index.html";
    pageOverlay = document.createElement("div");
    pageOverlay.id = "comingSoonPageOverlay";
    pageOverlay.className = "coming-soon-page-overlay";
    pageOverlay.innerHTML = `
                <div class="coming-soon-card">
                    <div class="coming-soon-pill">SEGERA HADIR</div>
                    <div class="coming-soon-icon">${info.icon}</div>
                    <h2 class="coming-soon-title">${info.title}</h2>
                    <div class="coming-soon-actions">
                        <button type="button" class="coming-soon-btn-unlock" id="csPageUnlockBtn">
                            <span>Masukkan Sandi Pengurus</span>
                        </button>
                        <a href="${homeUrl}" class="coming-soon-btn-home">
                            <span>← Kembali ke Beranda</span>
                        </a>
                    </div>
                </div>
            `;
    document.body.appendChild(pageOverlay);

    pageOverlay.querySelector("#csPageUnlockBtn")?.addEventListener("click", () => {
    window.MiraiSound?.playClickIfIdle();
    openPasswordModal();
    });
  }
} else {
  document.documentElement.classList.remove("is-page-locked-early");
  document.body.classList.remove("is-page-locked");
  document.getElementById("comingSoonPageOverlay")?.remove();
}
}

function updateSectionComingSoonOverlay(isUnlocked) {
// 1. Seksi Kurikulum & Tata Cara di kelas/index.html
const kurikulumEl = document.getElementById("kurikulum");
if (kurikulumEl) {
  if (!isUnlocked) {
    kurikulumEl.classList.add("is-section-locked");
    let overlay = kurikulumEl.querySelector(".coming-soon-section-overlay");
    if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "coming-soon-section-overlay";
    overlay.innerHTML = `
                    <div class="coming-soon-card">
                        <div class="coming-soon-pill">SEGERA HADIR</div>
                        <div class="coming-soon-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></div>
                        <h3 class="coming-soon-title">Kurikulum &amp; Tata Cara Pengajaran</h3>
                        <div class="coming-soon-actions">
                            <button type="button" class="coming-soon-btn-unlock cs-section-unlock-btn">
                                <span>Masukkan Sandi Pengurus</span>
                            </button>
                        </div>
                    </div>
                `;
    kurikulumEl.appendChild(overlay);
    overlay.querySelector(".cs-section-unlock-btn")?.addEventListener("click", () => {
    window.MiraiSound?.playClickIfIdle();
    openPasswordModal();
    });
    }
  } else {
    kurikulumEl.classList.remove("is-section-locked");
    kurikulumEl.querySelector(".coming-soon-section-overlay")?.remove();
  }
}

// 2. Seksi Studio Ketik & Terjemahan di kamus/index.html
const studioEl = document.getElementById("studio-terjemahan");
if (studioEl) {
  if (!isUnlocked) {
    studioEl.classList.add("is-section-locked");
    let overlay = studioEl.querySelector(".coming-soon-section-overlay");
    if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "coming-soon-section-overlay";
    overlay.innerHTML = `
                    <div class="coming-soon-card">
                        <div class="coming-soon-pill">SEGERA HADIR</div>
                        <div class="coming-soon-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="6" y1="12" x2="6.01" y2="12"></line><line x1="18" y1="12" x2="18.01" y2="12"></line><line x1="9" y1="16" x2="15" y2="16"></line></svg></div>
                        <h3 class="coming-soon-title">Studio Ketik &amp; Terjemahan Jepang</h3>
                        <div class="coming-soon-actions">
                            <button type="button" class="coming-soon-btn-unlock cs-section-unlock-btn">
                                <span>Masukkan Sandi Pengurus</span>
                            </button>
                        </div>
                    </div>
                `;
    studioEl.appendChild(overlay);
    overlay.querySelector(".cs-section-unlock-btn")?.addEventListener("click", () => {
    window.MiraiSound?.playClickIfIdle();
    openPasswordModal();
    });
    }
  } else {
    studioEl.classList.remove("is-section-locked");
    studioEl.querySelector(".coming-soon-section-overlay")?.remove();
  }
}

// 3. Seksi Prestasi & Penghargaan di tentang/index.html
const prestasiEl = document.getElementById("prestasi");
if (prestasiEl) {
  if (!isUnlocked) {
    prestasiEl.classList.add("is-section-locked");
    let overlay = prestasiEl.querySelector(".coming-soon-section-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "coming-soon-section-overlay";
      overlay.innerHTML = `
        <div class="coming-soon-card">
          <div class="coming-soon-pill">SEGERA HADIR</div>
          <div class="coming-soon-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg></div>
          <h3 class="coming-soon-title">Prestasi &amp; Penghargaan</h3>
          <div class="coming-soon-actions">
            <button type="button" class="coming-soon-btn-unlock cs-section-unlock-btn">
              <span>Masukkan Sandi Pengurus</span>
            </button>
          </div>
        </div>
      `;
      prestasiEl.appendChild(overlay);
      overlay.querySelector(".cs-section-unlock-btn")?.addEventListener("click", () => {
        window.MiraiSound?.playClickIfIdle();
        openPasswordModal();
      });
    }
  } else {
    prestasiEl.classList.remove("is-section-locked");
    prestasiEl.querySelector(".coming-soon-section-overlay")?.remove();
  }
}

// Indikator pada tombol jump di kamus/index.html jika ada
const translatorTabJump = document.querySelector(".tab-translator-jump");
if (translatorTabJump) {
  if (!isUnlocked) {
    if (!translatorTabJump.querySelector(".tab-lock-icon")) {
    const lockIcon = document.createElement("span");
    lockIcon.className = "tab-lock-icon";
    lockIcon.innerHTML = ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
    translatorTabJump.appendChild(lockIcon);
    }
  } else {
    translatorTabJump.querySelector(".tab-lock-icon")?.remove();
  }
}
}

function updateCardsAndButtonsComingSoon(isUnlocked) {
const lockedWords = [
  "toko",
  "peringkat",
  "lomba",
    "kegiatan",
  "divisi",
  "proker",
  "fasilitas"
];

const isLockedHref = (href) => {
  if (!href) return false;
  const h = href.toLowerCase();
  if (lockedWords.some((w) => h.includes(w))) return true;
  if (h.includes("kurikulum") || h.includes("#kurikulum")) return true;
  return false;
};

const actionLinks = document.querySelectorAll("a[href]");

actionLinks.forEach((link) => {
  // PERATURAN: Lepaskan dan jangan pernah kunci seksi Saran & Kritik (#masukan / .feedback-preview) atau tautan navigasi
  if (link.closest("#masukan") || link.closest(".feedback-preview") || link.closest(".sidebar-links")) return;

  const href = (link.getAttribute("href") || "").toLowerCase();
  const isLockedLink = isLockedHref(href);

  if (!isLockedLink) return;

  // Kunci tombol aksi spesifik yang menuju fitur segera hadir
  if (link.matches(".card-go-btn, .drawer-action-btn, .tab-translator-jump, .quick-translator-pill, .doc-btn-download, .doc-btn-view")) {
    if (!isUnlocked) {
    link.classList.add("btn-coming-soon-locked");
    link.setAttribute("tabindex", "-1");
    link.setAttribute("aria-disabled", "true");
    if (!link.dataset.lockClickBound) {
    link.dataset.lockClickBound = "true";
    link.addEventListener("click", (e) => {
      if (!isAccessUnlocked()) {
        e.preventDefault();
        e.stopPropagation();
        window.MiraiSound?.playClickIfIdle();
        openPasswordModal();
      }
    });
    }
    } else {
    link.classList.remove("btn-coming-soon-locked");
    link.removeAttribute("tabindex");
    link.removeAttribute("aria-disabled");
    }
  }

  // Kunci kartu pembungkus (misal di beranda: .start-card, .activity-start-card, .about-drawer-card, atau .doc-big-card)
  const parentCard = link.closest(".start-card, .activity-start-card, .about-drawer-card, .doc-big-card");
  if (parentCard && !parentCard.closest("#masukan") && !parentCard.closest(".feedback-preview")) {
    // Pengecualian: jika parentCard adalah .start-card tapi BUKAN menuju kurikulum, jangan kunci (misal Kelas Dasar, Kelas Lanjutan, Kamus tetap terbuka!)
    if (parentCard.classList.contains("start-card") && !href.includes("kurikulum")) {
    return;
    }

    if (!isUnlocked) {
    parentCard.classList.add("card-coming-soon-locked");
    if (parentCard.classList.contains("is-expanded") || parentCard.classList.contains("is-pulled")) {
    parentCard.classList.remove("is-expanded", "is-pulled");
    const toggle = parentCard.querySelector(".card-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Buka detail kartu");
    }
    }
    let cardOverlay = parentCard.querySelector(".card-coming-soon-overlay");
    if (!cardOverlay) {
    cardOverlay = document.createElement("div");
    cardOverlay.className = "card-coming-soon-overlay";
    cardOverlay.setAttribute("aria-hidden", "true");
    cardOverlay.innerHTML = `
                        <div class="card-coming-soon-center">
                            <span class="card-coming-soon-badge">SEGERA HADIR</span>
                        </div>
                    `;
    parentCard.appendChild(cardOverlay);

    cardOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.MiraiSound?.playClickIfIdle();
      openPasswordModal();
    });
    }
    } else {
    parentCard.classList.remove("card-coming-soon-locked");
    parentCard.querySelectorAll(".card-coming-soon-overlay").forEach((el) => el.remove());
    }
  }
});

// Seksi khusus kurikulum & tata cara di kelas/index.html
const docCards = document.querySelectorAll("#kurikulum .doc-big-card");
docCards.forEach((card) => {
  if (!isUnlocked) {
    card.classList.add("card-coming-soon-locked");
    card.querySelectorAll(".doc-btn-download, .doc-btn-view").forEach((btn) => {
    btn.classList.add("btn-coming-soon-locked");
    btn.setAttribute("tabindex", "-1");
    btn.setAttribute("aria-disabled", "true");
    if (!btn.dataset.lockClickBound) {
    btn.dataset.lockClickBound = "true";
    btn.addEventListener("click", (e) => {
      if (!isAccessUnlocked()) {
        e.preventDefault();
        e.stopPropagation();
        window.MiraiSound?.playClickIfIdle();
        openPasswordModal();
      }
    });
    }
    });
    if (!card.querySelector(".card-coming-soon-overlay")) {
    const overlay = document.createElement("div");
    overlay.className = "card-coming-soon-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
                    <div class="card-coming-soon-center">
                        <span class="card-coming-soon-badge">SEGERA HADIR</span>
                    </div>
                `;
    card.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.MiraiSound?.playClickIfIdle();
    openPasswordModal();
    });
    }
  } else {
    card.classList.remove("card-coming-soon-locked");
    card.querySelectorAll(".card-coming-soon-overlay").forEach((el) => el.remove());
    card.querySelectorAll(".doc-btn-download, .doc-btn-view").forEach((btn) => {
    btn.classList.remove("btn-coming-soon-locked");
    btn.removeAttribute("tabindex");
    btn.removeAttribute("aria-disabled");
    });
  }
});
}

function applyComingSoonState() {
const isUnlocked = isAccessUnlocked();
setupSidebarLockBtn(isUnlocked);
updateMenuComingSoonBadges(isUnlocked);
updateCardsAndButtonsComingSoon(isUnlocked);
updatePageComingSoonOverlay(isUnlocked);
updateSectionComingSoonOverlay(isUnlocked);
}


/* ==========================================================================
   SMART LINK PREFETCHER (Instant Page Navigation)
   Secara otomatis mem-prefetch HTML tujuan saat user hover atau touch link internal,
   sehingga perpindahan halaman terasa instan (0ms) seperti native app.
   ========================================================================== */
function initSmartLinkPrefetcher() {
  const prefetchedUrls = new Set();

  function prefetchUrl(rawHref) {
    if (!rawHref) return;
    if (rawHref.startsWith("#") || rawHref.startsWith("javascript:") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return;

    try {
      const url = new URL(rawHref, window.location.href);
      if (url.origin !== window.location.origin) return;

      const cleanUrl = url.href.split("#")[0];
      if (prefetchedUrls.has(cleanUrl)) return;
      if (cleanUrl === window.location.href.split("#")[0]) return;

      prefetchedUrls.add(cleanUrl);

      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = cleanUrl;
      link.as = "document";
      document.head.appendChild(link);
    } catch (e) {}
  }

  const handleInteraction = (e) => {
    const anchor = e.target.closest("a[href]");
    if (anchor && anchor.href) {
      prefetchUrl(anchor.getAttribute("href"));
    }
  };

  document.addEventListener("mouseover", handleInteraction, { passive: true });
  document.addEventListener("touchstart", handleInteraction, { passive: true });
}

function initComingSoonSystem() {
applyComingSoonState();
}

window.initComingSoonSystem = initComingSoonSystem;
window.openPasswordModal = openPasswordModal;



