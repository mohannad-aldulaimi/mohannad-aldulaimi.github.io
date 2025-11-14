
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        const htmlElement = document.documentElement;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            htmlElement.setAttribute('data-bs-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }
        
        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
        
        // Update theme icon based on current theme
        function updateThemeIcon(theme) {
            if (theme === 'dark') {
                themeIcon.classList.remove('bi-moon');
                themeIcon.classList.add('bi-sun');
            } else {
                themeIcon.classList.remove('bi-sun');
                themeIcon.classList.add('bi-moon');
            }
        }
        
        // Initialize carousel
        const myCarousel = document.querySelector('#portfolioCarousel');
        const carousel = new bootstrap.Carousel(myCarousel);

        // Scroll reveal functionality
        const scrollRevealSections = document.querySelectorAll('.scroll-reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    // Optional: remove 'active' class when element scrolls out of view
                    // entry.target.classList.remove('active'); 
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        scrollRevealSections.forEach(section => {
            observer.observe(section);
        });
