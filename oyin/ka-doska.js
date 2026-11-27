/*!
 * Kuvonch Academy — «Doska» (yozuv rejimi) suzuvchi tugmasi.
 * Test yoki viktorina boshlanganda chiqadi: sahifa xuddi PDF kabi bo'lib qoladi, ustiga qalam bilan
 * tushuntirish va yechish mumkin. 💾 Saqlash — rasm avtomatik Google Drive'ga yuboriladi
 * («Kuvonch Academy — Uyga vazifalar (fayllar)» / «Doska yechimlari» / test nomi / ism).
 * Sahifalar chaqiradi:  kaDoska.on("Test nomi")  ·  kaDoska.off()
 */
(function () {
  "use strict";
  if (window.kaDoska) return;

  // Uyga vazifa Apps Script xizmati (quvonchmash12 Drive'i) — «yukla» amali faylni Drive'ga yozadi
  var API = "https://script.google.com/macros/s/AKfycbxOc3jY8XqfQNxLmF5lf5_JYc4UFIcxcsQBU-MKPfkOaPxB6WwDhhti7Vd0OZWhVnq5Sg/exec";
  var H2C = "vendor/html2canvas-pro-2.5.0.min.js"; // zamonaviy CSS ranglarini ham tushunadi
  var COLORS = ["#111111", "#1565c0", "#d32f2f", "#2e7d32", "#ef6c00", "#ffffff"];
  var SIZES = [2, 4, 8];
  var BGS = [["shaffof", "🔍 Sahifa"], ["oq", "⬜ Oq"], ["katak", "▦ Katak"], ["chiziq", "☰ Chiziq"]];

  var active = false, title = "Test", fab = null, root = null, cv = null, ctx = null, dpr = 1;
  var tool = "pen", color = COLORS[1], size = 4, pass = false;
  var pages = [], pi = 0, cur = null;

  function newPage(bg) { return { bg: bg || "shaffof", strokes: [], redo: [], snap: null, snapP: null, saved: true }; }
  function P() { return pages[pi]; }

  /* ---------- CSS ---------- */
  var css =
    "#kd-fab{position:fixed;left:12px;top:46%;z-index:2147483000;width:56px;height:56px;border-radius:50%;border:2px solid #fff;" +
    "background:linear-gradient(135deg,#ffb300,#ff6d00);color:#fff;font-size:26px;line-height:1;cursor:grab;box-shadow:0 8px 22px rgba(0,0,0,.4);" +
    "touch-action:none;-webkit-tap-highlight-color:transparent;display:flex;align-items:center;justify-content:center;padding:0;animation:kdPop .35s}" +
    "#kd-fab[hidden],#kd-root[hidden]{display:none!important}#kd-fab small{position:absolute;bottom:-17px;left:50%;transform:translateX(-50%);font:700 11px/1 system-ui,sans-serif;color:#fff;background:#ff6d00;padding:2px 6px;border-radius:8px;white-space:nowrap}" +
    "@keyframes kdPop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}" +
    "#kd-root{position:fixed;inset:0;z-index:2147483001;font:600 14px/1.2 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    "#kd-root canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair}" +
    "#kd-root.pass canvas{pointer-events:none}#kd-root.pass{pointer-events:none}#kd-root.pass .kd-bar{pointer-events:auto}" +
    "#kd-root .kd-bg{position:absolute;inset:0;pointer-events:none}" +
    ".kd-bg.oq{background:#fff}.kd-bg.katak{background:#fff;background-image:linear-gradient(#cfd8e3 1px,transparent 1px),linear-gradient(90deg,#cfd8e3 1px,transparent 1px);background-size:26px 26px}" +
    ".kd-bg.chiziq{background:#fff;background-image:linear-gradient(transparent 31px,#b9c7e6 32px);background-size:100% 32px}" +
    ".kd-bg.shaffof{background:rgba(255,255,255,0)}" +
    "#kd-root .kd-edge{position:absolute;inset:0;border:3px solid #ff6d00;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.6)}" +
    ".kd-bar{position:absolute;left:0;right:0;margin:0 auto;width:max-content;top:8px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;justify-content:center;" +
    "max-width:calc(100vw - 16px);background:rgba(20,26,42,.94);border:1px solid #3b4a6b;border-radius:16px;padding:6px 8px;box-shadow:0 10px 28px rgba(0,0,0,.45);color:#eef2ff;user-select:none;-webkit-user-select:none}" +
    ".kd-bar.bot{top:auto;bottom:calc(8px + env(safe-area-inset-bottom,0px))}" +
    ".kd-bar button{white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:3px;width:auto;flex:0 0 auto;box-sizing:border-box;min-width:36px;height:36px;border:1px solid transparent;border-radius:10px;background:#26314d;color:#eef2ff;font:inherit;font-size:17px;cursor:pointer;padding:0 7px}" +
    ".kd-bar button.on{border-color:#ffb300;background:#3a3420;box-shadow:0 0 0 1px #ffb300}" +
    ".kd-bar button:disabled{opacity:.35}" +
    ".kd-bar .kd-sep{width:1px;height:26px;background:#3b4a6b;margin:0 2px}" +
    ".kd-bar .kd-c{width:26px;min-width:26px;height:26px;border-radius:50%;border:2px solid #556;padding:0}" +
    ".kd-bar .kd-c.on{border-color:#ffb300;box-shadow:0 0 0 2px #ffb300}" +
    ".kd-bar .kd-s{font-size:13px}.kd-bar .kd-pg{font-size:13px;min-width:44px;text-align:center}" +
    ".kd-bar .kd-save{background:#1f7a46}.kd-bar .kd-x{background:#8e2430}" +
    ".kd-bar select{height:36px;border-radius:10px;background:#26314d;color:#eef2ff;border:0;font:inherit;padding:0 6px}" +
    ".kdz-msg{position:absolute;left:50%;top:auto;right:auto;width:auto;height:auto;min-height:0;bottom:calc(64px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);font:700 14px/1.3 system-ui,sans-serif;box-sizing:border-box;background:#0e1628;color:#fff;border:1px solid #7c9bff;" +
    "padding:9px 14px;border-radius:12px;font-weight:700;max-width:90vw;text-align:center;pointer-events:none;transition:opacity .4s}" +
    "@media (max-width:560px){.kd-bar button{min-width:32px;height:32px;font-size:15px;padding:0 5px}.kd-bar .kd-c{width:22px;min-width:22px;height:22px}.kd-bar .kd-hide-m{display:none}}" +
    "@media print{#kd-fab,#kd-root{display:none!important}}";

  function addCss() {
    if (document.getElementById("kd-css")) return;
    var s = document.createElement("style"); s.id = "kd-css"; s.textContent = css; document.head.appendChild(s);
  }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ---------- Suzuvchi tugma ---------- */
  function showFab() {
    addCss();
    if (fab) { fab.hidden = false; return; }
    fab = el("button", { id: "kd-fab", type: "button", title: "Doska: sahifa ustiga yozib tushuntirish", "aria-label": "Doska rejimi" }, "✏️<small>Doska</small>");
    try { var pos = JSON.parse(localStorage.getItem("ka.doska.fab") || "null"); if (pos) { fab.style.left = pos.x + "px"; fab.style.top = pos.y + "px"; } } catch (e) {}
    var sx, sy, ox, oy, moved = false, down = false;
    fab.addEventListener("pointerdown", function (e) {
      down = true; moved = false; sx = e.clientX; sy = e.clientY;
      var r = fab.getBoundingClientRect(); ox = r.left; oy = r.top;
      try { fab.setPointerCapture(e.pointerId); } catch (er) {}
    });
    fab.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 8) return;
      moved = true;
      var x = Math.max(4, Math.min(innerWidth - 60, ox + dx)), y = Math.max(4, Math.min(innerHeight - 76, oy + dy));
      fab.style.left = x + "px"; fab.style.top = y + "px";
    });
    fab.addEventListener("pointerup", function () {
      if (!down) return; down = false;
      if (moved) { try { localStorage.setItem("ka.doska.fab", JSON.stringify({ x: parseInt(fab.style.left, 10), y: parseInt(fab.style.top, 10) })); } catch (e) {} return; }
      openBoard();
    });
    document.body.appendChild(fab);
  }
  function hideFab() { if (fab) fab.hidden = true; }

  /* ---------- Doska ---------- */
  function openBoard() {
    addCss();
    if (fab) fab.hidden = true;
    if (!pages.length) pages = [newPage("shaffof")];
    if (root) { root.hidden = false; setPass(false); fit(); return; }
    root = el("div", { id: "kd-root" });
    root.innerHTML =
      '<div class="kd-bg"></div><canvas></canvas><div class="kd-edge"></div>' +
      '<div class="kd-bar">' +
      '<button data-t="pen" title="Qalam">✏️</button><button data-t="marker" title="Marker (yarim shaffof)">🖍️</button><button data-t="line" title="To\'g\'ri chiziq">📏</button><button data-t="eraser" title="O\'chirg\'ich">🧽</button>' +
      '<span class="kd-sep"></span>' +
      COLORS.map(function (c) { return '<button class="kd-c" data-c="' + c + '" style="background:' + c + '" title="Rang"></button>'; }).join("") +
      '<span class="kd-sep"></span>' +
      SIZES.map(function (s, i) { return '<button class="kd-s" data-s="' + s + '" title="Qalinlik">' + ["•", "●", "⬤"][i] + "</button>"; }).join("") +
      '<span class="kd-sep"></span>' +
      '<button data-a="undo" title="Orqaga">↶</button><button data-a="redo" title="Qaytarish">↷</button><button data-a="clear" title="Varaqni tozalash">🗑️</button>' +
      "</div>" +
      '<div class="kd-bar bot">' +
      '<select data-a="bg" title="Fon">' + BGS.map(function (b) { return '<option value="' + b[0] + '">' + b[1] + "</option>"; }).join("") + "</select>" +
      '<button data-a="prev" title="Oldingi varaq">◀</button><span class="kd-pg"></span><button data-a="next" title="Keyingi varaq">▶</button><button data-a="add" title="Yangi varaq">➕</button>' +
      '<span class="kd-sep"></span>' +
      '<button data-a="pass" title="Sahifani bosish (javob belgilash) — yozuvlar o\'chmaydi">👆<span class="kd-hide-m"> Sahifa</span></button>' +
      '<button data-a="save" class="kd-save" title="Drive\'ga saqlash">💾<span class="kd-hide-m"> Saqlash</span></button>' +
      '<button data-a="close" class="kd-x" title="Yopish">✕<span class="kd-hide-m"> Yopish</span></button>' +
      "</div>";
    document.body.appendChild(root);
    cv = root.querySelector("canvas"); ctx = cv.getContext("2d");

    root.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { tool = b.dataset.t; paintUi(); }; });
    root.querySelectorAll("[data-c]").forEach(function (b) { b.onclick = function () { color = b.dataset.c; if (tool === "eraser") tool = "pen"; paintUi(); }; });
    root.querySelectorAll("[data-s]").forEach(function (b) { b.onclick = function () { size = +b.dataset.s; paintUi(); }; });
    act("undo", function () { var p = P(); if (p.strokes.length) { p.redo.push(p.strokes.pop()); p.saved = false; redraw(); } });
    act("redo", function () { var p = P(); if (p.redo.length) { p.strokes.push(p.redo.pop()); p.saved = false; redraw(); } });
    act("clear", function () { var p = P(); if (p.strokes.length && confirm("Shu varaqdagi yozuvlar o'chirilsinmi?")) { p.strokes = []; p.redo = []; p.snap = null; p.snapP = null; p.saved = true; redraw(); } });
    act("prev", function () { if (pi > 0) { pi--; redraw(); } });
    act("next", function () { if (pi < pages.length - 1) { pi++; redraw(); } });
    act("add", function () { pages.push(newPage(P().bg === "shaffof" ? "katak" : P().bg)); pi = pages.length - 1; redraw(); });
    act("pass", function () { setPass(!pass); });
    act("save", function () { saveAll(false); });
    act("close", closeBoard);
    root.querySelector('[data-a="bg"]').onchange = function () { P().bg = this.value; P().saved = false; redraw(); };

    bindDraw();
    addEventListener("resize", fit);
    fit();
    loadH2C();
  }
  function act(a, fn) { var b = root.querySelector('[data-a="' + a + '"]'); if (b) b.onclick = fn; }
  function setPass(v) { pass = v; root.classList.toggle("pass", v); paintUi(); toast(v ? "👆 Endi sahifani bosishingiz mumkin. Yozish uchun ✏️ ni bosing" : ""); }

  function paintUi() {
    if (!root) return;
    root.querySelectorAll("[data-t]").forEach(function (b) { b.classList.toggle("on", !pass && b.dataset.t === tool); b.onclick = function () { tool = b.dataset.t; if (pass) setPass(false); else paintUi(); }; });
    root.querySelectorAll("[data-c]").forEach(function (b) { b.classList.toggle("on", b.dataset.c === color && tool !== "eraser"); });
    root.querySelectorAll("[data-s]").forEach(function (b) { b.classList.toggle("on", +b.dataset.s === size); });
    var p = P();
    root.querySelector('[data-a="pass"]').classList.toggle("on", pass);
    root.querySelector('[data-a="undo"]').disabled = !p.strokes.length;
    root.querySelector('[data-a="redo"]').disabled = !p.redo.length;
    root.querySelector('[data-a="prev"]').disabled = pi === 0;
    root.querySelector('[data-a="next"]').disabled = pi >= pages.length - 1;
    root.querySelector(".kd-pg").textContent = (pi + 1) + "/" + pages.length;
    root.querySelector('[data-a="bg"]').value = p.bg;
    root.querySelector(".kd-bg").className = "kd-bg " + p.bg;
  }

  function fit() {
    if (!cv) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    redraw();
  }

  /* ---------- Chizish ---------- */
  function bindDraw() {
    var drawing = false, pid = null;
    cv.addEventListener("pointerdown", function (e) {
      if (pass) return;
      if (drawing) return; // ikkinchi barmoq — e'tiborsiz
      drawing = true; pid = e.pointerId;
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      var w = tool === "eraser" ? size * 5 : tool === "marker" ? size * 4 : size;
      cur = { t: tool, c: color, w: w, pts: [[e.clientX, e.clientY, pr(e)]] };
      if (tool === "line") cur.pts.push([e.clientX, e.clientY, 0.5]);
      e.preventDefault();
      wantSnap();
    });
    cv.addEventListener("pointermove", function (e) {
      if (!drawing || e.pointerId !== pid || !cur) return;
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      if (cur.t === "line") cur.pts[1] = [e.clientX, e.clientY, 0.5];
      else for (var i = 0; i < evs.length; i++) cur.pts.push([evs[i].clientX, evs[i].clientY, pr(evs[i])]);
      redraw();
      e.preventDefault();
    });
    function end(e) {
      if (!drawing || (e && e.pointerId !== pid)) return;
      drawing = false;
      if (cur) { var p = P(); p.strokes.push(cur); p.redo = []; p.saved = false; cur = null; redraw(); }
    }
    cv.addEventListener("pointerup", end);
    cv.addEventListener("pointercancel", end);
  }
  function pr(e) { return e.pointerType === "pen" && e.pressure > 0 ? e.pressure : 0.5; }

  function drawStroke(g, s, k) {
    var pts = s.pts; if (!pts.length) return;
    g.save();
    g.lineCap = "round"; g.lineJoin = "round";
    if (s.t === "eraser") { g.globalCompositeOperation = "destination-out"; g.strokeStyle = "#000"; }
    else { g.strokeStyle = s.c; if (s.t === "marker") g.globalAlpha = 0.35; }
    if (pts.length === 1) {
      g.fillStyle = s.t === "eraser" ? "#000" : s.c;
      g.beginPath(); g.arc(pts[0][0] * k, pts[0][1] * k, s.w * k / 2, 0, 7); g.fill();
    } else if (s.t === "marker" || s.t === "eraser" || s.t === "line") {
      g.lineWidth = s.w * k;
      g.beginPath(); g.moveTo(pts[0][0] * k, pts[0][1] * k);
      for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0] * k, pts[i][1] * k);
      g.stroke();
    } else {
      // qalam: bosimga qarab qalinlik, silliq egri chiziq
      for (var j = 1; j < pts.length; j++) {
        var a = pts[j - 1], b = pts[j], c = pts[j + 1];
        var sx = j === 1 ? a[0] : (a[0] + b[0]) / 2, sy = j === 1 ? a[1] : (a[1] + b[1]) / 2;
        g.lineWidth = s.w * k * (0.6 + b[2] * 0.8);
        g.beginPath(); g.moveTo(sx * k, sy * k);
        if (c) g.quadraticCurveTo(b[0] * k, b[1] * k, (b[0] + c[0]) / 2 * k, (b[1] + c[1]) / 2 * k);
        else g.lineTo(b[0] * k, b[1] * k);
        g.stroke();
      }
    }
    g.restore();
  }
  function paintStrokes(g, page, k, extra) {
    page.strokes.forEach(function (s) { drawStroke(g, s, k); });
    if (extra) drawStroke(g, extra, k);
  }
  function redraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    paintStrokes(ctx, P(), dpr, cur);
    paintUi();
  }

  /* ---------- Sahifa surati (PDF kabi) ---------- */
  var h2cP = null;
  function h2cFn() { var f = window.html2canvas; return typeof f === "function" ? f : f && (f.default || f.html2canvas); }
  function loadH2C() {
    if (h2cFn()) return Promise.resolve(h2cFn());
    if (!h2cP) {
      h2cP = new Promise(function (ok, no) {
        var s = document.createElement("script"); s.src = H2C; s.async = true;
        s.onload = function () { h2cFn() ? ok(h2cFn()) : no(new Error("html2canvas")); };
        s.onerror = function () { h2cP = null; no(new Error("html2canvas")); };
        document.head.appendChild(s);
      });
    }
    return h2cP;
  }
  // Shaffof varaqqa birinchi marta yozilganda — tagidagi savolni suratga olib qo'yamiz
  function wantSnap() {
    var p = P();
    if (p.bg !== "shaffof" || p.snap || p.snapP) return;
    p.snapP = shot().then(function (c) { p.snap = c; return c; }, function () { return null; });
  }
  function shot() {
    return loadH2C().then(function (h2c) {
      return h2c(document.body, {
        x: window.scrollX, y: window.scrollY, width: innerWidth, height: innerHeight,
        windowWidth: document.documentElement.clientWidth, windowHeight: innerHeight,
        scale: 1, useCORS: true, logging: false, backgroundColor: getBg(),
        ignoreElements: function (n) { return n.id === "kd-root" || n.id === "kd-fab"; },
        // nusxada animatsiyalar boshidan boshlanib qolmasin — elementlar joyida tursin
        onclone: function (d) { var st = d.createElement("style"); st.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}"; d.head.appendChild(st); }
      });
    });
  }
  function getBg() {
    var c = getComputedStyle(document.body).backgroundColor;
    return !c || c === "rgba(0, 0, 0, 0)" || c === "transparent" ? "#ffffff" : c;
  }

  function compose(page) {
    var W = innerWidth, Hh = innerHeight, k = 1.5;
    var out = document.createElement("canvas"); out.width = Math.round(W * k); out.height = Math.round(Hh * k);
    var g = out.getContext("2d");
    var wait = page.bg === "shaffof" ? (page.snap ? Promise.resolve(page.snap) : page.snapP || shot().catch(function () { return null; })) : Promise.resolve(null);
    return Promise.resolve(wait).then(function (snap) {
      g.fillStyle = "#ffffff"; g.fillRect(0, 0, out.width, out.height);
      if (snap) g.drawImage(snap, 0, 0, out.width, out.height);
      else if (page.bg !== "shaffof") paintPaper(g, page.bg, out.width, out.height, k);
      // yozuvlar alohida qatlamda (o'chirg'ich faqat yozuvni o'chirsin, savolni emas)
      var ink = document.createElement("canvas"); ink.width = out.width; ink.height = out.height;
      paintStrokes(ink.getContext("2d"), page, k);
      g.drawImage(ink, 0, 0);
      // pastki imzo
      g.font = "600 " + Math.round(13 * k) + "px system-ui,sans-serif";
      var sig = "kuvonch.uz · " + title + " · " + stamp(true);
      g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(4 * k, out.height - 28 * k, g.measureText(sig).width + 12 * k, 24 * k);
      g.fillStyle = "#222";
      g.fillText("kuvonch.uz · " + title + " · " + stamp(true), 10 * k, out.height - 10 * k);
      return out;
    });
  }
  function paintPaper(g, bg, w, h, k) {
    g.strokeStyle = bg === "katak" ? "#cfd8e3" : "#b9c7e6"; g.lineWidth = 1;
    var step = (bg === "katak" ? 26 : 32) * k;
    g.beginPath();
    for (var y = step; y < h; y += step) { g.moveTo(0, y); g.lineTo(w, y); }
    if (bg === "katak") for (var x = step; x < w; x += step) { g.moveTo(x, 0); g.lineTo(x, h); }
    g.stroke();
  }

  /* ---------- Saqlash (Google Drive) ---------- */
  function who() {
    var u = null; try { u = window.kaAccount && window.kaAccount.me && window.kaAccount.me(); } catch (e) {}
    var ism = (u && u.name) || "";
    if (!ism) try { ism = localStorage.getItem("ka.doska.ism") || ""; } catch (e) {}
    return { ism: ism || "Mehmon", guruh: (u && u.group) || "" };
  }
  function stamp(nice) {
    var d = new Date(), z = function (n) { return (n < 10 ? "0" : "") + n; };
    var s = d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
    return nice ? z(d.getDate()) + "." + z(d.getMonth() + 1) + "." + d.getFullYear() + " " + z(d.getHours()) + ":" + z(d.getMinutes()) : s + "_" + z(d.getHours()) + "-" + z(d.getMinutes()) + "-" + z(d.getSeconds());
  }
  var saving = false;
  function saveAll(quiet) {
    if (saving) return Promise.resolve(false);
    var todo = pages.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return x.p.strokes.length && !x.p.saved; });
    if (!todo.length) { if (!quiet) toast("Saqlanadigan yangi yozuv yo'q"); return Promise.resolve(true); }
    saving = true;
    var w = who(), st = stamp(false), done = 0, fail = [];
    if (!quiet) toast("💾 Drive'ga saqlanmoqda…", 60000);
    var chain = Promise.resolve();
    todo.forEach(function (x) {
      chain = chain.then(function () { return compose(x.p); }).then(function (c) {
        var nom = title + " — " + st + (pages.length > 1 ? " — " + (x.i + 1) + "-varaq" : "") + ".jpg";
        var b64 = c.toDataURL("image/jpeg", 0.88).split(",")[1];
        return upload(b64, nom, w).then(function () { x.p.saved = true; done++; }, function (e) { fail.push({ c: c, nom: nom, e: e }); });
      });
    });
    return chain.then(function () {
      saving = false;
      if (fail.length) {
        fail.forEach(function (f) { download(f.c, f.nom); });
        toast("⚠️ Drive'ga yuborib bo'lmadi (" + (fail[0].e && fail[0].e.message || "internet") + ") — rasm qurilmaga yuklab olindi", 6000);
        return false;
      }
      toast("✅ Drive'ga saqlandi (" + done + " ta varaq) — «Doska yechimlari» papkasi", 4000);
      return true;
    }, function (e) { saving = false; toast("⚠️ Saqlashda xato: " + (e && e.message || e), 5000); return false; });
  }
  function upload(b64, nom, w) {
    return fetch(API, {
      method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ amal: "yukla", tur: "uyga", guruh: "Doska yechimlari", vazifa: title, ism: w.ism + (w.guruh ? " (" + w.guruh + ")" : ""), nom: nom, mime: "image/jpeg", b64: b64 })
    }).then(function (r) { return r.text(); }).then(function (t) {
      var j; try { j = JSON.parse(t); } catch (e) { throw new Error("server javobi tushunarsiz"); }
      if (!j.ok) throw new Error(j.xato || "xato");
      return j;
    });
  }
  function download(c, nom) {
    try { var a = document.createElement("a"); a.href = c.toDataURL("image/jpeg", 0.9); a.download = nom.replace(/[\\/:*?"<>|]+/g, " "); document.body.appendChild(a); a.click(); a.remove(); } catch (e) {}
  }

  function closeBoard() {
    if (!root) return;
    var dirty = pages.some(function (p) { return p.strokes.length && !p.saved; });
    root.hidden = true;
    if (fab && active) fab.hidden = false;
    if (dirty) { saveAll(true).then(function (ok) { if (ok) flash("✅ Yozuvlar Drive'ga saqlandi"); }); }
    if (!active) hideFab();
  }
  function flash(m) { // doska yopiq bo'lsa ham qisqa xabar
    var t = el("div", { class: "kdz-msg", style: "position:fixed;z-index:2147483002" }, m);
    addCss(); document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; }, 2600); setTimeout(function () { t.remove(); }, 3200);
  }
  var tT = null;
  function toast(m, ms) {
    if (!root) return;
    var t = root.querySelector(".kdz-msg");
    if (!m) { if (t) t.remove(); return; }
    if (!t) { t = el("div", { class: "kdz-msg" }); root.appendChild(t); }
    t.textContent = m; t.style.opacity = "1";
    clearTimeout(tT); tT = setTimeout(function () { t.style.opacity = "0"; }, ms || 2600);
  }

  /* ---------- Tashqi API ---------- */
  window.kaDoska = {
    // Test/viktorina boshlandi — tugma chiqadi. Yangi test — yangi toza varaqlar.
    on: function (name) {
      var nt = String(name || document.title || "Test").replace(/\s+/g, " ").trim().slice(0, 80) || "Test";
      if (!active || nt !== title) { if (!root || root.hidden) { pages = []; pi = 0; } }
      title = nt; active = true;
      if (document.body) showFab(); else document.addEventListener("DOMContentLoaded", showFab);
    },
    // Test tugadi/yopildi — tugma yashirinadi (ochiq doska yopilmaydi, yozuvlar yo'qolmasin)
    off: function () {
      active = false;
      if (!root || root.hidden) {
        var dirty = pages.some(function (p) { return p.strokes.length && !p.saved; });
        if (dirty) saveAll(true);
        hideFab();
      }
    },
    open: function () { showFab(); openBoard(); },
    save: function () { return saveAll(false); },
    isActive: function () { return active; }
  };
})();
