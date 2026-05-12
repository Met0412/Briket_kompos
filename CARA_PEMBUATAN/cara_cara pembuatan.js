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

// ── LANGUAGE ──
function setLang(lang) {
  document.body.classList.toggle('en', lang === 'en');
  var btnId = document.getElementById('btn-id');
  var btnEn = document.getElementById('btn-en');
  if (btnId) btnId.classList.toggle('active', lang === 'id');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
}

// ── INIT ON DOM READY ──
document.addEventListener('DOMContentLoaded', function () {
  initCaraTyping();
  initStepStagger();
  initTagGlow();
});

// ── TYPING EFFECT ON SECTION HEADLINE ──
function initCaraTyping() {
  var h2 = document.querySelector('#cara-pembuatan .section-h.light');
  if (!h2) return;

  // Target ID span
  var idSpan = h2.querySelector('[data-lang="id"]');
  if (!idSpan) return;

  var fullText = idSpan.textContent.trim(); // "Cara Pembuatan Kompos & Briket"
  idSpan.textContent = '';

  var textNode = document.createTextNode('');
  var cursor   = document.createElement('span');
  cursor.className = 'cara-type-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  idSpan.appendChild(textNode);
  idSpan.appendChild(cursor);

  var chars     = fullText.split('');
  var charDelay = 55; // ms per char — fast enough to feel snappy
  var startTime = null;

  function tick(time) {
    if (startTime === null) startTime = time;
    var idx = Math.min(Math.floor((time - startTime) / charDelay), chars.length);
    textNode.textContent = chars.slice(0, idx).join('');
    if (idx >= chars.length) {
      setTimeout(function () { cursor.classList.add('cara-type-cursor-done'); }, 1500);
      return;
    }
    requestAnimationFrame(tick);
  }

  setTimeout(function () { requestAnimationFrame(tick); }, 300);
}

// ── STEP ITEM STAGGER ANIMATION ──
function initStepStagger() {
  // Add stagger class to each step-item for CSS targeting
  var stepItems = document.querySelectorAll('.step-item');
  stepItems.forEach(function (item, i) {
    item.classList.add('step-anim');
    item.style.transitionDelay = (0.08 * (i % 8)).toFixed(2) + 's';
  });

  // Observe each steps-wrapper and trigger children when visible
  var wrapperObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var items = entry.target.querySelectorAll('.step-item');
        items.forEach(function (item, i) {
          setTimeout(function () {
            item.classList.add('step-anim-visible');
          }, i * 90);
        });
        wrapperObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.steps-wrapper').forEach(function (w) {
    wrapperObs.observe(w);
  });

  // Also animate process-block titles
  var titleObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('steps-title-visible');
        titleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.steps-title').forEach(function (t) {
    titleObs.observe(t);
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

// ── REVEAL ON SCROLL (OPTIMIZED) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible', 'active');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .fade-up').forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight) {
    el.classList.add('visible', 'active');
  } else {
    revealObserver.observe(el);
  }
});

// ── TOPBAR SCROLL EFFECT ──
const _tb = document.querySelector('.topbar');
let _scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!_scrollTicking) {
    requestAnimationFrame(() => {
      if (_tb) {
        _tb.style.background = window.scrollY > 60
          ? 'rgba(14,39,20,0.97)'
          : 'rgba(14,39,20,0.85)';
      }
      _scrollTicking = false;
    });
    _scrollTicking = true;
  }
}, { passive: true });