/* =========================================
   AAQR LAB - Main JavaScript
   ========================================= */

// ===== DOM READY =====
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
    initBarAnimations();
});

/* ===== NAVBAR SCROLL ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
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

/* ===== PARTICLES ===== */
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
        const delay = Math.random() * 10;
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

        setTimeout(() => {
            p.remove();
        }, (duration + delay) * 1000);
    }

    // Initial burst
    for (let i = 0; i < 30; i++) {
        createParticle();
    }

    // Continuous creation
    setInterval(() => {
        if (document.querySelectorAll('.particle').length < 50) {
            createParticle();
        }
    }, 400);
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealEls.forEach((el, i) => {
        if (!el.dataset.delay) {
            el.dataset.delay = (i % 4) * 100;
        }
        observer.observe(el);
    });
}

/* ===== COUNTERS ===== */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, duration / steps);
}

/* ===== PUBLICATION FILTER ===== */
function initPublicationFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubItems = document.querySelectorAll('.pub-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            pubItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = 'grid';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ===== CONTACT FORM ===== */
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

        // Simulate sending (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success state
        btnText.textContent = 'Message Sent!';
        btnIcon.className = 'fas fa-check';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        showNotification('Your message has been sent successfully! We\'ll get back to you soon.', 'success');

        // Reset after delay
        setTimeout(() => {
            form.reset();
            btn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.className = 'fas fa-paper-plane';
            btn.style.background = '';
        }, 3000);
    });
}

/* ===== NOTIFICATION TOAST ===== */
function showNotification(message, type = 'success') {
    // Remove existing
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'notification-toast';

    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle' };
    const colors = {
        success: 'rgba(16, 185, 129, 0.15)',
        error: 'rgba(239, 68, 68, 0.15)',
        info: 'rgba(26, 111, 196, 0.15)'
    };
    const borderColors = {
        success: 'rgba(16, 185, 129, 0.4)',
        error: 'rgba(239, 68, 68, 0.4)',
        info: 'rgba(26, 111, 196, 0.4)'
    };

    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        z-index: 9999;
        background: ${colors[type]};
        border: 1px solid ${borderColors[type]};
        backdrop-filter: blur(20px);
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #fff;
        font-size: 0.9rem;
        font-family: 'Inter', sans-serif;
        max-width: 360px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    toast.innerHTML = `
        <i class="fas fa-${icons[type]}" style="font-size: 1.2rem; color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4a9edd'};"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });

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
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== ACTIVE NAV LINK ===== */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

/* ===== BAR ANIMATIONS ===== */
function initBarAnimations() {
    const bars = document.querySelectorAll('.bar-fill');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.setProperty('--fill-width', width);
                entry.target.style.width = width;
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => barObserver.observe(bar));
}

/* ===== SMOOTH HOVER TILT ===== */
document.querySelectorAll('.research-card, .member-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ===== TYPING EFFECT (optional hero subtitle) ===== */
function typeEffect(el, texts, speed = 80) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            el.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? speed / 2 : speed;

        if (!isDeleting && charIndex === currentText.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    type();
}

// Initialize typing effect if element exists
const typingEl = document.getElementById('typing-text');
if (typingEl) {
    typeEffect(typingEl, [
        'Air Quality Research',
        'Aerosol Science',
        'Environmental Monitoring',
        'Clean Air Solutions'
    ]);
}

/* ===== PARALLAX HERO ===== */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        const circles = document.querySelectorAll('.hero-bg-circle');
        circles.forEach((circle, i) => {
            const speed = 0.3 + i * 0.1;
            circle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

/* ===== NEWSLETTER (if added) ===== */
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.reset();
    });
}