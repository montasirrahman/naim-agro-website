/* =============================================
   NAIM AGRO EXPORT LTD — JAVASCRIPT
   Particles, 3D Tilt, Scroll Animations, Nav
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL ──────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    const sections = ['home', 'about', 'products', 'why-us', 'contact'];
    let current = 'home';
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) current = id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── MOBILE NAV TOGGLE ─────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    const isOpen = navLinksEl.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── HERO PARTICLE CANVAS ──────────────────────
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  const EMOJIS = ['🌿', '🍃', '🥔', '🌱', '🥦', '🍋', '🌾', '✨'];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 30;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.6 + 0.2);
      this.opacity = 0;
      this.targetOpacity = Math.random() * 0.35 + 0.08;
      this.size = Math.random() * 18 + 12;
      this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.life++;
      if (this.life < 60) {
        this.opacity = Math.min(this.opacity + 0.005, this.targetOpacity);
      } else if (this.life > this.maxLife - 60) {
        this.opacity = Math.max(0, this.opacity - 0.005);
      }
      if (this.life >= this.maxLife || this.y < -30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  // Create initial particles
  for (let i = 0; i < 28; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Pause particles when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      animateParticles();
    }
  });

  // ── 3D TILT ON ABOUT CARD ─────────────────────
  const aboutCard = document.getElementById('aboutCard');
  if (aboutCard) {
    const parent = aboutCard.closest('.about-visual');
    parent.addEventListener('mousemove', (e) => {
      const rect = aboutCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      aboutCard.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 10}deg)`;
    });
    parent.addEventListener('mouseleave', () => {
      aboutCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // ── PRODUCT CARD TILT ─────────────────────────
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── REVEAL ON SCROLL ──────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // Also reveal why-cards with stagger
  const whyCards = document.querySelectorAll('.why-card');
  const whyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = document.querySelectorAll('.why-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('revealed');
          }, i * 100);
        });
        whyObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  if (whyCards.length > 0) whyObserver.observe(whyCards[0]);

  // ── PROCESS STEP ANIMATION ────────────────────
  const processSteps = document.querySelectorAll('.process-step');
  const processObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      processSteps.forEach((step, i) => {
        setTimeout(() => {
          step.style.opacity = '1';
          step.style.transform = 'translateY(0)';
        }, i * 150);
      });
      processObserver.disconnect();
    }
  }, { threshold: 0.15 });

  processSteps.forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(24px)';
    step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  if (processSteps.length > 0) processObserver.observe(processSteps[0]);

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── INQUIRY FORM → MAILTO ─────────────────────
  window.sendInquiry = function () {
    const name    = document.getElementById('inq-name').value.trim();
    const company = document.getElementById('inq-company').value.trim();
    const product = document.getElementById('inq-product').value;
    const message = document.getElementById('inq-message').value.trim();

    if (!name || !message) {
      alert('Please fill in your name and message before sending.');
      return;
    }

    const subject = encodeURIComponent(
      `Trade Inquiry: ${product || 'Agro Products'} — ${company || name}`
    );
    const body = encodeURIComponent(
      `Hello Naim Agro Export Ltd,\n\n` +
      `Name: ${name}\n` +
      `Company / Country: ${company || 'Not specified'}\n` +
      `Product of Interest: ${product || 'Not specified'}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent via naim.com.bd inquiry form`
    );

    window.location.href = `mailto:contact@naim.com.bd?subject=${subject}&body=${body}`;
  };

  // Allow Enter key in fields to submit
  ['inq-name','inq-company','inq-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && id !== 'inq-message') sendInquiry();
      });
    }
  });

  // ── COUNTER ANIMATION FOR STATS ───────────────
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const text = el.textContent;
        if (text.includes('15+')) animateCounter(el, 15, '+');
        else if (text.includes('500MT')) { el.textContent = '0MT'; animateCounter(el, 500, 'MT'); }
        else if (text.includes('100%')) animateCounter(el, 100, '%');
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

});
