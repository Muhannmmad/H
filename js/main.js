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

     // WOW.js
     new WOW().init();

     /* --------------------------------------------------
        NAVBAR: Smooth Scroll + Active Link Highlighting
     -------------------------------------------------- */

     $(function () {

         const $window = $(window);
         const $navbar = $('.navbar');
         const $links = $('.navbar-nav .nav-link');
         const $sections = $links.map(function () {
             const s = $($(this).attr('href'));
             return s.length ? s : null;
         });

         /* --------------------------------------
            A) NAVBAR SHOW / HIDE (same as yours)
         -------------------------------------- */
         $window.on('scroll', function () {
             if ($window.scrollTop() > 300) {
                 $navbar.fadeIn('slow').css('display', 'flex');
             } else {
                 $navbar.fadeOut('slow').css('display', 'none');
             }
         });

         /* --------------------------------------
            B) SMOOTH SCROLL (simple & reliable)
         -------------------------------------- */
         $links.on('click', function (e) {
             const target = $(this).attr('href');
             if (!target.startsWith('#')) return;

             e.preventDefault();
             const $target = $(target);
             if (!$target.length) return;

             // offset: navbar height or fallback
             const offset = ($navbar.is(':visible') ? $navbar.outerHeight() : 70) + 10;

             $('html, body').stop().animate({
                 scrollTop: $target.offset().top - offset
             }, 700, 'easeInOutExpo');
         });

         /* --------------------------------------
            C) ACTIVE LINK ON SCROLL (bulletproof)
         -------------------------------------- */
         function updateActive() {
             const scrollPos = $window.scrollTop() + 120; // sensor offset
             let current = null;

             $sections.each(function () {
                 if ($(this).offset().top <= scrollPos) {
                     current = this;
                 }
             });

             if (!current) return;

             const id = current.attr('id');

             $links.removeClass('active');
             $links.filter('[href="#' + id + '"]').addClass('active');
         }

         updateActive();          // run once
         $window.on('scroll', updateActive);
         $window.on('resize', updateActive);

     });

     // ---------------------------
     // LANGUAGE + TYPED
     // ---------------------------
     let typed = null;
     let currentLang = "de"; // default = German

     function startTyped(lang) {
         if (typed) typed.destroy();

         const selector = lang === "de" ? ".typed-de" : ".typed-en";
         const element = document.querySelector(selector);

         // --- SAFETY CHECKS ---
         if (!element) {
             console.warn("Typed.js element missing:", selector);
             return;
         }

         const output = document.querySelector(".typed-text-output");
         if (!output) {
             console.warn("Typed output element missing!");
             return;
         }
         // ----------------------

         const words = element.textContent.trim().split(", ");

         typed = new Typed(".typed-text-output", {
             strings: words,
             typeSpeed: 100,
             backSpeed: 20,
             loop: true
         });
     }

     function updateTextElements(lang) {
         document.querySelectorAll('[data-lang]').forEach(el => {
             el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
         });
     }

     function updateSwitcher(lang) {
         const switcher = document.getElementById("lang-switch");
         if (lang === "de") {
             switcher.innerHTML = '🇩🇪 <strong>DE</strong> | 🇬🇧 EN';
         } else {
             switcher.innerHTML = '🇩🇪 DE | 🇬🇧 <strong>EN</strong>';
         }
     }


     function setLanguage(lang) {
         currentLang = lang;
         document.documentElement.lang = lang;
         updateTextElements(lang);
         updateSwitcher(lang);
         startTyped(lang);
     }

     // Initialize page on load
     setLanguage(currentLang);

     // Language switch click
     document.getElementById("lang-switch").addEventListener("click", () => {
         setLanguage(currentLang === "de" ? "en" : "de");
     });

     // Modal Video
     var $videoSrc;
     $('.btn-play').click(function () {
         $videoSrc = $(this).data("src");
     });

     $('#videoModal').on('shown.bs.modal', function () {
         $("#video").attr('src', $videoSrc + "?autoplay=1&modestbranding=1&showinfo=0");
     });

     $('#videoModal').on('hide.bs.modal', function () {
         $("#video").attr('src', $videoSrc);
     });

     // Counter
     $('[data-toggle="counter-up"]').counterUp({
         delay: 10,
         time: 2000
     });

     // Skills animation
     $('.skill').waypoint(function () {
         $('.progress .progress-bar').each(function () {
             $(this).css("width", $(this).attr("aria-valuenow") + '%');
         });
     }, { offset: '80%' });

     // Portfolio filtering
     var portfolioIsotope = $('.portfolio-container').isotope({
         itemSelector: '.portfolio-item',
         layoutMode: 'fitRows'
     });

     $('#portfolio-flters li').on('click', function () {
         $("#portfolio-flters li").removeClass('active');
         $(this).addClass('active');
         portfolioIsotope.isotope({ filter: $(this).data('filter') });
     });

     // Testimonials carousel
     $(".testimonial-carousel").owlCarousel({
         autoplay: true,
         smartSpeed: 1000,
         items: 1,
         dots: true,
         loop: true
     });

 })(jQuery);
