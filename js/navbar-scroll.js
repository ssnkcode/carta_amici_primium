// navbar-scroll.js
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return; // Seguridad por si no existe el navbar
    
    let lastScrollTop = 0;
    const scrollThreshold = 60;
    let navbarHeight = navbar.offsetHeight;
    let ticking = false;
    
    // Configuración inicial
    navbar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Variable para controlar si el navbar está oculto
    let isNavbarHidden = false;
    
    // Recalcular altura en resize
    window.addEventListener('resize', function() {
        navbarHeight = navbar.offsetHeight;
    });
    
    // Función optimizada para scroll
    function updateNavbar() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Si estamos en la parte superior de la página, mostrar navbar
        if (scrollTop < 10) {
            navbar.style.transform = 'translateY(0)';
            navbar.classList.remove('navbar-hidden');
            isNavbarHidden = false;
            ticking = false;
            return;
        }
        
        // Detectar dirección del scroll
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling DOWN - esconder navbar
            if (!isNavbarHidden) {
                navbar.style.transform = `translateY(-${navbarHeight}px)`;
                navbar.classList.add('navbar-hidden');
                isNavbarHidden = true;
            }
        } else if (scrollTop < lastScrollTop - 5) {
            // Scrolling UP - mostrar navbar (con umbral de 5px para evitar falsos positivos)
            if (isNavbarHidden) {
                navbar.style.transform = 'translateY(0)';
                navbar.classList.remove('navbar-hidden');
                isNavbarHidden = false;
            }
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    // Usar requestAnimationFrame para mejor performance
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Para evitar que se oculte al hacer hover
    navbar.addEventListener('mouseenter', function() {
        if (isNavbarHidden) {
            navbar.style.transform = 'translateY(0)';
            navbar.classList.remove('navbar-hidden');
            isNavbarHidden = false;
        }
    });
    
    // Opcional: Retrasar un poco la desaparición para mejor UX
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        if (!isNavbarHidden && (window.pageYOffset || document.documentElement.scrollTop) > scrollThreshold) {
            scrollTimeout = setTimeout(function() {
                if (!navbar.matches(':hover')) {
                    updateNavbar();
                }
            }, 100);
        }
    });
    
    // Mejorar comportamiento en móviles
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 30; // Reducido para mejor respuesta en móvil
        
        if (touchStartY - touchEndY > swipeThreshold) {
            // Swipe DOWN - esconder
            if (!isNavbarHidden && (window.pageYOffset || document.documentElement.scrollTop) > scrollThreshold) {
                navbar.style.transform = `translateY(-${navbarHeight}px)`;
                navbar.classList.add('navbar-hidden');
                isNavbarHidden = true;
            }
        } else if (touchEndY - touchStartY > swipeThreshold) {
            // Swipe UP - mostrar
            if (isNavbarHidden) {
                navbar.style.transform = 'translateY(0)';
                navbar.classList.remove('navbar-hidden');
                isNavbarHidden = false;
            }
        }
    }
    
    // Añadir clase inicial
    navbar.classList.add('scroll-enabled');
});