/*
 * Arabic welcome pop-up.
 * Whenever the site is shown in ARABIC - the page is opened in Arabic, or the visitor switches to Arabic - a
 * short pop-up appears in the middle of the screen and then disappears by itself:
 *
 *   1) the verse                      3 seconds
 *   2) سبحان الله                       2 seconds
 *   3) والحمد لله                       2 seconds
 *   4) ولا إله إلا الله                   2 seconds
 *   5) والله أكبر                       2 seconds
 *
 * The pop-up never blocks clicks or scrolling. If the visitor switches to another language while it is
 * showing, it disappears immediately. The Escape key also closes it.
 */
(function () {
  'use strict';

  // ---------- SETTINGS (change here) ----------
  var STEPS = [
    { text: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾', ref: 'الرعد: ٢٨', ms: 3000, verse: true },
    { text: 'سبحان الله',        ms: 2000 },
    { text: 'والحمد لله',        ms: 2000 },
    { text: 'ولا إله إلا الله',   ms: 2000 },
    { text: 'والله أكبر',        ms: 2000 }
  ];
  var SHOW_REFERENCE  = true;    // small line "الرعد: ٢٨" (surah and verse number) under the verse
  var ONCE_PER_VISIT  = false;   // true = only the first time per browser visit (session), false = every time
  var FADE = 280;                // fade in / fade out time in ms (included in the seconds above)
  var GAP  = 120;                // short pause between two pop-ups in ms
  // --------------------------------------------

  var pop = null, timers = [], token = 0;

  function isArabic() {
    return (document.documentElement.getAttribute('lang') || '').toLowerCase().slice(0, 2) === 'ar';
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
      '#dhikr-pop .dk-text{font-family:"Amiri","Scheherazade New","Noto Naskh Arabic","Traditional Arabic","Times New Roman",serif;' +
        'font-weight:700;line-height:1.75;font-size:clamp(2rem,6.4vw,3.4rem);text-shadow:0 2px 10px rgba(0,0,0,.4)}' +
      '#dhikr-pop.verse .dk-text{font-size:clamp(1.6rem,4.8vw,2.6rem)}' +
      '#dhikr-pop .dk-ref{margin-top:4px;font-family:"Amiri","Noto Naskh Arabic",serif;font-size:1.05rem;opacity:.8}' +
      '#dhikr-pop .dk-ref:empty{display:none}' +
      '@media (prefers-reduced-motion:reduce){#dhikr-pop .dk-card{transition:none;transform:none}}' +
      '@media print{#dhikr-pop{display:none!important}}';
    document.head.appendChild(s);
  }

  // Amiri (Arabic calligraphy font): loaded only when needed; the pop-up waits a moment for it (max 0.9 s)
  function ensureFont() {
    return new Promise(function (resolve) {
      var done = false;
      function fin() { if (!done) { done = true; resolve(); } }
      setTimeout(fin, 900);
      var link = document.getElementById('dhikr-font');
      function afterCss() {
        try { document.fonts.load('700 2rem Amiri', STEPS[0].text).then(fin, fin); } catch (e) { fin(); }
      }
      if (link) { afterCss(); return; }
      link = document.createElement('link');
      link.id = 'dhikr-font'; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap';
      link.onload = afterCss; link.onerror = fin;
      document.head.appendChild(link);
    });
  }

  function build() {
    injectStyles();
    removePop();
    pop = document.createElement('div');
    pop.id = 'dhikr-pop';
    pop.setAttribute('role', 'status');
    pop.setAttribute('aria-live', 'polite');
    pop.setAttribute('lang', 'ar');
    pop.setAttribute('dir', 'rtl');
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

  function start() {
    if (ONCE_PER_VISIT) {
      try { if (sessionStorage.getItem('dhikrShown')) return; sessionStorage.setItem('dhikrShown', '1'); } catch (e) {}
    }
    stop();
    var tk = token;
    ensureFont().then(function () {
      if (tk !== token || !isArabic()) return;
      build();
      play(0, tk);
    });
  }

  /* ---------- when does it show? ---------- */
  var wasArabic = false;
  function check() {
    var ar = isArabic();
    if (ar && !wasArabic) { wasArabic = true; start(); }          // opened in Arabic, or switched to Arabic
    else if (!ar && wasArabic) { wasArabic = false; stop(); }     // left Arabic: pop-up goes away at once
  }

  new MutationObserver(check).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') stop(); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(check, 350); });
  window.addEventListener('load', function () { setTimeout(check, 350); });
  check();
})();
