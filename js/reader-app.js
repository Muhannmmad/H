/*
 * reader-app.js  -  online book reader (replaces the old inline script of reader.html)
 *
 * Written in plain ES5 on purpose: this file must be able to START in every browser, because
 * if the PDF engine cannot run, it is this file that shows the "Open / Download PDF" screen.
 *
 * How the book gets on the screen (each step has a fallback):
 *   1. PDF engine   : js/pdfjs-classic/pdf-engine.min.js  (classic script, no ES modules)
 *                     -> then a public CDN copy of pdf.js 3.x (UMD build)
 *   2. Worker       : real Web Worker from a blob: address -> real Web Worker from the file
 *                     -> "fake" worker on the main thread (slower but works without Workers)
 *   3. PDF file     : normal streaming -> without range/stream -> whole file by XHR -> fresh address
 *   4. Everything failed: buttons "Open PDF" / "Download PDF" (+ the browser's own viewer on desktop)
 *
 * Pages are drawn on <canvas> only while they are near the screen (no IntersectionObserver needed).
 * Reading progress uses the same storage keys as before (localStorage "reader:v1:<book>",
 * cookie "rdp_<book>", IndexedDB "reader-progress"), so nobody loses their place.
 */
(function () {
  'use strict';

  var RV = 'reader-v8';
  var ASSET_V = '8';                         // change this number when you replace the JS files (cache busting)
  var DBG = [];
  var DEBUG = /[?&]debug=1/.test(location.search);   // add  &debug=1  to the address to see every loading step in the browser console
  function dbg(m) {
    try {
      var line = String((m && (m.name ? m.name + ': ' : '') + (m.message || m)) || m);
      DBG.push(line);
      if (DEBUG && window.console) console.log('[reader] ' + line);
    } catch (e) {}
  }
  function $(id) { return document.getElementById(id); }
  function each(list, fn) { for (var i = 0; i < list.length; i++) fn(list[i], i); }

  window.addEventListener('error', function (e) { dbg('window.onerror: ' + (e && e.message) + (e && e.filename ? ' @' + String(e.filename).split('/').pop() + ':' + e.lineno : '')); });
  window.addEventListener('unhandledrejection', function (e) { dbg('unhandled rejection: ' + (e && e.reason && (e.reason.message || e.reason))); });

  /* ===================== which book ===================== */
  var BOOKS = window.RD_BOOKS, T = window.RD_TEXTS;
  function getParam(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  var slug = getParam('book');
  var book = (slug && BOOKS.hasOwnProperty(slug)) ? BOOKS[slug] : null;
  if (!book) { location.replace('index.html#writings'); return; }

  /* ===================== safe storage ===================== */
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {}
    return null;
  }

  /* ===================== language ===================== */
  function pickLang() {
    var x = ls('lang_extra'); if (x && T[x]) return x;        // extra language chosen on the site
    var l = ls('lang');       if (l && T[l]) return l;        // DE / EN / AR chosen on the site
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) { var c = String(list[i]).toLowerCase().split('-')[0]; if (T[c]) return c; }
    return 'en';
  }
  var lang = pickLang(), L = T[lang];
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] !== undefined ? o[k] : m; }); }

  document.documentElement.lang = lang;
  document.documentElement.setAttribute('dir', (lang === 'ar') ? 'rtl' : 'ltr');
  each(document.querySelectorAll('[data-t]'), function (el) { el.textContent = L[el.getAttribute('data-t')]; });
  each(document.querySelectorAll('[data-t-title]'), function (el) { var t = L[el.getAttribute('data-t-title')]; el.title = t; el.setAttribute('aria-label', t); });

  var TITLE = book.en;
  $('rd-title').innerHTML = '<span></span><small></small>';
  $('rd-title').firstChild.textContent = (lang === 'ar') ? book.ar : book.en;
  $('rd-title').lastChild.textContent = (lang === 'ar') ? book.en : book.ar;
  document.title = book.en + ' \u2013 Muhammad Hassan';
  $('rd-download').href = $('rd-end-download').href = book.file;
  $('rd-download').setAttribute('download', slug + '.pdf'); $('rd-end-download').setAttribute('download', slug + '.pdf');
  $('rd-status-text').textContent = L.loading;

  /* ===================== tracking (Umami) ===================== */
  var q = [], timer = null, tries = 0;
  function ready() { return typeof umami !== 'undefined' && umami && typeof umami.track === 'function'; }
  function flush() { while (q.length && ready()) { var n = q.shift(); try { umami.track(n); } catch (e) {} } if (!q.length && timer) { clearInterval(timer); timer = null; } }
  function track(name) {
    try {
      if (ready()) { flush(); umami.track(name); return; }
      if (q.length < 50) q.push(name);
      if (!timer) { tries = 0; timer = setInterval(function () { tries++; flush(); if (tries >= 60 && timer) { clearInterval(timer); timer = null; } }, 500); }
    } catch (e) {}
  }

  /* ===================== device facts ===================== */
  var UA = navigator.userAgent || '';
  var IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile|CriOS|FxiOS|OPiOS|IEMobile/i.test(UA) || (/Macintosh/.test(UA) && (navigator.maxTouchPoints || 0) > 1);
  var MAX_PIXELS = IS_MOBILE ? 3500000 : 7500000;   // pixels per page canvas (phones have little canvas memory)
  var KEEP_PAGES = IS_MOBILE ? 6 : 12;              // how many page canvases may exist at the same time
  function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }
  function scrollY() { return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0; }
  function viewW() { return document.documentElement.clientWidth || window.innerWidth || 800; }
  function viewH() { return window.innerHeight || document.documentElement.clientHeight || 700; }

  /* ===================== theme / zoom ===================== */
  var theme = ls('reader:theme') || (ls('theme') === 'dark' ? 'dark' : 'light');
  function applyTheme() {
    var c = document.body.className.replace(/\s*\bdark\b/, '');
    document.body.className = c + (theme === 'dark' ? ' dark' : '');
  }
  applyTheme();
  $('rd-night').onclick = function () { theme = (theme === 'dark') ? 'light' : 'dark'; ls('reader:theme', theme); applyTheme(); };

  var ZOOMS = [0.75, 0.9, 1, 1.2, 1.45, 1.7];
  var zi = parseInt(ls('reader:zoom'), 10); if (isNaN(zi) || zi < 0 || zi >= ZOOMS.length) zi = 2;
  function baseWidth() { return Math.min(860, Math.max(260, viewW() - 24)); }

  /* ===================== state ===================== */
  var PAGE_GAP = 16;                                  // must match .rd-page margin-bottom in reader.html
  var KEY = 'reader:v1:' + slug;
  var doc = null, N = 0, W = 860, y0 = 0;
  var pagesEl = $('rd-pages'), endEl = $('rd-end');
  var els = [], ratios = [], tops = [], heights = [];
  var rendered = {}, renderedCount = 0, queued = {}, queue = [], running = 0, failures = {};
  var visLo = 0, visHi = 0, midPage = 1;
  var saveEnabled = false, userScrolled = false, fired = {}, finishedFired = false;
  var lastSaveAt = 0, ticking = false, cur = { p: 0, f: 0, pct: 0 };
  var resumePending = false, savedProgress = null;

  function syncBar() { document.body.style.paddingTop = $('rd-bar').offsetHeight + 'px'; }
  function barHeight() { return $('rd-bar').offsetHeight; }

  /* ===================== reading progress (3 copies: localStorage, cookie, IndexedDB) ===================== */
  var CK = 'rdp_' + slug;
  function setCookie(v) { try { document.cookie = CK + '=' + encodeURIComponent(v) + '; max-age=31536000; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) {} }
  function getCookie() { try { var m = document.cookie.match(new RegExp('(?:^|; )' + CK + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; } }
  function parseSaved(s) { try { var o = JSON.parse(s); return (o && o.p && o.N) ? o : null; } catch (e) { return null; } }
  var idbSaved = null;
  function idbOpen(cb) {
    try {
      if (!window.indexedDB) { cb(null); return; }
      var rq = indexedDB.open('reader-progress', 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore('p'); };
      rq.onsuccess = function () { cb(rq.result); };
      rq.onerror = function () { cb(null); };
      rq.onblocked = function () { cb(null); };
    } catch (e) { cb(null); }
  }
  function idbPut(v) { idbOpen(function (db) { if (!db) return; try { db.transaction('p', 'readwrite').objectStore('p').put(v, slug); } catch (e) {} }); }
  function idbDel() { idbOpen(function (db) { if (!db) return; try { db.transaction('p', 'readwrite').objectStore('p')['delete'](slug); } catch (e) {} }); }
  idbOpen(function (db) {
    if (!db) return;
    try { var g = db.transaction('p').objectStore('p').get(slug); g.onsuccess = function () { idbSaved = parseSaved(g.result); }; } catch (e) {}
  });
  function readSaved() {
    var best = null;
    each([parseSaved(ls(KEY)), parseSaved(getCookie()), idbSaved], function (x) { if (x && (!best || x.t > best.t)) best = x; });
    return best;
  }
  function clearSaved() { idbSaved = null; idbDel(); ls(KEY, null); try { document.cookie = CK + '=; max-age=0; path=/'; } catch (e) {} }
  function save(force) {
    if (!saveEnabled || !N) return;
    var now = Date.now(); if (!force && now - lastSaveAt < 600) return; lastSaveAt = now;
    var v = JSON.stringify({ p: cur.p + 1, f: Math.round(cur.f * 1000) / 1000, N: N, pct: cur.pct, t: now });
    ls(KEY, v); setCookie(v); idbPut(v);
  }
  setInterval(function () { save(false); }, 3000);   // safety net: also save every 3 s while reading
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}

  /* ===================== layout (page boxes get an exact pixel height, so no CSS aspect-ratio is needed) ===================== */
  function computeTops() {
    y0 = pagesEl.getBoundingClientRect().top + scrollY();
    var acc = 0;
    for (var i = 0; i < N; i++) {
      var h = Math.round(W * ratios[i]);
      tops[i] = y0 + acc; heights[i] = h; acc += h + PAGE_GAP;
    }
  }
  function applyLayout() {
    W = Math.round(baseWidth() * ZOOMS[zi]);
    pagesEl.style.width = W + 'px'; endEl.style.width = W + 'px';
    for (var i = 0; i < els.length; i++) els[i].style.height = Math.round(W * ratios[i]) + 'px';
    syncBar();
    computeTops();
  }
  function pageAt(y) {                                // index of the page that contains the vertical position y
    var lo = 0, hi = N - 1;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (tops[mid] <= y) lo = mid; else hi = mid - 1; }
    return lo;
  }

  /* ===================== drawing pages ===================== */
  function wantPage(n) {                              // n is 1-based
    if (rendered[n] || queued[n] || (failures[n] || 0) >= 3) return;
    queued[n] = true; queue.push(n);
  }
  function pump() {
    while (running < 2 && queue.length) {
      var bi = 0, bd = 1e9;                           // take the waiting page that is closest to the middle of the screen
      for (var i = 0; i < queue.length; i++) { var d = Math.abs(queue[i] - midPage); if (d < bd) { bd = d; bi = i; } }
      var n = queue.splice(bi, 1)[0]; delete queued[n];
      if (n - 1 < visLo - 1 || n - 1 > visHi + 1) continue;     // reader already scrolled away
      running++; drawPage(n);
    }
  }
  function drawPage(n) {
    var el = els[n - 1], finished = false;
    function finish() { if (finished) return; finished = true; running--; pump(); }
    if (!el || !el.clientWidth || !doc) { finish(); return; }
    var entry = { canvas: null, task: null, dead: false };
    rendered[n] = entry; renderedCount++;
    doc.getPage(n).then(function (page) {
      if (entry.dead) return;
      var vp1 = page.getViewport({ scale: 1 });
      var r = vp1.height / vp1.width;
      if (Math.abs(r - ratios[n - 1]) > 0.005) {      // a page with a different size than page 1
        ratios[n - 1] = r; el.style.height = Math.round(W * r) + 'px'; computeTops();
      }
      var scale = (el.clientWidth / vp1.width) * dpr();
      var px = (vp1.width * scale) * (vp1.height * scale);
      if (px > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / px);
      var vp = page.getViewport({ scale: scale });
      var canvas = document.createElement('canvas');
      canvas.width = Math.floor(vp.width); canvas.height = Math.floor(vp.height);
      var ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas 2d context not available');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', '#' + n);
      entry.canvas = canvas;
      entry.task = page.render({ canvasContext: ctx, viewport: vp });
      return entry.task.promise.then(function () {
        if (entry.dead) return;
        el.appendChild(canvas); el.className = 'rd-page done';
        try { page.cleanup(); } catch (e) {}
      });
    }).then(finish, function (err) {
      if (err && err.name === 'RenderingCancelledException') { finish(); return; }
      dbg('page ' + n + ': ' + (err && (err.name + ' ' + err.message) || err));
      if (rendered[n] === entry) { entry.dead = true; delete rendered[n]; renderedCount--; freeCanvas(entry); }
      failures[n] = (failures[n] || 0) + 1;
      if (failures[n] < 3) setTimeout(function () { wantPage(n); pump(); }, 700 * failures[n]);
      else el.className = 'rd-page failed';
      finish();
    });
  }
  function freeCanvas(entry) {
    if (!entry.canvas) return;
    try { if (entry.canvas.parentNode) entry.canvas.parentNode.removeChild(entry.canvas); entry.canvas.width = 0; entry.canvas.height = 0; } catch (e) {}
    entry.canvas = null;
  }
  function unrender(n) {
    var entry = rendered[n]; if (!entry) return;
    entry.dead = true; try { if (entry.task) entry.task.cancel(); } catch (e) {}
    freeCanvas(entry);
    els[n - 1].className = 'rd-page';
    delete rendered[n]; renderedCount--;
  }
  function trim() {                                   // keep memory low: free pages that are far away from the reader
    if (renderedCount <= KEEP_PAGES) return;
    var far = [], k;
    for (k in rendered) { if (rendered.hasOwnProperty(k)) { var n = +k; if (n - 1 < visLo - 1 || n - 1 > visHi + 1) far.push(n); } }
    far.sort(function (a, b) { return Math.abs(b - midPage) - Math.abs(a - midPage); });
    while (renderedCount > KEEP_PAGES && far.length) unrender(far.shift());
  }
  function resetRender() {
    var k; for (k in rendered) if (rendered.hasOwnProperty(k)) unrender(+k);
    queue = []; queued = {};
    ensureVisible();
  }
  function ensureVisible() {
    if (!N) return;
    var y = scrollY(), vh = viewH();
    visLo = pageAt(y - vh * 1.0); visHi = pageAt(y + vh * 2.0); midPage = pageAt(y + vh / 2) + 1;
    for (var i = visLo; i <= visHi; i++) wantPage(i + 1);
    trim(); pump();
  }

  /* ===================== progress ===================== */
  function currentPos() {
    var y = scrollY() + barHeight() + 10, lo = pageAt(y);
    var f = Math.max(0, Math.min(1, (y - tops[lo]) / (heights[lo] || 1)));
    var pct = Math.round(100 * (lo + f) / N);
    var atEnd = scrollY() + viewH() >= document.documentElement.scrollHeight - 6;
    if (atEnd) { pct = 100; lo = N - 1; f = 1; }
    return { p: lo, f: f, pct: Math.max(0, Math.min(100, pct)) };
  }
  function update() {
    ticking = false;
    if (!N) return;
    cur = currentPos();
    $('rd-fill').style.width = cur.pct + '%';
    $('rd-progressbar').setAttribute('aria-valuenow', cur.pct);
    $('rd-page-label').textContent = fmt(L.page, { n: cur.p + 1, t: N });
    $('rd-pct-label').textContent = fmt(L.read, { p: cur.pct });
    $('rd-top').style.display = scrollY() > 900 ? 'inline-flex' : 'none';
    if (resumePending && savedProgress && cur.pct > savedProgress.pct) {      // reader has gone past the old position on their own
      resumePending = false; saveEnabled = true; $('rd-resume').style.display = 'none';
    }
    ensureVisible(); save(false);
    if (userScrolled) {
      each([25, 50, 75], function (m) {
        if (cur.pct >= m && !fired[m]) { fired[m] = true; track('Book Reader Progress: ' + TITLE + ' ' + m + '%'); }
      });
      if (cur.pct >= 99 && !finishedFired) {
        finishedFired = true; fired[25] = fired[50] = fired[75] = true;
        track('Book Reader Finished: ' + TITLE);
      }
    }
  }
  var startY = 0, scrollTimer = null;
  function onScroll() {
    if (Math.abs(scrollY() - startY) > 20) { userScrolled = true; if (!resumePending) saveEnabled = true; }
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
    clearTimeout(scrollTimer); scrollTimer = setTimeout(function () { save(true); }, 400);
  }
  var passiveOpt = false;                             // passive scroll listeners keep phones smooth (older browsers ignore the option)
  try { var po = Object.defineProperty({}, 'passive', { get: function () { passiveOpt = { passive: true }; return true; } }); window.addEventListener('rd-test', null, po); } catch (e) {}
  window.addEventListener('scroll', onScroll, passiveOpt);
  window.addEventListener('pagehide', function () { save(true); }, false);
  window.addEventListener('beforeunload', function () { save(true); }, false);
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(true); }, false);

  function scrollToY(y, smooth) {
    y = Math.max(0, y);
    if (smooth && 'scrollBehavior' in document.documentElement.style) { try { window.scrollTo({ top: y, behavior: 'smooth' }); return; } catch (e) {} }
    window.scrollTo(0, y);
  }
  function scrollToPos(p, f, smooth) { scrollToY(tops[p] + f * heights[p] - barHeight() - 10, smooth); }

  /* ===================== buttons ===================== */
  function relayout(keepPos) {
    if (!N) return;
    var pos = keepPos ? currentPos() : null;
    applyLayout();
    if (pos) scrollToPos(pos.p, pos.f, false);
    resetRender(); update();
  }
  $('rd-larger').onclick = function () { if (zi < ZOOMS.length - 1) { zi++; ls('reader:zoom', zi); relayout(true); } };
  $('rd-smaller').onclick = function () { if (zi > 0) { zi--; ls('reader:zoom', zi); relayout(true); } };
  var rt = null, lastViewW = viewW();
  function onResize() {                               // phones fire "resize" while the address bar hides: only react to a real width change
    clearTimeout(rt);
    rt = setTimeout(function () { var w = viewW(); syncBar(); if (w !== lastViewW) { lastViewW = w; relayout(true); } else if (N) { computeTops(); update(); } }, 200);
  }
  window.addEventListener('resize', onResize, false);
  window.addEventListener('orientationchange', onResize, false);
  $('rd-top').onclick = function () { scrollToY(0, true); };
  $('rd-download').addEventListener('click', function () { track('Book Reader Download: ' + TITLE); }, false);
  $('rd-end-download').addEventListener('click', function () { track('Book Reader Download: ' + TITLE); }, false);
  $('rd-back').addEventListener('click', function () { track('Book Reader Back To Site: ' + TITLE); }, false);
  $('rd-end-back').addEventListener('click', function () { track('Book Reader Back To Site: ' + TITLE); }, false);
  syncBar();

  /* ===================== small network helpers (plain XHR: works in every browser) ===================== */
  function xhr(url, type, onProgress) {
    return new Promise(function (resolve, reject) {
      var x = new XMLHttpRequest();
      x.open('GET', url, true); x.responseType = type;
      x.onload = function () { ((x.status >= 200 && x.status < 300) || (x.status === 0 && x.response)) && x.response ? resolve(x.response) : reject(new Error('HTTP ' + x.status + ' ' + url.split('/').pop())); };
      x.onerror = function () { reject(new Error('network error ' + url.split('/').pop())); };
      x.ontimeout = function () { reject(new Error('timeout ' + url.split('/').pop())); };
      x.timeout = 120000;
      if (onProgress) x.onprogress = function (e) { if (e.lengthComputable) onProgress(e.loaded, e.total); };
      x.send();
    });
  }
  function loadScript(url, ms) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script'), done = false;
      var t = setTimeout(function () { if (!done) { done = true; reject(new Error('script timeout ' + url.split('/').pop())); } }, ms || 30000);
      s.async = true;
      s.onload = function () { if (!done) { done = true; clearTimeout(t); resolve(); } };
      s.onerror = function () { if (!done) { done = true; clearTimeout(t); reject(new Error('script not loaded ' + url)); } };
      s.src = url;
      document.head.appendChild(s);
    });
  }
  function abs(u) { try { return new URL(u, location.href).href; } catch (e) { var a = document.createElement('a'); a.href = u; return a.href; } }

  /* ===================== 1. the PDF engine ===================== */
  var CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/';
  var ENGINES = [
    { name: 'local',    lib: 'js/pdfjs-classic/pdf-engine.min.js?v=' + ASSET_V, worker: 'js/pdfjs-classic/pdf-worker.min.js?v=' + ASSET_V },
    /* last-resort copies on public CDNs (pdf.js 3.x, classic UMD build). Only used when the local files cannot be run. */
    { name: 'jsdelivr', lib: CDN + 'pdf.min.js', worker: CDN + 'pdf.worker.min.js' },
    { name: 'cdnjs',    lib: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js' }
  ];
  function findLib() {
    var l = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
    return (l && typeof l.getDocument === 'function') ? l : null;
  }
  function loadEngine(eng) {
    window.pdfjsLib = undefined; try { delete window['pdfjs-dist/build/pdf']; } catch (e) {}
    return loadScript(eng.lib).then(function () {
      var lib = findLib();
      if (!lib) throw new Error('engine "' + eng.name + '" loaded but did not start (browser too old for this build?)');
      dbg('engine ' + eng.name + ' ' + (lib.version || ''));
      return lib;
    });
  }

  /* ===================== 2. the worker ===================== */
  /* Starts a real Web Worker and waits until the worker itself says "ready".
     (pdf.js's own worker.promise is NOT enough: for a given port it resolves at once, even if the worker script is broken.) */
  function tryRealWorker(lib, url) {
    return new Promise(function (resolve, reject) {
      var w, pw, done = false, t = null;
      function fail(err) { if (done) return; done = true; clearTimeout(t); try { pw.destroy(); } catch (e) {} try { w.terminate(); } catch (e) {} reject(err); }
      try { w = new Worker(url); pw = new lib.PDFWorker({ port: w }); } catch (e) { try { w && w.terminate(); } catch (e2) {} reject(e); return; }
      t = setTimeout(function () { fail(new Error('worker did not report "ready" within 15 s')); }, 15000);
      w.addEventListener('error', function (ev) { fail(new Error('worker error: ' + (ev && ev.message || 'script could not be run'))); });
      w.addEventListener('message', function (ev) {
        var d = ev && ev.data;
        if (!done && d && d.action === 'ready') { done = true; clearTimeout(t); resolve(pw); }
      });
    });
  }
  function getWorker(lib, eng) {
    var workerUrl = abs(eng.worker);
    try { lib.GlobalWorkerOptions.workerSrc = workerUrl; } catch (e) {}
    function viaBlob() {
      if (typeof Worker === 'undefined' || !window.URL || !URL.createObjectURL) return Promise.reject(new Error('no Web Worker / Blob support'));
      return xhr(workerUrl, 'text').then(function (txt) {
        if (txt.length < 5000 || txt.charAt(0) === '<') throw new Error('worker file is not a script');
        return tryRealWorker(lib, URL.createObjectURL(new Blob([txt], { type: 'text/javascript' })));
      }).then(function (pw) { return { pw: pw, mode: 'worker (blob)' }; });
    }
    function viaUrl() {
      if (typeof Worker === 'undefined') return Promise.reject(new Error('no Web Worker support'));
      return tryRealWorker(lib, workerUrl).then(function (pw) { return { pw: pw, mode: 'worker (url)' }; });
    }
    function fake() {                                 // runs the PDF reading code on the main thread (slower, but needs no Worker)
      return loadScript(workerUrl).then(function () {
        if (!(window.pdfjsWorker && window.pdfjsWorker.WorkerMessageHandler)) throw new Error('main-thread worker missing');
        return { pw: null, mode: 'main thread' };
      });
    }
    return viaBlob()['catch'](function (e) { dbg('worker blob: ' + (e.message || e)); return viaUrl(); })
                    ['catch'](function (e) { dbg('worker url: ' + (e.message || e)); return fake(); });
  }

  /* ===================== 3. the PDF file ===================== */
  function setLoadingText(p) { $('rd-status-text').textContent = (p > 0 && p < 100) ? fmt(L.loadingPct, { p: p }) : L.loading; }
  function progress(a, b) { if (b) setLoadingText(Math.round(100 * a / b)); }

  /* Same book, but under a neutral address (no ".pdf"). Download managers (IDM ...), some antivirus web shields and
     some browser add-ons grab or block every ".pdf" address, which makes reading inside the page impossible.
     If the file exists on the server (optional, see files/books/data/), it is tried first. */
  var ALT = book.file.replace(/^files\/books\//, 'files/books/data/').replace(/\.pdf$/i, '.txt');
  function headOk(url) {
    return new Promise(function (resolve) {
      try {
        var x = new XMLHttpRequest(); x.open('HEAD', url, true);
        x.onload = function () { resolve(x.status === 200); };
        x.onerror = function () { resolve(false); };
        x.send();
      } catch (e) { resolve(false); }
    });
  }
  /* download in small pieces (Range requests): works where one long download gets cut off or blocked */
  function getChunked(url) {
    var CH = 1048576;
    function piece(from, to) {
      return new Promise(function (resolve, reject) {
        var x = new XMLHttpRequest(); x.open('GET', url, true); x.responseType = 'arraybuffer';
        x.setRequestHeader('Range', 'bytes=' + from + '-' + to);
        x.onload = function () {
          if (!x.response || (x.status !== 206 && x.status !== 200)) { reject(new Error('HTTP ' + x.status + ' ' + url.split('/').pop())); return; }
          var cr = /\/(\d+)\s*$/.exec(x.getResponseHeader('Content-Range') || '');
          resolve({ buf: x.response, total: cr ? +cr[1] : 0, whole: x.status === 200 });
        };
        x.onerror = function () { reject(new Error('network error ' + url.split('/').pop())); };
        x.timeout = 60000; x.ontimeout = function () { reject(new Error('timeout ' + url.split('/').pop())); };
        x.send();
      });
    }
    return piece(0, CH - 1).then(function (first) {
      if (first.whole || !first.total) return first.buf;           // server ignored the range: this already is the whole file
      var out = new Uint8Array(first.total); out.set(new Uint8Array(first.buf), 0);
      function next(pos) {
        if (pos >= first.total) return Promise.resolve(out.buffer);
        progress(pos, first.total);
        return piece(pos, Math.min(pos + CH, first.total) - 1).then(function (r) { out.set(new Uint8Array(r.buf), pos); return next(pos + CH); });
      }
      return next(CH);
    });
  }
  function openDoc(lib, pw, extra) {
    var params = { isEvalSupported: false, verbosity: 0 };
    if (pw) params.worker = pw;
    for (var k in extra) if (extra.hasOwnProperty(k)) params[k] = extra[k];
    var task = lib.getDocument(params), last = Date.now(), dead = false;
    task.onProgress = function (p) { last = Date.now(); if (p && p.total) setLoadingText(Math.round(100 * p.loaded / p.total)); };
    return new Promise(function (resolve, reject) {
      var watch = setInterval(function () {           // no data for 60 s -> give up on this attempt
        if (Date.now() - last > 60000 && !dead) { dead = true; clearInterval(watch); try { task.destroy(); } catch (e) {} reject(new Error('no data from the PDF for 60 s')); }
      }, 5000);
      task.promise.then(function (d) { clearInterval(watch); if (dead) { try { d.destroy(); } catch (e) {} return; } resolve(d); },
                        function (e) { clearInterval(watch); if (!dead) { dead = true; try { task.destroy(); } catch (e2) {} reject(e); } });
    });
  }
  function isFetchError(e) {                         // the file could not be fetched (as opposed to: the PDF is damaged / the engine cannot read it)
    return /network|fetch|HTTP|timeout|Unexpected server response|ResponseException|MissingPDF|no data|UnknownError/i.test(String(e && (e.name + ' ' + e.message)));
  }
  function loadPdf(lib, pw) {
    return headOk(ALT).then(function (hasAlt) {
      var urls = hasAlt ? [ALT, book.file] : [book.file], steps = [];
      each(urls, function (u) {                       // per address: normal streaming -> small pieces -> one big download
        steps.push(['stream ' + u, function () { return openDoc(lib, pw, { url: u }); }]);
        steps.push(['chunks ' + u, function () { return getChunked(u).then(function (b) { return openDoc(lib, pw, { data: new Uint8Array(b) }); }); }]);
      });
      var lastErr, allFetch = true;
      function go(i) {
        if (i >= steps.length) { try { lastErr.rdFetch = allFetch; } catch (e) {} return Promise.reject(lastErr); }
        return steps[i][1]()['catch'](function (e) {
          lastErr = e; if (!isFetchError(e)) allFetch = false;
          dbg('pdf ' + steps[i][0].split('/').slice(-2).join('/') + ': ' + (e && (e.name + ' ' + e.message) || e));
          return go(i + 1);
        });
      }
      return go(0);
    });
  }

  function startEngine(i) {
    var eng = ENGINES[i];
    return loadEngine(eng).then(function (lib) {
      return getWorker(lib, eng).then(function (w) {
        dbg('mode: ' + w.mode);
        return loadPdf(lib, w.pw).then(function (pdf) { return { pdf: pdf, mode: w.mode, engine: eng.name }; });
      });
    })['catch'](function (e) {
      dbg('engine ' + eng.name + ' failed: ' + (e && (e.name + ' ' + e.message) || e));
      if (e && e.rdFetch) throw e;                    // the engine works but the book file cannot be fetched: another engine would not help, stop here
      if (i + 1 < ENGINES.length) return startEngine(i + 1);
      throw e;
    });
  }

  /* ===================== 4. when everything failed ===================== */
  function headInfo(url, cb) {
    try {
      var x = new XMLHttpRequest(); x.open('HEAD', url + (url.indexOf('?') < 0 ? '?' : '&') + 'p=' + Date.now(), true);
      x.onload = function () { cb(url.split('?')[0] + ': HTTP ' + x.status + ', type=' + x.getResponseHeader('content-type') + ', size=' + x.getResponseHeader('content-length')); };
      x.onerror = function () { cb(url.split('?')[0] + ': network error'); };
      x.send();
    } catch (e) { cb(url + ': ' + e.message); }
  }
  function canEmbedPdf() {
    if (IS_MOBILE) return false;                      // phones/tablets cannot show a PDF inside a page: they get the buttons instead
    return navigator.pdfViewerEnabled === true || !!(navigator.mimeTypes && navigator.mimeTypes['application/pdf']);
  }
  function showFallback(why) {
    dbg(why);
    try { track('Book Reader Error: ' + TITLE + ' - ' + DBG.join(' | ').slice(0, 120)); } catch (e) {}
    try { console.error('Reader error:', why, DBG); } catch (e) {}
    var st = $('rd-status');
    st.style.display = 'block';
    st.className = 'rd-fallback';
    st.innerHTML = '<p class="rd-fb-msg"></p>' +
      '<p class="rd-fb-actions"><a class="rd-btn primary rd-fb-open" target="_blank" rel="noopener"></a><a class="rd-btn rd-fb-dl"></a><a class="rd-btn rd-fb-retry" href=""></a></p>' +
      (canEmbedPdf() ? '<iframe class="rd-native" title="PDF"></iframe>' : '') +
      '<details class="rd-tech"><summary></summary><pre class="rd-dbg"></pre></details>';
    st.querySelector('.rd-fb-msg').textContent = L.error;
    if (why && why.rdFetch) { var h = document.createElement('p'); h.className = 'rd-fb-hint'; h.textContent = L.blocked || T.en.blocked; st.insertBefore(h, st.querySelector('.rd-fb-actions')); }
    var o = st.querySelector('.rd-fb-open'); o.href = book.file; o.textContent = L.open;
    var d = st.querySelector('.rd-fb-dl'); d.href = book.file; d.setAttribute('download', slug + '.pdf'); d.textContent = '\u2B07 ' + L.download;
    var r = st.querySelector('.rd-fb-retry'); r.textContent = '\u27F3 ' + L.retry; r.onclick = function (e) { e.preventDefault(); location.reload(); };
    var fr = st.querySelector('.rd-native'); if (fr) fr.src = book.file + '#view=FitH';       // the browser's own PDF viewer
    st.querySelector('summary').textContent = L.details;
    var dbgEl = st.querySelector('.rd-dbg');
    function paint(extra) { dbgEl.textContent = RV + '\n' + UA + '\n' + DBG.join('\n') + (extra ? '\n\n' + extra.join('\n') : ''); }
    paint(null);
    var probes = [], list = [book.file, ENGINES[0].lib.split('?')[0], ENGINES[0].worker.split('?')[0]], left = list.length;
    each(list, function (u) { headInfo(u, function (s) { probes.push(s); if (--left === 0) { paint(probes); try { track('Book Reader Probe: ' + TITLE + ' - ' + probes.join(' ; ').slice(0, 150)); } catch (e) {} } }); });
  }

  /* ===================== start ===================== */
  function buildEnd() {
    var box = $('rd-more'); box.innerHTML = '';
    for (var k in BOOKS) {
      if (!BOOKS.hasOwnProperty(k) || k === slug) continue;
      var a = document.createElement('a'); a.href = 'reader.html?book=' + k + '&v=' + ASSET_V;
      a.innerHTML = '<img alt=""><span></span>';
      a.getElementsByTagName('img')[0].src = 'img/books/' + k + '.jpg';
      a.getElementsByTagName('span')[0].textContent = BOOKS[k].en;
      box.appendChild(a);
    }
  }

  function begin(res) {
    var pdf = res.pdf;
    doc = pdf; N = pdf.numPages;
    dbg('opened with ' + res.engine + ' / ' + res.mode + ', ' + N + ' pages');
    return pdf.getPage(1).then(function (p1) {
      var vp = p1.getViewport({ scale: 1 }), r0 = vp.height / vp.width;
      $('rd-status').style.display = 'none';
      var frag = document.createDocumentFragment();
      for (var i = 0; i < N; i++) {
        var d = document.createElement('div');
        d.className = 'rd-page'; d.setAttribute('data-n', i + 1);
        frag.appendChild(d); els.push(d); ratios.push(r0);
      }
      pagesEl.appendChild(frag);
      endEl.style.display = 'block';
      buildEnd();
      applyLayout();

      setTimeout(function () {
        syncBar(); computeTops(); startY = scrollY(); update();
        var s = readSaved();
        var hasProgress = s && s.N === N && (s.p > 1 || s.f > 0.03) && s.pct < 99;
        track('Book Reader Open: ' + TITLE);
        if (hasProgress) {
          $('rd-resume-text').textContent = fmt(L.welcome, { n: s.p, p: s.pct });
          savedProgress = s; resumePending = true;
          $('rd-resume').style.display = 'block';
          $('rd-continue').onclick = function () {
            $('rd-resume').style.display = 'none'; resumePending = false;
            each([25, 50, 75], function (m) { if (s.pct >= m) fired[m] = true; });   // milestones already counted before
            saveEnabled = true;
            scrollToPos(s.p - 1, s.f, true);
            track('Book Reader Resume: ' + TITLE);
          };
          $('rd-startover').onclick = function () {
            $('rd-resume').style.display = 'none';
            clearSaved(); resumePending = false; saveEnabled = true;
            track('Book Reader Start Over: ' + TITLE);
          };
        } else if (s && s.pct >= 99) {
          clearSaved();                               // finished before: start fresh, nothing to resume
        }
      }, 30);
    });
  }

  if (typeof Promise === 'undefined' || typeof Uint8Array === 'undefined' || !document.createElement('canvas').getContext) {
    showFallback('browser has no Promise / typed arrays / canvas');
    return;
  }
  startEngine(0).then(begin)['catch'](function (e) { showFallback(e); });
})();
