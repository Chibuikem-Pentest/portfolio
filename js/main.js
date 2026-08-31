/* ============================================================
   Chibuikem Okonkwo — Portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: background on scroll + back-to-top ---------- */
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("toTop");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
  };

  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    mobileMenu.classList.toggle("open", !open);
  });
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger for siblings revealed together
            entry.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if ("IntersectionObserver" in window) {
    const linkFor = (id) =>
      document.querySelector(`.nav__links a[href="#${id}"]`);
    const spyObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            const link = linkFor(entry.target.id);
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spyObs.observe(s));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat__num[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObs.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count + (c.dataset.suffix || "")));
  }

  /* ---------- Terminal typing effect ---------- */
  const term = document.getElementById("terminalBody");
  if (term) {
    // Each entry: type a line, then output instantly (or skip).
    const lines = [
      { type: true,  html: '<span class="prompt">$</span> whoami' },
      { type: false, html: '<span class="t-ok">chibuikem_okonkwo</span> — Full-Stack Engineer &middot; AppSec' },
      { type: true,  html: '<span class="prompt">$</span> cat focus.txt' },
      { type: false, html: '<span class="t-out">Secure SDLC · Identity &amp; Access · Zero-Trust</span>' },
      { type: true,  html: '<span class="prompt">$</span> ./scan --stack' },
      { type: false, html: '<span class="t-key">[typescript]</span> <span class="t-key">[react]</span> <span class="t-key">[python]</span> <span class="t-key">[fastapi]</span>' },
      { type: false, html: '<span class="t-key">[oauth2]</span> <span class="t-key">[webauthn]</span> <span class="t-key">[postgres]</span> <span class="t-key">[kafka]</span>' },
      { type: true,  html: '<span class="prompt">$</span> status' },
      { type: false, html: '<span class="t-ok">&#9679; available for opportunities</span>' },
    ];

    const cursor = document.createElement("span");
    cursor.className = "terminal__cursor";

    const makeLine = (cls) => {
      const div = document.createElement("div");
      div.className = cls;
      return div;
    };

    // Reduced motion: render everything at once.
    if (prefersReducedMotion) {
      lines.forEach((l) => {
        const div = makeLine(l.type ? "t-cmd" : "t-out");
        div.innerHTML = l.html;
        term.appendChild(div);
      });
      term.appendChild(cursor);
      return;
    }

    let li = 0;
    const typeLine = () => {
      if (li >= lines.length) {
        term.appendChild(cursor);
        return;
      }
      const line = lines[li];
      const div = makeLine(line.type ? "t-cmd" : "t-out");
      term.appendChild(div);

      if (!line.type) {
        // Output line: reveal instantly with a tiny pause.
        div.innerHTML = line.html;
        li++;
        setTimeout(typeLine, 260);
        return;
      }

      // Command line: type character-by-character using textContent of a
      // temporary element so we don't break HTML mid-tag.
      const tmp = document.createElement("div");
      tmp.innerHTML = line.html;
      const full = tmp.textContent;
      let ci = 0;
      div.appendChild(cursor);
      const typeChar = () => {
        if (ci <= full.length) {
          div.textContent = full.slice(0, ci);
          div.appendChild(cursor);
          ci++;
          setTimeout(typeChar, 45 + Math.random() * 45);
        } else {
          // Replace plain text with the styled HTML once typing is done.
          div.innerHTML = line.html;
          li++;
          setTimeout(typeLine, 360);
        }
      };
      typeChar();
    };
    // Kick off shortly after load.
    setTimeout(typeLine, 600);
  }

  /* ---------- Matrix rain background ---------- */
  const canvas = document.getElementById("matrix");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const glyphs = "01<>{}[]/\\=+*#$%abcdef0123456789".split("");
    let columns, drops, fontSize, raf, running = true;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fontSize = canvas.width < 600 ? 12 : 15;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    };

    const draw = () => {
      if (!running) return;
      ctx.fillStyle = "rgba(10, 14, 20, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ffa3";
      ctx.font = fontSize + "px 'JetBrains Mono', monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };

    setup();
    draw();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 200);
    });

    // Pause animation when tab is hidden (saves CPU/battery).
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        draw();
      }
    });
  }
})();
