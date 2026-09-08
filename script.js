/**
 * Elyssa Content OS — site script.
 * No dependencies. Progressive enhancement only: the page is fully usable
 * without JS (no animation classes are required for content to be visible
 * unless this script runs, see the CSS fallback below).
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Scroll-reveal for elements marked with [data-animate] / [data-animate-group].
  function initScrollReveal() {
    var targets = document.querySelectorAll("[data-animate], [data-animate-group]");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Keep the footer copyright year current without a build step.
  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.add("js-ready");
    initScrollReveal();
    initFooterYear();
  });
})();
