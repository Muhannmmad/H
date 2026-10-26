/*
 * Dhikr welcome pop-up (ARABIC and TURKISH).
 * Whenever the site is shown in ARABIC or TURKISH - the page is opened in that language, or the visitor
 * switches to it - a short pop-up appears in the middle of the screen and then disappears by itself.
 * Same sequence in both languages:
 *
 *   1) the verse (Ar-Ra'd 13:28)      3 seconds
 *   2) Subhan Allah                   2 seconds
 *   3) Alhamdulillah                  2 seconds
 *   4) La ilaha illa Allah            2 seconds
 *   5) Allahu Akbar                   2 seconds
 *
 * The pop-up never blocks clicks or scrolling. If the visitor switches to another language while it is
 * showing, it disappears immediately. The Escape key also closes it.
 */
(function () {
  'use strict';

  // ---------- SETTINGS (change here) ----------
  // One entry per language code (the value of <html lang="..">).
  var LANGS = {
    ar: {
      dir: 'rtl',
      font: '"Amiri","Scheherazade New","Noto Naskh Arabic","Traditional Arabic","Times New Roman",serif',
      webFont: 'https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap',   // loaded only when needed
      steps: [
        { text: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾', ref: 'الرعد: ٢٨', ms: 3000, verse: true },
        { text: 'سبحان الله',        ms: 2000 },
        { text: 'والحمد لله',        ms: 2000 },
        { text: 'ولا إله إلا الله',   ms: 2000 },
        { text: 'والله أكبر',        ms: 2000 }
      ]
    },
    tr: {
      dir: 'ltr',
      font: 'Georgia,"Palatino Linotype","Book Antiqua",Palatino,"Times New Roman",serif',
      webFont: null,
      steps: [
        { text: '“Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.”', ref: 'Ra‘d Suresi, 28. ayet', ms: 3000, verse: true },
        { text: 'Sübhanallah',         ms: 2000 },
        { text: 'Elhamdülillah',       ms: 2000 },
        { text: 'Lâ ilâhe illallah',   ms: 2000 },
        { text: 'Allahu Ekber',        ms: 2000 }
      ]
    }
  };
  var SHOW_REFERENCE  = true;    // small line with surah and verse number under the verse
  var ONCE_PER_VISIT  = false;   // true = only the first time per browser visit (session), false = every time
  var FADE = 280;                // fade in / fade out time in ms (included in the seconds above)
  var GAP  = 120;                // short pause between two pop-ups in ms
  // --------------------------------------------

  var pop = null, timers = [], token = 0;

  var STEPS = [], cur = null;

  // returns 'ar' / 'tr' when the page is currently in one of the dhikr languages, otherwise ''
  function dhikrLang() {
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase().slice(0, 2);
    return LANGS.hasOwnProperty(l) ? l : '';
  }

  /* ---------- look ---------- */
  function injectStyles() {
    if (document.getElementById('dhikr-css')) return;
    var s = document.createElement('style');
    s.id = 'dhikr-css';
    s.textContent =
      '#dhikr-pop{position:fixed;inset:0;z-index:100003;display:flex;align-items:center;justify-content:center;pointer-events:none;padding:16px}' +
      '#dhikr-pop .dk-card{max-width:min(92vw,820px);padding:26px 46px 24px;border-radius:28px;text-align:center;color:#f7e3a1;' +
        'background:radial-gradient(120% 140% at 50% 0%,rgba(20,128,104,.97),rgba(6,56,48,.98));' +
        'border:1px solid rgba(247,227,161,.5);' +
        'box-shadow:0 18px 60px rgba(0,0,0,.45),inset 0 0 0 5px rgba(6,56,48,.65),inset 0 0 0 6px rgba(247,227,161,.28);' +
        'opacity:0;transform:scale(.92) translateY(10px);transition:opacity ' + FADE + 'ms ease,transform ' + FADE + 'ms ease}' +
      '#dhikr-pop.on .dk-card{opacity:1;transform:none}' +
      '#dhikr-pop .dk-text{font-family:var(--dk-font);' +
        'font-weight:700;line-height:1.75;font-size:clamp(2rem,6.4vw,3.4rem);text-shadow:0 2px 10px rgba(0,0,0,.4)}' +
      '#dhikr-pop.verse .dk-text{font-size:clamp(1.6rem,4.8vw,2.6rem)}' +
      '#dhikr-pop .dk-ref{margin-top:4px;font-family:var(--dk-font);font-size:1.05rem;opacity:.8}' +
      '#dhikr-pop .dk-ref:empty{display:none}' +
      '@media (prefers-reduced-motion:reduce){#dhikr-pop .dk-card{transition:none;transform:none}}' +
      '@media print{#dhikr-pop{display:none!important}}';
    document.head.appendChild(s);
  }

  // Web font (Arabic only): loaded only when needed; the pop-up waits a moment for it (max 0.9 s)
  function ensureFont(cfg) {
    return new Promise(function (resolve) {
      if (!cfg.webFont) { resolve(); return; }
      var done = false;
      function fin() { if (!done) { done = true; resolve(); } }
      setTimeout(fin, 900);
      var link = document.getElementById('dhikr-font');
      function afterCss() {
        try { document.fonts.load('700 2rem Amiri', cfg.steps[0].text).then(fin, fin); } catch (e) { fin(); }
      }
      if (link) { afterCss(); return; }
      link = document.createElement('link');
      link.id = 'dhikr-font'; link.rel = 'stylesheet';
      link.href = cfg.webFont;
      link.onload = afterCss; link.onerror = fin;
      document.head.appendChild(link);
    });
  }

  function build(l) {
    var cfg = LANGS[l];
    injectStyles();
    removePop();
    pop = document.createElement('div');
    pop.id = 'dhikr-pop';
    pop.setAttribute('role', 'status');
    pop.setAttribute('aria-live', 'polite');
    pop.setAttribute('lang', l);
    pop.setAttribute('dir', cfg.dir);
    pop.style.setProperty('--dk-font', cfg.font);
    pop.innerHTML = '<div class="dk-card"><div class="dk-text"></div><div class="dk-ref"></div></div>';
    document.body.appendChild(pop);
  }

  function removePop() {
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
    pop = null;
  }

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function stop() {            // cancels everything at once
    token++;
    clearTimers();
    removePop();
  }

  /* ---------- the sequence ---------- */
  function play(i, tk) {
    if (tk !== token || !pop) return;
    if (i >= STEPS.length) { stop(); return; }
    var s = STEPS[i];
    pop.querySelector('.dk-text').textContent = s.text;
    pop.querySelector('.dk-ref').textContent = (s.ref && SHOW_REFERENCE) ? s.ref : '';
    pop.classList.toggle('verse', !!s.verse);
    void pop.offsetWidth;                                       // lets the fade-in start from the hidden state
    pop.classList.add('on');
    timers.push(setTimeout(function () { if (tk === token && pop) pop.classList.remove('on'); }, s.ms - FADE));   // fade out
    timers.push(setTimeout(function () { play(i + 1, tk); }, s.ms + GAP));                                         // next one
  }

  function start(l) {
    if (ONCE_PER_VISIT) {
      try {
        if (sessionStorage.getItem('dhikrShown_' + l)) return;
        sessionStorage.setItem('dhikrShown_' + l, '1');
      } catch (e) {}
    }
    stop();
    var tk = token;
    cur = l;
    STEPS = LANGS[l].steps;
    ensureFont(LANGS[l]).then(function () {
      if (tk !== token || dhikrLang() !== l) return;
      build(l);
      play(0, tk);
    });
  }

  /* ---------- when does it show? ---------- */
  var current = '';
  function check() {
    var l = dhikrLang();
    if (l === current) return;
    current = l;
    if (l) start(l);        // opened in Arabic / Turkish, or switched to it (also Arabic <-> Turkish)
    else stop();            // left these languages: pop-up goes away at once
  }

  new MutationObserver(check).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') stop(); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(check, 350); });
  window.addEventListener('load', function () { setTimeout(check, 350); });
  check();
})();
