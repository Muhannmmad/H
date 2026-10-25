/*
 * Book-quote note: on every page load a sticky note appears at the bottom with a line from one of
 * your books, the book's name and a small cover. Clicking the cover/name scrolls to that book in
 * "My Writings" (second row). The quotes are taken from the book cards on the page (the italic
 * line under each title). To add MORE quotes, add entries to EXTRA_QUOTES below.
 *
 *   { slug: 'what-remains-of-me', de: '…', en: '…', ar: '…' }     (de / ar are optional, en is the fallback)
 */
(function () {
  'use strict';

  var EXTRA_QUOTES = [
    // { slug: 'what-remains-of-me', en: 'Your quote here.', de: 'Dein Zitat hier.', ar: 'اقتباسك هنا.' }
  ];

  var LABEL = { de: 'Aus meinen Büchern', en: 'From my books', ar: 'من كتبي' };
  var CLOSE = { de: 'Schließen', en: 'Close', ar: 'إغلاق' };
  var TAP   = { de: 'Zum Buch', en: 'Go to the book', ar: 'إلى الكتاب' };

  function track(name) { try { if (typeof trackEvent === 'function') trackEvent(name); } catch (e) {} }

  function getLang() {
    var h = (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase();
    if (LABEL[h]) return h;
    var m = null; try { m = localStorage.getItem('wisdomLangManual'); } catch (e) {}
    if (m && LABEL[m]) return m;
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) { var c = String(list[i]).toLowerCase().split('-')[0]; if (LABEL[c]) return c; }
    return 'en';
  }

  function cleanQuote(t) { return (t || '').replace(/^[\s„“"«»”]+|[\s„“"«»”]+$/g, '').trim(); }

  function collect() {
    var out = [];
    document.querySelectorAll('.writings-section .book-card:not(.book-card-soon)').forEach(function (card) {
      var dl = card.querySelector('a[download]'); if (!dl) return;
      var slug = (dl.getAttribute('href') || '').replace(/^.*\//, '').replace(/\.pdf$/i, '');
      var img = card.querySelector('.book-cover');
      var o = { slug: slug, cover: img ? img.getAttribute('src') : '', title: {}, quote: {}, id: card.id };
      ['de', 'en', 'ar'].forEach(function (l) {
        var t = card.querySelector('h5 span[data-lang="' + l + '"]'), q = card.querySelector('.book-tagline span[data-lang="' + l + '"]');
        if (t) o.title[l] = t.textContent.trim();
        if (q) o.quote[l] = cleanQuote(q.textContent);
      });
      if (o.quote.en || o.quote.de) out.push(o);
    });
    var bySlug = {}; out.forEach(function (b) { bySlug[b.slug] = b; });
    EXTRA_QUOTES.forEach(function (x) {
      var b = bySlug[x.slug]; if (!b) return;
      out.push({ slug: b.slug, cover: b.cover, title: b.title, id: b.id, quote: { de: x.de, en: x.en, ar: x.ar } });
    });
    return out;
  }

  var NOTES = [
    { bg: '#9CCBAD', fold: '#D0E8CC', strip: '#7BAE90', t: '#10301F', pin: '#F7B519', pind: '#C98A06', pint: '#FFCB35' },
    { bg: '#FFCB35', fold: '#FFD95F', strip: '#F0AE17', t: '#3A2800', pin: '#DC1F47', pind: '#B30E37', pint: '#E8506C' },
    { bg: '#AAC45A', fold: '#C3D585', strip: '#6E8F3A', t: '#1C2A08', pin: '#DC1F47', pind: '#B30E37', pint: '#E8506C' },
    { bg: '#C9183E', fold: '#E5605A', strip: '#9C0F32', t: '#FFFFFF', pin: '#FFC72C', pind: '#D9A012', pint: '#FFD966' },
    { bg: '#8CC8F0', fold: '#C4E3F7', strip: '#5FA3D1', t: '#0A2540', pin: '#DC1F47', pind: '#B30E37', pint: '#E8506C' },
    { bg: '#F7A8C4', fold: '#FBD0E0', strip: '#DE82A6', t: '#4A0F2A', pin: '#1F8A7D', pind: '#146B60', pint: '#3DB5A6' },
    { bg: '#FFA04D', fold: '#FFC38F', strip: '#E07F26', t: '#3A1C00', pin: '#1F4FA8', pind: '#163A7E', pint: '#3F72D1' },
    { bg: '#BBA7E8', fold: '#DCD0F5', strip: '#9680CC', t: '#22143F', pin: '#FFC72C', pind: '#D9A012', pint: '#FFD966' }
  ];
  function lum(h) { var c = [1, 3, 5].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function pickIdx(key, n) {
    var last = -1, i; try { last = parseInt(localStorage.getItem(key), 10); } catch (e) {}
    do { i = Math.floor(Math.random() * n); } while (i === last && n > 1);
    try { localStorage.setItem(key, String(i)); } catch (e) {}
    return i;
  }

  function start() {
    var books = collect();
    if (!books.length) return;
    var idx = pickIdx('bookQuoteLast', books.length);

    var st = document.createElement('style');
    st.textContent =
      '#wisdom-bar{--S:46px;position:fixed;left:50%;bottom:22px;z-index:99990;box-sizing:border-box;width:min(94vw,720px);padding:40px 54px 34px 34px;text-align:center;color:var(--n-text);font-family:inherit;transform:translateX(-50%) rotate(var(--n-rot));transform-origin:50% 0;filter:drop-shadow(8px 8px 0 rgba(0,0,0,.06)) drop-shadow(0 12px 16px rgba(0,0,0,.28));animation:wisdomIn .7s cubic-bezier(.2,.9,.3,1.15)}' +
      '#wisdom-bar .w-paper{position:absolute;inset:0;z-index:0;background:var(--n-bg);clip-path:polygon(0 0,100% 0,100% calc(100% - var(--S)),calc(100% - var(--S)) 100%,0 100%)}' +
      '#wisdom-bar .w-fold{position:absolute;right:0;bottom:0;width:var(--S);height:var(--S);z-index:0}' +
      '#wisdom-bar .w-fold:before,#wisdom-bar .w-fold:after{content:"";position:absolute;inset:0}' +
      '#wisdom-bar .w-fold:before{background:var(--n-strip);clip-path:polygon(0 5%,10% 5%,0 100%)}' +
      '#wisdom-bar .w-fold:after{background:var(--n-fold);clip-path:polygon(0 100%,10% 0,100% 5%)}' +
      '#wisdom-bar .w-pin{position:absolute;z-index:2;top:-12px;left:50%;width:34px;height:34px;margin-left:-17px;border-radius:50%;background:var(--n-pin);box-shadow:inset 0 -7px 0 var(--n-pind),0 6px 0 -1px var(--n-strip)}' +
      '#wisdom-bar .w-pin:before{content:"";position:absolute;left:50%;top:-9px;width:20px;height:20px;margin-left:-10px;border-radius:50%;background:var(--n-pint);box-shadow:inset 0 -5px 0 var(--n-pind)}' +
      '#wisdom-bar .w-label,#wisdom-bar .w-text,#wisdom-bar .w-book{position:relative;z-index:1}' +
      '#wisdom-bar .w-label{font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px}' +
      '#wisdom-bar .w-text{font-family:"Segoe Print","Bradley Hand","Chalkboard SE","Comic Neue","Comic Sans MS",cursive,inherit;font-size:1.3rem;line-height:1.5;font-weight:600;margin:0 auto}' +
      '#wisdom-bar .w-book{display:inline-flex;align-items:center;gap:10px;margin-top:12px;padding:5px 14px 5px 5px;border-radius:12px;background:rgba(255,255,255,.35);color:var(--n-text);text-decoration:none;cursor:pointer;border:0;font:inherit;transition:background .15s,transform .15s}' +
      '#wisdom-bar .w-book:hover{background:rgba(255,255,255,.6);transform:translateY(-2px)}' +
      '#wisdom-bar .w-book img{width:34px;height:48px;object-fit:cover;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.35);display:block}' +
      '#wisdom-bar .w-book .wb-t{display:block;text-align:start;font-weight:800;font-size:.95rem;line-height:1.2}' +
      '#wisdom-bar .w-book .wb-s{display:block;text-align:start;font-size:.7rem;opacity:.8;margin-top:2px}' +
      '#wisdom-bar .w-x{position:absolute;z-index:3;top:12px;right:12px;background:rgba(0,0,0,.14);border:0;color:var(--n-text);width:30px;height:30px;border-radius:50%;font-size:20px;line-height:1;cursor:pointer}' +
      '#wisdom-bar .w-x:hover{background:rgba(0,0,0,.28)}' +
      '#wisdom-bar[dir=rtl]{padding:40px 34px 34px 54px}#wisdom-bar[dir=rtl] .w-x{right:auto;left:12px}#wisdom-bar[dir=rtl] .w-book{padding:5px 5px 5px 14px}' +
      '@keyframes wisdomIn{from{transform:translateX(-50%) translateY(130%) rotate(var(--n-rot));opacity:0}to{transform:translateX(-50%) rotate(var(--n-rot));opacity:1}}' +
      '@keyframes bookFlash{0%,100%{box-shadow:0 0 0 0 rgba(255,193,7,0)}30%{box-shadow:0 0 0 8px rgba(255,193,7,.75)}}' +
      '.book-card.book-flash{animation:bookFlash 1.8s ease 1;border-radius:12px}' +
      '@media (prefers-reduced-motion:reduce){#wisdom-bar{animation:none}.book-card.book-flash{animation:none}}' +
      '@media (max-width:576px){#wisdom-bar{--S:36px;bottom:14px;padding:36px 44px 26px 22px}#wisdom-bar[dir=rtl]{padding:36px 22px 26px 44px}#wisdom-bar .w-text{font-size:1.08rem}}';
    document.head.appendChild(st);

    var bar = document.createElement('div');
    bar.id = 'wisdom-bar'; bar.setAttribute('role', 'note');
    document.body.appendChild(bar);

    (function () {
      var N = NOTES[pickIdx('wisdomColorLast', NOTES.length)], txt = N.t;
      if (contrast(txt, N.bg) < 4.5) txt = contrast('#FFFFFF', N.bg) > contrast('#111111', N.bg) ? '#FFFFFF' : '#111111';
      var rot = (0.6 + Math.random() * 1.1) * (Math.random() < 0.5 ? -1 : 1), s2 = bar.style;
      s2.setProperty('--n-bg', N.bg); s2.setProperty('--n-fold', N.fold); s2.setProperty('--n-strip', N.strip);
      s2.setProperty('--n-text', txt); s2.setProperty('--n-pin', N.pin); s2.setProperty('--n-pind', N.pind);
      s2.setProperty('--n-pint', N.pint); s2.setProperty('--n-rot', rot.toFixed(2) + 'deg');
    })();

    var closed = false;
    function space() { if (!closed) document.body.style.paddingBottom = (bar.offsetHeight + 44) + 'px'; }

    function render() {
      var l = getLang(), b = books[idx];
      var q = b.quote[l] || b.quote.en || b.quote.de, title = b.title[l] || b.title.en || b.title.de;
      bar.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr'); bar.setAttribute('lang', l);
      bar.innerHTML = '<div class="w-paper"></div><div class="w-fold"></div><span class="w-pin"></span>' +
        '<div class="w-label"></div><div class="w-text"></div>' +
        '<a class="w-book" href="#"><img alt=""><span><span class="wb-t"></span><span class="wb-s"></span></span></a>' +
        '<button type="button" class="w-x">&times;</button>';
      bar.querySelector('.w-label').textContent = '📖 ' + LABEL[l];
      bar.querySelector('.w-text').textContent = '“' + q + '”';
      var a = bar.querySelector('.w-book'), im = a.querySelector('img');
      im.src = b.cover; im.alt = title;
      a.querySelector('.wb-t').textContent = title;
      a.querySelector('.wb-s').textContent = TAP[l] + ' →';
      a.href = '#' + (b.id || 'book-card-' + b.slug);
      a.onclick = function (e) {
        e.preventDefault(); track('Book Quote Note Click: ' + (b.title.en || b.slug));
        var card = document.getElementById(b.id || 'book-card-' + b.slug);
        if (!card) return;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.remove('book-flash'); void card.offsetWidth; card.classList.add('book-flash');
        setTimeout(function () { card.classList.remove('book-flash'); }, 2000);
      };
      var x = bar.querySelector('.w-x');
      x.setAttribute('aria-label', CLOSE[l]);
      x.onclick = function () { closed = true; obs.disconnect(); window.removeEventListener('resize', space); document.body.style.paddingBottom = ''; bar.remove(); };
      space();
    }
    render();
    var obs = new MutationObserver(function () { if (!closed) render(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    window.addEventListener('resize', space);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
