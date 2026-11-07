/*
 * Flags & Capitals game tools
 *
 * 1) FULLSCREEN: the ⛶ button above the game now really works. It uses the browser's fullscreen mode and, where a
 *    browser does not allow that (for example iPhone Safari), a full-window view instead. Leave it with the ✕ button,
 *    the ⛶ button or the Escape key.
 *
 * 2) GAME LINK: https://muhammadhassan.eu/game.html  opens ONLY the game (same game, same languages, nothing else of
 *    the website), with a "Visit my website" button on top, and has its own link preview (img/og-game.jpg).
 *    game.html is a copy of index.html made by make_game_page.py (it sets window.__GAME_ONLY = true).
 *    The small 🔗 button next to ⛶ copies this link.
 */
(function () {
  'use strict';

  function track(n) { try { if (typeof trackEvent === 'function') trackEvent(n); } catch (e) {} }

  var wrap = document.getElementById('flagGameCardWrapper');
  var fsBtn = document.getElementById('fullscreenBtn');
  if (!wrap || !fsBtn) return;

  var GAME_PARAM = window.__GAME_ONLY === true;
  var BASE_URL  = location.origin + location.pathname.replace(/[^\/]*$/, '');     // folder of this page, ends with /
  var PLAIN_URL = BASE_URL;                                                       // the normal website
  var GAME_URL  = BASE_URL + 'game.html';

  /* ---------------- styles ---------------- */
  var css =
    '#flagGameCardWrapper.fs-on{position:fixed!important;inset:0;z-index:100010;overflow:hidden;box-sizing:border-box;width:100%!important;max-width:none!important;height:100%!important;margin:0!important;padding:0;display:flex;align-items:center;justify-content:center;background:#fff}' +
    'body.dark-mode #flagGameCardWrapper.fs-on{background:#12151c}' +
    '#flagGameCardWrapper.fs-on #flagGameCard{margin:0!important;flex:none;max-width:none!important}' +
    '#flagGameCardWrapper .fs-close{display:none;position:fixed;top:8px;right:8px;z-index:100011;width:28px;height:28px;padding:0;border:0;border-radius:50%;font:700 15px/28px system-ui,sans-serif;text-align:center;background:rgba(0,0,0,.45);color:#fff;cursor:pointer;opacity:.85}' +
    '#flagGameCardWrapper .fs-close:hover{opacity:1;background:rgba(0,0,0,.7)}' +
    '#flagGameCardWrapper.fs-on .fs-close{display:block}' +
    'body.fs-lock{overflow:hidden}' +
    '.game-link-ok{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:100020;background:#198754;color:#fff;padding:8px 16px;border-radius:20px;font:600 14px system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.3)}' +
    /* game-only page */
    'body.game-only{overflow:hidden}' +
    'body.game-only > *:not(#game-only):not(script):not(style):not(link){display:none!important}' +
    '#game-only{position:fixed;inset:0;z-index:99995;overflow:hidden;display:flex;flex-direction:column;background:#f4f6fb}' +
    'body.dark-mode #game-only{background:#12151c;color:#e8eaf0}' +
    '#game-only .go-bar{flex:none;position:relative;z-index:5;display:flex;align-items:center;gap:8px;flex-wrap:nowrap;padding:6px 12px;background:linear-gradient(90deg,#0d6efd,#0a4fb8);color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.25)}' +
    '#game-only .go-title{font-weight:800;font-size:1.05rem;margin-inline-end:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#game-only .go-lang{flex:none;white-space:nowrap}' +
    '@media (max-width:480px){#game-only .go-title{display:none}#game-only .go-bar{justify-content:space-between;padding:6px 8px}#game-only .go-visit{font-size:.8rem;padding:6px 10px}#game-only .go-lang button{padding:3px 8px}}' +
    '#game-only .go-lang button{border:1px solid rgba(255,255,255,.6);background:transparent;color:#fff;border-radius:14px;padding:3px 10px;font-weight:700;font-size:.8rem;cursor:pointer;margin-inline-start:4px}' +
    '#game-only .go-lang button.on{background:#fff;color:#0a4fb8}' +
    '#game-only .go-visit{flex:none;background:#fff;color:#0a4fb8;text-decoration:none;font-weight:800;border-radius:18px;padding:6px 14px;font-size:.9rem;white-space:nowrap}' +
    '#game-only .go-visit:hover{background:#ffe27a;color:#222}' +
    '#game-only .go-main{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:4px}' +
    '#game-only .go-main > *{flex:none}' +
    '#game-only .go-main p.text-muted{display:none}' +
    '#game-only .fullscreen-bar{display:none}' +
    'body.fs-lock #game-only .go-main > *{transform:none!important}' +
    '#game-only .go-fsrow{display:flex;justify-content:center;margin-bottom:6px}' +
    '#game-only .go-fs{border:0;background:#0d6efd;color:#fff;font-weight:800;border-radius:18px;padding:5px 14px;font-size:.85rem;white-space:nowrap;cursor:pointer}' +
    '#game-only .go-fs:hover{background:#0a4fb8}' +
    '#game-only.go-mobile{overflow:auto;-webkit-overflow-scrolling:touch}' +
    '#game-only.go-mobile .go-main{display:block;flex:none;min-height:0;overflow:visible;padding:10px 8px 28px}' +
    '#game-only.go-mobile .go-main > *{width:100%!important;transform:none!important}' +
    '#game-only #flagGameCardWrapper:not(.fs-on),#game-only #flagGameCardWrapper:not(.fs-on) #flagGameCard{width:100%!important;max-width:none!important;box-sizing:border-box!important}' +
    '#game-only .go-main h3{display:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var onLeave = function () {};      // set in game-only mode: re-fits the page after fullscreen

  /* ---------------- fit the game to the screen (no scrolling) ---------------- */
  // Scales `target()` so that it fills `container()` exactly (both width and height), never needing a scrollbar.
  function makeFitter(container, target, natW, maxScale, factor) {
    factor = factor || 1;
    var raf = 0;
    function run() {
      raf = 0;
      var c = container(), t = target();
      if (!c || !t) return;
      if (t.id !== 'flagGameCard' && document.body.classList.contains('fs-lock')) return;   // page layout waits while the game is fullscreen
      var cs = getComputedStyle(c);
      var aw = c.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var ah = c.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (aw <= 0 || ah <= 0) return;
      t.style.transform = 'none';
      // try several layout widths (narrow ... wide) and keep the one that fills the screen best -> the game looks wide, not tall and thin
      var best = 0, bestArea = 0, bw = 0, bh = 0, k, i, cand, w, h;
      var list = [360, 440, 520, 620, 740, 860, 980, 1100, 1240];
      for (i = 0; i < list.length; i++) {
        cand = Math.min(list[i], aw);
        t.style.width = cand + 'px';
        w = t.offsetWidth; h = t.offsetHeight;
        if (!w || !h) continue;
        k = Math.min(aw / w, ah / h, maxScale);
        var area = k * k * w * h;                                    // biggest filled screen area wins
        if (area > bestArea * 1.001) { bestArea = area; best = k; bw = cand; bh = h; }
        if (cand >= aw) break;
      }
      if (!best) return;
      t.style.width = bw + 'px';
      k = best * factor;
      t.style.transformOrigin = 'center center';
      t.style.transform = 'scale(' + k.toFixed(4) + ')';
    }
    function fit() { if (!raf) raf = requestAnimationFrame(run); }
    fit.reset = function () { var t = target(); if (t) { t.style.transform = ''; t.style.transformOrigin = ''; t.style.width = ''; } };
    return fit;
  }
  function watchFit(fit, container, target) {
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', function () { setTimeout(fit, 200); });
    if (window.ResizeObserver) { try { new ResizeObserver(fit).observe(container); } catch (e) {} }
    try {
      new MutationObserver(fit).observe(target, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['class', 'src'] });
    } catch (e) {}
    target.addEventListener('load', fit, true);        // flag images
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  /* Fullscreen: ONE fixed size for the whole game session.  The layout width and the card height are decided once
     (when fullscreen opens / the screen size changes) and then kept, so the game does NOT change size from question to
     question (long country names, tall flags ...).  The card keeps a fixed height; only if a question is clearly
     taller than anything before, the reference grows a little (rare). */
  var fsState = { W: 0, H: 0, aw: 0, ah: 0 };
  function fsFit() {
    var c = wrap, t = document.getElementById('flagGameCard');
    if (!c || !t) return;
    var cs = getComputedStyle(c);
    var aw = c.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var ah = c.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (aw <= 0 || ah <= 0) return;
    if (Math.abs(aw - fsState.aw) > 2 || Math.abs(ah - fsState.ah) > 2) fsState = { W: 0, H: 0, aw: aw, ah: ah };   // new screen size -> decide again
    t.style.transform = 'none'; t.style.minHeight = '0'; t.style.boxSizing = 'border-box';
    var h, w;
    if (!fsState.W) {                                    // first time: choose the layout width that fills the screen best
      var list = [360, 440, 520, 620, 740, 860, 980, 1100, 1240], best = 0, bw = 0, bh = 0, i, cand, k, area;
      for (i = 0; i < list.length; i++) {
        cand = Math.min(list[i], aw); t.style.width = cand + 'px';
        w = t.offsetWidth; h = t.offsetHeight; if (!w || !h) continue;
        k = Math.min(aw / w, ah / h, 3); area = k * k * w * h;
        if (area > best * 1.001) { best = area; bw = cand; bh = h; }
        if (cand >= aw) break;
      }
      if (!bw) return;
      fsState.W = bw; fsState.H = Math.ceil(bh * 1.2);    // 20 % headroom for taller questions
    } else {
      t.style.width = fsState.W + 'px';
      h = t.offsetHeight;
      if (h > fsState.H) fsState.H = Math.ceil(h * 1.05);  // clearly taller than ever before: grow the reference once
    }
    // fill the screen completely: keep the zoom from the height, make the layout as wide as needed so the game is wide
    var sc, tries = 0;
    do {
      sc = Math.min(aw / fsState.W, ah / fsState.H, 3);
      t.style.width = Math.max(fsState.W, aw / sc) + 'px';
      t.style.minHeight = fsState.H + 'px';
      h = t.offsetHeight;
      if (h > fsState.H) fsState.H = Math.ceil(h * 1.05); else break;
    } while (++tries < 3);
    t.style.transformOrigin = 'center center';
    t.style.transform = 'scale(' + sc.toFixed(4) + ')';
  }
  fsFit.reset = function () {
    fsState = { W: 0, H: 0, aw: 0, ah: 0 };
    var t = document.getElementById('flagGameCard');
    if (t) { t.style.transform = ''; t.style.transformOrigin = ''; t.style.width = ''; t.style.minHeight = ''; t.style.boxSizing = ''; }
  };
  var fsCard = document.getElementById('flagGameCard');
  if (fsCard) watchFit(function () { if (wrap.classList.contains('fs-on')) fsFit(); }, wrap, fsCard);

  /* ---------------- fullscreen ---------------- */
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button'; closeBtn.className = 'fs-close';   closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close fullscreen');
  wrap.appendChild(closeBtn);

  function nativeEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }

  function enter() {
    wrap.classList.add('fs-on'); document.body.classList.add('fs-lock');
    fsState = { W: 0, H: 0, aw: 0, ah: 0 };
    fsFit(); setTimeout(fsFit, 120); setTimeout(fsFit, 400);
    var rq = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
    if (rq) { try { var p = rq.call(wrap); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  }
  function leave() {
    wrap.classList.remove('fs-on'); document.body.classList.remove('fs-lock'); fsFit.reset(); setTimeout(onLeave, 0); setTimeout(onLeave, 250);
    var ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (nativeEl() && ex) { try { var p = ex.call(document); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  }
  function toggle() { if (wrap.classList.contains('fs-on')) leave(); else enter(); }

  // capture on document: wins over any older (broken) handler of the button
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('#fullscreenBtn')) {
      e.preventDefault(); e.stopImmediatePropagation();
      track('Fullscreen Button Click'); toggle();
    }
  }, true);
  closeBtn.addEventListener('click', function () { leave(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('fs-on')) leave(); });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      if (!nativeEl() && wrap.classList.contains('fs-on')) { wrap.classList.remove('fs-on'); document.body.classList.remove('fs-lock'); fsFit.reset(); setTimeout(onLeave, 0); setTimeout(onLeave, 250); }   // left with Esc
    });
  });

  /* ---------------- copy-link button ---------------- */
  if (!GAME_PARAM) {
    var lb = document.createElement('button');
    lb.type = 'button'; lb.id = 'gameLinkBtn'; lb.textContent = '🔗';
    lb.title = 'Copy game link'; lb.setAttribute('aria-label', 'Copy game link');
    try {
      var cs = getComputedStyle(fsBtn);
      ['width', 'height', 'background', 'border', 'borderRadius', 'color', 'fontSize', 'cursor', 'padding', 'lineHeight', 'boxShadow'].forEach(function (k) { lb.style[k] = cs[k]; });
    } catch (e) {}
    lb.style.marginInlineStart = '6px';
    fsBtn.parentNode.insertBefore(lb, fsBtn);
    lb.addEventListener('click', function () {
      track('Game Link Copied');
      function ok() {
        var m = document.createElement('div'); m.className = 'game-link-ok'; m.textContent = '✓ ' + GAME_URL;
        document.body.appendChild(m); setTimeout(function () { m.remove(); }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(GAME_URL).then(ok, function () { window.prompt('Game link:', GAME_URL); });
      else window.prompt('Game link:', GAME_URL);
    });
  }

  /* ---------------- game-only page ---------------- */
  if (GAME_PARAM) {
    var col = wrap.closest('.col-lg-6') || wrap.parentNode;
    var ov = document.createElement('div');
    ov.id = 'game-only';
    ov.innerHTML =
      '<div class="go-bar">' +
        '<div class="go-title">Muhammad Hassan</div>' +
        '<div class="go-lang"><button type="button" data-l="de">DE</button><button type="button" data-l="en">EN</button><button type="button" data-l="ar">AR</button></div>' +
        '<a class="go-visit" href="' + PLAIN_URL + '"><span data-lang="de">🌐 Meine Website besuchen</span><span data-lang="en">🌐 Visit my website</span><span data-lang="ar" dir="rtl">🌐 زيارة موقعي</span></a>' +
      '</div>' +
      '<div class="go-main"></div>';
    document.body.appendChild(ov);

    col.className = '';                                  // no Bootstrap column: the game is sized to the screen below
    col.style.visibility = 'visible'; col.style.animationName = 'none'; col.style.opacity = '1';
    ov.querySelector('.go-main').appendChild(col);
    var fsRow = document.createElement('div');          // fullscreen button: directly above the game
    fsRow.className = 'go-fsrow';
    fsRow.innerHTML = '<button type="button" class="go-fs"><span data-lang="de">⛶ Vollbild</span><span data-lang="en">⛶ Fullscreen</span><span data-lang="ar" dir="rtl">⛶ ملء الشاشة</span></button>';
    col.insertBefore(fsRow, col.firstChild);          // the real game (with all its scripts) moves here
    document.body.classList.add('game-only');
    try { document.title = 'Flags & Capitals Quiz – Muhammad Hassan'; } catch (e) {}
    track('Game Link Opened');
    var pageFit = makeFitter(function () { return ov.querySelector('.go-main'); }, function () { return col; }, 520, 3, 0.93);          // 0.93 = the game on the link page is a little smaller than the full window
    watchFit(pageFit, ov.querySelector('.go-main'), col);
    onLeave = function () { if (!ov.classList.contains('go-mobile')) pageFit(); };
    // computer / wide screen: the game fills the window.  Phone / portrait: normal full-width game, scrollable,
    // and the ⛶ button makes the game itself full screen.
    var mq = window.matchMedia ? window.matchMedia('(max-width: 768px), (orientation: portrait)') : null;
    function applyMode() {
      var mobile = !!(mq && mq.matches);
      ov.classList.toggle('go-mobile', mobile);
      if (mobile) { if (wrap.classList.contains('fs-on')) fsFit(); pageFit.reset(); col.style.width = ''; }
      else pageFit();
    }
    if (mq) { if (mq.addEventListener) mq.addEventListener('change', applyMode); else if (mq.addListener) mq.addListener(applyMode); }
    window.addEventListener('resize', applyMode);
    applyMode(); setTimeout(applyMode, 150); setTimeout(applyMode, 500); setTimeout(applyMode, 1200);

    ov.querySelector('.go-fs').addEventListener('click', function () { track('Game Link: Fullscreen Button Click'); toggle(); });
    var visit = ov.querySelector('.go-visit');
    visit.addEventListener('click', function () { track('Game Link: Visit Website Click'); });

    function markLang() {
      var l = (document.documentElement.getAttribute('lang') || 'de').slice(0, 2).toLowerCase();
      ov.querySelectorAll('.go-lang button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-l') === l); });
      ov.dir = (l === 'ar') ? 'rtl' : 'ltr';
      ov.querySelectorAll('.go-visit [data-lang], .go-fs [data-lang]').forEach(function (x) { x.style.display = (x.getAttribute('data-lang') === l || (l !== 'de' && l !== 'ar' && x.getAttribute('data-lang') === 'en')) ? '' : 'none'; });
    }
    ov.querySelectorAll('.go-lang button').forEach(function (b) {
      b.addEventListener('click', function () {
        var src = document.getElementById('lang-' + b.getAttribute('data-l'));   // the site's own language buttons do the switching
        if (src) src.click();
      });
    });
    new MutationObserver(markLang).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    markLang();
  }
})();
