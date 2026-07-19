/* =========================================
   AQAR LAB — Main JavaScript
   Liquid-glass interactions + dynamic effects
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initParticles();
    initScrollReveal();
    initCounters();
    initPublicationFilter();
    initContactForm();
    initBackToTop();
    initActiveNav();
    initBlobParallax();
    initTilt();
    document.getElementById('year').textContent = new Date().getFullYear();
});

/* ===== NAVBAR SCROLL ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ===== HAMBURGER MENU ===== */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow =
            navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ===== RISING AEROSOL PARTICLES (hero) ===== */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = [
        'rgba(26, 111, 196, 0.6)',
        'rgba(0, 180, 216, 0.5)',
        'rgba(72, 202, 228, 0.4)',
        'rgba(255, 255, 255, 0.2)'
    ];
    const sizes = [3, 4, 5, 6, 8, 10];

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('particle');

        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = 8 + Math.random() * 15;
        const delay = Math.random() * 8;
        const drift = (Math.random() - 0.5) * 200;

        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            bottom: -10px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --drift: ${drift}px;
        `;

        container.appendChild(p);
        setTimeout(() => p.remove(), (duration + delay) * 1000);
    }

    for (let i = 0; i < 28; i++) createParticle();

    setInterval(() => {
        if (document.querySelectorAll('.particle').length < 45) createParticle();
    }, 450);
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('revealed'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach((el, i) => {
        if (!el.dataset.delay) el.dataset.delay = (i % 4) * 100;
        observer.observe(el);
    });
}

/* ===== ANIMATED COUNTERS ===== */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

/* ===== PUBLICATION FILTER ===== */
function initPublicationFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubItems = document.querySelectorAll('.pub-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            pubItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = 'grid';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });
}

/* ===== CONTACT FORM + TOAST ===== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('.form-submit');
        const btnText = btn.querySelector('.btn-text');
        const btnIcon = btn.querySelector('i');

        // Loading state
        btn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fas fa-spinner fa-spin';

        // Simulate sending — replace with a real API call / form backend
        await new Promise(resolve => setTimeout(resolve, 1800));

        // Success state
        btnText.textContent = 'Message Sent!';
        btnIcon.className = 'fas fa-check';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        showNotification("Your message has been sent successfully! We'll get back to you soon.", 'success');

        setTimeout(() => {
            form.reset();
            btn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.className = 'fas fa-paper-plane';
            btn.style.background = '';
        }, 3000);
    });
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'notification-toast';

    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle' };
    const colors = {
        success: 'rgba(16, 185, 129, 0.18)',
        error: 'rgba(239, 68, 68, 0.18)',
        info: 'rgba(26, 111, 196, 0.18)'
    };
    const borderColors = {
        success: 'rgba(16, 185, 129, 0.45)',
        error: 'rgba(239, 68, 68, 0.45)',
        info: 'rgba(26, 111, 196, 0.45)'
    };
    const iconColors = { success: '#10b981', error: '#ef4444', info: '#4a9edd' };

    toast.style.cssText = `
        position: fixed;
        bottom: 100px; right: 30px;
        z-index: 9999;
        background: ${colors[type]};
        border: 1px solid ${borderColors[type]};
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        padding: 16px 24px;
        border-radius: 12px;
        display: flex; align-items: center; gap: 12px;
        color: #fff;
        font-size: 0.9rem;
        font-family: 'Inter', sans-serif;
        max-width: 360px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    toast.innerHTML = `
        <i class="fas fa-${icons[type]}" style="font-size: 1.2rem; color: ${iconColors[type]};"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });

    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== ACTIVE NAV LINK (scrollspy) ===== */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ===== LIQUID BLOBS FOLLOW CURSOR (parallax) ===== */
function initBlobParallax() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const blobs = document.querySelectorAll('.blob');
    const depths = [46, 34, 58, 26];
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const loop = () => {
        curX += (targetX - curX) * 0.045;
        curY += (targetY - curY) * 0.045;
        blobs.forEach((blob, i) => {
            const d = depths[i] || 40;
            blob.style.marginLeft = `${curX * d}px`;
            blob.style.marginTop = `${curY * d}px`;
        });
        requestAnimationFrame(loop);
    };
    loop();
}

/* ===== SMOOTH 3D TILT ON CARDS ===== */
function initTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.research-card, .member-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / (rect.height / 2) * -4;
            const rotateY = (x - rect.width / 2) / (rect.width / 2) * 4;
            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}
