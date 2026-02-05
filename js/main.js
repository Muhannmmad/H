 (function ($) {
     "use strict";

     // ---------------- SPINNER ----------------
     var spinner = function () {
         setTimeout(function () {
             if ($('#spinner').length > 0) {
                 $('#spinner').removeClass('show');
             }
         }, 1);
     };
     spinner();

     // ---------------- WOW.JS ----------------
     new WOW().init();

     // ---------------- THEME TOGGLE ----------------
     const themeToggle = document.getElementById("themeToggle");

     if (localStorage.getItem("theme") === "dark") {
         document.body.classList.add("dark-mode");
         if (themeToggle) themeToggle.checked = true;
     }

     if (themeToggle) {
         themeToggle.addEventListener("change", () => {
             document.body.classList.toggle("dark-mode");

             if (document.body.classList.contains("dark-mode")) {
                 localStorage.setItem("theme", "dark");
             } else {
                 localStorage.setItem("theme", "light");
             }
         });
     }

     // ---------------- NAVBAR LOGIC ----------------
     $(function () {
         const $window = $(window);
         const $navbar = $('.navbar');
         const $links = $('.navbar-nav .nav-link');

         const $sections = $links.map(function () {
             const s = $($(this).attr('href'));
             return s.length ? s : null;
         });

         $window.on('scroll', function () {
             if ($window.scrollTop() > 300) {
                 $navbar.fadeIn('slow').css('display', 'flex');
             } else {
                 $navbar.fadeOut('slow').css('display', 'none');
             }
         });

         $links.on('click', function (e) {
             const target = $(this).attr('href');
             if (!target.startsWith('#')) return;

             e.preventDefault();
             const $target = $(target);
             if (!$target.length) return;

             const offset = ($navbar.is(':visible') ? $navbar.outerHeight() : 70) + 10;

             $('html, body').stop().animate({
                 scrollTop: $target.offset().top - offset
             }, 700, 'easeInOutExpo');
         });

         function updateActive() {
             const scrollPos = $window.scrollTop() + 120;
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

         updateActive();
         $window.on('scroll', updateActive);
         $window.on('resize', updateActive);
     });

     // ====================================================
     //              LANGUAGE SYSTEM (FIXED)
     // ====================================================

     let typed = null;

     // -------- DETERMINE INITIAL LANGUAGE --------

     let savedLang = localStorage.getItem("lang");

     let currentLang;

     if (savedLang) {
         currentLang = savedLang;
     } else {
         const browserLang = navigator.language || navigator.userLanguage;

         if (browserLang.startsWith("ar")) {
             currentLang = "ar";
         } else if (browserLang.startsWith("en")) {
             currentLang = "en";
         } else {
             currentLang = "de";
         }

         localStorage.setItem("lang", currentLang);
     }

     // -------- BUTTON REFERENCES --------

     const deBtn = document.getElementById("lang-de");
     const enBtn = document.getElementById("lang-en");
     const arBtn = document.getElementById("lang-ar");

     // -------- TYPED.JS FUNCTION --------

     function startTyped(lang) {
         const output = document.querySelector(".typed-text-output");
         if (!output) return;

         output.innerHTML = "";
         output.style.textAlign = lang === "ar" ? "right" : "left";
         output.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

         if (typed) {
             typed.destroy();
             typed = null;
         }

         let selector = ".typed-de";
         if (lang === "en") selector = ".typed-en";
         if (lang === "ar") selector = ".typed-ar";

         const element = document.querySelector(selector);
         if (!element) return;

         document.querySelectorAll(".typed-text").forEach(el => el.style.display = 'none');
         element.style.display = 'block';

         const words = element.textContent.trim().split(/\s*,\s*|\s*،\s*/);

         typed = new Typed(".typed-text-output", {
             strings: words,
             typeSpeed: 100,
             backSpeed: 50,
             backDelay: 1000,
             loop: true,
             smartBackspace: true
         });
     }

     // -------- UPDATE TEXT ELEMENTS --------

     function updateTextElements(lang) {
         // Show/hide language-specific content
         document.querySelectorAll('[data-lang]').forEach(el => {
             el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
         });

         // Apply RTL only to main content
         if (lang === "ar") {
             document.documentElement.setAttribute("dir", "rtl");
             document.body.classList.add("rtl");
         } else {
             document.documentElement.setAttribute("dir", "ltr");
             document.body.classList.remove("rtl");
         }

         // Ensure language switcher always stays LTR
         const switcher = document.querySelector(".lang-floating-btn");
         if (switcher) {
             switcher.style.direction = "ltr";
             switcher.style.textAlign = "left";
         }
     }

     // -------- UPDATE SWITCHER UI --------

     function updateSwitcher(lang) {
         [deBtn, enBtn, arBtn].forEach(btn => {
             if (!btn) return;

             btn.classList.remove("active");
             btn.classList.add("inactive");
             btn.disabled = false;
         });

         if (lang === "de" && deBtn) {
             deBtn.classList.add("active");
             deBtn.classList.remove("inactive");
             deBtn.disabled = true;
         } else if (lang === "en" && enBtn) {
             enBtn.classList.add("active");
             enBtn.classList.remove("inactive");
             enBtn.disabled = true;
         } else if (lang === "ar" && arBtn) {
             arBtn.classList.add("active");
             arBtn.classList.remove("inactive");
             arBtn.disabled = true;
         }

         localStorage.setItem("lang", lang);
     }

     // -------- MAIN CHANGE FUNCTION --------

     function changeLanguage(lang) {
         currentLang = lang;

         updateTextElements(lang);
         updateSwitcher(lang);
         startTyped(lang);

         localStorage.setItem("lang", lang);
     }

     // -------- BUTTON EVENTS --------

     if (deBtn) deBtn.addEventListener("click", () => changeLanguage("de"));
     if (enBtn) enBtn.addEventListener("click", () => changeLanguage("en"));
     if (arBtn) arBtn.addEventListener("click", () => changeLanguage("ar"));

     // -------- INITIAL PAGE LOAD --------

     document.addEventListener("DOMContentLoaded", () => {
         changeLanguage(currentLang);
     });

     // ====================================================
     //              SKILL BARS
     // ====================================================

     function initSkillWaypoint() {
         $('.skill').waypoint(function () {
             $('.progress .progress-bar').each(function () {
                 $(this).css("width", $(this).attr("aria-valuenow") + '%');
             });
         }, { offset: '80%' });
     }
     initSkillWaypoint();

     // ====================================================
     //              CONTACT FORM
     // ====================================================

     (function () {
         const form = document.getElementById("contact-form");
         const thankYou = document.getElementById("thank-you-message");

         if (!form) return;

         form.addEventListener("submit", async function (e) {
             e.preventDefault();

             const name = document.getElementById("name-field");
             const email = document.getElementById("email-field");
             const phone = document.getElementById("telephone-field");
             const subject = document.getElementById("subject-field");
             const message = document.getElementById("message-field");

             let valid = true;

             [name, email, phone, subject, message].forEach(f => f.classList.remove("is-invalid"));

             if (!name.value.trim()) { name.classList.add("is-invalid"); valid = false; }
             if (!subject.value.trim()) { subject.classList.add("is-invalid"); valid = false; }
             if (!message.value.trim()) { message.classList.add("is-invalid"); valid = false; }

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

         window.resetForm = function (e) {
             e.preventDefault();
             thankYou.style.display = "none";
             form.style.display = "block";
             form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
             form.scrollIntoView({ behavior: "smooth", block: "start" });
         };
     })();

 })(jQuery);
