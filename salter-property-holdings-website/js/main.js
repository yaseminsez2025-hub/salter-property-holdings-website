/* ==========================================================================
   SALTER PROPERTY HOLDINGS LTD — main.js
   Mobile menu · sticky header · FAQ accordion · back-to-top ·
   scroll reveal · contact form validation (mailto hand-off)
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var open = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    // Close the menu when a link inside it is clicked
    primaryNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var panel = item.querySelector(".faq-a");
      var isOpen = item.classList.contains("open");

      // Close any other open items
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  if (!form) return;

  var status = document.getElementById("formStatus");

  function setValidity(fieldEl, valid) {
    fieldEl.closest(".field").classList.toggle("invalid", !valid);
    return valid;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.elements["name"];
    var phone = form.elements["phone"];
    var email = form.elements["email"];
    var service = form.elements["service"];
    var message = form.elements["message"];
    var consent = form.elements["consent"];

    var ok = true;
    ok = setValidity(name, name.value.trim().length >= 2) && ok;
    ok = setValidity(phone, /^[\d\s()+.-]{7,}$/.test(phone.value.trim())) && ok;
    ok = setValidity(email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) && ok;
    ok = setValidity(service, service.value !== "") && ok;
    ok = setValidity(message, message.value.trim().length >= 10) && ok;
    ok = setValidity(consent, consent.checked) && ok;

    if (!ok) {
      var firstInvalid = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Static-hosting friendly hand-off: open the visitor's mail client
    // pre-filled so the enquiry lands in info@salterpropertyholdings.com
    var subject = "Website enquiry — " + service.value + " (" + name.value.trim() + ")";
    var body =
      "Name: " + name.value.trim() + "\n" +
      "Phone: " + phone.value.trim() + "\n" +
      "Email: " + email.value.trim() + "\n" +
      "Service required: " + service.value + "\n\n" +
      "Message:\n" + message.value.trim();

    window.location.href = "mailto:info@salterpropertyholdings.com"
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(body);

    if (status) {
      status.textContent = "Thank you, " + name.value.trim().split(" ")[0] +
        " — your email app should now open with the enquiry ready to send. If it does not, please email us directly at info@salterpropertyholdings.com or call 07405 668787.";
      status.classList.add("success");
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    form.reset();
  });

  // Clear the invalid state as the user types
  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (field) field.classList.remove("invalid");
  });
})();
