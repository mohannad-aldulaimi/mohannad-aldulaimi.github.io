
    document.addEventListener('DOMContentLoaded', function() {
        // Theme Persistence & Toggle
        const themeBtn = document.getElementById('themeToggle');
        const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

        function updateThemeIcon(theme) {
            if (!themeIcon) return;
            if (theme === 'light') {
                themeIcon.classList.replace('bi-moon', 'bi-sun');
                themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            } else {
                themeIcon.classList.replace('bi-sun', 'bi-moon');
                themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
            }
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-bs-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-bs-theme', newTheme);
                localStorage.setItem('portfolio-theme', newTheme);
                updateThemeIcon(newTheme);
            });
        }

        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);

        // Mouse Tracker
        document.addEventListener("mousemove", function(e) {
            document.documentElement.style.setProperty("--mouse-x", (e.clientX / window.innerWidth * 100) + "%");
            document.documentElement.style.setProperty("--mouse-y", (e.clientY / window.innerHeight * 100) + "%");
        });

        // RE9 Specific Cursor Tracker (Buttons and Nav Links)
        document.querySelectorAll(".btn, .nav-link").forEach(btn => {
            btn.addEventListener("mousemove", e => {
                const rect = btn.getBoundingClientRect();
                btn.style.setProperty("--x", (e.clientX - rect.left) + "px");
                btn.style.setProperty("--y", (e.clientY - rect.top) + "px");
            });
        });

        // Smart Button Interceptors (Downloads & Demos)
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if(!href) return;
                
                // 1. Child Window for Online Testing (WebAssembly apps)
                const text = this.textContent.toLowerCase();
                if(text.includes('test online') || text.includes('تجربة')) {
                    e.preventDefault();
                    window.open(href, 'WebAssemblyDemo', 'width=420,height=800,resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no');
                    return;
                }
                
                // 2. Loading Spinner Effect for APK Downloads
                if(href.endsWith('.apk')) {
                    if(this.classList.contains('is-downloading')) return; 
                    
                    const originalHTML = this.innerHTML;
                    this.classList.add('is-downloading');
                    
                    // Inject Bootstrap Spinner
                    this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style="vertical-align: text-bottom;"></span>' + originalHTML;
                    
                    // Reset to normal automatically after browser initiates download (3.5s delay)
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.classList.remove('is-downloading');
                    }, 3500);
                }
            });
        });




        // Tilt Effects
        document.querySelectorAll(".project-card, .service-card, .profile-image").forEach(el => {
            el.addEventListener("mousemove", e => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                // 5% Movement Intensity (Translation)
                const moveX = x * 20; // Improved movement
                const moveY = y * 20; 
                
                // Flipped signs to make the face follow the cursor (rising effect)
                el.style.transform = "perspective(1200px) rotateX(" + (y * 15) + "deg) rotateY(" + (x * -15) + "deg) translate3d(" + moveX + "px, " + moveY + "px, 25px) scale3d(1.04, 1.04, 1.04)";
            });
            el.addEventListener("mouseleave", () => {
                el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)";
            });
        });

        // Explicit Carousel Initialization
        setTimeout(() => {
            const carouselEl = document.getElementById('portfolioCarousel');
            if (carouselEl && typeof bootstrap !== 'undefined') {
                new bootstrap.Carousel(carouselEl, {
                    interval: 5000,
                    ride: 'carousel',
                    pause: 'hover'
                });
            }
        }, 500);

        // Scroll Reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    });
