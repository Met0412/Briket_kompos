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
  initAboutHeaderTyping();
  initTagGlowAbout();
});

// ── TYPING EFFECT ON ABOUT HEADER H1 ──
function initAboutHeaderTyping() {
  var h1 = document.querySelector('.about-header h1');
  if (!h1) return;

  var originalText = h1.textContent.trim(); // "Tentang Kami"

  // Build structure: text node + cursor
  var textNode = document.createTextNode('');
  var cursor = document.createElement('span');
  cursor.className = 'about-type-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  h1.textContent = '';
  h1.appendChild(textNode);
  h1.appendChild(cursor);

  var chars = originalText.split('');
  var charDelay = 80; // ms per character
  var startTime = null;

  function tick(time) {
    if (startTime === null) startTime = time;
    var elapsed = time - startTime;
    var idx = Math.min(Math.floor(elapsed / charDelay), chars.length);
    textNode.textContent = chars.slice(0, idx).join('');

    if (idx >= chars.length) {
      // Done — trigger underline draw, then fade cursor
      h1.classList.add('underline-ready');
      setTimeout(function () {
        cursor.classList.add('about-type-cursor-done');
      }, 1800);
      return;
    }
    requestAnimationFrame(tick);
  }

  // Delay slightly so page load animation completes first
  setTimeout(function () {
    requestAnimationFrame(tick);
  }, 350);
}

// ── TAG GLOW ON VIEWPORT ENTER ──
function initTagGlowAbout() {
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

document.querySelectorAll('.reveal, .fade-up, .zoom-in, .reveal-left, .reveal-right').forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight) {
    el.classList.add('visible', 'active');
  } else {
    revealObserver.observe(el);
  }
});

// ── TOPBAR SCROLL EFFECT & SCROLLSPY ──
const _tb = document.querySelector('.topbar');
let _scrollTicking = false;

let aboutEl, purposeEl, contactEl, navAbout, navContact;
document.addEventListener('DOMContentLoaded', () => {
  aboutEl   = document.getElementById('about');
  purposeEl = document.getElementById('purpose');
  contactEl = document.getElementById('contact');
  navAbout   = document.querySelectorAll('[id^="nav-about"]');
  navContact = document.querySelectorAll('[id^="nav-contact"]');
});

function onScroll() {
  if (_tb) {
    _tb.style.background = window.scrollY > 60
      ? 'rgba(14, 39, 20, 0.97)'
      : 'rgba(14, 39, 20, 0.85)';
  }

  if (!aboutEl || !purposeEl || !contactEl) { _scrollTicking = false; return; }

  const currentPos = window.scrollY;
  const aboutPos   = aboutEl.offsetTop   - 100;
  const purposePos = purposeEl.offsetTop - 100;
  const contactPos = contactEl ? contactEl.offsetTop - 300 : Infinity;

  navAbout.forEach(el => el.classList.remove('active'));
  navContact.forEach(el => el.classList.remove('active'));

  if (currentPos >= contactPos) {
    navContact.forEach(el => el.classList.add('active'));
  } else if (currentPos >= aboutPos || currentPos >= purposePos) {
    navAbout.forEach(el => el.classList.add('active'));
  }
  _scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!_scrollTicking) {
    requestAnimationFrame(onScroll);
    _scrollTicking = true;
  }
}, { passive: true });

// ── SA-FADE SCROLL REVEAL (NEW SYSTEM) ──
(function () {
  var saObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sa-visible');
        saObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  // Immediately reveal elements already in viewport on load
  function initSa() {
    document.querySelectorAll('.sa-fade').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 50) {
        el.classList.add('sa-visible');
      } else {
        saObs.observe(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSa);
  } else {
    initSa();
  }
})();