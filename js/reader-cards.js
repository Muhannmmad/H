/*
 * reader-cards.js  -  shows the reading-progress bar on the book cards of index.html
 * (only when a visitor has already started a book). Plain ES5.
 * Reads the same three copies that reader-app.js writes: localStorage, cookie, IndexedDB.
 */
(function () {
  'use strict';
  function parse(s) { try { var o = JSON.parse(s); return (o && o.pct > 0 && o.pct < 100) ? o : null; } catch (e) { return null; } }
  function cookie(name) { try { var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; } }
  function show(box, o) {
    try {
      box.querySelector('.book-read-fill').style.width = o.pct + '%';
      box.querySelector('.book-read-pct').textContent = o.pct + '%';
      box.hidden = false; box.removeAttribute('hidden');
    } catch (e) {}
  }
  function run() {
    var boxes = document.querySelectorAll('.writings-section .book-read-progress[data-book]');
    if (!boxes.length) return;
    var db = null, i;
    for (i = 0; i < boxes.length; i++) (function (box) {
      var slug = box.getAttribute('data-book'), best = null, c, k;
      try { c = [parse(localStorage.getItem('reader:v1:' + slug)), parse(cookie('rdp_' + slug))]; } catch (e) { c = [parse(cookie('rdp_' + slug))]; }
      for (k = 0; k < c.length; k++) if (c[k] && (!best || c[k].t > best.t)) best = c[k];
      if (best) { show(box, best); return; }
      if (!window.indexedDB) return;
      try {
        var rq = indexedDB.open('reader-progress', 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore('p'); };
        rq.onsuccess = function () {
          try {
            var g = rq.result.transaction('p').objectStore('p').get(slug);
            g.onsuccess = function () { var o = parse(g.result); if (o) show(box, o); };
          } catch (e) {}
        };
      } catch (e) {}
    })(boxes[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
