(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  const form = document.querySelector("[data-proto-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("プロトタイプのため送信は行われません。正式な予約はライブサイトをご利用ください。");
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
      { threshold: 0.14 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const canvas = document.querySelector("[data-starfield]");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let w = 0, h = 0, dpr = 1, stars = [], raf = 0, angle = 0;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = parent.clientWidth;
    h = parent.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      r: Math.random() * Math.min(w, h) * 0.72,
      t: Math.random() * Math.PI * 2,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.7 + 0.25,
      trail: Math.random() * 0.035 + 0.01,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.52, cy = h * 0.58;
    for (const s of stars) {
      const a = s.t + angle;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${s.alpha * 0.35})`;
      ctx.lineWidth = s.size * 0.55;
      ctx.arc(cx, cy, s.r, a - s.trail, a);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.arc(cx + Math.cos(a) * s.r, cy + Math.sin(a) * s.r * 0.78, s.size, 0, Math.PI * 2);
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
