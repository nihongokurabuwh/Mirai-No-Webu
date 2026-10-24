/**
 * File: js/kamus-kanji.js
 * Fungsi: Mesin pencarian dan ensiklopedia 2.211 Joyo & JLPT Kanji lengkap N5 s/d N1,
 * filter tingkat JLPT/kelas/goresan, render paginasi ringan bertahap (60 kartu per batch),
 * dan modal detail kanji interaktif.
 * Penggunaan: kamus/index.html dan kamus/kanji.html.
*/

/**
 * Database Lengkap Joyo & JLPT Kanji (N5 sampai N1) — 2.211 Karakter
 * Ditanamkan langsung agar website dapat dibuka 100% instan via file:/// tanpa terkena blokir CORS.
*/
/**
 * Modul komunikasi API untuk data Kanji dari KanjiAPI.dev
 * Dilengkapi dengan caching lokal (localStorage) agar beban jaringan minim dan respon instan.
*/
/**
 * Basis data KANJI_FULL_DATA (2.211 karakter) kini tersimpan rapi di js/kanji-data.js
 * Fallback deklarasi aman jika script data dimuat terpisah:
*/
window.KANJI_FULL_DATA = window.KANJI_FULL_DATA || [];

const kanjiDetailChunks = {};
const kanjiChunkPromises = {};

/**
 * Memuat detail kanji lokal data/kanji/<jlpt>.json secara on-demand.
 * Menghilangkan pemanggilan jaringan ke kanjiapi.dev dan MyMemory.
 */
async function loadKanjiChunk(jlptLevel) {
  if (!jlptLevel) return {};
  const rawLvl = String(jlptLevel).toLowerCase().trim();
  const lvl = rawLvl.startsWith("n") ? rawLvl : ("n" + rawLvl);
  if (kanjiDetailChunks[lvl]) return kanjiDetailChunks[lvl];
  if (kanjiChunkPromises[lvl]) return kanjiChunkPromises[lvl];

  kanjiChunkPromises[lvl] = (async () => {
    const base = getAppBasePath();
    try {
      const res = await fetch(base + "data/kanji/" + lvl + ".json");
      if (res.ok) {
        const data = await res.json();
        kanjiDetailChunks[lvl] = data;
        return data;
      }
    } catch (e) {
      console.warn("[kanji.js] Gagal memuat data/kanji/" + lvl + ".json:", e);
    }
    return {};
  })();

  return kanjiChunkPromises[lvl];
}
window.loadKanjiChunk = loadKanjiChunk;

async function getKanjiDetailFromChunk(char, jlptLevel) {
  if (!char) return null;
  const lvl = String(jlptLevel || window.getKanjiJlpt?.(char) || "n5").toLowerCase().trim();
  const normalizedLvl = lvl.startsWith("n") ? lvl : ("n" + lvl);
  let chunk = kanjiDetailChunks[normalizedLvl];
  if (!chunk) {
    chunk = await loadKanjiChunk(normalizedLvl);
  }
  if (chunk && chunk[char]) return chunk[char];

  // Fallback probe other loaded chunks
  for (const l of ['n5', 'n4', 'n3', 'n2', 'n1']) {
    if (kanjiDetailChunks[l] && kanjiDetailChunks[l][char]) {
      return kanjiDetailChunks[l][char];
    }
  }
  return null;
}
window.getKanjiDetailFromChunk = getKanjiDetailFromChunk;

const KanjiAPI = {
  baseUrl: "local",
  async getJlptList(levelNum) {
    const lvl = `n${levelNum}`;
    const chunk = await loadKanjiChunk(lvl);
    return Object.keys(chunk || {});
  },
  async getKanjiDetail(kanji) {
    return getKanjiDetailFromChunk(kanji);
  },
  async getKanjiWords(kanji) {
    const det = await getKanjiDetailFromChunk(kanji);
    return det?.words || det?.examples || [];
  }
};
window.KanjiAPI = KanjiAPI;

/**
 * Pemuat data metadata goresan dan grade kanji (data/kanji-meta.json)
 * Memuat pemetaan karakter ke [stroke_count, grade] agar pengurutan instan tanpa menunggu API detail.
*/
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

let kanjiMetaCache = null;
async function ensureKanjiMeta() {
if (kanjiMetaCache) return kanjiMetaCache;
const base = getAppBasePath();
try {
  const res = await fetch(base + "data/kanji-meta.json");
  if (res.ok) {
    kanjiMetaCache = await res.json();
    return kanjiMetaCache;
  }
} catch (e) {
  console.warn("Gagal memuat " + base + "data/kanji-meta.json:", e);
}
return {};
}
window.ensureKanjiMeta = ensureKanjiMeta;

/**
 * Mengubah teks Kana (Hiragana/Katakana) menjadi Romaji Latin
 * Mengutamakan library WanaKana bila tersedia di browser, dengan fallback tabel konversi mandiri.
 *
 * @param {string} kana - String kana (misal: "ハン", "なか.ば", "にほん")
 * @returns {string} - Representasi Romaji huruf kecil (misal: "han", "naka.ba", "nihon")
*/
function kanaToRomaji(kana) {
if (!kana || typeof kana !== "string") return "";

// 1. Prioritaskan WanaKana jika CDN aktif
if (window.wanakana && typeof window.wanakana.toRomaji === "function") {
  return window.wanakana.toRomaji(kana);
}

// 2. Fallback offline mandiri
const kanaMap = {
  "あ":"a","い":"i","う":"u","え":"e","お":"o",
  "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
  "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
  "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
  "な":"na","に":"ni","ぬ":"nu","ne":"ne","の":"no",
  "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
  "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
  "や":"ya","ゆ":"yu","よ":"yo",
  "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
  "わ":"wa","ゐ":"wi","ゑ":"we","を":"wo","ん":"n",
  "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
  "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
  "だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do",
  "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
  "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
  "きゃ":"kya","きゅ":"kyu","きょ":"kyo",
  "しゃ":"sha","しゅ":"shu","しょ":"sho",
  "ちゃ":"cha","ちゅ":"chu","ちょ":"cho",
  "にゃ":"nya","にゅ":"nyu","にょ":"nyo",
  "ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo",
  "みゃ":"mya","みゅ":"myu","みょ":"myo",
  "りゃ":"rya","りゅ":"ryu","りょ":"ryo",
  "ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo",
  "じゃ":"ja","じゅ":"ju","じょ":"jo",
  "びゃ":"bya","びゅ":"byu","びょ":"byo",
  "ぴゃ":"pya","ぴゅ":"pyu","ぴょ":"pyo",
  "ア":"a","イ":"i","ウ":"u","エ":"e","オ":"o",
  "カ":"ka","キ":"ki","ク":"ku","ケ":"ke","コ":"ko",
  "サ":"sa","シ":"shi","ス":"su","セ":"se","ソ":"so",
  "タ":"ta","チ":"chi","ツ":"tsu","テ":"te","ト":"to",
  "ナ":"na","ニ":"ni","ヌ":"nu","ネ":"ne","ノ":"no",
  "ハ":"ha","ヒ":"hi","フ":"fu","ヘ":"he","ホ":"ho",
  "マ":"ma","ミ":"mi","ム":"mu","メ":"me","モ":"mo",
  "ヤ":"ya","ユ":"yu","ヨ":"yo",
  "ラ":"ra","リ":"ri","ル":"ru","レ":"re","ロ":"ro",
  "ワ":"wa","ヰ":"wi","ヱ":"we","ヲ":"wo","ン":"n",
  "ガ":"ga","ギ":"gi","グ":"gu","ゲ":"ge","ゴ":"go",
  "ザ":"za","ジ":"ji","ズ":"zu","ゼ":"ze","ぞ":"zo",
  "ダ":"da","ヂ":"ji","ヅ":"zu","デ":"de","ド":"do",
  "バ":"ba","ビ":"bi","ブ":"bu","ベ":"be","ボ":"bo",
  "パ":"pa","ピ":"pi","プ":"pu","ペ":"pe","ポ":"po",
  "キャ":"kya","キュ":"kyu","キョ":"kyo",
  "シャ":"sha","シュ":"shu","ショ":"sho",
  "チャ":"cha","チュ":"chu","チョ":"cho",
  "ニャ":"nya","ニュ":"nyu","ニョ":"nyo",
  "ヒャ":"hya","ヒュ":"hyu","ヒョ":"hyo",
  "ミャ":"mya","ミュ":"myu","ミョ":"myo",
  "リャ":"rya","リュ":"ryu","リョ":"ryo",
  "ギャ":"gya","ギュ":"gyu","ギョ":"gyo",
  "ジャ":"ja","ジュ":"ju","ジョ":"jo",
  "ビャ":"bya","ビュ":"byu","ビョ":"byo",
  "ピャ":"pya","ピュ":"pyu","ピョ":"pyo",
  "ショク":"shoku","ショ":"sho","シュ":"shu","ジョ":"jo","ジョウ":"jou"
};

let result = "";
let i = 0;
while (i < kana.length) {
  if (kana[i] === "っ" || kana[i] === "ッ") {
    const nextTwo = kana.substr(i + 1, 2);
    const nextOne = kana.substr(i + 1, 1);
    const nextRomaji = kanaMap[nextTwo] || kanaMap[nextOne] || "";
    if (nextRomaji) result += nextRomaji[0];
    i++;
    continue;
  }
  if (kana[i] === "ー") {
    const lastChar = result.slice(-1);
    result += lastChar || "-";
    i++;
    continue;
  }
  const two = kana.substr(i, 2);
  if (kanaMap[two]) {
    result += kanaMap[two];
    i += 2;
    continue;
  }
  const one = kana[i];
  if (kanaMap[one]) {
    result += kanaMap[one];
    i++;
    continue;
  }
  result += one;
  i++;
}
return result;
}
window.kanaToRomaji = kanaToRomaji;

/**
 * Peta suku kata Romaji standar Hepburn ke aksara Hiragana & Katakana
*/
const ROMAJI_HEPBURN_MAP = {
  "kya": ["きゃ", "キャ"], "kyu": ["きゅ", "キュ"], "kyo": ["きょ", "キョ"],
  "sha": ["しゃ", "シャ"], "shu": ["しゅ", "シュ"], "sho": ["しょ", "ショ"],
  "cha": ["ちゃ", "チャ"], "chu": ["ちゅ", "チュ"], "cho": ["ちょ", "チョ"],
  "nya": ["にゃ", "ニャ"], "nyu": ["にゅ", "ニュ"], "nyo": ["にょ", "ニョ"],
  "hya": ["ひゃ", "ヒャ"], "hyu": ["ひゅ", "ヒュ"], "hyo": ["ひょ", "ヒョ"],
  "mya": ["みゃ", "ミャ"], "myu": ["みゅ", "ミュ"], "myo": ["みょ", "ミョ"],
  "rya": ["りゃ", "リャ"], "ryu": ["りゅ", "リュ"], "ryo": ["りょ", "リョ"],
  "gya": ["ぎゃ", "ギャ"], "gyu": ["ぎゅ", "ギュ"], "gyo": ["ぎょ", "ギョ"],
  "ja": ["じゃ", "ジャ"], "ju": ["じゅ", "ジュ"], "jo": ["じょ", "ジョ"],
  "bya": ["びゃ", "ビャ"], "byu": ["びゅ", "ビュ"], "byo": ["びょ", "ビョ"],
  "pya": ["ぴゃ", "ピャ"], "pyu": ["ぴゅ", "ピュ"], "pyo": ["ぴょ", "ピョ"],
  "ka": ["か", "カ"], "ki": ["き", "キ"], "ku": ["く", "ク"], "ke": ["け", "ケ"], "ko": ["こ", "コ"],
  "sa": ["さ", "サ"], "shi": ["し", "シ"], "su": ["す", "ス"], "se": ["せ", "セ"], "so": ["そ", "ソ"],
  "ta": ["た", "タ"], "chi": ["ち", "チ"], "tsu": ["つ", "ツ"], "te": ["て", "テ"], "to": ["と", "ト"],
  "na": ["な", "ナ"], "ni": ["に", "ニ"], "nu": ["ぬ", "ヌ"], "ne": ["ね", "ネ"], "no": ["の", "ノ"],
  "ha": ["は", "ハ"], "hi": ["ひ", "ヒ"], "fu": ["ふ", "フ"], "he": ["へ", "ヘ"], "ho": ["ほ", "ホ"],
  "ma": ["ま", "マ"], "mi": ["み", "ミ"], "mu": ["む", "ム"], "me": ["め", "メ"], "mo": ["mo", "モ"],
  "ya": ["や", "ヤ"], "yu": ["ゆ", "ユ"], "yo": ["よ", "ヨ"],
  "ra": ["ら", "ラ"], "ri": ["り", "リ"], "ru": ["る", "ル"], "re": ["れ", "レ"], "ro": ["ろ", "ロ"],
  "wa": ["わ", "ワ"], "wo": ["を", "ヲ"], "n": ["ん", "ン"],
  "ga": ["が", "ガ"], "gi": ["ぎ", "ギ"], "gu": ["ぐ", "グ"], "ge": ["ge", "ゲ"], "go": ["ご", "ゴ"],
  "za": ["ざ", "ザ"], "ji": ["じ", "ジ"], "zu": ["ず", "ズ"], "ze": ["ぜ", "ゼ"], "zo": ["zo", "ゾ"],
  "da": ["だ", "ダ"], "de": ["で", "デ"], "do": ["ど", "ド"],
  "ba": ["ば", "バ"], "bi": ["び", "ビ"], "bu": ["bu", "ブ"], "be": ["be", "ベ"], "bo": ["bo", "ボ"],
  "pa": ["pa", "パ"], "pi": ["pi", "ピ"], "pu": ["pu", "プ"], "pe": ["pe", "ペ"], "po": ["po", "ポ"],
  "a": ["あ", "ア"], "i": ["い", "イ"], "u": ["う", "ウ"], "e": ["え", "エ"], "o": ["お", "オ"]
};

/**
 * Mengonversi teks romaji alfabet menjadi aksara Hiragana dan Katakana
 * @param {string} text - Teks romaji masukan
 * @returns {{ hiragana: string, katakana: string }}
*/
function romajiToKana(text) {
  if (!text || typeof text !== "string") return { hiragana: "", katakana: "" };
  if (window.wanakana && typeof window.wanakana.toHiragana === "function") {
    return {
      hiragana: window.wanakana.toHiragana(text),
      katakana: window.wanakana.toKatakana(text)
    };
  }
  const t = text.toLowerCase().trim();
  let hira = "";
  let kata = "";
  let i = 0;
  const n = t.length;
  while (i < n) {
    if (i + 1 < n && t[i] === t[i + 1] && !"aeioun-".includes(t[i])) {
      hira += "っ";
      kata += "ッ";
      i++;
      continue;
    }
    let matched = false;
    for (const len of [3, 2, 1]) {
      if (i + len <= n) {
        const chunk = t.substr(i, len);
        if (ROMAJI_HEPBURN_MAP[chunk]) {
          hira += ROMAJI_HEPBURN_MAP[chunk][0];
          kata += ROMAJI_HEPBURN_MAP[chunk][1];
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      return { hiragana: "", katakana: "" };
    }
  }
  return { hiragana: hira, katakana: kata };
}
window.romajiToKana = romajiToKana;

/**
 * Memformat array bacaan kana (Onyomi / Kunyomi) menjadi format: Kana (romaji)
 * Contoh: "ハン (han) / なか.ば (naka.ba)"
 *
 * @param {Array<string>} readings - Daftar bacaan kana
 * @returns {string} - String bacaan terformat
*/
function formatKanaReadings(readings) {
if (!readings || !Array.isArray(readings) || readings.length === 0) return "—";
return readings.map((r) => {
  const romaji = kanaToRomaji(r);
  return romaji ? `${r} (${romaji})` : r;
}).join(" / ");
}
window.formatKanaReadings = formatKanaReadings;

/**
 * Memformat satu item kosakata terkait ke dalam markup HTML
 * Format: <li><b>[Kanji]</b> <span>[Kana] ([Romaji])</span> — [Arti Bahasa Indonesia]</li>
 * Contoh: <li><b>日本</b> <span>にほん (nihon)</span> — Jepang</li>
 *
 * @param {Object} w - Objek kata ({ word, reading, meaning })
 * @returns {string} - String HTML untuk tag <li>
*/
function escapeHtml(str) {
if (str == null) return "";
return String(str)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");
}
window.escapeHtml = escapeHtml;

function formatWordItem(w) {
const word = escapeHtml(w.word);
const reading = escapeHtml(w.reading);
const meaning = escapeHtml(w.meaning);
const romaji = kanaToRomaji(w.reading);
const readingText = romaji ? `${reading} (${escapeHtml(romaji)})` : reading;
return `<li><b>${word}</b> <span>${readingText}</span> — ${meaning} <button type="button" class="mini-audio-btn" onclick="window.speakText && window.speakText('${word}', 'ja-JP')" title="Dengarkan pelafalan ${word}">🔊</button> <button type="button" class="mini-audio-btn btn-audio-slow" onclick="window.speakText && window.speakText('${word}', 'ja-JP', true)" title="Dengarkan pelafalan pelan ${word}">🐢</button></li>`;
}
window.formatWordItem = formatWordItem;

async function translateToIndonesian(text) {
  if (!text || typeof text !== "string") return "";
  const raw = text.trim();
  if (!raw) return "";

  // 1. Cek kamus offline jika kata tunggal tersedia
  if (window.MiraiTranslator?.dictionary) {
    const direct = window.MiraiTranslator.dictionary[raw.toLowerCase()];
    if (direct) return direct;
  }

  // 2. Fallback kamus sinkron lokal
  if (window.MiraiTranslator?.translateSync) {
    const fallback = window.MiraiTranslator.translateSync(raw);
    if (fallback && fallback.toLowerCase() !== raw.toLowerCase()) {
      return fallback;
    }
  }

  return raw;
}
window.translateToIndonesian = translateToIndonesian;

/**
 * Mengurutkan array kanji secara Ascending:
 * 1. Jumlah goresan (strokes / stroke_count) dari yang terkecil ke terbesar
 * 2. Tingkat pendidikan (grade) dari terkecil ke terbesar jika jumlah goresan sama
 * 3. Urutan karakter alfabetis / Unicode sebagai penentu kestabilan
 *
 * @param {Array<Object>} list - Daftar objek entri kanji
 * @returns {Array<Object>} - Salinan daftar yang telah diurutkan
*/
function sortKanjiEntries(list) {
return list.slice().sort((a, b) => {
  const strokesA = Number(a.strokes || 0);
  const strokesB = Number(b.strokes || 0);
  if (strokesA !== strokesB) return strokesA - strokesB;

  const gradeA = Number(a.grade !== undefined ? a.grade : 99);
  const gradeB = Number(b.grade !== undefined ? b.grade : 99);
  if (gradeA !== gradeB) return gradeA - gradeB;

  return a.kanji.localeCompare(b.kanji);
});
}
window.sortKanjiEntries = sortKanjiEntries;

/**
 * Inisialisasi Kamus Kanji & Kana
 * Mengontrol seluruh lifecycle interaksi: muat data JLPT, render grid terurut,
 * panel detail kanan, pencarian multi-kriteria, dan tab Kana.
*/
window.initKanjiDictionary = async function initKanjiDictionary() {
const dictionary = document.querySelector("[data-kanji-dictionary]");
if (!dictionary) return;

// Seleksi elemen DOM utama
const grid = dictionary.querySelector("[data-kanji-grid]");
const count = dictionary.querySelector("[data-kanji-count]");
const empty = dictionary.querySelector("[data-kanji-empty]");
const detail = dictionary.querySelector("[data-kanji-detail]");
const search = dictionary.querySelector("[data-kanji-search]");
const jlpt = dictionary.querySelector("[data-kanji-jlpt]");
const level = dictionary.querySelector("[data-kanji-level]");
let strokes = dictionary.querySelector("[data-kanji-strokes]");

    // State penyimpanan memori
const entryMap = new Map();
let entries = [];
let player;
let currentRenderLimit = 60;
let selectedKanjiChar = null;

// Sediakan window.getKanjiJlpt untuk mesin goresan
window.getKanjiJlpt = (char) => entryMap.get(char)?.jlpt || 'N5';

// Muat data instan langsung jika window.KANJI_FULL_DATA sudah ada di memori
if (Array.isArray(window.KANJI_FULL_DATA) && window.KANJI_FULL_DATA.length > 0) {
  window.KANJI_FULL_DATA.forEach((item) => {
    entryMap.set(item.kanji, {
      ...item,
      words: item.words || item.examples || [],
      examples: item.examples || item.words || [],
      _needsDetail: false,
      _translated: true
    });
  });
  entries = Array.from(entryMap.values());
}

// Buat dropdown pilihan jumlah goresan jika belum ada di HTML
if (!strokes) {
  const label = document.createElement("label");
  let strokeOptions = '<option value="">Semua</option>';
  for (let i = 1; i <= 29; i++) {
    strokeOptions += `<option value="${i}">${i}</option>`;
  }
  label.innerHTML = `Goresan<select data-kanji-strokes>${strokeOptions}</select>`;
  dictionary.querySelector(".dictionary-controls").append(label);
  strokes = label.querySelector("select");
}

// Tambahkan tombol kanji acak jika belum ada
if (!dictionary.querySelector("[data-random-kanji]")) {
  const random = document.createElement("button");
  random.className = "btn";
  random.type = "button";
  random.dataset.randomKanji = "";
  random.textContent = "KANJI ACAK";
  dictionary.querySelector(".dictionary-controls").append(random);
}

/**
 * Memuat indeks ramping kanji (data/kanji-index.json) secara lokal (~316 KB).
 * Memuat 2.211 Joyo & JLPT kanji tanpa panggilan jaringan eksternal.
 */
async function loadKanjiData() {
  if (entryMap.size > 0 && entries.length > 0) {
    render();
    return;
  }
  const base = getAppBasePath();
  try {
    const res = await fetch(base + "data/kanji-index.json");
    if (res.ok) {
      const indexList = await res.json();
      if (Array.isArray(indexList) && indexList.length > 0) {
        indexList.forEach((item) => {
          entryMap.set(item.kanji, {
            ...item,
            words: item.words || [],
            sentence: item.sentence || null,
            _needsDetail: true,
            _translated: true
          });
        });
        entries = Array.from(entryMap.values());
        render();

        // Prefetch N5 chunk saat idle jika browser mendukung
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(() => {
            loadKanjiChunk("n5");
            if (window.loadStrokeChunk) window.loadStrokeChunk("n5");
          }, { timeout: 2000 });
        }
        return;
      }
    }
  } catch (e) {
    console.warn("[kanji.js] Gagal memuat data/kanji-index.json:", e);
  }

  // Fallback cadangan jika data/kanji.json utuh dipanggil
  try {
    const fallbackRes = await fetch(base + "data/kanji.json");
    if (fallbackRes.ok) {
      const fullList = await fallbackRes.json();
      fullList.forEach((item) => {
        entryMap.set(item.kanji, {
          ...item,
          words: item.words || item.examples || [],
          _needsDetail: false,
          _translated: true
        });
      });
      entries = Array.from(entryMap.values());
      render();
    }
  } catch (e) {}
}
loadKanjiData();

/**
   * Menampilkan detail lengkap kanji pada panel samping (kanan):
   * - Arti utama (Bahasa Indonesia murni setelah translasi)
   * - Label Onyomi (Cara baca China) & Kunyomi (Cara baca Jepang) beserta Romaji
   * - Animasi urutan penulisan KanjiVG
   * - Kosakata terkait dengan format: [Kanji] [Kana] ([Romaji]) — [Arti Bahasa Indonesia]
   *
   * @param {Object} item - Objek kanji yang dipilih pengguna
*/
function renderBlankKanjiState() {
  player?.destroy();
  selectedKanjiChar = null;
  grid.querySelectorAll(".kanji-card.is-active").forEach((c) => c.classList.remove("is-active"));
  detail.innerHTML = `
    <div data-stroke-player></div>
  `;
  player = window.createStrokePlayer(detail.querySelector("[data-stroke-player]"), null, 0, {
    showClear: true,
    onSelectCharacter: (char) => {
      const found = allEntries.find((e) => e.kanji === char);
      if (found) renderDetail(found, { userInitiated: true });
    },
    onClear: () => renderBlankKanjiState()
  });
  window.updateQuickStrokeArrow?.();
}

async function renderDetail(item, options = {}) {
  player?.destroy();
  selectedKanjiChar = item.kanji;
  detail.classList.remove("is-collapsed");

  // Berikan sorotan visual (active state) pada kartu yang dipilih di grid
  grid.querySelectorAll(".kanji-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.kanji === item.kanji);
  });

  const strokeCountDisplay = item.strokes || window.MIRAI_STROKE_DATA?.[item.kanji]?.paths?.length || "—";
  const initialMeaning = item._translated
    ? item.meaning
    : '<span style="font-size:0.85em; opacity:0.75; font-weight:normal; font-style:italic;">Menerjemahkan arti ke Bahasa Indonesia...</span>';

  const cp = (item.kanji || "").codePointAt(0) || 0;
  const hexCode = cp.toString(16).padStart(5, "0").toUpperCase();
  const prefillParam = encodeURIComponent(`Laporan Koreksi Arti: Kanji ${item.kanji} (U+${hexCode}) - "${item.meaning || ""}" (JLPT ${item.jlpt || ""})`);
  const reportUrl = `https://forms.gle/dFPRM842xxKq5YMt9?usp=pp_url&entry.lapor=${prefillParam}`;

  // Render struktur panel detail dengan label bahasa Indonesia
  detail.innerHTML = `
            <div class="kanji-detail-head">
                <strong>${item.kanji}</strong>
                <div>
                    <p class="card-number">${item.jlpt} / ${item.level} · <span data-detail-strokes>${strokeCountDisplay}</span> GORESAN</p>
                    <h3 data-detail-meaning>${initialMeaning}</h3>
                    <p>
                        <b>Onyomi (Cara baca China):</b> <span data-detail-onyomi>${formatKanaReadings(item.onyomi)}</span><br>
                        <b>Kunyomi (Cara baca Jepang):</b> <span data-detail-kunyomi>${formatKanaReadings(item.kunyomi)}</span>
                    </p>
                    <div class="kanji-detail-audio-actions" style="display:flex; gap:8px; align-items:center;">
                        <button type="button" class="btn-kanji-audio" id="speakKanjiBtn" title="Dengarkan pelafalan Kanji dan cara bacanya (Normal)">
                            <span>🔊</span>
                        </button>
                        <button type="button" class="btn-kanji-audio btn-audio-slow" id="speakKanjiSlowBtn" title="Dengarkan pelafalan Kanji dan cara bacanya perlahan (Slow-Mo)">
                            <span>🐢</span>
                        </button>
                    </div>
                </div>
            </div>
            <h4>Goresan Karakter (KanjiVG)</h4>
            <div data-stroke-player></div>
            <h4>Kosakata Terkait</h4>
            <ul data-detail-words>${item.words?.length ? item.words.map(formatWordItem).join("") : '<li><em style="color:var(--muted)">Memuat kosakata...</em></li>'}</ul>
            <div data-detail-sentence-container>
                ${renderDetailSentenceHtml(item)}
            </div>
            <div class="kanji-report-row" style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px dashed rgba(255, 79, 145, 0.25); display: flex; justify-content: flex-end; align-items: center;">
                <a href="${reportUrl}" target="_blank" rel="noopener noreferrer" class="stroke-report-link kanji-report-link" title="Buka formulir kritik dan saran untuk melaporkan koreksi arti Kanji ${item.kanji}">
                    🚩 Lapor arti salah
                </a>
            </div>
        `;

  const speakKanjiInfo = (slowMode = false) => {
    const onyomi = (item.onyomi || []).join(", ");
    const kunyomi = (item.kunyomi || []).join(", ");
    const topWord = item.example_word?.word || item.words?.[0]?.word || "";
    let toSpeak = `${item.kanji}。 `;
    if (kunyomi) toSpeak += `Kunyomi: ${kunyomi}。 `;
    if (onyomi) toSpeak += `Onyomi: ${onyomi}。 `;
    if (topWord) toSpeak += `Contoh kata: ${topWord}。`;
    window.speakText ? window.speakText(toSpeak, "ja-JP", slowMode) : window.speakJapanese?.(toSpeak);
  };

  detail.querySelector("#speakKanjiBtn")?.addEventListener("click", () => speakKanjiInfo(false));
  detail.querySelector("#speakKanjiSlowBtn")?.addEventListener("click", () => speakKanjiInfo(true));

  // Pasang aksi tombol tutup detail (khusus tampilan mobile)
  detail.querySelector("[data-close-detail]")?.addEventListener("click", () => {
    detail.classList.add("is-collapsed");
    renderBlankKanjiState();
  });

  // Jalankan player animasi goresan (dengan menyertakan petunjuk jlpt untuk chunk loader dan aksi onClear)
  player = window.createStrokePlayer(detail.querySelector("[data-stroke-player]"), item.kanji, item.strokes || 4, {
    jlpt: item.jlpt,
    showClear: true,
    onSelectCharacter: (char) => {
      const found = allEntries.find((e) => e.kanji === char);
      if (found) renderDetail(found, { userInitiated: true });
    },
    onClear: () => renderBlankKanjiState()
  });
  window.updateQuickStrokeArrow?.();

  // Pada perangkat bergerak (HP < 768px), geser tampilan ke panel detail jika diklik pengguna
  if (options.userInitiated && window.innerWidth < 768) {
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Ambil detail lengkap (kosakata, kalimat contoh) dari chunk lokal on-demand
  const detailData = await getKanjiDetailFromChunk(item.kanji, item.jlpt);

  // Cegah race condition jika pengguna berpindah ke kanji lain saat fetch sedang berlangsung
  if (selectedKanjiChar !== item.kanji) return;

  if (detailData) {
    if (detailData.words || detailData.examples) {
      item.words = detailData.words || detailData.examples || [];
    }
    if (detailData.sentence) {
      item.sentence = detailData.sentence;
    }
    if (detailData.sentence_is_template !== undefined) {
      item.sentence_is_template = detailData.sentence_is_template;
    }
    if (detailData.example_word) {
      item.example_word = detailData.example_word;
    }
    if (detailData.meaning && (!item.meaning || item.meaning === "Karakter kanji")) {
      item.meaning = detailData.meaning;
    }
    if (detailData.onyomi && detailData.onyomi.length) item.onyomi = detailData.onyomi;
    if (detailData.kunyomi && detailData.kunyomi.length) item.kunyomi = detailData.kunyomi;
    if (detailData.strokes) item.strokes = detailData.strokes;
    if (detailData.grade !== undefined) item.grade = detailData.grade;
    item._needsDetail = false;
    item._translated = true;

    const sEl = detail.querySelector("[data-detail-strokes]");
    if (sEl) sEl.textContent = item.strokes;
    const onEl = detail.querySelector("[data-detail-onyomi]");
    if (onEl) onEl.textContent = formatKanaReadings(item.onyomi);
    const kunEl = detail.querySelector("[data-detail-kunyomi]");
    if (kunEl) kunEl.textContent = formatKanaReadings(item.kunyomi);
    const mEl = detail.querySelector("[data-detail-meaning]");
    if (mEl) mEl.textContent = item.meaning;

    const wordsEl = detail.querySelector("[data-detail-words]");
    if (wordsEl) {
      if (item.words && item.words.length > 0) {
        wordsEl.innerHTML = item.words.map(formatWordItem).join("");
      } else {
        wordsEl.innerHTML = '<li><em style="color:var(--muted)">Belum ada kosakata tambahan.</em></li>';
      }
    }

    const sentContainer = detail.querySelector("[data-detail-sentence-container]");
    if (sentContainer) {
      sentContainer.innerHTML = renderDetailSentenceHtml(item);
    }

    const cardSpan = grid.querySelector(`[data-kanji="${item.kanji}"] span`);
    if (cardSpan) {
      cardSpan.textContent = item.meaning;
    }
  }
}

/**
 * Menghasilkan markup HTML untuk contoh kalimat atau contoh kata utama.
 * Jika kalimat contoh merupakan template isian generik, fungsi ini otomatis menyembunyikannya
 * dan menampilkan "Contoh Kata Utama" yang diambil dari kosakata terbaik kanji tersebut.
 *
 * @param {Object} item - Objek kanji
 * @returns {string} - String HTML blok kalimat/kata contoh
*/
function renderDetailSentenceHtml(item) {
  const isTmpl = item.sentence_is_template || (!item.sentence?.japanese) || item.sentence.japanese.includes("の漢字") || (item.sentence.meaning || "").includes("Karakter Kanji");
  if (!isTmpl && item.sentence && item.sentence.japanese) {
    return `
      <h4>Contoh Kalimat</h4>
      <p class="sentence" data-detail-sentence>
          <b>${escapeHtml(item.sentence.japanese)}</b><br>
          ${item.sentence.reading ? `<span>${escapeHtml(item.sentence.reading)}</span><br>` : ""}
          ${escapeHtml(item.sentence.meaning || "")}
      </p>
    `;
  }
  const bestWord = item.example_word || item.words?.[0];
  if (bestWord) {
    const readingPart = bestWord.reading ? `<span> (${escapeHtml(bestWord.reading)})</span>` : "";
    return `
      <h4>Contoh Kata Utama</h4>
      <p class="sentence" data-detail-sentence>
          <b>${escapeHtml(bestWord.word || item.kanji)}</b> ${readingPart}<br>
          <span>${escapeHtml(bestWord.meaning || item.meaning || "")}</span>
      </p>
    `;
  }
  return "";
}

function cleanKanaText(str) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[\.\-\s]/g, "");
}

/**
 * Menghitung skor relevansi pencarian Kanji:
 * 1. Skor 100: Cocok persis Kanji (item.kanji === q)
 * 2. Skor 90 / 85: Cocok bacaan Kana (Kunyomi / Onyomi cocok eksak atau substring)
 * 3. Skor 80: Cocok bacaan Romaji tepat (Hepburn konversi romaji -> kana cocok bacaan)
 * 4. Skor 75 / 65: Cocok arti bahasa Indonesia (persis atau kata utuh)
 * 5. Skor 50: Partial Romaji substring
 * 6. Skor 40 / 35: Awalan atau substring arti bahasa Indonesia
 * 7. Skor 30 / 25: Fallback arti bahasa Inggris
 * 8. Skor 20 / 10: Cocok di dalam contoh kosakata (words / examples)
*/
function getKanjiSearchScore(item, query) {
  if (!query) return 0;
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  // 1. Cocok persis Kanji (Skor 100)
  if (item.kanji === q) return 100;

  const onyomiList = (item.onyomi || []).map((o) => cleanKanaText(o).toLowerCase());
  const kunyomiList = (item.kunyomi || []).map((k) => cleanKanaText(k).toLowerCase());
  const allReadings = onyomiList.concat(kunyomiList);

  // 2. Cocok bacaan Kana (Skor 90 / 85)
  const isKanaQuery = /[\u3040-\u309F\u30A0-\u30FF]/.test(q);
  if (isKanaQuery) {
    if (allReadings.some((r) => r === q)) return 90;
    if (allReadings.some((r) => r.includes(q))) return 85;
  }

  // 3. Cocok bacaan Romaji Tepat (Skor 80)
  const { hiragana: qHira, katakana: qKata } = romajiToKana(q);
  const readingsRomaji = allReadings.map((r) => kanaToRomaji(r).toLowerCase());

  if (readingsRomaji.some((rom) => rom === q) || (qHira && allReadings.some((r) => r === qHira || r === qKata))) {
    return 80;
  }

  // 4. Cocok arti Bahasa Indonesia (Skor 75 / 65)
  const mainMeaning = (item.meaning || "").trim().toLowerCase();
  if (mainMeaning === q) return 75;
  const meaningParts = mainMeaning.split(/[,;/•\(\)]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (meaningParts.includes(q)) return 75;

  try {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordRegex = new RegExp(`\\b${escaped}\\b`, "i");
    if (wordRegex.test(mainMeaning)) return 65;
  } catch (e) {}

  // 5. Partial Romaji (Skor 50)
  if (readingsRomaji.some((rom) => rom.includes(q)) || (qHira && allReadings.some((r) => r.includes(qHira) || r.includes(qKata)))) {
    return 50;
  }

  // 6. Partial Arti Bahasa Indonesia (Skor 40 / 35)
  if (mainMeaning.startsWith(q)) return 40;
  if (mainMeaning.includes(q)) return 35;

  const enMeaning = (item.meaningEn || "").toLowerCase();
  if (enMeaning === q) return 30;
  if (enMeaning.includes(q)) return 25;

  // 7. Cocok di dalam contoh kosakata (words / examples, Skor 20 / 10)
  const words = item.words || item.examples || [];
  for (const w of words) {
    const wWord = (w.word || "").toLowerCase();
    const wReading = (w.reading || "").toLowerCase();
    const wRomaji = kanaToRomaji(w.reading || "").toLowerCase();
    const wMeaning = (w.meaning || "").toLowerCase();
    if (wWord === q || wReading === q || wRomaji === q || wMeaning === q || (qHira && wReading === qHira) || (qKata && wReading === qKata)) return 20;
    if (wWord.includes(q) || wReading.includes(q) || wRomaji.includes(q) || wMeaning.includes(q) || (qHira && wReading.includes(qHira))) return 10;
  }

  return 0;
}

/**
 * Memfilter daftar kanji berdasarkan kata kunci pencarian dengan Sistem Skor Relevansi (Ranked Search),
 * level JLPT, kelompok level, serta jumlah goresan.
 *
 * @returns {Array<Object>} - Daftar entri kanji yang lolos filter dan sudah terurut berdasarkan relevansi
*/
function visibleEntries() {
  const query = search.value.trim().toLowerCase();
  const rawMatches = [];

  for (const item of entries) {
    const strokeCount = item.strokes || window.MIRAI_STROKE_DATA?.[item.kanji]?.paths?.length || 0;
    const matchesJlpt = !jlpt.value || item.jlpt === jlpt.value;
    const matchesLevel = !level.value || item.level === level.value;
    const matchesStrokes = !strokes?.value || strokeCount === Number(strokes.value);

    if (!matchesJlpt || !matchesLevel || !matchesStrokes) continue;

    if (!query) {
      rawMatches.push({ item, score: 0 });
    } else {
      const score = getKanjiSearchScore(item, query);
      if (score > 0) {
        rawMatches.push({ item, score });
      }
    }
  }

  if (!query) {
    return sortKanjiEntries(rawMatches.map((m) => m.item));
  }

  // Jika ada kanji yang cocok langsung pada kanji, arti, atau bacaan (skor >= 35),
  // abaikan kecocokan yang HANYA berasal dari contoh kata (examples, skor <= 20) agar hasil tidak tercemar
  const hasStrongMatch = rawMatches.some((m) => m.score >= 35);
  const eligibleMatches = hasStrongMatch
    ? rawMatches.filter((m) => m.score >= 35)
    : rawMatches;

  // Urutkan berdasarkan Skor Relevansi Descending (100 -> 90 -> 80 -> 75 -> 65 -> 50 -> 40 -> 20).
  // Jika skor sama, urutkan: Goresan Ascending -> Grade Ascending -> Huruf.
  eligibleMatches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const strokesA = Number(a.item.strokes || 0);
    const strokesB = Number(b.item.strokes || 0);
    if (strokesA !== strokesB) return strokesA - strokesB;
    const gradeA = Number(a.item.grade !== undefined ? a.item.grade : 99);
    const gradeB = Number(b.item.grade !== undefined ? b.item.grade : 99);
    if (gradeA !== gradeB) return gradeA - gradeB;
    return a.item.kanji.localeCompare(b.item.kanji);
  });

  return eligibleMatches.map((m) => m.item);
}

/**
   * Merender kartu kanji ke dalam grid HTML dengan paginasi / limit tampilan dinamis.
   * Menggunakan satu loop / komponen seragam untuk semua level N5-N1.
*/
function render() {
  const visible = visibleEntries();
  const fragment = document.createDocumentFragment();
  count.textContent = `Menampilkan ${visible.length} kanji (N5–N1)`;
  empty.hidden = visible.length > 0;

  const sliced = visible.slice(0, currentRenderLimit);
  sliced.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "kanji-card";
    button.dataset.kanji = item.kanji;
    if (item.kanji === selectedKanjiChar) {
      button.classList.add("is-active");
    }
    button.innerHTML = `<strong>${item.kanji}</strong><span>${item.meaning}</span><em>${item.jlpt}</em>`;
    button.addEventListener("click", () => {
      if (selectedKanjiChar === item.kanji) {
        renderBlankKanjiState();
      } else {
        renderDetail(item, { userInitiated: true });
      }
    });
    fragment.append(button);
  });

  // Tombol Muat Lebih Banyak jika data melebihi limit tampilan saat ini
  if (visible.length > currentRenderLimit) {
    const loadMoreWrap = document.createElement("div");
    loadMoreWrap.style.gridColumn = "1 / -1";
    loadMoreWrap.style.textAlign = "center";
    loadMoreWrap.style.padding = "16px 0";

    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.className = "btn";
    loadMoreBtn.type = "button";
    const remaining = visible.length - currentRenderLimit;
    loadMoreBtn.textContent = `Tampilkan Lebih Banyak Kanji (+${Math.min(remaining, 60)} dari ${remaining} tersisa)`;
    loadMoreBtn.addEventListener("click", () => {
      currentRenderLimit += 60;
      render();
    });
    loadMoreWrap.append(loadMoreBtn);
    fragment.append(loadMoreWrap);
  }

  grid.replaceChildren(fragment);

  // Pertahankan kartu yang sedang dipilih jika masih terlihat, atau tampilkan kanvas awal bersih
  if (visible.length) {
    if (selectedKanjiChar) {
      const isSelectedVisible = visible.some((item) => item.kanji === selectedKanjiChar);
      if (!isSelectedVisible) {
        renderBlankKanjiState();
      }
    } else if (!detail.querySelector(".unified-canvas-stage")) {
      renderBlankKanjiState();
    }
  } else {
    detail.innerHTML = "<p>Pilih pencarian atau filter lain untuk melihat detail karakter.</p>";
  }
}

// Pasang event listener untuk input pencarian dan filter kontrol dengan debounce
let searchDebounceTimer = null;
const debouncedRender = () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    currentRenderLimit = 60;
    render();
  }, 120);
};

search?.addEventListener("input", debouncedRender);
search?.addEventListener("change", () => {
  clearTimeout(searchDebounceTimer);
  currentRenderLimit = 60;
  render();
});

[jlpt, level, strokes].filter(Boolean).forEach((control) => {
  control.addEventListener("input", () => {
    currentRenderLimit = 60;
    render();
  });
  control.addEventListener("change", () => {
    currentRenderLimit = 60;
    render();
    if (control === jlpt && jlpt.value) {
      const lvl = jlpt.value.toLowerCase();
      loadKanjiChunk(lvl);
      if (window.loadStrokeChunk) window.loadStrokeChunk(lvl);
    }
  });
});

// Pasang tombol kanji acak
dictionary.querySelector("[data-random-kanji]")?.addEventListener("click", () => {
  const visible = visibleEntries();
  if (visible.length) {
    const randomIndex = Math.floor(Math.random() * visible.length);
    renderDetail(visible[randomIndex], { userInitiated: true });
  }
});

// Render grid awal dan inisialisasi tab Kana
render();
setupTabs();
setupQuickStrokeButton();
};

/**
 * Mengatur tab beralih antara Hiragana, Katakana, dan Kanji
*/
function setupTabs() {
const practiceLink = document.querySelector(".dictionary-practice-link a");
const urlParams = new URLSearchParams(window.location.search);
const hash = window.location.hash.replace("#", "").toLowerCase();
const requestedTab = (urlParams.get("tab") || hash || "").toLowerCase();

const switchTab = (mode) => {
  const tab = document.querySelector(`[data-script-tab="${mode}"]`);
  if (!tab) return;
  if (practiceLink) {
    const base = getAppBasePath();
    practiceLink.href = mode === "katakana" ? `${base}kelas/latihan.html?script=katakana` : `${base}kelas/latihan.html?script=hiragana`;
  }
  document.querySelectorAll("[data-script-tab]").forEach((button) => {
    const active = button === tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-script-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.scriptPanel !== mode;
  });
  if (mode !== "kanji") renderKanaPanel(mode);
  window.updateQuickStrokeArrow?.();
};

document.querySelectorAll("[data-script-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    switchTab(tab.dataset.scriptTab);
  });
});

if (requestedTab && document.querySelector(`[data-script-tab="${requestedTab}"]`)) {
  switchTab(requestedTab);
} else {
  const activeTab = document.querySelector("[data-script-tab].is-active");
  if (activeTab && activeTab.dataset.scriptTab !== "kanji") {
    renderKanaPanel(activeTab.dataset.scriptTab);
  }
}
}

/**
 * Merender panel interaktif Hiragana atau Katakana dengan kategori huruf,
 * pencarian, dan animasi urutan menulis.
 *
 * @param {string} mode - "hiragana" atau "katakana"
*/
function renderKanaPanel(mode) {
const panel = document.querySelector(`[data-script-panel="${mode}"]`);
if (!panel || panel.dataset.ready) return;
panel.dataset.ready = "true";
const categories = window.KanaData.categoriesConfig;
let player;
let selectedChar = null;

panel.innerHTML = `
        <div class="dictionary-controls">
            <label>Cari<input type="search" data-kana-search placeholder="Contoh: ${mode === 'katakana' ? 'ア, a, anime' : 'あ, a, cinta'}"></label>
            <label>Kategori<select data-kana-type>
                <option value="">Semua Kategori</option>
                <option value="basic">1. Huruf Dasar (46)</option>
                <option value="dakuten">2. Dakuten (20)</option>
                <option value="handakuten">3. Handakuten (5)</option>
                <option value="yoon">4. Yōon Gabungan (33)</option>
            </select></label>
            <button class="btn" type="button" data-random-kana>ACAK</button>
        </div>
        <p class="result-count" data-kana-count></p>
        <div class="dictionary-layout">
            <div class="kana-categorized-wrap" data-kana-grid-live style="display:flex; flex-direction:column; gap:28px;"></div>
            <aside class="kana-detail" data-kana-detail-live><p>Pilih satu karakter untuk melihat detail dan urutan goresan.</p></aside>
        </div>
    `;

const container = panel.querySelector("[data-kana-grid-live]");
const search = panel.querySelector("[data-kana-search]");
const typeFilter = panel.querySelector("[data-kana-type]");
const count = panel.querySelector("[data-kana-count]");
const detail = panel.querySelector("[data-kana-detail-live]");

const toKatakana = (text) => {
  return [...text].map((char) => {
    const code = char.charCodeAt(0);
    return (code >= 0x3041 && code <= 0x3096) ? String.fromCharCode(code + 0x60) : char;
  }).join("");
};

const show = (character, options = {}) => {
  selectedChar = character;
  detail.classList.remove("is-collapsed");
  container.querySelectorAll(".kana-card").forEach((btn) => {
    btn.classList.toggle("is-selected", btn.dataset.character === character);
  });

  const item = window.KanaData.getDetail(character, mode);
  player?.destroy();
  const strokeCount = item.strokes || window.MIRAI_STROKE_DATA?.[character]?.paths?.length || 3;
  detail.innerHTML = `
            <p class="card-number">${mode.toUpperCase()} / ${item.reading}</p>
            <div class="selected-kana">${character}</div>
            <div class="kana-detail-audio-actions" style="display:flex; gap:8px; align-items:center;">
                <button type="button" class="btn-kana-audio" data-speak-char="${character}" title="Lafalkan huruf ${character} (Normal)">
                    <span>🔊</span>
                </button>
                <button type="button" class="btn-kana-audio btn-audio-slow" data-speak-char-slow="${character}" title="Lafalkan huruf ${character} perlahan (Slow-Mo)">
                    <span>🐢</span>
                </button>
            </div>
            <p><b>Romaji:</b> ${item.reading}</p>
            <p><b>Contoh:</b> <b>${item.example[0]}</b> (<em>${item.example[1]}</em>) — ${item.example[2]} <button type="button" class="mini-audio-btn" data-speak-word="${item.example[0]}" title="Dengarkan ${item.example[0]}">🔊</button> <button type="button" class="mini-audio-btn btn-audio-slow" data-speak-word-slow="${item.example[0]}" title="Dengarkan pelan ${item.example[0]}">🐢</button></p>
            <h4>Urutan Menulis</h4>
            <div data-stroke-player></div>
        `;

  detail.querySelector("[data-speak-char]")?.addEventListener("click", () => {
    window.speakText ? window.speakText(character, "ja-JP", false) : window.speakJapanese?.(character);
  });
  detail.querySelector("[data-speak-char-slow]")?.addEventListener("click", () => {
    window.speakText ? window.speakText(character, "ja-JP", true) : window.speakJapanese?.(character);
  });
  detail.querySelectorAll("[data-speak-word]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const word = btn.dataset.speakWord;
      window.speakText ? window.speakText(word, "ja-JP", false) : window.speakJapanese?.(word);
    });
  });
  detail.querySelectorAll("[data-speak-word-slow]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const word = btn.dataset.speakWordSlow;
      window.speakText ? window.speakText(word, "ja-JP", true) : window.speakJapanese?.(word);
    });
  });

  // Pasang aksi tombol tutup detail (khusus tampilan mobile)
  detail.querySelector("[data-close-detail]")?.addEventListener("click", () => {
    detail.classList.add("is-collapsed");
    renderBlankState();
  });

  player = window.createStrokePlayer(detail.querySelector("[data-stroke-player]"), character, strokeCount, {
    showClear: true,
    mode: mode,
    onSelectCharacter: (char) => show(char, { userInitiated: true }),
    onClear: () => renderBlankState()
  });
  window.updateQuickStrokeArrow?.();

  // Pada perangkat bergerak (HP < 768px), geser tampilan ke panel detail jika diklik pengguna
  if (options.userInitiated && window.innerWidth < 768) {
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const renderBlankState = () => {
  player?.destroy();
  selectedChar = null;
  container.querySelectorAll(".kana-card.is-selected").forEach((btn) => btn.classList.remove("is-selected"));
  detail.innerHTML = `
    <div data-stroke-player></div>
  `;
  player = window.createStrokePlayer(detail.querySelector("[data-stroke-player]"), null, 0, {
    showClear: true,
    mode: mode,
    onSelectCharacter: (char) => show(char, { userInitiated: true }),
    onClear: () => renderBlankState()
  });
  window.updateQuickStrokeArrow?.();
};

const render = () => {
  const query = search.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const fragment = document.createDocumentFragment();

  let totalVisible = 0;
  let firstButton = null;

  categories.forEach((cat) => {
    if (selectedType && cat.id !== selectedType) {
      return;
    }

    const chars = mode === "katakana" ? cat.hiraChars.map(toKatakana) : cat.hiraChars;
    const filteredChars = chars.filter((character) => {
      const item = window.KanaData.getDetail(character, mode);
      return !query || `${character} ${item.reading} ${item.example.join(" ")}`.toLowerCase().includes(query);
    });

    if (filteredChars.length === 0) {
      return;
    }

    totalVisible += filteredChars.length;

    const section = document.createElement("section");
    section.className = "kana-section-group";

    const header = document.createElement("div");
    header.className = "kana-section-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "kana-section-title-wrap";

    const title = document.createElement("h3");
    title.className = "kana-section-title";
    title.textContent = cat.title;

    const badge = document.createElement("span");
    badge.className = "kana-section-badge";
    badge.textContent = cat.badge;

    titleWrap.append(title, badge);

    const descCard = document.createElement("div");
    descCard.className = "kana-section-desc-card";

    const desc = document.createElement("p");
    desc.className = "kana-section-desc";
    desc.textContent = cat.description[mode] || cat.description.hiragana;

    descCard.append(desc);
    header.append(titleWrap, descCard);

    const grid = document.createElement("div");
    grid.className = "kana-section-grid";

    filteredChars.forEach((character) => {
      const item = window.KanaData.getDetail(character, mode);
      const button = document.createElement("button");
      button.className = "kana-card";
      button.type = "button";
      button.dataset.character = character;
      if (character === selectedChar) {
        button.classList.add("is-selected");
      }
      button.innerHTML = `<strong>${character}</strong><span>${item.reading}</span>`;
      button.addEventListener("click", () => {
        if (selectedChar === character) {
          renderBlankState();
        } else {
          show(character, { userInitiated: true });
          window.speakText ? window.speakText(character, "ja-JP") : window.speakJapanese?.(character);
        }
      });
      grid.append(button);

      if (!firstButton) {
        firstButton = { button, character };
      }
    });

    section.append(header, grid);
    fragment.append(section);
  });

  count.textContent = `Menampilkan ${totalVisible} karakter ${mode === 'katakana' ? 'Katakana' : 'Hiragana'}`;

  if (totalVisible === 0) {
    const emptyEl = document.createElement("div");
    emptyEl.className = "kana-empty-state";
    const emptyText = document.createElement("p");
    emptyText.textContent = `Tidak ada karakter yang cocok dengan pencarian “${query}”.`;
    emptyEl.append(emptyText);
    fragment.append(emptyEl);
  } else if (!selectedChar) {
    renderBlankState();
  }

  container.replaceChildren(fragment);
};

let kanaSearchDebounce = null;
search.addEventListener("input", () => {
  clearTimeout(kanaSearchDebounce);
  kanaSearchDebounce = setTimeout(render, 120);
});
search.addEventListener("change", () => {
  clearTimeout(kanaSearchDebounce);
  render();
});
typeFilter.addEventListener("change", render);
panel.querySelector("[data-random-kana]").addEventListener("click", () => {
  const allChars = window.KanaData.getCharacters(mode);
  const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
  show(randomChar, { userInitiated: true });
});

render();
}

/**
 * Tombol Cepat Mengikuti (Floating Quick Button) Khusus Kamus:
 * Geser langsung ke tampilan animasi urutan goresan (stroke order).
*/
function setupQuickStrokeButton() {
if (!document.body.classList.contains("page-kamus")) return;

let btn = document.getElementById("quickStrokeBtn");
if (!btn) {
  btn = document.createElement("button");
  btn.id = "quickStrokeBtn";
  btn.className = "quick-stroke-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Geser ke Goresan");
  btn.setAttribute("title", "Geser ke Goresan");
  btn.innerHTML = `
            <span class="quick-stroke-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg></span>
            <span class="quick-stroke-text">Goresan</span>
            <span class="quick-stroke-arrow">↓</span>
        `;
  const toTop = document.querySelector(".to-top");
  if (toTop && toTop.parentNode) {
    toTop.parentNode.insertBefore(btn, toTop);
  } else {
    document.body.appendChild(btn);
  }
}

const getActiveLiveStrokeElement = () => {
  const activePanel = document.querySelector('[data-script-panel]:not([hidden])');
  if (!activePanel) {
    return document.querySelector('#stroke-stage, [data-stroke-player], .kana-detail, .kanji-detail');
  }

  const strokeStage = activePanel.querySelector('#stroke-stage')
    || activePanel.querySelector('.stroke-stage')
    || activePanel.querySelector('[data-stroke-player]');
  if (strokeStage) return strokeStage;

  return activePanel.querySelector('.kana-detail, .kanji-detail');
};

const arrowEl = btn.querySelector(".quick-stroke-arrow");

const updateArrow = () => {
  if (!arrowEl || !btn) return;

  // Tombol melayang tetap tampil di pojok kanan bawah di semua resolusi
  btn.style.display = "inline-flex";

  const target = getActiveLiveStrokeElement();
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;

  if (rect.top > vh * 0.72) {
    arrowEl.textContent = "↓";
  } else if (rect.bottom < vh * 0.28) {
    arrowEl.textContent = "↑";
  } else {
    arrowEl.textContent = "●";
  }
};

if (!btn.dataset.initialized) {
  btn.dataset.initialized = "true";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.MiraiSound?.playClickIfIdle();

    let target = getActiveLiveStrokeElement();

    // Jika belum ada kartu yang dipilih atau animasi belum muncul, auto-select kartu pertama pada panel aktif
    const activePanel = document.querySelector('[data-script-panel]:not([hidden])') || document;
    const strokePlayer = activePanel.querySelector('[data-stroke-player], [data-kanji-stroke-player], #stroke-stage');

    if (!strokePlayer || !strokePlayer.hasChildNodes()) {
      const firstCard = activePanel.querySelector('.kana-card.is-selected') || activePanel.querySelector('.kana-card') || activePanel.querySelector('.kanji-card');
      if (firstCard) {
        firstCard.click();
      }
    }

    target = getActiveLiveStrokeElement() || activePanel.querySelector('.kana-detail, .kanji-detail, #stroke-stage, .stroke-stage');
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    const pulseEl = target.closest(".stroke-stage")
      || target.querySelector(".stroke-stage")
      || target.closest(".kana-detail, .kanji-detail")
      || target;

    pulseEl.classList.remove("stroke-target-pulse");
    void pulseEl.offsetWidth;
    pulseEl.classList.add("stroke-target-pulse");

    setTimeout(updateArrow, 450);
  });

  window.addEventListener("scroll", updateArrow, { passive: true });
  window.addEventListener("resize", updateArrow, { passive: true });
}

window.updateQuickStrokeArrow = updateArrow;
updateArrow();
}

// Inisialisasi otomatis saat dokumen selesai dimuat
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", () => {
  window.initKanjiDictionary?.();
  setupQuickStrokeButton();
});
} else {
window.initKanjiDictionary?.();
setupQuickStrokeButton();
}
