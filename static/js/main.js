/* HeadLight project page: charts, tabs, rollout browser.
   All numbers are taken from the paper (Tables 1, 2, 3, 8 and Figs. 6, 8). */
(function () {
  "use strict";

  const C = {
    base: "var(--c-base)", ft: "var(--c-ft)", lora: "var(--c-lora)", hl: "var(--c-hl)",
    rand: "var(--c-rand)", nih: "var(--nih)", mot: "var(--mot)", ink: "#4b5165",
  };

  /* ------------------------------------------------------------------ data */
  const TASKS = ["Place object on scale", "Stamp seal", "Move stapler to pad",
                 "Place bread in basket", "Place empty cup", "Stack blocks three"];

  // Table 1: [mean, std] per task, then average
  const SIM = {
    zero: {
      label: "Zero-WAM",
      rows: [
        { key: "base", name: "Zero-WAM", vals: [[24.67,2.05],[47.00,4.55],[69.14,2.93],[35.00,3.74],[84.87,0.18],[9.00,2.16]], avg: [44.95,0.79] },
        { key: "ft",   name: "+ Full FT", vals: [[43.33,1.25],[73.33,6.65],[85.33,0.47],[42.67,2.87],[91.33,2.05],[11.33,3.09]], avg: [57.89,0.77] },
        { key: "lora", name: "+ LoRA",    vals: [[47.33,5.79],[70.33,3.30],[83.00,2.94],[48.33,2.62],[96.00,0.82],[7.00,2.16]],  avg: [58.66,1.87] },
        { key: "hl",   name: "+ HeadLight", vals: [[54.00,5.72],[73.33,3.40],[89.00,1.41],[52.67,4.03],[97.00,1.63],[7.67,1.70]], avg: [62.28,2.30] },
      ],
    },
    lingbot: {
      label: "LingBot-VA",
      rows: [
        { key: "base", name: "LingBot-VA", vals: [[6.17,4.87],[3.67,2.49],[23.33,8.22],[17.33,6.18],[42.33,7.85],[0,0]], avg: [15.47,1.30] },
        { key: "ft",   name: "+ Full FT",  vals: [[22.33,3.77],[21.67,2.87],[61.00,4.24],[34.67,4.92],[56.00,4.32],[0,0]], avg: [32.61,3.04] },
        { key: "lora", name: "+ LoRA",     vals: [[20.67,3.09],[21.33,2.49],[64.00,2.94],[37.33,1.25],[61.33,4.50],[0,0]], avg: [34.11,1.31] },
        { key: "hl",   name: "+ HeadLight", vals: [[23.00,7.07],[25.67,2.36],[65.67,4.50],[49.33,2.62],[65.33,0.47],[0,0]], avg: [38.17,1.11] },
      ],
    },
  };
  const METHOD_LABEL = { base: "Unadapted", ft: "Full FT", lora: "LoRA", hl: "HeadLight" };

  // Fig. 6 / Table 3
  const ABLATION = [
    { name: "No ablation", v: 57.89, sd: 0.77, fill: C.ink },
    { name: "w/o 24 random heads", v: 53.89, sd: 1.65, fill: C.rand, divider: true },
    { name: "w/o 24 Next-Interaction", v: 40.61, sd: 0.28, fill: C.nih, hl: true },
    { name: "w/o 48 random heads", v: 47.39, sd: 1.29, fill: C.rand, divider: true },
    { name: "w/o 48 Motion Heads", v: 0.94, sd: 0.21, fill: C.mot, hl: true },
  ];

  // Table 2
  const PATHWAYS = [
    { name: "Unadapted", v: 44.95, sd: 0.79, fill: C.base },
    { name: "Full FT", sub: "10.0B params", v: 57.89, sd: 0.77, fill: C.ft },
    { name: "Next-Interaction only", sub: "37.8M", v: 56.17, sd: 0.14, fill: C.nih, divider: true },
    { name: "random-head control", sub: "37.8M", v: 52.22, sd: 0.44, fill: C.rand },
    { name: "Motion only", sub: "75.5M", v: 56.11, sd: 1.36, fill: C.mot },
    { name: "random-head control", sub: "75.5M", v: 54.33, sd: 1.65, fill: C.rand },
    { name: "Both, random heads", sub: "113.3M", v: 57.33, sd: 1.89, fill: C.rand, divider: true },
    { name: "Both (HeadLight)", sub: "113.3M", v: 62.28, sd: 2.30, fill: C.hl, hl: true },
  ];

  // Fig. 8 / Table 8
  const REAL_AVG = {
    seen:   { zero: { ft: 80.00, lora: 77.50, hl: 87.50 }, lingbot: { ft: 73.75, lora: 71.25, hl: 83.75 } },
    unseen: { zero: { ft: 48.75, lora: 60.00, hl: 68.75 }, lingbot: { ft: 50.00, lora: 61.25, hl: 72.50 } },
  };
  const REAL_TASKS = [
    { id: "strawberry_plate", name: "Strawberry plate", split: "seen",
      instr: "pick up the strawberry plush and put it on the blue plate",
      zero: [18, 17, 19], lingbot: [18, 17, 20] },
    { id: "red_cube_plate", name: "Red cube on plate", split: "seen",
      instr: "put the red cube on the blue plate",
      zero: [17, 17, 20], lingbot: [16, 15, 19] },
    { id: "two_plushies", name: "Two plushies", split: "seen",
      instr: "take the lemon plush out of the bowl and put it on the table, then put the strawberry plush in the bowl",
      zero: [16, 15, 15], lingbot: [11, 10, 13] },
    { id: "cube_drawer", name: "Cube drawer", split: "seen",
      instr: "take the red cube out of the drawer, put it on the table, and close the drawer",
      zero: [13, 13, 16], lingbot: [14, 15, 15] },
    { id: "swap_plushies", name: "Swap plushies", split: "unseen",
      instr: "take the strawberry plush out of the bowl and put it on the table, then put the lemon plush in the bowl",
      zero: [7, 8, 10], lingbot: [10, 11, 14] },
    { id: "lemon_plate", name: "Lemon plate", split: "unseen",
      instr: "put the lemon plush on the blue plate",
      zero: [13, 15, 18], lingbot: [11, 14, 17] },
    { id: "lemon_drawer", name: "Lemon drawer", split: "unseen",
      instr: "take the lemon plush out of the drawer, put it on the table, and close the drawer",
      zero: [10, 13, 13], lingbot: [9, 11, 14] },
    { id: "strawberry_drawer", name: "Strawberry drawer", split: "unseen",
      instr: "take the strawberry plush out of the drawer, put it on the table, and close the drawer",
      zero: [9, 12, 14], lingbot: [10, 13, 13] },
  ];

  /* --------------------------------------------------------------- helpers */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (v) => String(+v.toFixed(2));
  const f2 = (v) => v.toFixed(2);

  // Animate any [data-w]/[data-h] element once its chart scrolls into view.
  const reveal = (root) => {
    const run = () => {
      $$("[data-w]", root).forEach((el) => (el.style.width = el.dataset.w));
      $$("[data-left]", root).forEach((el) => (el.style.left = el.dataset.left));
      $$("[data-h]", root).forEach((el) => (el.style.height = el.dataset.h));
    };
    if (!("IntersectionObserver" in window)) return run();
    // Already visible once (e.g. re-render after a toggle): animate on the next frame.
    if (root.dataset.seen) return requestAnimationFrame(() => requestAnimationFrame(run));
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { root.dataset.seen = "1"; run(); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(root);
  };

  /* --------------------------------------------------- horizontal bar chart */
  function hbars(el, rows, max) {
    const ticks = [];
    const step = max <= 70 ? 10 : 20;
    for (let t = 0; t <= max; t += step) ticks.push(t);
    el.style.setProperty("--gstep", `${(step / max) * 100}%`);
    el.innerHTML = rows.map((r) => {
      const pct = (r.v / max) * 100;
      const lo = Math.max(0, r.v - (r.sd || 0)) / max * 100;
      const hi = Math.min(max, r.v + (r.sd || 0)) / max * 100;
      const tip = `<b>${r.name}</b>${r.sub ? ` · ${r.sub}` : ""}<br>${f2(r.v)}%${r.sd ? ` ± ${f2(r.sd)}` : ""} success`;
      return `
        <div class="hbar${r.hl ? " is-hl" : ""}${r.divider ? " divider" : ""}">
          <div class="hbar-label">${r.name}${r.sub ? `<small>${r.sub}</small>` : ""}</div>
          <div class="hbar-track" tabindex="0" data-tip="${tip.replace(/"/g, "&quot;")}" aria-label="${r.name}: ${f2(r.v)} percent">
            <div class="hbar-fill" style="--fill:${r.fill}" data-w="${pct}%"></div>
            ${r.sd ? `<div class="hbar-err" style="left:${lo}%;width:${hi - lo}%"></div>` : ""}
            <div class="hbar-val" style="left:0" data-left="calc(${hi}% + 8px)">${fmt(r.v)}</div>
          </div>
        </div>`;
    }).join("") + `
      <div class="axis"><div></div><div class="axis-ticks">${ticks.map((t) => `<span style="left:${(t / max) * 100}%">${t}</span>`).join("")}</div></div>`;
    reveal(el);
  }

  /* ------------------------------------------------------ results: Table 1 */
  function renderSim(key) {
    const d = SIM[key];
    hbars($("#avg-chart"), d.rows.map((r) => ({
      name: r.key === "base" ? "Unadapted" : METHOD_LABEL[r.key],
      sub: r.key === "base" ? d.label : "",
      v: r.avg[0], sd: r.avg[1], fill: C[r.key], hl: r.key === "hl",
    })), 70);

    // best per column (ties bolded)
    const cols = TASKS.length + 1;
    const colVals = (i) => d.rows.map((r) => (i < TASKS.length ? r.vals[i][0] : r.avg[0]));
    const best = Array.from({ length: cols }, (_, i) => Math.max(...colVals(i)));
    const cell = (m, s, i) => {
      const txt = `${f2(m)}<span class="pm">±${f2(s)}</span>`;
      return `<td>${m === best[i] && m > 0 ? `<b>${txt}</b>` : txt}</td>`;
    };
    $("#task-table").innerHTML = `
      <thead><tr><th>Method</th>${TASKS.map((t) => `<th>${t.replace(/ (\S+ \S+)$/, "<br>$1")}</th>`).join("")}<th>Average</th></tr></thead>
      <tbody>${d.rows.map((r) => `
        <tr class="${r.key === "hl" ? "is-hl" : ""}">
          <td>${r.name}</td>
          ${r.vals.map((v, i) => cell(v[0], v[1], i)).join("")}
          ${cell(r.avg[0], r.avg[1], TASKS.length)}
        </tr>`).join("")}
      </tbody>`;
  }

  $$("[data-backbone-toggle] button").forEach((b) => {
    b.addEventListener("click", () => {
      $$("[data-backbone-toggle] button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      renderSim(b.dataset.backbone);
    });
  });

  /* ------------------------------------------------ real-robot grouped bars */
  function renderReal() {
    const el = $("#real-chart");
    const grid = [0, 25, 50, 75, 100];
    el.innerHTML = ["seen", "unseen"].map((split) => `
      <div class="vpanel">
        <h4>${split === "seen" ? "Seen tasks" : "Unseen tasks"}</h4>
        <div class="vchart">
          <div class="vaxis">${grid.map((g) => `<span style="bottom:${g}%">${g}</span>`).join("")}</div>
          <div class="vplot">
            ${grid.slice(1).map((g) => `<div class="gl" style="bottom:${g}%"></div>`).join("")}
            ${["zero", "lingbot"].map((bb) => `
              <div class="vgroup">
                ${["ft", "lora", "hl"].map((m) => {
                  const v = REAL_AVG[split][bb][m];
                  const tip = `<b>${METHOD_LABEL[m]}</b> · ${SIM[bb].label}<br>${f2(v)}% avg. success (${split})`;
                  return `<div class="vbar" tabindex="0" style="--fill:${C[m]}" data-h="${v}%" data-tip="${tip.replace(/"/g, "&quot;")}" aria-label="${METHOD_LABEL[m]}, ${SIM[bb].label}, ${split}: ${v} percent"><span>${fmt(v)}</span></div>`;
                }).join("")}
              </div>`).join("")}
          </div>
        </div>
        <div class="vlabels"><span></span><div><span>Zero-WAM</span><span>LingBot-VA</span></div></div>
      </div>`).join("");
    reveal(el);
  }

  /* ------------------------------------------------------- rollout browser */
  function renderBrowser() {
    const root = $("#rollout-browser");
    if (!root) return;
    ["seen", "unseen"].forEach((split) => {
      $(`.chips[data-split="${split}"]`, root).innerHTML = REAL_TASKS
        .filter((t) => t.split === split)
        .map((t) => `<button class="chip" type="button" aria-pressed="false" data-task="${t.id}">${t.name}</button>`)
        .join("");
    });

    const show = (id) => {
      const t = REAL_TASKS.find((x) => x.id === id);
      $$(".chip", root).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.task === id)));
      $("#rb-instruction").textContent = t.instr;
      $("#rb-frames").innerHTML = [1, 2, 3, 4, 5]
        .map((k) => `<img src="static/images/rollouts/${t.id}/${k}.jpg" alt="${t.name}, keyframe ${k} of 5" loading="lazy">`)
        .join("");
      $("#rb-counts").innerHTML = ["zero", "lingbot"].map((bb) => `
        <div class="count-block">
          <h4>${SIM[bb].label} · successes out of 20</h4>
          ${["ft", "lora", "hl"].map((m, i) => {
            const n = t[bb][i];
            return `<div class="count-row${m === "hl" ? " is-hl" : ""}">
              <span class="name">${METHOD_LABEL[m]}</span>
              <span class="dots" style="--fill:${C[m]}" aria-hidden="true">${Array.from({ length: 20 }, (_, j) => `<i class="${j < n ? "on" : ""}"></i>`).join("")}</span>
              <span class="num">${n}/20</span>
            </div>`;
          }).join("")}
        </div>`).join("");
    };

    root.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) show(chip.dataset.task);
    });
    show(REAL_TASKS[4].id); // open on an unseen task
  }

  /* ------------------------------------------------------------------ tabs */
  $$("[data-tabs]").forEach((tabs) => {
    const btns = $$('[role="tab"]', tabs);
    const select = (b) => {
      btns.forEach((x) => {
        const on = x === b;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => select(b));
      b.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
        select(n); n.focus();
      });
    });
  });

  /* --------------------------------------------------------------- tooltip */
  const tip = $("#tooltip");
  const place = (x, y) => {
    const r = tip.getBoundingClientRect();
    let left = x + 14, top = y - r.height - 12;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (top < 8) top = y + 18;
    tip.style.left = left + "px"; tip.style.top = top + "px";
  };
  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest("[data-tip]");
    if (!t) return;
    tip.innerHTML = t.dataset.tip; tip.hidden = false;
  });
  document.addEventListener("mousemove", (e) => { if (!tip.hidden) place(e.clientX, e.clientY); });
  document.addEventListener("mouseout", (e) => {
    const t = e.target.closest("[data-tip]");
    if (t && !t.contains(e.relatedTarget)) tip.hidden = true;
  });
  document.addEventListener("focusin", (e) => {
    const t = e.target.closest("[data-tip]");
    if (!t) return;
    tip.innerHTML = t.dataset.tip; tip.hidden = false;
    const r = t.getBoundingClientRect();
    place(r.left + r.width / 2, r.top);
  });
  document.addEventListener("focusout", () => (tip.hidden = true));
  window.addEventListener("scroll", () => (tip.hidden = true), { passive: true });

  /* ------------------------------------------------------- copy BibTeX */
  $$("[data-copy]").forEach((b) => {
    b.addEventListener("click", async () => {
      const text = $(b.dataset.copy).textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove();
      }
      b.textContent = "Copied!";
      setTimeout(() => (b.textContent = "Copy"), 1600);
    });
  });

  /* ---------------------------------------------------- active nav link */
  const links = $$(".nav-links a");
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------------------------------------------------------------- init */
  renderSim("zero");
  hbars($("#ablation-chart"), ABLATION, 70);
  hbars($("#pathway-chart"), PATHWAYS, 70);
  renderReal();
  renderBrowser();

  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }],
      throwOnError: false,
    });
  }
})();
