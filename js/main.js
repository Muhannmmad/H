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

     // Navbar scroll
     $(window).scroll(function () {
         if ($(this).scrollTop() > 300) {
             $('.navbar').fadeIn('slow').css('display', 'flex');
         } else {
             $('.navbar').fadeOut('slow').css('display', 'none');
         }
     });

     // Smooth scrolling
     $(".navbar-nav a").on('click', function (event) {
         if (this.hash !== "") {
             event.preventDefault();
             $('html, body').animate({
                 scrollTop: $(this.hash).offset().top - 45
             }, 1500, 'easeInOutExpo');
         }
     });

     // Back to top
     $(window).scroll(function () {
         if ($(this).scrollTop() > 300) {
             $('.back-to-top').fadeIn('slow');
         } else {
             $('.back-to-top').fadeOut('slow');
         }
     });

     $('.back-to-top').click(function () {
         $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
         return false;
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
/* ----------------------------------------------------
   FIX NAVBAR ACTIVE LINK GETTING STUCK ON "CONTACT"
---------------------------------------------------- */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 200; // offset for navbar + padding

    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute("id");

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href").includes(id)) {
                    link.classList.add("active");
                }
            });
        }
    });
});
