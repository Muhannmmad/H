/*
 * Birthday celebration: fireworks + confetti + greeting banner.
 * Shown ONLY on 18, 19 and 20 October (every year, visitor's local date).
 * On all other days this script does nothing.
 *
 * Test any time:  add  ?birthday=1  to the page URL  (e.g. index.html?birthday=1)
 */
(function () {
  'use strict';

  // ---------- SETTINGS (change here) ----------
  var MONTH = 9;               // October (January = 0)
  var DAYS = [18, 19, 20];     // days the celebration is visible
  var FIREWORKS_SECONDS = 20;  // how long fireworks run after the page loads
  var NAME = 'Muhammad';       // name shown in the greeting ('' to hide)
  // --------------------------------------------

  var now = new Date();
  var forced = /[?&]birthday=1\b/.test(location.search);
  var active = now.getMonth() === MONTH && DAYS.indexOf(now.getDate()) !== -1;
  if (!active && !forced) return;

  var lang = (document.documentElement.lang || 'en').toLowerCase();
  if (/(^|\/)de(\.html)?(\/|$)/i.test(location.pathname)) lang = 'de';
  var isDE = lang.indexOf('de') === 0;
  var TXT = isDE
    ? { title: 'Alles Gute zum Geburtstag', sub: 'Danke, dass Sie meine Webseite besuchen!', close: 'Schließen' }
    : { title: 'Happy Birthday', sub: 'Thank you for visiting my website!', close: 'Close' };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function start() {
    injectStyles();
    buildBanner();
    if (!reduceMotion) runFireworks();
  }

  function injectStyles() {
    var css =
      '#bday-banner{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:100000;' +
      'max-width:92vw;padding:14px 44px 14px 22px;border-radius:14px;text-align:center;color:#fff;' +
      'background:linear-gradient(135deg,#ff4d8d,#ff9a3c,#7b5cff);background-size:200% 200%;' +
      'box-shadow:0 10px 30px rgba(0,0,0,.35);font-family:inherit;animation:bdayIn .7s ease-out,bdayShift 6s ease infinite}' +
      '#bday-banner .bday-t{font-size:1.25rem;font-weight:700;line-height:1.3}' +
      '#bday-banner .bday-s{font-size:.9rem;opacity:.95;margin-top:2px}' +
      '#bday-banner button{position:absolute;top:6px;right:8px;background:none;border:0;color:#fff;' +
      'font-size:22px;line-height:1;cursor:pointer;padding:4px 8px}' +
      '#bday-fx{position:fixed;inset:0;width:100%;height:100%;z-index:99999;pointer-events:none}' +
      '.bday-balloon{position:fixed;bottom:-120px;z-index:99998;pointer-events:none;font-size:42px;' +
      'animation:bdayRise linear forwards}' +
      '@keyframes bdayIn{from{opacity:0;transform:translate(-50%,-30px) scale(.9)}to{opacity:1;transform:translate(-50%,0) scale(1)}}' +
      '@keyframes bdayShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}' +
      '@keyframes bdayRise{to{transform:translateY(-120vh) rotate(12deg)}}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildBanner() {
    var b = document.createElement('div');
    b.id = 'bday-banner';
    b.setAttribute('role', 'status');
    var title = '🎉 ' + TXT.title + (NAME ? ', ' + NAME : '') + '! 🎂';
    b.innerHTML = '<div class="bday-t"></div><div class="bday-s"></div>' +
      '<button type="button" aria-label="' + TXT.close + '">&times;</button>';
    b.querySelector('.bday-t').textContent = title;
    b.querySelector('.bday-s').textContent = TXT.sub;
    b.querySelector('button').onclick = function () { b.remove(); };
    document.body.appendChild(b);

    if (!reduceMotion) {
      var emojis = ['🎈', '🎈', '🎈', '🎉', '🎊'];
      for (var i = 0; i < 12; i++) {
        (function (i) {
          setTimeout(function () {
            var el = document.createElement('div');
            el.className = 'bday-balloon';
            el.textContent = emojis[i % emojis.length];
            el.style.left = (4 + Math.random() * 90) + '%';
            var d = 8 + Math.random() * 6;
            el.style.animationDuration = d + 's';
            document.body.appendChild(el);
            setTimeout(function () { el.remove(); }, d * 1000 + 200);
          }, i * 600);
        })(i);
      }
    }
  }

  function runFireworks() {
    var canvas = document.createElement('canvas');
    canvas.id = 'bday-fx';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var rockets = [], sparks = [], confetti = [];
    var endAt = Date.now() + FIREWORKS_SECONDS * 1000;
    var nextLaunch = 0;
    var colors = ['#ff4d8d', '#ffd23f', '#3ddc97', '#4cc9f0', '#b388ff', '#ff9a3c', '#ffffff'];

    function launch() {
      rockets.push({
        x: W * (0.15 + Math.random() * 0.7), y: H,
        vx: (Math.random() - 0.5) * 2, vy: -(H / 55 + Math.random() * 3),
        targetY: H * (0.15 + Math.random() * 0.3),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function explode(x, y, color) {
      var n = 60 + Math.floor(Math.random() * 30);
      for (var i = 0; i < n; i++) {
        var a = (Math.PI * 2 * i) / n, sp = 1.5 + Math.random() * 4;
        sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          life: 1, decay: 0.012 + Math.random() * 0.014,
          color: Math.random() < 0.3 ? colors[Math.floor(Math.random() * colors.length)] : color });
      }
      for (var j = 0; j < 12; j++) {
        confetti.push({ x: x, y: y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4,
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: 1,
          color: colors[Math.floor(Math.random() * colors.length)] });
      }
    }

    function frame(t) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      if (Date.now() < endAt && t > nextLaunch) {
        launch();
        if (Math.random() < 0.4) launch();
        nextLaunch = t + 500 + Math.random() * 600;
      }

      rockets = rockets.filter(function (r) {
        r.x += r.vx; r.y += r.vy; r.vy += 0.06;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, 7); ctx.fillStyle = r.color; ctx.fill();
        if (r.y <= r.targetY || r.vy >= 0) { explode(r.x, r.y, r.color); return false; }
        return true;
      });

      sparks = sparks.filter(function (p) {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.045; p.life -= p.decay;
        if (p.life <= 0) return false;
        ctx.globalAlpha = p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fillStyle = p.color; ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      ctx.globalCompositeOperation = 'source-over';
      confetti = confetti.filter(function (c) {
        c.x += c.vx; c.y += c.vy; c.vy += 0.12; c.vx *= 0.99; c.rot += c.vr; c.life -= 0.008;
        if (c.life <= 0 || c.y > H + 20) return false;
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
        ctx.globalAlpha = Math.min(1, c.life * 2);
        ctx.fillStyle = c.color; ctx.fillRect(-3, -5, 6, 10);
        ctx.restore();
        return true;
      });
      ctx.globalAlpha = 1;

      if (Date.now() < endAt || rockets.length || sparks.length || confetti.length) {
        requestAnimationFrame(frame);
      } else {
        window.removeEventListener('resize', resize);
        canvas.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
