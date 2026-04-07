/* ══════════════════════════════════════════════════════
   IRONFORGE GYM — JavaScript
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Element References ───
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const pricingToggle = document.getElementById('pricingToggle');
    const contactForm = document.getElementById('contactForm');
    const heroParticles = document.getElementById('heroParticles');

    // ─── Mobile Navigation ───
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ─── Navbar Scroll Effect ───
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add/remove scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        lastScrollY = scrollY;
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── Active Nav Link on Scroll ───
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ─── Hero Particles ───
    function createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            heroParticles.appendChild(particle);
        }
    }
    createParticles();

    // ─── Counter Animation ───
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // ─── Scroll Animations (Intersection Observer) ───
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Trigger counter animation when hero stats are visible
                if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }

                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // Stagger animation for cards in a grid
    const staggerContainers = document.querySelectorAll('.services-grid, .pricing-grid');
    staggerContainers.forEach(container => {
        const cards = container.querySelectorAll('.animate-on-scroll');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // ─── Pricing Toggle ───
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');

    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;

        // Toggle labels
        monthlyLabel.classList.toggle('active', !isYearly);
        yearlyLabel.classList.toggle('active', isYearly);

        // Toggle prices
        document.querySelectorAll('.monthly-price').forEach(el => {
            el.style.display = isYearly ? 'none' : 'inline';
        });
        document.querySelectorAll('.yearly-price').forEach(el => {
            el.style.display = isYearly ? 'inline' : 'none';
        });

        // Toggle period text
        document.querySelectorAll('.period').forEach(el => {
            el.textContent = isYearly ? '/year' : '/month';
        });

        // Animate price change
        document.querySelectorAll('.amount').forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = 'priceChange 0.4s ease';
        });
    });

    // Add price change animation
    const priceStyle = document.createElement('style');
    priceStyle.textContent = `
        @keyframes priceChange {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(priceStyle);

    // ─── Contact Form Validation ───
    const formFields = {
        fullName: {
            element: document.getElementById('fullName'),
            error: document.getElementById('nameError'),
            validate: (value) => {
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Please enter a valid name';
                return '';
            }
        },
        email: {
            element: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: (value) => {
                if (!value.trim()) return 'Email address is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email';
                return '';
            }
        },
        phone: {
            element: document.getElementById('phone'),
            error: document.getElementById('phoneError'),
            validate: (value) => {
                if (value.trim() && !/^\d{10}$/.test(value.trim())) {
                    return 'Phone number must be exactly 10 digits';
                }
                return '';
            }
        },
        subject: {
            element: document.getElementById('subject'),
            error: document.getElementById('subjectError'),
            validate: (value) => {
                if (!value) return 'Please select a subject';
                return '';
            }
        },
        message: {
            element: document.getElementById('message'),
            error: document.getElementById('messageError'),
            validate: (value) => {
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Message must be at least 10 characters';
                return '';
            }
        }
    };

    // Real-time validation on blur
    Object.values(formFields).forEach(field => {
        field.element.addEventListener('blur', () => {
            const error = field.validate(field.element.value);
            field.error.textContent = error;
            field.element.closest('.input-wrapper').classList.toggle('error', !!error);
        });

        // Clear error on input
        field.element.addEventListener('input', () => {
            if (field.error.textContent) {
                const error = field.validate(field.element.value);
                field.error.textContent = error;
                field.element.closest('.input-wrapper').classList.toggle('error', !!error);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate all fields
        Object.values(formFields).forEach(field => {
            const error = field.validate(field.element.value);
            field.error.textContent = error;
            field.element.closest('.input-wrapper').classList.toggle('error', !!error);
            if (error) isValid = false;
        });

        if (!isValid) {
            // Shake the form on error
            contactForm.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                contactForm.style.animation = '';
            }, 500);
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('loading');

        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            document.getElementById('formSuccess').classList.add('show');
            contactForm.style.opacity = '0';
            contactForm.style.pointerEvents = 'none';

            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.opacity = '1';
                contactForm.style.pointerEvents = '';
                document.getElementById('formSuccess').classList.remove('show');
                Object.values(formFields).forEach(field => {
                    field.error.textContent = '';
                    field.element.closest('.input-wrapper').classList.remove('error');
                });
            }, 4000);
        }, 1500);
    });

    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ─── Newsletter Form ───
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value.trim()) {
                const btn = newsletterForm.querySelector('button');
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.background = '#27ae60';
                input.value = '';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
                    btn.style.background = '';
                }, 2000);
            }
        });
    }

    // ─── Smooth Reveal on Page Load ───
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

});
