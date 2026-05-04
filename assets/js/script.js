document.addEventListener("DOMContentLoaded", () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            mobileMenu.classList.add('translate-x-full');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // --- Header Scroll Effect ---
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-2');
            header.classList.remove('py-4');
        } else {
            header.classList.add('py-4');
            header.classList.remove('py-2');
        }
    });

    // --- Swiper Initialization ---
    const portfolioSwiper = new Swiper('.portfolio-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-btn-next',
            prevEl: '.swiper-btn-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        }
    });

    // --- GSAP Animations ---
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Initial Load Animation
    const heroTl = gsap.timeline();
    
    heroTl.fromTo(".fade-up-element", 
        { y: 50, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );

    // Scroll Reveal Animations for sections
    
    // Reveal Up
    gsap.utils.toArray('.gs-reveal-up').forEach(function(elem) {
        ScrollTrigger.create({
            trigger: elem,
            start: "top 85%",
            animation: gsap.fromTo(elem, 
                { y: 50, autoAlpha: 0 }, 
                { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
            ),
            toggleActions: "play none none reverse"
        });
    });

    // Reveal Left
    gsap.utils.toArray('.gs-reveal-left').forEach(function(elem) {
        ScrollTrigger.create({
            trigger: elem,
            start: "top 85%",
            animation: gsap.fromTo(elem, 
                { x: -50, autoAlpha: 0 }, 
                { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
            ),
            toggleActions: "play none none reverse"
        });
    });

    // Reveal Right
    gsap.utils.toArray('.gs-reveal-right').forEach(function(elem) {
        ScrollTrigger.create({
            trigger: elem,
            start: "top 85%",
            animation: gsap.fromTo(elem, 
                { x: 50, autoAlpha: 0 }, 
                { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
            ),
            toggleActions: "play none none reverse"
        });
    });

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    
    ScrollTrigger.create({
        trigger: "#stats-container",
        start: "top 80%",
        onEnter: () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                
                // Animate value
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                    }
                });
            });
        },
        once: true // Only animate once
    });

    // --- Simple Canvas Particle Background for Hero ---
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const config = {
            particleCount: 50,
            particleSize: 2,
            particleSpeed: 0.5,
            particleColor: 'rgba(0, 240, 255, 0.5)',
            lineColor: 'rgba(0, 240, 255, 0.1)',
            lineDistance: 150
        };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.particleSpeed;
                this.vy = (Math.random() - 0.5) * config.particleSpeed;
                this.size = Math.random() * config.particleSize + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = config.particleColor;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw lines
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.lineDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = config.lineColor;
                        ctx.lineWidth = 1 - (distance / config.lineDistance);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // --- Parallax Effect ---
    gsap.utils.toArray('.parallax-bg').forEach(function(elem) {
        const speed = elem.getAttribute('data-speed') || 0.5;
        gsap.to(elem, {
            yPercent: 30 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: elem.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Contact Form Submission to WhatsApp
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            
            // Format WhatsApp Message
            const waPhone = "94705037724";
            const waText = `*New Inquiry from ATL Technology Website*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Interested Service:* ${encodeURIComponent(service)}%0A*Message:* ${encodeURIComponent(message)}`;
            
            // Open WhatsApp in new tab
            window.open(`https://wa.me/${waPhone}?text=${waText}`, '_blank');
            
            // Reset form
            contactForm.reset();
        });
    }
});
