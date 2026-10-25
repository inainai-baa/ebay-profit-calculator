(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const setNavOpen = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  };
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setNavOpen(false))
    );
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  // Variant B: Web予約 → #contact（メールフォーム）。料金表は pricing-data.js。

  // Daikanso-like hero settle → enable Ken Burns after soft text entrance
  const hero = document.querySelector(".hero");
  if (hero) {
    window.setTimeout(() => hero.classList.add("is-settled"), reduceMotion ? 0 : 3200);
  }

  // Soft “ふわっ” reveal for stay catchcopy when section enters view
  const softs = document.querySelectorAll(".soft-reveal");
  if (softs.length) {
    if (!reduceMotion && "IntersectionObserver" in window) {
      const softIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-shown");
              softIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      softs.forEach((el) => softIo.observe(el));
    } else {
      softs.forEach((el) => el.classList.add("is-shown"));
    }
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

  // Facility stay-panel slideshow (fade)
  document.querySelectorAll("[data-facility-slideshow]").forEach((root) => {
    const slides = Array.from(root.querySelectorAll(".facility-slideshow__viewport img"));
    if (slides.length < 2) return;
    const dotsWrap = root.querySelector("[data-slideshow-dots]");
    let index = Math.max(0, slides.findIndex((img) => img.classList.contains("is-active")));
    let timer = 0;

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `写真 ${i + 1}`);
      b.addEventListener("click", () => go(i, true));
      dotsWrap?.appendChild(b);
      return b;
    });

    function paint() {
      slides.forEach((img, i) => img.classList.toggle("is-active", i === index));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }

    function go(next, user) {
      index = (next + slides.length) % slides.length;
      paint();
      if (user) restart();
    }

    function restart() {
      window.clearInterval(timer);
      if (!reduceMotion) timer = window.setInterval(() => go(index + 1, false), 4200);
    }

    root.querySelector("[data-slideshow-prev]")?.addEventListener("click", () => go(index - 1, true));
    root.querySelector("[data-slideshow-next]")?.addEventListener("click", () => go(index + 1, true));
    root.addEventListener("mouseenter", () => window.clearInterval(timer));
    root.addEventListener("mouseleave", restart);
    paint();
    restart();
  });

  // Pricing accordion (sheet snapshot in pricing-data.js)
  const pricingRoot = document.querySelector("[data-pricing-root]");
  const pricing = window.DETEKOI_PRICING;
  if (pricingRoot && pricing) {
    const titleEl = pricingRoot.querySelector("[data-pricing-title]");
    const metaEl = pricingRoot.querySelector("[data-pricing-meta]");
    const accordion = pricingRoot.querySelector("[data-pricing-accordion]");
    if (titleEl && pricing.title) titleEl.textContent = pricing.title;
    if (metaEl) {
      const bits = [pricing.asOf, pricing.syncedAt ? `反映日 ${pricing.syncedAt}` : ""]
        .filter(Boolean)
        .join(" · ");
      metaEl.textContent = bits;
    }

    const escapeHtml = (s) =>
      String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    function facilityTable(rows) {
      const body = rows
        .map((r) => {
          const label = [r.item, r.category].filter(Boolean).join(" / ");
          // Sheet columns green/yellow → display as 通常価格 / 土日祝 (no color-chip legend)
          return `<tr>
            <th scope="row">${escapeHtml(label)}${r.unit ? `<span class="pricing__unit">${escapeHtml(r.unit)}</span>` : ""}</th>
            <td class="pricing__yen">${escapeHtml(r.green)}</td>
            <td class="pricing__yen">${escapeHtml(r.yellow)}</td>
          </tr>`;
        })
        .join("");
      return `<div class="pricing__table-wrap">
        <table class="pricing__table">
          <thead>
            <tr>
              <th scope="col">内容</th>
              <th scope="col">通常価格</th>
              <th scope="col">土日祝</th>
            </tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>`;
    }

    function rentalTable(rows) {
      const body = rows
        .map(
          (r) => `<tr>
            <th scope="row">${escapeHtml(r.item)}${r.detail ? `<span class="pricing__unit">${escapeHtml(r.detail)}</span>` : ""}</th>
            <td class="pricing__yen">${escapeHtml(r.price)}</td>
          </tr>`
        )
        .join("");
      return `<div class="pricing__table-wrap">
        <table class="pricing__table pricing__table--rental">
          <thead>
            <tr>
              <th scope="col">商品</th>
              <th scope="col">レンタル価格</th>
            </tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>`;
    }

    function notesList(items) {
      return `<ul class="pricing__notes">${items
        .map((t) => `<li>${escapeHtml(t)}</li>`)
        .join("")}</ul>`;
    }

    (pricing.sections || []).forEach((section, i) => {
      const details = document.createElement("details");
      details.className = "pricing__panel";
      details.open = i === 0;
      const summary = document.createElement("summary");
      summary.className = "pricing__summary";
      summary.innerHTML = `<span>${escapeHtml(section.title)}</span><span class="pricing__chevron" aria-hidden="true"></span>`;
      const body = document.createElement("div");
      body.className = "pricing__body";
      if (section.kind === "facility") {
        body.innerHTML = facilityTable(section.rows || []);
      } else if (section.kind === "rental") {
        body.innerHTML = rentalTable(section.rows || []);
      } else if (section.kind === "notes") {
        body.innerHTML = notesList(section.items || []);
      }
      details.append(summary, body);
      accordion?.appendChild(details);
    });

    // Accordion: one open panel at a time (toggle UX on mobile + desktop)
    accordion?.addEventListener("toggle", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLDetailsElement) || !t.open) return;
      accordion.querySelectorAll("details.pricing__panel").forEach((d) => {
        if (d !== t) d.open = false;
      });
    });
  }

  // In-page contact form (Pages / iframe B) — keep users on Variant B
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const tel = String(data.get("tel") || "").trim();
      const preferred = String(data.get("preferred_date") || "").trim();
      const message = String(data.get("message") || "").trim();
      const body = [
        `お名前: ${name}`,
        `メール: ${email}`,
        tel ? `電話: ${tel}` : "",
        preferred ? `希望日: ${preferred}` : "",
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");
      const mailto =
        "mailto:detekoiland.ngsk@gmail.com" +
        "?subject=" +
        encodeURIComponent("ホームページよりお問い合わせです") +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = mailto;
    });
  }

  // Optional starfield canvas (hero no longer uses it; keep for legacy markup)
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
