/* ═══════════════════════════════════════════════════════
   TRANSITIONS.JS — Global Interactions & Animations
   Briket Kompos · SMA Trinitas Bandung
   Safe to run on ALL pages. Does NOT conflict with
   existing per-page JS (about.js / Pengertian.js / etc.)
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────
     1. SCROLL PROGRESS BAR
  ─────────────────────────────────── */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.id = 'tx-scroll-progress';
    document.body.prepend(bar);

    function update() {
      var scrolled = window.scrollY;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─────────────────────────────────
     2. TOPBAR GLASS SHRINK ON SCROLL
     (works with existing .scrolled logic;
      adds our class .tx-scrolled instead)
  ─────────────────────────────────── */
  function initTopbarShrink() {
    var tb = document.querySelector('.topbar');
    if (!tb) return;

    function update() {
      tb.classList.toggle('tx-scrolled', window.scrollY > 55);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─────────────────────────────────
     3. CURSOR GLOW (desktop only)
  ─────────────────────────────────── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var glow = document.createElement('div');
    glow.id = 'tx-cursor-glow';
    document.body.appendChild(glow);

    var rx = 0, ry = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', function (e) {
      rx = e.clientX;
      ry = e.clientY;
    });

    // Smooth follow with lerp
    function lerp(a, b, t) { return a + (b - a) * t; }
    function tick() {
      cx = lerp(cx, rx, 0.1);
      cy = lerp(cy, ry, 0.1);
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────
     4. PAGE TRANSITIONS
     Intercepts local <a> clicks and
     plays overlay slide animation
  ─────────────────────────────────── */
  function initPageTransitions() {
    var overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    var bar = document.createElement('div');
    bar.id = 'page-transition-bar';
    overlay.appendChild(bar);
    document.body.prepend(overlay);

    // Slide out after page loads (reveal page)
    requestAnimationFrame(function () {
      overlay.classList.add('tx-slide-in');
      bar.style.width = '70%';
      setTimeout(function () {
        bar.style.width = '100%';
        setTimeout(function () {
          overlay.classList.add('tx-slide-out');
          setTimeout(function () {
            overlay.classList.remove('tx-slide-in', 'tx-slide-out');
            bar.style.width = '0%';
          }, 580);
        }, 100);
      }, 60);
    });

    // Intercept navigations
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;
      if (href.charAt(0) === '#') return;
      if (/^(https?:\/\/|mailto:|tel:)/.test(href)) return;
      if (link.getAttribute('target') === '_blank') return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      e.preventDefault();

      overlay.classList.remove('tx-slide-out');
      overlay.classList.add('tx-slide-in');
      bar.style.width = '0%';

      setTimeout(function () { bar.style.width = '75%'; }, 40);
      setTimeout(function () {
        bar.style.width = '100%';
        setTimeout(function () {
          window.location.href = href;
        }, 180);
      }, 320);
    });
  }

  /* ─────────────────────────────────
     5. SA-FADE SCROLL REVEAL
     Only for elements with .sa-fade
     (about.js handles it for about.js;
     we run a second observer here for
     Pengertian & Cara Pembuatan pages)
  ─────────────────────────────────── */
  function initSaFadeReveal() {
    var elements = document.querySelectorAll('.sa-fade');
    if (!elements.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseFloat(el.style.transitionDelay || '0') * 1000;
          setTimeout(function () {
            el.classList.add('sa-visible');
          }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40) {
        el.classList.add('sa-visible');
      } else {
        io.observe(el);
      }
    });
  }

  /* ─────────────────────────────────
     6. FLOATING PARTICLES CANVAS
  ─────────────────────────────────── */
  function initParticles() {
    var canvas = document.createElement('canvas');
    canvas.id = 'tx-particles';
    document.body.prepend(canvas);

    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x      = Math.random() * W;
      this.y      = Math.random() * H;
      this.size   = Math.random() * 1.6 + 0.5;
      this.vx     = (Math.random() - 0.5) * 0.28;
      this.vy     = -Math.random() * 0.38 - 0.08;
      this.alpha  = Math.random() * 0.55 + 0.1;
      this.life   = 0;
      this.maxLife= Math.random() * 280 + 180;
    };
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      var r = this.life / this.maxLife;
      this.currentAlpha = this.alpha * (1 - Math.pow(r - 0.5, 2) * 4);
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    };
    Particle.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.currentAlpha);
      ctx.fillStyle   = '#b5e853';
      ctx.shadowColor = '#b5e853';
      ctx.shadowBlur  = 5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < 50; i++) {
      var p = new Particle();
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < particles.length; j++) {
        particles[j].update();
        particles[j].draw();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ─────────────────────────────────
     7. STAT NUMBER POP (count-up feel)
  ─────────────────────────────────── */
  function initStatPop() {
    var nums = document.querySelectorAll('.ah-stat-num, .idoc-stat-num');
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('tx-count-pop');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ─────────────────────────────────
     8. SIDEBAR OPEN PATCH
     Adds .open class for CSS stagger
  ─────────────────────────────────── */
  function patchSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    var _open  = window.openSidebar;
    var _close = window.closeSidebar;

    if (typeof _open === 'function') {
      window.openSidebar = function () {
        _open.call(this);
        sidebar.classList.add('open');
      };
    }
    if (typeof _close === 'function') {
      window.closeSidebar = function () {
        sidebar.classList.remove('open');
        _close.call(this);
      };
    }
  }

  /* ─────────────────────────────────
     9. CARD 3D TILT (desktop)
  ─────────────────────────────────── */
  function initTiltCards() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var cards = document.querySelectorAll(
      '.opinion-card, .member-card, .info-card, .service-card, .quote-card'
    );

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var xRatio = (e.clientX - rect.left) / rect.width  - 0.5;
        var yRatio = (e.clientY - rect.top)  / rect.height - 0.5;
        var rotX   =  yRatio * -7;
        var rotY   =  xRatio *  7;
        card.style.transform =
          'translateY(-8px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.014)';
        card.style.transition = 'transform 0.08s ease';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform  = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      });
    });
  }

  /* ─────────────────────────────────
     10. RIPPLE on BUTTONS
  ─────────────────────────────────── */
  function initRipple() {
    var selectors = '.btn-lime, .btn-ghost, .idoc-btn, .wa-btn, .bc-detail-btn';
    document.querySelectorAll(selectors).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.style.cssText = [
          'position:absolute',
          'border-radius:50%',
          'background:rgba(255,255,255,0.25)',
          'pointer-events:none',
          'width:10px',
          'height:10px',
          'left:' + (e.clientX - rect.left - 5) + 'px',
          'top:'  + (e.clientY - rect.top  - 5) + 'px',
          'transform:scale(0)',
          'animation:txRippleAnim 0.55s ease-out forwards'
        ].join(';');
        btn.style.position = 'relative';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
      });
    });

    // Inject keyframe once
    if (!document.getElementById('tx-ripple-style')) {
      var style = document.createElement('style');
      style.id = 'tx-ripple-style';
      style.textContent = '@keyframes txRippleAnim{to{transform:scale(30);opacity:0}}';
      document.head.appendChild(style);
    }
  }

  /* ─────────────────────────────────
     INIT — wait for DOM
  ─────────────────────────────────── */
  function init() {
    initScrollProgress();
    initTopbarShrink();
    // initCursorGlow();
    initPageTransitions();
    initSaFadeReveal();
    initParticles();
    initStatPop();
    initTiltCards();
    initRipple();
    // Sidebar patch needs existing openSidebar to be defined first
    setTimeout(patchSidebar, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
