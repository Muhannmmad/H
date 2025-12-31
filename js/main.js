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
     const themeToggle = document.getElementById("themeToggle");

     // Load saved theme
     if (localStorage.getItem("theme") === "dark") {
         document.body.classList.add("dark-mode");
         themeToggle.checked = true;
     }

     themeToggle.addEventListener("change", () => {
         document.body.classList.toggle("dark-mode");

         if (document.body.classList.contains("dark-mode")) {
             localStorage.setItem("theme", "dark");
         } else {
             localStorage.setItem("theme", "light");
         }
     });

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
     // ---------------------------
     // ---------------------------
     // LANGUAGE + TYPED
     // ---------------------------
     let typed = null;

     // Load saved language, fall back to German for first-time visitors
     let savedLang = localStorage.getItem("lang");
     let currentLang = savedLang ? savedLang : "de";

     const deBtn = document.getElementById("lang-de");
     const enBtn = document.getElementById("lang-en");

     // Start typed.js
     function startTyped(lang) {
         if (typed) typed.destroy();

         const selector = lang === "de" ? ".typed-de" : ".typed-en";
         const element = document.querySelector(selector);

         if (!element) {
             console.warn("Typed.js element missing:", selector);
             return;
         }

         const output = document.querySelector(".typed-text-output");
         if (!output) {
             console.warn("Typed output element missing!");
             return;
         }

         const words = element.textContent.trim().split(", ");

         typed = new Typed(".typed-text-output", {
             strings: words,
             typeSpeed: 100,
             backSpeed: 20,
             loop: true
         });
     }

     // Show correct language elements
     function updateTextElements(lang) {
         document.querySelectorAll('[data-lang]').forEach(el => {
             el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
         });
     }

     // Update language switcher UI
     function updateSwitcher(lang) {
         if (lang === "de") {
             deBtn.classList.add("active");
             deBtn.classList.remove("inactive");
             deBtn.disabled = true;

             enBtn.classList.remove("active");
             enBtn.classList.add("inactive");
             enBtn.disabled = false;
         } else {
             enBtn.classList.add("active");
             enBtn.classList.remove("inactive");
             enBtn.disabled = true;

             deBtn.classList.remove("active");
             deBtn.classList.add("inactive");
             deBtn.disabled = false;
         }

         // Save last selected language
         localStorage.setItem("lang", lang);
     }

     // When the page loads, enable correct language
     document.addEventListener("DOMContentLoaded", () => {
         updateSwitcher(currentLang);
         updateTextElements(currentLang);
         startTyped(currentLang);
     });

     // -----------------------------------
     // SKILL BAR WAYPOINT RE-INITIALIZATION
     // -----------------------------------

     function initSkillWaypoint() {
         $('.skill').waypoint(function () {
             $('.progress .progress-bar').each(function () {
                 $(this).css("width", $(this).attr("aria-valuenow") + '%');
             });
         }, { offset: '80%' });
     }

     // Run once on page load
     initSkillWaypoint();

     
     (function () {

         const form = document.getElementById("contact-form");
         const thankYou = document.getElementById("thank-you-message");

         form.addEventListener("submit", async function (e) {
             e.preventDefault();

             const name = document.getElementById("name-field");
             const email = document.getElementById("email-field");
             const phone = document.getElementById("telephone-field");
             const subject = document.getElementById("subject-field");
             const message = document.getElementById("message-field");

             let valid = true;

             // Reset validation
             [name, email, phone, subject, message].forEach(f => f.classList.remove("is-invalid"));

             // Required fields
             if (!name.value.trim()) { name.classList.add("is-invalid"); valid = false; }
             if (!subject.value.trim()) { subject.classList.add("is-invalid"); valid = false; }
             if (!message.value.trim()) { message.classList.add("is-invalid"); valid = false; }

             // Email OR phone required
             if (!email.value.trim() && !phone.value.trim()) {
                 email.classList.add("is-invalid");
                 phone.classList.add("is-invalid");
                 valid = false;
             }

             if (!valid) return;

             try {
                 const response = await fetch(form.action, {
                     method: form.method,
                     body: new FormData(form),
                     headers: { "Accept": "application/json" }
                 });

                 if (response.ok) {
                     form.reset();
                     form.style.display = "none";
                     thankYou.style.display = "block";
                 } else {
                     alert("Something went wrong. Please try again.");
                 }
             } catch {
                 alert("Network error. Please try again.");
             }
         });

         // 🔥 MUST be global for onclick to work
         window.resetForm = function (e) {
             e.preventDefault();

             // Hide thank you
             thankYou.style.display = "none";

             // Show form again
             form.style.display = "block";

             // Clear validation styles
             form.querySelectorAll(".is-invalid").forEach(el => {
                 el.classList.remove("is-invalid");
             });

             // Scroll nicely back to form
             form.scrollIntoView({ behavior: "smooth", block: "start" });
         };

     })();
     

     // -----------------------------------
     // LANGUAGE SWITCHING
     // -----------------------------------

     function setLanguage(lang) {
         currentLang = lang;
         document.documentElement.lang = lang;

         updateTextElements(lang);
         updateSwitcher(lang);
         startTyped(lang);

         // Reset all bars to zero before the next scroll
         document.querySelectorAll('.progress-bar').forEach(bar => {
             bar.style.width = '0%';
         });

         // Reinitialize waypoint AFTER language visibility changes
         setTimeout(() => {
             initSkillWaypoint();
         }, 200);
     }

     // Initialize page on load
     setLanguage(currentLang);

     // Button click events
     deBtn.addEventListener("click", () => {
         if (currentLang !== "de") setLanguage("de");
     });

     enBtn.addEventListener("click", () => {
         if (currentLang !== "en") setLanguage("en");
     });

 })(jQuery);
