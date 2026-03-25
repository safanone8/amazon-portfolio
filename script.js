function initTypingEffect() {
  const typedText = document.getElementById("typed-text");
  if (!typedText) return;

  const fullText = " led people under pressure, won every competition I entered, and I want to do it at Amazon's scale.";
  let index = 0;

  const interval = setInterval(() => {
    index += 1;
    typedText.textContent = fullText.slice(0, index);

    if (index >= fullText.length) {
      clearInterval(interval);
    }
  }, 45);
}

function initCounterAnimation() {
  const counters = document.querySelectorAll(".stat-number");
  let hasAnimated = false;

  function animateCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach((counter) => {
      const target = Number(counter.getAttribute("data-target") || 0);
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(target * progress);

        if (progress < 1) {
          counter.textContent = String(value);
          requestAnimationFrame(tick);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(tick);
    });
  }

  return { animateCounters };
}

function initScrollAnimations() {
  const header = document.querySelector(".site-header");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const timeline = document.getElementById("timeline");
  const counterControl = initCounterAnimation();

  const animatedElements = document.querySelectorAll("[data-animate]");

  sections.forEach((section) => {
    const elements = section.querySelectorAll("[data-animate]");
    const isStagger150 = section.querySelector(".stagger-150") !== null;
    const step = isStagger150 ? 150 : 120;

    elements.forEach((element, index) => {
      element.classList.add("fade-hidden");
      element.style.transitionDelay = `${index * step}ms`;
    });
  });

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  const observerTargets = [
    ...Array.from(animatedElements),
    ...Array.from(sections)
  ];

  if (timeline) {
    observerTargets.push(timeline);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (target.matches("[data-animate]") && entry.isIntersecting) {
          target.classList.remove("fade-hidden");
          target.classList.add("fade-visible");
          observer.unobserve(target);
        }

        if (target.id === "stats" && entry.isIntersecting) {
          counterControl.animateCounters();
        }

        if (target.id && target.tagName.toLowerCase() === "section" && entry.isIntersecting && entry.intersectionRatio > 0.22) {
          setActiveNav(target.id);
        }

        if (timeline && target === timeline && entry.isIntersecting) {
          timeline.classList.add("timeline-visible");
        }
      });
    },
    {
      threshold: [0.12, 0.22, 0.45]
    }
  );

  observerTargets.forEach((target) => observer.observe(target));

  function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTypingEffect();
  initScrollAnimations();
});
