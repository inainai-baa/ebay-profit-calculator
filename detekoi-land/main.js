(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile nav
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Section entrance
  const reveals = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Starfield canvas (rotating / trailing night sky)
  const canvas = document.querySelector("[data-starfield]");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let raf = 0;
  let angle = 0;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = parent.clientWidth;
    height = parent.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedStars();
  }

  function seedStars() {
    const count = Math.floor((width * height) / 9000);
    stars = Array.from({ length: count }, () => {
      const radius = Math.random() * Math.min(width, height) * 0.72;
      const theta = Math.random() * Math.PI * 2;
      return {
        r: radius,
        t: theta,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.25,
        trail: Math.random() * 0.035 + 0.01,
      };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const cx = width * 0.52;
    const cy = height * 0.58;

    for (const star of stars) {
      const a = star.t + angle;
      const x = cx + Math.cos(a) * star.r;
      const y = cy + Math.sin(a) * star.r * 0.78;

      // short arc trail
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${star.alpha * 0.35})`;
      ctx.lineWidth = star.size * 0.55;
      ctx.arc(cx, cy, star.r, a - star.trail, a);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) {
      angle += 0.00055;
      raf = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  });
})();
