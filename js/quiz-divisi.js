/**
 * File: js/quiz-divisi.js
 * Deskripsi: Logika Interaktif Kuis Kepribadian & Tes Kecocokan Divisi Klub MIRAI NO HANA
 */

(() => {
  "use strict";

  const QUESTIONS = [
    {
      id: 1,
      title: "1. Apa hal pertama yang paling menarik perhatianmu di acara festival budaya Jepang (Matsuri)?",
      options: [
        {
          letter: "A",
          division: "bahasa",
          text: "Mendengarkan percakapan bahasa Jepang, lirik lagu tradisional, dan pameran kaligrafi Shodou."
        },
        {
          letter: "B",
          division: "cosplay",
          text: "Penampilan cosplayer berkostum anime keren dan aksi drama panggung atau penampilan anisong."
        },
        {
          letter: "C",
          division: "desain",
          text: "Booth seni kreatif, poster fanart ilustrator, standee maskot, dan desain stiker estetik."
        },
        {
          letter: "D",
          division: "kewirausahaan",
          text: "Deretan stan kuliner Yatai yang menjual Takoyaki, Onigiri, dan etalase merchandise eksklusif."
        }
      ]
    },
    {
      id: 2,
      title: "2. Kegiatan apa yang menurutmu paling seru dilakukan saat kumpul ekstrakurikuler mingguan?",
      options: [
        {
          letter: "A",
          division: "bahasa",
          text: "Belajar kosakata baru, latihan kaiwa (percakapan), dan kuis cerdas cermat kanji seru."
        },
        {
          letter: "B",
          division: "cosplay",
          text: "Workshop makeup karakter, tutorial styling wig, dan latihan pose performa panggung."
        },
        {
          letter: "C",
          division: "desain",
          text: "Menggambar karakter digital/manual bareng dan mendesain materi visual untuk medsos klub."
        },
        {
          letter: "D",
          division: "kewirausahaan",
          text: "Diskusi ide menu jualan baru, meracik cinderamata kreatif, dan simulasi stan konbini."
        }
      ]
    },
    {
      id: 3,
      title: "3. Skill apa yang paling ingin kamu kuasai dan kembangkan secara serius tahun ini?",
      options: [
        {
          letter: "A",
          division: "bahasa",
          text: "Lancar berbicara bahasa Jepang, membaca aksara kanji, dan persiapan sertifikasi JLPT."
        },
        {
          letter: "B",
          division: "cosplay",
          text: "Keahlian berakting/ekspresi karakter, kreasi prop aksesoris kostum, dan percaya diri tampil di publik."
        },
        {
          letter: "C",
          division: "desain",
          text: "Mahir software desain/ilustrasi (Canva, IbisPaint, Photoshop) dan membuat portofolio seni kreatif."
        },
        {
          letter: "D",
          division: "kewirausahaan",
          text: "Strategi pemasaran produk, manajemen kas organisasi, dan komunikasi tawar-menawar bisnis ramah."
        }
      ]
    },
    {
      id: 4,
      title: "4. Saat menonton anime favoritmu, aspek mana yang paling sering membuatmu kagum?",
      options: [
        {
          letter: "A",
          division: "bahasa",
          text: "Frasa unik yang diucapkan karakter, logat dialek daerah, dan pesan moral mendalam ceritanya."
        },
        {
          letter: "B",
          division: "cosplay",
          text: "Detail pakaian, bentuk rambut, sepatu, dan ekspresi ikonik sang karakter saat beraksi."
        },
        {
          letter: "C",
          division: "desain",
          text: "Gaya visual animasi, komposisi warna background, desain karakter, dan visual opening/ending."
        },
        {
          letter: "D",
          division: "kewirausahaan",
          text: "Popularitas merchandise resminya, kolaborasi cafe bertema anime, dan produk unik yang dijual."
        }
      ]
    },
    {
      id: 5,
      title: "5. Peran seperti apa yang paling cocok dengan gaya kerjamu di kepanitiaan acara sekolah?",
      options: [
        {
          letter: "A",
          division: "bahasa",
          text: "Penyusun materi sambutan, MC bilingual, atau pembuat panduan teknis yang cermat."
        },
        {
          letter: "B",
          division: "cosplay",
          text: "Penampil utama di atas panggung, koordinator talent kostum, atau pemandu interaksi penonton."
        },
        {
          letter: "C",
          division: "desain",
          text: "Koordinator publikasi visual, pembuat poster promosi, dekorasi panggung, dan kartu tanda pengenal."
        },
        {
          letter: "D",
          division: "kewirausahaan",
          text: "Koordinator sponsorship, penanggung jawab stan penjualan tiket/merchandise, dan bendahara bazaar."
        }
      ]
    }
  ];

  const DIVISION_INFO = {
    bahasa: {
      title: "Divisi Bahasa & Budaya",
      kanji: "言語・文化部門",
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
      link: "bahasa.html",
      explanation: "Kamu memiliki rasa ingin tahu yang mendalam terhadap percakapan, makna aksara Kanji, dan filosofi kebudayaan Jepang. Kamu adalah tipe pembelajar tekun yang senang berdiskusi dan memahami cara berpikir masyarakat Jepang dari akarnya."
    },
    cosplay: {
      title: "Divisi Cosplay & Seni Peran",
      kanji: "コスプレ部門",
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>',
      link: "cosplay.html",
      explanation: "Kamu memiliki jiwa ekspresif, percaya diri, dan menyukai dunia seni peran! Kamu antusias menghidupkan karakter 2D menjadi nyata lewat kostum, tata rias wajah, wig styling, dan aksi panggung yang memukau penonton."
    },
    desain: {
      title: "Divisi Desain & Kreatif",
      kanji: "デザイン部門",
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>',
      link: "desain.html",
      explanation: "Kamu memiliki kepekaan visual yang tinggi dan imajinasi kreatif tanpa batas. Kamu senang menggoreskan karya ilustrasi, menyusun palet warna estetik, dan merancang identitas grafis yang memanjakan mata."
    },
    kewirausahaan: {
      title: "Divisi Kewirausahaan",
      kanji: "起業・物販部門",
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
      link: "kewirausahaan.html",
      explanation: "Kamu berjiwa strategis, komunikatif, dan senang berinovasi dalam dunia bisnis kreatif. Kamu cocok memimpin stan bazaar Mirai no Konbini, mengelola merchandise, dan mengembangkan kemandirian finansial klub."
    }
  };

  function initQuiz() {
    const quizCard = document.getElementById("quizCard");
    const quizStage = document.getElementById("quizStage");
    const quizResultStage = document.getElementById("quizResultStage");
    const quizStepCount = document.getElementById("quizStepCount");
    const quizStepPercent = document.getElementById("quizStepPercent");
    const quizProgressFill = document.getElementById("quizProgressFill");
    const quizQuestionText = document.getElementById("quizQuestionText");
    const quizOptionsList = document.getElementById("quizOptionsList");

    const quizResultIcon = document.getElementById("quizResultIcon");
    const quizResultTitle = document.getElementById("quizResultTitle");
    const quizResultKanji = document.getElementById("quizResultKanji");
    const quizScoreHighlight = document.getElementById("quizScoreHighlight");
    const quizMeterFill = document.getElementById("quizMeterFill");
    const quizExplanation = document.getElementById("quizExplanation");
    const quizBreakdownBars = document.getElementById("quizBreakdownBars");
    const quizCtaLink = document.getElementById("quizCtaLink");
    const quizRestartBtn = document.getElementById("quizRestartBtn");

    if (!quizCard || !quizStage || !quizOptionsList) return;

    let currentStep = 0;
    const scores = { bahasa: 0, cosplay: 0, desain: 0, kewirausahaan: 0 };

    function renderQuestion(stepIdx) {
      const q = QUESTIONS[stepIdx];
      if (!q) return;

      quizStepCount.textContent = `Pertanyaan ${stepIdx + 1} dari ${QUESTIONS.length}`;
      const percent = Math.round(((stepIdx + 1) / QUESTIONS.length) * 100);
      quizStepPercent.textContent = `${percent}% Selesai`;
      quizProgressFill.style.width = `${percent}%`;

      quizQuestionText.textContent = q.title;

      quizOptionsList.innerHTML = q.options.map(opt => `
        <button type="button" class="quiz-option-btn" data-div="${opt.division}">
          <span class="quiz-opt-letter">${opt.letter}</span>
          <span class="quiz-opt-text">${opt.text}</span>
        </button>
      `).join("");

      // Animasi pergantian soal
      quizStage.classList.remove("quiz-anim-pop");
      void quizStage.offsetWidth;
      quizStage.classList.add("quiz-anim-pop");
    }

    function renderResults() {
      quizStage.hidden = true;
      quizResultStage.hidden = false;

      // Hitung persentase
      const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const topDivKey = sorted[0][0];
      const topDivInfo = DIVISION_INFO[topDivKey];

      // Kalkulasi match rate (skor tertinggi proporsional antara 78% s/d 96%)
      const matchRate = Math.min(96, Math.max(76, Math.round((sorted[0][1] / QUESTIONS.length) * 40 + 56)));

      quizResultIcon.innerHTML = topDivInfo.icon;
      quizResultTitle.textContent = topDivInfo.title;
      quizResultKanji.textContent = topDivInfo.kanji;
      quizScoreHighlight.textContent = `${matchRate}% Cocok!`;
      quizMeterFill.style.width = `${matchRate}%`;
      quizExplanation.textContent = topDivInfo.explanation;

      quizCtaLink.href = topDivInfo.link;
      quizCtaLink.innerHTML = `<span>Jelajahi Profil ${topDivInfo.title} →</span>`;

      // Breakdown bars
      quizBreakdownBars.innerHTML = sorted.map(([k, count]) => {
        const info = DIVISION_INFO[k];
        const barPercent = Math.round((count / QUESTIONS.length) * 100);
        return `
          <div class="breakdown-item">
            <div class="breakdown-info">
              <span>${info.icon} ${info.title}</span>
              <strong>${barPercent}%</strong>
            </div>
            <div class="breakdown-track">
              <div class="breakdown-fill ${k === topDivKey ? 'is-top' : ''}" style="width: ${barPercent}%;"></div>
            </div>
          </div>
        `;
      }).join("");

      quizResultStage.classList.remove("quiz-anim-pop");
      void quizResultStage.offsetWidth;
      quizResultStage.classList.add("quiz-anim-pop");
    }

    quizOptionsList.addEventListener("click", (e) => {
      const btn = e.target.closest(".quiz-option-btn");
      if (!btn) return;

      const divKey = btn.dataset.div;
      if (divKey && scores[divKey] !== undefined) {
        scores[divKey]++;
      }

      window.MiraiSound?.playClickIfIdle();

      currentStep++;
      if (currentStep < QUESTIONS.length) {
        renderQuestion(currentStep);
      } else {
        renderResults();
      }
    });

    if (quizRestartBtn) {
      quizRestartBtn.addEventListener("click", () => {
        window.MiraiSound?.playClickIfIdle();
        currentStep = 0;
        scores.bahasa = 0;
        scores.cosplay = 0;
        scores.desain = 0;
        scores.kewirausahaan = 0;

        quizResultStage.hidden = true;
        quizStage.hidden = false;
        renderQuestion(0);
      });
    }

    // Render soal pertama
    renderQuestion(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initQuiz);
  } else {
    initQuiz();
  }
})();
