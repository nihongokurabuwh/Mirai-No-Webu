/**
 * File: js/kamus-translator.js
 * Fungsi: Mesin Penerjemah 2 Arah (Jepang ⇄ Indonesia), Kamus Leksikal Kanji,
 *         dan Kontroler Virtual Keyboard Dual-Mode (Kana & QWERTY IME).
 * Penggunaan: kamus/index.html dan kamus/kanji.html.
*/

(() => {
"use strict";

// =========================================================================
// 1. KAMUS LEKSIKAL BAHASA INGGRIS -> INDONESIA (Untuk Makna Kanji)
// =========================================================================
const dictionary = {
  // Nature & Elements
  "day": "hari, siang", "sun": "matahari", "moon": "bulan", "month": "bulan", "year": "tahun",
  "fire": "api", "water": "air", "tree": "pohon", "wood": "kayu", "gold": "emas", "money": "uang",
  "earth": "tanah, bumi", "ground": "tanah", "soil": "tanah", "stone": "batu", "mountain": "gunung",
  "river": "sungai", "stream": "aliran air", "sea": "laut", "ocean": "samudra", "rain": "hujan",
  "snow": "salju", "wind": "angin", "cloud": "awan", "sky": "langit", "heavens": "surga, langit",
  "flower": "bunga", "blossom": "mekar, bunga", "cherry blossom": "bunga sakura", "grass": "rumput",
  "forest": "hutan", "woods": "hutan kayu", "field": "ladang, lapangan", "rice field": "sawah",
  "rice paddy": "sawah", "spring": "musim semi, mata air", "summer": "musim panas",
  "autumn": "musim gugur", "fall": "musim gugur", "winter": "musim dingin", "season": "musim",
  "nature": "alam", "weather": "cuaca", "thunder": "petir", "lightning": "kilat",

  // People & Relationships
  "person": "orang", "people": "orang-orang", "man": "pria, laki-laki", "male": "laki-laki",
  "woman": "wanita, perempuan", "female": "perempuan", "child": "anak", "children": "anak-anak",
  "boy": "anak laki-laki", "girl": "anak perempuan", "baby": "bayi", "friend": "teman, sahabat",
  "companion": "rekan, teman", "father": "ayah", "mother": "ibu", "parent": "orang tua",
  "parents": "orang tua", "older brother": "kakak laki-laki", "younger brother": "adik laki-laki",
  "older sister": "kakak perempuan", "younger sister": "adik perempuan", "brother": "saudara laki-laki",
  "sister": "saudara perempuan", "family": "keluarga", "ancestor": "leluhur", "generation": "generasi",
  "self": "diri sendiri", "oneself": "diri sendiri", "teacher": "guru", "master": "guru, ahli",
  "student": "murid, siswa", "pupil": "murid", "doctor": "dokter", "physician": "dokter",
  "king": "raja", "emperor": "kaisar", "queen": "ratu", "lord": "tuan, penguasa",
  "human": "manusia", "mankind": "umat manusia", "life": "hidup, kehidupan", "birth": "kelahiran",
  "death": "kematian", "die": "mati, meninggal", "alive": "hidup", "living": "hidup",

  // Body & Mind
  "body": "tubuh, badan", "head": "kepala", "face": "wajah", "eye": "mata", "eyes": "mata",
  "ear": "telinga", "ears": "telinga", "mouth": "mulut", "lip": "bibir", "nose": "hidung",
  "tooth": "gigi", "teeth": "gigi", "tongue": "lidah", "throat": "tenggorokan", "neck": "leher",
  "shoulder": "bahu", "hand": "tangan", "arm": "lengan", "finger": "jari", "foot": "kaki",
  "leg": "kaki", "knee": "lutut", "bone": "tulang", "skin": "kulit", "blood": "darah",
  "heart": "hati, jantung", "mind": "pikiran, hati", "spirit": "semangat, jiwa", "soul": "jiwa",
  "thought": "pikiran", "think": "berpikir", "feel": "merasa", "feeling": "perasaan",
  "emotion": "emosi", "love": "cinta, kasih sayang", "affection": "kasih sayang", "hate": "benci",
  "anger": "kemarahan", "sadness": "kesedihan", "joy": "kegembiraan", "happiness": "kebahagiaan",
  "fear": "ketakutan", "pain": "rasa sakit", "illness": "penyakit", "sickness": "sakit",
  "disease": "penyakit", "health": "kesehatan", "healthy": "sehat", "strength": "kekuatan",
  "power": "kekuatan, daya", "energy": "energi, tenaga", "voice": "suara", "sound": "bunyi, suara",

  // Actions & Verbs
  "eat": "makan", "food": "makanan", "meal": "makanan", "drink": "minum", "beverage": "minuman",
  "see": "melihat", "look": "melihat", "watch": "menonton", "view": "pemandangan, melihat",
  "hear": "mendengar", "listen": "mendengarkan", "speak": "berbicara", "talk": "berbicara",
  "say": "mengatakan", "tell": "menceritakan", "word": "kata", "words": "kata-kata",
  "speech": "pidato, ucapan", "language": "bahasa", "read": "membaca", "write": "menulis",
  "draw": "menggambar", "paint": "melukis", "walk": "berjalan", "run": "berlari",
  "stand": "berdiri", "sit": "duduk", "lie down": "berbaring", "sleep": "tidur",
  "wake up": "bangun", "go": "pergi", "come": "datang", "return": "kembali, pulang",
  "enter": "masuk", "exit": "keluar", "leave": "meninggalkan", "arrive": "tiba, sampai",
  "meet": "bertemu", "meeting": "pertemuan", "gather": "berkumpul", "fly": "terbang",
  "swim": "berenang", "play": "bermain", "sing": "menyanyi", "dance": "menari",
  "study": "belajar", "learn": "mempelajari", "teach": "mengajar", "work": "bekerja, karya",
  "job": "pekerjaan", "profession": "profesi", "buy": "membeli", "sell": "menjual",
  "pay": "membayar", "give": "memberi", "receive": "menerima", "take": "mengambil",
  "hold": "memegang", "carry": "membawa", "put": "meletakkan", "make": "membuat",
  "build": "membangun", "create": "menciptakan", "destroy": "menghancurkan", "break": "merusak",
  "cut": "memotong", "open": "membuka", "close": "menutup", "start": "mulai",
  "begin": "memulai", "end": "berakhir, selesai", "finish": "selesai", "stop": "berhenti",
  "continue": "melanjutkan", "wait": "menunggu", "hurry": "tergesa-gesa", "help": "menolong",
  "save": "menyelamatkan", "win": "menang", "lose": "kalah, kehilangan", "fight": "bertarung",
  "war": "perang", "battle": "pertempuran", "peace": "kedamaian",

  // Objects & Places
  "book": "buku", "letter": "surat, huruf", "character": "karakter, huruf", "paper": "kertas",
  "pen": "pena", "brush": "kuas", "picture": "gambar, foto", "photo": "foto",
  "house": "rumah", "home": "rumah", "room": "kamar, ruangan", "door": "pintu",
  "window": "jendela", "wall": "dinding", "gate": "gerbang", "roof": "atap",
  "building": "gedung, bangunan", "school": "sekolah", "university": "universitas", "college": "perguruan tinggi",
  "hospital": "rumah sakit", "station": "stasiun", "train": "kereta api", "electric train": "kereta listrik",
  "car": "mobil", "automobile": "mobil", "vehicle": "kendaraan", "bicycle": "sepeda",
  "airplane": "pesawat terbang", "ship": "kapal", "boat": "perahu", "road": "jalan",
  "street": "jalan raya", "path": "jalur, jalan kecil", "bridge": "jembatan", "town": "kota kecil",
  "city": "kota", "village": "desa", "country": "negara", "state": "negara bagian",
  "world": "dunia", "society": "masyarakat", "company": "perusahaan", "office": "kantor",
  "store": "toko", "shop": "toko", "market": "pasar", "restaurant": "restoran",
  "temple": "kuil", "shrine": "kuil Shinto", "park": "taman", "garden": "kebun, taman",
  "table": "meja", "chair": "kursi", "bed": "tempat tidur", "clothes": "pakaian",
  "clothing": "pakaian", "shoe": "sepatu", "shoes": "sepatu", "hat": "topi", "bag": "tas",
  "clock": "jam dinding", "watch": "jam tangan", "bell": "lonceng, bel", "mirror": "cermin",
  "box": "kotak", "cup": "cangkir", "plate": "piring", "dish": "hidangan, piring",
  "knife": "pisau", "sword": "pedang", "gun": "senjata, pistol", "bow": "busur",

  // Concepts, Numbers & Time
  "one": "satu", "two": "dua", "three": "tiga", "four": "empat", "five": "lima",
  "six": "enam", "seven": "tujuh", "eight": "delapan", "nine": "sembilan", "ten": "sepuluh",
  "hundred": "seratus", "thousand": "seribu", "ten thousand": "sepuluh ribu", "zero": "nol",
  "half": "setengah, separuh", "all": "semua", "every": "setiap", "many": "banyak",
  "few": "sedikit", "little": "sedikit, kecil", "much": "banyak", "number": "angka, nomor",
  "time": "waktu", "hour": "jam", "minute": "menit", "second": "detik",
  "morning": "pagi", "noon": "siang", "afternoon": "sore", "evening": "malam, petang",
  "night": "malam", "today": "hari ini", "yesterday": "kemarin", "tomorrow": "besok",
  "now": "sekarang", "past": "masa lalu", "future": "masa depan", "ago": "yang lalu",
  "before": "sebelum", "after": "sesudah", "front": "depan", "back": "belakang",
  "right": "kanan", "left": "kiri", "up": "atas", "above": "di atas",
  "down": "bawah", "below": "di bawah", "middle": "tengah", "center": "pusat, tengah",
  "inside": "dalam", "outside": "luar", "side": "samping, sisi", "near": "dekat",
  "far": "jauh", "east": "timur", "west": "barat", "south": "selatan", "north": "utara"
};

function cleanEnglish(str) {
  if (!str) return "";
  return str
    .replace(/\([^)]*\)/g, "")
    .replace(/["']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function translateWordDirect(word) {
  const lower = word.toLowerCase().trim();
  if (dictionary[lower]) return dictionary[lower];
  if (lower.endsWith("s") && dictionary[lower.slice(0, -1)]) {
    return dictionary[lower.slice(0, -1)];
  }
  return null;
}

// =========================================================================
// 2. KAMUS DUA ARAH OFFLINE (JEPANG ⇄ INDONESIA)
// =========================================================================
const jaToIdDictionary = {
  // Salam & Ungkapan
  "こんにちは": "Halo / Selamat siang",
  "おはよう": "Selamat pagi",
  "おはようございます": "Selamat pagi (sopan)",
  "こんばんは": "Selamat malam",
  "おやすみ": "Selamat malam / Selamat tidur",
  "おやすみなさい": "Selamat beristirahat (sopan)",
  "さようなら": "Selamat tinggal",
  "じゃあね": "Sampai jumpa nanti",
  "またね": "Sampai jumpa",
  "ありがとう": "Terima kasih",
  "ありがとうございます": "Terima kasih banyak (sopan)",
  "どうもありがとうございます": "Terima kasih banyak sekali",
  "どういたしまして": "Sama-sama",
  "すみません": "Permisi / Maaf",
  "ごめんなさい": "Mohon maaf",
  "はい": "Ya",
  "いいえ": "Tidak / Bukan",
  "いただきます": "Selamat makan",
  "ごちそうさまでした": "Terima kasih atas makanannya",
  "はじめまして": "Senang berkenalan denganmu",
  "よろしくおねがいします": "Mohon bantuannya / Salam kenal",
  "よろしくお願いします": "Mohon bantuannya / Salam kenal",
  "おねがいします": "Tolong / Mohon",
  "お元気ですか": "Apa kabar?",
  "元気です": "Kabar baik",
  "だいじょうぶ": "Tidak apa-apa / Aman",
  "大丈夫": "Tidak apa-apa",

  // Kata Ganti
  "わたし": "Saya / Aku",
  "私": "Saya",
  "ぼく": "Aku (laki-laki)",
  "僕": "Aku (laki-laki)",
  "あなた": "Kamu / Anda",
  "かれ": "Dia (laki-laki)",
  "彼": "Dia (laki-laki)",
  "かのじょ": "Dia (perempuan) / Pacar",
  "彼女": "Dia (perempuan)",
  "わたしたち": "Kami / Kita",
  "私たち": "Kami / Kita",
  "みんな": "Semuanya / Kalian semua",

  // Tunjuk
  "これ": "Ini",
  "それ": "Itu (dekat lawan bicara)",
  "あれ": "Itu (jauh dari keduanya)",
  "どれ": "Yang mana",
  "ここ": "Di sini",
  "そこ": "Di situ",
  "あそこ": "Di sana",
  "どこ": "Di mana",
  "だれ": "Siapa",
  "何": "Apa",
  "なに": "Apa",
  "いつ": "Kapan",
  "どうして": "Kenapa / Mengapa",
  "なぜ": "Mengapa",
  "どう": "Bagaimana",

  // Benda & Tempat
  "ほん": "Buku",
  "本": "Buku",
  "がっこう": "Sekolah",
  "学校": "Sekolah",
  "せんせい": "Guru / Tutor",
  "先生": "Guru",
  "ともだち": "Teman",
  "友達": "Teman",
  "にほん": "Jepang",
  "日本": "Jepang",
  "にほんご": "Bahasa Jepang",
  "日本語": "Bahasa Jepang",
  "インドネシア": "Indonesia",
  "インドネシア語": "Bahasa Indonesia",
  "みず": "Air",
  "水": "Air",
  "ごはん": "Nasi / Makanan",
  "おちゃ": "Teh Jepang",
  "くるま": "Mobil",
  "車": "Mobil",
  "いえ": "Rumah",
  "家": "Rumah",

  // Kata Sifat & Kerja Dasar
  "すき": "Suka",
  "好き": "Suka",
  "だいすき": "Sangat suka",
  "大好き": "Sangat suka",
  "たべる": "Makan",
  "食べる": "Makan",
  "のむ": "Minum",
  "飲む": "Minum",
  "いく": "Pergi",
  "行く": "Pergi",
  "くる": "Datang",
  "来る": "Datang",
  "みる": "Melihat / Menonton",
  "見る": "Melihat",
  "きく": "Mendengar",
  "聞く": "Mendengar",
  "はなす": "Berbicara",
  "話す": "Berbicara",
  "べんきょう": "Belajar",
  "勉強": "Belajar",
  "いい": "Bagus / Baik",
  "わるい": "Buruk",
  "おいしい": "Enak / Lezat",
  "たのしい": "Menyenangkan",
  "かわいい": "Lucu / Imut",
  "すごい": "Hebat / Luar biasa"
};

// Kamus Kebalikan Indonesia -> Jepang
const idToJaDictionary = {
  "halo": "こんにちは (Konnichiwa)",
  "hai": "こんにちは (Konnichiwa)",
  "selamat pagi": "おはようございます (Ohayou gozaimasu)",
  "selamat siang": "こんにちは (Konnichiwa)",
  "selamat malam": "こんばんは (Konbanwa)",
  "selamat tidur": "おやすみなさい (Oyasuminasai)",
  "selamat tinggal": "さようなら (Sayounara)",
  "sampai jumpa": "またね (Mata ne)",
  "terima kasih": "ありがとう (Arigatou)",
  "terima kasih banyak": "ありがとうございます (Arigatou gozaimasu)",
  "sama-sama": "どういたしまして (Douitashimashite)",
  "permisi": "すみません (Sumimasen)",
  "maaf": "ごめんなさい (Gomennasai)",
  "ya": "はい (Hai)",
  "tidak": "いいえ (Iie)",
  "bukan": "いいえ (Iie)",
  "apa kabar": "お元気ですか (Ogenki desu ka?)",
  "kabar baik": "元気です (Genki desu)",
  "tidak apa-apa": "大丈夫です (Daijoubu desu)",
  "senang berkenalan denganmu": "はじめまして (Hajimemashite)",
  "mohon bantuannya": "よろしくお願いします (Yoroshiku onegaishimasu)",
  "saya": "私 (Watashi)",
  "aku": "僕 (Boku) / 私 (Watashi)",
  "kamu": "あなた (Anata)",
  "dia": "彼 (Kare) / 彼女 (Kanojo)",
  "mereka": "彼ら (Karera)",
  "kami": "私たち (Watashitachi)",
  "kita": "私たち (Watashitachi)",
  "ini": "これ (Kore)",
  "itu": "それ (Sore) / あれ (Are)",
  "apa": "何 (Nani / Nan)",
  "siapa": "誰 (Dare)",
  "kapan": "いつ (Itsu)",
  "di mana": "どこ (Doko)",
  "mengapa": "なぜ (Naze) / どうして (Doushite)",
  "bagaimana": "どう (Dou) / いかが (Ikaga)",
  "buku": "本 (Hon)",
  "sekolah": "学校 (Gakkou)",
  "guru": "先生 (Sensei)",
  "teman": "友達 (Tomodachi)",
  "sahabat": "親友 (Shinyuu)",
  "jepang": "日本 (Nihon)",
  "bahasa jepang": "日本語 (Nihongo)",
  "indonesia": "インドネシア (Indoneshia)",
  "bahasa indonesia": "インドネシア語 (Indoneshiago)",
  "air": "水 (Mizu)",
  "makanan": "食べ物 (Tabemono)",
  "minuman": "飲み物 (Nomimono)",
  "rumah": "家 (Ie)",
  "mobil": "車 (Kuruma)",
  "suka": "好き (Suki)",
  "cinta": "愛 (Ai) / 大好き (Daisuki)",
  "makan": "食べる (Taberu)",
  "minum": "飲む (Nomu)",
  "pergi": "行く (Iku)",
  "datang": "来る (Kuru)",
  "melihat": "見る (Miru)",
  "belajar": "勉強する (Benkyou suru)",
  "bagus": "いい (Ii)",
  "enak": "美味しい (Oishii)",
  "hebat": "すごい (Sugoi)",
  "lucu": "可愛い (Kawaii)"
};

// =========================================================================
// 3. TABEL MAPPING ROMAJI KE HIRAGANA (SMART IME)
// =========================================================================
const romajiToHiraganaMap = {
  "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ",
  "sha": "しゃ", "shu": "しゅ", "sho": "しょ",
  "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ",
  "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ",
  "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ",
  "mya": "みゃ", "myu": "みゅ", "myo": "みょ",
  "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ",
  "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ",
  "ja": "じゃ", "ju": "じゅ", "jo": "じょ",
  "bya": "びゃ", "byu": "びゅ", "byo": "びょ",
  "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ",
  "tsu": "つ", "chi": "ち", "shi": "し",

  "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
  "sa": "さ", "si": "し", "su": "す", "se": "せ", "so": "そ",
  "ta": "た", "ti": "ち", "tu": "つ", "te": "て", "to": "と",
  "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
  "ha": "は", "hi": "ひ", "fu": "ふ", "hu": "ふ", "he": "へ", "ho": "ほ",
  "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
  "ya": "や", "yu": "ゆ", "yo": "よ",
  "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
  "wa": "わ", "wo": "を", "nn": "ん", "n'": "ん",

  "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
  "za": "ざ", "zi": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
  "da": "だ", "di": "ぢ", "du": "づ", "de": "で", "do": "ど",
  "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
  "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",

  "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
  "-": "ー"
};

/**
   * Mengonversi teks Romaji menjadi Hiragana secara cerdas (mendukung konsonan ganda sokuon 'っ')
   * @param {string} text - Teks romaji
   * @returns {string} - Hasil kana
*/
function convertRomajiToKana(text) {
  if (!text) return "";
  if (window.wanakana && typeof window.wanakana.toHiragana === "function") {
    try {
    return window.wanakana.toHiragana(text);
    } catch (e) {}
  }

  let out = "";
  let i = 0;
  const len = text.length;
  const lower = text.toLowerCase();

  while (i < len) {
    // Sokuon konsonan ganda (tt -> っt, kk -> っk, dsb.)
    if (i + 1 < len && lower[i] === lower[i + 1] && /[b-df-hj-np-tv-z]/.test(lower[i]) && lower[i] !== "n") {
    out += "っ";
    i++;
    continue;
    }

    // Cek 3 huruf
    if (i + 3 <= len) {
    const sub3 = lower.slice(i, i + 3);
    if (romajiToHiraganaMap[sub3]) {
    out += romajiToHiraganaMap[sub3];
    i += 3;
    continue;
    }
    }

    // Cek 2 huruf
    if (i + 2 <= len) {
    const sub2 = lower.slice(i, i + 2);
    if (romajiToHiraganaMap[sub2]) {
    out += romajiToHiraganaMap[sub2];
    i += 2;
    continue;
    }
    }

    // Cek 1 huruf
    const sub1 = lower.slice(i, i + 1);
    if (romajiToHiraganaMap[sub1]) {
    out += romajiToHiraganaMap[sub1];
    i += 1;
    continue;
    }

    out += text[i];
    i++;
  }
  return out;
}

/**
   * Menghasilkan pelafalan Romaji dari teks Kana / Kanji
*/
function getRomajiReading(text) {
  if (!text) return "";
  const clean = text.trim();
  if (typeof POPULAR_PREDICTIONS !== "undefined" && Array.isArray(POPULAR_PREDICTIONS)) {
    const pop = POPULAR_PREDICTIONS.find(p => p.word === clean || p.kana === clean);
    if (pop && pop.reading && window.wanakana && typeof window.wanakana.toRomaji === "function") {
      try {
        const r = window.wanakana.toRomaji(pop.reading);
        if (r && r !== pop.reading) return r;
      } catch (e) {}
    }
  }
  if (Array.isArray(window.KANJI_FULL_DATA)) {
    const k = window.KANJI_FULL_DATA.find(item => item.kanji === clean);
    if (k) {
      const read = (k.kunyomi && k.kunyomi[0]) || (k.onyomi && k.onyomi[0]);
      if (read && window.wanakana && typeof window.wanakana.toRomaji === "function") {
        try {
          const r = window.wanakana.toRomaji(read.replace(/\./g, ''));
          if (r && r !== read) return r;
        } catch (e) {}
      }
    }
  }
  if (window.wanakana && typeof window.wanakana.toRomaji === "function") {
    try {
      const rom = window.wanakana.toRomaji(text);
      return rom !== text ? rom : "";
    } catch (e) {}
  }
  return "";
}

// =========================================================================
// 4. API TRANSLASI DUA ARAH (ONLINE + FALLBACK OFFLINE)
// =========================================================================
async function fetchMyMemoryTranslation(text, sourceLang, targetLang) {
  const langpair = `${sourceLang}|${targetLang}`;
  const cacheKey = `mnh_bidir_${langpair}_${text.trim().toLowerCase()}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${encodeURIComponent(langpair)}`;
    const res = await fetch(url);
    if (res.ok) {
    const data = await res.json();
    const trans = data?.responseData?.translatedText;
    if (trans && typeof trans === "string" && trans.trim().toLowerCase() !== text.trim().toLowerCase()) {
    const clean = trans
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
    try {
      localStorage.setItem(cacheKey, clean);
    } catch (e) {}
    return clean;
    }
    }
  } catch (err) {
    console.warn("MyMemory API fetch network error:", err);
  }
  return null;
}

// =========================================================================
// 5. GBOARD 12-KEY KEYBOARD DATA & PREDICTION CONFIG
// =========================================================================
const GBOARD_12KEY_DATA = {
  hiragana: {
    a: { main: 'あ', sub: 'あいうえお', chars: ['あ', 'い', 'う', 'え', 'お'] },
    ka: { main: 'か', sub: 'かきくけこ', chars: ['か', 'き', 'く', 'け', 'こ'] },
    sa: { main: 'さ', sub: 'さしすせそ', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
    ta: { main: 'た', sub: 'たちつてと', chars: ['た', 'ち', 'つ', 'て', 'と'] },
    na: { main: 'な', sub: 'なにぬねの', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
    ha: { main: 'は', sub: 'はひふへほ', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
    ma: { main: 'ま', sub: 'まみむめも', chars: ['ま', 'み', 'む', 'め', 'も'] },
    ya: { main: 'や', sub: 'や（ゆ）よ', chars: ['や', '（', 'ゆ', '）', 'よ'] },
    ra: { main: 'ら', sub: 'らりるれろ', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
    wa: { main: 'わ', sub: 'わをんー〜', chars: ['わ', 'を', 'ん', 'ー', '～'] },
    punct: { main: '、。', sub: '、。？！', chars: ['、', '。', '？', '！', '…'] }
  },
  katakana: {
    a: { main: 'ア', sub: 'アイウエオ', chars: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
    ka: { main: 'カ', sub: 'カキクケコ', chars: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
    sa: { main: 'サ', sub: 'サシスセソ', chars: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
    ta: { main: 'タ', sub: 'タチツテト', chars: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
    na: { main: 'ナ', sub: 'ナニヌネノ', chars: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
    ha: { main: 'ハ', sub: 'ハヒフヘホ', chars: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
    ma: { main: 'マ', sub: 'マミムメモ', chars: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
    ya: { main: 'ヤ', sub: 'ヤ（ユ）ヨ', chars: ['ヤ', '（', 'ユ', '）', 'ヨ'] },
    ra: { main: 'ラ', sub: 'ラリルレロ', chars: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
    wa: { main: 'ワ', sub: 'ワヲンー〜', chars: ['ワ', 'ヲ', 'ン', 'ー', '～'] },
    punct: { main: '、。', sub: '、。？！', chars: ['、', '。', '？', '！', '…'] }
  },
  number: {
    a: { main: '1', sub: '1 @ # / \\', chars: ['1', '@', '#', '/', '\\'] },
    ka: { main: '2', sub: '2 A B C', chars: ['2', 'A', 'B', 'C', 'c'] },
    sa: { main: '3', sub: '3 D E F', chars: ['3', 'D', 'E', 'F', 'f'] },
    ta: { main: '4', sub: '4 G H I', chars: ['4', 'G', 'H', 'I', 'i'] },
    na: { main: '5', sub: '5 J K L', chars: ['5', 'J', 'K', 'L', 'l'] },
    ha: { main: '6', sub: '6 M N O', chars: ['6', 'M', 'N', 'O', 'o'] },
    ma: { main: '7', sub: '7 P Q R S', chars: ['7', 'P', 'Q', 'R', 'S'] },
    ya: { main: '8', sub: '8 T U V', chars: ['8', 'T', 'U', 'V', 'v'] },
    ra: { main: '9', sub: '9 W X Y Z', chars: ['9', 'W', 'X', 'Y', 'Z'] },
    wa: { main: '0', sub: '0 + - * =', chars: ['0', '+', '-', '*', '='] },
    punct: { main: '.,', sub: '. , ? ! :', chars: ['.', ',', '?', '!', ':'] }
  }
};

const DAKUTEN_CYCLE_MAP = {
  // Hiragana Ka, Sa, Ta, Ha
  'か': 'が', 'が': 'か', 'き': 'ぎ', 'ぎ': 'き', 'く': 'ぐ', 'ぐ': 'く', 'け': 'げ', 'げ': 'け', 'こ': 'ご', 'ご': 'こ',
  'さ': 'ざ', 'ざ': 'さ', 'し': 'じ', 'じ': 'し', 'す': 'ず', 'ず': 'す', 'せ': 'ぜ', 'ぜ': 'せ', 'そ': 'ぞ', 'ぞ': 'そ',
  'た': 'だ', 'だ': 'た', 'ち': 'ぢ', 'ぢ': 'ち', 'つ': 'っ', 'っ': 'づ', 'づ': 'つ', 'て': 'で', 'で': 'て', 'と': 'ど', 'ど': 'と',
  'は': 'ば', 'ば': 'ぱ', 'ぱ': 'は', 'ひ': 'び', 'び': 'ぴ', 'ぴ': 'ひ', 'ふ': 'ぶ', 'ぶ': 'ぷ', 'ぷ': 'ふ', 'へ': 'べ', 'べ': 'ぺ', 'ぺ': 'へ', 'ほ': 'ぼ', 'ぼ': 'ぽ', 'ぽ': 'ほ',

  // Hiragana Small & Vowels
  'や': 'ゃ', 'ゃ': 'や', 'ゆ': 'ゅ', 'ゅ': 'ゆ', 'よ': 'ょ', 'ょ': 'よ',
  'あ': 'ぁ', 'ぁ': 'あ', 'い': 'ぃ', 'ぃ': 'い', 'う': 'ぅ', 'ぅ': 'ゔ', 'ゔ': 'う', 'え': 'ぇ', 'ぇ': 'え', 'お': 'ぉ', 'ぉ': 'お',
  'わ': 'ゎ', 'ゎ': 'わ',

  // Katakana Ka, Sa, Ta, Ha
  'カ': 'ガ', 'ガ': 'カ', 'キ': 'ギ', 'ギ': 'キ', 'ク': 'グ', 'グ': 'ク', 'ケ': 'ゲ', 'ゲ': 'ケ', 'コ': 'ゴ', 'ゴ': 'コ',
  'サ': 'ザ', 'ザ': 'サ', 'シ': 'ジ', 'ジ': 'シ', 'ス': 'ズ', 'ズ': 'ス', 'セ': 'ゼ', 'ゼ': 'セ', 'ソ': 'ゾ', 'ゾ': 'ソ',
  'タ': 'ダ', 'ダ': 'タ', 'チ': 'ヂ', 'ヂ': 'チ', 'ツ': 'ッ', 'ッ': 'ヅ', 'ヅ': 'ツ', 'テ': 'デ', 'デ': 'テ', 'ト': 'ド', 'ド': 'ト',
  'ハ': 'バ', 'バ': 'パ', 'パ': 'ハ', 'ヒ': 'ビ', 'ビ': 'ピ', 'ピ': 'ヒ', 'フ': 'ブ', 'ブ': 'プ', 'プ': 'フ', 'ヘ': 'ベ', 'ベ': 'ペ', 'ペ': 'ヘ', 'ホ': 'ボ', 'ボ': 'ポ', 'ポ': 'ホ',

  // Katakana Small & Vowels
  'ヤ': 'ャ', 'ャ': 'ヤ', 'ユ': 'ュ', 'ュ': 'ユ', 'ヨ': 'ョ', 'ョ': 'ヨ',
  'ア': 'ァ', 'ァ': 'ア', 'イ': 'ィ', 'ィ': 'イ', 'ウ': 'ゥ', 'ゥ': 'ヴ', 'ヴ': 'ウ', 'エ': 'ェ', 'ェ': 'エ', 'オ': 'ォ', 'ォ': 'オ',
  'ワ': 'ヮ', 'ヮ': 'ワ'
};

const POPULAR_PREDICTIONS = [
  { kana: "わたし", word: "私", reading: "わたし", meaning: "Saya / Aku" },
  { kana: "わたしたち", word: "私たち", reading: "わたしたち", meaning: "Kami / Kita" },
  { kana: "ぼく", word: "僕", reading: "ぼく", meaning: "Aku (pria)" },
  { kana: "おれ", word: "俺", reading: "おれ", meaning: "Gue / Aku" },
  { kana: "あなた", word: "貴方", reading: "あなた", meaning: "Anda / Kamu" },
  { kana: "かれ", word: "彼", reading: "かれ", meaning: "Dia (laki-laki)" },
  { kana: "かのじょ", word: "彼女", reading: "かのじょ", meaning: "Dia (wanita) / Pacar" },
  { kana: "にほん", word: "日本", reading: "にほん", meaning: "Jepang" },
  { kana: "にほんご", word: "日本語", reading: "にほんご", meaning: "Bahasa Jepang" },
  { kana: "にほんじん", word: "日本人", reading: "にほんじん", meaning: "Orang Jepang" },
  { kana: "ありが", word: "ありがとう", reading: "ありがとう", meaning: "Terima kasih" },
  { kana: "ありがとう", word: "有難う", reading: "ありがとう", meaning: "Terima kasih" },
  { kana: "ありがとう", word: "ありがとうございます", reading: "ありがとうございます", meaning: "Terima kasih (sopan)" },
  { kana: "おはよ", word: "おはよう", reading: "おはよう", meaning: "Selamat pagi" },
  { kana: "おはよう", word: "お早う", reading: "おはよう", meaning: "Selamat pagi" },
  { kana: "おはよう", word: "おはようございます", reading: "おはようございます", meaning: "Selamat pagi (sopan)" },
  { kana: "こんにち", word: "こんにちは", reading: "こんにちは", meaning: "Halo / Selamat siang" },
  { kana: "こんにちは", word: "今日は", reading: "こんにちは", meaning: "Selamat siang" },
  { kana: "こんばん", word: "こんばんは", reading: "こんばんは", meaning: "Selamat malam" },
  { kana: "こんばんは", word: "今晩は", reading: "こんばんは", meaning: "Selamat malam" },
  { kana: "おやすみ", word: "お休み", reading: "おやすみ", meaning: "Selamat istirahat" },
  { kana: "すき", word: "好き", reading: "すき", meaning: "Suka" },
  { kana: "だいすき", word: "大好き", reading: "だいすき", meaning: "Sangat suka / Cinta" },
  { kana: "がくせい", word: "学生", reading: "がくせい", meaning: "Siswa / Pelajar" },
  { kana: "だいがくせい", word: "大学生", reading: "だいがくせい", meaning: "Mahasiswa" },
  { kana: "せんせい", word: "先生", reading: "せんせい", meaning: "Guru / Dokter" },
  { kana: "ともだち", word: "友達", reading: "ともだち", meaning: "Teman / Sahabat" },
  { kana: "きょう", word: "今日", reading: "きょう", meaning: "Hari ini" },
  { kana: "あした", word: "明日", reading: "あした", meaning: "Besok" },
  { kana: "きのう", word: "昨日", reading: "きのう", meaning: "Kemarin" },
  { kana: "いま", word: "今", reading: "いま", meaning: "Sekarang" },
  { kana: "たべる", word: "食べる", reading: "たべる", meaning: "Makan" },
  { kana: "たべ", word: "食べます", reading: "たべます", meaning: "Makan (sopan)" },
  { kana: "のむ", word: "飲む", reading: "のむ", meaning: "Minum" },
  { kana: "のみ", word: "飲みます", reading: "のみます", meaning: "Minum (sopan)" },
  { kana: "いく", word: "行く", reading: "いく", meaning: "Pergi" },
  { kana: "いき", word: "行きます", reading: "いきます", meaning: "Pergi (sopan)" },
  { kana: "くる", word: "来る", reading: "くる", meaning: "Datang" },
  { kana: "きま", word: "来ます", reading: "きます", meaning: "Datang (sopan)" },
  { kana: "みる", word: "見る", reading: "みる", meaning: "Melihat / Menonton" },
  { kana: "きく", word: "聞く", reading: "きく", meaning: "Mendengar / Bertanya" },
  { kana: "はなす", word: "話す", reading: "はなす", meaning: "Berbicara" },
  { kana: "よむ", word: "読む", reading: "よむ", meaning: "Membaca" },
  { kana: "かく", word: "書く", reading: "かく", meaning: "Menulis" },
  { kana: "べんきょう", word: "勉強", reading: "べんきょう", meaning: "Belajar" },
  { kana: "がっこう", word: "学校", reading: "がっこう", meaning: "Sekolah" },
  { kana: "だいがく", word: "大学", reading: "だいがく", meaning: "Universitas" },
  { kana: "きょうしつ", word: "教室", reading: "きょうしつ", meaning: "Ruang kelas" },
  { kana: "いえ", word: "家", reading: "いえ", meaning: "Rumah" },
  { kana: "うち", word: "家", reading: "うち", meaning: "Rumah / Tempat tinggal" },
  { kana: "みず", word: "水", reading: "みず", meaning: "Air" },
  { kana: "おちゃ", word: "お茶", reading: "おちゃ", meaning: "Teh" },
  { kana: "ほん", word: "本", reading: "ほん", meaning: "Buku" },
  { kana: "くるま", word: "車", reading: "くるま", meaning: "Mobil" },
  { kana: "でんしゃ", word: "電車", reading: "でんしゃ", meaning: "Kereta listrik" },
  { kana: "えき", word: "駅", reading: "えき", meaning: "Stasiun" },
  { kana: "やま", word: "山", reading: "やま", meaning: "Gunung" },
  { kana: "かわ", word: "川", reading: "かわ", meaning: "Sungai" },
  { kana: "うみ", word: "海", reading: "うみ", meaning: "Laut" },
  { kana: "あめ", word: "雨", reading: "あめ", meaning: "Hujan" },
  { kana: "ゆき", word: "雪", reading: "ゆき", meaning: "Salju" },
  { kana: "はな", word: "花", reading: "はな", meaning: "Bunga" },
  { kana: "さくら", word: "桜", reading: "さくら", meaning: "Bunga Sakura" },
  { kana: "みらい", word: "未来", reading: "みらい", meaning: "Masa depan" },
  { kana: "すみません", word: "済みません", reading: "すみません", meaning: "Permisi / Maaf" },
  { kana: "ごめん", word: "ごめんなさい", reading: "ごめんなさい", meaning: "Mohon maaf" },
  { kana: "だいじょうぶ", word: "大丈夫", reading: "だいじょうぶ", meaning: "Tidak apa-apa" },
  { kana: "げんき", word: "元気", reading: "げんき", meaning: "Sehat / Bersemangat" },
  { kana: "はじめ", word: "初めまして", reading: "はじめまして", meaning: "Senang berkenalan" },
  { kana: "よろしく", word: "宜しく", reading: "よろしく", meaning: "Mohon bantuannya" },
  { kana: "よろしく", word: "よろしくお願いします", reading: "よろしくおねがいします", meaning: "Salam kenal (sopan)" }
];

/**
 * Memastikan data kanji lokal tersedia untuk pencarian kandidat & info kartu kamus
 */
async function ensureKanjiFullData() {
  if (Array.isArray(window.KANJI_FULL_DATA) && window.KANJI_FULL_DATA.length > 0) {
    return window.KANJI_FULL_DATA;
  }
  try {
    const base = window.location.pathname.includes('/kamus/') ? '../' : './';
    const res = await fetch(base + 'data/kanji-index.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        window.KANJI_FULL_DATA = data;
        return data;
      }
    }
  } catch (e) {}
  return [];
}

/**
 * Fetch Terjemahan Online Bebas CORS via Google Translate (client=gtx) dengan AbortController
 */
async function fetchGoogleTranslate(text, sourceLang, targetLang, signal = null) {
  if (!text || !text.trim()) return null;
  const raw = text.trim();
  const cacheKey = `gtx_trans_${sourceLang}_${targetLang}_${raw}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=rm&q=${encodeURIComponent(raw)}`;
    const fetchOptions = signal ? { signal } : {};
    const res = await fetch(url, fetchOptions);
    if (res.ok) {
      const data = await res.json();
      let translated = "";
      let romaji = "";
      if (Array.isArray(data) && Array.isArray(data[0])) {
        // Gabungkan SELURUH segmen kalimat pada data[0]
        translated = data[0]
          .filter(item => item && typeof item[0] === "string")
          .map(item => item[0])
          .join("");

        // Ekstraksi pelafalan Romaji dari segmen dt=rm (biasanya di item[3] atau item[2])
        data[0].forEach((item) => {
          if (item && Array.isArray(item)) {
            if (typeof item[3] === "string" && item[3].trim() && /[a-zA-Z]/.test(item[3])) {
              romaji += (romaji ? " " : "") + item[3].trim();
            } else if (typeof item[2] === "string" && item[2].trim() && /[a-zA-Z]/.test(item[2]) && !item[0]) {
              romaji += (romaji ? " " : "") + item[2].trim();
            }
          }
        });
      }
      if (translated.trim()) {
        const result = { text: translated.trim(), romaji: romaji.trim() };
        try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (e) {}
        return result;
      }
    }
  } catch (err) {
    if (err && err.name === "AbortError") {
      return null; // Dibatalkan oleh input ketikan berikutnya
    }
    console.warn("Google Translate fetch error:", err);
  }

  // Fallback Online: MyMemory Translation API
  try {
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(raw)}&langpair=${sourceLang}|${targetLang}`;
    const mmRes = await fetch(mmUrl, signal ? { signal } : {});
    if (mmRes.ok) {
      const mmData = await mmRes.json();
      const mmTrans = mmData?.responseData?.translatedText;
      if (mmTrans && typeof mmTrans === "string" && mmTrans.toLowerCase() !== raw.toLowerCase()) {
        const clean = mmTrans.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
        const result = { text: clean, romaji: "" };
        try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (e) {}
        return result;
      }
    }
  } catch (mmErr) {
    if (mmErr && mmErr.name === "AbortError") return null;
  }

  return null;
}

/**
 * Terjemahan Utama Studio: Google Translate Online -> Fallback Offline
 */
async function translateStudioText(text, direction, signal = null) {
  const dictionary = direction === "ja-id" ? jaToIdDictionary : idToJaDictionary;
  const result = await window.MiraiTranslateService.translate(text, direction, { signal, dictionary });
  return {
    text: result.text,
    romaji: direction === "id-ja" ? getRomajiReading(result.text) : getRomajiReading(text),
    provider: result.provider
  };
}

// =========================================================================
// 6. KONTROLER UTAMA STUDIO TRANSLATOR & GBOARD 12-KEY KEYBOARD
// =========================================================================
function initStudioTranslator() {
  const studio = document.getElementById('studio-terjemahan');
  if (!studio) return;

  const adaptiveDirectionBadge = document.getElementById('adaptiveDirectionBadge');
  const adaptiveDirectionText = document.getElementById('adaptiveDirectionText');

  const sourceFlag = document.getElementById('sourceFlag');
  const sourceName = document.getElementById('sourceName');
  const targetFlag = document.getElementById('targetFlag');
  const targetName = document.getElementById('targetName');

  const textarea = document.getElementById('translatorInput');
  const outputEl = document.getElementById('translatorOutput');
  const romajiEl = document.getElementById('translatorRomaji');
  const localDictBox = document.getElementById('translatorLocalDictBox');
  const statusEl = document.getElementById('translationStatus');
  const inputHint = document.getElementById('inputHint');
  const charCount = document.getElementById('inputCharCount');

  const listenInputBtn = document.getElementById('listenInputBtn');
  const listenInputSlowBtn = document.getElementById('listenInputSlowBtn');
  const listenOutputBtn = document.getElementById('listenOutputBtn');
  const listenOutputSlowBtn = document.getElementById('listenOutputSlowBtn');
  const copyInputBtn = document.getElementById('copyInputBtn');
  const copyOutputBtn = document.getElementById('copyOutputBtn');
  const clearInputBtn = document.getElementById('clearInputBtn');

  const toggleKeyboardBtn = document.getElementById('toggleKeyboardBtn');
  const keyboardPanel = document.getElementById('virtualKeyboardPanel');
  const keyboardToggleText = document.getElementById('keyboardToggleText');
  const kbCloseBtn = document.getElementById('kbCloseBtn');
  const kbQuickCloseBtn = document.getElementById('kbQuickCloseBtn');

  const autoRomajiImeBtn = document.getElementById('autoRomajiImeBtn');
  const imeStatusText = document.getElementById('imeStatusText');

  const candidateBar = document.getElementById('gboardCandidateBar');

  const kbScriptHiraganaBtn = document.getElementById('kbScriptHiraganaBtn');
  const kbScriptKatakanaBtn = document.getElementById('kbScriptKatakanaBtn');
  const kbScriptNumberBtn = document.getElementById('kbScriptNumberBtn');
  const kbScriptToggleBtn = document.getElementById('kbScriptToggleBtn');
  const kbQuickNumBtn = document.getElementById('kbQuickNumBtn');
  const kbToggleRomajiBtn = document.getElementById('kbToggleRomajiBtn');
  const kbRomajiStatusText = document.getElementById('kbRomajiStatusText');

  const kbDakutenBtn = document.getElementById('kbDakutenBtn');
  const kbSpaceBtn = document.getElementById('kbSpaceBtn');
  const kbBackspaceBtn = document.getElementById('kbBackspaceBtn');
  const kbEnterBtn = document.getElementById('kbEnterBtn');
  const kbTranslateNowBtn = document.getElementById('kbTranslateNowBtn');

  let activeDirection = 'ja-id';
  let activeScript = 'hiragana';
  let isAutoRomajiOn = true;
  let translateDebounceTimer = null;
  let currentTranslationAbortCtrl = null;
  let hasSuccessfulTranslation = false;

  // Gboard multi-tap & flick state
  let lastTapGroup = null;
  let lastTapIndex = 0;
  let lastTapTime = 0;
  let lastInsertedLength = 0;
  let tapCycleTimer = null;

  let activeFlickKey = null;
  let flickStartX = 0;
  let flickStartY = 0;
  let activeFlickDir = null;
  let currentFlickOverlay = null;

  // Pastikan dataset kanji siap dimuat
  ensureKanjiFullData();

  function removeAllFlickCrosses() {
    document.querySelectorAll('.gboard-flick-cross').forEach(el => el.remove());
    currentFlickOverlay = null;
    activeFlickKey = null;
    activeFlickDir = null;
  }

  function commitPendingTap() {
    clearTimeout(tapCycleTimer);
    lastTapGroup = null;
    lastTapIndex = 0;
    lastInsertedLength = 0;
    removeAllFlickCrosses();
  }

  function applyMobileKeyboardGuard() {
    if (!textarea) return;
    const isKbOpen = keyboardPanel && !keyboardPanel.classList.contains('is-collapsed');
    if (isKbOpen) {
      textarea.setAttribute('inputmode', 'none');
    } else {
      textarea.removeAttribute('inputmode');
    }
  }

  function insertTextAtCursor(charToInsert) {
    if (!textarea) return;
    applyMobileKeyboardGuard();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    textarea.value = currentVal.substring(0, start) + charToInsert + currentVal.substring(end);
    const newPos = start + charToInsert.length;
    textarea.selectionStart = newPos;
    textarea.selectionEnd = newPos;
    lastInsertedLength = charToInsert.length;

    try { textarea.focus({ preventScroll: true }); } catch (e) { textarea.focus(); }
    triggerInputUpdate();
    window.MiraiSound?.playClickIfIdle();
  }

  function replaceTextAtCursor(newChar) {
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const len = lastInsertedLength || 1;
    if (pos < len) {
      insertTextAtCursor(newChar);
      return;
    }
    textarea.value = textarea.value.slice(0, pos - len) + newChar + textarea.value.slice(pos);
    const newPos = pos - len + newChar.length;
    textarea.selectionStart = newPos;
    textarea.selectionEnd = newPos;
    lastInsertedLength = newChar.length;
    try { textarea.focus({ preventScroll: true }); } catch (e) {}
    triggerInputUpdate();
    window.MiraiSound?.playClickIfIdle();
  }

  function backspaceAtCursor() {
    if (!textarea) return;
    applyMobileKeyboardGuard();
    commitPendingTap();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    if (start === end) {
      if (start > 0) {
        textarea.value = currentVal.substring(0, start - 1) + currentVal.substring(end);
        textarea.selectionStart = start - 1;
        textarea.selectionEnd = start - 1;
      }
    } else {
      textarea.value = currentVal.substring(0, start) + currentVal.substring(end);
      textarea.selectionStart = start;
      textarea.selectionEnd = start;
    }

    try { textarea.focus({ preventScroll: true }); } catch (e) {}
    triggerInputUpdate();
    window.MiraiSound?.playClickIfIdle();
  }

  function getGroupData(groupKey) {
    const mode = activeScript in GBOARD_12KEY_DATA ? activeScript : 'hiragana';
    return GBOARD_12KEY_DATA[mode]?.[groupKey] || GBOARD_12KEY_DATA.hiragana[groupKey];
  }

  function createFlickCross(wrap, groupData) {
    removeAllFlickCrosses();
    const chars = groupData.chars;
    const cross = document.createElement('div');
    cross.className = 'gboard-flick-cross';
    cross.innerHTML = `
      <div class="flick-petal flick-center is-active">${chars[0] || ''}</div>
      <div class="flick-petal flick-left">${chars[1] || ''}</div>
      <div class="flick-petal flick-top">${chars[2] || ''}</div>
      <div class="flick-petal flick-right">${chars[3] || ''}</div>
      <div class="flick-petal flick-bottom">${chars[4] || ''}</div>
    `;
    wrap.appendChild(cross);
    currentFlickOverlay = cross;
    return cross;
  }

  function updateFlickHighlight(dir) {
    if (!currentFlickOverlay) return;
    currentFlickOverlay.querySelectorAll('.flick-petal').forEach(p => p.classList.remove('is-active'));
    const targetClass = dir ? `.flick-${dir}` : '.flick-center';
    const target = currentFlickOverlay.querySelector(targetClass);
    if (target) target.classList.add('is-active');
  }

  // Update Tampilan Bar Prediksi Kandidat Kata & Kanji
  function updateCandidateBar() {
    if (!candidateBar) return;
    candidateBar.replaceChildren();

    const text = textarea ? textarea.value : '';
    const cursorPos = textarea ? textarea.selectionStart : 0;
    const textBefore = text.slice(0, cursorPos);
    const match = textBefore.match(/[\u3040-\u309F\u30A0-\u30FFー々]+$/);

    const candidates = [];
    const seen = new Set();

    function addCandidate(word, reading, meaning) {
      if (!word || seen.has(word)) return;
      seen.add(word);
      candidates.push({ word, reading: reading || '', meaning: meaning || '' });
    }

    if (match) {
      const query = match[0];
      // 1. Cari di kamus frasa populer
      POPULAR_PREDICTIONS.forEach(p => {
        if (p.kana.startsWith(query) || p.reading.startsWith(query) || p.word.startsWith(query)) {
          addCandidate(p.word, p.reading, p.meaning);
        }
      });

      // 2. Cari di database KANJI_FULL_DATA lokal
      if (Array.isArray(window.KANJI_FULL_DATA)) {
        for (const k of window.KANJI_FULL_DATA) {
          if (candidates.length >= 10) break;
          const kunMatch = Array.isArray(k.kunyomi) && k.kunyomi.some(r => r.replace(/\./g, '').startsWith(query));
          const onMatch = Array.isArray(k.onyomi) && k.onyomi.some(r => r.startsWith(query));
          if (kunMatch || onMatch) {
            addCandidate(k.kanji, (k.kunyomi && k.kunyomi[0]) || (k.onyomi && k.onyomi[0]), k.meaning);
          }
        }
      }

      // 3. Fallback kata Kana mentah itu sendiri
      addCandidate(query, query, 'Kana Asli');
    } else {
      // Saran cepat frasa populer saat textarea kosong
      const defaults = [
        { word: "こんにちは", reading: "こんにちは", meaning: "Halo" },
        { word: "ありがとう", reading: "ありがとう", meaning: "Terima kasih" },
        { word: "すみません", reading: "すみません", meaning: "Maaf/Permisi" },
        { word: "はい", reading: "はい", meaning: "Ya" },
        { word: "いいえ", reading: "いいえ", meaning: "Tidak" },
        { word: "よろしくお願いします", reading: "よろしく", meaning: "Salam kenal" }
      ];
      defaults.forEach(d => addCandidate(d.word, d.reading, d.meaning));
    }

    candidates.slice(0, 10).forEach(c => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'gboard-candidate-chip';
      chip.innerHTML = `
        <span class="candidate-main">${c.word}</span>
        <span class="candidate-sub">${c.reading ? c.reading + ' · ' : ''}${c.meaning}</span>
      `;
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        commitPendingTap();
        const curText = textarea ? textarea.value : '';
        const curPos = textarea ? textarea.selectionStart : 0;
        const textBefore = curText.slice(0, curPos);
        const curMatch = textBefore.match(/[\u3040-\u309F\u30A0-\u30FFー々]+$/);
        if (curMatch) {
          const startIdx = curPos - curMatch[0].length;
          textarea.value = curText.slice(0, startIdx) + c.word + curText.slice(curPos);
          const newPos = startIdx + c.word.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
        } else {
          insertTextAtCursor(c.word);
        }
        try { textarea.focus({ preventScroll: true }); } catch (err) {}
        triggerInputUpdate(true);
        window.MiraiSound?.playClickIfIdle();
        window.speakText && window.speakText(c.word, 'ja-JP');
        updateCandidateBar();
      });
      candidateBar.appendChild(chip);
    });
  }

  // Update Kartu Info Kamus Lokal (#translatorLocalDictBox)
  async function updateLocalDictCard(text) {
    if (!localDictBox) return;
    const clean = text.trim();
    if (!clean || clean.length > 8 || /\s/.test(clean)) {
      localDictBox.hidden = true;
      localDictBox.replaceChildren();
      return;
    }

    await ensureKanjiFullData();
    const kanjiList = Array.isArray(window.KANJI_FULL_DATA) ? window.KANJI_FULL_DATA : [];

    // Cari kecocokan Kanji atau Kunyomi/Onyomi
    let match = kanjiList.find(k => k.kanji === clean);
    if (!match) {
      match = kanjiList.find(k => (k.kunyomi && k.kunyomi.includes(clean)) || (k.onyomi && k.onyomi.includes(clean)));
    }

    const dictWord = jaToIdDictionary[clean] || idToJaDictionary[clean];
    const popWord = POPULAR_PREDICTIONS.find(p => p.word === clean || p.kana === clean);

    if (!match && !dictWord && !popWord) {
      localDictBox.hidden = true;
      localDictBox.replaceChildren();
      return;
    }

    const charToShow = match ? match.kanji : (popWord?.word || clean);
    const meaningToShow = match ? match.meaning : (popWord?.meaning || dictWord);
    const readingToShow = match ? `Kunyomi: ${match.kunyomi || '-'} · Onyomi: ${match.onyomi || '-'}` : (popWord ? popWord.reading : '');

    localDictBox.innerHTML = `
      <div class="local-dict-head">
        <span class="local-dict-icon">📚</span>
        <span class="local-dict-title">Info Kamus Lokal (Kanji/Kana)</span>
        ${match?.level ? `<span class="local-dict-badge">${match.level} · ${match.jlpt || 'JLPT'}</span>` : ''}
      </div>
      <div class="local-dict-body">
        <div class="local-dict-kanji-preview">
          <span class="local-dict-char">${charToShow}</span>
          <div class="local-dict-details">
            <div class="local-dict-meaning"><strong>Arti:</strong> ${meaningToShow}</div>
            ${readingToShow ? `<div class="local-dict-reading"><strong>Bacaan:</strong> ${readingToShow}</div>` : ''}
            ${match?.strokes ? `<div class="local-dict-meta"><strong>Goresan:</strong> ${match.strokes} goresan</div>` : ''}
          </div>
        </div>
      </div>
    `;
    localDictBox.hidden = false;
  }

  function updateGboardKeyLabels() {
    const mode = activeScript in GBOARD_12KEY_DATA ? activeScript : 'hiragana';
    const groups = GBOARD_12KEY_DATA[mode];
    studio.querySelectorAll('[data-gboard-key]').forEach((btn) => {
      const k = btn.dataset.gboardKey;
      if (groups[k]) {
        const mainEl = btn.querySelector('.gboard-main-char');
        const subEl = btn.querySelector('.gboard-sub-chars');
        if (mainEl) mainEl.textContent = groups[k].main;
        if (subEl) subEl.textContent = groups[k].sub;
      }
    });
  }

  // Pointer Event Binding untuk Gboard 12-Key (Multi-Tap & 4-Way Cross Flick)
  studio.querySelectorAll('.gboard-key-wrapper[data-key-group]').forEach((wrap) => {
    const groupKey = wrap.dataset.keyGroup;
    const btn = wrap.querySelector('.gboard-btn');
    if (!btn) return;

    btn.addEventListener('pointerdown', (e) => {
      applyMobileKeyboardGuard();
      const groupData = getGroupData(groupKey);
      if (!groupData) return;

      activeFlickKey = groupKey;
      flickStartX = e.clientX;
      flickStartY = e.clientY;
      activeFlickDir = null;

      createFlickCross(wrap, groupData);
      try { btn.setPointerCapture?.(e.pointerId); } catch (err) {}
    });

    btn.addEventListener('pointermove', (e) => {
      if (activeFlickKey !== groupKey || !currentFlickOverlay) return;
      const dx = e.clientX - flickStartX;
      const dy = e.clientY - flickStartY;
      const dist = Math.hypot(dx, dy);

      if (dist > 18) {
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        let dir = 'left';
        if (angle >= -45 && angle < 45) dir = 'right';
        else if (angle >= 45 && angle < 135) dir = 'bottom';
        else if (angle >= -135 && angle < -45) dir = 'top';
        else dir = 'left';

        activeFlickDir = dir;
        updateFlickHighlight(dir);
      } else {
        activeFlickDir = null;
        updateFlickHighlight(null);
      }
    });

    const handlePointerUp = (e) => {
      try {
        if (btn.hasPointerCapture && btn.hasPointerCapture(e.pointerId)) {
          btn.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      if (activeFlickKey !== groupKey) {
        removeAllFlickCrosses();
        return;
      }
      const groupData = getGroupData(groupKey);
      const chars = groupData ? groupData.chars : [];
      const flickDir = activeFlickDir;

      removeAllFlickCrosses();

      if (flickDir && chars.length) {
        // FLICK DETECTED: Masukkan karakter arah yang digeser
        commitPendingTap();
        let charToInsert = chars[0];
        if (flickDir === 'left' && chars[1]) charToInsert = chars[1];
        else if (flickDir === 'top' && chars[2]) charToInsert = chars[2];
        else if (flickDir === 'right' && chars[3]) charToInsert = chars[3];
        else if (flickDir === 'bottom' && chars[4]) charToInsert = chars[4];

        insertTextAtCursor(charToInsert);
        window.speakText && window.speakText(charToInsert, 'ja-JP');
        updateCandidateBar();
      } else {
        // MULTI-TAP DETECTED: Langsung sisipkan huruf tanpa jeda (0 delay)
        const now = Date.now();
        if (lastTapGroup === groupKey && (now - lastTapTime < 850)) {
          lastTapIndex = (lastTapIndex + 1) % chars.length;
          const nextChar = chars[lastTapIndex];
          replaceTextAtCursor(nextChar);
          window.speakText && window.speakText(nextChar, 'ja-JP');
        } else {
          commitPendingTap();
          lastTapGroup = groupKey;
          lastTapIndex = 0;
          const firstChar = chars[0];
          insertTextAtCursor(firstChar);
          window.speakText && window.speakText(firstChar, 'ja-JP');
        }
        lastTapTime = now;
        clearTimeout(tapCycleTimer);
        tapCycleTimer = setTimeout(() => {
          commitPendingTap();
        }, 850);
        updateCandidateBar();
      }
    };

    btn.addEventListener('pointerup', handlePointerUp);
    btn.addEventListener('pointercancel', (e) => {
      try {
        if (btn.hasPointerCapture && btn.hasPointerCapture(e.pointerId)) {
          btn.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
      removeAllFlickCrosses();
    });
    btn.addEventListener('mouseleave', () => {
      if (!activeFlickKey) removeAllFlickCrosses();
    });
  });

  // Global window safety guards to ensure flick cross is 100% removed
  window.addEventListener('pointerup', () => {
    if (currentFlickOverlay) removeAllFlickCrosses();
  }, { passive: true });
  window.addEventListener('pointercancel', () => {
    if (currentFlickOverlay) removeAllFlickCrosses();
  }, { passive: true });
  window.addEventListener('blur', () => {
    if (currentFlickOverlay) removeAllFlickCrosses();
  });

  // Tombol Modifikasi Pintar [ ゛゜小 ]
  if (kbDakutenBtn) {
    kbDakutenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      applyMobileKeyboardGuard();
      commitPendingTap();
      const pos = textarea.selectionStart;
      if (pos > 0) {
        const prevChar = textarea.value[pos - 1];
        if (DAKUTEN_CYCLE_MAP[prevChar]) {
          const transformed = DAKUTEN_CYCLE_MAP[prevChar];
          textarea.value = textarea.value.slice(0, pos - 1) + transformed + textarea.value.slice(pos);
          textarea.selectionStart = pos;
          textarea.selectionEnd = pos;
          try { textarea.focus({ preventScroll: true }); } catch (err) {}
          triggerInputUpdate();
          window.MiraiSound?.playClickIfIdle();
          window.speakText && window.speakText(transformed, 'ja-JP');
          updateCandidateBar();
          return;
        }
      }
      window.MiraiSound?.playClickIfIdle();
    });
  }

  // Tombol Backspace Pintar: Klik 1x atau Tahan >400ms hapus beruntun 80ms
  if (kbBackspaceBtn) {
    let backspaceHoldTimer = null;
    let backspaceInterval = null;

    function clearBackspaceTimers() {
      clearTimeout(backspaceHoldTimer);
      clearInterval(backspaceInterval);
      backspaceHoldTimer = null;
      backspaceInterval = null;
    }

    kbBackspaceBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      applyMobileKeyboardGuard();
      commitPendingTap();
      backspaceAtCursor();
      updateCandidateBar();

      clearBackspaceTimers();
      backspaceHoldTimer = setTimeout(() => {
        backspaceInterval = setInterval(() => {
          backspaceAtCursor();
          updateCandidateBar();
        }, 80);
      }, 400);
    });

    kbBackspaceBtn.addEventListener('pointerup', clearBackspaceTimers);
    kbBackspaceBtn.addEventListener('pointercancel', clearBackspaceTimers);
    kbBackspaceBtn.addEventListener('mouseleave', clearBackspaceTimers);
    window.addEventListener('pointerup', clearBackspaceTimers, { passive: true });
    window.addEventListener('pointercancel', clearBackspaceTimers, { passive: true });
  }

  if (kbSpaceBtn) {
    kbSpaceBtn.addEventListener('click', () => {
      commitPendingTap();
      insertTextAtCursor(' ');
      updateCandidateBar();
    });
  }

  if (kbEnterBtn) {
    kbEnterBtn.addEventListener('click', () => {
      commitPendingTap();
      insertTextAtCursor('\n');
      updateCandidateBar();
    });
  }



  // Mode Switching
  function setScriptMode(mode) {
    activeScript = mode;
    if (kbScriptHiraganaBtn) kbScriptHiraganaBtn.classList.toggle('is-active', mode === 'hiragana');
    if (kbScriptKatakanaBtn) kbScriptKatakanaBtn.classList.toggle('is-active', mode === 'katakana');
    if (kbScriptNumberBtn) kbScriptNumberBtn.classList.toggle('is-active', mode === 'number');
    updateGboardKeyLabels();
    applyMobileKeyboardGuard();
    updateCandidateBar();
  }

  if (kbScriptHiraganaBtn) kbScriptHiraganaBtn.addEventListener('click', () => { setScriptMode('hiragana'); window.MiraiSound?.playClickIfIdle(); });
  if (kbScriptKatakanaBtn) kbScriptKatakanaBtn.addEventListener('click', () => { setScriptMode('katakana'); window.MiraiSound?.playClickIfIdle(); });
  if (kbScriptNumberBtn) kbScriptNumberBtn.addEventListener('click', () => { setScriptMode('number'); window.MiraiSound?.playClickIfIdle(); });

  if (kbScriptToggleBtn) {
    kbScriptToggleBtn.addEventListener('click', () => {
      const nextMode = activeScript === 'hiragana' ? 'katakana' : (activeScript === 'katakana' ? 'number' : 'hiragana');
      setScriptMode(nextMode);
      window.MiraiSound?.playClickIfIdle();
    });
  }

  if (kbQuickNumBtn) {
    kbQuickNumBtn.addEventListener('click', () => {
      setScriptMode(activeScript === 'number' ? 'hiragana' : 'number');
      window.MiraiSound?.playClickIfIdle();
    });
  }

  // Toggle Virtual Keyboard Panel (Floating Window)
  function setKeyboardCollapsed(collapsed) {
    if (!keyboardPanel) return;
    commitPendingTap();
    removeAllFlickCrosses();
    keyboardPanel.classList.toggle('is-collapsed', collapsed);
    keyboardPanel.classList.toggle('is-open', !collapsed);
    if (toggleKeyboardBtn) {
      toggleKeyboardBtn.setAttribute('aria-expanded', String(!collapsed));
    }
    if (keyboardToggleText) {
      keyboardToggleText.textContent = collapsed
        ? 'Virtual Keyboard'
        : 'Tutup Keyboard ▴';
    }

    if (collapsed) {
      textarea.removeAttribute('inputmode');
    } else {
      textarea.setAttribute('inputmode', 'none');
      updateGboardKeyLabels();
      updateCandidateBar();
      if (typeof window.ensureKeyboardInView === 'function') {
        window.ensureKeyboardInView();
      }
    }
  }

  if (toggleKeyboardBtn) {
    toggleKeyboardBtn.addEventListener('click', () => {
      const isNowCollapsed = !keyboardPanel.classList.contains('is-collapsed');
      setKeyboardCollapsed(isNowCollapsed);
      window.MiraiSound?.playClickIfIdle();
    });
  }

  if (kbCloseBtn) {
    kbCloseBtn.addEventListener('click', () => {
      setKeyboardCollapsed(true);
      window.MiraiSound?.playClickIfIdle();
    });
  }

  if (kbQuickCloseBtn) {
    kbQuickCloseBtn.addEventListener('click', () => {
      setKeyboardCollapsed(true);
      window.MiraiSound?.playClickIfIdle();
    });
  }

  function updateRomajiToggleState() {
    if (autoRomajiImeBtn) {
      autoRomajiImeBtn.classList.toggle('is-active', isAutoRomajiOn);
      autoRomajiImeBtn.classList.toggle('is-off', !isAutoRomajiOn);
    }
    if (imeStatusText) {
      imeStatusText.textContent = isAutoRomajiOn ? 'Auto-Romaji: ON ✨' : 'Auto-Romaji: OFF';
    }
    if (kbToggleRomajiBtn) {
      kbToggleRomajiBtn.classList.toggle('is-active', isAutoRomajiOn);
    }
    if (kbRomajiStatusText) {
      kbRomajiStatusText.textContent = isAutoRomajiOn ? 'Romaji ON' : 'Romaji OFF';
    }
  }

  if (autoRomajiImeBtn) {
    autoRomajiImeBtn.addEventListener('click', () => {
      isAutoRomajiOn = !isAutoRomajiOn;
      updateRomajiToggleState();
      window.MiraiSound?.playClickIfIdle();
    });
  }

  if (kbToggleRomajiBtn) {
    kbToggleRomajiBtn.addEventListener('click', () => {
      isAutoRomajiOn = !isAutoRomajiOn;
      updateRomajiToggleState();
      window.MiraiSound?.playClickIfIdle();
    });
  }

  // Arah terjemahan dikendalikan tombol; input hanya memperbarui penghitung dan kamus lokal.
  function setDirectionUI(direction) {
    activeDirection = direction;
    const isJapaneseInput = direction === "ja-id";
    if (sourceFlag) sourceFlag.textContent = isJapaneseInput ? "🇯🇵" : "🇮🇩";
    if (sourceName) sourceName.textContent = isJapaneseInput ? "Jepang (Input)" : "Indonesia (Input)";
    if (targetFlag) targetFlag.textContent = isJapaneseInput ? "🇮🇩" : "🇯🇵";
    if (targetName) targetName.textContent = isJapaneseInput ? "Indonesia (Hasil)" : "Jepang (Hasil)";
    if (adaptiveDirectionText) {
      adaptiveDirectionText.textContent = isJapaneseInput
        ? "🇯🇵 Jepang → 🇮🇩 Indonesia"
        : "🇮🇩 Indonesia → 🇯🇵 Jepang";
    }
    if (textarea) {
      textarea.placeholder = isJapaneseInput
        ? "Ketik teks bahasa Jepang atau Romaji untuk diterjemahkan ke bahasa Indonesia..."
        : "Ketik teks bahasa Indonesia untuk diterjemahkan ke bahasa Jepang...";
    }
    if (inputHint) {
      inputHint.textContent = isJapaneseInput
        ? "Romaji otomatis aktif untuk arah Jepang → Indonesia."
        : "Romaji tetap sebagai teks Latin pada arah Indonesia → Jepang.";
    }
    if (!isJapaneseInput && imeStatusText) imeStatusText.textContent = "Auto-Romaji: nonaktif pada arah Indonesia";
    else updateRomajiToggleState();
  }

  function triggerInputUpdate() {
    const text = textarea.value;
    hasSuccessfulTranslation = false;
    if (currentTranslationAbortCtrl) currentTranslationAbortCtrl.abort();
    if (charCount) charCount.textContent = text.length + " karakter";
    if (outputEl) {
      outputEl.textContent = "Hasil terjemahan akan muncul setelah menekan Terjemahkan.";
      outputEl.classList.add("placeholder");
    }
    if (romajiEl) romajiEl.hidden = true;
    const providerBadge = document.getElementById("translationProviderBadge");
    if (providerBadge) providerBadge.textContent = "Belum diterjemahkan";
    if (!text.trim()) {
      if (localDictBox) {
        localDictBox.hidden = true;
        localDictBox.replaceChildren();
      }
      if (statusEl) statusEl.textContent = "Siap menerjemahkan";
      updateCandidateBar();
      return;
    }
    if (statusEl) statusEl.textContent = "Siap diterjemahkan";
    updateLocalDictCard(text);
    updateCandidateBar();
  }

  function flushRomaji() {
    if (isAutoRomajiOn && activeDirection === "ja-id") {
      window.MiraiKana?.flushAtCursor(textarea, activeDirection);
    }
    triggerInputUpdate();
  }

  async function runManualTranslation() {
    flushRomaji();
    const text = textarea.value.trim();
    if (!text) {
      if (statusEl) statusEl.textContent = "Masukkan teks terlebih dahulu.";
      return;
    }
    if (currentTranslationAbortCtrl) currentTranslationAbortCtrl.abort();
    currentTranslationAbortCtrl = new AbortController();
    const request = currentTranslationAbortCtrl;
    if (statusEl) statusEl.textContent = "Menerjemahkan...";
    const providerBadge = document.getElementById("translationProviderBadge");
    if (providerBadge) providerBadge.textContent = "Mencoba layanan terjemahan...";
    try {
      const result = await translateStudioText(text, activeDirection, request.signal);
      if (request !== currentTranslationAbortCtrl) return;
      outputEl.textContent = result.text;
      outputEl.classList.remove("placeholder");
      hasSuccessfulTranslation = true;
      if (romajiEl) {
        romajiEl.textContent = result.romaji && result.romaji !== result.text
          ? "(Romaji: " + result.romaji + ")" : "";
        romajiEl.hidden = !result.romaji || result.romaji === result.text;
      }
      if (providerBadge) providerBadge.textContent = result.provider;
      if (statusEl) statusEl.textContent = "Terjemahan selesai";
    } catch (error) {
      if (error?.name === "AbortError") return;
      const message = error?.message || "Layanan terjemahan sedang tidak tersedia.";
      outputEl.textContent = message;
      outputEl.classList.remove("placeholder");
      hasSuccessfulTranslation = false;
      if (romajiEl) romajiEl.hidden = true;
      if (statusEl) statusEl.textContent = "Gagal. Periksa koneksi lalu tekan Terjemahkan lagi.";
      if (providerBadge) providerBadge.textContent = "Tidak ada penyedia yang berhasil";
    }
  }

  const translateButton = document.getElementById("translateButton");
  const swapButton = document.getElementById("translatorSwapBtn");
  if (translateButton) translateButton.addEventListener("click", runManualTranslation);
  if (swapButton) {
    swapButton.addEventListener("click", () => {
      const oldOutput = hasSuccessfulTranslation && outputEl && !outputEl.classList.contains("placeholder")
        ? outputEl.textContent.trim() : "";
      setDirectionUI(activeDirection === "ja-id" ? "id-ja" : "ja-id");
      if (oldOutput) textarea.value = oldOutput;
      if (outputEl) {
        outputEl.textContent = "Hasil terjemahan akan muncul setelah menekan Terjemahkan.";
        outputEl.classList.add("placeholder");
      }
      if (document.getElementById("translationProviderBadge")) {
        document.getElementById("translationProviderBadge").textContent = "Pilih Terjemahkan untuk memulai";
      }
      triggerInputUpdate();
      if (oldOutput) runManualTranslation();
    });
  }
  if (kbTranslateNowBtn) kbTranslateNowBtn.addEventListener("click", () => {
    commitPendingTap();
    runManualTranslation();
    window.MiraiSound?.playClickIfIdle();
  });
  if (textarea) {
    textarea.addEventListener("input", (event) => {
      if (isAutoRomajiOn && activeDirection === "ja-id") {
        window.MiraiKana?.convertAtCursor(textarea, {
          inputType: event.inputType,
          isComposing: event.isComposing,
          direction: activeDirection
        });
      }
      triggerInputUpdate();
    });
    textarea.addEventListener("compositionend", () => triggerInputUpdate());
    textarea.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        runManualTranslation();
      } else if (event.key === " " || event.key === "Enter") {
        flushRomaji();
      }
    });
    textarea.addEventListener("blur", flushRomaji);
  }
  textarea.addEventListener('focus', () => {
    applyMobileKeyboardGuard();
  });

  textarea.addEventListener('pointerdown', () => {
    applyMobileKeyboardGuard();
    commitPendingTap();
  });

  textarea.addEventListener('keydown', () => {
    commitPendingTap();
  });

  textarea.addEventListener('click', () => {
    commitPendingTap();
  });

  // Audio Buttons (Adaptif sesuai bahasa terdeteksi)
  if (listenInputBtn) {
    listenInputBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) return;
      window.speakText(text, activeDirection === 'ja-id' ? 'ja-JP' : 'id-ID', false);
    });
  }
  if (listenInputSlowBtn) {
    listenInputSlowBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) return;
      window.speakText(text, activeDirection === 'ja-id' ? 'ja-JP' : 'id-ID', true);
    });
  }

  if (listenOutputBtn) {
    listenOutputBtn.addEventListener('click', () => {
      if (outputEl.classList.contains('placeholder')) return;
      const text = outputEl.textContent.trim();
      if (!text) return;
      window.speakText(text, activeDirection === 'ja-id' ? 'id-ID' : 'ja-JP', false);
    });
  }
  if (listenOutputSlowBtn) {
    listenOutputSlowBtn.addEventListener('click', () => {
      if (outputEl.classList.contains('placeholder')) return;
      const text = outputEl.textContent.trim();
      if (!text) return;
      window.speakText(text, activeDirection === 'ja-id' ? 'id-ID' : 'ja-JP', true);
    });
  }

  function copyWithFeedback(text, buttonEl) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const orig = buttonEl.innerHTML;
      buttonEl.innerHTML = '<span>✓ Tersalin!</span>';
      buttonEl.classList.add('btn-copied');
      setTimeout(() => {
        buttonEl.innerHTML = orig;
        buttonEl.classList.remove('btn-copied');
      }, 1800);
    }).catch(() => {
      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    });
  }

  if (copyInputBtn) copyInputBtn.addEventListener('click', () => copyWithFeedback(textarea.value, copyInputBtn));
  if (copyOutputBtn) copyOutputBtn.addEventListener('click', () => {
    if (!outputEl.classList.contains('placeholder')) copyWithFeedback(outputEl.textContent, copyOutputBtn);
  });
  if (clearInputBtn) {
    clearInputBtn.addEventListener('click', () => {
      textarea.value = '';
      commitPendingTap();
      triggerInputUpdate();
      try { textarea.focus(); } catch (e) {}
      window.MiraiSound?.playClickIfIdle();
    });
  }

  updateGboardKeyLabels();
  initKeyboardDragAndResize();
}

// =========================================================================
// FITUR KEYBOARD MELAYANG: DRAGGABLE & RESIZABLE DENGAN VIEWPORT BOUNDARIES
// =========================================================================
function initKeyboardDragAndResize() {
  const kb = document.getElementById('virtualKeyboardPanel');
  const dragHandle = document.getElementById('kbDragHandle');
  const headerHandle = document.getElementById('kbHeaderDrag') || document.querySelector('.keyboard-header');
  const resizeHandle = document.getElementById('kbResizeHandle');
  if (!kb) return;

  let isDragging = false;
  let isResizing = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;
  let startWidth = 0, startHeight = 0;
  let hasCustomPosition = false;

  function clampPosition(left, top) {
    const pad = 8;
    const rect = kb.getBoundingClientRect();
    const minX = pad;
    const maxX = Math.max(pad, window.innerWidth - rect.width - pad);
    const minY = pad;
    const maxY = Math.max(pad, window.innerHeight - rect.height - pad);

    const clampedX = Math.max(minX, Math.min(left, maxX));
    const clampedY = Math.max(minY, Math.min(top, maxY));
    return { x: clampedX, y: clampedY };
  }

  function clampSize(w, h) {
    const minW = Math.min(310, window.innerWidth - 16);
    const maxW = Math.min(760, window.innerWidth - 16);
    const minH = 210;
    const maxH = Math.min(680, window.innerHeight - 20);

    const clampedW = Math.max(minW, Math.min(w, maxW));
    const clampedH = Math.max(minH, Math.min(h, maxH));
    return { w: clampedW, h: clampedH };
  }

  function onDragStart(e) {
    if (e.target.closest('button') || e.target.closest('.kb-mode-pill-group')) return;
    isDragging = true;
    kb.classList.add('is-dragging');

    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    startX = clientX;
    startY = clientY;

    const rect = kb.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    kb.style.transform = 'none';
    kb.style.left = `${startLeft}px`;
    kb.style.top = `${startTop}px`;
    kb.style.bottom = 'auto';
    hasCustomPosition = true;

    window.addEventListener('pointermove', onDragMove, { passive: false });
    window.addEventListener('pointerup', onDragEnd);
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
    e.preventDefault();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    const dx = clientX - startX;
    const dy = clientY - startY;

    const pos = clampPosition(startLeft + dx, startTop + dy);
    kb.style.left = `${pos.x}px`;
    kb.style.top = `${pos.y}px`;
    if (e.cancelable) e.preventDefault();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    kb.classList.remove('is-dragging');
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    window.removeEventListener('touchmove', onDragMove);
    window.removeEventListener('touchend', onDragEnd);
  }

  if (dragHandle) {
    dragHandle.addEventListener('pointerdown', onDragStart);
    dragHandle.addEventListener('touchstart', onDragStart, { passive: false });
  }
  if (headerHandle) {
    headerHandle.addEventListener('pointerdown', onDragStart);
    headerHandle.addEventListener('touchstart', onDragStart, { passive: false });
  }

  function onResizeStart(e) {
    isResizing = true;
    kb.classList.add('is-resizing');

    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    startX = clientX;
    startY = clientY;

    const rect = kb.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;

    if (!hasCustomPosition) {
      kb.style.transform = 'none';
      kb.style.left = `${rect.left}px`;
      kb.style.top = `${rect.top}px`;
      kb.style.bottom = 'auto';
      hasCustomPosition = true;
    }

    window.addEventListener('pointermove', onResizeMove, { passive: false });
    window.addEventListener('pointerup', onResizeEnd);
    window.addEventListener('touchmove', onResizeMove, { passive: false });
    window.addEventListener('touchend', onResizeEnd);
    e.preventDefault();
    e.stopPropagation();
  }

  function onResizeMove(e) {
    if (!isResizing) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    const dw = clientX - startX;
    const dh = clientY - startY;

    const size = clampSize(startWidth + dw, startHeight + dh);
    kb.style.width = `${size.w}px`;
    kb.style.height = `${size.h}px`;

    const rect = kb.getBoundingClientRect();
    const pos = clampPosition(rect.left, rect.top);
    kb.style.left = `${pos.x}px`;
    kb.style.top = `${pos.y}px`;

    if (e.cancelable) e.preventDefault();
  }

  function onResizeEnd() {
    if (!isResizing) return;
    isResizing = false;
    kb.classList.remove('is-resizing');
    window.removeEventListener('pointermove', onResizeMove);
    window.removeEventListener('pointerup', onResizeEnd);
    window.removeEventListener('touchmove', onResizeMove);
    window.removeEventListener('touchend', onResizeEnd);
  }

  if (resizeHandle) {
    resizeHandle.addEventListener('pointerdown', onResizeStart);
    resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
  }

  window.addEventListener('resize', () => {
    if (!kb.classList.contains('is-collapsed') && hasCustomPosition) {
      const rect = kb.getBoundingClientRect();
      const pos = clampPosition(rect.left, rect.top);
      kb.style.left = `${pos.x}px`;
      kb.style.top = `${pos.y}px`;
      const size = clampSize(rect.width, rect.height);
      kb.style.width = `${size.w}px`;
      kb.style.height = `${size.h}px`;
    }
  });

  window.ensureKeyboardInView = function() {
    if (!hasCustomPosition) {
      const rect = kb.getBoundingClientRect();
      const targetLeft = Math.max(8, (window.innerWidth - rect.width) / 2);
      const targetTop = Math.max(8, window.innerHeight - rect.height - 24);
      kb.style.transform = 'none';
      kb.style.left = `${targetLeft}px`;
      kb.style.top = `${targetTop}px`;
      kb.style.bottom = 'auto';
      hasCustomPosition = true;
    } else {
      const rect = kb.getBoundingClientRect();
      const pos = clampPosition(rect.left, rect.top);
      kb.style.left = `${pos.x}px`;
      kb.style.top = `${pos.y}px`;
    }
  };
}
// =========================================================================
  // 7. EXPORT GLOBAL TRANSLATOR & INISIALISASI
// =========================================================================
window.MiraiTranslator = {
  dictionary,
  jaToIdDictionary,
  idToJaDictionary,
  convertRomajiToKana,
  getRomajiReading,
  translateStudioText,

  translateSync(text) {
    if (!text || typeof text !== "string") return text || "";
    const raw = text.trim();
    if (!raw) return "";

    try {
    const cached = localStorage.getItem(`mnh_trans_${raw.toLowerCase()}`);
    if (cached) return cached;
    } catch (e) {}

    const cleaned = cleanEnglish(raw);
    const direct = translateWordDirect(cleaned) || translateWordDirect(raw);
    if (direct) return direct;

    if (raw.includes(",")) {
    const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
    const translatedParts = parts.map((p) => {
    const c = cleanEnglish(p);
    return translateWordDirect(c) || translateWordDirect(p) || p;
    });
    return [...new Set(translatedParts.flatMap((p) => p.split(",").map((s) => s.trim())))].join(", ");
    }

    return raw;
  },

  async translateText(text) {
    if (!text || typeof text !== "string") return text || "";
    const raw = text.trim();
    if (!raw) return "";

    // 1. Cek cache
    const cacheKey = `mnh_trans_${raw.toLowerCase()}`;
    try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
    } catch (e) {}

    // 2. Cek kamus lokal langsung
    const cleaned = cleanEnglish(raw);
    const direct = translateWordDirect(cleaned) || translateWordDirect(raw);
    if (direct) {
    try { localStorage.setItem(cacheKey, direct); } catch (e) {}
    return direct;
    }

    // 3. Online fetch
    try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(raw)}&langpair=en|id`);
    if (res.ok) {
    const data = await res.json();
    const trans = data?.responseData?.translatedText;
    if (trans && typeof trans === "string" && trans.toLowerCase() !== raw.toLowerCase()) {
      const clean = trans.trim().toLowerCase();
      try { localStorage.setItem(cacheKey, clean); } catch (e) {}
      return clean;
    }
    }
    } catch (err) {}

    // 4. Fallback
    const syncResult = this.translateSync(raw);
    if (syncResult && syncResult.toLowerCase() !== raw.toLowerCase()) {
    return syncResult;
    }

    return raw;
  },

  async translateList(items) {
    if (!Array.isArray(items)) return [];
    return Promise.all(items.map((item) => this.translateText(item)));
  }
};


// =========================================================================
// 7. GENERATOR NAMA JEPANG (KATAKANA), ATEJI KANJI POSITIF & KARTU ANGGOTA
// =========================================================================

// Kamus Konversi Fonetik Bahasa Indonesia -> Katakana Jepang
function indonesianToKatakana(name) {
  if (!name || typeof name !== 'string') return '';
  const s = name.trim().toLowerCase();
  if (!s) return '';

  const multiRules = [
    ['ngan', 'ンガン'], ['ngin', 'ンギン'], ['ngun', 'ングン'], ['ngen', 'ンゲン'], ['ngon', 'ンゴン'],
    ['nga', 'ンガ'], ['ngi', 'ンギ'], ['ngu', 'ング'], ['nge', 'ンゲ'], ['ngo', 'ンゴ'],
    ['nya', 'ニャ'], ['nyi', 'ニ'], ['nyu', 'ニュ'], ['nye', 'ニェ'], ['nyo', 'ニョ'],
    ['sya', 'シャ'], ['syi', 'シ'], ['syu', 'シュ'], ['sye', 'シェ'], ['syo', 'ショ'],
    ['sha', 'シャ'], ['shi', 'シ'], ['shu', 'シュ'], ['she', 'シェ'], ['sho', 'ショ'],
    ['cha', 'チャ'], ['chi', 'チ'], ['chu', 'チュ'], ['che', 'チェ'], ['cho', 'チョ'],
    ['kh', 'ク'], ['dh', 'ド'], ['th', 'ト'],
    ['tya', 'ティヤ'], ['tyo', 'ティヨ'], ['tyu', 'ティユ'],
    ['dya', 'ディヤ'], ['dyo', 'ディヨ'], ['dyu', 'ディユ'],
    ['dia', 'ディア'], ['dio', 'ディオ'], ['diu', 'ディウ'],
    ['tia', 'ティア'], ['tio', 'ティオ'], ['tiu', 'ティウ'],
    ['di', 'ディ'], ['ti', 'ティ'], ['du', 'ドゥ'], ['tu', 'トゥ'],
    ['fa', 'ファ'], ['fi', 'フィ'], ['fu', 'フ'], ['fe', 'フェ'], ['fo', 'フォ'],
    ['va', 'ヴァ'], ['vi', 'ヴィ'], ['vu', 'ヴ'], ['ve', 'ヴェ'], ['vo', 'ヴォ'],
    ['kwa', 'クヮ'], ['kwi', 'クィ'], ['kwe', 'クェ'], ['kwo', 'クォ'],
    ['gwa', 'グヮ'], ['gwi', 'グィ'], ['gwe', 'グェ'], ['gwo', 'グォ'],
    ['ca', 'カ'], ['ci', 'チ'], ['cu', 'チュ'], ['ce', 'チェ'], ['co', 'コ'],
    ['ja', 'ジャ'], ['ji', 'ジ'], ['ju', 'ジュ'], ['je', 'ジェ'], ['jo', 'ジョ'],
    ['za', 'ザ'], ['zi', 'ジ'], ['zu', 'ズ'], ['ze', 'ゼ'], ['zo', 'ゾ'],
    ['qa', 'クァ'], ['qi', 'クィ'], ['qu', 'ク'], ['qe', 'クェ'], ['qo', 'クォ'],
    ['ka', 'カ'], ['ki', 'キ'], ['ku', 'ク'], ['ke', 'ケ'], ['ko', 'コ'],
    ['sa', 'サ'], ['si', 'シ'], ['su', 'ス'], ['se', 'セ'], ['so', 'ソ'],
    ['ta', 'タ'], ['te', 'テ'], ['to', 'ト'],
    ['na', 'ナ'], ['ni', 'ニ'], ['nu', 'ヌ'], ['ne', 'ネ'], ['no', 'ノ'],
    ['ha', 'ハ'], ['hi', 'ヒ'], ['he', 'ヘ'], ['ho', 'ホ'],
    ['ma', 'マ'], ['mi', 'ミ'], ['mu', 'ム'], ['me', 'メ'], ['mo', 'モ'],
    ['ya', 'ヤ'], ['yu', 'ユ'], ['yo', 'ヨ'], ['ye', 'イェ'],
    ['ra', 'ラ'], ['ri', 'リ'], ['ru', 'ル'], ['re', 'レ'], ['ro', 'ロ'],
    ['la', 'ラ'], ['li', 'リ'], ['lu', 'ル'], ['le', 'レ'], ['lo', 'ロ'],
    ['wa', 'ワ'], ['wi', 'ウィ'], ['wu', 'ウ'], ['we', 'ウェ'], ['wo', 'ウォ'],
    ['ba', 'バ'], ['bi', 'ビ'], ['bu', 'ブ'], ['be', 'ベ'], ['bo', 'ボ'],
    ['pa', 'パ'], ['pi', 'ピ'], ['pu', 'プ'], ['pe', 'ペ'], ['po', 'ポ'],
    ['ga', 'ガ'], ['gi', 'ギ'], ['gu', 'グ'], ['ge', 'ゲ'], ['go', 'ゴ'],
    ['a', 'ア'], ['i', 'イ'], ['u', 'ウ'], ['e', 'エ'], ['o', 'オ']
  ];

  const loneConsonants = [
    ['ng', 'ング'], ['r', 'ル'], ['l', 'ル'], ['s', 'ス'], ['k', 'ク'],
    ['q', 'ク'], ['t', 'ト'], ['d', 'ド'], ['p', 'プ'], ['b', 'ブ'],
    ['g', 'グ'], ['m', 'ム'], ['n', 'ン'], ['h', 'フ'], ['c', 'ク'],
    ['j', 'ジ'], ['z', 'ズ'], ['f', 'フ'], ['v', 'ヴ'], ['w', 'ウ'], ['y', 'イ']
  ];

  let res = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] === ' ' || s[i] === '-' || s[i] === '_') {
      res += '・';
      i++;
      continue;
    }
    let matched = false;
    for (const [k, v] of multiRules) {
      if (s.startsWith(k, i)) {
        res += v;
        i += k.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      for (const [k, v] of loneConsonants) {
        if (s.startsWith(k, i)) {
          res += v;
          i += k.length;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      res += s[i].toUpperCase();
      i++;
    }
  }
  return res;
}

// Rekonstruksi Romaji dari Katakana
function katakanaToRomajiReading(katakana) {
  if (!katakana) return '';
  const map = {
    'ア': 'A', 'イ': 'I', 'ウ': 'U', 'エ': 'E', 'オ': 'O',
    'カ': 'Ka', 'キ': 'Ki', 'ク': 'Ku', 'ケ': 'Ke', 'コ': 'Ko',
    'サ': 'Sa', 'シ': 'Shi', 'ス': 'Su', 'セ': 'Se', 'ソ': 'So',
    'タ': 'Ta', 'チ': 'Chi', 'ツ': 'Tsu', 'テ': 'Te', 'ト': 'To',
    'ナ': 'Na', 'ニ': 'Ni', 'ヌ': 'Nu', 'ネ': 'Ne', 'ノ': 'No',
    'ハ': 'Ha', 'ヒ': 'Hi', 'フ': 'Fu', 'ヘ': 'He', 'ホ': 'Ho',
    'マ': 'Ma', 'ミ': 'Mi', 'ム': 'Mu', 'メ': 'Me', 'モ': 'Mo',
    'ヤ': 'Ya', 'ユ': 'Yu', 'ヨ': 'Yo',
    'ラ': 'Ra', 'リ': 'Ri', 'ル': 'Ru', 'レ': 'Re', 'ロ': 'Ro',
    'ワ': 'Wa', 'ヲ': 'Wo', 'ン': 'n',
    'ガ': 'Ga', 'ギ': 'Gi', 'グ': 'Gu', 'ゲ': 'Ge', 'ゴ': 'Go',
    'ザ': 'Za', 'ジ': 'Ji', 'ズ': 'Zu', 'ゼ': 'Ze', 'ゾ': 'Zo',
    'ダ': 'Da', 'ヂ': 'Ji', 'ヅ': 'Zu', 'デ': 'De', 'ド': 'Do',
    'バ': 'Ba', 'ビ': 'Bi', 'ブ': 'Bu', 'ベ': 'Be', 'ボ': 'Bo',
    'パ': 'Pa', 'ピ': 'Pi', 'プ': 'Pu', 'ペ': 'Pe', 'ポ': 'Po',
    'ディ': 'Di', 'ティ': 'Ti', 'ドゥ': 'Du', 'トゥ': 'Tu',
    'ファ': 'Fa', 'フィ': 'Fi', 'フェ': 'Fe', 'フォ': 'Fo',
    'ヴァ': 'Va', 'ヴィ': 'Vi', 'ヴェ': 'Ve', 'ヴォ': 'Vo',
    'キャ': 'Kya', 'キュ': 'Kyu', 'キョ': 'Kyo',
    'シャ': 'Sha', 'シュ': 'Shu', 'ショ': 'Sho',
    'チャ': 'Cha', 'チュ': 'Chu', 'チョ': 'Cho',
    'ニャ': 'Nya', 'ニュ': 'Nyu', 'ニョ': 'Nyo',
    'ヒャ': 'Hya', 'ヒュ': 'Hyu', 'ヒョ': 'Hyo',
    'ミャ': 'Mya', 'ミュ': 'Myu', 'ミョ': 'Myo',
    'リャ': 'Rya', 'リュ': 'Ryu', 'リョ': 'Ryo',
    'ギャ': 'Gya', 'ギュ': 'Gyu', 'ギョ': 'Gyo',
    'ジャ': 'Ja', 'ジュ': 'Ju', 'ジョ': 'Jo',
    'ビャ': 'Bya', 'ビュ': 'Byu', 'ビョ': 'Byo',
    'ピャ': 'Pya', 'ピュ': 'Pyu', 'ピョ': 'Pyo',
    'クァ': 'Qwa', 'クィ': 'Qwi', 'クェ': 'Qwe', 'クォ': 'Qwo',
    '・': ' '
  };

  let out = '';
  let i = 0;
  while (i < katakana.length) {
    if (i + 1 < katakana.length && map[katakana.substring(i, i + 2)]) {
      out += map[katakana.substring(i, i + 2)];
      i += 2;
    } else if (map[katakana[i]]) {
      out += map[katakana[i]];
      i++;
    } else {
      out += katakana[i];
      i++;
    }
  }
  return out;
}

// Basis Data Kata Utuh Bahasa Jepang (Whole-Word Matcher)
const WHOLE_WORD_JAPANESE_DICT = {
  'kenshin': [
    { kanji: '謙信', reading: 'Kenshin', meaning: 'Kerendahan Hati & Keteguhan Janji Luhur' },
    { kanji: '賢真', reading: 'Kenshin', meaning: 'Kecerdikan Akal & Kebenaran Hakiki' }
  ],
  'tsubasa': [
    { kanji: '翼', reading: 'Tsubasa', meaning: 'Sayap Pelindung Menggapai Angkasa Luas' },
    { kanji: '翔翼', reading: 'Tsubasa', meaning: 'Kepakan Sayap Kejayaan Masa Depan' }
  ],
  'hikari': [
    { kanji: '光', reading: 'Hikari', meaning: 'Cahaya Terang Pemandu Kebajikan' },
    { kanji: '輝莉', reading: 'Hikari', meaning: 'Kemilau Murni Menghangatkan Hati' }
  ],
  'kazuki': [
    { kanji: '和希', reading: 'Kazuki', meaning: 'Harmoni Kedamaian & Harapan Mulia' },
    { kanji: '一樹', reading: 'Kazuki', meaning: 'Pohon Tangguh Berakar Kuat' }
  ],
  'aokita': [
    { kanji: '蒼輝', reading: 'Aokita', meaning: 'Biru Samudra yang Bersinar Gemilang' },
    { kanji: '青北', reading: 'Aokita', meaning: 'Bintang Kejora Biru Penunjuk Arah' }
  ],
  'mirai': [
    { kanji: '未来', reading: 'Mirai', meaning: 'Masa Depan Cerah Penuh Potensi Indah' },
    { kanji: '美頼', reading: 'Mirai', meaning: 'Keindahan yang Menjadi Sandaran Kasih' }
  ],
  'akira': [
    { kanji: '明', reading: 'Akira', meaning: 'Cahaya Terang & Kecerdasan Berpikir' },
    { kanji: '亮', reading: 'Akira', meaning: 'Kecemerlangan Budi & Kejujuran Jiwa' }
  ],
  'kaede': [
    { kanji: '楓', reading: 'Kaede', meaning: 'Keindahan Daun Maple yang Anggun' }
  ],
  'kaito': [
    { kanji: '海斗', reading: 'Kaito', meaning: 'Penjelajah Samudra Berbintang' },
    { kanji: '快翔', reading: 'Kaito', meaning: 'Terbang Bebas dengan Sukacita' }
  ],
  'reiko': [
    { kanji: '麗子', reading: 'Reiko', meaning: 'Keanggunan Budi & Pesona Menawan' }
  ],
  'haru': [
    { kanji: '春', reading: 'Haru', meaning: 'Musim Semi Penuh Kehangatan & Harapan' },
    { kanji: '陽', reading: 'Haru', meaning: 'Hangatnya Sinar Mentari Pagi' }
  ],
  'yuki': [
    { kanji: '雪', reading: 'Yuki', meaning: 'Kemurnian Hati & Keteguhan Salju Putih' },
    { kanji: '勇輝', reading: 'Yuki', meaning: 'Keberanian yang Bersinar Gemilang' }
  ],
  'sora': [
    { kanji: '空', reading: 'Sora', meaning: 'Langit Bebas & Impian Luas Tak Terbatas' },
    { kanji: '昊', reading: 'Sora', meaning: 'Cakrawala Luas Pembawa Kedamaian' }
  ],
  'hana': [
    { kanji: '花', reading: 'Hana', meaning: 'Bunga Mekar Mengharumkan Kehidupan' },
    { kanji: '華', reading: 'Hana', meaning: 'Kemegahan Bunga Mirai no Hana' }
  ],
  'riku': [
    { kanji: '陸', reading: 'Riku', meaning: 'Daratan Kokoh Pijakan Cita-Cita Luhur' },
    { kanji: '利空', reading: 'Riku', meaning: 'Kelapangan Tekad Meraih Kejayaan' }
  ],
  'kita': [
    { kanji: '輝太', reading: 'Kita', meaning: 'Sinar Gemilang yang Agung & Gagah' },
    { kanji: '喜多', reading: 'Kita', meaning: 'Kelimpahan Sukacita & Kebaikan' }
  ],
  'shin': [
    { kanji: '真', reading: 'Shin', meaning: 'Kebenaran Murni & Integritas Sejati' },
    { kanji: '心', reading: 'Shin', meaning: 'Ketulusan Hati & Budi Pekerti Mulia' }
  ],
  'ryuu': [
    { kanji: '竜', reading: 'Ryuu', meaning: 'Naga Pelindung Berani & Berwibawa' },
    { kanji: '龍', reading: 'Ryuu', meaning: 'Kekuatan Luhur yang Membumbung Tinggi' }
  ],
  'ryu': [
    { kanji: '竜', reading: 'Ryu', meaning: 'Naga Pelindung Berani & Berwibawa' },
    { kanji: '龍', reading: 'Ryu', meaning: 'Kekuatan Luhur yang Membumbung Tinggi' }
  ],
  'shun': [
    { kanji: '駿', reading: 'Shun', meaning: 'Kuda Tangkas yang Cepat Menggapai Prestasi' }
  ],
  'ren': [
    { kanji: '蓮', reading: 'Ren', meaning: 'Teratai Anggun yang Selalu Menjaga Kesucian' },
    { kanji: '廉', reading: 'Ren', meaning: 'Kemurnian Hati & Kejujuran Moral' }
  ],
  'rin': [
    { kanji: '凛', reading: 'Rin', meaning: 'Keteguhan Budi & Keberanian yang Anggun' }
  ],
  'kai': [
    { kanji: '海', reading: 'Kai', meaning: 'Samudra Luas Penuh Kedalaman Ilmu' }
  ],
  'mai': [
    { kanji: '舞', reading: 'Mai', meaning: 'Tarian Jiwa yang Penuh Energi Kebaikan' }
  ],
  'ao': [
    { kanji: '蒼', reading: 'Ao', meaning: 'Biru Samudra yang Tenang & Bijak' },
    { kanji: '青', reading: 'Ao', meaning: 'Biru Langit & Semangat Muda Berkobar' }
  ],
  'aki': [
    { kanji: '明', reading: 'Aki', meaning: 'Cahaya Terang & Kecerdasan Budi' },
    { kanji: '秋', reading: 'Aki', meaning: 'Musim Gugur yang Damai & Penuh Berkah' }
  ]
};

// Basis Data Ateji Mora (Suku Kata) dengan 3 Alternatif Kanji Positif Tiap Bunyi
const ATEJI_MORA_DICT = {
  'a': [
    { kanji: '亜', reading: 'A', meaning: 'Keagungan Budi Luhur & Keteguhan' },
    { kanji: '愛', reading: 'A', meaning: 'Cinta Kasih Murni & Ketulusan Hati' },
    { kanji: '彩', reading: 'A', meaning: 'Warna-Warni Keindahan & Pesona Diri' }
  ],
  'i': [
    { kanji: '伊', reading: 'I', meaning: 'Keberkahan & Keteladanan Mulia' },
    { kanji: '唯', reading: 'I', meaning: 'Keunikan Diri & Keteguhan Prinsip' },
    { kanji: '依', reading: 'I', meaning: 'Sandaran Kasih & Kepercayaan Erat' }
  ],
  'u': [
    { kanji: '宇', reading: 'U', meaning: 'Keluasan Semesta & Harapan Tinggi' },
    { kanji: '羽', reading: 'U', meaning: 'Sayap Melambung Bebas Menggapai Cita' },
    { kanji: '生', reading: 'U', meaning: 'Pertumbuhan & Kehidupan Penuh Berkah' }
  ],
  'e': [
    { kanji: '恵', reading: 'E', meaning: 'Karunia Berkah & Kedermawanan Jiwa' },
    { kanji: '絵', reading: 'E', meaning: 'Lukisan Cita-Cita Indah yang Terwujud' },
    { kanji: '栄', reading: 'E', meaning: 'Kejayaan & Kemakmuran Prestasi' }
  ],
  'o': [
    { kanji: '央', reading: 'O', meaning: 'Pusat Semangat & Pemimpin Teladan' },
    { kanji: '桜', reading: 'O', meaning: 'Sakura Keindahan, Ketulusan, & Harapan' },
    { kanji: '旺', reading: 'O', meaning: 'Semangat Membara yang Bersinar Terang' }
  ],
  'ka': [
    { kanji: '華', reading: 'Ka', meaning: 'Bunga Merekah & Kemegahan Diri' },
    { kanji: '花', reading: 'Ka', meaning: 'Keharuman Bunga Mirai no Hana' },
    { kanji: '香', reading: 'Ka', meaning: 'Aroma Kebaikan yang Menyejukkan' }
  ],
  'ki': [
    { kanji: '輝', reading: 'Ki', meaning: 'Kilau Cahaya Gemilang Bintang' },
    { kanji: '希', reading: 'Ki', meaning: 'Harapan Luhur Menatap Masa Depan' },
    { kanji: '貴', reading: 'Ki', meaning: 'Kemuliaan Jiwa & Nilai Luhur' }
  ],
  'ku': [
    { kanji: '久', reading: 'Ku', meaning: 'Keabadian Kebaikan & Kesetiaan' },
    { kanji: '空', reading: 'Ku', meaning: 'Kelapangan Hati Seluas Langit' },
    { kanji: '薫', reading: 'Ku', meaning: 'Keharuman Budi & Semerbak Teladan' }
  ],
  'ke': [
    { kanji: '慶', reading: 'Ke', meaning: 'Sukacita & Kebahagiaan Berlimpah' },
    { kanji: '景', reading: 'Ke', meaning: 'Panorama Indah Keberhasilan' },
    { kanji: '結', reading: 'Ke', meaning: 'Ikatan Erat Tali Persahabatan' }
  ],
  'ko': [
    { kanji: '心', reading: 'Ko', meaning: 'Ketulusan Hati & Keikhlasan Jiwa' },
    { kanji: '幸', reading: 'Ko', meaning: 'Keberuntungan & Kebahagiaan Sejati' },
    { kanji: '虹', reading: 'Ko', meaning: 'Keindahan Pelangi Penuh Warna' }
  ],
  'sa': [
    { kanji: '咲', reading: 'Sa', meaning: 'Mekar Indah Mengharumkan Sekitar' },
    { kanji: '彩', reading: 'Sa', meaning: 'Warna-Warni Bakat & Kreativitas' },
    { kanji: '紗', reading: 'Sa', meaning: 'Kelembutan Sutra yang Menyejukkan' }
  ],
  'si': [
    { kanji: '詩', reading: 'Shi', meaning: 'Puisi Keindahan Budi & Nada Luhur' },
    { kanji: '志', reading: 'Shi', meaning: 'Cita-Cita Mulia & Tekad Membaja' },
    { kanji: '真', reading: 'Shin', meaning: 'Kebenaran Murni & Integritas' }
  ],
  'shi': [
    { kanji: '詩', reading: 'Shi', meaning: 'Puisi Keindahan Budi & Nada Luhur' },
    { kanji: '志', reading: 'Shi', meaning: 'Cita-Cita Mulia & Tekad Membaja' },
    { kanji: '真', reading: 'Shin', meaning: 'Kebenaran Murni & Integritas' }
  ],
  'su': [
    { kanji: '寿', reading: 'Su', meaning: 'Keberkahan & Umur Panjang Mulia' },
    { kanji: '澄', reading: 'Su', meaning: 'Kejernihan Hati & Pikiran Tenang' },
    { kanji: '涼', reading: 'Su', meaning: 'Kesejukan Pikiran yang Menenteramkan' }
  ],
  'se': [
    { kanji: '星', reading: 'Sei', meaning: 'Bintang Pemandu Arah Langkah' },
    { kanji: '清', reading: 'Sei', meaning: 'Kesucian Budi & Kejernihan Jiwa' },
    { kanji: '誠', reading: 'Sei', meaning: 'Ketulusan Hati & Kesetiaan' }
  ],
  'so': [
    { kanji: '創', reading: 'Sou', meaning: 'Daya Cipta & Kreativitas Luhur' },
    { kanji: '奏', reading: 'Sou', meaning: 'Harmoni Nada & Kerja Sama Indah' },
    { kanji: '想', reading: 'Sou', meaning: 'Imajinasi Brilian & Kasih Peduli' }
  ],
  'ta': [
    { kanji: '太', reading: 'Ta', meaning: 'Ketangguhan & Semangat Besar' },
    { kanji: '多', reading: 'Ta', meaning: 'Kelimpahan Bakat & Keberuntungan' },
    { kanji: '泰', reading: 'Ta', meaning: 'Kedamaian Hati & Kestabilan Jiwa' }
  ],
  'ti': [
    { kanji: '智', reading: 'Chi', meaning: 'Kebijaksanaan & Kecerdasan Cendekia' },
    { kanji: '千', reading: 'Chi', meaning: 'Kemakmuran & Harapan Tak Berujung' },
    { kanji: '知', reading: 'Chi', meaning: 'Wawasan Luas & Pengetahuan Mulia' }
  ],
  'chi': [
    { kanji: '智', reading: 'Chi', meaning: 'Kebijaksanaan & Kecerdasan Cendekia' },
    { kanji: '千', reading: 'Chi', meaning: 'Kemakmuran & Harapan Tak Berujung' },
    { kanji: '知', reading: 'Chi', meaning: 'Wawasan Luas & Pengetahuan Mulia' }
  ],
  'tu': [
    { kanji: '月', reading: 'Tsu', meaning: 'Keindahan Rembulan Penerang Malam' },
    { kanji: '津', reading: 'Tsu', meaning: 'Pelabuhan Impian Penjelajah' },
    { kanji: '都', reading: 'Tsu', meaning: 'Pusat Kebanggaan & Keindahan' }
  ],
  'tsu': [
    { kanji: '月', reading: 'Tsu', meaning: 'Keindahan Rembulan Penerang Malam' },
    { kanji: '津', reading: 'Tsu', meaning: 'Pelabuhan Impian Penjelajah' },
    { kanji: '都', reading: 'Tsu', meaning: 'Pusat Kebanggaan & Keindahan' }
  ],
  'te': [
    { kanji: '輝', reading: 'Te', meaning: 'Cahaya Terang Gemintang' },
    { kanji: '天', reading: 'Te', meaning: 'Keluhuran Budi Setinggi Angkasa' },
    { kanji: '悌', reading: 'Te', meaning: 'Keramahan & Cinta Persaudaraan' }
  ],
  'to': [
    { kanji: '翔', reading: 'To', meaning: 'Terbang Tinggi Menggapai Angkasa' },
    { kanji: '登', reading: 'To', meaning: 'Mendaki Puncak Kesuksesan' },
    { kanji: '仁', reading: 'To', meaning: 'Welad Asih & Kebaikan Hati' }
  ],
  'na': [
    { kanji: '直', reading: 'Na', meaning: 'Kelurusan Moral & Kejujuran' },
    { kanji: '菜', reading: 'Na', meaning: 'Kesegaran Bunga Harapan' },
    { kanji: '南', reading: 'Na', meaning: 'Kehangatan Arah Selatan' }
  ],
  'ni': [
    { kanji: '虹', reading: 'Ni', meaning: 'Pelangi Keindahan Penuh Warna' },
    { kanji: '仁', reading: 'Ni', meaning: 'Kasih Sayang & Kebijakan Luhur' },
    { kanji: '日', reading: 'Ni', meaning: 'Kehangatan Sinar Mentari' }
  ],
  'nu': [
    { kanji: '温', reading: 'Nu', meaning: 'Kehangatan Kasih Sayang' },
    { kanji: '主', reading: 'Nu', meaning: 'Kemandirian & Prinsip Teguh' },
    { kanji: '縫', reading: 'Nu', meaning: 'Penyatu Ikatan Persahabatan' }
  ],
  'ne': [
    { kanji: '音', reading: 'Ne', meaning: 'Irama Kebaikan & Harmoni Nada' },
    { kanji: '嶺', reading: 'Ne', meaning: 'Puncak Gunung yang Menjulang' },
    { kanji: '根', reading: 'Ne', meaning: 'Akar Karakter yang Kokoh' }
  ],
  'no': [
    { kanji: '希', reading: 'No', meaning: 'Harapan Luhur Masa Depan' },
    { kanji: '乃', reading: 'No', meaning: 'Kelemahlembutan Sikap & Budi' },
    { kanji: '野', reading: 'No', meaning: 'Kelapangan Padang Hijau' }
  ],
  'ha': [
    { kanji: '花', reading: 'Ha', meaning: 'Keharuman Bunga Mirai no Hana' },
    { kanji: '晴', reading: 'Ha', meaning: 'Cerahnya Langit Hari Depan' },
    { kanji: '羽', reading: 'Ha', meaning: 'Sayap Kebebasan Meraih Cita' }
  ],
  'hi': [
    { kanji: '陽', reading: 'Hi', meaning: 'Hangatnya Sinar Mentari Pagi' },
    { kanji: '日', reading: 'Hi', meaning: 'Cahaya Terang Pembawa Semangat' },
    { kanji: '光', reading: 'Hi', meaning: 'Sinar Pemandu Arah Langkah' }
  ],
  'fu': [
    { kanji: '富', reading: 'Fu', meaning: 'Kelimpahan Kebaikan & Berkah' },
    { kanji: '風', reading: 'Fu', meaning: 'Hembusan Angin Pembawa Kesegaran' },
    { kanji: '芙', reading: 'Fu', meaning: 'Keindahan Bunga Teratai Mekar' }
  ],
  'hu': [
    { kanji: '富', reading: 'Fu', meaning: 'Kelimpahan Kebaikan & Berkah' },
    { kanji: '風', reading: 'Fu', meaning: 'Hembusan Angin Pembawa Kesegaran' },
    { kanji: '芙', reading: 'Fu', meaning: 'Keindahan Bunga Teratai Mekar' }
  ],
  'he': [
    { kanji: '平', reading: 'He', meaning: 'Kedamaian Batin & Ketenangan Jiwa' },
    { kanji: '碧', reading: 'He', meaning: 'Hijau Zamrud yang Menyejukkan' },
    { kanji: '経', reading: 'He', meaning: 'Pengalaman Berharga & Hikmah' }
  ],
  'ho': [
    { kanji: '宝', reading: 'Ho', meaning: 'Permata Berharga Kebanggaan Diri' },
    { kanji: '星', reading: 'Ho', meaning: 'Bintang Terang Pembimbing Arah' },
    { kanji: '穂', reading: 'Ho', meaning: 'Bulir Padi Lambang Kemakmuran' }
  ],
  'ma': [
    { kanji: '真', reading: 'Ma', meaning: 'Kebenaran Sejati & Ketulusan' },
    { kanji: '誠', reading: 'Ma', meaning: 'Integritas Hati & Budi Pekerti' },
    { kanji: '万', reading: 'Ma', meaning: 'Kelimpahan Berkah & Doa Baik' }
  ],
  'mi': [
    { kanji: '美', reading: 'Mi', meaning: 'Keindahan Jiwa & Budi Pekerti' },
    { kanji: '実', reading: 'Mi', meaning: 'Buah Manis Perjuangan & Prestasi' },
    { kanji: '未', reading: 'Mi', meaning: 'Masa Depan Cerah yang Dinanti' }
  ],
  'mu': [
    { kanji: '夢', reading: 'Mu', meaning: 'Impian Mulia yang Terwujud' },
    { kanji: '睦', reading: 'Mu', meaning: 'Kerukunan & Kehangatan Bersama' },
    { kanji: '結', reading: 'Mu', meaning: 'Simpul Ikatan Kebersamaan' }
  ],
  'me': [
    { kanji: '芽', reading: 'Me', meaning: 'Tunas Harapan yang Bertumbuh' },
    { kanji: '萌', reading: 'Me', meaning: 'Semangat Baru yang Bersemi' },
    { kanji: '明', reading: 'Me', meaning: 'Kecerdasan Budi & Terang Hati' }
  ],
  'mo': [
    { kanji: '望', reading: 'Mo', meaning: 'Aspirasi Luhur Menuju Puncak' },
    { kanji: '茂', reading: 'Mo', meaning: 'Kekayaan Ilmu yang Rimbun' },
    { kanji: '森', reading: 'Mo', meaning: 'Ketenangan Hutan Alam Raya' }
  ],
  'ya': [
    { kanji: '弥', reading: 'Ya', meaning: 'Kemakmuran yang Terus Meluas' },
    { kanji: '矢', reading: 'Ya', meaning: 'Ketepatan Arah Mencapai Sasaran' },
    { kanji: '優', reading: 'Ya', meaning: 'Kelembutan Kasih & Keutamaan' }
  ],
  'yu': [
    { kanji: '優', reading: 'Yu', meaning: 'Kelembutan Hati & Keunggulan Prestasi' },
    { kanji: '勇', reading: 'Yu', meaning: 'Keberanian & Keteguhan Jiwa' },
    { kanji: '結', reading: 'Yu', meaning: 'Simpul Erat Tali Persaudaraan' }
  ],
  'yo': [
    { kanji: '陽', reading: 'Yo', meaning: 'Kehangatan Sinar Mentari' },
    { kanji: '祥', reading: 'Yo', meaning: 'Pertanda Baik & Kebahagiaan' },
    { kanji: '誉', reading: 'Yo', meaning: 'Kehormatan & Prestasi Terpuji' }
  ],
  'ra': [
    { kanji: '羅', reading: 'Ra', meaning: 'Jalinan Sutra & Kekuatan Pelindung' },
    { kanji: '良', reading: 'Ra', meaning: 'Kebaikan Budi & Ketulusan' },
    { kanji: '蘭', reading: 'Ra', meaning: 'Anggrek Anggun yang Wangi' }
  ],
  'la': [
    { kanji: '羅', reading: 'Ra', meaning: 'Jalinan Sutra & Kekuatan Pelindung' },
    { kanji: '良', reading: 'Ra', meaning: 'Kebaikan Budi & Ketulusan' },
    { kanji: '蘭', reading: 'Ra', meaning: 'Anggrek Anggun yang Wangi' }
  ],
  'ri': [
    { kanji: '理', reading: 'Ri', meaning: 'Kebenaran, Logika, & Kemuliaan' },
    { kanji: '璃', reading: 'Ri', meaning: 'Kaca Kristal Permata Berharga' },
    { kanji: '莉', reading: 'Ri', meaning: 'Melati Putih Lambang Kesucian' }
  ],
  'li': [
    { kanji: '理', reading: 'Ri', meaning: 'Kebenaran, Logika, & Kemuliaan' },
    { kanji: '璃', reading: 'Ri', meaning: 'Kaca Kristal Permata Berharga' },
    { kanji: '莉', reading: 'Ri', meaning: 'Melati Putih Lambang Kesucian' }
  ],
  'ru': [
    { kanji: '瑠', reading: 'Ru', meaning: 'Permata Lapis Lazuli Gemilang' },
    { kanji: '琉', reading: 'Ru', meaning: 'Kejernihan Permata Biru Samudra' },
    { kanji: '流', reading: 'Ru', meaning: 'Aliran Kebaikan yang Lancar' }
  ],
  'lu': [
    { kanji: '瑠', reading: 'Ru', meaning: 'Permata Lapis Lazuli Gemilang' },
    { kanji: '琉', reading: 'Ru', meaning: 'Kejernihan Permata Biru Samudra' },
    { kanji: '流', reading: 'Ru', meaning: 'Aliran Kebaikan yang Lancar' }
  ],
  're': [
    { kanji: '蓮', reading: 'Re', meaning: 'Teratai Anggun yang Tetap Suci' },
    { kanji: '玲', reading: 'Re', meaning: 'Kilau Permata yang Gemerlap' },
    { kanji: '麗', reading: 'Re', meaning: 'Keindahan & Keanggunan Budi' }
  ],
  'le': [
    { kanji: '蓮', reading: 'Re', meaning: 'Teratai Anggun yang Tetap Suci' },
    { kanji: '玲', reading: 'Re', meaning: 'Kilau Permata yang Gemerlap' },
    { kanji: '麗', reading: 'Re', meaning: 'Keindahan & Keanggunan Budi' }
  ],
  'ro': [
    { kanji: '朗', reading: 'Ro', meaning: 'Keriangan Jiwa & Kecerahan Hati' },
    { kanji: '露', reading: 'Ro', meaning: 'Tetesan Embun Pagi yang Murni' },
    { kanji: '路', reading: 'Ro', meaning: 'Jalan Terang Menuju Keberhasilan' }
  ],
  'lo': [
    { kanji: '朗', reading: 'Ro', meaning: 'Keriangan Jiwa & Kecerahan Hati' },
    { kanji: '露', reading: 'Ro', meaning: 'Tetesan Embun Pagi yang Murni' },
    { kanji: '路', reading: 'Ro', meaning: 'Jalan Terang Menuju Keberhasilan' }
  ],
  'wa': [
    { kanji: '和', reading: 'Wa', meaning: 'Keharmonisan & Kedamaian Luhur' },
    { kanji: '輪', reading: 'Wa', meaning: 'Lingkaran Persahabatan Abadi' },
    { kanji: '羽', reading: 'Wa', meaning: 'Sayap Kemuliaan Melintasi Samudra' }
  ],
  'ba': [
    { kanji: '羽', reading: 'Ba', meaning: 'Sayap Melambung Mengarungi Dunia' },
    { kanji: '葉', reading: 'Ba', meaning: 'Dedaunan Hijau yang Segar' },
    { kanji: '場', reading: 'Ba', meaning: 'Wahana Prestasi & Pembelajaran' }
  ],
  'bi': [
    { kanji: '美', reading: 'Bi', meaning: 'Keindahan Budi & Keanggunan' },
    { kanji: '敏', reading: 'Bi', meaning: 'Kecepatan Tanggap & Cerdas' },
    { kanji: '微', reading: 'Bi', meaning: 'Ketelitian & Kelembutan Budi' }
  ],
  'bu': [
    { kanji: '武', reading: 'Bu', meaning: 'Ksatria Berani & Berpendirian' },
    { kanji: '舞', reading: 'Bu', meaning: 'Tarian Jiwa yang Menghibur' },
    { kanji: '歩', reading: 'Bu', meaning: 'Langkah Mantap Menuju Masa Depan' }
  ],
  'be': [
    { kanji: '紅', reading: 'Be', meaning: 'Warna Merah Pesona Gemilang' },
    { kanji: '弁', reading: 'Be', meaning: 'Kecakapan Bertutur & Diplomasi' },
    { kanji: '明', reading: 'Be', meaning: 'Terangnya Wawasan & Budi' }
  ],
  'bo': [
    { kanji: '望', reading: 'Bo', meaning: 'Harapan Luhur Meraih Cita' },
    { kanji: '保', reading: 'Bo', meaning: 'Penjaga Amanah & Kepercayaan' },
    { kanji: '宝', reading: 'Bo', meaning: 'Harta Berharga Kebanggaan Diri' }
  ],
  'da': [
    { kanji: '大', reading: 'Da', meaning: 'Kebesaran Jiwa & Kelapangan Tekad' },
    { kanji: '太', reading: 'Da', meaning: 'Keteguhan Budi & Keagungan' },
    { kanji: '大地', reading: 'Da', meaning: 'Bumi Pertiwi Tempat Berpijak' }
  ],
  'di': [
    { kanji: '大', reading: 'Di', meaning: 'Kebesaran Tekad & Kelapangan Jiwa' },
    { kanji: '智', reading: 'Di', meaning: 'Kecendekiaan & Kebijakan Luhur' },
    { kanji: '悌', reading: 'Di', meaning: 'Persaudaraan Erat & Keramahan' }
  ],
  'de': [
    { kanji: '伝', reading: 'De', meaning: 'Penerus Tradisi & Kebaikan' },
    { kanji: '出', reading: 'De', meaning: 'Langkah Awal Menuju Puncak' },
    { kanji: '栄', reading: 'De', meaning: 'Kemakmuran yang Berkelanjutan' }
  ],
  'do': [
    { kanji: '道', reading: 'Do', meaning: 'Jalan Kebenaran & Budi Pekerti' },
    { kanji: '堂', reading: 'Do', meaning: 'Keagungan Sikap & Kemuliaan' },
    { kanji: '同', reading: 'Do', meaning: 'Kebersamaan & Solidaritas Erat' }
  ],
  'fa': [
    { kanji: '花', reading: 'Fa', meaning: 'Mekar Indah Mengharumkan Sekitar' },
    { kanji: '華', reading: 'Fa', meaning: 'Kemegahan Bunga & Kemuliaan' },
    { kanji: '芳', reading: 'Fa', meaning: 'Keharuman Kebajikan yang Abadi' }
  ],
  'ga': [
    { kanji: '雅', reading: 'Ga', meaning: 'Keanggunan Budi & Estetika Luhur' },
    { kanji: '芽', reading: 'Ga', meaning: 'Tunas Harapan Baru yang Bersemi' },
    { kanji: '賀', reading: 'Ga', meaning: 'Ucapan Selamat atas Keberhasilan' }
  ],
  'gi': [
    { kanji: '義', reading: 'Gi', meaning: 'Keadilan Moral & Integritas' },
    { kanji: '宜', reading: 'Gi', meaning: 'Kebaikan & Ketepatan Sikap' },
    { kanji: '銀', reading: 'Gi', meaning: 'Kilau Perak yang Berharga' }
  ],
  'gu': [
    { kanji: '具', reading: 'Gu', meaning: 'Kelengkapan Bakat & Ketrampilan' },
    { kanji: '弘', reading: 'Gu', meaning: 'Keluasan Wawasan & Budi' }
  ],
  'ge': [
    { kanji: '月', reading: 'Ge', meaning: 'Pesona Rembulan Malam yang Tenang' },
    { kanji: '華', reading: 'Ge', meaning: 'Kemegahan Bunga yang Harum' }
  ],
  'go': [
    { kanji: '豪', reading: 'Go', meaning: 'Kekuatan Besar & Keberanian' },
    { kanji: '悟', reading: 'Go', meaning: 'Pencerahan Akal & Pemahaman' },
    { kanji: '吾', reading: 'Go', meaning: 'Kesadaran Diri yang Matang' }
  ],
  'za': [
    { kanji: '座', reading: 'Za', meaning: 'Pusat Kehormatan & Kedudukan' },
    { kanji: '咲', reading: 'Za', meaning: 'Mekar Indah Mengharumkan Nama' },
    { kanji: '沙', reading: 'Za', meaning: 'Pasir Emas yang Bersinar' }
  ],
  'ji': [
    { kanji: '志', reading: 'Ji', meaning: 'Cita-Cita Luhur yang Mantap' },
    { kanji: '慈', reading: 'Ji', meaning: 'Kasih Sayang Murni & Kepedulian' },
    { kanji: '治', reading: 'Ji', meaning: 'Kedamaian & Keteraturan Hidup' }
  ],
  'zu': [
    { kanji: '瑞', reading: 'Zu', meaning: 'Tanda Keberuntungan & Berkah' },
    { kanji: '図', reading: 'Zu', meaning: 'Rancangan Masa Depan yang Matang' },
    { kanji: '寿', reading: 'Zu', meaning: 'Kebahagiaan & Umur Panjang' }
  ],
  'pa': [
    { kanji: '波', reading: 'Pa', meaning: 'Gelombang Semangat yang Menggebu' },
    { kanji: '巴', reading: 'Pa', meaning: 'Pusaran Kekuatan Harmonis' },
    { kanji: '晴', reading: 'Pa', meaning: 'Cerahnya Langit Masa Depan' }
  ],
  'pi': [
    { kanji: '光', reading: 'Pi', meaning: 'Cahaya Terang Pemandu Cita' },
    { kanji: '日', reading: 'Pi', meaning: 'Mentari Pagi Pembawa Harapan' }
  ],
  'pu': [
    { kanji: '富', reading: 'Pu', meaning: 'Kekayaan Ilmu & Kebajikan' },
    { kanji: '普', reading: 'Pu', meaning: 'Keluasan Manfaat bagi Sesama' },
    { kanji: '風', reading: 'Pu', meaning: 'Hembusan Semangat yang Segar' }
  ],
  'n': [
    { kanji: '恩', reading: 'n', meaning: 'Rasa Syukur & Kebaikan Budi' },
    { kanji: '音', reading: 'n', meaning: 'Harmoni Nada Kebaikan' },
    { kanji: '運', reading: 'n', meaning: 'Keberuntungan Baik yang Menyertai' }
  ]
};

const ATEJI_FALLBACK_POOL = [
  { kanji: '翔', reading: 'To', meaning: 'Terbang Tinggi Menggapai Angkasa' },
  { kanji: '優', reading: 'Yuu', meaning: 'Kelembutan Hati & Keunggulan Prestasi' },
  { kanji: '明', reading: 'Mei', meaning: 'Cahaya Terang & Kecerdasan Budi' },
  { kanji: '花', reading: 'Ka', meaning: 'Keharuman Bunga Mirai no Hana' },
  { kanji: '誠', reading: 'Sei', meaning: 'Ketulusan Hati & Integritas Mulia' },
  { kanji: '輝', reading: 'Ki', meaning: 'Kilau Cahaya Gemilang Bintang' },
  { kanji: '星', reading: 'Sei', meaning: 'Bintang Pemandu Arah Langkah' },
  { kanji: '希', reading: 'Ki', meaning: 'Harapan Luhur Masa Depan' },
  { kanji: '陽', reading: 'You', meaning: 'Hangatnya Sinar Mentari Pagi' },
  { kanji: '蓮', reading: 'Ren', meaning: 'Teratai Anggun yang Bersih & Suci' }
];

// Parser Whole-Word & Mora Ateji Kanji Positif (Mendukung Nama Lengkap & Variasi Seed)
function generateAtejiList(name, seed = 0) {
  if (!name || typeof name !== 'string') {
    return [ATEJI_FALLBACK_POOL[0], ATEJI_FALLBACK_POOL[2], ATEJI_FALLBACK_POOL[3]];
  }

  const rawWords = name.trim().split(/[\s\-_・]+/).filter(Boolean);
  if (!rawWords.length) {
    return [ATEJI_FALLBACK_POOL[0], ATEJI_FALLBACK_POOL[2], ATEJI_FALLBACK_POOL[3]];
  }

  const wholeKeys = Object.keys(WHOLE_WORD_JAPANESE_DICT).sort((a, b) => b.length - a.length);
  const selected = [];
  const usedKanji = new Set();
  let itemCounter = 0;

  for (const rawWord of rawWords) {
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) continue;

    let i = 0;
    while (i < clean.length && selected.length < 6) {
      let matched = false;

      // 1. Cek Whole-Word Japanese Dictionary Matcher terlebih dahulu
      for (const key of wholeKeys) {
        if (clean.startsWith(key, i)) {
          const opts = WHOLE_WORD_JAPANESE_DICT[key];
          const chosen = opts[(seed + itemCounter) % opts.length];
          if (!usedKanji.has(chosen.kanji)) {
            selected.push(chosen);
            usedKanji.add(chosen.kanji);
          }
          i += key.length;
          itemCounter++;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // 2. Cek Mora 2-huruf (misal: ka, ki, so, ra, ta)
      const k2 = clean.substring(i, i + 2);
      if (k2.length === 2 && ATEJI_MORA_DICT[k2]) {
        const opts = ATEJI_MORA_DICT[k2];
        const chosen = opts[(seed + itemCounter) % opts.length];
        if (!usedKanji.has(chosen.kanji)) {
          selected.push(chosen);
          usedKanji.add(chosen.kanji);
        }
        i += 2;
        itemCounter++;
        continue;
      }

      // 3. Cek Mora 1-huruf (misal: a, i, u, e, o, n)
      const k1 = clean.substring(i, i + 1);
      if (ATEJI_MORA_DICT[k1]) {
        const opts = ATEJI_MORA_DICT[k1];
        const chosen = opts[(seed + itemCounter) % opts.length];
        if (!usedKanji.has(chosen.kanji)) {
          selected.push(chosen);
          usedKanji.add(chosen.kanji);
        }
        i += 1;
        itemCounter++;
        continue;
      }

      // Skip karakter konsonan tunggal tak berpasangan
      i++;
    }
  }

  // Lengkapi jika kurang dari 3 kanji
  let fallbackIdx = 0;
  while (selected.length < 3 && fallbackIdx < ATEJI_FALLBACK_POOL.length) {
    const item = ATEJI_FALLBACK_POOL[(fallbackIdx + seed) % ATEJI_FALLBACK_POOL.length];
    if (!usedKanji.has(item.kanji)) {
      selected.push(item);
      usedKanji.add(item.kanji);
    }
    fallbackIdx++;
  }

  return selected.slice(0, 6);
}

// Generator Filosofi Nama Adaptif, Puitis, & Menyemangati
function buildAdaptivePhilosophy(pickedKanji, fullName, divisi) {
  if (!pickedKanji || !pickedKanji.length) {
    return 'Sosok berjiwa luhur yang senantiasa membawa harapan, kebaikan, dan prestasi gemilang bagi keluarga dan klub Mirai no Hana.';
  }

  const nameTitle = fullName ? fullName.trim() : 'Anggota';

  // Highlight karakter Kanji, bacaan, dan inti maknanya
  const kanjiHighlights = pickedKanji.map((item) => {
    const k = item.kanji;
    const r = item.reading;
    const coreMeaning = item.meaning.split('&')[0].trim();
    return `${k} (${r} · ${coreMeaning})`;
  });

  // 1. Kalimat Pembuka: Harmoni Nama & Karakter Kanji
  let opening = '';
  if (pickedKanji.length === 1) {
    opening = `Nama indah ${nameTitle} terpatri melalui aksara ${kanjiHighlights[0]}, melambangkan karakter yang tangguh dengan integritas yang murni.`;
  } else if (pickedKanji.length === 2) {
    opening = `Rangkaian nama ${nameTitle} berpadu selaras dalam aksara ${kanjiHighlights[0]} dan ${kanjiHighlights[1]}, merefleksikan perpaduan budi luhur dan keindahan visi masa depan.`;
  } else if (pickedKanji.length === 3) {
    opening = `Nama mulia ${nameTitle} terukir anggun dalam keharmonisan aksara ${kanjiHighlights[0]}, ${kanjiHighlights[1]}, serta ${kanjiHighlights[2]}, membentuk untaian doa kebaikan yang menyertai setiap denyut langkahnya.`;
  } else {
    const mainList = kanjiHighlights.slice(0, pickedKanji.length - 1).join(', ');
    const lastItem = kanjiHighlights[pickedKanji.length - 1];
    opening = `Nama lengkap ${nameTitle} tersusun atas harmoni aksara luhur ${mainList}, serta ${lastItem}, melukiskan perjalanan hidup yang kaya akan doa dan potensi agung.`;
  }

  // 2. Kalimat Tengah: Sintesis Makna Puitis & Motivasi
  const poeticSentences = [
    'Setiap aksara ini berpadu menjadi kekuatan batin yang menuntun untuk senantiasa menebarkan kehangatan, menjaga keteguhan integritas, dan melangkah tanpa ragu menjemput masa depan yang gemilang.',
    'Perpaduan makna ini memancarkan aura ketulusan dan semangat juang yang tak pernah pudar, menerangi sekeliling laksana mentari yang menyapa fajar dengan senyuman hangat.',
    'Kombinasi kanji pilihan ini menjadi lentera pemandu dalam menapaki jalan impian, memadukan kelembutan budi pekerti dengan ketegasan langkah meraih prestasi terbaik.'
  ];
  const midSentence = poeticSentences[nameTitle.length % poeticSentences.length];

  // 3. Kalimat Penutup: Terhubung dengan Semangat Divisi Pilihan
  let divClosing = '';
  switch (divisi) {
    case 'cosplay':
      divClosing = 'Bersama Divisi Cosplay & Seni Peran, sosok ini siap memancarkan rasa percaya diri di atas panggung, menghidupkan setiap karakter dengan sepenuh jiwa, dan menginspirasi banyak orang lewat ekspresi seni peran yang memukau.';
      break;
    case 'desain':
      divClosing = 'Melalui Divisi Desain & Kreatif, daya imajinasi visual dan ketelitian estetikanya akan terus mekar, mengubah ide-ide brilian menjadi karya seni bernyawa yang memikat mata dan menyentuh hati.';
      break;
    case 'kewirausahaan':
      divClosing = 'Di ranah Divisi Kewirausahaan, ketajaman visi dan kemandirian tekadnya menjadi modal utama dalam melahirkan inovasi strategis, menggerakkan peluang baru, serta memimpin dengan integritas tinggi.';
      break;
    case 'anggota':
      divClosing = 'Sebagai anggota keluarga baru Nihongo Kurabu Mirai no Hana, langkah awalnya disambut dengan hangat untuk tumbuh bersama, menjalin persahabatan tulus, dan menorehkan jejak kebanggaan bagi almamater.';
      break;
    case 'bahasa':
    default:
      divClosing = 'Dalam naungan Divisi Bahasa & Budaya, bakat ini akan terus terasah menjadi jembatan komunikasi antarbangsa, memperluas cakrawala wawasan dunia, serta melestarikan kecintaan pada sastra dan kebudayaan Jepang.';
      break;
  }

  return `${opening} ${midSentence} ${divClosing}`;
}

// Alias backward compatibility
function synthesizePhilosophy(atejiList, rawName) {
  return buildAdaptivePhilosophy(atejiList, rawName, 'bahasa');
}

// Inisialisasi Fitur Generator Nama & Kartu Anggota
function initNameGenerator() {
  const tabBtnTranslator = document.getElementById('tabBtnTranslator');
  const tabBtnNameGen = document.getElementById('tabBtnNameGen');
  const panelTranslator = document.getElementById('panelTranslator');
  const panelNameGen = document.getElementById('panelNameGen');

  // 1. Tab Switcher Listener (jika tab switcher digunakan di halaman lain / masa lalu)
  if (tabBtnTranslator && tabBtnNameGen && panelTranslator && panelNameGen) {
    tabBtnTranslator.addEventListener('click', () => {
      tabBtnTranslator.classList.add('is-active');
      tabBtnTranslator.setAttribute('aria-selected', 'true');
      tabBtnNameGen.classList.remove('is-active');
      tabBtnNameGen.setAttribute('aria-selected', 'false');
      panelTranslator.hidden = false;
      panelTranslator.classList.add('is-active');
      panelNameGen.hidden = true;
      panelNameGen.classList.remove('is-active');
      window.MiraiSound?.playClickIfIdle();
    });

    tabBtnNameGen.addEventListener('click', () => {
      tabBtnNameGen.classList.add('is-active');
      tabBtnNameGen.setAttribute('aria-selected', 'true');
      tabBtnTranslator.classList.remove('is-active');
      tabBtnTranslator.setAttribute('aria-selected', 'false');
      panelNameGen.hidden = false;
      panelNameGen.classList.add('is-active');
      panelTranslator.hidden = true;
      panelTranslator.classList.remove('is-active');
      window.MiraiSound?.playClickIfIdle();
      triggerGeneration();
    });
  }

  // 2. State & Elements Form & Result
  let kanjiVariationSeed = 0;
  const DEFAULT_KTA_PHOTO = '../images/mirai/karakter/sora-ktp.png';
  const photoState = {
    src: DEFAULT_KTA_PHOTO,
    isCustom: false,
    zoom: 1.0,
    offsetX: 0,
    offsetY: 0
  };

  const nameInput = document.getElementById('nameGenInput');
  const classInput = document.getElementById('nameGenClass');
  const birthDateInput = document.getElementById('nameGenBirthDate');
  const birthDaySelect = document.getElementById('nameGenBirthDay');
  const birthMonthSelect = document.getElementById('nameGenBirthMonth');
  const birthYearSelect = document.getElementById('nameGenBirthYear');
  const divisionSelect = document.getElementById('nameGenDivision');
  const generateBtn = document.getElementById('generateNameCardBtn');
  const clearNameBtn = document.getElementById('clearNameInputBtn');

  // Photo controls elements
  const photoUploadInput = document.getElementById('ktaPhotoUpload');
  const photoUploadBtn = document.getElementById('ktaPhotoUploadBtn');
  const photoResetBtn = document.getElementById('ktaPhotoResetBtn');
  const photoZoomSlider = document.getElementById('ktaPhotoZoom');
  const photoZoomVal = document.getElementById('ktaPhotoZoomVal');
  const photoBox = document.getElementById('ktaPhotoBox') || document.querySelector('.mcard-photo-frame');
  const photoImgEl = document.getElementById('mcardPhotoImg');
  const photoHint = document.getElementById('ktaPhotoHint');
  const rerollKanjiBtn = document.getElementById('rerollKanjiBtn');

  if (!nameInput && !generateBtn) return;

  const resKatakana = document.getElementById('resKatakana');
  const resRomaji = document.getElementById('resRomaji');
  const resAtejiRow = document.getElementById('resAtejiRow');
  const resAtejiPhilosophy = document.getElementById('resAtejiPhilosophy');
  const listenKatakanaBtn = document.getElementById('listenKatakanaBtn');
  const listenKatakanaSlowBtn = document.getElementById('listenKatakanaSlowBtn');

  const mcardKatakana = document.getElementById('mcardKatakana');
  const mcardLatin = document.getElementById('mcardLatin');
  const mcardDivisionPill = document.getElementById('mcardDivisionPill');
  const mcardClassPill = document.getElementById('mcardClassPill');
  const mcardBirthVal = document.getElementById('mcardBirthVal');
  const mcardAgeVal = document.getElementById('mcardAgeVal');
  const downloadCardBtn = document.getElementById('downloadCardPngBtn');

  const divisionLabels = {
    'bahasa': '📚 Divisi Bahasa & Budaya',
    'cosplay': '🎭 Divisi Cosplay & Seni Peran',
    'desain': '🎨 Divisi Desain & Kreatif',
    'kewirausahaan': '🍱 Divisi Kewirausahaan',
    'anggota': '🌸 Anggota Baru Klub'
  };

  // Drag & Zoom Photo Transform Logic
  function updatePhotoTransform() {
    if (!photoImgEl) return;
    photoImgEl.style.transform = `translate(${photoState.offsetX}px, ${photoState.offsetY}px) scale(${photoState.zoom})`;
  }

  let isDraggingPhoto = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialOffsetX = 0;
  let initialOffsetY = 0;

  function onPhotoDragStart(clientX, clientY) {
    isDraggingPhoto = true;
    dragStartX = clientX;
    dragStartY = clientY;
    initialOffsetX = photoState.offsetX;
    initialOffsetY = photoState.offsetY;
    if (photoBox) photoBox.classList.add('is-dragging');
  }

  function onPhotoDragMove(clientX, clientY) {
    if (!isDraggingPhoto) return;
    const dx = clientX - dragStartX;
    const dy = clientY - dragStartY;
    const frameRect = photoBox ? photoBox.getBoundingClientRect() : { width: 104, height: 138 };
    const maxOffset = Math.max(60, (frameRect.width / 2) * photoState.zoom);
    photoState.offsetX = Math.max(-maxOffset, Math.min(maxOffset, initialOffsetX + dx));
    photoState.offsetY = Math.max(-maxOffset * 1.3, Math.min(maxOffset * 1.3, initialOffsetY + dy));
    updatePhotoTransform();
  }

  function onPhotoDragEnd() {
    if (!isDraggingPhoto) return;
    isDraggingPhoto = false;
    if (photoBox) photoBox.classList.remove('is-dragging');
  }

  if (photoBox) {
    // Mouse Dragging
    photoBox.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onPhotoDragStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDraggingPhoto) {
        onPhotoDragMove(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingPhoto) {
        onPhotoDragEnd();
      }
    });

    // Touch Dragging (touch-action: none)
    photoBox.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        e.preventDefault();
        onPhotoDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    photoBox.addEventListener('touchmove', (e) => {
      if (isDraggingPhoto && e.touches && e.touches[0]) {
        e.preventDefault();
        onPhotoDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    photoBox.addEventListener('touchend', onPhotoDragEnd);
    photoBox.addEventListener('touchcancel', onPhotoDragEnd);
  }

  // Photo Upload Control
  if (photoUploadBtn && photoUploadInput) {
    photoUploadBtn.addEventListener('click', () => {
      photoUploadInput.click();
    });
  }

  if (photoUploadInput) {
    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar (.png, .jpg, .webp, dll).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        photoState.src = dataUrl;
        photoState.isCustom = true;
        photoState.offsetX = 0;
        photoState.offsetY = 0;
        photoState.zoom = 1.0;
        if (photoImgEl) photoImgEl.src = dataUrl;
        if (photoZoomSlider) photoZoomSlider.value = 100;
        if (photoZoomVal) photoZoomVal.textContent = '100%';
        if (photoHint) {
          photoHint.style.display = 'block';
          photoHint.style.opacity = '1';
        }
        updatePhotoTransform();
      };
      reader.readAsDataURL(file);
    });
  }

  // Photo Reset Control
  if (photoResetBtn) {
    photoResetBtn.addEventListener('click', () => {
      photoState.src = DEFAULT_KTA_PHOTO;
      photoState.isCustom = false;
      photoState.offsetX = 0;
      photoState.offsetY = 0;
      photoState.zoom = 1.0;
      if (photoImgEl) photoImgEl.src = DEFAULT_KTA_PHOTO;
      if (photoZoomSlider) photoZoomSlider.value = 100;
      if (photoZoomVal) photoZoomVal.textContent = '100%';
      if (photoUploadInput) photoUploadInput.value = '';
      updatePhotoTransform();
    });
  }

  // Photo Zoom Slider
  if (photoZoomSlider) {
    photoZoomSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 100;
      photoState.zoom = val / 100;
      if (photoZoomVal) photoZoomVal.textContent = `${val}%`;
      updatePhotoTransform();
    });
  }

  // Reroll Variasi Kanji Button
  if (rerollKanjiBtn) {
    rerollKanjiBtn.addEventListener('click', () => {
      window.MiraiSound?.playClickIfIdle();
      kanjiVariationSeed++;
      triggerGeneration();
    });
  }

  function formatBirthDate(val) {
    if (!val) return '01-12-2008';
    const match = String(val).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }
    return val;
  }

  function calculateAge(val) {
    if (!val) return 17;
    let y = 2008, m = 12, d = 1;
    const s = String(val).trim();
    const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const dmy = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ymd) {
      y = parseInt(ymd[1], 10);
      m = parseInt(ymd[2], 10);
      d = parseInt(ymd[3], 10);
    } else if (dmy) {
      d = parseInt(dmy[1], 10);
      m = parseInt(dmy[2], 10);
      y = parseInt(dmy[3], 10);
    }
    const today = new Date();
    let age = today.getFullYear() - y;
    const monthDiff = (today.getMonth() + 1) - m;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d)) {
      age--;
    }
    return Math.max(0, age);
  }

  function triggerGeneration() {
    const rawName = (nameInput?.value || '').trim() || 'Asora Aokita';
    const rawClass = (classInput?.value || '').trim() || 'XI-F10 / Angkatan 8';
    const rawBirth = (birthDateInput?.value || '').trim() || '2008-12-01';
    const formattedBirth = formatBirthDate(rawBirth);
    const age = calculateAge(rawBirth);
    const divKey = divisionSelect?.value || 'bahasa';
    const divLabel = divisionLabels[divKey] || divisionLabels['bahasa'];

    // Hitung Katakana & Romaji
    const katakana = indonesianToKatakana(rawName);
    const romaji = katakanaToRomajiReading(katakana);
    const atejiList = generateAtejiList(rawName, kanjiVariationSeed);
    const philosophy = buildAdaptivePhilosophy(atejiList, rawName, divKey);

    // Update Result UI
    if (resKatakana) resKatakana.textContent = katakana;
    if (resRomaji) resRomaji.textContent = `(${romaji})`;
    if (resAtejiPhilosophy) resAtejiPhilosophy.textContent = `"${philosophy}"`;

    if (resAtejiRow) {
      resAtejiRow.innerHTML = atejiList.map(a => `
        <div class="ateji-chip">
          <span class="ateji-kanji">${a.kanji}</span>
          <div class="ateji-chip-info">
            <strong class="ateji-reading">${a.reading}</strong>
            <span class="ateji-meaning">${a.meaning}</span>
          </div>
        </div>
      `).join('');
    }

    // Update Member Card DOM Preview
    if (mcardKatakana) mcardKatakana.textContent = katakana;
    if (mcardLatin) mcardLatin.textContent = rawName;
    if (mcardDivisionPill) mcardDivisionPill.textContent = divLabel;
    if (mcardClassPill) mcardClassPill.textContent = rawClass;
    if (mcardBirthVal) mcardBirthVal.textContent = formattedBirth;
    if (mcardAgeVal) mcardAgeVal.textContent = `${age} Tahun`;
  }

  // Listeners
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      window.MiraiSound?.playClickIfIdle();
      triggerGeneration();
    });
  }

  if (clearNameBtn && nameInput) {
    clearNameBtn.addEventListener('click', () => {
      nameInput.value = '';
      nameInput.focus();
      triggerGeneration();
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', triggerGeneration);
  }
  if (classInput) {
    classInput.addEventListener('input', triggerGeneration);
  }
  function syncBirthDateFromSelects() {
    if (!birthDaySelect || !birthMonthSelect || !birthYearSelect) return;
    const d = birthDaySelect.value.padStart(2, '0');
    const m = birthMonthSelect.value.padStart(2, '0');
    const y = birthYearSelect.value;
    if (birthDateInput) {
      birthDateInput.value = `${y}-${m}-${d}`;
    }
    triggerGeneration();
  }

  [birthDaySelect, birthMonthSelect, birthYearSelect].forEach((sel) => {
    if (sel) {
      sel.addEventListener('change', syncBirthDateFromSelects);
    }
  });

  if (birthDateInput) {
    birthDateInput.addEventListener('input', triggerGeneration);
    birthDateInput.addEventListener('change', triggerGeneration);
  }
  if (divisionSelect) {
    divisionSelect.addEventListener('change', triggerGeneration);
  }

  // Tab Toggle: Tampak Depan & Tampak Belakang
  const tabKtpFront = document.getElementById('tabKtpFront');
  const tabKtpBack = document.getElementById('tabKtpBack');
  const cardVisualFront = document.getElementById('memberCardVisual');
  const cardVisualBack = document.getElementById('memberCardVisualBack');

  if (tabKtpFront && tabKtpBack && cardVisualFront && cardVisualBack) {
    tabKtpFront.addEventListener('click', () => {
      tabKtpFront.classList.add('is-active');
      tabKtpFront.setAttribute('aria-selected', 'true');
      tabKtpBack.classList.remove('is-active');
      tabKtpBack.setAttribute('aria-selected', 'false');
      cardVisualFront.hidden = false;
      cardVisualBack.hidden = true;
    });

    tabKtpBack.addEventListener('click', () => {
      tabKtpBack.classList.add('is-active');
      tabKtpBack.setAttribute('aria-selected', 'true');
      tabKtpFront.classList.remove('is-active');
      tabKtpFront.setAttribute('aria-selected', 'false');
      cardVisualBack.hidden = false;
      cardVisualFront.hidden = true;
    });
  }

  // Audio Katakana Voice Button (Normal & Slow-Mo)
  if (listenKatakanaBtn) {
    listenKatakanaBtn.addEventListener('click', () => {
      const textToSpeak = resKatakana?.textContent || 'アソラ・アオキタ';
      if (window.speakText) {
        window.speakText(textToSpeak, 'ja-JP', false);
      } else if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(textToSpeak);
        u.lang = 'ja-JP';
        window.speechSynthesis.speak(u);
      }
    });
  }
  if (listenKatakanaSlowBtn) {
    listenKatakanaSlowBtn.addEventListener('click', () => {
      const textToSpeak = resKatakana?.textContent || 'アソラ・アオキタ';
      if (window.speakText) {
        window.speakText(textToSpeak, 'ja-JP', true);
      } else if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(textToSpeak);
        u.lang = 'ja-JP';
        u.rate = 0.48;
        window.speechSynthesis.speak(u);
      }
    });
  }

  // Helper load image for canvas
  function loadCardImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  // Rounded card shape helper
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // 3a. Unduh KTP Depan (.PNG)
  async function downloadFrontCard() {
    window.MiraiSound?.playClickIfIdle();
    const rawName = (nameInput?.value || '').trim() || 'Asora Aokita';
    const rawClass = (classInput?.value || '').trim() || 'XI-F10 / Angkatan 8';
    const rawBirth = (birthDateInput?.value || '').trim() || '2008-12-01';
    const formattedBirth = formatBirthDate(rawBirth);
    const divKey = divisionSelect?.value || 'bahasa';
    const divLabel = divisionLabels[divKey] || divisionLabels['bahasa'];
    const katakana = resKatakana?.textContent || indonesianToKatakana(rawName);
    const age = calculateAge(rawBirth);
    const ageText = `${age} Tahun`;

    // Preload Logo NK & Foto KTP (Foto Sora default atau Foto Upload Sendiri)
    const [logoImg, photoImg] = await Promise.all([
      loadCardImage('../images/mirai/logo/NK.png'),
      loadCardImage(photoState.src)
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // a. Background Gradient Putih & Pink Halus
    const bgGrad = ctx.createLinearGradient(0, 0, 1000, 600);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.55, '#fff2f6');
    bgGrad.addColorStop(1, '#fce7f0');
    ctx.fillStyle = bgGrad;
    roundRect(ctx, 0, 0, 1000, 600, 32);
    ctx.fill();

    // b. Decorative Outer Border (Rose Pink)
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(233, 30, 99, 0.45)';
    roundRect(ctx, 2, 2, 996, 596, 30);
    ctx.stroke();

    // c. Inner Dashed Border
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(233, 30, 99, 0.22)';
    roundRect(ctx, 16, 16, 968, 568, 20);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // d. Header: Logo NK (Lingkaran)
    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(68, 68, 28, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logoImg, 40, 40, 56, 56);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(68, 68, 28, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f472b6';
      ctx.stroke();
    } else {
      const nkGrad = ctx.createLinearGradient(40, 40, 96, 96);
      nkGrad.addColorStop(0, '#ff4081');
      nkGrad.addColorStop(1, '#e91e63');
      ctx.fillStyle = nkGrad;
      roundRect(ctx, 40, 40, 56, 56, 28);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NK', 68, 76);
    }

    // Brand Header: MIRAI NO HANA NIHONGO KURABU & Terjemahan Jepang
    ctx.textAlign = 'left';
    ctx.fillStyle = '#be185d';
    ctx.font = '900 21px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('MIRAI NO HANA NIHONGO KURABU', 112, 63);

    ctx.fillStyle = '#db2777';
    ctx.font = 'bold 14px "Noto Serif JP", serif';
    ctx.fillText('未来の花・日本語クラブ', 114, 86);

    // Header Right: Badge KARTU TANDA PENGENAL (Besar & Elegan)
    const badgeW = 240;
    const badgeH = 42;
    const badgeX = 720;
    const badgeY = 46;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 10);
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.8;
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 10);
    ctx.stroke();

    ctx.fillStyle = '#9d174d';
    ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.8px';
    ctx.fillText('KARTU TANDA PENGENAL', badgeX + (badgeW / 2), badgeY + 26);
    ctx.letterSpacing = '0px';

    // Garis Pemisah Header
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 112);
    ctx.lineTo(960, 112);
    ctx.stroke();
    ctx.setLineDash([]);

    // e. Pas Foto 3x4 Sora Resmi (di Sebelah KIRI)
    const photoX = 52;
    const photoY = 145;
    const photoW = 220;
    const photoH = 295;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, photoX, photoY, photoW, photoH, 14);
    ctx.fill();

    if (photoImg) {
      ctx.save();
      roundRect(ctx, photoX, photoY, photoW, photoH, 14);
      ctx.clip();

      const imgW = photoImg.naturalWidth || photoImg.width;
      const imgH = photoImg.naturalHeight || photoImg.height;
      const imgRatio = imgW / imgH;
      const frameRatio = photoW / photoH;
      let drawW, drawH;
      if (imgRatio > frameRatio) {
        drawH = photoH;
        drawW = photoH * imgRatio;
      } else {
        drawW = photoW;
        drawH = photoW / imgRatio;
      }

      const frameEl = document.getElementById('ktaPhotoBox') || document.querySelector('.mcard-photo-frame');
      const frameRect = frameEl ? frameEl.getBoundingClientRect() : { width: 104, height: 138 };
      const scaleRatio = (photoW / (frameRect.width || 104) + photoH / (frameRect.height || 138)) / 2;
      const canvasOffsetX = photoState.offsetX * scaleRatio;
      const canvasOffsetY = photoState.offsetY * scaleRatio;

      const cx = photoX + photoW / 2;
      const cy = photoY + photoH / 2;
      ctx.translate(cx + canvasOffsetX, cy + canvasOffsetY);
      ctx.scale(photoState.zoom, photoState.zoom);
      ctx.drawImage(photoImg, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }

    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2.5;
    roundRect(ctx, photoX, photoY, photoW, photoH, 14);
    ctx.stroke();

    // f. Informasi Identitas di Sebelah KANAN Foto (Sejajar Tengah dengan Pas Foto)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#881337';
    ctx.font = '900 42px "Noto Sans JP", Arial, sans-serif';
    ctx.fillText(katakana, 300, 180);

    ctx.fillStyle = '#1f2937';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(rawName, 302, 212);

    // Kotak Data Tabel Ala KTP
    const gridX = 300;
    const gridY = 228;
    const gridW = 650;
    const gridH = 212;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    roundRect(ctx, gridX, gridY, gridW, gridH, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, gridX, gridY, gridW, gridH, 14);
    ctx.stroke();

    const ktpFields = [
      { label: 'Kelas / 学年', val: rawClass },
      { label: 'Divisi / 所属', val: divLabel, isPink: true },
      { label: 'Tanggal Lahir / 生年月日', val: formattedBirth, isDate: true },
      { label: 'Usia / 年齢', val: ageText, isAge: true }
    ];

    ktpFields.forEach((item, idx) => {
      const y = gridY + 38 + (idx * 46);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(item.label, gridX + 20, y);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(':', gridX + 245, y);

      if (item.isPink) {
        ctx.fillStyle = '#be185d';
        ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      } else if (item.isDate) {
        ctx.fillStyle = '#9d174d';
        ctx.font = '700 16px monospace';
      } else if (item.isAge) {
        ctx.fillStyle = '#be185d';
        ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      } else {
        ctx.fillStyle = '#1f2937';
        ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
      }
      ctx.fillText(item.val, gridX + 265, y);
    });

    // g. Footer Credential & Barcode
    ctx.textAlign = 'left';
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 510);
    ctx.lineTo(960, 510);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#475569';
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SMA Wachid Hasyim 2 Taman Sidoarjo · Nihongo Kurabu', 48, 552);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.letterSpacing = '1px';
    ctx.fillText('||| | |||| | |||||| || | ||| |||| | ||||| | ||', 620, 552);

    // Trigger Download Depan
    const safeName = rawName.replace(/[^a-zA-Z0-9]/g, '-');
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KTP-Nihongo-Kurabu-Depan-${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  // 3b. Unduh KTP Belakang (.PNG) dengan Logo NK Besar di Tengah & Teks Besar
  async function downloadBackCard() {
    window.MiraiSound?.playClickIfIdle();
    const rawName = (nameInput?.value || '').trim() || 'Asora Aokita';

    // Preload Logo NK
    const logoImg = await loadCardImage('../images/mirai/logo/NK.png');

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // a. Background Gradient Putih & Pink Halus
    const bgGrad = ctx.createLinearGradient(0, 0, 1000, 600);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.55, '#fff2f6');
    bgGrad.addColorStop(1, '#fce7f0');
    ctx.fillStyle = bgGrad;
    roundRect(ctx, 0, 0, 1000, 600, 32);
    ctx.fill();

    // b. Decorative Outer Border (Rose Pink)
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(233, 30, 99, 0.45)';
    roundRect(ctx, 2, 2, 996, 596, 30);
    ctx.stroke();

    // c. Inner Dashed Border
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(233, 30, 99, 0.22)';
    roundRect(ctx, 16, 16, 968, 568, 20);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // d. Hero: Logo NK Besar di Tengah
    const logoRadius = 90;
    const logoCenterX = 500;
    const logoCenterY = 220;

    // Shadow & Background Circle untuk Logo
    ctx.save();
    ctx.shadowColor = 'rgba(244, 114, 182, 0.4)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoCenterX, logoCenterY, logoRadius - 6, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logoImg, logoCenterX - (logoRadius - 6), logoCenterY - (logoRadius - 6), (logoRadius - 6) * 2, (logoRadius - 6) * 2);
      ctx.restore();
    }

    // Border Lingkaran Logo NK
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoRadius, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f472b6';
    ctx.stroke();

    // e. Teks Nama Klub di Bawah Logo (Format Tengah & Diperbesar)
    ctx.textAlign = 'center';

    // Judul Romaji Besar
    ctx.fillStyle = '#be185d';
    ctx.font = '900 36px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('MIRAI NO HANA NIHONGO KURABU', 500, 375);

    // Subjudul Kanji / Katakana Besar
    ctx.fillStyle = '#9d174d';
    ctx.font = 'bold 28px "Noto Serif JP", serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('未来の花・日本語クラブ', 500, 428);
    ctx.letterSpacing = '0px';

    // Trigger Download Belakang
    const safeName = rawName.replace(/[^a-zA-Z0-9]/g, '-');
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KTP-Nihongo-Kurabu-Belakang-${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  // Connect Download Buttons
  const downloadCardFrontBtn = document.getElementById('downloadCardFrontBtn');
  const downloadCardBackBtn = document.getElementById('downloadCardBackBtn');
  const downloadCardPngBtn = document.getElementById('downloadCardPngBtn');

  if (downloadCardFrontBtn) {
    downloadCardFrontBtn.addEventListener('click', downloadFrontCard);
  }
  if (downloadCardPngBtn) {
    downloadCardPngBtn.addEventListener('click', downloadFrontCard);
  }
  if (downloadCardBackBtn) {
    downloadCardBackBtn.addEventListener('click', downloadBackCard);
  }

  // Trigger default generation
  triggerGeneration();
}


function setupStudioAll() {
  initStudioTranslator();
  initNameGenerator();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupStudioAll);
} else {
  setupStudioAll();
}
})();
