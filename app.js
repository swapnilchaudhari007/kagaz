(() => {
  "use strict";

  const TASKS = window.KAGAZ_TASKS;
  const I18N = window.KAGAZ_I18N;
  const $ = (s, el = document) => el.querySelector(s);
  let main = $("#main");
  const live = $("#live");

  /* ---------- storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("kagaz:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("kagaz:" + k, JSON.stringify(v)); } catch {} }
  };

  /* ---------- preferences ---------- */
  const prefs = Object.assign({ lang: "en", size: "1", contrast: false, easy: false, calm: false }, store.get("prefs", {}));
  const t = (k) => (I18N[prefs.lang] && I18N[prefs.lang][k]) || I18N.en[k] || k;
  const n = (k, c) => `${c} ${t(c === 1 ? { originals: "original", photos: "photo" }[k] || k : k)}`;
  const title = (task) => task.title[prefs.lang] || task.title.en;

  function applyPrefs() {
    const root = document.documentElement;
    root.lang = prefs.lang;
    root.style.setProperty("--scale", prefs.size);
    root.classList.toggle("contrast", prefs.contrast);
    root.classList.toggle("easy", prefs.easy);
    root.classList.toggle("calm", prefs.calm);
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    store.set("prefs", prefs);
  }

  function initPanel() {
    const btn = $("#a11yBtn"), panel = $("#a11yPanel");
    const open = (v) => { panel.hidden = !v; btn.setAttribute("aria-expanded", v); if (v) panel.querySelector("input:checked").focus(); };
    btn.addEventListener("click", () => open(panel.hidden));
    $("#a11yClose").addEventListener("click", () => { open(false); btn.focus(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
    document.addEventListener("click", (e) => { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) open(false); });

    panel.querySelectorAll("input[name=lang]").forEach((r) => { r.checked = r.value === prefs.lang; });
    panel.querySelectorAll("input[name=size]").forEach((r) => { r.checked = r.value === prefs.size; });
    $("#optContrast").checked = prefs.contrast; $("#optEasy").checked = prefs.easy; $("#optMotion").checked = prefs.calm;

    panel.addEventListener("change", (e) => {
      const el = e.target;
      if (el.name === "lang") prefs.lang = el.value;
      if (el.name === "size") prefs.size = el.value;
      if (el.id === "optContrast") prefs.contrast = el.checked;
      if (el.id === "optEasy") prefs.easy = el.checked;
      if (el.id === "optMotion") prefs.calm = el.checked;
      applyPrefs();
      if (el.name === "lang") route();
    });
  }

  /* ---------- icons ---------- */
  const ICONS = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
    car: '<path d="M4 16v-4l2-5h12l2 5v4z"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/><path d="M4 12h16"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M6 16c1-1.5 4-1.5 5 0M14 10h4M14 13h3"/>',
    rupee: '<path d="M7 4h10M7 8h10M7 4c6 0 6 8 0 8h-1l8 8"/>',
    bike: '<circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/><path d="M6 16l4-7h5l3 7M10 9l-1-3H7M15 9l1-3h2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- readiness model ---------- */
  const getChecks = (id) => store.get("checks:" + id, {});
  const setChecks = (id, v) => store.set("checks:" + id, v);

  function readiness(task, checks) {
    let need = 0, have = 0;
    task.groups.forEach((g) => {
      if (g.type === "all") g.items.forEach((i) => { need++; if (checks[i.id]) have++; });
      if (g.type === "one") { need++; if (g.items.some((i) => checks[i.id])) have++; }
    });
    return { need, have, pct: need ? Math.round((have / need) * 100) : 0, ready: need > 0 && have === need };
  }

  // Items that will actually go in the bag: every "all", chosen (or first) "one", ticked optional.
  function plan(task, checks) {
    const out = [];
    task.groups.forEach((g) => {
      if (g.type === "all") out.push(...g.items);
      if (g.type === "one") out.push(g.items.find((i) => checks[i.id]) || Object.assign({ alt: g.items }, g.items[0]));
      if (g.type === "optional") out.push(...g.items.filter((i) => checks[i.id]));
    });
    return out;
  }

  function bagCount(items) {
    return items.reduce((a, i) => {
      if (i.isThing) return a;
      if (i.isPhoto) a.photos += i.originals; else { a.originals += i.originals; a.copies += i.copies; }
      return a;
    }, { originals: 0, copies: 0, photos: 0 });
  }

  /* ---------- views ---------- */
  function viewHome() {
    const q = store.get("q", "");
    main.innerHTML = `
      <section class="hero">
        <span class="kicker">${t("heroKicker")}</span>
        <h1>${esc(t("heroTitle")).replace(/(second trip|दोबारा|पुन्हा)/, "<em>$1</em>")}</h1>
        <p>${t("heroSub")}</p>
        <div class="search">
          <label for="q">${t("searchLabel")}</label>
          ${icon("search")}
          <input id="q" type="search" autocomplete="off" placeholder="${esc(t("searchPh"))}" value="${esc(q)}" aria-describedby="resultCount">
        </div>
      </section>
      <h2 class="section-title" id="listTitle">${t("popular")} <span class="sr-only" id="resultCount"></span></h2>
      <ul class="grid" id="list" aria-labelledby="listTitle"></ul>`;
    const input = $("#q");
    const render = () => {
      const term = input.value.trim().toLowerCase();
      store.set("q", input.value);
      const hits = TASKS.filter((tk) => !term || [tk.title.en, tk.title.hi, tk.title.mr, tk.office, tk.id].join(" ").toLowerCase().includes(term));
      $("#resultCount").textContent = `${hits.length} results`;
      $("#list").innerHTML = hits.length ? hits.map((tk) => {
        const r = readiness(tk, getChecks(tk.id));
        return `<li><a class="task-card" href="#/task/${tk.id}">
          <span class="tile-icon">${icon(tk.icon)}</span>
          <span><h3>${esc(title(tk))}</h3><span class="meta">${esc(tk.office)} · ${esc(tk.time)}</span></span>
          <span class="mini-bar"><span class="track"><span class="fill" style="width:${r.pct}%"></span></span>${r.have}/${r.need} ${t("ready")}</span>
        </a></li>`;
      }).join("") : `<li class="empty">${t("noResults")}</li>`;
    };
    input.addEventListener("input", render);
    render();
  }

  function viewTask(id) {
    const task = TASKS.find((x) => x.id === id);
    if (!task) return viewHome();
    const checks = getChecks(id);
    const C = 2 * Math.PI * 36;

    main.innerHTML = `
      <a class="back" href="#/">← ${t("back")}</a>
      <div class="task-head">
        <div>
          <h1 id="taskTitle">${esc(title(task))}</h1>
          <p class="sub">${esc(task.office)}</p>
        </div>
        <div class="tools">
          <button class="btn light small" id="speak" aria-pressed="false">🔊 <span>${t("readAloud")}</span></button>
          <button class="btn light small" id="print">🖨 ${t("print")}</button>
          <button class="btn light small" id="share">↗ ${t("share")}</button>
        </div>
      </div>

      <div class="layout">
        <div class="groups">
          ${task.groups.map((g, gi) => `
            <section class="group" data-type="${g.type}" data-g="${gi}" aria-labelledby="g${gi}">
              <div class="group-head">
                <h2 id="g${gi}">${esc(g.label)}</h2>
                <span class="pill ${g.type}">${t(g.type === "all" ? "allOf" : g.type === "one" ? "oneOf" : "optional")}</span>
              </div>
              <ul class="items">
                ${g.items.map((i) => `
                  <li class="item"><label>
                    <input type="checkbox" data-id="${i.id}" data-g="${gi}" ${checks[i.id] ? "checked" : ""}>
                    <span><span class="name">${esc(i.name)}</span><span class="why">${esc(i.why)}</span></span>
                    <span class="qty">${i.isThing ? "" : i.isPhoto ? n("photos", i.originals) : (i.copies ? `${i.originals} + ${i.copies} xerox` : n("originals", i.originals))}</span>
                  </label></li>`).join("")}
              </ul>
            </section>`).join("")}
        </div>

        <aside class="side" aria-label="Readiness">
          <div class="ready-card" id="readyCard">
            <span class="stamp" aria-hidden="true">${t("readyStamp")}</span>
            <div class="ready-top">
              <svg class="ring" viewBox="0 0 84 84" role="img" aria-labelledby="ringLabel">
                <title id="ringLabel">Readiness</title>
                <circle class="bg" cx="42" cy="42" r="36"/>
                <circle class="fg" id="ringFg" cx="42" cy="42" r="36" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
                <text x="42" y="49" text-anchor="middle" id="ringTxt">0%</text>
              </svg>
              <div><div class="ready-label" id="readyLabel"></div><div class="ready-sub" id="readySub"></div></div>
            </div>
            <h2 class="sr-only">${t("carry")}</h2>
            <div class="bag" id="bag" aria-label="${t("carry")}"></div>
            <button class="btn full" id="doorBtn">🚪 ${t("doorCheck")}</button>
            <p class="hint">${t("doorCheckSub")}</p>
          </div>

          <div class="info">
            <h2>${t("goodToKnow")}</h2>
            <div class="tipbox">💡 ${esc(task.tip)}</div>
            <dl class="facts" style="margin-top:12px">
              <div><dt>${t("atOffice")}</dt><dd>${esc(task.time)}</dd></div>
              <div><dt>${t("visits")}</dt><dd>${esc(task.visits)}</dd></div>
            </dl>
          </div>

          <div class="info">
            <h2>${t("howItGoes")}</h2>
            <ol class="steps">${task.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
            <a class="portal" href="${task.portal}" target="_blank" rel="noopener">${t("officialSite")} ↗</a>
          </div>
        </aside>
      </div>
      <div class="dock" id="dock" role="region" aria-label="Readiness">
        <div class="dtxt"><span id="dockTxt"></span><small>${t("doorCheckSub")}</small></div>
        <button class="btn small" id="dockBtn">🚪 ${t("doorCheck")}</button>
      </div>`;
    main.classList.add("has-dock");

    const update = (announce) => {
      const c = getChecks(id);
      const r = readiness(task, c);
      $("#ringFg").style.strokeDashoffset = C * (1 - r.pct / 100);
      $("#ringTxt").textContent = r.pct + "%";
      $("#readyLabel").textContent = r.ready ? t("readyStamp") + " ✓" : t("notReady");
      $("#readySub").textContent = `${r.need - r.have} ${t("left")}`;
      $("#readyCard").classList.toggle("is-ready", r.ready);
      $("#dock").classList.toggle("is-ready", r.ready);
      $("#dockTxt").textContent = r.ready ? t("readyStamp") + " ✓" : `${r.have}/${r.need} ${t("ready")}`;
      const b = bagCount(plan(task, c));
      $("#bag").innerHTML = `<div><b>${b.originals}</b><span>${t("originals")}</span></div><div><b>${b.copies}</b><span>${t("copies")}</span></div><div><b>${b.photos}</b><span>${t("photos")}</span></div>`;
      task.groups.forEach((g, gi) => {
        if (g.type === "one") main.querySelector(`.group[data-g="${gi}"]`).classList.toggle("dimmed", g.items.some((i) => c[i.id]));
      });
      if (announce) live.textContent = r.ready ? `${t("readyStamp")}. ${title(task)}` : `${r.have} / ${r.need}`;
    };

    main.addEventListener("change", onCheck);
    function onCheck(e) {
      const box = e.target.closest("input[data-id]");
      if (!box) return;
      const c = getChecks(id);
      const g = task.groups[box.dataset.g];
      if (g.type === "one" && box.checked) g.items.forEach((i) => { if (i.id !== box.dataset.id) { delete c[i.id]; const o = main.querySelector(`[data-id="${i.id}"]`); if (o) o.checked = false; } });
      if (box.checked) c[box.dataset.id] = true; else delete c[box.dataset.id];
      setChecks(id, c);
      update(true);
    }
    update(false);

    $("#doorBtn").addEventListener("click", () => doorCheck(task));
    $("#dockBtn").addEventListener("click", () => doorCheck(task));
    $("#print").addEventListener("click", () => window.print());
    $("#share").addEventListener("click", async () => {
      const text = `${title(task)} — ` + plan(task, getChecks(id)).map((i) => i.name).join(", ");
      try { if (navigator.share) await navigator.share({ title: "Kagaz", text, url: location.href }); else { await navigator.clipboard.writeText(text + "\n" + location.href); live.textContent = "Copied"; $("#share").textContent = "✓ Copied"; } } catch {}
    });
    setupSpeech(task);
  }

  /* ---------- read aloud ---------- */
  function setupSpeech(task) {
    const btn = $("#speak");
    if (!("speechSynthesis" in window)) { btn.hidden = true; return; }
    btn.addEventListener("click", () => {
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
      const c = getChecks(task.id);
      const lines = [title(task) + "."];
      task.groups.forEach((g) => {
        lines.push(g.label + ".");
        g.items.forEach((i) => lines.push(i.name + (c[i.id] ? ", done." : ".")));
      });
      lines.push(task.tip);
      const u = new SpeechSynthesisUtterance(lines.join(" "));
      u.lang = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" }[prefs.lang];
      u.rate = 0.95;
      const set = (on) => { btn.setAttribute("aria-pressed", on); btn.querySelector("span").textContent = on ? t("stop") : t("readAloud"); };
      u.onstart = () => set(true); u.onend = u.onerror = () => set(false);
      speechSynthesis.speak(u);
    });
  }

  /* ---------- door check ---------- */
  function doorCheck(task) {
    const items = plan(task, getChecks(task.id));
    const result = [];
    let idx = 0;
    const opener = document.activeElement;
    const wrap = document.createElement("div");
    wrap.className = "dc";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "dcTitle");
    document.body.appendChild(wrap);
    document.body.style.overflow = "hidden";

    const close = () => { wrap.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", keys); opener && opener.focus(); };
    const keys = (e) => {
      if (e.key === "Escape") close();
      if (idx < items.length && (e.key === "ArrowRight" || e.key.toLowerCase() === "y")) answer(true);
      if (idx < items.length && (e.key === "ArrowLeft" || e.key.toLowerCase() === "n")) answer(false);
    };
    document.addEventListener("keydown", keys);

    function answer(ok) { result[idx] = ok; idx++; draw(); }

    function draw() {
      const dots = items.map((_, i) => `<i class="${i < idx ? (result[i] ? "done" : "miss") : i === idx ? "now" : ""}"></i>`).join("");
      let body, actions = "";
      if (idx < items.length) {
        const it = items[idx];
        const alt = it.alt ? `<p style="margin-top:10px"><small>or: ${it.alt.slice(1).map((a) => esc(a.name)).join(" / ")}</small></p>` : "";
        const q = it.isThing ? "" : `<div class="qtyline"><span>${n(it.isPhoto ? "photos" : "originals", it.originals)}</span>${it.copies ? `<span>${it.copies} ${t("copies")}</span>` : ""}</div>`;
        body = `<div class="dc-card" aria-live="polite"><div class="count">${idx + 1} / ${items.length}</div><h3>${esc(it.name)}</h3>${q}<p>${esc(it.why)}</p>${alt}</div>`;
        actions = `<div class="dc-actions"><button class="btn light" data-a="no">✕ ${t("dcMissing")}</button><button class="btn ok" data-a="yes">✓ ${t("dcPacked")}</button></div>`;
      } else {
        const missing = items.filter((_, i) => !result[i]);
        body = missing.length
          ? `<div class="dc-card dc-result" aria-live="assertive"><div class="big">⚠️</div><h3>${t("dcMissTitle")}</h3><p>${t("dcMissSub")}</p><ul>${missing.map((m) => `<li><b>${esc(m.name)}</b></li>`).join("")}</ul></div>`
          : `<div class="dc-card dc-result" aria-live="assertive"><div class="big">🎒</div><h3>${t("dcDoneTitle")}</h3><p>${t("dcDoneSub")}</p></div>`;
        actions = `<div class="dc-actions" style="grid-template-columns:1fr"><button class="btn ok" data-a="close">${t("dcClose")}</button></div>`;
      }
      wrap.innerHTML = `
        <div><div class="dc-top"><h2 id="dcTitle">🚪 ${t("dcTitle")} · ${esc(title(task))}</h2><button class="icon-btn" data-a="close" aria-label="Close">✕</button></div><div class="dc-dots" aria-hidden="true">${dots}</div></div>
        <div class="dc-stage">${body}</div>${actions}`;
      const primary = wrap.querySelector('[data-a="yes"]') || wrap.querySelector('.dc-actions [data-a="close"]');
      primary && primary.focus();
    }
    wrap.addEventListener("click", (e) => {
      const a = e.target.closest("[data-a]"); if (!a) return;
      if (a.dataset.a === "yes") answer(true);
      if (a.dataset.a === "no") answer(false);
      if (a.dataset.a === "close") close();
    });
    // basic focus trap
    wrap.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = [...wrap.querySelectorAll("button")]; const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    draw();
  }

  /* ---------- locker ---------- */
  const DAY = 86400000;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  function getLocker() {
    let l = store.get("locker", null);
    if (!l) {
      l = window.KAGAZ_LOCKER_DEMO.map((d) => ({ id: d.id, name: d.name, date: iso(new Date(today().getTime() + d.expiry * DAY)) }));
      store.set("locker", l);
    }
    return l;
  }

  function viewLocker() {
    main.innerHTML = `
      <section class="locker-head"><span class="kicker">Kagaz</span><h1>${t("lockerTitle")}</h1><p>${t("lockerSub")}</p></section>
      <form class="add-form" id="addForm">
        <label>${t("docName")}<input name="name" required placeholder="e.g. Car insurance"></label>
        <label>${t("expiresOn")}<input name="date" type="date" required></label>
        <button class="btn" type="submit">＋ ${t("add")}</button>
      </form>
      <ul class="timeline" id="tl" aria-label="${t("lockerTitle")}"></ul>`;
    const render = () => {
      const l = getLocker().slice().sort((a, b) => a.date.localeCompare(b.date));
      $("#tl").innerHTML = l.length ? l.map((d) => {
        const days = Math.round((new Date(d.date + "T00:00:00") - today()) / DAY);
        const cls = days < 0 ? "bad" : days <= 30 ? "warn" : "ok";
        const label = days < 0 ? t("expired") : days <= 30 ? t("soon") : t("fine");
        const nice = new Date(d.date + "T00:00:00").toLocaleDateString({ en: "en-IN", hi: "hi-IN", mr: "mr-IN" }[prefs.lang], { day: "numeric", month: "short", year: "numeric" });
        return `<li class="doc ${cls}"><span class="bar"></span>
          <div><div class="dname">${esc(d.name)}</div><div class="ddate">${nice}</div></div>
          <span class="badge">${label}</span>
          <div style="display:flex;align-items:center;gap:6px"><div class="days">${Math.abs(days)}<small>${days < 0 ? t("expired") : t("daysLeft")}</small></div>
          <button class="rm" data-rm="${d.id}" aria-label="${t("remove")} ${esc(d.name)}">✕</button></div></li>`;
      }).join("") : `<li class="empty">${t("lockerEmpty")}</li>`;
    };
    $("#addForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const l = getLocker(); l.push({ id: "u" + Date.now(), name: f.get("name").trim(), date: f.get("date") });
      store.set("locker", l); e.target.reset(); render(); live.textContent = "Added";
    });
    $("#tl").addEventListener("click", (e) => {
      const b = e.target.closest("[data-rm]"); if (!b) return;
      store.set("locker", getLocker().filter((d) => d.id !== b.dataset.rm)); render(); live.textContent = "Removed";
    });
    render();
  }

  /* ---------- router ---------- */
  function route() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    const fresh = main.cloneNode(false); // fresh node drops old listeners
    main.replaceWith(fresh); main = fresh;
    const [page, id] = location.hash.replace(/^#\/?/, "").split("/");
    document.querySelectorAll("[data-nav]").forEach((a) => a.removeAttribute("aria-current"));
    if (page === "task") viewTask(id);
    else if (page === "locker") { viewLocker(); $('[data-nav="locker"]').setAttribute("aria-current", "page"); }
    else { viewHome(); $('[data-nav="home"]').setAttribute("aria-current", "page"); }
    const tk = TASKS.find((x) => x.id === id);
    document.title = page === "task" && tk ? `${title(tk)} · Kagaz` : page === "locker" ? `${t("lockerTitle")} · Kagaz` : "Kagaz — never make a second trip";
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", () => { route(); main.focus({ preventScroll: true }); });
  applyPrefs();
  initPanel();
  route();
})();
