/* =========================================
   AQAR LAB — Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initScrollReveal();
    initCounters();
    initLiveAir();
    initPublicationFilter();
    initContactForm();
    initBackToTop();
    initActiveNav();
    document.getElementById('year').textContent = new Date().getFullYear();
});

/* ===== NAVBAR SHADOW ON SCROLL ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ===== MOBILE MENU ===== */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        })
    );
}

/* ===== SCROLL REVEAL (staggered per row) ===== */
function initScrollReveal() {
    const els = document.querySelectorAll(
        '.section-head, .r-card, .m-card, .pi-card, .pub-card, .f-card, .n-card, .tile, .feature-list li, .contact-info, .contact-form-wrap, .about-visual, .about-text, .group-title, .pub-filter, .center-btn'
    );
    els.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.max(idx, 0) * 70}ms`;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
}

/* ===== COUNTERS ===== */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const start = performance.now();
            const duration = 1800;
            const tick = now => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.6 });
    counters.forEach(c => observer.observe(c));
}

/* ============================================================
   LIVE AIR QUALITY WIDGET
   Location via browser geolocation (fallback: default city),
   real-time data from the free Open-Meteo Air Quality API.
   ============================================================ */

// TODO: set your lab's city as the fallback for visitors who deny location access
const DEFAULT_LOCATION = { name: 'Kolkata', lat: 22.5726, lon: 88.3630 };

function initLiveAir() {
    locateAndLoad();
    setInterval(locateAndLoad, 10 * 60 * 1000); // refresh every 10 minutes
}

async function locateAndLoad() {
    const loc = await getLocation();
    const name = loc.named ? loc.name : await reverseGeocode(loc.lat, loc.lon);
    document.getElementById('stationName').textContent = name;
    await Promise.all([loadAirQuality(loc.lat, loc.lon), loadUV(loc.lat, loc.lon)]);
}

/* Browser geolocation with graceful fallback.
   Note: geolocation requires HTTPS (or localhost) — on plain http or
   file:// the fallback city is used automatically. */
function getLocation() {
    return new Promise(resolve => {
        if (!('geolocation' in navigator)) {
            return resolve({ ...DEFAULT_LOCATION, named: true });
        }
        navigator.geolocation.getCurrentPosition(
            pos => resolve({
                lat: +pos.coords.latitude.toFixed(4),
                lon: +pos.coords.longitude.toFixed(4),
                named: false
            }),
            () => resolve({ ...DEFAULT_LOCATION, named: true }),
            { timeout: 7000, maximumAge: 10 * 60 * 1000 }
        );
    });
}

/* Turn coordinates into a readable place name (free, no key) */
async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const d = await res.json();
        return d.city || d.locality || d.principalSubdivision || formatCoords(lat, lon);
    } catch {
        return formatCoords(lat, lon);
    }
}

const formatCoords = (lat, lon) =>
    `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;

/* Fetch real-time pollutants + US AQI */
async function loadAirQuality(lat, lon) {
    try {
        const url = 'https://air-quality-api.open-meteo.com/v1/air-quality' +
            `?latitude=${lat}&longitude=${lon}` +
            '&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone';
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        renderAQ(data.current);
        setFoot('Live data · Open-Meteo Air Quality API');
    } catch {
        setFoot('Live data unavailable — check your connection');
    }
}

/* Fetch real-time UV index for the floating chip */
async function loadUV(lat, lon) {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`
        );
        const data = await res.json();
        const uv = data.current?.uv_index;
        document.getElementById('chipUV').textContent =
            uv == null ? 'UV index · --' : `UV index · ${uv.toFixed(1)}`;
    } catch {
        /* keep placeholder text */
    }
}

function renderAQ(c) {
    // AQI number + category chip
    const aqi = c.us_aqi;
    document.getElementById('aqiNum').textContent = aqi == null ? '--' : Math.round(aqi);
    const cat = aqiCategory(aqi);
    const chip = document.getElementById('statusChip');
    chip.className = `status-chip ${cat.cls}`;
    chip.innerHTML = `<i class="fas fa-circle-check"></i> <span>${cat.label}</span>`;

    // Pollutant bars — [scale max, good-max, moderate-max]
    setBar('barPM25', 'valPM25', c.pm2_5, 150, 35.4, 55.4);
    setBar('barPM10', 'valPM10', c.pm10, 250, 54, 154);
    setBar('barNO2', 'valNO2', c.nitrogen_dioxide, 200, 60, 110);
    setBar('barO3', 'valO3', c.ozone, 240, 100, 160);

    // Floating PM2.5 chip
    document.getElementById('chipPM').textContent =
        c.pm2_5 == null ? 'PM2.5 · --' : `PM2.5 · ${Math.round(c.pm2_5)} µg/m³`;

    // Timestamp of the reading
    const t = c.time ? new Date(c.time) : new Date();
    document.getElementById('lastUpdate').textContent =
        t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* US AQI → category label + color class */
function aqiCategory(aqi) {
    if (aqi == null) return { cls: 'loading', label: 'No data' };
    if (aqi <= 50) return { cls: 'good', label: 'Good' };
    if (aqi <= 100) return { cls: 'moderate', label: 'Moderate' };
    if (aqi <= 150) return { cls: 'usg', label: 'Unhealthy (SG)' };
    if (aqi <= 200) return { cls: 'unhealthy', label: 'Unhealthy' };
    if (aqi <= 300) return { cls: 'very', label: 'Very Unhealthy' };
    return { cls: 'hazardous', label: 'Hazardous' };
}

/* Animate one pollutant bar + color it by severity */
function setBar(barId, valId, value, scaleMax, goodMax, modMax) {
    const bar = document.getElementById(barId);
    const valEl = document.getElementById(valId);
    if (value == null) { valEl.textContent = '--'; return; }
    const pct = Math.min(Math.max((value / scaleMax) * 100, 3), 100);
    const cls = value <= goodMax ? 'good' : value <= modMax ? 'moderate' : 'poor';
    bar.className = `db-fill ${cls}`;
    bar.style.width = pct + '%';
    valEl.textContent = Math.round(value);
}

function setFoot(text) {
    document.getElementById('dashFoot').textContent = text;
}

/* ===== PUBLICATION FILTER ===== */
function initPublicationFilter() {
    const pills = document.querySelectorAll('.filter-pill');
    const items = document.querySelectorAll('.pub-card');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filter = pill.dataset.filter;

            items.forEach(item => {
                const show = filter === 'all' || item.dataset.type === filter;
                if (show) {
                    item.style.display = 'grid';
                    requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'translateX(0)'; });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-14px)';
                    setTimeout(() => { item.style.display = 'none'; }, 280);
                }
            });
        });
    });
}

/* ===== CONTACT FORM + CONFETTI + TOAST ===== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.btn');
        const btnText = btn.querySelector('.btn-text');
        const btnIcon = btn.querySelector('.btn-ico');

        btn.disabled = true;
        btnText.textContent = 'Sending…';
        btnIcon.className = 'fas fa-spinner fa-spin btn-ico';

        // Simulated send — replace with your real backend / form service
        await new Promise(r => setTimeout(r, 1500));

        btnText.textContent = 'Message Sent';
        btnIcon.className = 'fas fa-check btn-ico';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.style.boxShadow = '0 8px 22px rgba(16, 185, 129, 0.35)';
        launchConfetti();
        showToast("Your message has been sent — we'll get back to you soon.");

        setTimeout(() => {
            form.reset();
            btn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.className = 'fas fa-paper-plane btn-ico';
            btn.style.background = '';
            btn.style.boxShadow = '';
        }, 3200);
    });
}

/* Soft confetti — a small celebratory touch */
function launchConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const colors = ['#0ea5e9', '#14b8a6', '#f59e0b', '#f43f5e', '#8b5cf6', '#10b981'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < 46; i++) {
        const piece = document.createElement('span');
        const size = 5 + Math.random() * 6;
        const left = 55 + Math.random() * 40;           // burst near the form (right side)
        const drift = (Math.random() - 0.5) * 320;
        const duration = 1400 + Math.random() * 1200;
        const delay = Math.random() * 250;

        piece.style.cssText = `
            position:absolute;
            top:58vh; left:${left}vw;
            width:${size}px; height:${size * 1.5}px;
            background:${colors[i % colors.length]};
            border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
            opacity:0.95;
        `;
        container.appendChild(piece);

        piece.animate(
            [
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${drift}px, ${30 + Math.random() * 30}vh) rotate(${420 + Math.random() * 360}deg)`, opacity: 0 }
            ],
            { duration, delay, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'both' }
        ).onfinish = () => piece.remove();
    }

    setTimeout(() => container.remove(), 3200);
}

function showToast(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    toast.style.cssText = `
        position: fixed; bottom: 96px; right: 28px; z-index: 10001;
        display: flex; align-items: center; gap: 11px;
        background: #10233f; color: #fff;
        font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.88rem;
        border-radius: 14px;
        padding: 15px 22px; max-width: 340px;
        box-shadow: 0 16px 44px rgba(16, 35, 63, 0.4);
        transform: translateX(140%);
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    `;
    toast.querySelector('i').style.color = '#34d399';
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    setTimeout(() => {
        toast.style.transform = 'translateX(140%)';
        setTimeout(() => toast.remove(), 450);
    }, 4200);
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 450);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== ACTIVE NAV (scrollspy) ===== */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(link =>
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
                );
            }
        });
    }, { threshold: 0.25, rootMargin: '-90px 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
}
