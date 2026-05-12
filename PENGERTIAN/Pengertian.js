/* ======================================
   Pengertian.js — Briket Kompos
   SMA Trinitas Bandung · INSPIRE 2025
====================================== */

// ── SIDEBAR ──
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeSidebar();
});

// ── LANGUAGE SWITCHER ──
function setLang(lang) {
  if (lang === 'en') {
    document.body.classList.add('en');
  } else {
    document.body.classList.remove('en');
  }
  document.querySelectorAll('.lang-pill button').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  localStorage.setItem('briket-lang', lang);
}

// Muat bahasa tersimpan
document.addEventListener('DOMContentLoaded', function () {
  var saved = localStorage.getItem('briket-lang') || 'id';
  setLang(saved);

  initHeroTyping();
  initSparkles();
  initTagGlow();
});

// ── TYPING EFFECT ON HERO HEADLINE ──
function initHeroTyping() {
  var headline = document.querySelector('.hero-headline');
  if (!headline) return;

  var idSpan = headline.querySelector('[data-lang="id"]');
  if (!idSpan) return;

  var beforeEmText = 'BRIKET';
  var emText = 'KOMPOS.';

  var textNode = document.createTextNode('');
  var emEl = document.createElement('em');
  var emTextNode = document.createTextNode('');
  var cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  emEl.appendChild(emTextNode);

  idSpan.innerHTML = '';
  idSpan.appendChild(textNode);
  idSpan.appendChild(emEl);
  idSpan.appendChild(cursor);

  var chars1 = beforeEmText.split('');
  var chars2 = emText.split('');
  var charDelay = 70;
  var phase = 1;
  var startTime = null;

  function tick(time) {
    if (startTime === null) startTime = time;
    var elapsed = time - startTime;

    if (phase === 1) {
      var idx = Math.min(Math.floor(elapsed / charDelay), chars1.length);
      textNode.textContent = chars1.slice(0, idx).join('');
      if (idx >= chars1.length) {
        phase = 2;
        startTime = null;
      }
    } else {
      var idx = Math.min(Math.floor(elapsed / charDelay), chars2.length);
      emTextNode.textContent = chars2.slice(0, idx).join('');
      if (idx >= chars2.length) {
        setTimeout(function () {
          cursor.classList.add('type-cursor-done');
        }, 2000);
        return;
      }
    }
    requestAnimationFrame(tick);
  }

  setTimeout(function () {
    requestAnimationFrame(tick);
  }, 1200);
}

// ── FLOATING SPARKLE PARTICLES IN HERO ──
function initSparkles() {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var container = document.createElement('div');
  container.className = 'sparkle-container';
  container.setAttribute('aria-hidden', 'true');
  hero.appendChild(container);

  var positions = [
    { x: 12, y: 18 }, { x: 72, y: 12 }, { x: 48, y: 55 },
    { x: 88, y: 40 }, { x: 22, y: 78 }, { x: 62, y: 82 },
    { x: 92, y: 70 }, { x: 6,  y: 52 }
  ];

  positions.forEach(function (pos, i) {
    var s = document.createElement('div');
    s.className = 'sparkle';
    s.style.cssText =
      'left:' + pos.x + '%;' +
      'top:' + pos.y + '%;' +
      'animation-delay:' + (i * 0.65).toFixed(2) + 's;' +
      'animation-duration:' + (3.2 + i * 0.35).toFixed(2) + 's;';
    container.appendChild(s);
  });
}

// ── TAG GLOW WHEN ENTERING VIEWPORT ──
function initTagGlow() {
  var tagObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('tag-glow');
        tagObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.tag').forEach(function (tag) {
    tagObs.observe(tag);
  });
}

// ── SCROLL REVEAL ANIMATIONS ──
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.fade-up, .reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-zoom, .zoom-in').forEach(function (el) {
    observer.observe(el);
  });
})();

// ── TOPBAR SCROLL EFFECT ──
var _tb = document.querySelector('.topbar');
var _scrollTicking = false;

window.addEventListener('scroll', function () {
  if (!_scrollTicking) {
    window.requestAnimationFrame(function () {
      if (_tb) {
        if (window.scrollY > 40) {
          _tb.style.background = 'rgba(14, 39, 20, 0.98)';
          _tb.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
        } else {
          _tb.style.background = 'rgba(14, 39, 20, 0.95)';
          _tb.style.boxShadow = 'none';
        }
      }
      _scrollTicking = false;
    });
    _scrollTicking = true;
  }
}, { passive: true });