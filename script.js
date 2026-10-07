/* =========================================================
   CONFIGURACIÓN — cambia aquí el nombre y los textos
   ========================================================= */
const NOMBRE = 'MI Isha';

const FOTOS = [
  { src: 'imagenes/WhatsApp Image 2026-10-07 at 1.11.10 PM.jpeg', caption: 'Mi lugar favorito 🖤' },
  { src: 'imagenes/WhatsApp Image 2026-10-07 at 1.11.10 PM (1).jpeg', caption: 'Tú y yo, siempre 💛' },
  { src: 'imagenes/WhatsApp Image 2026-10-07 at 1.11.10 PM (2).jpeg', caption: 'Esa sonrisa ✨' },
  { src: 'imagenes/WhatsApp Image 2026-10-07 at 1.11.11 PM.jpeg', caption: 'Mi abejita 🐝' },
  { src: 'imagenes/WhatsApp Image 2026-10-07 at 1.11.11 PM (1).jpeg', caption: 'Te amo con el alma 🖤' },
];

const RAZONES = [
  { emoji: '😊', text: 'Tu sonrisa es mi debilidad mi amor' },
  { emoji: '🫶', text: 'Me haces querer ser mejor persona cada día y esforzarme por mi niña' },
  { emoji: '🌙', text: 'Me haces sentir que todo está bien' },
  { emoji: '🖤', text: 'Porque eres mi persona favorita en el mundo' },
  { emoji: '✨', text: 'Tu forma de mirarme es todo lo que yo necesito' },
  { emoji: '🏡', text: 'Eres mi paz total mi vida linda' },
  { emoji: '🐝', text: 'Porque eres mi abejita, la más linda de todas' },
  { emoji: '💛', text: 'Porque endulzas mi vida más que la miel' },
];

const FRASES = [
  'Sé que me equivoqué y lo siento con todo mi corazón...',
  'No hay nada que quiera más que verte feliz nuevamente conmigo.',
  'Te amo con toda mi alma, mi abejita 🐝🖤',
];

/* ========================================================= */
const $ = (s) => document.querySelector(s);
const url = (p) => encodeURI(p);

document.body.classList.add('locked');
$('#intro-name').textContent = NOMBRE;
$('#hero-name').textContent = `mi ${NOMBRE}`;
$('#hero-img').src = url(FOTOS[0].src);

/* ---------- Canvas de corazones y estrellas ---------- */
const canvas = $('#bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const COLORS = ['#c4b5fd', '#a855f7', '#d946ef', '#e9d5ff', '#8b5cf6', '#facc15', '#fde047'];

function resize() {
  W = canvas.width = innerWidth * devicePixelRatio;
  H = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
}
addEventListener('resize', resize);
resize();

function makeParticle(initial = false) {
  const heart = Math.random() < 0.45;
  const bee = !heart && Math.random() < 0.12;
  return {
    bee,
    x: Math.random() * W,
    y: initial ? Math.random() * H : H + 30,
    size: (heart ? 6 + Math.random() * 10 : 1 + Math.random() * 2) * devicePixelRatio,
    speed: (0.2 + Math.random() * 0.8) * devicePixelRatio,
    drift: Math.random() * Math.PI * 2,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    alpha: 0.25 + Math.random() * 0.6,
    heart,
  };
}
for (let i = 0; i < 70; i++) particles.push(makeParticle(true));

function drawHeart(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s / 4);
  ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4);
  ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.75, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.75, x + s / 2, y + s / 2, x + s / 2, y + s / 4);
  ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4);
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.y -= p.speed;
    p.drift += 0.01;
    p.x += Math.sin(p.drift) * 0.5;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = p.color;
    if (p.bee) {
      ctx.shadowBlur = 0;
      ctx.font = `${16 * devicePixelRatio}px serif`;
      ctx.fillText('🐝', p.x, p.y);
    } else if (p.heart) drawHeart(p.x, p.y, p.size);
    else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    if (p.y < -40) particles[i] = makeParticle();
  });
  requestAnimationFrame(animate);
}
animate();

/* ---------- Brillo que sigue al cursor ---------- */
const glow = $('#cursor-glow');
/* ---------- Abejita que te sigue ---------- */
const beeEl = $('#bee');
if (beeEl) {
  const beePos = { x: innerWidth / 2, y: innerHeight / 2 };
  const beeTarget = { x: innerWidth / 2, y: innerHeight / 2 };
  let lastMove = 0;
  function flyBee(t) {
    if (Date.now() - lastMove > 2500) {
      beeTarget.x = innerWidth / 2 + Math.sin(t / 1800) * innerWidth * 0.38;
      beeTarget.y = innerHeight / 2 + Math.sin(t / 1100) * innerHeight * 0.3;
    }
    const dx = beeTarget.x - beePos.x;
    beePos.x += dx * 0.04;
    beePos.y += (beeTarget.y - beePos.y) * 0.04;
    const wobble = Math.sin(t / 120) * 4;
    beeEl.style.transform = `translate(${beePos.x}px, ${beePos.y + wobble}px) scaleX(${dx > 0 ? -1 : 1})`;
    requestAnimationFrame(flyBee);
  }
  requestAnimationFrame(flyBee);
}

addEventListener('pointermove', (e) => {
  lastMove = Date.now();
  beeTarget.x = e.clientX + 30;
  beeTarget.y = e.clientY - 30;
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

/* ---------- Corazones al hacer clic ---------- */
addEventListener('click', (e) => {
  if (e.target.closest('button, .polaroid, .card, .lightbox')) return;
  burst(e.clientX, e.clientY, 5);
});
function burst(x, y, n = 6) {
  const em = ['🖤', '💛', '🐝', '✨', '🖤', '💛'];
  for (let i = 0; i < n; i++) {
    const h = document.createElement('span');
    h.className = 'click-heart';
    h.textContent = em[(Math.random() * em.length) | 0];
    h.style.left = x - 10 + 'px';
    h.style.top = y - 10 + 'px';
    h.style.setProperty('--dx', (Math.random() - 0.5) * 140 + 'px');
    h.style.setProperty('--r', (Math.random() - 0.5) * 90 + 'deg');
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1300);
  }
}

/* ---------- Intro: abrir sobre ---------- */
let opened = false;
function openEnvelope() {
  if (opened) return;
  opened = true;
  const env = $('#envelope');
  env.classList.add('open');
  const r = env.getBoundingClientRect();
  setTimeout(() => burst(r.left + r.width / 2, r.top + r.height / 2, 18), 500);
  setTimeout(() => {
    $('#intro').classList.add('leave');
    setTimeout(() => {
      $('#intro').classList.add('hidden');
      $('#main').classList.remove('hidden');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
      startTypewriter();
      observeReveals();
    }, 800);
  }, 1900);
}
$('#envelope').addEventListener('click', openEnvelope);
$('#envelope').addEventListener('keydown', (e) => e.key === 'Enter' && openEnvelope());
$('#open-btn').addEventListener('click', openEnvelope);

/* ---------- Máquina de escribir ---------- */
function startTypewriter() {
  const el = $('#typewriter');
  let f = 0, c = 0, deleting = false;
  (function tick() {
    const phrase = FRASES[f];
    el.textContent = phrase.slice(0, c);
    if (!deleting && c < phrase.length) { c++; setTimeout(tick, 55); }
    else if (!deleting) {
      if (f === FRASES.length - 1) return; // la última frase se queda
      deleting = true; setTimeout(tick, 1800);
    } else if (c > 0) { c--; setTimeout(tick, 25); }
    else { deleting = false; f++; setTimeout(tick, 400); }
  })();
}

/* ---------- Galería ---------- */
const gallery = $('#gallery');
FOTOS.forEach((foto, i) => {
  const el = document.createElement('figure');
  el.className = 'polaroid';
  el.style.rotate = `${(i % 2 ? 1 : -1) * (2 + Math.random() * 4)}deg`;
  el.style.transitionDelay = `${i * 0.12}s`;
  el.innerHTML = `
    <div class="tape"></div>
    <div class="pic"><img src="${url(foto.src)}" alt="${foto.caption}" loading="lazy" /></div>
    <p>${foto.caption}</p>`;
  // Inclinación 3D
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) scale(1.06)`;
  });
  el.addEventListener('pointerleave', () => (el.style.transform = ''));
  el.addEventListener('click', () => openLightbox(i));
  gallery.appendChild(el);
});

/* ---------- Lightbox ---------- */
let lbIndex = 0;
function openLightbox(i) {
  lbIndex = (i + FOTOS.length) % FOTOS.length;
  $('#lb-img').src = url(FOTOS[lbIndex].src);
  $('#lb-caption').textContent = FOTOS[lbIndex].caption;
  $('#lightbox').classList.add('show');
}
const closeLb = () => $('#lightbox').classList.remove('show');
$('#lb-close').addEventListener('click', closeLb);
$('#lb-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
$('#lb-next').addEventListener('click', () => openLightbox(lbIndex + 1));
$('#lightbox').addEventListener('click', (e) => e.target.id === 'lightbox' && closeLb());
addEventListener('keydown', (e) => {
  if (!$('#lightbox').classList.contains('show')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
  if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
});

/* ---------- Tarjetas de razones ---------- */
const cards = $('#cards');
RAZONES.forEach((r, i) => {
  const c = document.createElement('div');
  c.className = 'card reveal';
  c.style.transitionDelay = `${i * 0.08}s`;
  c.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front"><span class="emoji">${r.emoji}</span><span class="num">RAZÓN #${i + 1}</span></div>
      <div class="card-face card-back">${r.text}</div>
    </div>`;
  c.addEventListener('click', (e) => {
    c.classList.toggle('flipped');
    burst(e.clientX, e.clientY, 4);
  });
  cards.appendChild(c);
});

/* ---------- Medidor de amor ---------- */
let meterDone = false;
function runMeter() {
  if (meterDone) return;
  meterDone = true;
  const fill = $('#meter-fill'), num = $('#meter-num'), note = $('#meter-note');
  let v = 0;
  const t = setInterval(() => {
    v += v < 100 ? 1 : 7;
    const shown = Math.min(v, 100);
    fill.style.width = shown + '%';
    num.textContent = v;
    if (v >= 100 && v < 110) note.textContent = 'Espera... la barra no alcanza 😳';
    if (v >= 999) {
      clearInterval(t);
      num.textContent = '∞';
      note.textContent = 'Infinito. Te amo con toda mi alma 🖤🐝💛';
    }
  }, 22);
}

/* ---------- Animaciones al hacer scroll ---------- */
function observeReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visible');
      if (en.target.classList.contains('meter')) runMeter();
      io.unobserve(en.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal, .polaroid').forEach((el) => io.observe(el));
}

/* ---------- ¿Me perdonas? ---------- */
const noBtn = $('#no-btn');
const noTexts = ['No', '¿Segura?', 'Piénsalo 🥺', 'Porfa abejita 🐝', '¡No me atrapas!', 'Dale al otro 👉'];
let noCount = 0;
function runAway() {
  noBtn.classList.add('runaway');
  const pad = 20;
  const x = pad + Math.random() * (innerWidth - noBtn.offsetWidth - pad * 2);
  const y = pad + Math.random() * (innerHeight - noBtn.offsetHeight - pad * 2);
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';
  noBtn.textContent = noTexts[++noCount % noTexts.length];
  const yes = $('#yes-btn');
  yes.style.transform = `scale(${Math.min(1 + noCount * 0.08, 1.6)})`;
}
noBtn.addEventListener('pointerenter', runAway);
noBtn.addEventListener('click', (e) => { e.preventDefault(); runAway(); });

$('#yes-btn').addEventListener('click', () => {
  noBtn.style.display = 'none';
  celebrate();
  setTimeout(() => $('#final-modal').classList.add('show'), 600);
});
$('#close-modal').addEventListener('click', () => {
  $('#final-modal').classList.remove('show');
  celebrate();
});

function celebrate() {
  // Lluvia de corazones en el canvas
  for (let i = 0; i < 120; i++) {
    const p = makeParticle();
    p.heart = true;
    p.size = (8 + Math.random() * 16) * devicePixelRatio;
    p.speed = (2 + Math.random() * 4) * devicePixelRatio;
    p.alpha = 0.9;
    p.y = H + Math.random() * H * 0.5;
    particles.push(p);
  }
  setTimeout(() => (particles = particles.slice(-70)), 6000);
  for (let i = 0; i < 6; i++) {
    setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.8, 10), i * 200);
  }
}
