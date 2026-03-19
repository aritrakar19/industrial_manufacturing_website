(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Project carousel
    $(".project-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:2
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            },
            1200:{
                items:5
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    function resetProductsSubmenus() {
        $('.dropdown-item-group').removeClass('active');
    }
    var reopenProductsSubmenuOnNextOpen = false;

    // Avoid Bootstrap dropdown JS conflicts; custom JS + CSS handles this mega menu.
    $('.nav-item.dropdown .dropdown-toggle').removeAttr('data-bs-toggle').attr('aria-expanded', 'false');

    // Mobile dropdown menu toggle
    // - If a main item has a submenu: first tap expands, second tap navigates
    // - If no submenu: navigate normally and close menu
    $(document).on('click', '.dropdown-item.main-item', function(e) {
        if ($(window).width() < 992) {
            var $group = $(this).closest('.dropdown-item-group');
            var $submenu = $group.find('.sub-dropdown').first();
            if ($submenu.length) {
                if (!$group.hasClass('active')) {
                    // First tap: open submenu only
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    $group.addClass('active');
                    $group.siblings('.dropdown-item-group').removeClass('active');
                } else {
                    // Second tap: allow hash navigation and close menu
                    $('.mega-menu.show').removeClass('show');
                    resetProductsSubmenus();
                }
            } else {
                // No submenu -> allow navigation but close the mega-menu for a clean transition
                $('.mega-menu.show').removeClass('show');
                resetProductsSubmenus();
            }
        }
    });

    // Prevent menu-close handlers when interacting inside mega menu
    $(document).on('click', '.mega-menu', function(e) {
        e.stopPropagation();
    });

    // Mobile products toggle click
    // Use click only to avoid touchstart+click double trigger flicker.
    $('.nav-item.dropdown .dropdown-toggle').on('click', function(e) {
        var $dropdown = $(this).closest('.nav-item.dropdown');
        if ($(window).width() < 992) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var $menu = $dropdown.find('.mega-menu');

            // Close other dropdowns and reset states
            $('.nav-item.dropdown').not($dropdown).find('.mega-menu').removeClass('show');
            resetProductsSubmenus();

            // Toggle current dropdown
            $menu.toggleClass('show');
            if (!$menu.hasClass('show')) {
                resetProductsSubmenus();
            }
        } else {
            e.preventDefault();
            e.stopPropagation();

            // Desktop click behavior:
            // - If force-hidden after submenu click, reopen on next click
            // - Otherwise toggle menu open/close by click
            $('.nav-item.dropdown').not($dropdown).removeClass('desktop-open force-hide');
            if ($dropdown.hasClass('force-hide')) {
                $dropdown.removeClass('force-hide').addClass('desktop-open');
            } else {
                $dropdown.toggleClass('desktop-open');
            }
        }
    });

    // Close dropdown when clicking outside on mobile
    $(document).on('click', function(e) {
        if ($(window).width() < 992) {
            if (!$(e.target).closest('.nav-item.dropdown').length) {
                $('.mega-menu.show').removeClass('show');
                resetProductsSubmenus();
            }
        }
    });

    // Ensure menus reset when resizing to desktop widths
    $(window).on('resize', function() {
        if ($(window).width() >= 992) {
            $('.mega-menu').removeClass('show');
            resetProductsSubmenus();
        }
    });

    // Close mega menu when any link inside it is clicked (mobile) for clean navigation
    $(document).on('click', '.mega-menu a', function() {
        if ($(window).width() < 992) {
            var isSubmenuItem = $(this).hasClass('sub-item');
            $('.mega-menu.show').removeClass('show');
            resetProductsSubmenus();

            if (isSubmenuItem) {
                // Requested UX: after tapping submenu item, close full mobile menu.
                // Next time navbar opens, products submenu opens automatically.
                reopenProductsSubmenuOnNextOpen = true;
                $('#navbarCollapse').collapse('hide');
            }
        }
    });

    // Reopen products submenu on next mobile menu open (after submenu navigation tap)
    $('#navbarCollapse').on('shown.bs.collapse', function() {
        if ($(window).width() < 992 && reopenProductsSubmenuOnNextOpen) {
            $('.nav-item.dropdown .mega-menu').addClass('show');
            reopenProductsSubmenuOnNextOpen = false;
        }
    });

    // Desktop: clear mobile active states when leaving dropdown area
    $(document).on('mouseleave', '.nav-item.dropdown', function() {
        if ($(window).width() >= 992) {
            resetProductsSubmenus();
        }
    });

    // Desktop: clicking submenu link closes full Products menu.
    // Next click on Products reopens it (handled in toggle click above).
    $(document).on('click', '.mega-menu .sub-item', function() {
        if ($(window).width() >= 992) {
            var $dropdown = $(this).closest('.nav-item.dropdown');
            $dropdown.removeClass('desktop-open').addClass('force-hide');
            resetProductsSubmenus();
        }
    });

    // Desktop: click outside closes any open Products menu
    $(document).on('click', function(e) {
        if ($(window).width() >= 992) {
            if (!$(e.target).closest('.nav-item.dropdown').length) {
                $('.nav-item.dropdown').removeClass('desktop-open');
            }
        }
    });

    
})(jQuery);

