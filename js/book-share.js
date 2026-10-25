/*
 * Share buttons under every "Read online" banner (first row of "My Writings").
 * The shared link is the preview page share/<slug>.html (book cover + title in social previews), which opens the online reader.
 */
(function () {
  'use strict';
  var BASE = 'https://muhammadhassan.eu/share/';
  var LABEL = { de: 'Teilen', en: 'Share', ar: 'مشاركة', fr: 'Partager', es: 'Compartir', it: 'Condividi', nl: 'Delen', pl: 'Udostępnij', pt: 'Partilhar', ro: 'Distribuie', sv: 'Dela', tr: 'Paylaş', el: 'Κοινοποίηση', ru: 'Поделиться', uk: 'Поділитися' };
  var COPIED = { de: 'Link kopiert – jetzt einfügen', en: 'Link copied – now paste it', ar: 'تم نسخ الرابط – الصقه الآن' };
  var NETS = [
    { id: 'facebook',  icon: 'fab fa-facebook-f',        color: '#1877F2', name: 'Facebook' },
    { id: 'instagram', icon: 'fab fa-instagram',         color: 'linear-gradient(45deg,#feda75,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5)', name: 'Instagram' },
    { id: 'tiktok',    icon: 'fab fa-tiktok',            color: '#000000', name: 'TikTok' },
    { id: 'messenger', icon: 'fab fa-facebook-messenger', color: 'linear-gradient(135deg,#00B2FF,#006AFF)', name: 'Messenger' },
    { id: 'whatsapp',  icon: 'fab fa-whatsapp',          color: '#25D366', name: 'WhatsApp' },
    { id: 'telegram',  icon: 'fab fa-telegram-plane',    color: '#229ED9', name: 'Telegram' }
  ];
  function track(n) { try { if (typeof trackEvent === 'function') trackEvent(n); } catch (e) {} }
  function lang() { var h = (document.documentElement.getAttribute('lang') || '').slice(0, 2); return LABEL[h] ? h : 'en'; }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'bs-toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.classList.add('bs-out'); }, 2600); setTimeout(function () { t.remove(); }, 3100);
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function () { legacy(text); });
    legacy(text); return Promise.resolve();
  }
  function legacy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove();
  }
  function share(net, url, title) {
    var u = encodeURIComponent(url), t = encodeURIComponent(title + ' – Muhammad Hassan'), mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (net === 'facebook') return window.open('https://www.facebook.com/sharer/sharer.php?u=' + u, '_blank', 'noopener');
    if (net === 'whatsapp') return window.open('https://wa.me/?text=' + t + '%20' + u, '_blank', 'noopener');
    if (net === 'telegram') return window.open('https://t.me/share/url?url=' + u + '&text=' + t, '_blank', 'noopener');
    if (net === 'messenger') {
      if (mobile) { window.location.href = 'fb-messenger://share/?link=' + u; return; }
      return window.open('https://www.facebook.com/dialog/send?link=' + u + '&redirect_uri=' + u + '&app_id=966242223397117', '_blank', 'noopener');
    }
    // Instagram / TikTok have no web "share link" address: use the phone's share sheet, or copy the link and open the app/site
    if (mobile && navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
    copy(url).then(function () { toast(COPIED[lang()] || COPIED.en); });
    window.open(net === 'instagram' ? 'https://www.instagram.com/' : 'https://www.tiktok.com/', '_blank', 'noopener');
  }

  function start() {
    var st = document.createElement('style');
    st.textContent =
      '.book-share{box-sizing:border-box;margin:12px auto 0;max-width:calc(100% - 16px);padding:10px 12px 12px;background:#fff;color:#444;border:1px solid rgba(0,0,0,.08);border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,.08);text-align:center;position:relative;z-index:2}' +
      '.book-share-label{display:block;font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.7;margin-bottom:8px;color:#444}' +
      '.book-share-row{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}' +
      '.book-share-btn{width:32px;height:32px;flex:0 0 32px;border-radius:50%;border:0;padding:0;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:15px;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.25);transition:transform .15s ease,box-shadow .15s ease}' +
      '.book-share-btn:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 6px 14px rgba(0,0,0,.3)}' +
      '.book-share-btn:focus-visible{outline:2px solid #0d6efd;outline-offset:2px}' +
      '.bs-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:100001;background:#222;color:#fff;padding:10px 18px;border-radius:30px;font-size:.9rem;box-shadow:0 6px 18px rgba(0,0,0,.35);transition:opacity .4s}' +
      '.bs-toast.bs-out{opacity:0}';
    document.head.appendChild(st);
    document.querySelectorAll('#writings .book-promo:not(.book-promo-soon)').forEach(function (card) {
      var link = card.querySelector('a.book-promo-link[href^="reader.html"]');
      if (!link) return;
      var m = (link.getAttribute('href') || '').match(/[?&]book=([^&#]+)/);
      if (!m) return;
      var slug = decodeURIComponent(m[1]), title = link.getAttribute('data-book-title') || slug;
      var url = BASE + encodeURIComponent(slug) + '.html';
      var box = document.createElement('div'); box.className = 'book-share';
      var lab = document.createElement('span'); lab.className = 'book-share-label'; lab.textContent = '↗ ' + LABEL[lang()];
      box.appendChild(lab);
      var row = document.createElement('div'); row.className = 'book-share-row'; box.appendChild(row);
      NETS.forEach(function (n) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'book-share-btn';
        b.style.background = n.color; b.title = n.name; b.setAttribute('aria-label', n.name + ' – ' + title);
        b.innerHTML = '<i class="' + n.icon + '" aria-hidden="true"></i>';
        b.addEventListener('click', function (e) { e.stopPropagation(); track('Book Share: ' + n.name + ' - ' + title); share(n.id, url, title); });
        row.appendChild(b);
      });
      card.appendChild(box);
      new MutationObserver(function () { lab.textContent = '↗ ' + LABEL[lang()]; }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
