/**
 * File: js/stroke.js
 * Fungsi: Mesin animasi kanvas urutan goresan karakter Kanji dan kombinasi Kana Yoon di atas kisi Genkouyoushi.
 * Penggunaan: kamus/index.html dan kamus/kanji.html.
*/

window.currentPenSize = 'thick';

window.togglePenSize = function togglePenSize() {
// Fitur pemilihan ukuran kuas dinonaktifkan sesuai permintaan pengguna (kuas standar dipertahankan)
};

/* ==========================================================================
SKEMA VALIDASI DATA & MANAJEMEN CACHE RESMI (KANJIVG v4)
========================================================================== */

/**
 * Memvalidasi apakah rekaman data goresan mematuhi spesifikasi standar KanjiVG.
*/
function isValidStrokeRecord(record) {
if (!record || typeof record !== 'object') return false;
if (record.viewBox !== '0 0 109 109') return false;
if (!Array.isArray(record.paths) || record.paths.length === 0) return false;
for (let i = 0; i < record.paths.length; i++) {
  const p = record.paths[i];
  if (typeof p !== 'string' || !/^\s*[Mm]\s*[-\d\.]+/.test(p)) {
    return false;
  }
}
return true;
}

// Bersihkan cache lama (v1, v2, v3, v4) dari localStorage untuk menghemat storage perangkat pengguna
try {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && (k.startsWith("mirai_stroke_") || k.startsWith("kanjivg_cache_"))) {
      localStorage.removeItem(k);
    }
  }
} catch (e) {}

if (!window.MIRAI_STROKE_DATA) window.MIRAI_STROKE_DATA = window.STROKE_DATA || {};
window.STROKE_DATA = window.MIRAI_STROKE_DATA;

if (!window.MIRAI_STROKE_OVERRIDES) window.MIRAI_STROKE_OVERRIDES = window.STROKE_OVERRIDES || {};
window.STROKE_OVERRIDES = window.MIRAI_STROKE_OVERRIDES;

/**
 * Menerapkan lapisan override jika karakter memiliki modifikasi path, numbers, atau varian.
 */
function applyStrokeOverride(character, record) {
  if (!character || !record || typeof record !== 'object') return record;
  const overrides = window.MIRAI_STROKE_OVERRIDES || window.STROKE_OVERRIDES;
  const ov = overrides?.[character];
  if (ov) {
    if (Array.isArray(ov.paths) && ov.paths.length > 0) {
      record.paths = ov.paths;
    }
    if (Array.isArray(ov.numbers) && ov.numbers.length > 0) {
      record.numbers = ov.numbers;
    }
    if (ov.variant) {
      record.variant = ov.variant;
    }
    if (ov.note) {
      record.note = ov.note;
    }
    record.overridden = true;
  }
  return record;
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

const loadedStrokeChunks = new Set();
const strokeChunkLoadingPromises = {};

/**
 * Memuat berkas chunk goresan kanji lokal data/strokes/<jlpt>.json secara on-demand.
 * Menghilangkan kebutuhan mengunduh 4.2 MB di awal, memangkas bobot menjadi ~58-450 KB per level.
 */
async function loadStrokeChunk(jlptLevel) {
  if (!jlptLevel) return null;
  const rawLvl = String(jlptLevel).toLowerCase().trim();
  const lvl = rawLvl.startsWith("n") ? rawLvl : ("n" + rawLvl);
  if (loadedStrokeChunks.has(lvl)) return window.MIRAI_STROKE_DATA;
  if (strokeChunkLoadingPromises[lvl]) return strokeChunkLoadingPromises[lvl];

  strokeChunkLoadingPromises[lvl] = (async () => {
    const base = getAppBasePath();
    try {
      const res = await fetch(base + "data/strokes/" + lvl + ".json");
      if (res.ok) {
        const chunk = await res.json();
        if (!window.MIRAI_STROKE_DATA) window.MIRAI_STROKE_DATA = {};
        for (const [ch, rec] of Object.entries(chunk)) {
          window.MIRAI_STROKE_DATA[ch] = rec;
        }
        window.STROKE_DATA = window.MIRAI_STROKE_DATA;
        loadedStrokeChunks.add(lvl);
        return window.MIRAI_STROKE_DATA;
      }
    } catch (e) {
      console.warn("[stroke.js] Gagal memuat data/strokes/" + lvl + ".json:", e);
    }
    return null;
  })();

  return strokeChunkLoadingPromises[lvl];
}
window.loadStrokeChunk = loadStrokeChunk;

/**
 * Mengambil data goresan secara asinkron (100% lokal tanpa CDN eksternal):
 * 1. Karakter Kana: tersedia langsung dari dataset inline (window.MIRAI_STROKE_DATA)
 * 2. Karakter Kanji: diambil on-demand dari chunk lokal data/strokes/<jlpt>.json
 */
window.getStrokeDataAsync = async function getStrokeDataAsync(character, optionalJlpt) {
  if (!character) return null;

  // 1. Cek apakah sudah ada di memori lokal (Kana inline atau chunk kanji yang telah dimuat)
  const localRec = window.STROKE_DATA?.[character] || window.MIRAI_STROKE_DATA?.[character];
  if (localRec && isValidStrokeRecord(localRec)) {
    const finalRec = applyStrokeOverride(character, localRec);
    window.STROKE_DATA[character] = finalRec;
    window.MIRAI_STROKE_DATA[character] = finalRec;
    return finalRec;
  }

  // Multi-karakter (Yoon / kata gabungan)
  if (character.length > 1) {
    const parts = await Promise.all(Array.from(character).map((c) => window.getStrokeDataAsync(c, optionalJlpt)));
    if (parts.length > 0 && parts.every((p) => p && isValidStrokeRecord(p))) {
      return {
        isMulti: true,
        characters: Array.from(character),
        parts: parts,
        source: "KanjiVG"
      };
    }
    return null;
  }

  // 2. Muat chunk data/strokes/<jlpt>.json on-demand jika karakter berupa Kanji
  let targetLvl = optionalJlpt || window.getKanjiJlpt?.(character) || window.currentSelectedKanjiJlpt;
  if (targetLvl) {
    await loadStrokeChunk(targetLvl);
  }

  // Jika belum ditemukan di chunk target, periksa chunk lain yang belum dimuat
  if (!window.MIRAI_STROKE_DATA?.[character]) {
    for (const lvl of ['n5', 'n4', 'n3', 'n2', 'n1']) {
      if (!loadedStrokeChunks.has(lvl)) {
        await loadStrokeChunk(lvl);
        if (window.MIRAI_STROKE_DATA?.[character]) break;
      }
    }
  }

  const chunkRec = window.MIRAI_STROKE_DATA?.[character];
  if (chunkRec && isValidStrokeRecord(chunkRec)) {
    const finalRec = applyStrokeOverride(character, chunkRec);
    window.STROKE_DATA[character] = finalRec;
    window.MIRAI_STROKE_DATA[character] = finalRec;
    return finalRec;
  }

  return null;
};

// Helper cerdas menghitung posisi label angka urutan goresan pada canvas KanjiVG
function calculateStrokeNumbers(paths, officialNumbers) {
function parseStart(d) {
  let sx = 25, sy = 25;
  const m = /^[Mm]\s*([-\d\.]+)[,\s]+([-\d\.]+)/.exec(d);
  if (m) {
    sx = parseFloat(m[1]);
    sy = parseFloat(m[2]);
  }
  return { sx, sy };
}

const hasOfficial = Array.isArray(officialNumbers) && officialNumbers.length >= paths.length;
const placed = [];

paths.forEach((d, i) => {
  const { sx, sy } = parseStart(d);
  let nx, ny;

  if (hasOfficial && officialNumbers[i] && typeof officialNumbers[i].x === 'number') {
    nx = officialNumbers[i].x;
    ny = officialNumbers[i].y;
  } else {
    nx = sx >= 12 ? sx - 6.5 : sx + 6;
    ny = sy >= 12 ? sy - 2.5 : sy + 7;
  }

  nx = Math.max(5, Math.min(104, nx));
  ny = Math.max(5, Math.min(104, ny));

  placed.push({
    x: nx,
    y: ny,
    text: (hasOfficial && officialNumbers[i]?.text) ? officialNumbers[i].text : String(i + 1)
  });
});

return placed;
}

/* ==========================================================================
   OFFLINE HANDWRITING RECOGNITION & VECTOR STROKE SIMILARITY ENGINE
   Membandingkan goresan pengguna langsung terhadap kurva SVG KanjiVG asli (109x109)
   dengan normalisasi proporsional (aspect-ratio preserving) & multi-metrik presisi.
   ========================================================================== */

// Alias global window.STROKE_DATA jika belum didefinisikan
if (typeof window !== "undefined") {
  window.STROKE_DATA = window.STROKE_DATA || window.MIRAI_STROKE_DATA;
}

const _miraiSvgSampleCache = new Map();
let _miraiOffscreenSvg = null;
let _miraiOffscreenPath = null;

/**
 * Mengambil elemen path SVG offscreen untuk sampling geometris getPointAtLength.
 */
function getOffscreenSvgPath() {
  if (typeof document === "undefined") return null;
  if (!_miraiOffscreenPath) {
    try {
      _miraiOffscreenSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      _miraiOffscreenSvg.setAttribute("viewBox", "0 0 109 109");
      _miraiOffscreenSvg.setAttribute("width", "109");
      _miraiOffscreenSvg.setAttribute("height", "109");
      _miraiOffscreenSvg.setAttribute("aria-hidden", "true");
      _miraiOffscreenSvg.style.position = "absolute";
      _miraiOffscreenSvg.style.left = "-9999px";
      _miraiOffscreenSvg.style.top = "-9999px";
      _miraiOffscreenSvg.style.width = "0px";
      _miraiOffscreenSvg.style.height = "0px";
      _miraiOffscreenSvg.style.visibility = "hidden";
      _miraiOffscreenSvg.style.pointerEvents = "none";
      _miraiOffscreenPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      _miraiOffscreenSvg.appendChild(_miraiOffscreenPath);
      const hostEl = document.body || document.documentElement;
      if (hostEl) {
        hostEl.appendChild(_miraiOffscreenSvg);
      }
    } catch (e) {}
  }
  return _miraiOffscreenPath;
}

/**
 * Ekstraksi koordinat angka dari string SVG path (fallback aman jika di luar DOM).
 */
function extractCoordinatesFromSvgPath(d) {
  const points = [];
  if (typeof d !== "string") return points;
  const numRegex = /[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/g;
  const matches = [];
  let m;
  while ((m = numRegex.exec(d)) !== null) {
    matches.push(parseFloat(m[0]));
  }
  for (let i = 0; i < matches.length - 1; i += 2) {
    points.push({ x: matches[i], y: matches[i + 1] });
  }
  return points;
}

/**
 * 1. BANDINGKAN CORETAN LANGSUNG TERHADAP DATA VEKTOR SVG KANJIVG:
 * Mengambil titik-titik sampel (x, y) beserta vektor arah (dx, dy) langsung dari data path SVG
 * KanjiVG (109x109).
 *
 * @param {Array<string>|Object} strokesArray - Array string path SVG KanjiVG atau stroke record
 * @returns {Object} { points, strokes, strokeCount, bounds }
 */
function sampleSvgStrokesPoints(strokesArray) {
  let paths = [];
  if (Array.isArray(strokesArray)) {
    paths = strokesArray;
  } else if (strokesArray && Array.isArray(strokesArray.paths)) {
    paths = strokesArray.paths;
  } else if (strokesArray && typeof strokesArray.d === "string") {
    paths = [strokesArray.d];
  }
  if (!paths || paths.length === 0) {
    return {
      points: [],
      strokes: [],
      strokeCount: 0,
      bounds: { minX: 10, minY: 10, maxX: 99, maxY: 99, width: 89, height: 89, centerX: 54.5, centerY: 54.5, scale: 89 }
    };
  }

  const pathEl = getOffscreenSvgPath();
  const allPoints = [];
  const strokes = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  paths.forEach((d, strokeIdx) => {
    const strokePts = [];
    let strokeLen = 0;
    let pStart = { x: 54.5, y: 54.5 };
    let pEnd = { x: 54.5, y: 54.5 };

    if (pathEl && typeof pathEl.getTotalLength === "function") {
      try {
        pathEl.setAttribute("d", d);
        strokeLen = pathEl.getTotalLength();
      } catch (e) {
        strokeLen = 0;
      }
    }

    if (strokeLen > 0) {
      pStart = pathEl.getPointAtLength(0);
      pEnd = pathEl.getPointAtLength(strokeLen);
      // Sample titik setiap ~3.2 unit di ruang 109x109
      const step = 3.2;
      const numSamples = Math.max(5, Math.round(strokeLen / step));
      for (let s = 0; s <= numSamples; s++) {
        const dist = (s / numSamples) * strokeLen;
        const pt = pathEl.getPointAtLength(dist);
        const ptFwd = pathEl.getPointAtLength(Math.min(strokeLen, dist + 1.2));
        const fwdDx = ptFwd.x - pt.x;
        const fwdDy = ptFwd.y - pt.y;
        const fwdLen = Math.hypot(fwdDx, fwdDy) || 1;
        const ptObj = {
          x: pt.x,
          y: pt.y,
          dx: fwdDx / fwdLen,
          dy: fwdDy / fwdLen,
          strokeIndex: strokeIdx
        };
        strokePts.push(ptObj);
        allPoints.push(ptObj);
        minX = Math.min(minX, pt.x);
        minY = Math.min(minY, pt.y);
        maxX = Math.max(maxX, pt.x);
        maxY = Math.max(maxY, pt.y);
      }
    } else {
      const coords = extractCoordinatesFromSvgPath(d);
      if (coords.length > 0) {
        pStart = coords[0];
        pEnd = coords[coords.length - 1];
        coords.forEach((c) => {
          const ptObj = { x: c.x, y: c.y, dx: 0, dy: 0, strokeIndex: strokeIdx };
          strokePts.push(ptObj);
          allPoints.push(ptObj);
          minX = Math.min(minX, c.x);
          minY = Math.min(minY, c.y);
          maxX = Math.max(maxX, c.x);
          maxY = Math.max(maxY, c.y);
        });
      }
    }

    const sdx = pEnd.x - pStart.x;
    const sdy = pEnd.y - pStart.y;
    const sHypot = Math.hypot(sdx, sdy);
    const sLen = sHypot > 0.001 ? sHypot : 1;
    const strokeDir = {
      vx: sHypot > 0.001 ? sdx / sLen : 0,
      vy: sHypot > 0.001 ? sdy / sLen : 0,
      length: strokeLen || sHypot,
      start: { x: pStart.x, y: pStart.y },
      end: { x: pEnd.x, y: pEnd.y }
    };

    strokes.push({
      strokeIndex: strokeIdx,
      points: strokePts,
      strokeDir,
      length: strokeLen || sHypot
    });
  });

  if (allPoints.length === 0 || !isFinite(minX)) {
    minX = 10; minY = 10; maxX = 99; maxY = 99;
  }
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const scale = Math.max(width, height, 1);

  return {
    points: allPoints,
    strokes,
    strokeCount: paths.length,
    bounds: { minX, minY, maxX, maxY, width, height, centerX, centerY, scale }
  };
}

/**
 * Mengubah goresan coretan pengguna dari piksel kanvas ke koordinat 109x109 dengan arc-length resampling.
 */
function sampleUserStrokes(userStrokes, canvasW = 260, canvasH = 260) {
  if (!userStrokes || userStrokes.length === 0) return null;
  const scaleX = 109 / (canvasW || 260);
  const scaleY = 109 / (canvasH || 260);

  const allPoints = [];
  const strokes = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let rawPointCount = 0;

  userStrokes.forEach((stroke, strokeIdx) => {
    if (!stroke || stroke.length === 0) return;
    rawPointCount += stroke.length;
    const svgPts = stroke.map((p) => ({ x: p.x * scaleX, y: p.y * scaleY }));
    if (svgPts.length === 1) {
      const p = svgPts[0];
      const ptObj = { x: p.x, y: p.y, dx: 0, dy: 0, strokeIndex: strokeIdx };
      allPoints.push(ptObj);
      minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
      strokes.push({
        strokeIndex: strokeIdx,
        points: [ptObj],
        strokeDir: { vx: 0, vy: 0, length: 0, start: p, end: p },
        length: 0
      });
      return;
    }

    const dists = [0];
    let totalLen = 0;
    for (let i = 1; i < svgPts.length; i++) {
      const segLen = Math.hypot(svgPts[i].x - svgPts[i - 1].x, svgPts[i].y - svgPts[i - 1].y);
      totalLen += segLen;
      dists.push(totalLen);
    }

    const strokePts = [];
    const pStart = svgPts[0];
    const pEnd = svgPts[svgPts.length - 1];
    const step = 3.2;
    const numSamples = Math.max(4, Math.round(totalLen / step));

    let curSeg = 0;
    for (let s = 0; s <= numSamples; s++) {
      const targetDist = (s / numSamples) * totalLen;
      while (curSeg < dists.length - 2 && dists[curSeg + 1] < targetDist) {
        curSeg++;
      }
      const segStartDist = dists[curSeg];
      const segEndDist = dists[curSeg + 1];
      const segLen = segEndDist - segStartDist;
      const t = segLen > 0 ? (targetDist - segStartDist) / segLen : 0;
      const px = svgPts[curSeg].x + (svgPts[curSeg + 1].x - svgPts[curSeg].x) * t;
      const py = svgPts[curSeg].y + (svgPts[curSeg + 1].y - svgPts[curSeg].y) * t;

      const segDx = svgPts[curSeg + 1].x - svgPts[curSeg].x;
      const segDy = svgPts[curSeg + 1].y - svgPts[curSeg].y;
      const segHypot = Math.hypot(segDx, segDy) || 1;

      const ptObj = {
        x: px,
        y: py,
        dx: segDx / segHypot,
        dy: segDy / segHypot,
        strokeIndex: strokeIdx
      };
      strokePts.push(ptObj);
      allPoints.push(ptObj);
      minX = Math.min(minX, px); minY = Math.min(minY, py);
      maxX = Math.max(maxX, px); maxY = Math.max(maxY, py);
    }

    const sdx = pEnd.x - pStart.x;
    const sdy = pEnd.y - pStart.y;
    const sHypot = Math.hypot(sdx, sdy);
    const sLen = sHypot > 0.001 ? sHypot : 1;
    strokes.push({
      strokeIndex: strokeIdx,
      points: strokePts,
      strokeDir: {
        vx: sHypot > 0.001 ? sdx / sLen : 0,
        vy: sHypot > 0.001 ? sdy / sLen : 0,
        length: totalLen,
        start: pStart,
        end: pEnd
      },
      length: totalLen
    });
  });

  if (allPoints.length < 3 || rawPointCount < 3) return null;
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  if (width < 3 && height < 3) return null;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const scale = Math.max(width, height, 1);

  return {
    points: allPoints,
    strokes,
    strokeCount: userStrokes.length,
    bounds: { minX, minY, maxX, maxY, width, height, centerX, centerY, scale }
  };
}

/**
 * 2. NORMALISASI ASPECT-RATIO PRESERVING:
 * Menggunakan skala proporsional (scale = Math.max(w, h)) dengan perataan titik tengah (centroid)
 * agar huruf ramping / pipih seperti 一, 十, ナ, ノ, リ tidak pernah melar atau gepeng.
 */
function normalizePoints(points, bounds) {
  if (!points || !bounds) return [];
  const scale = bounds.scale || Math.max(bounds.width || 1, bounds.height || 1, 1);
  const cx = bounds.centerX ?? ((bounds.minX + bounds.maxX) / 2);
  const cy = bounds.centerY ?? ((bounds.minY + bounds.maxY) / 2);
  return points.map((p) => ({
    x: (p.x - cx) / scale,
    y: (p.y - cy) / scale,
    dx: p.dx || 0,
    dy: p.dy || 0,
    strokeIndex: p.strokeIndex
  }));
}

/**
 * Menghitung Bidirectional Chamfer Distance dengan zona toleransi ketebalan kuas
 * dan kurva Gaussian lembut.
 */
function computeChamferScore(pointsA, pointsB, toleranceRadius, decaySigma) {
  if (!pointsA || !pointsB || pointsA.length === 0 || pointsB.length === 0) return 0;

  // A -> B: Jarak tiap titik A ke titik terdekat B
  let sumScoreAtoB = 0;
  for (let i = 0; i < pointsA.length; i++) {
    const ax = pointsA[i].x;
    const ay = pointsA[i].y;
    let minDistSq = Infinity;
    for (let j = 0; j < pointsB.length; j++) {
      const dx = ax - pointsB[j].x;
      const dy = ay - pointsB[j].y;
      const dSq = dx * dx + dy * dy;
      if (dSq < minDistSq) {
        minDistSq = dSq;
        if (minDistSq <= 0.0001) break;
      }
    }
    const minDist = Math.sqrt(minDistSq);
    const effectiveDist = Math.max(0, minDist - toleranceRadius);
    const ptScore = Math.exp(-Math.pow(effectiveDist / decaySigma, 2));
    sumScoreAtoB += ptScore;
  }
  const scoreAtoB = sumScoreAtoB / pointsA.length;

  // B -> A: Jarak tiap titik acuan B ke titik terdekat A
  let sumScoreBtoA = 0;
  for (let j = 0; j < pointsB.length; j++) {
    const bx = pointsB[j].x;
    const by = pointsB[j].y;
    let minDistSq = Infinity;
    for (let i = 0; i < pointsA.length; i++) {
      const dx = bx - pointsA[i].x;
      const dy = by - pointsA[i].y;
      const dSq = dx * dx + dy * dy;
      if (dSq < minDistSq) {
        minDistSq = dSq;
        if (minDistSq <= 0.0001) break;
      }
    }
    const minDist = Math.sqrt(minDistSq);
    const effectiveDist = Math.max(0, minDist - toleranceRadius);
    const ptScore = Math.exp(-Math.pow(effectiveDist / decaySigma, 2));
    sumScoreBtoA += ptScore;
  }
  const scoreBtoA = sumScoreBtoA / pointsB.length;

  if (scoreAtoB + scoreBtoA < 1e-6) return 0;
  return ((2 * scoreAtoB * scoreBtoA) / (scoreAtoB + scoreBtoA)) * 100;
}

/**
 * 3. RUMUS SKOR MULTI-METRIK YANG ADIL & PRESISI:
 * A. Akurasi Bentuk & Jalur (Bobot 55%): Gabungan Direct Canvas Overlap & Centered Proportional
 * B. Akurasi Arah & Urutan Goresan (Bobot 25%): Cosine similarity vektor garis start -> end
 * C. Ketepatan Jumlah Goresan (Bobot 20%): 100% jika sama persis, 60% jika beda 1, 30% jika beda 2
 */
function computeStrokeSimilarity(userSample, refSample) {
  if (!userSample || !refSample || userSample.points.length === 0 || refSample.points.length === 0) {
    return 0;
  }

  // --- METRIK A: AKURASI BENTUK & JALUR (55%) ---
  // 1. Direct Canvas Overlap (ruang 109x109, toleranceRadius = 5.5, decaySigma = 10.5)
  const scoreDirect = computeChamferScore(userSample.points, refSample.points, 5.5, 10.5);

  // 2. Centered Proportional Shape Matching (ruang ternormalisasi [-0.5, 0.5], toleranceRadius = 0.05, decaySigma = 0.14)
  const userNormPts = normalizePoints(userSample.points, userSample.bounds);
  const refNormPts = normalizePoints(refSample.points, refSample.bounds);
  let scoreProp = computeChamferScore(userNormPts, refNormPts, 0.05, 0.14);

  // Penyesuaian rasio aspek jika user menggambar di luar rasio acuan
  const uAr = userSample.bounds.width / userSample.bounds.height;
  const rAr = refSample.bounds.width / refSample.bounds.height;
  const arRatio = Math.max(uAr / rAr, rAr / uAr);
  if (arRatio > 1.3) {
    scoreProp *= Math.max(0.2, 1.0 - Math.log(arRatio) * 0.5);
  }

  const metricA = Math.min(100, Math.max(0, Math.max(scoreDirect, scoreProp)));

  // --- METRIK B: AKURASI ARAH & URUTAN GORESAN (25%) ---
  const uStrokes = userSample.strokes;
  const rStrokes = refSample.strokes;
  const maxStrokes = Math.max(uStrokes.length, rStrokes.length);
  const minStrokes = Math.min(uStrokes.length, rStrokes.length);
  let metricB = 0;

  if (maxStrokes > 0) {
    let totalDirScore = 0;
    for (let i = 0; i < minStrokes; i++) {
      const uDir = uStrokes[i].strokeDir;
      const rDir = rStrokes[i].strokeDir;
      if (uDir.length < 5 || rDir.length < 5) {
        totalDirScore += 0.95;
      } else {
        const dot = (uDir.vx * rDir.vx + uDir.vy * rDir.vy);
        let dirScore;
        if (dot >= 0.7) {
          dirScore = 0.88 + 0.12 * ((dot - 0.7) / 0.3);
        } else if (dot >= 0) {
          dirScore = 0.50 + 0.38 * (dot / 0.7);
        } else {
          dirScore = Math.max(0.1, 0.50 * (1 + dot));
        }
        totalDirScore += dirScore;
      }
    }
    // Goresan yang tidak dibuat mendapat nilai arah 0
    metricB = Math.min(100, Math.max(0, (totalDirScore / maxStrokes) * 100));
  }

  // --- METRIK C: KETEPATAN JUMLAH GORESAN (20%) ---
  const diff = Math.abs(userSample.strokeCount - refSample.strokeCount);
  let metricC = 0;
  if (diff === 0) {
    metricC = 100;
  } else if (diff === 1) {
    metricC = 60;
  } else if (diff === 2) {
    metricC = 30;
  } else {
    metricC = Math.max(0, 30 - (diff - 2) * 10);
  }

  const total = metricA * 0.55 + metricB * 0.25 + metricC * 0.20;
  return Math.min(100, Math.max(0, Math.round(total)));
}

/**
 * 4. DETEKSI KANDIDAT & EVALUASI KEMIRIPAN KANVAS CERDAS & RELEVAN:
 */
function evaluateCanvasSimilarity(userStrokes, targetChar, targetRecord, options = {}) {
  const canvasW = options.canvasW || 260;
  const canvasH = options.canvasH || 260;
  const userSample = sampleUserStrokes(userStrokes, canvasW, canvasH);
  if (!userSample) return { accuracy: null, candidates: [] };

  // Helper kelompok aksara
  function getScriptGroup(ch) {
    if (!ch) return "unknown";
    const cp = ch.codePointAt(0);
    if (cp >= 0x3040 && cp <= 0x309F) return "hiragana";
    if (cp >= 0x30A0 && cp <= 0x30FF) return "katakana";
    if (cp >= 0x4E00 && cp <= 0x9FAF) return "kanji";
    return "other";
  }

  const activeGroup = targetChar ? getScriptGroup(targetChar) : "unknown";

  // 1. Evaluasi akurasi terhadap karakter target yang sedang aktif
  let accuracy = null;
  if (targetChar && targetRecord && Array.isArray(targetRecord.paths) && targetRecord.paths.length > 0) {
    let targetSample = _miraiSvgSampleCache.get(targetChar);
    if (!targetSample) {
      targetSample = sampleSvgStrokesPoints(targetRecord.paths);
      if (targetSample) _miraiSvgSampleCache.set(targetChar, targetSample);
    }
    if (targetSample) {
      accuracy = computeStrokeSimilarity(userSample, targetSample);
    }
  }

  // 2. Evaluasi kandidat mirip dari dataset SVG
  const strokeData = window.STROKE_DATA || window.MIRAI_STROKE_DATA || {};
  const candidatesMap = new Map();

  // Karakter target selalu diikutkan jika akurasi terhitung
  if (targetChar && accuracy !== null) {
    candidatesMap.set(targetChar, { char: targetChar, score: accuracy });
  }

  const uStrokeCount = userStrokes.length;
  const entries = Object.entries(strokeData);

  // Saring entri berdasarkan selisih goresan
  const qualified = entries.filter(([ch, rec]) => {
    if (!rec || !Array.isArray(rec.paths) || rec.paths.length === 0) return false;
    const strokeDiff = Math.abs(rec.paths.length - uStrokeCount);
    return strokeDiff <= 1;
  });

  const pool = qualified.length >= 4 ? qualified : entries.filter(([ch, rec]) => {
    if (!rec || !Array.isArray(rec.paths) || rec.paths.length === 0) return false;
    return Math.abs(rec.paths.length - uStrokeCount) <= 2;
  });

  // Prioritaskan kandidat satu rumpun aksara (hiragana/katakana/kanji) terlebih dahulu
  let prioritizedPool = pool;
  if (activeGroup !== "unknown") {
    prioritizedPool = pool.slice().sort(([chA], [chB]) => {
      const matchA = getScriptGroup(chA) === activeGroup ? 1 : 0;
      const matchB = getScriptGroup(chB) === activeGroup ? 1 : 0;
      return matchB - matchA;
    });
  }

  // Batasi pool evaluasi hingga maksimal 45 kandidat teratas untuk memprioritaskan fluiditas 60 FPS di mobile
  const evaluationPool = prioritizedPool.slice(0, 45);

  for (const [ch, rec] of evaluationPool) {
    if (ch === targetChar) continue;
    let refSample = _miraiSvgSampleCache.get(ch);
    if (!refSample) {
      refSample = sampleSvgStrokesPoints(rec.paths);
      if (refSample) _miraiSvgSampleCache.set(ch, refSample);
    }
    if (!refSample) continue;

    let score = computeStrokeSimilarity(userSample, refSample);
    // Beri dorongan relevansi jika satu rumpun aksara dengan tab yang sedang aktif
    if (activeGroup !== "unknown" && getScriptGroup(ch) === activeGroup) {
      score = Math.min(100, score + 4);
    }
    if (score >= 32) {
      candidatesMap.set(ch, { char: ch, score });
    }
  }

  let candidates = Array.from(candidatesMap.values());
  candidates.sort((a, b) => b.score - a.score);

  // Pastikan jika karakter target cukup mirip (>= 60%), tampil sebagai kandidat #1
  if (targetChar && accuracy !== null && accuracy >= 60) {
    const targetIdx = candidates.findIndex((c) => c.char === targetChar);
    if (targetIdx > 0) {
      const [tCand] = candidates.splice(targetIdx, 1);
      candidates.unshift(tCand);
    }
  }

  return {
    accuracy,
    candidates: candidates.slice(0, 4)
  };
}

/**
 * Kompatibilitas mundur: identifyCharacterFromDrawing memanggil evaluateCanvasSimilarity
 */
function identifyCharacterFromDrawing(userStrokes, targetChar, targetRecord, options = {}) {
  return evaluateCanvasSimilarity(userStrokes, targetChar, targetRecord, options);
}

// Ekspor ke window untuk aksesibilitas dan pengujian
if (typeof window !== "undefined") {
  window.sampleSvgStrokesPoints = sampleSvgStrokesPoints;
  window.sampleUserStrokes = sampleUserStrokes;
  window.normalizePoints = normalizePoints;
  window.computeChamferScore = computeChamferScore;
  window.computeStrokeSimilarity = computeStrokeSimilarity;
  window.evaluateCanvasSimilarity = evaluateCanvasSimilarity;
  window.identifyCharacterFromDrawing = identifyCharacterFromDrawing;
}

/* ==========================================================================
   PEMUTAR ANIMASI GORESAN & STUDIO TUNGGAL (createStrokePlayer)
   ========================================================================== */

window.createStrokePlayer = function createStrokePlayer(host, kanaString, fallbackCount, options = {}) {
  if (!host) return null;

  // 1. Batalkan dan bersihkan instance pemutar lama pada host yang sama
  if (host._miraiStrokeController && typeof host._miraiStrokeController.destroy === "function") {
    try {
      host._miraiStrokeController.destroy();
    } catch (e) {}
    host._miraiStrokeController = null;
  }

  // 2. Penghitung generasi host untuk mencegah hasil permintaan lama menimpa karakter baru
  host._miraiStrokeGen = (host._miraiStrokeGen || 0) + 1;
  const currentGen = host._miraiStrokeGen;

  const showClearControl = options.showClear === true;
  let destroyed = false;
  let internalController = null;

  let currentChar = kanaString || null;
  let characters = currentChar ? Array.from(currentChar) : [];
  let isMulti = characters.length > 1;

  // Helper data karakter lokal dengan proteksi lapisan override
  const getCached = (c) => {
    const rec = window.MIRAI_STROKE_DATA?.[c];
    return (rec && isValidStrokeRecord(rec)) ? applyStrokeOverride(c, rec) : null;
  };

  function renderUnavailableState() {
    if (destroyed || !host) return;

    host.innerHTML = `
      <div class="stroke-stage stroke-unavailable ${window.currentPenSize === 'thick' ? 'stroke-thick' : 'stroke-thin'}" aria-label="Urutan goresan ${currentChar || ''} belum tersedia">
        <div class="kanjivg-char-box single-char" style="position:relative; width:100%; max-width:200px; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;">
          <svg viewBox="0 0 109 109" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; display:block;" role="img" aria-label="Kanvas ${currentChar || ''}">
            <g class="stroke-grid-group" aria-hidden="true">
              <line x1="5" y1="54.5" x2="104" y2="54.5" class="stroke-grid-line" />
              <line x1="54.5" y1="5" x2="54.5" y2="104" class="stroke-grid-line" />
            </g>
          </svg>
          <span class="stroke-fallback-glyph" style="position:absolute; font-size:${isMulti ? '70px' : '110px'}; opacity:0.65; user-select:none;">${currentChar || ''}</span>
        </div>
      </div>
      <div class="stroke-unavailable-box" style="margin: 14px 0 8px; text-align: center;">
        <p class="stroke-source" style="margin:0 0 4px; font-weight:700; color:var(--pink, #e91e63);">Data Urutan Goresan Belum Tersedia</p>
        <p class="stroke-guide" style="margin:0; font-size:12.5px; color:var(--muted, #666); line-height:1.5;">
          Vektor kurva goresan resmi untuk karakter <b>&ldquo;${currentChar || ''}&rdquo;</b> belum terdaftar dalam pustaka offline.
        </p>
      </div>
    `;

    internalController = {
      destroy: () => { destroyed = true; },
      play: () => {},
      pause: () => {},
      resume: () => {},
      togglePlay: () => {},
      replay: () => {},
      prev: () => {},
      next: () => {},
      reset: () => {},
      clear: () => {},
      isAvailable: false,
      getStep: () => 0,
      getTotalSteps: () => 0,
      isPlaying: () => false,
      isPaused: () => false,
      loadCharacter: () => {}
    };
    host._miraiStrokeController = internalController;
  }

  function setupStudio(records = []) {
    if (destroyed || !host) return;

    const hasRecords = records.length > 0 && records.every((rec) => rec && isValidStrokeRecord(rec));
    const totalStrokes = hasRecords ? records.reduce((sum, rec) => sum + rec.paths.length, 0) : 0;
    const isYoon = characters.length === 2;
    const stageClass = isYoon ? "is-yoon" : (characters.length > 2 ? "is-multi" : "");
    const canvasW = isYoon ? 360 : (characters.length > 2 ? 420 : 260);
    const canvasH = isYoon ? 212 : (characters.length > 2 ? 190 : 260);

    // Catatan varian gaya kyokasho dsb.
    const notes = records
      .filter((r) => r && (r.note || r.variant))
      .map((r) => r.note || (r.variant === "kyokasho" ? "Gaya buku teks resmi (kyōkasho)." : `Varian: ${r.variant}`));
    const noteHtml = notes.length > 0 ? `
      <div class="stroke-variant-note" role="note" aria-label="Catatan varian karakter">
        <span class="stroke-note-icon" aria-hidden="true">💡</span>
        <span class="stroke-note-text">${notes.join(" • ")}</span>
      </div>
    ` : "";

    // Tombol lapor goresan jika ada karakter aktif
    let reportBtnHtml = "";
    if (currentChar) {
      const firstChar = characters[0] || currentChar;
      const cp = firstChar.codePointAt(0) || 0;
      const hexCode = cp.toString(16).padStart(5, "0").toUpperCase();
      const prefillParam = encodeURIComponent(`Laporan Goresan: ${currentChar} (U+${hexCode})`);
      const reportUrl = `https://forms.gle/dFPRM842xxKq5YMt9?usp=pp_url&entry.lapor=${prefillParam}`;
      reportBtnHtml = `
        <a href="${reportUrl}" target="_blank" rel="noopener noreferrer" class="stroke-report-pill stroke-report-link" title="Buka formulir untuk melaporkan goresan ${currentChar} (U+${hexCode})">
          <span class="report-icon">🚩</span>
          <span class="report-text">Lapor goresan salah</span>
        </a>
      `;
    }

    // Step thumbnail pills jika ada rekaman goresan
    let strokeThumbsHtml = "";
    if (hasRecords && totalStrokes > 0) {
      const flattenedStrokes = [];
      records.forEach((rec, cIdx) => {
        rec.paths.forEach((d, pIdx) => {
          flattenedStrokes.push({
            charIdx: cIdx,
            pathIdx: pIdx,
            paths: rec.paths,
            d: d
          });
        });
      });
      strokeThumbsHtml = flattenedStrokes.map((item, index) => {
        const prevPaths = item.paths.slice(0, item.pathIdx);
        const prevSvg = prevPaths.map((p) => `<path d="${p}" class="step-thumb-prev"></path>`).join("");
        const currentSvg = `<path d="${item.d}" class="step-thumb-current"></path>`;
        return `<li class="stroke-step-thumb" data-stroke-step="${index}" title="Goresan ke-${index + 1}">` +
          `<span class="step-thumb-badge">${index + 1}</span>` +
          `<svg class="step-thumb-svg" viewBox="-8 -8 125 125" aria-hidden="true">` +
          `<line x1="5" y1="54.5" x2="104" y2="54.5" class="step-thumb-grid"></line>` +
          `<line x1="54.5" y1="5" x2="54.5" y2="104" class="step-thumb-grid"></line>` +
          `${prevSvg}` +
          `${currentSvg}` +
          `</svg>` +
          `</li>`;
      }).join("");
    }

    // Render Kerangka Studio Kotak Tunggal (Unified Single Box)
    host.innerHTML = `
      <div class="stroke-unified-studio">
        <!-- STUDIO HEADER -->
        <div class="unified-studio-header">
          <div class="unified-studio-title-wrap">
            <span class="unified-studio-badge">✨ Kanvas Goresan Interaktif</span>
            <span class="unified-studio-sub">${currentChar ? `Acuan resmi &amp; latihan mandiri: <b>${currentChar}</b>` : "Coretkan aksara untuk mencari atau amati urutan"}</span>
          </div>
          <div class="unified-studio-status-wrap">
            ${currentChar && totalStrokes > 0 ? `<span class="stroke-status-pill">Goresan <b data-stroke-number>1</b> / ${totalStrokes}</span>` : `<span class="stroke-status-pill mode-free">Mode Coretan Bebas</span>`}
          </div>
        </div>

        <!-- UNIFIED STAGE (KOTAK TUNGGAL INTERAKTIF) -->
        <div class="unified-canvas-stage ${stageClass}" data-unified-stage>
          <!-- Overlay Garis Bantu Salib Genkouyoushi -->
          <div class="unified-grid-overlay" data-guide-grid ${isMulti ? 'style="display:none;"' : ''}>
            <div class="grid-cross-h"></div>
            <div class="grid-cross-v"></div>
          </div>

          <!-- Layer SVG Acuan Vektor & Animasi -->
          <div class="unified-svg-layer stroke-stage ${window.currentPenSize === 'thick' ? 'stroke-thick' : 'stroke-thin'}" data-official-layer></div>

          <!-- Kanvas Menggambar User (Mouse & Sentuh) -->
          <canvas class="unified-draw-canvas" width="${canvasW}" height="${canvasH}" aria-label="Kanvas menulis interaktif"></canvas>
        </div>

        <!-- TOOLBAR KANVAS (BERSIHKAN, UNDO, PANDUAN ON/OFF) -->
        <div class="unified-toolbar">
          <button type="button" class="studio-tool-btn" data-canvas-clear title="Hapus coretan pada kanvas">
            🗑️ Bersihkan
          </button>
          <button type="button" class="studio-tool-btn" data-canvas-undo title="Batalkan goresan terakhir">
            ↩️ Undo
          </button>
          <button type="button" class="studio-tool-btn is-active" data-canvas-guide-toggle title="Nyalakan atau matikan garis panduan &amp; bayangan acuan">
            👁️ Panduan: ON
          </button>
        </div>

        <!-- KONTROL ANIMASI RESMI -->
        <div class="unified-controls-bar stroke-controls" role="toolbar" aria-label="Kontrol animasi goresan" ${(!currentChar || totalStrokes === 0) ? 'style="display:none;"' : ''}>
          <button type="button" data-stroke-prev aria-label="Langkah sebelumnya" title="Langkah sebelumnya">⏮</button>
          <button type="button" data-stroke-play aria-label="Putar animasi goresan">PUTAR ▶</button>
          <button type="button" data-stroke-next aria-label="Langkah berikutnya" title="Langkah berikutnya">⏭</button>
          <label class="stroke-speed-label">Kecepatan<select data-stroke-speed aria-label="Kecepatan animasi stroke">
            <option value="1.6">0.5×</option>
            <option value="1" selected>1×</option>
            <option value="0.72">1.5×</option>
            <option value="0.52">2×</option>
          </select></label>
        </div>

        <!-- THUMBNAIL URUTAN GORESAN (MINI PILLS) -->
        ${strokeThumbsHtml ? `<ol class="stroke-order unified-stroke-order" aria-label="Urutan visual goresan">${strokeThumbsHtml}</ol>` : ''}

        <!-- AREA IDENTIFIKASI CORETAN & AKURASI KEMIRIPAN -->
        <div class="unified-recognition-card" data-recognition-card style="display:none;">
          <div class="unified-accuracy-row" data-accuracy-row style="display:none;">
            <span class="accuracy-icon">🎯</span>
            <span class="accuracy-label">Kemiripan:</span>
            <span class="accuracy-badge" data-accuracy-badge>0%</span>
            <span class="accuracy-text" data-accuracy-text></span>
          </div>

          <div class="unified-search-row" data-search-row style="display:none;">
            <div class="search-row-head">
              <span class="search-sparkle">🔍</span>
              <span class="search-title">Terdeteksi mirip:</span>
            </div>
            <div class="search-candidates-list" data-search-candidates></div>
          </div>
        </div>

        <!-- FOOTER: CATATAN VARIAN & LAPOR GORESAN -->
        <div class="stroke-footer-bar">
          ${noteHtml}
          <div class="stroke-footer-actions">
            ${reportBtnHtml}
          </div>
        </div>
      </div>
    `;

    // Render layer SVG resmi di dalam tahap kanvas tunggal
    const svgLayer = host.querySelector("[data-official-layer]");
    let lines = [];
    let numberLabels = [];

    if (hasRecords && totalStrokes > 0 && svgLayer) {
      svgLayer.innerHTML = "";
      svgLayer.style.display = "flex";
      svgLayer.style.flexDirection = "row";
      svgLayer.style.flexWrap = "nowrap";
      svgLayer.style.minHeight = "0";
      svgLayer.style.justifyContent = "center";
      svgLayer.style.alignItems = "center";
      svgLayer.style.gap = isYoon ? "10px" : (characters.length > 2 ? "6px" : "0px");
      svgLayer.style.width = "100%";
      svgLayer.style.height = "100%";

      let globalOffset = 0;
      characters.forEach((char, index) => {
        const charWrapper = document.createElement("div");
        charWrapper.className = `kanjivg-char-box ${isYoon ? 'yoon-char' : (characters.length > 2 ? 'multi-char' : 'single-char')}`;
        charWrapper.style.position = "relative";
        charWrapper.style.display = "flex";
        charWrapper.style.alignItems = "center";
        charWrapper.style.justifyContent = "center";
        charWrapper.style.minWidth = "0";
        charWrapper.style.minHeight = "0";
        if (isYoon) {
          charWrapper.style.flex = "1 1 0%";
          charWrapper.style.maxWidth = "160px";
          charWrapper.style.height = "94%";
          charWrapper.style.aspectRatio = "1 / 1";
        }

        const rec = records[index];
        const paths = rec.paths;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 109 109");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", `Urutan goresan ${char}`);
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";

        // Genkouyoushi Dashed Grid di dalam tiap SVG (agar selalu simetris dan pas di tiap kotak huruf)
        const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gridGroup.setAttribute("class", "stroke-grid-group");
        gridGroup.innerHTML = `
          <line x1="5" y1="54.5" x2="104" y2="54.5" class="stroke-grid-line"></line>
          <line x1="54.5" y1="5" x2="54.5" y2="104" class="stroke-grid-line"></line>
        `;
        svg.appendChild(gridGroup);

        // Goresan Panduan Transparan (Watermark)
        const guideGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        guideGroup.setAttribute("class", "stroke-guide-group");
        paths.forEach((d) => {
          const guidePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          guidePath.setAttribute("class", "stroke-guide-path");
          guidePath.setAttribute("d", d);
          guidePath.setAttribute("stroke-linecap", "round");
          guidePath.setAttribute("stroke-linejoin", "round");
          guidePath.setAttribute("fill", "none");
          guideGroup.appendChild(guidePath);
        });
        svg.appendChild(guideGroup);

        // Goresan Animasi Solid
        const activeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        activeGroup.setAttribute("class", "stroke-active-group");
        paths.forEach((d, pathIndex) => {
          const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
          pathEl.setAttribute("class", "stroke-active-path");
          pathEl.setAttribute("data-stroke", `${index}-${pathIndex}`);
          pathEl.setAttribute("d", d);
          pathEl.setAttribute("stroke-linecap", "round");
          pathEl.setAttribute("stroke-linejoin", "round");
          pathEl.setAttribute("fill", "none");
          activeGroup.appendChild(pathEl);
        });
        svg.appendChild(activeGroup);

        // Angka Penunjuk Urutan Goresan
        const numbersGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        numbersGroup.setAttribute("class", "stroke-numbers-group");
        const numPositions = calculateStrokeNumbers(paths, rec.numbers);
        numPositions.forEach((pos, pathIndex) => {
          const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
          textEl.setAttribute("class", "stroke-number-label");
          textEl.setAttribute("x", String(pos.x));
          textEl.setAttribute("y", String(pos.y));
          textEl.setAttribute("data-stroke-num", `${index}-${pathIndex}`);
          textEl.textContent = String(globalOffset + pathIndex + 1);
          numbersGroup.appendChild(textEl);
        });
        svg.appendChild(numbersGroup);

        globalOffset += paths.length;
        charWrapper.appendChild(svg);
        svgLayer.appendChild(charWrapper);
      });

      lines = [...svgLayer.querySelectorAll("path[data-stroke]")];
      numberLabels = [...svgLayer.querySelectorAll(".stroke-number-label")];
    } else if (currentChar && svgLayer) {
      svgLayer.innerHTML = "";
      svgLayer.style.display = "flex";
      svgLayer.style.flexDirection = "row";
      svgLayer.style.flexWrap = "nowrap";
      svgLayer.style.minHeight = "0";
      svgLayer.style.justifyContent = "center";
      svgLayer.style.alignItems = "center";
      svgLayer.style.gap = isYoon ? "10px" : "8px";
      svgLayer.style.width = "100%";
      svgLayer.style.height = "100%";

      characters.forEach((char) => {
        const charWrapper = document.createElement("div");
        charWrapper.className = `kanjivg-char-box ${isYoon ? 'yoon-char' : (characters.length > 2 ? 'multi-char' : 'single-char')}`;
        charWrapper.style.position = "relative";
        charWrapper.style.display = "flex";
        charWrapper.style.alignItems = "center";
        charWrapper.style.justifyContent = "center";
        charWrapper.style.minWidth = "0";
        charWrapper.style.minHeight = "0";
        if (isYoon) {
          charWrapper.style.flex = "1 1 0%";
          charWrapper.style.maxWidth = "160px";
          charWrapper.style.height = "94%";
          charWrapper.style.aspectRatio = "1 / 1";
        }

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 109 109");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";

        const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gridGroup.setAttribute("class", "stroke-grid-group");
        gridGroup.innerHTML = `
          <line x1="5" y1="54.5" x2="104" y2="54.5" class="stroke-grid-line"></line>
          <line x1="54.5" y1="5" x2="54.5" y2="104" class="stroke-grid-line"></line>
        `;
        svg.appendChild(gridGroup);
        charWrapper.appendChild(svg);

        const fallbackSpan = document.createElement("span");
        fallbackSpan.className = "stroke-fallback-glyph";
        fallbackSpan.textContent = char;
        fallbackSpan.style.position = "absolute";
        fallbackSpan.style.fontSize = isMulti ? (isYoon ? "90px" : "65px") : "120px";
        fallbackSpan.style.opacity = "0.35";
        fallbackSpan.style.userSelect = "none";
        charWrapper.appendChild(fallbackSpan);

        svgLayer.appendChild(charWrapper);
      });
    }

    // Koleksi Elemen Kontrol Animasi
    const number = host.querySelector("[data-stroke-number]");
    const order = [...host.querySelectorAll("[data-stroke-step]")];
    const speed = host.querySelector("[data-stroke-speed]");
    const playBtn = host.querySelector("[data-stroke-play]");
    const prevBtn = host.querySelector("[data-stroke-prev]");
    const nextBtn = host.querySelector("[data-stroke-next]");
    const replayBtn = host.querySelector("[data-stroke-replay]");
    const clearBtn = host.querySelector("[data-stroke-clear]");

    let step = 0;
    let animation = null;
    let playing = false;
    let paused = false;
    let cleared = false;

    const duration = () => 650 * Number(speed?.value || 1);

    function setStepLabel() {
      if (destroyed) return;
      const visibleStep = Math.min(step + 1, lines.length);
      if (number) number.textContent = cleared ? "0" : String(visibleStep);

      order.forEach((item, index) => {
        item.classList.toggle("is-active", index === step && (playing || paused));
        item.classList.toggle("is-done", index < step);
      });

      numberLabels.forEach((numLabel, index) => {
        numLabel.classList.toggle("is-active", index === step && (playing || paused));
        numLabel.classList.toggle("is-done", index < step);
      });

      if (playBtn) {
        if (playing) {
          playBtn.innerHTML = "JEDA ⏸";
        } else if (paused) {
          playBtn.innerHTML = "LANJUT ▶";
        } else {
          playBtn.innerHTML = "PUTAR ▶";
        }
      }
    }

    function applyActiveState(instant = false) {
      if (destroyed) return;
      lines.forEach((line, index) => {
        const len = line.getTotalLength ? line.getTotalLength() : 100;
        line.style.strokeDasharray = `${len} ${len}`;
        if (index < step) {
          line.style.transition = instant ? "none" : "stroke-dashoffset 0.15s ease";
          line.style.strokeDashoffset = "0";
        } else {
          line.style.transition = "none";
          line.style.strokeDashoffset = `${len}`;
        }
      });
      setStepLabel();
    }

    function animateSingleStroke(index, onComplete) {
      if (destroyed) return;
      const line = lines[index];
      if (!line) {
        if (onComplete) onComplete();
        return;
      }
      const len = line.getTotalLength ? line.getTotalLength() : 100;
      line.style.strokeDasharray = `${len} ${len}`;
      line.style.strokeDashoffset = `${len}`;
      line.getBoundingClientRect(); // reflow
      line.style.transition = `stroke-dashoffset ${duration()}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      line.style.strokeDashoffset = "0";

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration() + 80);

      animation = {
        cancel: () => {
          clearTimeout(timer);
          line.style.transition = "none";
        }
      };
    }

    function playSequence() {
      if (destroyed || !playing) return;
      if (step >= lines.length) {
        playing = false;
        paused = false;
        setStepLabel();
        return;
      }
      setStepLabel();
      animateSingleStroke(step, () => {
        if (!playing) return;
        step++;
        if (step < lines.length) {
          playSequence();
        } else {
          playing = false;
          paused = false;
          setStepLabel();
        }
      });
    }

    function play() {
      if (destroyed || lines.length === 0) return;
      cleared = false;
      if (animation) animation.cancel();
      if (paused) {
        playing = true;
        paused = false;
        playSequence();
        return;
      }
      if (step >= lines.length) step = 0;
      applyActiveState(true);
      playing = true;
      paused = false;
      playSequence();
    }

    function pause() {
      if (destroyed || !playing) return;
      if (animation) animation.cancel();
      playing = false;
      paused = true;
      setStepLabel();
    }

    function resume() {
      if (destroyed || !paused) return;
      playing = true;
      paused = false;
      playSequence();
    }

    function togglePlay() {
      if (playing) pause();
      else if (paused) resume();
      else play();
    }

    function replay() {
      if (destroyed || lines.length === 0) return;
      if (animation) animation.cancel();
      step = 0;
      cleared = false;
      applyActiveState(true);
      playing = true;
      paused = false;
      playSequence();
    }

    function prevStep() {
      if (destroyed || lines.length === 0) return;
      if (animation) animation.cancel();
      playing = false;
      paused = false;
      cleared = false;
      step = Math.max(0, step - 1);
      applyActiveState(true);
    }

    function nextStep() {
      if (destroyed || lines.length === 0) return;
      if (animation) animation.cancel();
      playing = false;
      paused = false;
      cleared = false;
      step = Math.min(lines.length - 1, step + 1);
      applyActiveState(true);
    }

    function reset() {
      if (destroyed) return;
      if (animation) animation.cancel();
      step = 0;
      playing = false;
      paused = false;
      cleared = false;
      applyActiveState(true);
    }

    function clearView() {
      if (destroyed) return;
      if (animation) animation.cancel();
      step = 0;
      playing = false;
      paused = false;
      cleared = true;
      lines.forEach((line) => {
        const len = line.getTotalLength ? line.getTotalLength() : 100;
        line.style.transition = "none";
        line.style.strokeDashoffset = `${len}`;
      });
      setStepLabel();
    }

    if (playBtn) playBtn.addEventListener("click", togglePlay);
    if (prevBtn) prevBtn.addEventListener("click", prevStep);
    if (nextBtn) nextBtn.addEventListener("click", nextStep);
    if (replayBtn) replayBtn.addEventListener("click", replay);

    order.forEach((thumb, idx) => {
      thumb.addEventListener("click", () => {
        if (destroyed) return;
        if (animation) animation.cancel();
        playing = false;
        paused = false;
        cleared = false;
        step = idx + 1;
        applyActiveState(true);
      });
    });

    numberLabels.forEach((numLabel, idx) => {
      numLabel.addEventListener("click", () => {
        if (destroyed) return;
        if (animation) animation.cancel();
        playing = false;
        paused = false;
        cleared = false;
        step = idx + 1;
        applyActiveState(true);
      });
    });

    applyActiveState(true);

    // =========================================================================
    // KANVAS TULIS MANDIRI & RECOGNITION SEARCH ENGINE
    // =========================================================================
    const drawCanvas = host.querySelector(".unified-draw-canvas");
    const gridOverlay = host.querySelector("[data-guide-grid]");
    const canvasClearBtn = host.querySelector("[data-canvas-clear]");
    const canvasUndoBtn = host.querySelector("[data-canvas-undo]");
    const canvasGuideToggle = host.querySelector("[data-canvas-guide-toggle]");
    const recognitionCard = host.querySelector("[data-recognition-card]");
    const accuracyRow = host.querySelector("[data-accuracy-row]");
    const accuracyBadge = host.querySelector("[data-accuracy-badge]");
    const accuracyText = host.querySelector("[data-accuracy-text]");
    const searchRow = host.querySelector("[data-search-row]");
    const candidatesContainer = host.querySelector("[data-search-candidates]");
    const emptyPrompt = host.querySelector("[data-empty-prompt]");

    let userStrokes = [];
    let currentStroke = [];
    let isDrawing = false;
    let guideEnabled = true;
    const getDrawColor = () => (document.body.classList.contains("theme-dark") || document.body.classList.contains("dark-mode")) ? "#f3f4f6" : "#1a1a1a";
    const drawLineWidth = 14;

    function redrawUserCanvas() {
      if (!drawCanvas) return;
      const ctx = drawCanvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

      const color = getDrawColor();
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = drawLineWidth;
      ctx.strokeStyle = color;

      const allStrokesToDraw = currentStroke.length > 0 ? [...userStrokes, currentStroke] : userStrokes;

      allStrokesToDraw.forEach((stroke) => {
        if (!stroke || stroke.length === 0) return;
        if (stroke.length === 1) {
          ctx.beginPath();
          ctx.arc(stroke[0].x, stroke[0].y, drawLineWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          return;
        }
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        if (stroke.length === 2) {
          ctx.lineTo(stroke[1].x, stroke[1].y);
        } else {
          for (let i = 1; i < stroke.length - 1; i++) {
            const midX = (stroke[i].x + stroke[i + 1].x) / 2;
            const midY = (stroke[i].y + stroke[i + 1].y) / 2;
            ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, midX, midY);
          }
          const prev = stroke[stroke.length - 2];
          const last = stroke[stroke.length - 1];
          ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y);
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    function processDrawingEvaluation() {
      if (userStrokes.length === 0) {
        if (accuracyRow) accuracyRow.style.display = "none";
        if (searchRow) searchRow.style.display = "none";
        if (emptyPrompt) emptyPrompt.style.display = "none";
        if (recognitionCard) recognitionCard.style.display = "none";
        return;
      }

      if (emptyPrompt) emptyPrompt.style.display = "none";

      const targetRec = (records && records[0]) ? records[0] : null;
      const res = evaluateCanvasSimilarity(userStrokes, currentChar, targetRec, { canvasW, canvasH });

      let hasContent = false;

      // 1. Akurasi terhadap karakter panduan aktif (Multi-Metrik Terkalibrasi)
      if (res.accuracy !== null && accuracyRow && accuracyBadge && accuracyText) {
        accuracyRow.style.display = "flex";
        accuracyBadge.textContent = `${res.accuracy}%`;
        if (res.accuracy >= 88) {
          accuracyBadge.className = "accuracy-badge badge-high";
          accuracyText.textContent = "— Sangat Mirip / Sempurna! Pertahankan!";
        } else if (res.accuracy >= 75) {
          accuracyBadge.className = "accuracy-badge badge-mid";
          accuracyText.textContent = "— Bagus! Bentuk sudah tepat.";
        } else if (res.accuracy >= 55) {
          accuracyBadge.className = "accuracy-badge badge-mid";
          accuracyText.textContent = "— Cukup mirip, terus perhalus lekukannya.";
        } else {
          accuracyBadge.className = "accuracy-badge badge-low";
          accuracyText.textContent = "— Coba perhatikan kembali bentuk acuan.";
        }
        hasContent = true;
      } else if (accuracyRow) {
        accuracyRow.style.display = "none";
      }

      // 2. Kandidat pengenalan tulisan tangan (Handwriting Search)
      if (res.candidates && res.candidates.length > 0 && searchRow && candidatesContainer) {
        searchRow.style.display = "flex";
        candidatesContainer.innerHTML = "";

        res.candidates.forEach((cand, idx) => {
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = `search-candidate-pill ${idx === 0 ? 'is-top' : ''}`;
          pill.title = `Pilih karakter ${cand.char} (${cand.score}% mirip) dan putar goresannya`;
          pill.innerHTML = `<span class="cand-char">${cand.char}</span><span class="cand-score">${cand.score}%</span>`;
          pill.addEventListener("click", () => {
            if (typeof options.onSelectCharacter === "function") {
              options.onSelectCharacter(cand.char);
            } else {
              loadCharacter(cand.char);
            }
          });
          candidatesContainer.appendChild(pill);
        });

        // Tombol cepat putar goresan karakter hasil identifikasi
        const topChar = res.candidates[0].char;
        const playTopBtn = document.createElement("button");
        playTopBtn.type = "button";
        playTopBtn.className = "play-identified-btn";
        playTopBtn.innerHTML = `<span>▶ Putar Goresan <b>${topChar}</b></span>`;
        playTopBtn.title = `Putar animasi urutan goresan resmi untuk karakter teridentifikasi (${topChar})`;
        playTopBtn.addEventListener("click", () => {
          if (typeof options.onSelectCharacter === "function") {
            options.onSelectCharacter(topChar);
          } else {
            loadCharacter(topChar);
          }
        });
        candidatesContainer.appendChild(playTopBtn);
        hasContent = true;
      } else if (searchRow) {
        searchRow.style.display = "none";
      }

      if (recognitionCard) {
        recognitionCard.style.display = hasContent ? "block" : "none";
      }
    }

    if (drawCanvas) {
      const ctx = drawCanvas.getContext("2d");

      function getCanvasPos(e) {
        const rect = drawCanvas.getBoundingClientRect();
        const scaleX = drawCanvas.width / (rect.width || 1);
        const scaleY = drawCanvas.height / (rect.height || 1);
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
        const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY
        };
      }

      function onPointerDown(e) {
        isDrawing = true;
        const pos = getCanvasPos(e);
        currentStroke = [pos];
        redrawUserCanvas();
        if (e.cancelable && e.type.startsWith("touch")) e.preventDefault();
      }

      function onPointerMove(e) {
        if (!isDrawing) return;
        const pos = getCanvasPos(e);
        const last = currentStroke[currentStroke.length - 1];
        if (!last || Math.hypot(pos.x - last.x, pos.y - last.y) >= 1.5) {
          currentStroke.push(pos);
          redrawUserCanvas();
        }
        if (e.cancelable && e.type.startsWith("touch")) e.preventDefault();
      }

      function onPointerUp() {
        if (!isDrawing) return;
        isDrawing = false;
        if (currentStroke.length > 0) {
          userStrokes.push(currentStroke);
          currentStroke = [];
          redrawUserCanvas();
          processDrawingEvaluation();
        }
      }

      drawCanvas.addEventListener("mousedown", onPointerDown);
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);

      drawCanvas.addEventListener("touchstart", onPointerDown, { passive: false });
      drawCanvas.addEventListener("touchmove", onPointerMove, { passive: false });
      drawCanvas.addEventListener("touchend", onPointerUp);
      drawCanvas.addEventListener("touchcancel", onPointerUp);

      function handleClearAction() {
        const hasUserStrokes = userStrokes.length > 0;
        const hasDrawnStrokes = (!cleared && lines.length > 0 && (step > 0 || playing || lines.some((l) => l.style.strokeDashoffset === "0")));

        if (hasUserStrokes || hasDrawnStrokes) {
          // Tahap 1: Ada coretan pengguna atau urutan goresan aktif -> hapus coretan & bersihkan goresan terlebih dahulu
          userStrokes = [];
          currentStroke = [];
          redrawUserCanvas();
          clearView();
          if (recognitionCard) {
            recognitionCard.style.display = "none";
          }
        } else {
          // Tahap 2: Jika sudah kosong/bersih (tidak ada coretan dan goresan sudah 0/cleared) -> unselect kana/kanji
          if (typeof options.onClear === "function") {
            options.onClear();
          }
        }
      }

      if (canvasClearBtn) {
        canvasClearBtn.addEventListener("click", handleClearAction);
      }
      if (clearBtn) {
        clearBtn.addEventListener("click", handleClearAction);
      }

      if (canvasUndoBtn) {
        canvasUndoBtn.addEventListener("click", () => {
          if (userStrokes.length > 0) {
            userStrokes.pop();
            redrawUserCanvas();
            processDrawingEvaluation();
          }
        });
      }

      if (canvasGuideToggle) {
        canvasGuideToggle.addEventListener("click", () => {
          guideEnabled = !guideEnabled;
          canvasGuideToggle.classList.toggle("is-active", guideEnabled);
          canvasGuideToggle.innerHTML = guideEnabled ? "👁️ Panduan: ON" : "👁️ Panduan: OFF";

          if (gridOverlay && !isMulti) {
            gridOverlay.style.display = guideEnabled ? "block" : "none";
          }
          const guidePaths = host.querySelectorAll(".stroke-guide-group, .stroke-grid-group, .stroke-fallback-glyph");
          guidePaths.forEach((el) => {
            el.style.display = guideEnabled ? "" : "none";
          });
        });
      }
    }

    /**
     * Memuat karakter baru secara dinamis ke kanvas studio dan memutar animasi goresannya.
     */
    function loadCharacter(newChar) {
      if (!newChar) return;
      currentChar = newChar;
      characters = Array.from(newChar);
      isMulti = characters.length > 1;

      const cached = characters.every(getCached);
      if (cached) {
        setupStudio(characters.map(getCached));
        setTimeout(() => {
          if (internalController && typeof internalController.play === "function") {
            internalController.play();
          }
        }, 150);
      } else {
        Promise.all(characters.map((c) => window.getStrokeDataAsync(c, options.jlpt || options.level))).then((newRecords) => {
          if (!destroyed && host._miraiStrokeGen === currentGen) {
            setupStudio(newRecords);
            setTimeout(() => {
              if (internalController && typeof internalController.play === "function") {
                internalController.play();
              }
            }, 150);
          }
        }).catch(() => {
          if (!destroyed && host._miraiStrokeGen === currentGen) {
            renderUnavailableState();
          }
        });
      }
    }

    internalController = {
      destroy: () => {
        destroyed = true;
        if (animation) animation.cancel();
      },
      play,
      pause,
      resume,
      togglePlay,
      replay,
      prev: prevStep,
      next: nextStep,
      reset,
      clear: clearView,
      isAvailable: hasRecords,
      getStep: () => step,
      getTotalSteps: () => lines.length,
      isPlaying: () => playing,
      isPaused: () => paused,
      loadCharacter
    };
    host._miraiStrokeController = internalController;
  }

  // Jika karakter kosong (awal buka kamus), langsung render kanvas studio kosong untuk coretan bebas
  if (!currentChar) {
    setupStudio([]);
  } else {
    const allImmediate = characters.every(getCached);
    if (allImmediate) {
      setupStudio(characters.map(getCached));
    } else {
      host.innerHTML = `
        <div class="stroke-stage is-loading ${window.currentPenSize === 'thick' ? 'stroke-thick' : 'stroke-thin'}">
          <div class="kanjivg-char-box single-char" style="position:relative; width:100%; max-width:200px; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 109 109" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; display:block;" role="img" aria-hidden="true">
              <g class="stroke-grid-group">
                <line x1="5" y1="54.5" x2="104" y2="54.5" class="stroke-grid-line" />
                <line x1="54.5" y1="5" x2="54.5" y2="104" class="stroke-grid-line" />
              </g>
            </svg>
            <span class="stroke-fallback-glyph" style="position:absolute; font-size:${isMulti ? '70px' : '110px'}; opacity:0.35; user-select:none;">${currentChar}</span>
          </div>
        </div>
        <p class="stroke-source" style="margin: 8px 0; text-align: center;">Memuat data goresan KanjiVG...</p>
      `;

      Promise.all(characters.map((c) => window.getStrokeDataAsync(c, options.jlpt || options.level))).then((records) => {
        if (!destroyed && host._miraiStrokeGen === currentGen) {
          setupStudio(records);
        }
      }).catch(() => {
        if (!destroyed && host._miraiStrokeGen === currentGen) {
          renderUnavailableState();
        }
      });
    }
  }

  return {
    destroy: () => internalController?.destroy(),
    play: () => internalController?.play(),
    pause: () => internalController?.pause(),
    resume: () => internalController?.resume(),
    togglePlay: () => internalController?.togglePlay(),
    replay: () => internalController?.replay(),
    prev: () => internalController?.prev(),
    next: () => internalController?.next(),
    reset: () => internalController?.reset(),
    clear: () => internalController?.clear(),
    isAvailable: () => (internalController ? internalController.isAvailable : false),
    loadCharacter: (c) => internalController?.loadCharacter(c)
  };
};


