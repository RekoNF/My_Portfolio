document.addEventListener('DOMContentLoaded', function() {
    initializeYear();
    setupNavigation();
    initializeTyped();

    // ===== FIXED: Toggle menu hamburger =====
    const navToggle = document.querySelector('.nav-toggle');
    const navbarContainer = document.querySelector('.navbar-container');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navbarContainer && navMenu) {
        // Toggle menu saat tombol hamburger diklik
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle class nav-open pada navbar-container
            const isOpen = navbarContainer.classList.toggle('nav-open');
            
            // Toggle class menu-open pada body
            document.body.classList.toggle('menu-open', isOpen);
            
            // Update aria-expanded untuk accessibility
            this.setAttribute('aria-expanded', String(isOpen));
            
            console.log('Menu toggled:', isOpen); // Debug log
        });

        // Tutup menu saat klik link navigasi (untuk mobile)
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navbarContainer.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Tutup menu saat klik di luar (jika ada overlay)
        document.addEventListener('click', function(event) {
            // Jika menu terbuka dan klik di luar navbar
            if (navbarContainer.classList.contains('nav-open') && 
                !navbarContainer.contains(event.target)) {
                navbarContainer.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Tutup menu dengan tombol ESC
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

            // Tutup mobile nav setelah klik
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