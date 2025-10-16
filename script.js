// ===== CONFIGURAÇÕES =====
const CONFIG = {
    scrollOffset: 70,
    animationOffset: 50,
    videoAutoplay: true,
    enableTracking: typeof gtag !== 'undefined'
};

// ===== GERENCIADOR DE ESTADOS =====
const AppState = {
    isMobileMenuOpen: false,
    currentSection: 'home',
    videoPlaying: false
};

// ===== UTILITÁRIOS =====
const DOM = {
    get(selector) {
        return document.querySelector(selector);
    },
    getAll(selector) {
        return document.querySelectorAll(selector);
    }
};

// ===== MENU MOBILE =====
function initMobileMenu() {
    const mobileBtn = DOM.get('.mobile-menu-btn');
    const nav = DOM.get('.nav');
    
    if (!mobileBtn || !nav) return;

    function toggleMenu() {
        const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('nav-open');
        document.body.classList.toggle('menu-open');
        AppState.isMobileMenuOpen = !isExpanded;
        
        // Anima os spans do botão hamburger
        const spans = mobileBtn.querySelectorAll('span');
        if (!isExpanded) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    mobileBtn.addEventListener('click', toggleMenu);

    // Fecha menu ao clicar nos links
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            mobileBtn.setAttribute('aria-expanded', 'false');
            nav.classList.remove('nav-open');
            document.body.classList.remove('menu-open');
            AppState.isMobileMenuOpen = false;
            
            // Reseta animação do hamburger
            const spans = mobileBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (AppState.isMobileMenuOpen && 
            !nav.contains(e.target) && 
            !mobileBtn.contains(e.target)) {
            toggleMenu();
        }
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    DOM.getAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#home' || targetId === '#') return;
            
            e.preventDefault();
            const targetElement = DOM.get(targetId);
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - CONFIG.scrollOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER SCROLL =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check
}

// ===== ACTIVE NAV LINK =====
function initActiveNav() {
    const sections = DOM.getAll('section[id]');
    const navLinks = DOM.getAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.classList.add('active');
                AppState.currentSection = current;
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial check
}

// ===== VIDEO CONTROLS =====
function initVideoControls() {
    const video = document.getElementById('hero-video');
    const overlay = document.getElementById('video-play');
    
    if (!video) return;

    // Tenta autoplay e mostra botão se falhar
    video.play().catch((error) => {
        console.log('Autoplay falhou, mostrando botão:', error);
        if (overlay) {
            overlay.style.display = 'flex';
        }
    });

    // Controle manual
    if (overlay) {
        overlay.addEventListener('click', function() {
            video.play().then(() => {
                this.style.display = 'none';
                AppState.videoPlaying = true;
            }).catch(error => {
                console.log('Erro ao reproduzir:', error);
            });
        });
    }

    // Pausa vídeo quando sai da viewport para performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && AppState.videoPlaying) {
                video.pause();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(video);
}

// ===== FAQ INTERATIVO =====
function initFAQ() {
    const faqItems = DOM.getAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Alterna o item atual
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                // Track FAQ expansion
                if (CONFIG.enableTracking) {
                    gtag('event', 'faq_expand', {
                        'event_category': 'Engagement',
                        'event_label': question.textContent.trim()
                    });
                }
            } else {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = '0';
            }
        });
    });
}

// ===== SOCIAL LINKS TRACKING =====
function initSocialTracking() {
    DOM.getAll('.social-link').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.getAttribute('aria-label') || this.textContent.trim();
            console.log(`Redes sociais: ${platform} clicado`);
            
            if (CONFIG.enableTracking) {
                gtag('event', 'social_click', {
                    'event_category': 'Social Media',
                    'event_label': platform
                });
            }
        });
    });
}

// ===== MAPA INTERATIVO =====
function initMapFeatures() {
    const mapLink = DOM.get('.location-info .btn-primary');
    if (mapLink) {
        mapLink.addEventListener('click', function() {
            console.log('Google Maps aberto');
            if (CONFIG.enableTracking) {
                gtag('event', 'map_click', {
                    'event_category': 'Navigation',
                    'event_label': 'Google Maps'
                });
            }
        });
    }
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Track section views
                if (CONFIG.enableTracking && entry.target.id) {
                    gtag('event', 'section_view', {
                        'event_category': 'Engagement',
                        'event_label': entry.target.id
                    });
                }
            }
        });
    }, observerOptions);

    // Observa elementos para animação
    const animatedElements = DOM.getAll('.service-card, .info-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== BOTÕES FLUTUANTES =====
function initFloatingButtons() {
    const floatingWhatsapp = DOM.get('.floating-whatsapp');
    
    if (floatingWhatsapp) {
        floatingWhatsapp.addEventListener('click', function() {
            if (CONFIG.enableTracking) {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'Conversion',
                    'event_label': 'Floating Button'
                });
            }
        });
    }
}

// ===== PERFORMANCE E OTIMIZAÇÕES =====
function initPerformance() {
    // Preload critical resources
    const criticalImages = DOM.getAll('img[loading="lazy"]');
    criticalImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                // Update anything that depends on scroll position
            }, 100);
        }
    });
}

// ===== INICIALIZAÇÃO COMPLETA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 wr.sneakers iniciando...');
    
    try {
        // Inicializa todas as funcionalidades
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initActiveNav();
        initVideoControls();
        initFAQ();
        initSocialTracking();
        initMapFeatures();
        initScrollAnimations();
        initFloatingButtons();
        initPerformance();
        
        console.log('✅ wr.sneakers completamente carregado!');
        
        // Adiciona classe loaded para animações CSS
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
    }
});

// ===== HANDLE ERRORS =====
window.addEventListener('error', function(e) {
    console.error('Erro global:', e.error);
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', function() {
    // Fecha menu mobile em telas maiores
    if (window.innerWidth > 768 && AppState.isMobileMenuOpen) {
        const mobileBtn = DOM.get('.mobile-menu-btn');
        const nav = DOM.get('.nav');
        
        if (mobileBtn && nav) {
            mobileBtn.setAttribute('aria-expanded', 'false');
            nav.classList.remove('nav-open');
            document.body.classList.remove('menu-open');
            AppState.isMobileMenuOpen = false;
        }
    }
});