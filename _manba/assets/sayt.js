/* Toshkent tuman 1-son texnikumi e-bazasi — umumiy skript
   Fasl (kuz/qish/bahor/yoz), kirish animatsiyasi, menyu, tablar, qidiruv. */
(function () {
  "use strict";
  var ROOT = document.body.getAttribute("data-root") || "";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Sana va fasl (Toshkent vaqti, UTC+5) ---------- */
  var OY = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  var HAFTA = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];
  function tosh() { var d = new Date(); return new Date(d.getTime() + (d.getTimezoneOffset() + 300) * 60000); }
  function faslOf(m) { return m === 11 || m <= 1 ? "qish" : m <= 4 ? "bahor" : m <= 7 ? "yoz" : "kuz"; }
  var FASL = {
    kuz: { nom: "Kuz", kicker: "Oltin kuz — bilim fasli", matn: "O‘quv yili qizg‘in pallada. Darslar, amaliy mashg‘ulotlar va oraliq nazoratlar uchun barcha materiallar shu yerda." },
    qish: { nom: "Qish", kicker: "Qish — yakunlar fasli", matn: "Semestr yakunlari va yakuniy nazoratlar mavsumi. Takrorlash uchun ma’ruza, test va glossariylardan foydalaning." },
    bahor: { nom: "Bahor", kicker: "Bahor — Navro‘z va amaliyot fasli", matn: "Yangilanish fasli: ishlab chiqarish amaliyoti va kasbiy ko‘nikmalarni mustahkamlash vaqti." },
    yoz: { nom: "Yoz", kicker: "Yoz — qabul va kasb tanlash fasli", matn: "Yo‘nalishlar bilan tanishing, o‘zingizga mos kasbni tanlang va amaliyotda tajriba orttiring." }
  };
  var now = tosh();
  var q = new URLSearchParams(location.search);
  var fasl = FASL[q.get("fasl")] ? q.get("fasl") : faslOf(now.getMonth());
  document.documentElement.setAttribute("data-fasl", fasl);

  var hero = $(".hero[data-fasl-hero]");
  if (hero) {
    var F = FASL[fasl];
    var k = $("[data-fasl-kicker]", hero), m = $("[data-fasl-matn]", hero), b = $("[data-bugun]", hero);
    var IK = { kuz: '<path d="M12 21c-4-3-7-6.5-7-10.5C5 6 8 3 12 3s7 3 7 7.5C19 14.5 16 18 12 21z"/><path d="M12 21V8M12 13l-3-2.5M12 16l3-2.5"/>',
      qish: '<path d="M12 2v20M4.9 6.5l14.2 11M4.9 17.5l14.2-11"/><path d="M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5"/>',
      bahor: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C10 6 10.5 3.5 12 3c1.5.5 2 3 0 6.5zM14.4 12.8c3.9-.4 5.9 1.2 5.7 2.8-.9 1.3-3.4 1.3-5.7-2.8zM9.6 12.8c-3.9-.4-5.9 1.2-5.7 2.8.9 1.3 3.4 1.3 5.7-2.8z"/>',
      yoz: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>' };
    if (k) k.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IK[fasl] + "</svg> " + F.kicker;
    if (m) m.textContent = F.matn;
    if (b) {
      var s = '<span>Bugun: <b>' + now.getDate() + "-" + OY[now.getMonth()] + " " + now.getFullYear() + "</b>, " + HAFTA[now.getDay()] + "</span>";
      var mud = [{ sana: "2027-01-30", nom: "Kuzgi semestr tugashiga" }];
      for (var i = 0; i < mud.length; i++) {
        var t = new Date(mud[i].sana + "T23:59:59+05:00"), kun = Math.ceil((t - new Date()) / 86400000);
        if (kun > 0 && kun < 200) { s += "<span>" + mud[i].nom + ": <b>" + kun + " kun</b></span>"; break; }
      }
      s += "<span>O‘quv yili: <b>2026–2027</b></span>";
      b.innerHTML = s;
    }
  }
  var hc = $(".hero canvas");
  if (hc) particles(hc, fasl);

  /* ---------- Fasl zarrachalari (barg, qor, gulbarg, quyosh) ---------- */
  function particles(cv, fasl) {
    var ctx = cv.getContext("2d"); if (!ctx) return;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W, H, dpr, P = [], run = true, vis = true, last = 0;
    var C = {
      kuz: ["#e9842a", "#c9481c", "#f0b429", "#a7341a", "#dd9a2e", "#f3c95a"],
      qish: ["#ffffff", "#eaf4ff", "#d6e9fb"],
      bahor: ["#ffd3de", "#ffbfd0", "#fff2f5", "#f6a6be", "#ffffff"],
      yoz: ["#ffe08a", "#fff3c4", "#ffd04d"]
    }[fasl];
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(fasl === "qish" ? 110 : 60, Math.round(W / (fasl === "qish" ? 11 : 20)));
      while (P.length < n) P.push(mk(true)); P.length = n;
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function mk(any) {
      var p = { x: rnd(0, W), y: any ? rnd(0, H) : rnd(-60, -10), r: rnd(0, Math.PI * 2), vr: rnd(-0.02, 0.02), c: C[(Math.random() * C.length) | 0], ph: rnd(0, 6.3) };
      if (fasl === "kuz") { p.s = rnd(8, 17); p.vy = rnd(0.5, 1.3); p.vx = rnd(-0.3, 0.5); }
      else if (fasl === "qish") { p.s = rnd(1.2, 3.8); p.vy = rnd(0.35, 1.1); p.vx = rnd(-0.25, 0.25); p.star = Math.random() < 0.12; if (p.star) p.s = rnd(4, 7); }
      else if (fasl === "bahor") { p.s = rnd(4, 8); p.vy = rnd(0.4, 1); p.vx = rnd(0.2, 0.8); }
      else { p.s = rnd(1, 3.2); p.vy = rnd(-0.45, -0.12); p.vx = rnd(-0.15, 0.15); if (!any) p.y = rnd(H, H + 40); p.a = rnd(0.3, 0.9); }
      return p;
    }
    function leaf(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = 0.9;
      var s = p.s; ctx.beginPath(); ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.5, s * 0.7, s * 0.6, 0, s); ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.9, -s * 0.5, 0, -s); ctx.fill();
      ctx.strokeStyle = "rgba(90,30,5,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -s * 0.8); ctx.lineTo(0, s * 1.25); ctx.stroke(); ctx.restore();
    }
    function petal(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    function snow(p) {
      ctx.fillStyle = p.c; ctx.globalAlpha = 0.9;
      if (!p.star) { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); return; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.strokeStyle = p.c; ctx.lineWidth = 1.3;
      for (var i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.s); ctx.moveTo(0, p.s * 0.55); ctx.lineTo(p.s * 0.3, p.s * 0.8); ctx.moveTo(0, p.s * 0.55); ctx.lineTo(-p.s * 0.3, p.s * 0.8); ctx.stroke(); }
      ctx.restore();
    }
    function mote(p, t) {
      var a = p.a * (0.6 + 0.4 * Math.sin(t / 700 + p.ph));
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 4);
      g.addColorStop(0, "rgba(255,226,140," + a + ")"); g.addColorStop(1, "rgba(255,226,140,0)");
      ctx.fillStyle = g; ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 4, 0, Math.PI * 2); ctx.fill();
    }
    function sun() {
      var x = W * 0.86, y = H * 0.12, r = Math.max(W, H) * 0.55;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(255,214,102,.55)"); g.addColorStop(0.25, "rgba(255,200,80,.18)"); g.addColorStop(1, "rgba(255,200,80,0)");
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    function frame(t) {
      if (!run) return;
      if (vis && !document.hidden && t - last > 15) {
        last = t; ctx.clearRect(0, 0, W, H);
        if (fasl === "yoz") sun();
        for (var i = 0; i < P.length; i++) {
          var p = P[i];
          p.x += p.vx + Math.sin(t / 900 + p.ph) * (fasl === "kuz" ? 0.6 : 0.25); p.y += p.vy; p.r += p.vr;
          if (fasl === "yoz") { if (p.y < -20) P[i] = mk(false); mote(p, t); continue; }
          if (p.y > H + 30 || p.x > W + 40 || p.x < -40) { P[i] = mk(false); continue; }
          if (fasl === "kuz") leaf(p); else if (fasl === "qish") snow(p); else petal(p);
        }
        ctx.globalAlpha = 1;
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", function () { size(); if (reduce) frame(performance.now()); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(cv);
    requestAnimationFrame(frame);
  }

  /* ---------- Menyu ---------- */
  var bg = $(".burger"), nav = $(".nav");
  if (bg && nav) bg.addEventListener("click", function () { var o = nav.classList.toggle("open"); bg.setAttribute("aria-expanded", o ? "true" : "false"); });

  /* ---------- Tablar ---------- */
  window.t1Tabs = function (box) {
    var btns = $$(":scope > .tabs [data-t]", box), pans = $$(":scope > [data-p]", box);
    function show(id, push) {
      if (!btns.some(function (b) { return b.getAttribute("data-t") === id; })) id = btns[0] && btns[0].getAttribute("data-t");
      btns.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-t") === id ? "true" : "false"); });
      pans.forEach(function (p) { p.hidden = p.getAttribute("data-p") !== id; });
      if (push && box.hasAttribute("data-hash")) history.replaceState(null, "", "#" + id);
    }
    btns.forEach(function (b) {
      b.setAttribute("role", "tab");
      b.addEventListener("click", function () { show(b.getAttribute("data-t"), true); });
    });
    pans.forEach(function (p) { p.setAttribute("role", "tabpanel"); });
    var h = box.hasAttribute("data-hash") ? location.hash.slice(1) : "";
    show(h || (btns[0] && btns[0].getAttribute("data-t")), false);
    box.t1Show = show;
  };
  $$("[data-tabs]").forEach(window.t1Tabs);

  /* ---------- Semestr tablari ---------- */
  $$("[data-sems]").forEach(function (box) {
    var btns = $$(".sem-tabs [data-sem]", box), pans = $$("[data-sem-p]", box);
    function show(s) {
      btns.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-sem") === s ? "true" : "false"); });
      pans.forEach(function (p) { p.hidden = p.getAttribute("data-sem-p") !== s; });
      var u = new URL(location.href); u.searchParams.set("sem", s); history.replaceState(null, "", u);
      document.dispatchEvent(new CustomEvent("t1-sem", { detail: s }));
    }
    btns.forEach(function (b) { if (!b.disabled) b.addEventListener("click", function () { show(b.getAttribute("data-sem")); }); });
    var want = q.get("sem"), ok = btns.filter(function (b) { return !b.disabled; }).map(function (b) { return b.getAttribute("data-sem"); });
    show(ok.indexOf(want) >= 0 ? want : (box.getAttribute("data-def") || ok[0]));
  });

  /* ---------- Qidiruv ---------- */
  function norm(s) { return String(s || "").toLowerCase().replace(/[ʻʼ‘’`´']/g, "").replace(/[ʼ"«»“”]/g, "").replace(/\s+/g, " ").trim(); }
  var qi = $("#q-input");
  if (qi) {
    var out = $("#q-res"), DATA = null;
    fetch(ROOT + "data/qidiruv.json").then(function (r) { return r.json(); }).then(function (d) { DATA = d.map(function (x) { x.n = norm(x.t + " " + (x.s || "")); return x; }); go(); });
    qi.value = q.get("q") || "";
    qi.addEventListener("input", go);
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function go() {
      if (!DATA) return;
      var v = norm(qi.value), ws = v.split(" ").filter(Boolean);
      var u = new URL(location.href); if (v) u.searchParams.set("q", qi.value); else u.searchParams.delete("q"); history.replaceState(null, "", u);
      if (!ws.length) { out.innerHTML = '<p class="muted">Yo‘nalish, fan, mavzu yoki guruh raqamini yozing. Masalan: <i>08-26</i>, <i>oshpaz</i>, <i>overlok</i>.</p>'; return; }
      var r = DATA.filter(function (x) { return ws.every(function (w) { return x.n.indexOf(w) >= 0; }); }).slice(0, 80);
      var tur = { y: "Yo‘nalish", f: "Fan", g: "Guruh", m: "Mavzu", s: "Sahifa" };
      out.innerHTML = r.length ? r.map(function (x) {
        return '<a href="' + ROOT + x.u + '"><span class="tag">' + (tur[x.k] || "") + "</span> <b>" + esc(x.t) + "</b>" + (x.s ? "<small>" + esc(x.s) + "</small>" : "") + "</a>";
      }).join("") + (r.length === 80 ? '<p class="muted small">Birinchi 80 ta natija ko‘rsatildi — so‘rovni aniqlashtiring.</p>' : "")
        : '<p class="muted">Hech narsa topilmadi. Boshqacha yozib ko‘ring.</p>';
    }
  }

  /* ---------- Xarita (bosilganda yuklanadi — sahifa tez ochiladi) ---------- */
  $$("[data-map]").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = document.createElement("iframe"); f.className = "map"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
      f.title = "Texnikum joylashuvi xaritada"; f.src = b.getAttribute("data-map"); b.replaceWith(f);
    });
  });

  window.t1 = { ROOT: ROOT, $: $, $$: $$, norm: norm, fasl: fasl };
})();
