/* ===== NAVBAR: scroll effect ===== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ===== THEME TOGGLE (dark / light) ===== */
const themeToggle  = document.getElementById('themeToggle');
const iconMoon     = themeToggle.querySelector('.icon-moon');
const iconSun      = themeToggle.querySelector('.icon-sun');
const htmlEl       = document.documentElement;

// Siempre arranca en dark (ignoramos preferencia del sistema)
htmlEl.setAttribute('data-theme', 'dark');

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  if (theme === 'light') {
    iconMoon.style.display = 'none';
    iconSun.style.display  = 'block';
    themeToggle.setAttribute('title', 'Cambiar a modo oscuro');
  } else {
    iconMoon.style.display = 'block';
    iconSun.style.display  = 'none';
    themeToggle.setAttribute('title', 'Cambiar a modo claro');
  }
  localStorage.setItem('impruvia-theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// Restaurar si el usuario ya eligió antes
const saved = localStorage.getItem('impruvia-theme');
if (saved) applyTheme(saved);


/* ===== MOBILE NAV TOGGLE ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Cerrar menú al hacer click en un link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ===== MODAL CONTACTO ===== */
const contactModal = document.getElementById('contactModal');
const openModalBtns = document.querySelectorAll('.open-modal-btn');
const closeModalBtn = document.getElementById('closeModal');
const modalBackdrop = contactModal.querySelector('.modal-backdrop');

function openModal() {
  contactModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Disparar reveal dentro del modal
  contactModal.querySelector('.modal-content').classList.add('visible');
}

function closeModal() {
  contactModal.classList.remove('open');
  document.body.style.overflow = '';
}

openModalBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Cerrar con escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('open')) {
    closeModal();
  }
});


/* ===== REVEAL ON SCROLL (Intersection Observer) ===== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


/* ===== NAVBAR: smooth active link highlight ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
      });
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--text)';
      }
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));


/* ===== COUNTER ANIMATION for hero stats ===== */
function animateCounter(el, target, suffix = '', prefix = '') {
  const isDecimal = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Observe hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Already rendered as text, just add a subtle pulse
      document.querySelectorAll('.stat-num').forEach(el => {
        el.style.transition = 'color 0.3s';
        el.style.color = 'var(--accent-light)';
      });
      statsObserver.unobserve(heroStats);
    }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}


/* ===== BAR ANIMATION in visual card ===== */
const vcBars = document.querySelectorAll('.vc-bar');
const vcCard = document.querySelector('.visual-card');

if (vcCard) {
  const barObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      vcBars.forEach((bar, i) => {
        bar.style.animationDelay = `${i * 180}ms`;
        bar.style.animationPlayState = 'running';
      });
      barObserver.unobserve(vcCard);
    }
  }, { threshold: 0.3 });

  // Pause animations until in view
  vcBars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
  });

  barObserver.observe(vcCard);
}


/* ===== FORM HANDLING — EmailJS ===== */
// ⚠️ CONFIGURACIÓN: reemplazá estos 3 valores con los de tu cuenta emailjs.com
const EMAILJS_PUBLIC_KEY = 'fFqTAbPCyXzcjPrBY';    // Account → API Keys
const EMAILJS_SERVICE_ID = 'service_8ww36ci';    // Email Services
const EMAILJS_TEMPLATE_ID = 'template_c026wkj';  // Email Templates

if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submit-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email) {
      showFormMessage('Por favor completá tu nombre y email.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showFormMessage('Ingresá un email válido.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: nombre,
        from_email: email,
        message: mensaje || '(Sin mensaje adicional)',
        to_email: 'alajnis@gmail.com'
      });

      submitBtn.textContent = '✓ Mensaje enviado — te contactamos pronto';
      submitBtn.style.background = 'var(--green)';
      submitBtn.style.color = '#0b0f14';
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Quiero mi diagnóstico gratuito →';
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 4000);

    } catch (err) {
      console.error('EmailJS error:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Quiero mi diagnóstico gratuito →';
      showFormMessage('Hubo un error al enviar. Intentá de nuevo o escribinos directo a alajnis@gmail.com', 'error');
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(text, type) {
  let msg = document.querySelector('.form-error-msg');
  if (!msg) {
    msg = document.createElement('p');
    msg.className = 'form-error-msg';
    msg.style.cssText = `
      text-align: center;
      font-size: 0.85rem;
      margin-top: -12px;
      margin-bottom: 16px;
      font-weight: 500;
    `;
    submitBtn.parentNode.insertBefore(msg, submitBtn);
  }
  msg.textContent = text;
  msg.style.color = type === 'error' ? '#f87171' : 'var(--green)';
}


/* ===== SMOOTH SCROLL for same-page links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ===== PARALLAX subtle effect on hero glow ===== */
const heroGlow = document.querySelector('.hero-glow');

if (heroGlow) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroGlow.style.transform = `translateY(${scrolled * 0.12}px)`;
  }, { passive: true });
}


/* ===== CURSOR GLOW (desktop only) ===== */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(cursor);

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animateCursor() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* ===== CONSTELLATION BACKGROUND (Particles) ===== */
(function () {
  const canvas = document.getElementById("impruvia-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const ACCENT       = [201, 168, 76];   // #c9a84c
  const ACCENT_LIGHT = [226, 196, 106];

  const rgba = ([r,g,b], a=1) => `rgba(${r},${g},${b},${a})`;

  let W = 0, H = 0;
  let particles = [];
  const DENSITY = 0.00009;
  const MAX_LINK = 140;
  const PUSH_DIST = 130;
  const LINK_ALPHA = 0.55;
  const LINE_WIDTH = 0.9;

  const mouse = { x: -9999, y: -9999, active: false };
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
  });
  window.addEventListener("mouseleave", () => { mouse.active = false; });

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(160, Math.max(60, Math.floor(W * H * DENSITY)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
    }));
  }
  window.addEventListener("resize", resize);
  resize();

  function frame () {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      if (mouse.active) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < PUSH_DIST * PUSH_DIST && d2 > 0.01) {
          const f = (1 - d2 / (PUSH_DIST * PUSH_DIST)) * 0.6;
          const inv = 1 / Math.sqrt(d2);
          p.vx += dx * inv * f * 0.4;
          p.vy += dy * inv * f * 0.4;
        }
      }
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x += W; else if (p.x > W) p.x -= W;
      if (p.y < 0) p.y += H; else if (p.y > H) p.y -= H;
    }

    ctx.lineWidth = LINE_WIDTH;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_LINK * MAX_LINK) {
          const alpha = (1 - Math.sqrt(d2) / MAX_LINK) * LINK_ALPHA;
          ctx.strokeStyle = rgba(ACCENT, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (mouse.active) {
      ctx.lineWidth = 1.1;
      for (const p of particles) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 220 * 220) {
          const alpha = (1 - Math.sqrt(d2) / 220) * 0.8;
          ctx.strokeStyle = rgba(ACCENT_LIGHT, alpha);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.fillStyle = rgba(ACCENT_LIGHT, 0.95);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }
  frame();
})();
