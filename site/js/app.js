document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initActiveSectionLinks();
  initContactForm();
  initScrollReveal();
});

/* ─── Nav toggle (mobile) ─── */

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ─── Active section links (IntersectionObserver) ─── */

function initActiveSectionLinks() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      rootMargin: "-25% 0px -45% 0px",
      threshold: 0.15
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ─── Contact form validation ─── */

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) {
    return;
  }

  const feedback = document.getElementById("formFeedback");
  const nomField = document.getElementById("nom");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!feedback || !nomField || !emailField || !messageField) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameValid = validateField("fieldNom", nomField.value.trim().length >= 2);
    const emailValid = validateField("fieldEmail", emailPattern.test(emailField.value.trim()));
    const messageValid = validateField("fieldMessage", messageField.value.trim().length >= 10);
    const isValid = nameValid && emailValid && messageValid;

    feedback.classList.remove("form-feedback--success", "form-feedback--error");

    if (!isValid) {
      feedback.classList.add("form-feedback--error");
      feedback.textContent = "Merci de corriger les champs en rouge avant envoi.";
      return;
    }

    feedback.classList.add("form-feedback--success");
    feedback.textContent = "Message valide. Merci, je vous repondrai rapidement.";
    form.reset();
  });
}

function validateField(wrapperId, condition) {
  const wrapper = document.getElementById(wrapperId);
  if (wrapper) {
    wrapper.classList.toggle("invalid", !condition);
  }
  return condition;
}

/* ─── Scroll reveal ─── */

function initScrollReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) {
    return;
  }

  // If user prefers reduced motion, show everything immediately
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.15
    }
  );

  elements.forEach((el) => observer.observe(el));
}
