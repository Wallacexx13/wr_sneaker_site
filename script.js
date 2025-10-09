// O ScrollToPlugin.min.js precisa ser carregado no HTML para este código funcionar

// --- ANIMAÇÕES GSAP (INTERATIVIDADE) ---
const tl = gsap.timeline({ defaults: { opacity: 0, ease: "power3.out" } });

tl.from(".hero-logo-intro", {
    y: 20, 
    duration: 0.8
})
.from(".hero-title", {
    y: 50, 
    duration: 1
}, "-=0.6") 
.from(".hero-description", {
    y: 30,
    duration: 1
}, "-=0.7")
.from(".hero-buttons a", {
    x: -20,
    duration: 0.8,
    stagger: 0.2, 
    ease: "power2.out"
}, "-=0.5")
.from(".hero-video-wrapper", {
    scale: 0.9, 
    duration: 1.5,
}, "-=0.8"); 


// --- FUNCIONALIDADES DE NAVEGAÇÃO E UX ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Smooth scroll com offset para o cabeçalho fixo (80px)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetId,
                        offsetY: 80 
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });

    // 2. Header scroll effect (Adiciona classe para sombra no CSS)
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled'); 
        } else {
            header.classList.remove('scrolled');
        }
    });


    // 3. Active navigation link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Detecta a seção quando a parte superior está entre 100px e 500px da viewport
            if (rect.top <= 100 && rect.bottom > 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); 


    // --- VIDEO AUTOPLAY FALLBACK ---
    const video = document.getElementById('hero-video');
    const overlay = document.getElementById('video-play');
    if (!video) return;

    const tryPlay = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (overlay) overlay.style.display = 'none';
            }).catch(() => {
                // Autoplay blocked: show overlay
                if (overlay) overlay.style.display = 'flex';
            });
        }
    };

    tryPlay();

    if (overlay) {
        overlay.addEventListener('click', () => {
            video.muted = false; 
            video.play();
            overlay.style.display = 'none';
        });
    }

});