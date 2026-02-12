const siteHeader = document.getElementById("site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = siteNav ? siteNav.querySelectorAll("a") : [];

const handleHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 18);
};

window.addEventListener("scroll", handleHeaderState);
handleHeaderState();

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealTargets = document.querySelectorAll(".reveal");
if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const counters = document.querySelectorAll(".counter");
const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = 1200;
  let startTime = null;

  const tick = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    counter.textContent = Math.floor(target * progress).toLocaleString("en-GB");
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = target.toLocaleString("en-GB");
    }
  };

  requestAnimationFrame(tick);
};

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const modeButtons = document.querySelectorAll(".mode-trigger");
const modePanels = document.querySelectorAll(".mode-panel");
if (modeButtons.length && modePanels.length) {
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.mode;

      modeButtons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");

      modePanels.forEach((panel) => panel.classList.remove("is-active"));
      const activePanel = document.getElementById(`mode-${selected}`);
      if (activePanel) activePanel.classList.add("is-active");
    });
  });
}

const testimonialCards = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dot");
const prevButton = document.querySelector(".slider-prev");
const nextButton = document.querySelector(".slider-next");
let currentIndex = 0;
let rotation;

const showSlide = (index) => {
  if (!testimonialCards.length) return;
  currentIndex = (index + testimonialCards.length) % testimonialCards.length;

  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === currentIndex);
  });

  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentIndex;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-current", String(isActive));
  });
};

const startRotation = () => {
  if (!testimonialCards.length) return;
  clearInterval(rotation);
  rotation = setInterval(() => {
    showSlide(currentIndex + 1);
  }, 7000);
};

if (testimonialCards.length) {
  showSlide(0);
  startRotation();

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      startRotation();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      startRotation();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startRotation();
    });
  });
}

const waitlistForm = document.getElementById("waitlist-form") || document.getElementById("booking-form");
const formStatus = document.getElementById("form-status");

if (waitlistForm && formStatus) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!waitlistForm.checkValidity()) {
      waitlistForm.reportValidity();
      return;
    }

    const formData = new FormData(waitlistForm);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const joiningAs = formData.get("joining_as") || "";
    const sessionType = formData.get("session_format") || formData.get("session_type") || "";
    const packageChoice = formData.get("package") || "";
    const preferredStart = formData.get("preferred_start") || "February 2027 launch";
    const message = formData.get("message") || "";

    const subject = encodeURIComponent(`Waitlist Request - ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterested in: ${joiningAs}\nPreferred session format: ${sessionType}\nPackage: ${packageChoice}\nPreferred start window: ${preferredStart}\n\nSupport request:\n${message}\n\nOfficial launch: February 2027`
    );

    window.location.href = `mailto:hello@stillpointcoaching.co.uk?subject=${subject}&body=${body}`;
    formStatus.textContent = "Thanks. Your email app should open now with your waitlist details. If it does not, email hello@stillpointcoaching.co.uk directly.";
    waitlistForm.reset();
  });
}

document.querySelectorAll("[data-year]").forEach((yearEl) => {
  yearEl.textContent = String(new Date().getFullYear());
});
