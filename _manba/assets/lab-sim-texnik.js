/* Virtual laboratoriya simulyatorlari (2-qism): elektr, avto, metall, fizika, kimyo, matematika */
(function () {
  "use strict";
  var S = window.t1LabSim, U = S && S._; if (!U) return;
  var E = U.E, V = U.V, fx = U.fx, num = U.num, rng = U.rng, seg = U.seg, bip = U.bip;

  /* ===================== Elektr zanjiri (Om qonuni) ===================== */
  S.zanjir = function (el, p, api) {
    var s = { U: p.U || 12, R1: p.R1 || 10, R2: p.R2 || 20, m: p.m || "k", k: false };
    var top = E("div", { cls: "lz-top" });
    var sv = U.svgBox(420, 240, "lz-sv"), out = E("div", { cls: "lk-out" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [sv]), E("div", {}, [top, out])]));
    top.appendChild(seg([["k", "Ketma-ket"], ["p", "Parallel"]], s.m, function (v) { s.m = v; chiz(); }));
    var kb = E("button", { type: "button", cls: "btn sm lz-k", text: "Kalitni yoqish" }); kb.addEventListener("click", function () { s.k = !s.k; chiz(); }); top.appendChild(kb);
    top.appendChild(rng({ l: "Manba kuchlanishi U", min: 1, max: 36, q: 0.5, v: s.U, u: "V" }, function (v) { s.U = v; chiz(); }));
    top.appendChild(rng({ l: "L1 qarshiligi R1", min: 1, max: 100, q: 1, v: s.R1, u: "Ω" }, function (v) { s.R1 = v; chiz(); }));
    top.appendChild(rng({ l: "L2 qarshiligi R2", min: 1, max: 100, q: 1, v: s.R2, u: "Ω" }, function (v) { s.R2 = v; chiz(); }));
    var vz = U.vazifalar(el, p.vazifalar || [
      { m: "Kalitni yoqib, zanjirdan tok o‘tkazing.", f: "s.k && s.I > 0" },
      { m: "Ketma-ket ulanishda umumiy qarshilikni 30 Ω qiling.", f: "s.k && s.m=='k' && Math.abs(s.Rt-30)<0.01" },
      { m: "Ketma-ket ulanishda zanjirdagi tokni 0,5 A ga keltiring (±0,02 A).", f: "s.k && s.m=='k' && Math.abs(s.I-0.5)<=0.02" },
      { m: "Parallel ulanishda umumiy tok 3 A dan oshsin.", f: "s.k && s.m=='p' && s.I>3" }
    ], api);
    var t = 0, dash, raf;
    function lampa(x, y, P, lab) {
      var a = Math.min(1, P / 12);
      var g = V("g", {});
      g.appendChild(V("circle", { cx: x, cy: y, r: 22, fill: "rgba(255,210,60," + (a * 0.55) + ")", stroke: "none" }));
      g.appendChild(V("circle", { cx: x, cy: y, r: 13, fill: a > 0.02 ? "rgb(255," + Math.round(230 - 60 * a) + "," + Math.round(120 - 100 * a) + ")" : "#f4f4f4", stroke: "#334", "stroke-width": 2 }));
      g.appendChild(V("path", { d: "M" + (x - 9) + "," + (y - 9) + "L" + (x + 9) + "," + (y + 9) + "M" + (x + 9) + "," + (y - 9) + "L" + (x - 9) + "," + (y + 9), stroke: "#334", "stroke-width": 1.6 }));
      g.appendChild(V("text", { x: x, y: y + 34, "text-anchor": "middle", "font-size": 12, fill: "#334", text: lab }));
      return g;
    }
    function chiz() {
      var Rt, I, I1, I2, U1, U2;
      if (s.m === "k") { Rt = s.R1 + s.R2; I = s.k ? s.U / Rt : 0; I1 = I2 = I; U1 = I * s.R1; U2 = I * s.R2; }
      else { Rt = s.R1 * s.R2 / (s.R1 + s.R2); I1 = s.k ? s.U / s.R1 : 0; I2 = s.k ? s.U / s.R2 : 0; I = I1 + I2; U1 = U2 = s.k ? s.U : 0; }
      s.Rt = Rt; s.I = I; s.P = s.U * I;
      kb.textContent = s.k ? "Kalitni o‘chirish" : "Kalitni yoqish"; kb.classList.toggle("ghost", s.k);
      sv.innerHTML = "";
      var w = { stroke: "#334", "stroke-width": 2.5, fill: "none" }, d;
      if (s.m === "k") d = "M40,70 V40 H380 V200 H40 V140";
      else d = "M40,70 V40 H380 V200 H40 V140 M260,40 V200";
      sv.appendChild(V("path", Object.assign({ d: d }, w)));
      if (s.k) { dash = V("path", { d: d, stroke: "#f39c12", "stroke-width": 2.5, fill: "none", "stroke-dasharray": "3 12", "stroke-linecap": "round" }); sv.appendChild(dash); } else dash = null;
      /* batareya */
      sv.appendChild(V("rect", { x: 28, y: 70, width: 24, height: 70, fill: "#fff", stroke: "none" }));
      sv.appendChild(V("line", { x1: 22, y1: 88, x2: 58, y2: 88, stroke: "#334", "stroke-width": 3 }));
      sv.appendChild(V("line", { x1: 30, y1: 100, x2: 50, y2: 100, stroke: "#334", "stroke-width": 6 }));
      sv.appendChild(V("line", { x1: 22, y1: 112, x2: 58, y2: 112, stroke: "#334", "stroke-width": 3 }));
      sv.appendChild(V("line", { x1: 30, y1: 124, x2: 50, y2: 124, stroke: "#334", "stroke-width": 6 }));
      sv.appendChild(V("text", { x: 70, y: 108, "font-size": 13, fill: "#334", text: "U = " + fx(s.U, 1) + " V" }));
      /* kalit */
      sv.appendChild(V("rect", { x: 100, y: 30, width: 50, height: 20, fill: "#fff", stroke: "none" }));
      sv.appendChild(V("circle", { cx: 104, cy: 40, r: 3.5, fill: "#334" })); sv.appendChild(V("circle", { cx: 146, cy: 40, r: 3.5, fill: "#334" }));
      sv.appendChild(V("line", { x1: 104, y1: 40, x2: s.k ? 146 : 140, y2: s.k ? 40 : 20, stroke: "#334", "stroke-width": 3, "stroke-linecap": "round" }));
      sv.appendChild(V("text", { x: 125, y: 66, "text-anchor": "middle", "font-size": 11, fill: "#556", text: "Kalit K" }));
      /* ampermetr */
      sv.appendChild(V("circle", { cx: 200, cy: 40, r: 15, fill: "#fff", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("text", { x: 200, y: 45, "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: "#334", text: "A" }));
      sv.appendChild(V("text", { x: 200, y: 74, "text-anchor": "middle", "font-size": 12, fill: "#b5541b", text: fx(I, 2) + " A" }));
      if (s.m === "k") { sv.appendChild(lampa(150, 200, U1 * I1, "L1: " + fx(U1, 1) + " V")); sv.appendChild(lampa(290, 200, U2 * I2, "L2: " + fx(U2, 1) + " V")); }
      else { sv.appendChild(lampa(260, 120, U1 * I1, "L1: " + fx(I1, 2) + " A")); sv.appendChild(lampa(380, 120, U2 * I2, "L2: " + fx(I2, 2) + " A")); }
      out.innerHTML = "";
      [["Umumiy qarshilik", s.m === "k" ? "R = R1 + R2 = " + fx(Rt, 1) + " Ω" : "R = R1·R2/(R1+R2) = " + fx(Rt, 2) + " Ω"], ["Tok kuchi (Om qonuni)", "I = U / R = " + fx(I, 3) + " A"],
        ["L1", "U1 = " + fx(U1, 2) + " V, I1 = " + fx(I1, 3) + " A, P1 = " + fx(U1 * I1, 2) + " W"], ["L2", "U2 = " + fx(U2, 2) + " V, I2 = " + fx(I2, 3) + " A, P2 = " + fx(U2 * I2, 2) + " W"],
        ["Umumiy quvvat", "P = U·I = " + fx(s.P, 2) + " W"]].forEach(function (r, i) { out.appendChild(E("div", { cls: "lk-r" + (i === 1 ? " as" : "") }, [E("span", { text: r[0] }), E("b", { text: r[1] })])); });
      if (s.P > 60) out.appendChild(E("p", { cls: "ls-msg bad", text: "⚠️ Quvvat juda katta — real zanjirda simlar va lampalar qizib ketadi, saqlagich kuyishi mumkin." }));
      vz.check(s);
    }
    function anim() { if (!el.isConnected) return; if (dash) { t -= 0.5 + s.I * 1.5; dash.setAttribute("stroke-dashoffset", t); } raf = requestAnimationFrame(anim); }
    chiz(); anim();
  };

  /* ===================== Raqamli multimetr ===================== */
  S.multimetr = function (el, p, api) {
    var OB = p.obyektlar || [
      { id: "bat", n: "AA batareya", e: "🔋", t: "dc", q: 1.56 },
      { id: "akk", n: "Avtomobil akkumulyatori", e: "🔋", t: "dc", q: 12.62 },
      { id: "roz", n: "Elektr rozetkasi", e: "🔌", t: "ac", q: 226 },
      { id: "rez", n: "Rezistor 470 Ω", e: "〰️", t: "r", q: 468 },
      { id: "sim", n: "Butun sim", e: "➰", t: "s", q: 0.3 },
      { id: "uzi", n: "Uzilgan sim", e: "✂️", t: "s", q: Infinity },
      { id: "led", n: "Svetodiod zanjiri (tok)", e: "💡", t: "i", q: 0.018 },
      { id: "far", n: "Fara lampasi zanjiri (tok)", e: "🚗", t: "i", q: 1.25 }
    ];
    var REJ = [["off", "OFF"], ["vdc", "V⎓"], ["vac", "V~"], ["ohm", "Ω"], ["dio", "•)))"], ["a", "A⎓"]];
    var s = { r: "off", u: "v", ob: null }, bajarildi = {}, xato = 0;
    var sv = U.svgBox(220, 330, "lm-sv"), info = E("div", { cls: "lx-info", "aria-live": "polite" });
    var obl = E("div", { cls: "lm-ob" });
    el.appendChild(E("div", { cls: "lmm-g" }, [E("div", { cls: "lmm-a" }, [sv]), E("div", {}, [E("p", { cls: "ls-sav", text: "1) O‘lchash rejimini tanlang (aylanma o‘zgartirgich). 2) Qizil shchup uyasini tanlang. 3) O‘lchanadigan obyektni bosing." }),
      E("div", { cls: "lq-top" }, [E("span", { cls: "small", text: "Qizil shchup: " }), seg([["v", "VΩmA uyasi"], ["10", "10A uyasi"]], "v", function (v) { s.u = v; chiz(); })]), obl, info])]));
    OB.forEach(function (o) {
      var b = E("button", { type: "button", cls: "lm-o" }, [E("span", { text: o.e }), E("span", { text: o.n }), E("i", { cls: "lx-ok", text: "✓" })]);
      b.addEventListener("click", function () { s.ob = o; olch(); Array.prototype.forEach.call(obl.children, function (c) { c.classList.remove("sel"); }); b.classList.add("sel"); }); o.b = b; obl.appendChild(b);
    });
    var ekr = "", kerak = { dc: ["vdc", "v"], ac: ["vac", "v"], r: ["ohm", "v"], s: ["dio", "v"] };
    function natija(o) {
      var r = s.r, u = s.u, live = o.t === "dc" || o.t === "ac";
      if (r === "off") return { e: "", m: "Asbob o‘chiq. Rejimni tanlang." };
      if (u === "10" && r !== "a") return live ? { e: "Err", m: "⚠️ Qizil shchup 10A uyasida turibdi! Bu holatda asbob kuchlanish manbaini qisqa tutashtiradi. Kuchlanish VΩmA uyasidan o‘lchanadi.", x: 1 } : { e: "----", m: "Qizil shchup 10A uyasida — bu uya faqat katta tokni o‘lchash uchun.", x: 1 };
      if (r === "a") {
        if (live) return { e: "FUSE", m: "⚠️ Tok rejimida asbob deyarli nol qarshilikka ega — kuchlanish manbaiga parallel ulanganda qisqa tutashuv bo‘ladi, saqlagich kuydi!", x: 1 };
        if (o.t !== "i") return { e: "0.000", m: "Bu obyektda tok yo‘q. Tok zanjirga ketma-ket ulanib o‘lchanadi." };
        if (u === "v" && o.q > 0.2) return { e: "FUSE", m: "⚠️ mA kirishi 200 mA gacha. " + fx(o.q, 2) + " A tok saqlagichni kuydirdi — 10A uyasidan foydalaning!", x: 1 };
        return { e: u === "v" ? fx(o.q * 1000, 1) + " mA" : fx(o.q, 2) + " A", m: "To‘g‘ri: tok zanjirga ketma-ket ulangan multimetr bilan o‘lchandi.", ok: o.t === "i" };
      }
      if (o.t === "i") return { e: "—", m: "Bu topshiriqda zanjirdagi tokni o‘lchash kerak: A⎓ rejimi, multimetr zanjir uzilgan joyiga ketma-ket ulanadi." };
      if (r === "vdc") { if (o.t === "dc") return { e: fx(o.q, 2) + " V", m: "To‘g‘ri: o‘zgarmas kuchlanish V⎓ rejimida o‘lchanadi.", ok: 1 }; if (o.t === "ac") return { e: fx(Math.random() * 0.8, 2) + " V", m: "Rozetkada o‘zgaruvchan kuchlanish — V⎓ rejimi deyarli 0 ko‘rsatadi. V~ ni tanlang." }; return { e: "0.00 V", m: "Bu obyektda kuchlanish manbai yo‘q." }; }
      if (r === "vac") { if (o.t === "ac") return { e: Math.round(o.q + Math.random() * 3 - 1.5) + " V~", m: "To‘g‘ri: tarmoq kuchlanishi V~ rejimida (amaldagi qiymat) o‘lchanadi. Shchuplarni faqat izolyatsiyalangan qismidan ushlang!", ok: 1 }; if (o.t === "dc") return { e: "0.0 V~", m: "Batareya/akkumulyator — o‘zgarmas tok manbai. V⎓ rejimini tanlang." }; return { e: "0.0 V~", m: "Bu obyektda kuchlanish yo‘q." }; }
      if (live) return { e: "Err", m: "⚠️ Kuchlanish ostidagi zanjirda qarshilik va uzluksizlik o‘lchanmaydi! Avval manbani uzing — aks holda asbob shikastlanadi.", x: 1 };
      if (r === "ohm") { if (o.t === "r") return { e: Math.round(o.q) + " Ω", m: "To‘g‘ri: qarshilik Ω rejimida, kuchlanishsiz o‘lchanadi (470 Ω ±5%).", ok: 1 }; if (o.t === "s") return { e: isFinite(o.q) ? fx(o.q, 1) + " Ω" : "OL", m: isFinite(o.q) ? "Sim butun — qarshilik juda kichik." : "OL — zanjir uzilgan (qarshilik cheksiz katta)." }; }
      if (r === "dio") { if (o.t === "s") { if (isFinite(o.q)) bip(2200, 0.35, 0.05); return { e: isFinite(o.q) ? "•))) " + fx(o.q, 1) : "OL", m: isFinite(o.q) ? "To‘g‘ri: uzluksizlik rejimida signal chaladi — sim butun." : "To‘g‘ri: signal yo‘q, OL — sim uzilgan.", ok: 1 }; } return { e: "OL", m: "470 Ω — uzluksizlik chegarasidan katta, signal chalmaydi. Qarshilikni Ω rejimida o‘lchang." }; }
      return { e: "—", m: "" };
    }
    function olch() {
      if (!s.ob) { chiz(); return; }
      var n = natija(s.ob); ekr = n.e; chiz();
      info.innerHTML = ""; info.appendChild(E("h4", { text: s.ob.e + " " + s.ob.n })); info.appendChild(E("p", { cls: "ls-msg" + (n.x ? " bad" : n.ok ? " ok" : ""), text: n.m }));
      if (n.x) { xato++; bip(160, 0.2); }
      if (n.ok && !bajarildi[s.ob.id]) { bajarildi[s.ob.id] = 1; s.ob.b.classList.add("ok"); }
      var qoldi = OB.filter(function (o) { return !bajarildi[o.id]; });
      info.appendChild(E("p", { cls: "small muted", text: qoldi.length ? "To‘g‘ri o‘lchangan: " + (OB.length - qoldi.length) + " / " + OB.length : "Barcha obyektlar to‘g‘ri o‘lchandi!" }));
      if (!qoldi.length) api.done(Math.max(30, 100 - xato * 10), xato ? "Xavfli xatolar: " + xato : "Birorta ham xavfli xatosiz!");
    }
    function chiz() {
      sv.innerHTML = "";
      sv.appendChild(V("rect", { x: 10, y: 6, width: 200, height: 318, rx: 22, fill: "#f2b50f", stroke: "#3a2a00", "stroke-width": 2 }));
      sv.appendChild(V("rect", { x: 24, y: 18, width: 172, height: 292, rx: 14, fill: "#2b2f36" }));
      sv.appendChild(V("rect", { x: 38, y: 32, width: 144, height: 58, rx: 6, fill: s.r === "off" ? "#8a9480" : "#c7d8b5", stroke: "#111" }));
      sv.appendChild(V("text", { x: 172, y: 72, "text-anchor": "end", "font-size": 24, "font-family": "monospace", "font-weight": 700, fill: "#18220f", text: s.r === "off" ? "" : (s.ob ? ekr : "0.00") }));
      var cx = 110, cy = 172, R = 36;
      sv.appendChild(V("circle", { cx: cx, cy: cy, r: R, fill: "#3d434d", stroke: "#111", "stroke-width": 2 }));
      REJ.forEach(function (r, i) {
        var a = (-150 + i * 60) * Math.PI / 180, x = cx + Math.sin(a) * (R + 22), y = cy - Math.cos(a) * (R + 22);
        var t = V("text", { x: x, y: y + 4, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: s.r === r[0] ? "#ffd34d" : "#e6e6e6", cls: "lm-r", text: r[1], tabindex: "0", role: "button", "aria-label": "Rejim " + r[1] });
        t.addEventListener("click", function () { s.r = r[0]; olch(); });
        t.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); s.r = r[0]; olch(); } });
        sv.appendChild(t);
        if (s.r === r[0]) sv.appendChild(V("line", { x1: cx, y1: cy, x2: cx + Math.sin(a) * (R - 6), y2: cy - Math.cos(a) * (R - 6), stroke: "#ffd34d", "stroke-width": 6, "stroke-linecap": "round" }));
      });
      sv.appendChild(V("circle", { cx: cx, cy: cy, r: 9, fill: "#222" }));
      [["10A", 52, s.u === "10"], ["COM", 110, true], ["VΩmA", 168, s.u === "v"]].forEach(function (u) {
        sv.appendChild(V("circle", { cx: u[1], cy: 270, r: 11, fill: "#111", stroke: u[2] ? (u[0] === "COM" ? "#ddd" : "#e74c3c") : "#666", "stroke-width": 3 }));
        sv.appendChild(V("text", { x: u[1], y: 297, "text-anchor": "middle", "font-size": 10, fill: "#eee", text: u[0] }));
      });
    }
    chiz();
  };

  /* ===================== Ossillograf: o'zgaruvchan tok ===================== */
  S.osiloskop = function (el, p, api) {
    var s = { Um: p.Um || 100, f: p.f || 50, vd: p.vd || 50, td: p.td || 5, phi: 0, ch2: false };
    var cv = U.canvas(600, 380), out = E("div", { cls: "lk-out" }), ctl = E("div", { cls: "lz-top" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [cv]), E("div", {}, [ctl, out])]));
    ctl.appendChild(rng({ l: "Amplituda Um", min: 1, max: 400, q: 1, v: s.Um, u: "V" }, function (v) { s.Um = v; chiz(); }));
    ctl.appendChild(rng({ l: "Chastota f", min: 1, max: 500, q: 1, v: s.f, u: "Hz" }, function (v) { s.f = v; chiz(); }));
    var VD = [1, 2, 5, 10, 20, 50, 100], TD = [0.5, 1, 2, 5, 10, 20, 50];
    function sel(l, L, v, u, cb) { var w = E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: l })]), sl = E("select", { "aria-label": l }); L.forEach(function (x) { sl.appendChild(E("option", { value: x, text: fx(x, x < 1 ? 1 : 0) + " " + u })); }); sl.value = v; sl.addEventListener("change", function () { cb(+sl.value); chiz(); }); w.appendChild(sl); return w; }
    ctl.appendChild(sel("Volt/bo‘lim (V/div)", VD, s.vd, "V", function (v) { s.vd = v; }));
    ctl.appendChild(sel("Vaqt/bo‘lim (ms/div)", TD, s.td, "ms", function (v) { s.td = v; }));
    ctl.appendChild(E("div", { cls: "small", text: "2-kanal (tok) faza siljishi:" }));
    ctl.appendChild(seg([["x", "O‘chiq"], ["0", "0° (aktiv)"], ["90", "90° (induktiv)"], ["-90", "−90° (sig‘im)"]], "x", function (v) { s.ch2 = v !== "x"; s.phi = v === "x" ? 0 : +v; chiz(); }));
    var vz = U.vazifalar(el, p.vazifalar || [
      { m: "Elektr tarmog‘i kuchlanishini sozlang: Um = 311 V (amaldagi qiymati 220 V), f = 50 Hz.", f: "Math.abs(s.Um-311)<=3 && s.f==50" },
      { m: "Signal ekrandan chiqmasin: V/div ni shunday tanlangki, amplituda 4 bo‘limdan oshmasin (Um = 311 V da).", f: "Math.abs(s.Um-311)<=3 && s.Um/s.vd<=4 && s.Um/s.vd>=1.5" },
      { m: "Ekranda aniq 2 ta to‘liq davr ko‘rinsin (10 bo‘lim = 2·T, ±10%).", f: "Math.abs(10*s.td/1000 - 2/s.f)/(2/s.f) <= 0.1" },
      { m: "2-kanalni yoqib, induktiv yuklamada tok kuchlanishdan 90° orqada qolishini ko‘ring.", f: "s.ch2 && s.phi==90" }
    ], api);
    function chiz() {
      var x = cv.x, W = cv.W, H = cv.H, gx = W / 10, gy = H / 8;
      x.fillStyle = "#0e1a12"; x.fillRect(0, 0, W, H);
      x.strokeStyle = "rgba(120,200,140,.18)"; x.lineWidth = 1;
      for (var i = 0; i <= 10; i++) { x.beginPath(); x.moveTo(i * gx, 0); x.lineTo(i * gx, H); x.stroke(); }
      for (i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(0, i * gy); x.lineTo(W, i * gy); x.stroke(); }
      x.strokeStyle = "rgba(120,200,140,.45)"; x.beginPath(); x.moveTo(0, H / 2); x.lineTo(W, H / 2); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.stroke();
      var Tt = 10 * s.td / 1000;
      function iz(rang, A, ph) {
        x.strokeStyle = rang; x.lineWidth = 2.2; x.beginPath();
        for (var px = 0; px <= W; px += 1) { var t = px / W * Tt, y = A * Math.sin(2 * Math.PI * s.f * t - ph); var py = H / 2 - y / s.vd * gy; if (px === 0) x.moveTo(px, py); else x.lineTo(px, py); }
        x.stroke();
      }
      iz("#4cff7a", s.Um, 0);
      if (s.ch2) iz("#ffd34d", s.Um * 0.6, s.phi * Math.PI / 180);
      x.fillStyle = "#9fe3b0"; x.font = "13px monospace"; x.fillText("CH1 " + s.vd + " V/div   " + fx(s.td, s.td < 1 ? 1 : 0) + " ms/div", 8, 18);
      if (s.ch2) { x.fillStyle = "#ffd34d"; x.fillText("CH2 (tok)", 8, 36); }
      var T = 1 / s.f;
      out.innerHTML = "";
      [["Davr T = 1/f", fx(T * 1000, 2) + " ms"], ["Amaldagi qiymat U = Um/√2", fx(s.Um / Math.SQRT2, 1) + " V"], ["Burchak chastota ω = 2πf", fx(2 * Math.PI * s.f, 1) + " rad/s"],
        ["Ekranda amplituda", fx(s.Um / s.vd, 2) + " bo‘lim"], ["Ekranda davrlar soni", fx(Tt / T, 2)]].forEach(function (r, i) { out.appendChild(E("div", { cls: "lk-r" + (i === 1 ? " as" : "") }, [E("span", { text: r[0] }), E("b", { text: r[1] })])); });
      if (s.Um / s.vd > 4) out.appendChild(E("p", { cls: "ls-msg bad", text: "Signal ekrandan chiqib ketdi — V/div qiymatini oshiring." }));
      vz.check(s);
    }
    chiz();
  };

  /* ===================== Transformator ===================== */
  S.transformator = function (el, p, api) {
    var s = { U1: p.U1 || 220, N1: p.N1 || 1100, N2: p.N2 || 220, R: p.R || 10 };
    var sv = U.svgBox(420, 230), out = E("div", { cls: "lk-out" }), ctl = E("div", { cls: "lz-top" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [sv]), E("div", {}, [ctl, out])]));
    ctl.appendChild(rng({ l: "Birlamchi kuchlanish U1", min: 12, max: 400, q: 1, v: s.U1, u: "V" }, function (v) { s.U1 = v; chiz(); }));
    ctl.appendChild(rng({ l: "Birlamchi chulg‘am o‘ramlari N1", min: 50, max: 3000, q: 10, v: s.N1, u: "" }, function (v) { s.N1 = v; chiz(); }));
    ctl.appendChild(rng({ l: "Ikkilamchi chulg‘am o‘ramlari N2", min: 10, max: 3000, q: 10, v: s.N2, u: "" }, function (v) { s.N2 = v; chiz(); }));
    ctl.appendChild(rng({ l: "Yuklama qarshiligi R", min: 1, max: 200, q: 1, v: s.R, u: "Ω" }, function (v) { s.R = v; chiz(); }));
    var vz = U.vazifalar(el, p.vazifalar || [
      { m: "U1 = 220 V tarmoqdan U2 = 12 V oling (±0,5 V).", f: "s.U1==220 && Math.abs(s.U2-12)<=0.5" },
      { m: "Transformatorni oshiruvchiga aylantiring (k < 1).", f: "s.k<1" },
      { m: "U1 = 220 V da k = 10 bo‘lsin va yuklama toki 2 A dan oshmasin.", f: "s.U1==220 && Math.abs(s.k-10)<0.01 && s.I2<=2" }
    ], api);
    function chulgam(x, y0, n, chap) {
      var g = V("g", {}), k = Math.max(2, Math.min(14, Math.round(n / 150)));
      for (var i = 0; i < k; i++) { var y = y0 + i * (110 / k); g.appendChild(V("ellipse", { cx: x, cy: y + 55 / k, rx: 22, ry: 55 / k, fill: "none", stroke: chap ? "#b5541b" : "#1f5fa6", "stroke-width": 2.4 })); }
      return g;
    }
    function chiz() {
      s.k = s.N1 / s.N2; s.U2 = s.U1 * s.N2 / s.N1; s.I2 = s.U2 / s.R; s.I1 = s.I2 * s.N2 / s.N1; s.P = s.U2 * s.I2;
      sv.innerHTML = "";
      sv.appendChild(V("path", { d: "M130,40 H290 V190 H130 Z M160,70 H260 V160 H160 Z", fill: "#9aa3ad", "fill-rule": "evenodd", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(chulgam(145, 60, s.N1, 1)); sv.appendChild(chulgam(275, 60, s.N2, 0));
      sv.appendChild(V("path", { d: "M123,75 H50 M123,155 H50", stroke: "#b5541b", "stroke-width": 2.5 }));
      sv.appendChild(V("circle", { cx: 40, cy: 115, r: 18, fill: "#fff", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("text", { x: 40, y: 120, "text-anchor": "middle", "font-size": 16, fill: "#334", text: "~" }));
      sv.appendChild(V("path", { d: "M40,97 V75 H50 M40,133 V155 H50", stroke: "#b5541b", "stroke-width": 2.5, fill: "none" }));
      sv.appendChild(V("path", { d: "M297,75 H380 V100 M297,155 H380 V130", stroke: "#1f5fa6", "stroke-width": 2.5, fill: "none" }));
      var a = Math.min(1, s.P / 60);
      sv.appendChild(V("circle", { cx: 380, cy: 115, r: 24, fill: "rgba(255,210,60," + a * 0.5 + ")" }));
      sv.appendChild(V("circle", { cx: 380, cy: 115, r: 14, fill: a > 0.02 ? "#ffe27a" : "#f4f4f4", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("text", { x: 210, y: 25, "text-anchor": "middle", "font-size": 13, fill: "#334", "font-weight": 700, text: s.k > 1.001 ? "Pasaytiruvchi transformator" : s.k < 0.999 ? "Oshiruvchi transformator" : "Ajratuvchi (k = 1)" }));
      sv.appendChild(V("text", { x: 145, y: 215, "text-anchor": "middle", "font-size": 12, fill: "#b5541b", text: "N1 = " + s.N1 }));
      sv.appendChild(V("text", { x: 275, y: 215, "text-anchor": "middle", "font-size": 12, fill: "#1f5fa6", text: "N2 = " + s.N2 }));
      out.innerHTML = "";
      [["Transformatsiya koeffitsiyenti k = N1/N2", fx(s.k, 2)], ["Ikkilamchi kuchlanish U2 = U1·N2/N1", fx(s.U2, 2) + " V"], ["Yuklama toki I2 = U2/R", fx(s.I2, 3) + " A"], ["Birlamchi tok I1 ≈ I2·N2/N1", fx(s.I1, 3) + " A"], ["Quvvat P ≈ U2·I2", fx(s.P, 1) + " W"]]
        .forEach(function (r, i) { out.appendChild(E("div", { cls: "lk-r" + (i === 1 ? " as" : "") }, [E("span", { text: r[0] }), E("b", { text: r[1] })])); });
      out.appendChild(E("p", { cls: "small muted", text: "Ideal transformator modeli (yo‘qotishlarsiz): U1·I1 ≈ U2·I2. Transformator faqat o‘zgaruvchan tokda ishlaydi." }));
      vz.check(s);
    }
    chiz();
  };

  /* ===================== To'rt taktli dvigatel ===================== */
  S.dvigatel = function (el, p, api) {
    var TK = [["So‘rish", "Porshen pastga harakatlanadi, kiritish klapani ochiq — silindrga yonilg‘i-havo aralashmasi (dizelda havo) so‘riladi."],
      ["Siqish", "Ikkala klapan yopiq, porshen yuqoriga ko‘tarilib aralashmani siqadi; harorat va bosim oshadi."],
      ["Ishchi yo‘l (kengayish)", "Yuqori chekka nuqta yaqinida sham uchquni aralashmani yondiradi (dizelda yonilg‘i purkaladi). Gazlar porshenni pastga itaradi — foydali ish bajariladi."],
      ["Chiqarish", "Chiqarish klapani ochiq, porshen yuqoriga ko‘tarilib ishlatilgan gazlarni chiqarish trubasiga itaradi."]];
    var s = { a: 0, run: false, v: 3, paused: false, takt: 0 };
    var sv = U.svgBox(300, 380, "ld-sv"), info = E("div", { cls: "lx-info", "aria-live": "polite" }), ctl = E("div", { cls: "lz-top" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", { cls: "ld-w" }, [sv]), E("div", {}, [ctl, info])]));
    var pb = E("button", { type: "button", cls: "btn sm", text: "▶ Ishga tushirish" });
    pb.addEventListener("click", function () { s.run = !s.run; if (s.run) s.paused = false; else s.paused = true; pb.textContent = s.run ? "⏸ To‘xtatish" : "▶ Davom ettirish"; tek(); });
    var nb = E("button", { type: "button", cls: "btn ghost sm", text: "⏭ Keyingi takt" });
    nb.addEventListener("click", function () { s.a = (Math.floor(s.a / 180) + 1) % 4 * 180 + 90; s.run = false; s.paused = true; pb.textContent = "▶ Davom ettirish"; chiz(); tek(); });
    ctl.appendChild(E("div", { cls: "lq-top" }, [pb, nb]));
    ctl.appendChild(rng({ l: "Aylanish tezligi", min: 1, max: 12, q: 1, v: s.v, u: "" }, function (v) { s.v = v; }));
    var vz = U.vazifalar(ctl, p.vazifalar || [
      { m: "Dvigatelni ishga tushiring.", f: "s.run" },
      { m: "«Siqish» taktida to‘xtating (ikkala klapan yopiq, porshen yuqoriga).", f: "s.paused && s.takt==1" },
      { m: "«Ishchi yo‘l» taktida to‘xtating.", f: "s.paused && s.takt==2" },
      { m: "Chiqarish klapani ochiq paytda to‘xtating.", f: "s.paused && s.takt==3" }
    ], api);
    function tek() { vz.check(s); }
    function chiz() {
      var a = s.a % 720, th = a * Math.PI / 180, r = 42, l = 125, cx = 150, cy = 300;
      var py = cy - (r * Math.cos(th) + Math.sqrt(l * l - Math.pow(r * Math.sin(th), 2)));
      var takt = Math.floor(a / 180); s.takt = takt;
      var kir = takt === 0 ? Math.sin((a) / 180 * Math.PI) * 12 : 0, chq = takt === 3 ? Math.sin((a - 540) / 180 * Math.PI) * 12 : 0;
      var top = 96, ptop = py - 22;
      var gaz = ["#bfe3ff", "#7fb8e6", a < 400 ? "#ffb347" : "#f6c78d", "#c9c9c9"][takt];
      sv.innerHTML = "";
      sv.appendChild(V("rect", { x: 60, y: 30, width: 180, height: 66, rx: 6, fill: "#c4ccd4", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("rect", { x: 92, y: top, width: 116, height: 200, fill: "#eef1f4", stroke: "#334", "stroke-width": 3 }));
      sv.appendChild(V("rect", { x: 95, y: top, width: 110, height: Math.max(0, ptop - top), fill: gaz }));
      sv.appendChild(V("path", { d: "M60,52 H30 M240,52 H270", stroke: "#334", "stroke-width": 14, "stroke-linecap": "round", opacity: ".25" }));
      sv.appendChild(V("text", { x: 34, y: 24, "font-size": 11, fill: "#1f5fa6", text: "Kiritish" }));
      sv.appendChild(V("text", { x: 222, y: 24, "font-size": 11, fill: "#7f5539", text: "Chiqarish" }));
      [[120, kir, "#1f5fa6"], [180, chq, "#7f5539"]].forEach(function (k) {
        sv.appendChild(V("line", { x1: k[0], y1: 40, x2: k[0], y2: 86 + k[1], stroke: k[2], "stroke-width": 4 }));
        sv.appendChild(V("path", { d: "M" + (k[0] - 14) + "," + (96 + k[1]) + " L" + (k[0] + 14) + "," + (96 + k[1]) + " L" + (k[0] + 6) + "," + (88 + k[1]) + " L" + (k[0] - 6) + "," + (88 + k[1]) + " Z", fill: k[2] }));
      });
      sv.appendChild(V("rect", { x: 144, y: 34, width: 12, height: 52, rx: 3, fill: "#fff", stroke: "#334", "stroke-width": 2 }));
      if (a >= 345 && a <= 385) sv.appendChild(V("path", { d: "M150,90 l6,10 l10,-2 l-7,8 l7,8 l-10,-2 l-6,10 l-6,-10 l-10,2 l7,-8 l-7,-8 l10,2 z", fill: "#ffd000", stroke: "#e67e22" }));
      sv.appendChild(V("rect", { x: 96, y: ptop, width: 108, height: 44, rx: 4, fill: "#8d99a6", stroke: "#334", "stroke-width": 2 }));
      [ptop + 8, ptop + 15].forEach(function (y) { sv.appendChild(V("line", { x1: 96, y1: y, x2: 204, y2: y, stroke: "#334", "stroke-width": 1.2 })); });
      var kx = cx + r * Math.sin(th), ky = cy - r * Math.cos(th);
      sv.appendChild(V("circle", { cx: cx, cy: cy, r: 58, fill: "#dfe4ea", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("line", { x1: cx, y1: cy, x2: kx, y2: ky, stroke: "#556", "stroke-width": 14, "stroke-linecap": "round" }));
      sv.appendChild(V("line", { x1: kx, y1: ky, x2: cx, y2: py, stroke: "#6c7a89", "stroke-width": 10, "stroke-linecap": "round" }));
      sv.appendChild(V("circle", { cx: cx, cy: py, r: 6, fill: "#334" })); sv.appendChild(V("circle", { cx: kx, cy: ky, r: 7, fill: "#334" })); sv.appendChild(V("circle", { cx: cx, cy: cy, r: 8, fill: "#222" }));
      sv.appendChild(V("text", { x: 150, y: 374, "text-anchor": "middle", "font-size": 13, fill: "#334", text: "Tirsakli val: " + Math.round(a) + "° / 720°" }));
      info.innerHTML = "";
      info.appendChild(E("h4", { text: (takt + 1) + "-takt: " + TK[takt][0] }));
      info.appendChild(E("p", { text: TK[takt][1] }));
      info.appendChild(E("p", { cls: "small muted", text: "Kiritish klapani: " + (kir > 0.5 ? "ochiq" : "yopiq") + " · Chiqarish klapani: " + (chq > 0.5 ? "ochiq" : "yopiq") + ". Bir ish sikli = tirsakli valning 2 marta aylanishi (720°)." }));
    }
    function loop() { if (!el.isConnected) return; if (s.run) { s.a = (s.a + s.v) % 720; chiz(); } requestAnimationFrame(loop); }
    chiz(); loop();
  };

  /* ===================== Qo'lda yoyli payvandlash ===================== */
  S.payvand = function (el, p, api) {
    var s = { s: 4, d: 3, I: 90, L: 3, v: "m", shhv: { niqob: false, qolqop: false, kiyim: false } }, yaxshi = {}, xato = 0;
    function dRec(t) { return t <= 2 ? 2 : t <= 5 ? 3 : t <= 10 ? 4 : 5; }
    var ctl = E("div", { cls: "lz-top" }), sv = U.svgBox(420, 200, "lp-sv"), info = E("div", { cls: "lx-info", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [sv, info]), ctl]));
    ctl.appendChild(E("b", { cls: "small", text: "Shaxsiy himoya vositalari" }));
    var sh = E("div", { cls: "lp-sh" });
    [["niqob", "🥽 Payvandchi niqobi (svetofiltr)"], ["qolqop", "🧤 Brezent qo‘lqop (kraga)"], ["kiyim", "🦺 Brezent kostyum va botinka"]].forEach(function (x) {
      var c = E("input", { type: "checkbox" }); c.addEventListener("change", function () { s.shhv[x[0]] = c.checked; });
      sh.appendChild(E("label", { cls: "chk" }, [c, x[1]]));
    });
    ctl.appendChild(sh);
    function sel(l, L, v, cb) { var w = E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: l })]), q = E("select", { "aria-label": l }); L.forEach(function (x) { q.appendChild(E("option", { value: x[0], text: x[1] })); }); q.value = v; q.addEventListener("change", function () { cb(q.value); }); w.appendChild(q); return w; }
    ctl.appendChild(sel("Metall qalinligi", [[2, "2 mm"], [4, "4 mm"], [6, "6 mm"], [10, "10 mm"], [14, "14 mm"]], s.s, function (v) { s.s = +v; }));
    ctl.appendChild(sel("Elektrod diametri", [[2, "2 mm"], [2.5, "2,5 mm"], [3, "3 mm"], [4, "4 mm"], [5, "5 mm"]], s.d, function (v) { s.d = +v; }));
    ctl.appendChild(rng({ l: "Payvandlash toki I", min: 30, max: 260, q: 5, v: s.I, u: "A" }, function (v) { s.I = v; }));
    ctl.appendChild(rng({ l: "Yoy uzunligi", min: 0.5, max: 8, q: 0.5, v: s.L, u: "mm" }, function (v) { s.L = v; }));
    ctl.appendChild(E("span", { cls: "small", text: "Elektrodni surish tezligi:" }));
    ctl.appendChild(seg([["s", "Sekin"], ["m", "Me’yorida"], ["t", "Tez"]], "m", function (v) { s.v = v; }));
    var go = E("button", { type: "button", cls: "btn", text: "⚡ Payvandlash" }); ctl.appendChild(go);
    ctl.appendChild(E("p", { cls: "small muted", text: "Tavsiya: tok I ≈ (20 + 6d)·d, bu yerda d — elektrod diametri (mm); yoy uzunligi ≈ (0,5…1,1)·d." }));
    var vz = U.vazifalar(ctl, p.vazifalar || [{ m: "4 mm list uchun sifatli chok hosil qiling.", f: "s.ok4" }, { m: "10 mm list uchun sifatli chok hosil qiling.", f: "s.ok10" }], api, { ball: function () { return Math.max(40, 100 - xato * 8); } });
    function plast() {
      sv.innerHTML = "";
      sv.appendChild(V("rect", { x: 20, y: 90, width: 380, height: 40, fill: "#9aa3ad", stroke: "#334" }));
      sv.appendChild(V("line", { x1: 20, y1: 110, x2: 400, y2: 110, stroke: "#556", "stroke-dasharray": "4 4" }));
      sv.appendChild(V("text", { x: 210, y: 160, "text-anchor": "middle", "font-size": 12, fill: "#556", text: "Ikki list tutashgan joy (tutashma chok)" }));
    }
    plast();
    go.addEventListener("click", function () {
      info.innerHTML = "";
      var yoq = Object.keys(s.shhv).filter(function (k) { return !s.shhv[k]; });
      if (yoq.length) { xato++; info.appendChild(E("p", { cls: "ls-msg bad", text: "⛔ Payvandlashni boshlash mumkin emas: avval barcha himoya vositalarini kiying! Yoy nuri ko‘zni kuydiradi (elektroftalmiya), uchqunlar terini kuydiradi." })); bip(160, 0.2); return; }
      var dr = dRec(s.s), Ir = (20 + 6 * s.d) * s.d, M = [], q = 0;
      if (s.d !== dr && !(s.s <= 2 && s.d === 2.5)) { M.push("Elektrod diametri " + fx(s.s, 0) + " mm metall uchun mos emas (tavsiya: " + fx(dr, 0) + " mm)."); q++; }
      if (s.I < Ir * 0.85) { M.push("Tok kam (tavsiya ≈ " + Math.round(Ir) + " A): yoy beqaror, elektrod yopishadi, chok tor va baland, metall chala eriydi."); q++; }
      if (s.I > Ir * 1.15) { M.push("Tok ortiqcha (tavsiya ≈ " + Math.round(Ir) + " A): metall ko‘p sachraydi, chok chetlari kesiladi (podrez), yupqa metall teshilishi mumkin."); q++; }
      if (s.L > 1.1 * s.d) { M.push("Yoy uzun: sachrash va g‘ovaklik ko‘payadi, chok noto‘g‘ri shakllanadi."); q++; }
      if (s.L < 0.5 * s.d) { M.push("Yoy juda qisqa: elektrod metallga yopishib qoladi."); q++; }
      if (s.v === "t") { M.push("Tezlik katta: chok ingichka, chala payvandlanish xavfi."); q++; }
      if (s.v === "s") { M.push("Tezlik juda sekin: chok keng va qavariq, metall qizib ketadi."); q++; }
      var t = 0, w = Math.max(4, Math.min(22, s.I / 10 * (s.v === "t" ? 0.6 : s.v === "s" ? 1.4 : 1))), path = [];
      go.disabled = true;
      (function an() {
        t += 6; plast();
        var g = V("g", {});
        for (var x = 30; x < 30 + t && x < 390; x += Math.max(3, 9 - s.I / 40)) g.appendChild(V("ellipse", { cx: x, cy: 110, rx: 5, ry: w / 2 + (q ? (Math.random() * 3) : 0), fill: q ? "#7b6f63" : "#b9a58c", stroke: "#4b3f33", "stroke-width": 0.8 }));
        sv.appendChild(g);
        var hx = Math.min(390, 30 + t);
        if (hx < 390) {
          sv.appendChild(V("circle", { cx: hx, cy: 110, r: 14, fill: "rgba(170,220,255,.9)" }));
          for (var i = 0; i < 10; i++) { var a = Math.random() * Math.PI, rr = 10 + Math.random() * (s.I / 6); sv.appendChild(V("line", { x1: hx, y1: 110, x2: hx + Math.cos(a) * rr, y2: 110 - Math.sin(a) * rr, stroke: "#ffcc33", "stroke-width": 1.5 })); }
          sv.appendChild(V("line", { x1: hx, y1: 110 - s.L * 3, x2: hx - 30, y2: 20, stroke: "#556", "stroke-width": 5 }));
          requestAnimationFrame(an);
        } else {
          go.disabled = false;
          if (!q) { info.appendChild(E("p", { cls: "ls-msg ok", text: "✅ Sifatli chok: tekis, bir xil kenglikda, sachrashsiz. Rejim to‘g‘ri tanlandi (" + fx(s.s, 0) + " mm, d = " + fx(s.d, 1) + " mm, I = " + s.I + " A)." })); if (s.s === 4) s.ok4 = 1; if (s.s === 10) s.ok10 = 1; }
          else { xato++; info.appendChild(E("p", { cls: "ls-msg bad", text: "Chokda nuqsonlar bor:" })); var ul = E("ul"); M.forEach(function (m) { ul.appendChild(E("li", { text: m })); }); info.appendChild(ul); }
          vz.check(s);
        }
      })();
    });
  };

  /* ===================== Cho'zilishga sinash (σ–ε diagrammasi) ===================== */
  S.chozish = function (el, p, api) {
    var M = p.materiallar || [
      { n: "Po‘lat St3", E: 200000, sT: 245, sB: 420, d: 26, pl: 1 },
      { n: "Po‘lat 45", E: 200000, sT: 355, sB: 600, d: 16, pl: 1 },
      { n: "Alyuminiy qotishmasi D16T", E: 72000, sT: 290, sB: 440, d: 11 },
      { n: "Mis M1 (yumshatilgan)", E: 110000, sT: 70, sB: 220, d: 45 },
      { n: "Kulrang cho‘yan SCh20", E: 100000, sT: 0, sB: 200, d: 0.6, mo: 1 }
    ];
    var s = { m: 0, e: 0, run: false, uz: false, korildi: {}, uzildi: {} }, A0 = 78.5;
    var ctl = E("div", { cls: "lz-top" }), cv = U.canvas(520, 300), sv = U.svgBox(120, 300, "lc-sv"), out = E("div", { cls: "lk-out" });
    el.appendChild(E("div", { cls: "lc-g" }, [sv, cv, E("div", {}, [ctl, out])]));
    var q = E("select", { "aria-label": "Material" }); M.forEach(function (m, i) { q.appendChild(E("option", { value: i, text: m.n })); });
    q.addEventListener("change", function () { s.m = +q.value; s.e = 0; s.uz = false; s.run = false; pts = []; ch(); });
    ctl.appendChild(E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: "Namuna materiali (d₀ = 10 mm)" }), q]));
    var b = E("button", { type: "button", cls: "btn sm", text: "▶ Yuklash (cho‘zish)" }); b.addEventListener("click", function () { if (s.uz) { s.e = 0; s.uz = false; pts = []; } s.run = !s.run; ch(); });
    ctl.appendChild(b);
    var vz = U.vazifalar(ctl, p.vazifalar || [
      { m: "Po‘lat St3 namunasida oquvchanlik maydonchasiga yeting (σ ≈ σт).", f: "s.korildi.oq" },
      { m: "Po‘lat St3 namunasini uzilguncha cho‘zing.", f: "s.uzildi[0]" },
      { m: "Cho‘yan namunasini uzing va uning mo‘rtligini (deyarli cho‘zilmasligini) solishtiring.", f: "s.uzildi[4]" }
    ], api);
    var pts = [];
    function sigma(m, e) {
      var eT = m.sT / m.E * 100;
      if (m.mo) { return Math.min(m.sB, m.E * e / 100 * (1 - e / (m.d * 2.2))); }
      if (e <= eT) return m.E * e / 100;
      var eP = m.pl ? eT + 1.6 : eT, eU = m.d * 0.62;
      if (e <= eP) return m.sT;
      if (e <= eU) { var t = (e - eP) / (eU - eP); return m.sT + (m.sB - m.sT) * (1 - Math.pow(1 - t, 2)); }
      var t2 = (e - eU) / (m.d - eU); return m.sB - (m.sB * 0.22) * t2 * t2;
    }
    function bosqich(m, e) {
      if (m.mo) return e >= m.d ? "Mo‘rt uzilish (bo‘yinsiz)" : "Elastik deformatsiya (mo‘rt material)";
      var eT = m.sT / m.E * 100, eU = m.d * 0.62;
      return e <= eT ? "Elastik deformatsiya (Guk qonuni: σ = E·ε)" : e <= (m.pl ? eT + 1.6 : eT) + 0.001 ? "Oquvchanlik (yuk oshmasa ham cho‘ziladi)" : e <= eU ? "Mustahkamlanish (naklep)" : e < m.d ? "Bo‘yin hosil bo‘lishi (mahalliy torayish)" : "Uzilish";
    }
    function ch() {
      var m = M[s.m], x = cv.x, W = cv.W, H = cv.H, emax = Math.max(M[s.m].d * 1.1, 2), smax = 700;
      b.textContent = s.uz ? "↻ Yangi namuna" : s.run ? "⏸ To‘xtatish" : "▶ Yuklash (cho‘zish)";
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H);
      x.strokeStyle = "#e3e3e3"; x.lineWidth = 1;
      for (var i = 0; i <= 7; i++) { var yy = H - 30 - i * (H - 50) / 7; x.beginPath(); x.moveTo(45, yy); x.lineTo(W - 10, yy); x.stroke(); x.fillStyle = "#666"; x.font = "11px sans-serif"; x.fillText(String(i * 100), 8, yy + 4); }
      x.strokeStyle = "#334"; x.beginPath(); x.moveTo(45, 10); x.lineTo(45, H - 30); x.lineTo(W - 10, H - 30); x.stroke();
      x.fillStyle = "#334"; x.fillText("σ, MPa", 50, 18); x.fillText("ε, %", W - 40, H - 12);
      for (i = 0; i <= 5; i++) { var xx = 45 + i * (W - 60) / 5; x.fillText(fx(emax * i / 5, emax < 5 ? 1 : 0), xx - 6, H - 14); }
      x.strokeStyle = "#b5541b"; x.lineWidth = 2.4; x.beginPath();
      pts.forEach(function (pt, k) { var px = 45 + pt[0] / emax * (W - 60), py = H - 30 - pt[1] / smax * (H - 50); if (k === 0) x.moveTo(px, py); else x.lineTo(px, py); });
      x.stroke();
      var sg = sigma(m, s.e), F = sg * A0 / 1000;
      sv.innerHTML = "";
      var L0 = 200, Lx = L0 * (1 + s.e / 100 * 0.6), y0 = 150 - Lx / 2, eU = m.d * 0.62, boy = !m.mo && s.e > eU ? Math.min(0.55, (s.e - eU) / (m.d - eU) * 0.55) : 0;
      sv.appendChild(V("rect", { x: 30, y: y0 - 30, width: 60, height: 30, fill: "#556" })); sv.appendChild(V("rect", { x: 30, y: y0 + Lx, width: 60, height: 30, fill: "#556" }));
      var w = 20 * (1 - s.e / 100 * 0.25), mid = y0 + Lx / 2;
      if (s.uz) {
        sv.appendChild(V("path", { d: "M" + (60 - w / 2) + "," + y0 + " V" + (mid - 8) + " L" + (60 + w / 2) + "," + (mid - 3) + " V" + y0 + " Z", fill: "#a7b1bb", stroke: "#334" }));
        sv.appendChild(V("path", { d: "M" + (60 - w / 2) + "," + (y0 + Lx) + " V" + (mid + 3) + " L" + (60 + w / 2) + "," + (mid + 8) + " V" + (y0 + Lx) + " Z", fill: "#a7b1bb", stroke: "#334" }));
      } else sv.appendChild(V("path", { d: "M" + (60 - w / 2) + "," + y0 + " L" + (60 - w / 2) + "," + (mid - 20) + " Q" + (60 - w / 2 * (1 - boy)) + "," + mid + " " + (60 - w / 2) + "," + (mid + 20) + " L" + (60 - w / 2) + "," + (y0 + Lx) + " L" + (60 + w / 2) + "," + (y0 + Lx) + " L" + (60 + w / 2) + "," + (mid + 20) + " Q" + (60 + w / 2 * (1 - boy)) + "," + mid + " " + (60 + w / 2) + "," + (mid - 20) + " L" + (60 + w / 2) + "," + y0 + " Z", fill: "#a7b1bb", stroke: "#334" }));
      out.innerHTML = "";
      [["Bosqich", bosqich(m, s.e)], ["Nisbiy uzayish ε", fx(s.e, 2) + " %"], ["Kuchlanish σ = F/A₀", Math.round(sg) + " MPa"], ["Yuk F", fx(F, 1) + " kN"],
        ["Material: σт / σв / δ", (m.sT ? m.sT : "—") + " / " + m.sB + " MPa / " + fx(m.d, 1) + " %"]].forEach(function (r, i) { out.appendChild(E("div", { cls: "lk-r" + (i === 0 ? " as" : "") }, [E("span", { text: r[0] }), E("b", { text: r[1] })])); });
      if (s.m === 0 && s.e >= m.sT / m.E * 100 + 0.2) s.korildi.oq = 1;
      vz.check(s);
    }
    function loop() {
      if (!el.isConnected) return;
      if (s.run && !s.uz) {
        var m = M[s.m], st = m.mo ? m.d / 90 : Math.max(0.02, m.d / 260);
        if (s.e < m.sT / m.E * 100 * 1.2) st = Math.min(st, m.sT / m.E * 100 / 30);
        s.e = Math.min(m.d, s.e + st); pts.push([s.e, sigma(m, s.e)]);
        if (s.e >= m.d) { s.uz = true; s.run = false; s.uzildi[s.m] = 1; bip(120, 0.25, 0.12); }
        ch();
      }
      requestAnimationFrame(loop);
    }
    ch(); loop();
  };

  /* ===================== Matematik mayatnik ===================== */
  S.mayatnik = function (el, p, api) {
    var G = [["Yer", 9.81], ["Oy", 1.62], ["Mars", 3.71], ["Venera", 8.87], ["Yupiter", 24.79]];
    var s = { l: p.l || 0.5, g: 9.81, gn: "Yer", a0: 15, t: 0, sw: false, sw0: 0, swt: 0 };
    var sv = U.svgBox(320, 300, "lpd-sv"), ctl = E("div", { cls: "lz-top" }), out = E("div", { cls: "lk-out" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [sv]), E("div", {}, [ctl, out])]));
    ctl.appendChild(rng({ l: "Ip uzunligi l", min: 0.1, max: 2.5, q: 0.01, v: s.l, u: "m" }, function (v) { s.l = v; s.t = 0; }));
    ctl.appendChild(rng({ l: "Boshlang‘ich og‘ish burchagi", min: 3, max: 25, q: 1, v: s.a0, u: "°" }, function (v) { s.a0 = v; }));
    ctl.appendChild(E("span", { cls: "small", text: "Osmon jismi (erkin tushish tezlanishi g):" }));
    ctl.appendChild(seg(G.map(function (g) { return [g[0], g[0]]; }), "Yer", function (v) { G.forEach(function (g) { if (g[0] === v) { s.g = g[1]; s.gn = v; } }); s.t = 0; }));
    var swb = E("button", { type: "button", cls: "btn ghost sm", text: "⏱ Sekundomer: start" }), swo = E("b", { text: "0,00 s" });
    swb.addEventListener("click", function () { if (!s.sw) { s.sw = true; s.sw0 = performance.now(); swb.textContent = "⏱ Stop"; } else { s.sw = false; swb.textContent = "⏱ Sekundomer: start"; } });
    ctl.appendChild(E("div", { cls: "lq-top" }, [swb, swo, E("span", { cls: "small muted", text: "10 ta tebranish vaqtini o‘lchab, 10 ga bo‘ling." })]));
    var vz = U.vazifalar(el, p.vazifalar || [
      { m: "Yerda tebranish davri T = 2 s bo‘ladigan uzunlikni toping (±0,02 s).", f: "s.gn=='Yer' && Math.abs(s.T-2)<=0.02" },
      { m: "Uzunlik o‘zgarmagan holda Oyni tanlang: T qanday o‘zgardi?", f: "s.gn=='Oy'" },
      { m: "Yupiterda T < 1 s bo‘lsin.", f: "s.gn=='Yupiter' && s.T<1" }
    ], api);
    var last = performance.now();
    function loop(now) {
      if (!el.isConnected) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now; s.t += dt;
      s.T = 2 * Math.PI * Math.sqrt(s.l / s.g);
      var th = s.a0 * Math.PI / 180 * Math.cos(2 * Math.PI / s.T * s.t), L = 40 + s.l / 2.5 * 200, x = 160 + Math.sin(th) * L, y = 20 + Math.cos(th) * L;
      sv.innerHTML = "";
      sv.appendChild(V("rect", { x: 60, y: 10, width: 200, height: 10, fill: "#556" }));
      sv.appendChild(V("line", { x1: 160, y1: 20, x2: 160, y2: 20 + L, stroke: "#bbb", "stroke-dasharray": "4 4" }));
      sv.appendChild(V("line", { x1: 160, y1: 20, x2: x, y2: y, stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("circle", { cx: x, cy: y, r: 13, fill: "#b5541b", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("text", { x: 10, y: 290, "font-size": 12, fill: "#334", text: s.gn + ": g = " + fx(s.g, 2) + " m/s²" }));
      if (s.sw) swo.textContent = fx((now - s.sw0) / 1000, 2) + " s";
      out.innerHTML = "";
      [["Davr T = 2π√(l/g)", fx(s.T, 3) + " s"], ["Chastota ν = 1/T", fx(1 / s.T, 3) + " Hz"], ["10 tebranish vaqti", fx(10 * s.T, 2) + " s"]].forEach(function (r, i) { out.appendChild(E("div", { cls: "lk-r" + (i === 0 ? " as" : "") }, [E("span", { text: r[0] }), E("b", { text: r[1] })])); });
      vz.check(s);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };

  /* ===================== Kimyo: indikatorlar va titrlash ===================== */
  S.ph = function (el, p, api) {
    var M = p.moddalar || [["Xlorid kislota (0,1 M)", 1.0], ["Limon sharbati", 2.4], ["Osh sirkasi", 2.9], ["Gazlangan suv", 4.0], ["Qora qahva", 5.0], ["Sut", 6.6], ["Distillangan suv", 7.0], ["Dengiz suvi", 8.1], ["Ichimlik sodasi eritmasi", 8.3], ["Sovunli suv", 10.0], ["Ammiakli suv", 11.6], ["Natriy gidroksid (0,01 M)", 12.0]];
    var IND = { lakmus: "Lakmus", fenol: "Fenolftalein", metil: "Metiloranj", univ: "Universal indikator" };
    var s = { m: null, ph: null, ind: null, V: 0, tit: false };
    function rang(ind, ph) {
      if (ind === "lakmus") return ph < 5 ? ["#d7263d", "qizil"] : ph <= 8 ? ["#8e44ad", "binafsha"] : ["#2e5cb8", "ko‘k"];
      if (ind === "fenol") return ph < 8.2 ? ["rgba(240,248,255,.6)", "rangsiz"] : ["hsl(322,80%," + Math.max(42, 70 - (ph - 8.2) * 8) + "%)", "to‘q pushti (malina)"];
      if (ind === "metil") return ph < 3.1 ? ["#e8392b", "qizil"] : ph <= 4.4 ? ["#f39c12", "to‘q sariq"] : ["#f4d03f", "sariq"];
      if (ind === "univ") { var h = ph <= 7 ? ph / 7 * 120 : 120 + (ph - 7) / 7 * 160; return ["hsl(" + h + ",75%,50%)", "pH ≈ " + Math.round(ph)]; }
      return ["rgba(220,235,250,.7)", ""];
    }
    var rj = seg([["i", "Indikatorlar"], ["t", "Neytrallash (titrlash)"]], "i", function (v) { s.tit = v === "t"; bosh(); });
    el.appendChild(E("div", { cls: "lq-top" }, [rj]));
    var g = E("div", { cls: "lph-g" }), sv = U.svgBox(160, 300, "lph-sv"), right = E("div", {}), info = E("div", { cls: "lx-info", "aria-live": "polite" });
    g.appendChild(sv); g.appendChild(right); el.appendChild(g);
    var vz = U.vazifalar(el, p.vazifalar || [
      { m: "Kislotali moddani aniqlang: lakmus qizarsin.", f: "s.ind=='lakmus' && s.ph!=null && s.ph<5 && !s.tit" },
      { m: "Ishqoriy moddani fenolftalein bilan aniqlang.", f: "s.ind=='fenol' && s.ph!=null && s.ph>=8.2 && !s.tit" },
      { m: "Titrlashda ekvivalent nuqtaga yeting: eritma pushti rangga kirsin, sarflangan NaOH ≤ 10,2 mL.", f: "s.tit && s.ph>=8.2 && s.V<=10.2" }
    ], api);
    function probirka() {
      sv.innerHTML = "";
      var c = s.ph == null ? ["rgba(0,0,0,0)", ""] : rang(s.ind, s.ph);
      var lv = s.tit ? 150 - Math.min(90, s.V * 4) : s.ph == null ? 260 : 150;
      sv.appendChild(V("path", { d: "M50,20 V250 A30,30 0 0 0 110,250 V20", fill: "none", stroke: "#334", "stroke-width": 3 }));
      if (s.ph != null) sv.appendChild(V("path", { d: "M52," + lv + " V250 A28,28 0 0 0 108,250 V" + lv + " Z", fill: s.ind ? c[0] : "rgba(200,225,250,.75)" }));
      sv.appendChild(V("line", { x1: 40, y1: 20, x2: 120, y2: 20, stroke: "#334", "stroke-width": 3 }));
      if (s.tit) { sv.appendChild(V("rect", { x: 74, y: 0, width: 12, height: 12, fill: "#d5dde8", stroke: "#334" })); }
    }
    function bosh() {
      right.innerHTML = ""; info.innerHTML = ""; s.ph = null; s.ind = null; s.m = null; s.V = 0;
      if (!s.tit) {
        right.appendChild(E("small", { cls: "muted", text: "1) Probirkaga modda quying:" }));
        var ml = E("div", { cls: "lph-l" });
        M.forEach(function (m) { var b = E("button", { type: "button", cls: "lm-b", text: m[0] }); b.addEventListener("click", function () { s.m = m[0]; s.ph = m[1]; s.ind = null; yoz(); }); ml.appendChild(b); });
        right.appendChild(ml);
        right.appendChild(E("small", { cls: "muted", text: "2) Indikator tomizing:" }));
        var il = E("div", { cls: "lq-top" });
        Object.keys(IND).forEach(function (k) { var b = E("button", { type: "button", cls: "btn ghost sm", text: "💧 " + IND[k] }); b.addEventListener("click", function () { if (s.ph == null) { info.innerHTML = ""; info.appendChild(E("p", { cls: "ls-msg", text: "Avval probirkaga modda quying." })); return; } s.ind = k; yoz(); }); il.appendChild(b); });
        right.appendChild(il);
      } else {
        s.ph = 1; s.ind = "fenol"; s.m = "HCl";
        right.appendChild(E("p", { cls: "ls-sav", text: "Kolbada 10 mL 0,1 M xlorid kislota + 2 tomchi fenolftalein. Byuretkadan 0,1 M natriy gidroksid qo‘shib boring: HCl + NaOH → NaCl + H₂O." }));
        var bt = E("div", { cls: "lq-top" });
        [[1, "+1 mL"], [0.5, "+0,5 mL"], [0.1, "+0,1 mL (tomchi)"]].forEach(function (x) { var b = E("button", { type: "button", cls: "btn sm", text: x[1] }); b.addEventListener("click", function () { s.V = Math.round((s.V + x[0]) * 10) / 10; tit(); }); bt.appendChild(b); });
        var rb = E("button", { type: "button", cls: "btn ghost sm", text: "↻ Qaytadan" }); rb.addEventListener("click", function () { bosh(); }); bt.appendChild(rb);
        right.appendChild(bt); tit();
      }
      right.appendChild(info); probirka(); vz.check(s);
    }
    function tit() {
      var nA = 1.0, nB = s.V * 0.1, Vt = (10 + s.V) / 1000, ph;
      if (Math.abs(nA - nB) < 1e-9) ph = 7; else if (nB < nA) ph = -Math.log10((nA - nB) / 1000 / Vt); else ph = 14 + Math.log10((nB - nA) / 1000 / Vt);
      s.ph = ph; var c = rang("fenol", ph);
      info.innerHTML = "";
      info.appendChild(E("div", { cls: "lk-out" }, [E("div", { cls: "lk-r as" }, [E("span", { text: "Qo‘shilgan NaOH" }), E("b", { text: fx(s.V, 1) + " mL" })]), E("div", { cls: "lk-r" }, [E("span", { text: "Eritma pH" }), E("b", { text: fx(ph, 2) })]), E("div", { cls: "lk-r" }, [E("span", { text: "Rangi" }), E("b", { text: c[1] })])]));
      info.appendChild(E("p", { cls: "small muted", text: ph < 6.5 ? "Hali kislota ortiqcha." : ph < 8.2 ? "Ekvivalent nuqtaga juda yaqin — tomchilab qo‘shing!" : s.V <= 10.2 ? "✅ Ekvivalent nuqta: bir tomchi ishqor eritmani pushti rangga bo‘yadi. Sarflangan hajm ≈ 10 mL." : "Ishqor ortiqcha qo‘shib yuborildi (ekvivalent nuqtadan o‘tib ketildi)." }));
      probirka(); vz.check(s);
    }
    function yoz() {
      info.innerHTML = "";
      info.appendChild(E("h4", { text: s.m }));
      var t = s.ph < 7 ? "kislotali" : s.ph > 7 ? "ishqoriy" : "neytral";
      if (s.ind) { var c = rang(s.ind, s.ph); info.appendChild(E("p", { html: IND[s.ind] + " rangi: <b></b>" })); info.querySelector("b").textContent = c[1]; }
      else info.appendChild(E("p", { cls: "muted", text: "Endi indikator tomizing." }));
      if (s.ind) info.appendChild(E("p", { text: "Muhit: " + t + " (pH ≈ " + fx(s.ph, 1) + ")." }));
      var sk = E("div", { cls: "lph-sk" }); for (var i = 0; i <= 14; i++) sk.appendChild(E("span", { text: String(i), style: "background:" + rang("univ", i)[0] + (s.ind && Math.round(s.ph) === i ? ";outline:3px solid #222" : "") }));
      info.appendChild(sk);
      probirka(); vz.check(s);
    }
    bosh();
  };

  /* ===================== Funksiya grafigi ===================== */
  S.grafik = function (el, p, api) {
    var PR = p.funksiyalar || [["a*x^2+b*x+c", "Kvadrat funksiya"], ["a*x+b", "Chiziqli funksiya"], ["a*x^3+b*x", "Kub funksiya"], ["a*sin(b*x)+c", "Sinusoida"], ["a*abs(x-b)+c", "Modul"], ["a*2^(b*x)", "Ko‘rsatkichli"], ["a*log(x)+b", "Logarifmik (ln x)"], ["a/x+c", "Giperbola"]];
    var s = { f: PR[0][0], a: 1, b: 0, c: -2, z: 10 };
    var cv = U.canvas(560, 420), ctl = E("div", { cls: "lz-top" }), out = E("div", { cls: "lk-out" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [cv]), E("div", {}, [ctl, out])]));
    var sel = E("select", { "aria-label": "Funksiya turi" }); PR.forEach(function (x) { sel.appendChild(E("option", { value: x[0], text: x[1] + ": y = " + x[0] })); });
    var inp = E("input", { type: "text", value: s.f, "aria-label": "Funksiya formulasi", spellcheck: "false" });
    sel.addEventListener("change", function () { s.f = sel.value; inp.value = s.f; ch(); });
    inp.addEventListener("input", function () { s.f = inp.value; ch(); });
    ctl.appendChild(E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: "Funksiya" }), sel]));
    ctl.appendChild(E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: "y =" }), inp]));
    var ra = rng({ l: "a", min: -5, max: 5, q: 0.1, v: s.a }, function (v) { s.a = v; ch(); }), rb = rng({ l: "b", min: -5, max: 5, q: 0.1, v: s.b }, function (v) { s.b = v; ch(); }), rc = rng({ l: "c", min: -5, max: 5, q: 0.1, v: s.c }, function (v) { s.c = v; ch(); });
    ctl.appendChild(ra); ctl.appendChild(rb); ctl.appendChild(rc);
    ctl.appendChild(seg([[5, "±5"], [10, "±10"], [20, "±20"]], 10, function (v) { s.z = +v; ch(); }));
    var vz = U.vazifalar(el, p.vazifalar || [
      { m: "Kvadrat funksiyada parabola shoxlarini pastga qarating (a < 0).", f: "s.kv && s.a<0" },
      { m: "Parabola Ox o‘qini kesmasin (diskriminant D < 0).", f: "s.kv && s.D<0" },
      { m: "Parabola uchini (1; −4) nuqtaga keltiring.", f: "s.kv && Math.abs(s.x0-1)<0.06 && Math.abs(s.y0+4)<0.06" },
      { m: "Chiziqli funksiya grafigi (0; 3) nuqtadan o‘tib, kamayuvchi bo‘lsin.", f: "s.f=='a*x+b' && s.a<0 && Math.abs(s.b-3)<0.06" }
    ], api);
    function kompil(f) {
      var t = String(f).toLowerCase().replace(/\s+/g, "").replace(/,/g, ".").replace(/\^/g, "**").replace(/(\d)([a-z(])/g, "$1*$2").replace(/\)([a-z0-9(])/g, ")*$1").replace(/(^|[(+\-*/])-(?=[a-z0-9.(])/g, "$1-1*");
      if (/[^a-z0-9.+\-*/()]/.test(t)) throw new Error("ruxsat etilmagan belgi");
      var ok = { x: 1, a: 1, b: 1, c: 1, sin: 1, cos: 1, tan: 1, tg: 1, sqrt: 1, abs: 1, log: 1, ln: 1, lg: 1, exp: 1, pi: 1, e: 1 };
      (t.match(/[a-z]+/g) || []).forEach(function (w) { if (!ok[w]) throw new Error("noma’lum: " + w); });
      t = t.replace(/\b(sin|cos|tan|sqrt|abs|exp)\(/g, "Math.$1(").replace(/\btg\(/g, "Math.tan(").replace(/\b(log|ln)\(/g, "Math.log(").replace(/\blg\(/g, "Math.log10(").replace(/\bpi\b/g, "Math.PI").replace(/\be\b/g, "Math.E");
      return new Function("x", "a", "b", "c", "return " + t + ";");
    }
    function ch() {
      var x = cv.x, W = cv.W, H = cv.H, Z = s.z, sx = W / (2 * Z), sy = H / (2 * Z * H / W), Zy = Z * H / W, fn, err = "";
      try { fn = kompil(s.f); fn(1, s.a, s.b, s.c); } catch (e) { err = "Formulada xato: " + e.message; fn = null; }
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H);
      x.strokeStyle = "#eee"; x.lineWidth = 1; var st = Z <= 5 ? 1 : Z <= 10 ? 1 : 2;
      for (var i = -Z; i <= Z; i += st) { x.beginPath(); x.moveTo(W / 2 + i * sx, 0); x.lineTo(W / 2 + i * sx, H); x.stroke(); }
      for (i = -Math.ceil(Zy); i <= Zy; i += st) { x.beginPath(); x.moveTo(0, H / 2 - i * sy); x.lineTo(W, H / 2 - i * sy); x.stroke(); }
      x.strokeStyle = "#334"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, H / 2); x.lineTo(W, H / 2); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.stroke();
      x.fillStyle = "#556"; x.font = "11px sans-serif";
      for (i = -Z; i <= Z; i += (Z <= 5 ? 1 : Z <= 10 ? 2 : 5)) if (i) { x.fillText(String(i), W / 2 + i * sx - 4, H / 2 + 13); x.fillText(String(i), W / 2 + 4, H / 2 - i * sy + 4); }
      x.fillText("x", W - 12, H / 2 - 6); x.fillText("y", W / 2 + 6, 12);
      out.innerHTML = "";
      if (fn) {
        x.strokeStyle = "#b5541b"; x.lineWidth = 2.6; x.beginPath(); var pen = false, prev = null, ild = [];
        for (var px = 0; px <= W; px += 1) {
          var xv = (px - W / 2) / sx, yv = fn(xv, s.a, s.b, s.c);
          if (!isFinite(yv) || Math.abs(yv) > Zy * 20) { pen = false; prev = null; continue; }
          var py = H / 2 - yv * sy;
          if (pen && prev != null && Math.abs(py - prev) > H) pen = false;
          if (!pen) { x.moveTo(px, py); pen = true; } else x.lineTo(px, py);
          if (prev != null && ((prev - H / 2) * (py - H / 2) < 0 || py === H / 2)) ild.push(xv);
          prev = py;
        }
        x.stroke();
        s.kv = s.f.replace(/\s/g, "") === "a*x^2+b*x+c";
        var y0 = fn(0, s.a, s.b, s.c);
        out.appendChild(E("div", { cls: "lk-r" }, [E("span", { text: "Oy o‘qi bilan kesishish" }), E("b", { text: isFinite(y0) ? "(0; " + fx(y0, 2) + ")" : "yo‘q" })]));
        out.appendChild(E("div", { cls: "lk-r" }, [E("span", { text: "Ox o‘qi bilan kesishish (taxminan)" }), E("b", { text: ild.length ? ild.slice(0, 6).map(function (v) { return "x ≈ " + fx(v, 2); }).join("; ") : "yo‘q" })]));
        if (s.kv && s.a !== 0) {
          s.D = s.b * s.b - 4 * s.a * s.c; s.x0 = -s.b / (2 * s.a); s.y0 = fn(s.x0, s.a, s.b, s.c);
          out.appendChild(E("div", { cls: "lk-r as" }, [E("span", { text: "Diskriminant D = b² − 4ac" }), E("b", { text: fx(s.D, 2) })]));
          out.appendChild(E("div", { cls: "lk-r" }, [E("span", { text: "Parabola uchi (x₀; y₀)" }), E("b", { text: "(" + fx(s.x0, 2) + "; " + fx(s.y0, 2) + ")" })]));
          x.fillStyle = "#1f5fa6"; x.beginPath(); x.arc(W / 2 + s.x0 * sx, H / 2 - s.y0 * sy, 4, 0, 7); x.fill();
        }
      } else out.appendChild(E("p", { cls: "ls-msg bad", text: err }));
      out.appendChild(E("p", { cls: "small muted", text: "Formulada x, a, b, c, sin, cos, tg, sqrt, abs, ln (log), lg, pi va ^ (daraja) ishlatiladi. Masalan: x^2-4, 2*sin(x), sqrt(x)." }));
      vz.check(s);
    }
    ch();
  };
})();
