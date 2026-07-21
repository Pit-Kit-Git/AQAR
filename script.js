/* =====================================================================
   AQAR Lab - interactions (data comes from config.js -> window.SITE_CONFIG)
   ===================================================================== */

/* minimal fallback so the site still works if config.js is missing */
const FALLBACK = {
  lab: { name: 'AQAR Lab', logo: 'images/logo.png' },
  pi: {
    name: 'Dr. Debananda Roy',
    title: 'Assistant Professor - Department of Earth Sciences, IISER Kolkata',
    topic: 'Airborne particulate matter, microplastics & black carbon, and bioaerosols; human health risk assessment in subway, indoor, and ambient environments.',
    photo: 'images/sir.png',
    email: 'debanandaroy@iiserkol.ac.in',
    linkedin: 'https://www.linkedin.com/in/debananda-roy-56582a26',
    scholar: 'https://scholar.google.com/citations?user=OiG1xgsAAAAJ&hl=en'
  },
  papers: [],
  gallery: []
};
const CFG = window.SITE_CONFIG ? Object.assign({}, FALLBACK, window.SITE_CONFIG) : FALLBACK;

/* escape text for safe innerHTML insertion */
const esc = (s) => String(s == null ? '' : s)
  .replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- apply config values to the page ---------- */
/* open a Gmail compose window addressed to the given email */
const gmailCompose = (email) => 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email);

function applyConfig() {
  const c = CFG;
  document.querySelectorAll('.js-logo').forEach((img) => { if (c.lab && c.lab.logo) img.setAttribute('src', c.lab.logo); });

  const el = (id) => document.getElementById(id);
  const setText = (id, v) => { const e = el(id); if (e && v != null) e.textContent = v; };
  const setHTML = (id, v) => { const e = el(id); if (e && v != null) e.innerHTML = v; };
  const setHref = (id, v) => { const e = el(id); if (e && v) e.setAttribute('href', v); };
  const setMail = (id, v) => { const e = el(id); if (e && v) { e.setAttribute('href', gmailCompose(v)); e.setAttribute('target','_blank'); e.setAttribute('rel','noopener'); e.textContent = v; } };

  if (c.pi) {
    setText('piName', c.pi.name);
    setHTML('piTitle', c.pi.title);
    setHTML('piTopic', '<i class="fas fa-flask"></i> ' + (c.pi.topic || ''));
    const ph = el('piPhoto'); if (ph && c.pi.photo) ph.setAttribute('src', c.pi.photo);
    setHref('piLinkedin', c.pi.linkedin);
    setHref('piScholar', c.pi.scholar);
    const pe = el('piEmail'); if (pe && c.pi.email) { pe.setAttribute('href', gmailCompose(c.pi.email)); pe.setAttribute('target','_blank'); pe.setAttribute('rel','noopener'); }
    setHref('contactLinkedin', c.pi.linkedin);
    setHref('contactScholar', c.pi.scholar);
    setMail('contactEmail', c.pi.email);
    setMail('careersEmail', c.pi.email);
    setHref('footerLinkedin', c.pi.linkedin);
    setHref('footerScholar', c.pi.scholar);
    setHref('allScholar', c.pi.scholar);
  }
  // member linkedin + email from config
  Object.entries(c.members || {}).forEach(([id, v]) => {
    const em = document.querySelector('[data-mid="' + id + '"][data-kind="email"]');
    if (em && v && v.email) { em.setAttribute('href', gmailCompose(v.email)); em.setAttribute('target','_blank'); em.setAttribute('rel','noopener'); }
    const li = document.querySelector('[data-mid="' + id + '"][data-kind="linkedin"]');
    if (li && v && v.linkedin) { li.setAttribute('href', v.linkedin); li.setAttribute('target','_blank'); li.setAttribute('rel','noopener'); }
  });
  const pc = el('pubCount'); if (pc) pc.textContent = (c.papers ? c.papers.length : 0);
}

/* ---------- publications list ---------- */
const badgeClass = (t) => (t === 'conference' ? 'tb-conf' : t === 'book' ? 'tb-book' : 'tb-journal');
const badgeLabel = (t) => (t === 'conference' ? 'Conference' : t === 'book' ? 'Book Chapter' : 'Journal');
function pubLinks(p) {
  let h = '';
  if (p.doi) h += '<a href="' + esc(p.doi) + '" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> DOI</a>';
  if (p.scholar) h += '<a href="' + esc(p.scholar) + '" target="_blank" rel="noopener"><i class="fas fa-graduation-cap"></i> Scholar</a>';
  return h || '<span class="pub-nolink">&mdash;</span>';
}
function buildPubList() {
  const list = document.getElementById('pubList'); if (!list) return;
  list.innerHTML = (CFG.papers || []).map((p) =>
    '<article class="pub-card" data-type="' + esc(p.type || 'journal') + '">' +
      '<span class="pub-year">' + esc(p.year) + '</span>' +
      '<div class="pub-info">' +
        '<h4>' + esc(p.title) + ' <span class="type-badge ' + badgeClass(p.type) + '">' + badgeLabel(p.type) + '</span></h4>' +
        '<p class="pub-authors">' + esc(p.authors) + '</p>' +
        '<p class="pub-journal">' + esc(p.venue) + '</p>' +
      '</div>' +
      '<div class="pub-links">' + pubLinks(p) + '</div>' +
    '</article>'
  ).join('') || '<p class="pub-empty">No publications listed yet - add them in config.js.</p>';
}
function buildModalPubs() {
  const list = document.getElementById('modalPubs'); if (!list) return;
  list.innerHTML = (CFG.papers || []).map((p) => {
    const link = p.scholar || p.doi || '#';
    return '<li><span class="mp-year">' + esc(p.year) + '</span>' +
      '<h4><a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(p.title) +
      ' <i class="fas fa-arrow-up-right-from-square" style="font-size:.7rem"></i></a></h4>' +
      '<p class="mp-venue">' + esc(p.venue) + ' &middot; ' + esc(p.authors) + '</p></li>';
  }).join('') || '<li>No publications listed yet.</li>';
}

/* ---------- gallery ---------- */
function buildGallery() {
  const grid = document.getElementById('galleryGrid'); if (!grid) return;
  const imgs = (CFG.gallery && CFG.gallery.length) ? CFG.gallery : [];
  if (imgs.length) {
    grid.innerHTML = imgs.map((src) =>
      '<div class="g-tile g-img"><img src="' + esc(src) + '" alt="Lab photo" loading="lazy" onerror="this.parentElement.classList.add(\'g-broken\')"></div>'
    ).join('');
  } else {
    grid.innerHTML = Array.from({ length: 8 })
      .map(() => '<div class="g-tile"><i class="fas fa-image"></i><span>Photo coming soon</span></div>')
      .join('');
  }
}

/* ---------- compact Highlights slider ---------- */
function buildHighlights() {
  const slider = document.getElementById('hlSlider');
  const dotsWrap = document.getElementById('hlDots');
  if (!slider) return;
  const items = (CFG.papers || []).slice(0, 6);
  if (!items.length) { slider.innerHTML = ''; if (dotsWrap) dotsWrap.innerHTML = ''; return; }

  slider.innerHTML = '<div class="hl-track">' + items.map((p) => {
    const link = p.scholar || p.doi || '#';
    const thumb = p.img
      ? '<img src="' + esc(p.img) + '" alt="" loading="lazy" onerror="this.remove()">'
      : '<i class="fas fa-flask"></i>';
    return '<div class="hl-slide">' +
        '<div class="hl-thumb">' + thumb + '</div>' +
        '<div class="hl-details">' +
          '<span class="hl-tag">' + esc(p.venue) + '</span>' +
          '<h4>' + esc(p.title) + '</h4>' +
          '<a class="hl-link" href="' + esc(link) + '" target="_blank" rel="noopener">View <i class="fas fa-arrow-up-right-from-square"></i></a>' +
        '</div>' +
      '</div>';
  }).join('') + '</div>';

  const track = slider.querySelector('.hl-track');
  const slides = [...track.children];
  if (dotsWrap) dotsWrap.innerHTML = items.map((_, i) => '<button class="hl-dot' + (i === 0 ? ' active' : '') + '" aria-label="Highlight ' + (i + 1) + '"></button>').join('');
  const dots = dotsWrap ? [...dotsWrap.children] : [];
  let idx = 0, timer = null;
  const show = (n) => { idx = (n + items.length) % items.length; track.style.transform = 'translateX(-' + (idx * 100) + '%)'; dots.forEach((d, i) => d.classList.toggle('active', i === idx)); };
  const start = () => { timer = setInterval(() => show(idx + 1), 4200); };
  const stop = () => { clearInterval(timer); timer = null; };
  const restart = () => { stop(); start(); };
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); restart(); }));
  const card = slider.closest('.hl-card');
  if (card) { card.addEventListener('mouseenter', stop); card.addEventListener('mouseleave', start); }
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  start();
}

/* ---------- modals (about / papers / careers) ---------- */
function openModal(id) { const m = document.getElementById(id); if (m) { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); } }
function closeModal(m) { if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); } }
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach((m) =>
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); }));
  document.querySelectorAll('[data-close]').forEach((b) =>
    b.addEventListener('click', () => closeModal(b.closest('.modal-overlay'))));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
  });
  const aboutBtn = document.getElementById('aboutMoreBtn');
  if (aboutBtn) aboutBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('aboutModal'); });
  const careersBtn = document.getElementById('careersBtn');
  if (careersBtn) careersBtn.addEventListener('click', () => openModal('careersModal'));
  document.querySelectorAll('.r-learn-more').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openModal('papersModal'); }));
}

/* ---------- flip cards: only one open at a time ---------- */
function initFlipCards() {
  const cards = document.querySelectorAll('.r-card');
  const flip = (card) => {
    const willOpen = !card.classList.contains('flipped');
    cards.forEach((c) => { c.classList.remove('flipped'); c.setAttribute('aria-pressed', 'false'); });
    if (willOpen) { card.classList.add('flipped'); card.setAttribute('aria-pressed', 'true'); }
  };
  cards.forEach((card) => {
    card.addEventListener('click', (e) => { if (e.target.closest('a')) return; flip(card); });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { if (e.target.closest('a')) return; e.preventDefault(); flip(card); }
    });
  });
}

/* ---------- mobile menu ---------- */
function initHamburger() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('navMenu');
  if (!h || !m) return;
  h.addEventListener('click', () => { h.classList.toggle('active'); m.classList.toggle('open'); });
  m.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { h.classList.remove('active'); m.classList.remove('open'); }));
}

/* ---------- scroll UI: navbar state + active tab + mini AQI + back-to-top ---------- */
function initScrollUI() {
  const navbar = document.getElementById('navbar');
  const navAqi = document.getElementById('navAqi');
  const backTop = document.getElementById('backTop');
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const hero = document.getElementById('home');
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (backTop) backTop.classList.toggle('visible', y > 500);
    if (navAqi && hero) navAqi.classList.toggle('show', y > hero.offsetHeight - 90);
    const offset = window.innerHeight * 0.35;
    let current = sections[0] || null;
    for (const s of sections) { if (s.offsetTop - 100 <= y + offset) current = s; }
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1] || current;
    links.forEach((l) => l.classList.toggle('active', current && l.getAttribute('href') === '#' + current.id));
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- publications filter ---------- */
function initPubFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const getItems = () => [...document.querySelectorAll('#pubList .pub-card')];
  pills.forEach((pill) => pill.addEventListener('click', () => {
    pills.forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    const f = pill.dataset.filter;
    getItems().forEach((item) => {
      const show = (f === 'all' || item.dataset.type === f);
      if (show) { item.style.display = 'grid'; requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'translateX(0)'; }); }
      else { item.style.opacity = '0'; item.style.transform = 'translateX(-14px)'; setTimeout(() => { item.style.display = 'none'; }, 280); }
    });
  }));
}

/* ---------- live AQI (Open-Meteo) -> dash + mini nav AQI ---------- */
const DEFAULT_LOCATION = { name: 'IISER Kolkata, Mohanpur', lat: 22.9722, lon: 88.4231 };
function aqiCategory(aqi) {
  if (aqi == null) return { cls: 'loading', label: 'No data' };
  if (aqi <= 50) return { cls: 'good', label: 'Good' };
  if (aqi <= 100) return { cls: 'moderate', label: 'Moderate' };
  if (aqi <= 150) return { cls: 'usg', label: 'Unhealthy (SG)' };
  if (aqi <= 200) return { cls: 'unhealthy', label: 'Unhealthy' };
  if (aqi <= 300) return { cls: 'very', label: 'Very Unhealthy' };
  return { cls: 'hazardous', label: 'Hazardous' };
}
function setBar(barId, valId, value, scaleMax, goodMax, modMax) {
  const bar = document.getElementById(barId); const valEl = document.getElementById(valId);
  if (value == null) { if (valEl) valEl.textContent = '--'; return; }
  const pct = Math.min(Math.max((value / scaleMax) * 100, 3), 100);
  const cls = value <= goodMax ? 'good' : value <= modMax ? 'moderate' : 'poor';
  if (bar) { bar.className = 'db-fill ' + cls; bar.style.width = pct + '%'; }
  if (valEl) valEl.textContent = Math.round(value);
}
function renderAQ(c) {
  const aqi = c.us_aqi;
  const cat = aqiCategory(aqi);
  const num = document.getElementById('aqiNum'); if (num) num.textContent = aqi == null ? '--' : Math.round(aqi);
  const chip = document.getElementById('statusChip'); if (chip) { chip.className = 'status-chip ' + cat.cls; chip.innerHTML = '<i class="fas fa-circle-check"></i> <span>' + cat.label + '</span>'; }
  setBar('barPM25', 'valPM25', c.pm2_5, 150, 35.4, 55.4);
  setBar('barPM10', 'valPM10', c.pm10, 250, 54, 154);
  setBar('barNO2', 'valNO2', c.nitrogen_dioxide, 200, 60, 110);
  setBar('barO3', 'valO3', c.ozone, 240, 100, 160);
  const t = c.time ? new Date(c.time) : new Date();
  const lu = document.getElementById('lastUpdate'); if (lu) lu.textContent = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const nv = document.getElementById('navAqiVal'); if (nv) nv.textContent = aqi == null ? '--' : Math.round(aqi);
  const nc = document.getElementById('navAqiCat'); if (nc) nc.textContent = (cat.label && cat.label !== 'No data') ? cat.label : '';
}
function getLocation() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(DEFAULT_LOCATION);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ name: null, lat: +pos.coords.latitude.toFixed(4), lon: +pos.coords.longitude.toFixed(4) }),
      () => resolve(DEFAULT_LOCATION),
      { timeout: 7000, maximumAge: 10 * 60 * 1000 });
  });
}
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=en');
    const d = await res.json();
    return d.city || d.locality || d.principalSubdivision || (Math.abs(lat).toFixed(2) + ', ' + Math.abs(lon).toFixed(2));
  } catch (e) { return DEFAULT_LOCATION.name; }
}
async function loadAirQuality(lat, lon) {
  try {
    const res = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + lon + '&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone');
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    renderAQ(data.current);
    const df = document.getElementById('dashFoot'); if (df) df.textContent = 'Live air-quality data via Open-Meteo';
  } catch (e) {
    const df = document.getElementById('dashFoot'); if (df) df.textContent = 'Live data unavailable - check connection';
  }
}
async function locateAndLoad() {
  const loc = await getLocation();
  const name = loc.name || (await reverseGeocode(loc.lat, loc.lon));
  const sn = document.getElementById('stationName'); if (sn) sn.textContent = name;
  await loadAirQuality(loc.lat, loc.lon);
}
function initLiveAir() {
  locateAndLoad();
  setInterval(locateAndLoad, 10 * 60 * 1000);
  const r = document.getElementById('aqiRefresh');
  if (r) r.addEventListener('click', async () => { r.classList.add('spin'); await locateAndLoad(); r.classList.remove('spin'); });
}

/* ---------- contact form (demo) ---------- */
function showToast(message) {
  const old = document.querySelector('.toast'); if (old) old.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<i class="fas fa-check-circle"></i><span>' + message + '</span>';
  toast.style.cssText = 'position:fixed;bottom:96px;right:28px;z-index:10001;display:flex;align-items:center;gap:11px;background:#10233f;color:#fff;font-family:Inter,sans-serif;font-weight:600;font-size:.88rem;border-radius:14px;padding:15px 22px;max-width:340px;box-shadow:0 16px 44px rgba(16,35,63,.4);transform:translateX(140%);transition:transform .45s cubic-bezier(.22,1,.36,1);';
  toast.querySelector('i').style.color = '#34d399';
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
  setTimeout(() => { toast.style.transform = 'translateX(140%)'; setTimeout(() => toast.remove(), 450); }, 4200);
}
function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#0ea5e9', '#14b8a6', '#f59e0b', '#f43f5e', '#8b5cf6', '#10b981'];
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:hidden;';
  document.body.appendChild(box);
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('span');
    const size = 5 + Math.random() * 6;
    const left = 55 + Math.random() * 40;
    const drift = (Math.random() - 0.5) * 320;
    const dur = 1400 + Math.random() * 1200;
    const delay = Math.random() * 250;
    p.style.cssText = 'position:absolute;top:58vh;left:' + left + 'vw;width:' + size + 'px;height:' + (size * 1.5) + 'px;background:' + colors[i % colors.length] + ';border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';opacity:.95;';
    box.appendChild(p);
    p.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + drift + 'px,' + (30 + Math.random() * 30) + 'vh) rotate(' + (420 + Math.random() * 360) + 'deg)', opacity: 0 }
    ], { duration: dur, delay: delay, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' }).onfinish = () => p.remove();
  }
  setTimeout(() => box.remove(), 3200);
}
function initContactForm() {
  const form = document.getElementById('contact-form'); if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = form.querySelector('.btn');
    const txt = btn.querySelector('.btn-text');
    const ico = btn.querySelector('.btn-ico');
    btn.disabled = true; txt.textContent = 'Sending...'; ico.className = 'fas fa-spinner fa-spin btn-ico';
    await new Promise((r) => setTimeout(r, 1500));
    txt.textContent = 'Message Sent'; ico.className = 'fas fa-check btn-ico';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    btn.style.boxShadow = '0 8px 22px rgba(16,185,129,.35)';
    launchConfetti();
    showToast("Your message has been sent - we'll get back to you soon.");
    setTimeout(() => {
      form.reset(); btn.disabled = false; txt.textContent = 'Send Message';
      ico.className = 'fas fa-paper-plane btn-ico'; btn.style.background = ''; btn.style.boxShadow = '';
    }, 3200);
  });
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initPubCount();
  buildPubList();
  buildModalPubs();
  buildHighlights();
  buildGallery();
  initModals();
  initFlipCards();
  initHamburger();
  initScrollUI();
  initLiveAir();
  initPubFilter();
  initContactForm();
  initLightbox();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});

/* ---------- live publication count (Semantic Scholar; Google Scholar blocks live reads) ---------- */
async function initPubCount() {
  const el = document.getElementById('pubCount'); if (!el) return;
  const c = CFG.pi || {};
  const forced = c.publicationCount;
  if (forced !== undefined && forced !== '' && forced !== null) { el.textContent = forced; return; }
  const id = c.scholarAuthorId; if (!id) return; // keep papers.length fallback
  try {
    const res = await fetch('https://api.semanticscholar.org/graph/v1/author/' + id + '?fields=paperCount');
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    if (d && typeof d.paperCount === 'number') el.textContent = d.paperCount;
  } catch (e) { /* keep fallback set by applyConfig */ }
}

/* ============================================================
   LIGHTBOX  -  click any gallery / instrument photo to view full size
   ============================================================ */
function initLightbox() {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close photo">&times;</button>' +
      '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>';
    document.body.appendChild(lb);
  }
  const imgEl = lb.querySelector('.lb-img');
  const capEl = lb.querySelector('.lb-cap');
  const close = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    imgEl.removeAttribute('src');
  };
  const open = (src, alt) => {
    imgEl.setAttribute('src', src);
    imgEl.setAttribute('alt', alt || '');
    capEl.textContent = alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lb-close')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
  document.querySelectorAll('.gb-card img, .f-media .f-img').forEach((im) => {
    im.classList.add('zoomable');
    im.addEventListener('click', () => {
      const src = im.getAttribute('src');
      if (!src || im.style.display === 'none') return;       // skip broken / hidden
      const med = im.closest('.f-media');
      if (med && med.style.display === 'none') return;        // facility image failed
      open(src, im.getAttribute('alt'));
    });
  });
}
