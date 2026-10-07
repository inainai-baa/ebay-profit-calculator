(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      window.alert("プロトタイプのため送信は行われません。正式な予約はライブサイトのフォームをご利用ください。");
    });
  }

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
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Subtle star motion over live illustration (soft, not cinematic)
  const canvas = document.querySelector("[data-starfield]");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let raf = 0;
  let t = 0;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const img = parent.querySelector(".hero__img");
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = parent.clientWidth;
    height = img ? img.clientHeight : parent.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.floor((width * height) / 14000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.55,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random() * 0.45 + 0.15,
      s: Math.random() * 0.25 + 0.05,
      p: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const twinkle = 0.55 + 0.45 * Math.sin(t * star.s + star.p);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${star.a * twinkle})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      // gentle drift
      star.x += 0.015;
      if (star.x > width + 2) star.x = -2;
    }
    if (!reduceMotion) {
      t += 0.03;
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
