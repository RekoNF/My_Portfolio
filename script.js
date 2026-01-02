document.addEventListener('DOMContentLoaded', function() {
    initializeYear();
    setupNavigation();
    initializeTyped();
    initScrollAnimations(); // Tambahkan ini

    // ===== Toggle menu hamburger =====
    const navToggle = document.querySelector('.nav-toggle');
    const navbarContainer = document.querySelector('.navbar-container');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navbarContainer && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = navbarContainer.classList.toggle('nav-open');
            document.body.classList.toggle('menu-open', isOpen);
            this.setAttribute('aria-expanded', String(isOpen));
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navbarContainer.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function(event) {
            if (navbarContainer.classList.contains('nav-open') && 
                !navbarContainer.contains(event.target)) {
                navbarContainer.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navbarContainer.classList.contains('nav-open')) {
                navbarContainer.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

/* =====2. NAVIGATION FUNCTIONS===== */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.classList.contains('dropdown-toggle')) {
            return;
        }

        link.addEventListener('click', function(e) {
            e.preventDefault();

            const href = this.getAttribute('href') || '';
            const targetId = href.startsWith('#') ? href.substring(1) : null;

            if (targetId) {
                scrollToSection(targetId);
            }

            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            closeNav();
        });
    });
}

function closeNav() {
    const navbarContainer = document.querySelector('.navbar-container');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navbarContainer && navbarContainer.classList.contains('nav-open')) {
        navbarContainer.classList.remove('nav-open');
        document.body.classList.remove('menu-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* =====3. UTILITY FUNCTIONS===== */
function initializeYear() {
    const year = new Date().getFullYear();
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = year;
    }
}

function initializeTyped() {
    const typedEls = document.querySelectorAll('.typed');
    if (!typedEls || typedEls.length === 0) return;

    typedEls.forEach(el => {
        const itemsAttr = el.getAttribute('data-typed-items');
        if (!itemsAttr) return;
        const items = itemsAttr.split(',').map(s => s.trim()).filter(Boolean);
        if (items.length === 0) return;

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeSpeed = 80;
        const deleteSpeed = 40;
        const holdDelay = 1000;

        function tick() {
            const current = items[wordIndex % items.length];
            if (!isDeleting) {
                el.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(tick, holdDelay);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                el.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex++;
                    setTimeout(tick, 300);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }

        tick();
    });
}

/* =====4. BIDIRECTIONAL FADE ANIMATION===== */
function initScrollAnimations() {
    // Konfigurasi observer dengan threshold yang lebih baik
    const observerOptions = {
        root: null, // viewport
        rootMargin: '-100px 0px -100px 0px', // Top & bottom margin
        threshold: [0, 0.1, 0.5, 0.9, 1] // Multiple thresholds untuk deteksi lebih akurat
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const section = entry.target;
            const sectionId = section.id || section.className;

            if (entry.isIntersecting) {
                // Section masuk viewport - FADE IN
                setTimeout(() => {
                    section.classList.add('visible');
                    section.classList.remove('hidden');
                    console.log('✅ Fade IN:', sectionId, '| Ratio:', entry.intersectionRatio.toFixed(2));
                }, 50);
            } else {
                // Section keluar viewport - FADE OUT
                section.classList.remove('visible');
                section.classList.add('hidden');
                console.log('❌ Fade OUT:', sectionId);
            }
        });
    }, observerOptions);

    // Pilih section yang akan dianimasi
    const animatedSections = document.querySelectorAll('section[id]');
    
    animatedSections.forEach((section) => {
        // Set initial state
        section.classList.remove('visible');
        observer.observe(section);
    });

    console.log(`🎬 Observing ${animatedSections.length} sections with bidirectional fade`);
}

/* =====5. ALTERNATIVE: SCROLL EVENT (Fallback)=====*/
function initScrollAnimationsFallback() {
    let ticking = false;
    
    function checkSections() {
        const sections = document.querySelectorAll('section[id]');
        const triggerBottom = window.innerHeight * 0.85; // 85% dari viewport

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('visible');
            }
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkSections();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Check on load
    checkSections();
}

/* =====6. CHOOSE ANIMATION METHOD===== */
// Uncomment salah satu method di bawah ini di DOMContentLoaded:
// - initScrollAnimations() untuk Intersection Observer (recommended)
// - initScrollAnimationsFallback() untuk scroll event (fallback)