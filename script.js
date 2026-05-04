// ===== BEAMS BACKGROUND =====
function initBeamsBackground() {
  const container = document.querySelector('.hero-beams');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'beams-canvas';
  container.appendChild(canvas);

  const overlay = document.createElement('div');
  overlay.className = 'beams-overlay';
  container.appendChild(overlay);

  const ctx = canvas.getContext('2d');
  const TOTAL_BEAMS = 30;
  let beams = [];
  let animId;

  function createBeam() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: Math.random() * w * 1.5 - w * 0.25,
      y: Math.random() * h * 1.5 - h * 0.25,
      width: 30 + Math.random() * 60,
      length: h * 2.5,
      angle: -35 + Math.random() * 10,
      speed: 0.6 + Math.random() * 1.2,
      opacity: 0.12 + Math.random() * 0.16,
      hue: 30 + Math.random() * 25,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  function resetBeam(beam, index) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const spacing = w / 3;
    const column = index % 3;
    beam.y = h + 100;
    beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
    beam.width = 100 + Math.random() * 100;
    beam.speed = 0.5 + Math.random() * 0.4;
    beam.hue = 30 + (index * 25) / TOTAL_BEAMS;
    beam.opacity = 0.2 + Math.random() * 0.1;
    beam.length = h * 2.5;
  }

  function updateCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    beams = Array.from({ length: TOTAL_BEAMS }, createBeam);
  }

  function drawBeam(beam) {
    ctx.save();
    ctx.translate(beam.x, beam.y);
    ctx.rotate((beam.angle * Math.PI) / 180);

    const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2);

    const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
    gradient.addColorStop(0,   `hsla(${beam.hue}, 85%, 65%, 0)`);
    gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
    gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
    gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
    gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
    gradient.addColorStop(1,   `hsla(${beam.hue}, 85%, 65%, 0)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.filter = 'blur(35px)';

    beams.forEach((beam, index) => {
      beam.y -= beam.speed;
      beam.pulse += beam.pulseSpeed;
      if (beam.y + beam.length < -100) resetBeam(beam, index);
      drawBeam(beam);
    });

    animId = requestAnimationFrame(animate);
  }

  updateCanvasSize();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    updateCanvasSize();
    animId = requestAnimationFrame(animate);
  }, { passive: true });

  animate();
}

initBeamsBackground();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  const idx = siblings.indexOf(el);
  el.dataset.delay = idx * 80;
  revealObserver.observe(el);
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-question').forEach(q => {
      q.setAttribute('aria-expanded', 'false');
      const ans = q.nextElementSibling;
      if (ans) ans.classList.remove('open');
    });
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      const answer = btn.nextElementSibling;
      if (answer) answer.classList.add('open');
    }
  });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  setTimeout(() => {
    btn.style.display = 'none';
    formSuccess.classList.add('show');
    form.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
  }, 1200);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links li a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--gold)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
