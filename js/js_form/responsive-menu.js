/**
 * RESPONSIVE MENU PARA AMICI
 * Funciona en todos los dispositivos: 290px hasta monitores 8K
 * Versión: 1.0.0
 */

$(document).ready(function() {
    // Variables globales
    let isMenuOpen = false;
    const breakpoints = {
        xs: 290,      // Móviles muy pequeños
        sm: 576,      // Móviles
        md: 768,      // Tablets
        lg: 992,      // Laptops
        xl: 1200,     // Desktops
        xxl: 1400,    // Desktops grandes
        xxxl: 1600,   // Monitores grandes
        ultra: 1920   // Monitores 4K/8K
    };

    // Función para detectar el tipo de dispositivo
    function detectDeviceType() {
        const width = $(window).width();
        
        if (width < breakpoints.sm) return 'xs';
        if (width < breakpoints.md) return 'sm';
        if (width < breakpoints.lg) return 'md';
        if (width < breakpoints.xl) return 'lg';
        if (width < breakpoints.xxl) return 'xl';
        if (width < breakpoints.xxxl) return 'xxl';
        if (width < breakpoints.ultra) return 'xxxl';
        return 'ultra';
    }

    // Función para inicializar el menú responsivo
    function initResponsiveMenu() {
        const deviceType = detectDeviceType();
        
        // Si es móvil/tablet (menos de 992px)
        if ($(window).width() < breakpoints.lg) {
            createMobileMenu();
        } else {
            createDesktopMenu();
        }
        
        // Aplicar estilos específicos según dispositivo
        applyDeviceStyles(deviceType);
    }

    // Crear menú móvil
    function createMobileMenu() {
        const $navbar = $('.navbar-collapse');
        const $navbarToggler = $('.navbar-toggler');
        
        // Verificar si ya tiene el menú móvil
        if (!$navbar.hasClass('mobile-initialized')) {
            $navbar.addClass('mobile-initialized');
            
            // Añadir clase para móvil
            $navbar.addClass('mobile-menu');
            
            // Cerrar menú al hacer clic en un enlace
            $navbar.find('a.nav-link').on('click', function() {
                $navbar.removeClass('show');
                $navbarToggler.attr('aria-expanded', 'false');
                $('body').removeClass('menu-open');
                isMenuOpen = false;
            });
            
            // Manejar el toggle del botón hamburguesa
            $navbarToggler.off('click').on('click', function() {
                const $icon = $(this).find('.navbar-toggler-icon');
                isMenuOpen = !isMenuOpen;
                
                if (isMenuOpen) {
                    $('body').addClass('menu-open');
                    // Cambiar a icono X
                    $icon.removeClass('fa-bars').addClass('fa-times');
                } else {
                    $('body').removeClass('menu-open');
                    // Cambiar a icono hamburguesa
                    $icon.removeClass('fa-times').addClass('fa-bars');
                }
            });
        }
    }

    // Crear menú desktop
    function createDesktopMenu() {
        const $navbar = $('.navbar-collapse');
        
        // Remover clases móviles si existen
        $navbar.removeClass('mobile-initialized mobile-menu');
        $('body').removeClass('menu-open');
        
        // Añadir clase para desktop
        $navbar.addClass('desktop-menu');
        
        // Restaurar icono del botón hamburguesa
        $('.navbar-toggler .navbar-toggler-icon')
            .removeClass('fa-times')
            .addClass('fa-bars');
    }

    // Aplicar estilos específicos según dispositivo
    function applyDeviceStyles(deviceType) {
        const $navbar = $('.navbar-collapse');
        const $navLinks = $('.nav-link');
        
        // Remover todas las clases de dispositivo previas
        $navbar.removeClass('device-xs device-sm device-md device-lg device-xl device-xxl device-ultra');
        $navLinks.removeClass('link-xs link-sm link-md link-lg link-xl link-xxl link-ultra');
        
        // Añadir clase específica del dispositivo
        $navbar.addClass('device-' + deviceType);
        $navLinks.addClass('link-' + deviceType);
        
        // Ajustes específicos por dispositivo
        switch(deviceType) {
            case 'xs': // 290px - 575px (móviles muy pequeños)
                $navLinks.css({
                    'font-size': '14px',
                    'padding': '8px 12px'
                });
                $('.navbar-brand span').css('font-size', '16px');
                break;
                
            case 'sm': // 576px - 767px (móviles)
                $navLinks.css({
                    'font-size': '15px',
                    'padding': '10px 15px'
                });
                $('.navbar-brand span').css('font-size', '18px');
                break;
                
            case 'md': // 768px - 991px (tablets)
                $navLinks.css({
                    'font-size': '16px',
                    'padding': '12px 18px'
                });
                $('.navbar-brand span').css('font-size', '20px');
                break;
                
            case 'lg': // 992px - 1199px (laptops)
                $navLinks.css({
                    'font-size': '16px',
                    'padding': '14px 20px'
                });
                $('.navbar-brand span').css('font-size', '22px');
                break;
                
            case 'xl': // 1200px - 1399px (desktops)
                $navLinks.css({
                    'font-size': '17px',
                    'padding': '15px 22px'
                });
                $('.navbar-brand span').css('font-size', '24px');
                break;
                
            case 'xxl': // 1400px - 1599px (desktops grandes)
                $navLinks.css({
                    'font-size': '18px',
                    'padding': '16px 24px'
                });
                $('.navbar-brand span').css('font-size', '26px');
                break;
                
            case 'xxxl': // 1600px - 1919px (monitores grandes)
                $navLinks.css({
                    'font-size': '19px',
                    'padding': '17px 26px'
                });
                $('.navbar-brand span').css('font-size', '28px');
                break;
                
            case 'ultra': // 1920px+ (4K/8K)
                $navLinks.css({
                    'font-size': '20px',
                    'padding': '18px 28px'
                });
                $('.navbar-brand span').css('font-size', '30px');
                break;
        }
    }

    // Función para manejar el scroll
    function handleScroll() {
        const scrollTop = $(window).scrollTop();
        const $navbar = $('.navbar');
        
        if (scrollTop > 50) {
            $navbar.addClass('navbar-scrolled');
            $navbar.css({
                'background-color': 'rgba(33, 37, 41, 0.95)',
                'padding': '10px 0',
                'box-shadow': '0 4px 12px rgba(0,0,0,0.15)'
            });
        } else {
            $navbar.removeClass('navbar-scrolled');
            $navbar.css({
                'background-color': 'rgba(33, 37, 41, 0.4)',
                'padding': '20px 0',
                'box-shadow': 'none'
            });
        }
        
        // Ajustar posición del menú móvil si está abierto
        if ($(window).width() < breakpoints.lg && isMenuOpen) {
            const menuHeight = $('.navbar-collapse').outerHeight();
            const viewportHeight = $(window).height();
            const navbarHeight = $navbar.outerHeight();
            
            // Calcular altura máxima para el menú
            const maxMenuHeight = viewportHeight - navbarHeight - 20;
            
            $('.navbar-collapse').css({
                'max-height': maxMenuHeight + 'px',
                'overflow-y': 'auto'
            });
        }
    }

    // Función para ajustar la posición del contenedor
    function adjustContainerPosition() {
        const deviceType = detectDeviceType();
        const $container = $('.container');
        
        // Ajustes específicos por dispositivo
        switch(deviceType) {
            case 'xs':
                $container.css({
                    'padding-left': '10px',
                    'padding-right': '10px'
                });
                break;
            case 'sm':
                $container.css({
                    'padding-left': '15px',
                    'padding-right': '15px'
                });
                break;
            default:
                $container.css({
                    'padding-left': '',
                    'padding-right': ''
                });
        }
    }

    // Función para prevenir desbordamiento horizontal
    function preventHorizontalScroll() {
        $('body').css({
            'max-width': '100vw',
            'overflow-x': 'hidden',
            'position': 'relative'
        });
        
        // Verificar si hay desbordamiento
        if ($('body').width() > $(window).width()) {
            console.warn('Desbordamiento horizontal detectado');
            // Forzar ancho máximo
            $('body > *').css('max-width', '100%');
        }
    }

    // Inicialización completa
    function initComplete() {
        // 1. Inicializar menú responsivo
        initResponsiveMenu();
        
        // 2. Manejar scroll
        handleScroll();
        
        // 3. Ajustar posición del contenedor
        adjustContainerPosition();
        
        // 4. Prevenir desbordamiento horizontal
        preventHorizontalScroll();
        
        // 5. Asegurar que el menú esté accesible
        ensureAccessibility();
        
        console.log('Menú responsivo inicializado correctamente. Dispositivo: ' + detectDeviceType());
    }

    // Función para asegurar accesibilidad
    function ensureAccessibility() {
        // Asegurar que los botones tengan texto alternativo
        $('.navbar-toggler').attr('aria-label', 'Alternar menú de navegación');
        
        // Asegurar que los enlaces tengan focus visible
        $('.nav-link').on('focus', function() {
            $(this).addClass('focus-visible');
        }).on('blur', function() {
            $(this).removeClass('focus-visible');
        });
        
        // Manejar navegación con teclado
        $('.navbar-toggler').on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });
    }

    // Event Listeners
    $(window).on('load', initComplete);
    $(window).on('resize', function() {
        initResponsiveMenu();
        adjustContainerPosition();
        preventHorizontalScroll();
    });
    $(window).on('scroll', handleScroll);
    $(window).on('orientationchange', function() {
        setTimeout(function() {
            initResponsiveMenu();
            adjustContainerPosition();
        }, 100);
    });

    // Manejar cambios en la visibilidad del menú Bootstrap
    $('.navbar-collapse').on('show.bs.collapse', function() {
        isMenuOpen = true;
        $('body').addClass('menu-open');
    });
    
    $('.navbar-collapse').on('hide.bs.collapse', function() {
        isMenuOpen = false;
        $('body').removeClass('menu-open');
    });

    // Inicialización inmediata
    initComplete();

    // Exportar funciones para uso externo si es necesario
    window.AMICI_MENU = {
        init: initComplete,
        detectDevice: detectDeviceType,
        toggleMenu: function() {
            $('.navbar-toggler').click();
        },
        closeMenu: function() {
            if (isMenuOpen) {
                $('.navbar-toggler').click();
            }
        }
    };
});