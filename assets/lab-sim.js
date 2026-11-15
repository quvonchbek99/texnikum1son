/* Toshkent tuman 1-son texnikumi e-bazasi — Virtual laboratoriya simulyatorlari (1-qism: umumiy turlar va yordamchilar)
   Har bir simulyator: t1LabSim[tur] = function (el, p, api) — el: joy, p: sozlamalar (lab JSON), api.done(ball, matn). */
(function () {
  "use strict";
  var S = window.t1LabSim = window.t1LabSim || {};
  var NS = "http://www.w3.org/2000/svg";
  function attr(n, a) {
    for (var k in a) {
      var v = a[k]; if (v == null || v === false) continue;
      if (k === "text") n.textContent = v; else if (k === "html") n.innerHTML = v;
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), v);
      else if (k === "cls") n.setAttribute("class", v); else n.setAttribute(k, v === true ? "" : v);
    }
  }
  function add(n, k) { if (k == null) return; if (!Array.isArray(k)) k = [k]; k.forEach(function (c) { if (c == null || c === false) return; n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c); }); }
  function E(t, a, k) { var n = document.createElement(t); attr(n, a || {}); add(n, k); return n; }
  function V(t, a, k) { var n = document.createElementNS(NS, t); attr(n, a || {}); add(n, k); return n; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fx(x, d) { if (!isFinite(x)) return "∞"; d = d == null ? 2 : d; var s = (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); return s.replace(".", ","); }
  function num(x, d) { if (!isFinite(x)) return "∞"; var a = Math.abs(x); d = d != null ? d : a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3; return fx(x, d); }
  /* Raqamli surgich: o = {l, min, max, q (qadam), v, u (birlik), d (kasr)} */
  function rng(o, cb) {
    var inp = E("input", { type: "range", min: o.min, max: o.max, step: o.q || 1, value: o.v, "aria-label": o.l });
    var out = E("input", { type: "number", min: o.min, max: o.max, step: o.q || 1, value: o.v, cls: "ls-num", "aria-label": o.l });
    var w = E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl" }, [o.l]), inp, E("span", { cls: "ls-ro" }, [out, o.u ? E("small", { text: o.u }) : null])]);
    function set(v, tashqi) { v = Math.max(+o.min, Math.min(+o.max, +v)); inp.value = v; out.value = v; if (!tashqi) cb(v); }
    inp.addEventListener("input", function () { set(inp.value); });
    out.addEventListener("change", function () { if (out.value !== "") set(out.value); });
    w.set = function (v) { set(v, true); }; w.get = function () { return +inp.value; };
    return w;
  }
  /* Bo'limli tanlov tugmalari: L = [[qiymat, nom], ...] */
  function seg(L, v, cb, cls) {
    var w = E("div", { cls: "seg ls-seg " + (cls || ""), role: "group" });
    L.forEach(function (x) {
      var b = E("button", { type: "button", "aria-pressed": String(x[0] === v), text: x[1], onclick: function () { w.set(x[0]); cb(x[0]); } });
      b.setAttribute("data-v", x[0]); w.appendChild(b);
    });
    w.set = function (val) { Array.prototype.forEach.call(w.children, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === String(val))); }); };
    return w;
  }
  /* Vazifalar ro'yxati: L = [{m: matn, f: function(s) | "ifoda (s.x ...)"}] */
  function vazifalar(host, L, api, opt) {
    opt = opt || {};
    L = (L || []).map(function (v) { var f = v.f; if (typeof f === "string") { try { f = new Function("s", "return (" + f + ");"); } catch (e) { f = function () { return false; }; } } return { m: v.m, f: f, ok: false }; });
    var box = E("div", { cls: "ls-vz" }, [E("b", { text: opt.sarlavha || "Vazifalar" })]);
    var ul = E("ol"); box.appendChild(ul);
    L.forEach(function (v) { v.li = E("li", { text: v.m }); ul.appendChild(v.li); });
    if (L.length) host.appendChild(box);
    var tugadi = false;
    return {
      check: function (s) {
        if (!L.length) return;
        L.forEach(function (v) { if (!v.ok) { var r = false; try { r = !!v.f(s); } catch (e) {} if (r) { v.ok = true; v.li.classList.add("ok"); } } });
        if (!tugadi && L.every(function (v) { return v.ok; })) { tugadi = true; api.done(opt.ball ? opt.ball() : 100, opt.matn || "Barcha vazifalar bajarildi."); }
      },
      L: L
    };
  }
  var AC;
  function bip(f, d, vol) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f || 880; g.gain.value = vol || 0.08;
      o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + (d || 0.08));
    } catch (e) {}
  }
  function svgBox(w, h, cls) { return V("svg", { viewBox: "0 0 " + w + " " + h, cls: "ls-svg " + (cls || ""), role: "img" }); }
  function canvas(w, h) {
    var c = E("canvas", { cls: "ls-cv" }), r = window.devicePixelRatio || 1;
    c.width = w * r; c.height = h * r; c.style.aspectRatio = w + " / " + h;
    var x = c.getContext("2d"); x.scale(r, r); c.W = w; c.H = h; c.x = x; return c;
  }
  S._ = { E: E, V: V, shuf: shuf, fx: fx, num: num, rng: rng, seg: seg, vazifalar: vazifalar, bip: bip, svgBox: svgBox, canvas: canvas };

  /* =====================================================================
     1. Ketma-ketlik (tartib): p = {savol, qadamlar: [to'g'ri tartibda]}
     ===================================================================== */
  S.tartib = function (el, p, api) {
    var Q = p.qadamlar || [], k = 0, xato = 0, xs = 0;
    el.appendChild(E("p", { cls: "ls-sav", text: p.savol || "Amallarni to‘g‘ri ketma-ketlikda tanlang." }));
    var done = E("ol", { cls: "lt-done" }), pool = E("div", { cls: "lt-pool" }), msg = E("p", { cls: "ls-msg", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lt-g" }, [E("div", {}, [E("small", { cls: "muted", text: "Sizning ketma-ketligingiz" }), done]), E("div", {}, [E("small", { cls: "muted", text: "Qadamlar (navbatdagisini bosing)" }), pool])]));
    el.appendChild(msg);
    shuf(Q.map(function (q, i) { return [q, i]; })).forEach(function (x) {
      var b = E("button", { type: "button", cls: "lt-q", text: x[0] });
      b.addEventListener("click", function () {
        if (x[1] === k) {
          done.appendChild(E("li", { text: x[0] })); b.remove(); k++; xs = 0; msg.textContent = ""; msg.className = "ls-msg";
          if (k === Q.length) api.done(Math.max(30, 100 - xato * 10), xato ? "Xatolar soni: " + xato : "Birorta ham xatosiz!");
        } else {
          xato++; xs++; b.classList.remove("silk"); void b.offsetWidth; b.classList.add("silk");
          msg.className = "ls-msg bad"; msg.textContent = "Bu qadam hozir emas. " + (k === 0 ? "Avval tayyorgarlik bosqichi bajariladi." : "«" + Q[k - 1] + "» dan keyin nima qilinadi?");
          if (xs >= 2) Array.prototype.forEach.call(pool.children, function (c) { if (c.textContent === Q[k]) c.classList.add("ishora"); });
        }
      });
      pool.appendChild(b);
    });
  };

  /* =====================================================================
     2. Moslashtirish: p = {savol, juft: [[chap, o'ng], ...]}
     ===================================================================== */
  S.moslash = function (el, p, api) {
    var Jf = p.juft || [], sel = null, xato = 0, ok = 0;
    el.appendChild(E("p", { cls: "ls-sav", text: p.savol || "Chap ustundagi elementni, keyin unga mos keluvchini o‘ng ustundan tanlang." }));
    var A = E("div", { cls: "lm-c" }), B = E("div", { cls: "lm-c" }), msg = E("p", { cls: "ls-msg", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lm-g" }, [A, B])); el.appendChild(msg);
    function chiz(col, items, side) {
      items.forEach(function (x) {
        var b = E("button", { type: "button", cls: "lm-b", text: x[side] }); b.i = x.i;
        b.addEventListener("click", function () {
          if (b.disabled) return;
          if (side === 0) { Array.prototype.forEach.call(A.children, function (c) { c.classList.remove("sel"); }); b.classList.add("sel"); sel = b; msg.textContent = ""; return; }
          if (!sel) { msg.className = "ls-msg"; msg.textContent = "Avval chap ustundan tanlang."; return; }
          if (sel.i === b.i) {
            ok++; var n = String(ok);
            [sel, b].forEach(function (c) { c.disabled = true; c.classList.remove("sel"); c.classList.add("ok"); c.setAttribute("data-n", n); });
            sel = null; msg.className = "ls-msg ok"; msg.textContent = "To‘g‘ri!";
            if (ok === Jf.length) api.done(Math.max(30, 100 - xato * 8), xato ? "Xatolar: " + xato : "Hammasi birinchi urinishda!");
          } else { xato++; b.classList.remove("silk"); void b.offsetWidth; b.classList.add("silk"); msg.className = "ls-msg bad"; msg.textContent = "Mos emas, yana urinib ko‘ring."; }
        });
        col.appendChild(b);
      });
    }
    var items = Jf.map(function (x, i) { return { 0: x[0], 1: x[1], i: i }; });
    chiz(A, shuf(items), 0); chiz(B, shuf(items), 1);
  };

  /* =====================================================================
     3. Vaziyatli masala: p = {savollar: [{e, s, v: [...], t: to'g'ri indeks, i: izoh}]}
     ===================================================================== */
  S.tanlash = function (el, p, api) {
    var Q = p.savollar || [], i = 0, ball = 0;
    function sav() {
      var q = Q[i]; el.innerHTML = "";
      el.appendChild(E("div", { cls: "lt-h" }, [E("span", { cls: "tag", text: "Vaziyat " + (i + 1) + " / " + Q.length }), E("span", { cls: "muted small", text: "To‘g‘ri: " + ball })]));
      if (q.e) el.appendChild(E("div", { cls: "lz-e", text: q.e }));
      el.appendChild(E("p", { cls: "lt-s", text: q.s }));
      var vb = E("div", { cls: "lt-v" }), inf = E("div", { cls: "lt-i" });
      var V2 = q.aralash === false ? q.v.map(function (v, k) { return [v, k]; }) : shuf(q.v.map(function (v, k) { return [v, k]; }));
      V2.forEach(function (x, n) {
        var b = E("button", { type: "button", cls: "lt-b" }, [E("span", { text: "ABCDEF"[n] }), x[0]]);
        b.addEventListener("click", function () {
          var ok = x[1] === q.t; if (ok) ball++;
          Array.prototype.forEach.call(vb.children, function (c, m) { c.disabled = true; if (V2[m][1] === q.t) c.classList.add("ok"); else if (c === b) c.classList.add("no"); });
          inf.appendChild(E("p", { cls: ok ? "lt-ok" : "lt-no", html: "<b>" + (ok ? "To‘g‘ri!" : "Noto‘g‘ri.") + "</b> " }, q.i ? [q.i] : null));
          var nb = E("button", { type: "button", cls: "btn sm", text: i + 1 < Q.length ? "Keyingi vaziyat ▶" : "Yakunlash" });
          nb.addEventListener("click", function () { i++; if (i < Q.length) sav(); else { el.innerHTML = ""; api.done(ball / Q.length * 100, ball + " / " + Q.length + " vaziyat to‘g‘ri hal qilindi."); } });
          inf.appendChild(nb); nb.focus();
        });
        vb.appendChild(b);
      });
      el.appendChild(vb); el.appendChild(inf);
    }
    if (Q.length) sav();
  };

  /* =====================================================================
     4. Qurilmani ishlatish: p = {nomi, e, ekran, maqsad, boshqaruv: [{id, n, e}],
        qadamlar: [{v: topshiriq, t: boshqaruv id, j: izoh, ekran, chiroq: yashil|qizil|sariq|off, aylan: true|false}], xato: {id: ogohlantirish}}
     ===================================================================== */
  S.qurilma = function (el, p, api) {
    var Q = p.qadamlar || [], k = 0, xato = 0, rejim = "o";
    var top = E("div", { cls: "lq-top" });
    var rj = seg([["o", "O‘rganish (yo‘l-yo‘riq bilan)"], ["i", "Imtihon (yo‘l-yo‘riqsiz)"]], "o", function (v) { rejim = v; bosh(); });
    top.appendChild(rj); el.appendChild(top);
    if (p.maqsad) el.appendChild(E("p", { cls: "ls-sav", text: "Maqsad: " + p.maqsad }));
    var dev = E("div", { cls: "lq-dev" }), scr = E("div", { cls: "lq-scr", "aria-live": "polite" }), lamp = E("span", { cls: "lq-lamp", title: "Holat chirog‘i" }), mot = E("span", { cls: "lq-mot", text: p.motor || "⚙️" });
    dev.appendChild(E("div", { cls: "lq-dh" }, [E("span", { cls: "lq-de", text: p.e || "🔧" }), E("b", { text: p.nomi || "Qurilma" }), E("span", { cls: "sp" }), mot, lamp]));
    dev.appendChild(scr);
    var pan = E("div", { cls: "lq-pan" }); dev.appendChild(pan);
    var task = E("div", { cls: "lq-task", "aria-live": "polite" }), log = E("ol", { cls: "lq-log" });
    el.appendChild(E("div", { cls: "lq-g" }, [dev, E("div", {}, [task, log])]));
    var B = {};
    (p.boshqaruv || []).forEach(function (c) {
      var b = E("button", { type: "button", cls: "lq-b" }, [E("span", { cls: "lq-be", text: c.e || "⏺" }), E("span", { text: c.n })]);
      b.addEventListener("click", function () { bos(c.id, b); }); B[c.id] = b; pan.appendChild(b);
    });
    function holat(q) {
      if (q.ekran != null) scr.textContent = q.ekran;
      if (q.chiroq) lamp.setAttribute("data-c", q.chiroq);
      if (q.aylan != null) mot.classList.toggle("on", !!q.aylan);
    }
    function vazifa() {
      Object.keys(B).forEach(function (id) { B[id].classList.remove("ishora", "silk"); });
      if (k >= Q.length) return;
      task.innerHTML = "";
      task.appendChild(E("small", { cls: "muted", text: (k + 1) + "-qadam / " + Q.length }));
      task.appendChild(E("p", { text: rejim === "o" ? Q[k].v : "Navbatdagi to‘g‘ri amalni bajaring." }));
    }
    function bos(id, b) {
      if (k >= Q.length) return;
      var q = Q[k];
      if (id === q.t) {
        holat(q); log.appendChild(E("li", { cls: "ok" }, [E("b", { text: q.v }), q.j ? E("span", { text: " — " + q.j }) : null]));
        b.classList.add("bosildi"); setTimeout(function () { b.classList.remove("bosildi"); }, 300);
        bip(660, 0.05); k++;
        if (k === Q.length) {
          task.innerHTML = ""; task.appendChild(E("p", { cls: "ls-msg ok", text: "✅ Jarayon to‘liq bajarildi!" }));
          api.done(Math.max(30, (rejim === "i" ? 100 : 90) - xato * 10), (rejim === "i" ? "Imtihon rejimi. " : "O‘rganish rejimi (imtihon rejimida 100% olish mumkin). ") + "Xatolar: " + xato);
        } else vazifa();
      } else {
        xato++; bip(180, 0.15);
        b.classList.remove("silk"); void b.offsetWidth; b.classList.add("silk");
        var w = (p.xato && p.xato[id]) || "Bu amal hozir noto‘g‘ri.";
        var m = task.querySelector(".ls-msg"); if (m) m.remove();
        task.appendChild(E("p", { cls: "ls-msg bad", text: "⚠️ " + w }));
        if (rejim === "o" && B[q.t]) B[q.t].classList.add("ishora");
      }
    }
    function bosh() {
      k = 0; xato = 0; log.innerHTML = ""; scr.textContent = p.ekran || ""; lamp.setAttribute("data-c", "off"); mot.classList.remove("on");
      var n = el.querySelector(".lsim-nat"); if (n) n.remove();
      vazifa();
    }
    bosh();
  };

  /* =====================================================================
     5. Hisob-kitob (kalkulyator): p = {kirish: [{id, n, u, v, min, max, q}], chiqish: [{n, f, u, x}], vazifalar}
     ===================================================================== */
  S.kalkulyator = function (el, p, api) {
    var K = p.kirish || [], C = p.chiqish || [], st = {}, ids = K.map(function (k) { return k.id; }), n = 0;
    K.forEach(function (k) { st[k.id] = +k.v; });
    var F = C.map(function (c) { try { return new Function(ids.join(","), "return (" + c.f + ");"); } catch (e) { return function () { return "xato"; }; } });
    var g = E("div", { cls: "lk-g" }), inp = E("div", { cls: "lk-in" }), out = E("div", { cls: "lk-out" });
    g.appendChild(inp); g.appendChild(out); el.appendChild(g);
    K.forEach(function (k) {
      if (k.tanlov) {
        var w = E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: k.n })]);
        var s = E("select", { "aria-label": k.n });
        k.tanlov.forEach(function (o) { s.appendChild(E("option", { value: o[0], text: o[1] })); });
        s.value = k.v; s.addEventListener("change", function () { st[k.id] = +s.value; n++; hisob(); });
        w.appendChild(s); inp.appendChild(w);
      } else inp.appendChild(rng({ l: k.n, min: k.min, max: k.max, q: k.q, v: k.v, u: k.u }, function (v) { st[k.id] = v; n++; hisob(); }));
    });
    var rows = C.map(function (c) { var v = E("b"); out.appendChild(E("div", { cls: "lk-r" + (c.asosiy ? " as" : "") }, [E("span", { text: c.n }), E("span", {}, [v, c.u ? " " + c.u : ""])])); return v; });
    if (p.izoh) el.appendChild(E("p", { cls: "small muted", text: p.izoh }));
    var vz = vazifalar(el, p.vazifalar, api);
    function hisob() {
      var a = ids.map(function (i) { return st[i]; }), s = {};
      K.forEach(function (k) { s[k.id] = st[k.id]; });
      F.forEach(function (f, i) { var r; try { r = f.apply(null, a); } catch (e) { r = "—"; } s["y" + i] = r; rows[i].textContent = typeof r === "number" ? num(r, C[i].x) : String(r); });
      if (p.vazifalar && p.vazifalar.length) vz.check(s); else if (n >= 3) { api.done(100, "Hisob-kitob bajarildi. Turli qiymatlar bilan natijani solishtiring."); n = -1e9; }
    }
    hisob();
  };

  /* =====================================================================
     6. Sxema bilan tanishish: p = {w, h, sh: [{t: r|c|l|p|x|e, g: [...], n: nomi, i: izoh, f, s}], savol}
        r: [x,y,w,h,rx] · c: [cx,cy,r] · l: [x1,y1,x2,y2] · p: "d" · x: [x,y,matn,o'lcham] · e: [x,y,emoji,o'lcham]
     ===================================================================== */
  S.sxema = function (el, p, api) {
    var W = p.w || 400, H = p.h || 260, rejim = "t", Q = [], qi = 0, ball = 0, tanishdi = false;
    var top = E("div", { cls: "lq-top" });
    var rj = seg([["t", "Tanishish"], ["s", "Topish (sinov)"]], "t", function (v) { rejim = v; sv.classList.toggle("sinov", v === "s"); if (v === "s") boshS(); else { info.innerHTML = ""; info.appendChild(E("p", { cls: "muted", text: "Sxemadagi qismni bosing — nomi va vazifasi chiqadi." })); } tozala(); });
    top.appendChild(rj); el.appendChild(top);
    var sv = svgBox(W, H, "lx-sx"), info = E("div", { cls: "lx-info", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lx-sg" }, [E("div", { cls: "lx-sw" }, [sv]), info]));
    var parts = [];
    (p.sh || []).forEach(function (s) {
      var g = s.g || [], n, at = { fill: s.f || (s.t === "l" ? "none" : "#fff"), stroke: s.s || "#334", "stroke-width": s.sw || 1.5 };
      if (s.t === "r") n = V("rect", Object.assign(at, { x: g[0], y: g[1], width: g[2], height: g[3], rx: g[4] || 4 }));
      else if (s.t === "c") n = V("circle", Object.assign(at, { cx: g[0], cy: g[1], r: g[2] }));
      else if (s.t === "l") n = V("line", Object.assign(at, { x1: g[0], y1: g[1], x2: g[2], y2: g[3] }));
      else if (s.t === "p") n = V("path", Object.assign(at, { d: s.d }));
      else if (s.t === "x") n = V("text", { x: g[0], y: g[1], "font-size": g[3] || 11, "text-anchor": s.a || "middle", fill: s.f || "#334", text: g[2] });
      else if (s.t === "e") n = V("text", { x: g[0], y: g[1], "font-size": g[3] || 22, "text-anchor": "middle", "dominant-baseline": "central", text: g[2] });
      if (!n) return;
      if (s.n) { n.setAttribute("class", "lx-p"); n.setAttribute("tabindex", "0"); n.setAttribute("aria-label", s.n); n.s = s; parts.push(n); n.addEventListener("click", function () { bos(n); }); n.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bos(n); } }); }
      else n.setAttribute("pointer-events", "none");
      sv.appendChild(n);
      if (s.n && s.lb) sv.appendChild(V("text", { x: s.lb[0], y: s.lb[1], "font-size": s.lb[2] || 10, "text-anchor": "middle", fill: "#334", "pointer-events": "none", cls: "lx-lb", text: s.lb[3] || s.n }));
    });
    function tozala() { parts.forEach(function (n) { n.classList.remove("sel", "ok", "no"); }); }
    function bos(n) {
      if (rejim === "t") {
        tozala(); n.classList.add("sel"); info.innerHTML = "";
        info.appendChild(E("h4", { text: n.s.n })); if (n.s.i) info.appendChild(E("p", { text: n.s.i }));
        n.seen = 1; if (!tanishdi && parts.every(function (x) { return x.seen || parts.filter(function (y) { return y.s.n === x.s.n; }).some(function (y) { return y.seen; }); })) { tanishdi = true; api.done(100, "Sxemaning barcha qismlari bilan tanishdingiz."); }
        return;
      }
      if (qi >= Q.length) return;
      var q = Q[qi]; tozala();
      if (n.s.n === q) { ball++; n.classList.add("ok"); bip(700, 0.05); }
      else { n.classList.add("no"); parts.forEach(function (x) { if (x.s.n === q) x.classList.add("ok"); }); bip(200, 0.12); }
      qi++; setTimeout(savS, 900);
    }
    function boshS() {
      var nomlar = []; parts.forEach(function (x) { if (nomlar.indexOf(x.s.n) < 0) nomlar.push(x.s.n); });
      Q = shuf(nomlar).slice(0, Math.min(8, nomlar.length)); qi = 0; ball = 0; savS();
    }
    function savS() {
      tozala(); info.innerHTML = "";
      if (qi >= Q.length) { api.done(ball / Q.length * 100, ball + " / " + Q.length + " qism to‘g‘ri topildi."); info.appendChild(E("p", { cls: "ls-msg ok", text: "Natija: " + ball + " / " + Q.length })); return; }
      info.appendChild(E("small", { cls: "muted", text: (qi + 1) + " / " + Q.length + " · to‘g‘ri: " + ball }));
      info.appendChild(E("p", { cls: "lx-q", html: "Sxemada ko‘rsating: <b></b>" })); info.querySelector("b").textContent = Q[qi];
    }
    info.appendChild(E("p", { cls: "muted", text: p.savol || "Sxemadagi qismni bosing — nomi va vazifasi chiqadi." }));
  };
})();
