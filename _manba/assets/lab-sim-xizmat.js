/* Virtual laboratoriya simulyatorlari (4-qism): tibbiy yordam, yo'l harakati, tillar, kompas, tikuvchilik, oshpazlik, sport */
(function () {
  "use strict";
  var S = window.t1LabSim, U = S && S._; if (!U) return;
  var E = U.E, V = U.V, fx = U.fx, num = U.num, rng = U.rng, seg = U.seg, bip = U.bip;
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function qator(out, L, as) { out.innerHTML = ""; L.forEach(function (r, i) { out.appendChild(E("div", { cls: "lk-r" + (i === (as || 0) ? " as" : "") }, [E("span", { text: r[0] }), E("b", { text: r[1] })])); }); }

  /* ===================== Yurak-o'pka reanimatsiyasi (30:2) ===================== */
  S.yurak = function (el, p, api) {
    var s = { n: 0, nf: 0, sikl: 0, T: [], yaxshi: 0, jami: 0, faza: "b", met: false }, mt;
    el.appendChild(E("div", { cls: "note", html: "<b>Eslatma:</b> qo‘llar ko‘krak qafasi o‘rtasida (to‘sh suyagining pastki yarmi), tirsaklar to‘g‘ri; chuqurlik 5–6 sm, tezlik daqiqasiga 100–120 marta; har bosishdan keyin ko‘krak to‘liq qaytsin. Nisbat: 30 bosish : 2 nafas." }));
    var bt = E("button", { type: "button", cls: "lyr-b", "aria-label": "Ko‘krakka bosish" }, [E("span", { text: "🫀" }), E("b", { text: "BOSISH" }), E("small", { text: "yoki «Probel» tugmasi" })]);
    var nb = E("button", { type: "button", cls: "btn lyr-n", text: "🌬 Sun’iy nafas", disabled: true });
    var mb = E("button", { type: "button", cls: "btn ghost sm", text: "🎵 Metronom (110/daq): o‘chiq" });
    var gauge = E("div", { cls: "lyr-g" }, [E("i"), E("span", { cls: "lyr-z" })]), out = E("div", { cls: "lk-out" }), msg = E("p", { cls: "ls-msg", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lyr-w" }, [bt, E("div", {}, [gauge, out, msg, E("div", { cls: "lq-top" }, [nb, mb])])]));
    mb.addEventListener("click", function () { s.met = !s.met; mb.textContent = "🎵 Metronom (110/daq): " + (s.met ? "yoqiq" : "o‘chiq"); clearInterval(mt); if (s.met) mt = setInterval(function () { if (!el.isConnected) return clearInterval(mt); bip(1000, 0.03, 0.05); }, 60000 / 110); });
    function tempo() { var L = s.T.slice(-6); if (L.length < 3) return 0; var d = (L[L.length - 1] - L[0]) / (L.length - 1); return 60000 / d; }
    function bos() {
      if (s.faza !== "b") { msg.className = "ls-msg bad"; msg.textContent = "Hozir 2 ta sun’iy nafas berish navbati!"; return; }
      var t = performance.now(); if (s.T.length && t - s.T[s.T.length - 1] > 2500) s.T = [];
      s.T.push(t); s.n++; bt.classList.remove("urildi"); void bt.offsetWidth; bt.classList.add("urildi");
      var bpm = tempo(); if (bpm) { s.jami++; if (bpm >= 100 && bpm <= 120) s.yaxshi++; }
      if (s.n >= 30) { s.faza = "n"; nb.disabled = false; msg.className = "ls-msg"; msg.textContent = "30 ta bosish bajarildi. Bosh orqaga engashtirib, iyakni ko‘taring va 2 marta sun’iy nafas bering."; }
      chiz(bpm);
    }
    nb.addEventListener("click", function () {
      if (s.faza !== "n") return; s.nf++;
      if (s.nf >= 2) { s.nf = 0; s.n = 0; s.sikl++; s.faza = "b"; s.T = []; nb.disabled = true; msg.className = "ls-msg ok"; msg.textContent = s.sikl + "-sikl yakunlandi. Bosishni davom ettiring."; if (s.sikl >= 2) { var b = s.jami ? s.yaxshi / s.jami * 100 : 0; api.done(Math.max(40, b), "To‘g‘ri tempdagi bosishlar: " + Math.round(b) + "%. Haqiqiy vaziyatda tez yordam (103) yetib kelguncha yoki defibrillyator olib kelinguncha davom ettiriladi."); } }
      chiz(tempo());
    });
    bt.addEventListener("click", bos);
    el.tabIndex = -1; el.addEventListener("keydown", function (e) { if (e.code === "Space") { e.preventDefault(); bos(); } });
    function chiz(bpm) {
      var x = Math.max(0, Math.min(100, ((bpm || 0) - 60) / 100 * 100));
      gauge.firstChild.style.left = x + "%";
      var hol = !bpm ? "—" : bpm < 100 ? "sekin" : bpm > 120 ? "tez" : "me’yorida ✓";
      qator(out, [["Tezlik", bpm ? Math.round(bpm) + " marta/daq (" + hol + ")" : "—"], ["Bosishlar", s.n + " / 30"], ["Sun’iy nafas", s.faza === "n" ? s.nf + " / 2" : "—"], ["Yakunlangan sikllar", s.sikl + " / 2"]]);
    }
    chiz(0); bt.focus();
  };

  /* ===================== Svetofor ===================== */
  S.svetofor = function (el, p, api) {
    var F = [["y", 4000, "Yashil", "Harakatlanishga ruxsat beriladi."], ["ym", 3000, "Yashil miltillovchi", "Ruxsat vaqti tugayotganini bildiradi — tez orada taqiqlovchi ishora yonadi."], ["s", 2000, "Sariq", "Harakatlanish taqiqlanadi (keskin tormozlamasdan to‘xtay olmaydigan holat bundan mustasno), ishoralar almashinishidan ogohlantiradi."], ["q", 4000, "Qizil", "Harakatlanish taqiqlanadi. Qizil miltillovchi ham taqiqlaydi."], ["qs", 1500, "Qizil va sariq birga", "Harakatlanish hali taqiqlangan; tez orada yashil ishora yonishini bildiradi."]];
    var s = { f: 0, t0: performance.now(), sav: 0, ball: 0, kut: false, muz: null };
    var sv = U.svgBox(360, 240, "lsv-sv"), msg = E("div", { cls: "lx-info", "aria-live": "polite" }), bt = E("div", { cls: "lq-top" });
    var go = E("button", { type: "button", cls: "btn", text: "▶ Harakatlanaman" }), st = E("button", { type: "button", cls: "btn ghost", text: "■ To‘xtayman" });
    bt.appendChild(go); bt.appendChild(st);
    el.appendChild(E("p", { cls: "ls-sav", text: "Siz haydovchisiz. Chorrahaga yaqinlashganda svetofor ishorasiga qarab qaror qabul qiling. 10 ta vaziyat." }));
    el.appendChild(E("div", { cls: "lz-g" }, [sv, E("div", {}, [bt, msg])]));
    function joriy(now) { var T = F.reduce(function (a, f) { return a + f[1]; }, 0), t = (now - s.t0) % T, k = 0; while (t > F[k][1]) { t -= F[k][1]; k++; } return [k, t]; }
    function chiz(k, t, mashina) {
      sv.innerHTML = "";
      sv.appendChild(V("rect", { x: 0, y: 150, width: 360, height: 70, fill: "#555" }));
      for (var i = 0; i < 360; i += 40) sv.appendChild(V("rect", { x: i, y: 183, width: 22, height: 4, fill: "#fff" }));
      for (i = 0; i < 6; i++) sv.appendChild(V("rect", { x: 250 + i * 12, y: 150, width: 7, height: 70, fill: "#fff" }));
      sv.appendChild(V("rect", { x: 300, y: 14, width: 44, height: 126, rx: 8, fill: "#222" }));
      sv.appendChild(V("rect", { x: 318, y: 140, width: 8, height: 12, fill: "#222" }));
      var id = F[k][0], mil = Math.floor(t / 350) % 2 === 0;
      [["q", 40, "#e53935"], ["s", 77, "#fbc02d"], ["y", 114, "#43a047"]].forEach(function (c) {
        var on = (c[0] === "q" && (id === "q" || id === "qs")) || (c[0] === "s" && (id === "s" || id === "qs")) || (c[0] === "y" && (id === "y" || (id === "ym" && mil)));
        sv.appendChild(V("circle", { cx: 322, cy: c[1], r: 15, fill: on ? c[2] : "#3a3a3a" }));
      });
      var mx = mashina == null ? 60 : mashina;
      sv.appendChild(V("rect", { x: mx, y: 160, width: 70, height: 26, rx: 8, fill: "#1f5fa6" }));
      sv.appendChild(V("rect", { x: mx + 14, y: 148, width: 38, height: 18, rx: 6, fill: "#5d8fd1" }));
      sv.appendChild(V("circle", { cx: mx + 16, cy: 188, r: 7, fill: "#111" })); sv.appendChild(V("circle", { cx: mx + 54, cy: 188, r: 7, fill: "#111" }));
    }
    function loop(now) {
      if (!el.isConnected) return;
      if (!s.muz) { var j = joriy(now); chiz(j[0], j[1]); }
      requestAnimationFrame(loop);
    }
    function qaror(yur) {
      if (s.sav >= 10 || s.muz) return;
      var j = joriy(performance.now()), f = F[j[0]], ok = yur === (f[0] === "y" || f[0] === "ym");
      s.sav++; if (ok) s.ball++;
      s.muz = 1; chiz(j[0], j[1], yur ? 200 : 60);
      msg.innerHTML = ""; msg.appendChild(E("p", { cls: "ls-msg " + (ok ? "ok" : "bad"), text: (ok ? "✅ To‘g‘ri. " : "❌ Xato. ") + "Ishora: " + f[2] + " — " + f[3] }));
      msg.appendChild(E("p", { cls: "small muted", text: "Vaziyat " + s.sav + " / 10 · to‘g‘ri: " + s.ball }));
      bip(ok ? 800 : 200, 0.08);
      setTimeout(function () { s.muz = null; s.t0 -= Math.random() * 5000; if (s.sav >= 10) api.done(s.ball * 10, s.ball + " / 10 to‘g‘ri qaror."); }, 1300);
    }
    go.addEventListener("click", function () { qaror(true); }); st.addEventListener("click", function () { qaror(false); });
    requestAnimationFrame(loop);
  };

  /* ===================== Til laboratoriyasi (lingafon) ===================== */
  S.til = function (el, p, api) {
    var W = p.sozlar || [], lang = p.til || "en-GB", s = { i: 0, rj: "k" }, sp = window.speechSynthesis;
    if (!W.length) return;
    function gapir(t, sekin) {
      if (!sp) { msg.className = "ls-msg bad"; msg.textContent = "Bu brauzerda ovozli o‘qish (speechSynthesis) ishlamaydi. Chrome yoki Edge’dan foydalaning."; return; }
      sp.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = sekin ? 0.6 : 0.9;
      var v = sp.getVoices().filter(function (x) { return x.lang && x.lang.replace("_", "-").toLowerCase().indexOf(lang.slice(0, 2).toLowerCase()) === 0; })[0]; if (v) u.voice = v;
      sp.speak(u);
    }
    var msg = E("p", { cls: "ls-msg", "aria-live": "polite" }), box = E("div", {});
    el.appendChild(E("div", { cls: "lq-top" }, [seg([["k", "🃏 Kartochkalar"], ["d", "✍️ Tinglab yozish (diktant)"], ["t", "🎙 Talaffuz"]], "k", function (v) { s.rj = v; bosh(); })]));
    el.appendChild(box); el.appendChild(msg);
    function bosh() {
      box.innerHTML = ""; msg.textContent = ""; msg.className = "ls-msg";
      if (s.rj === "k") karta(); else if (s.rj === "d") diktant(); else talaffuz();
    }
    function karta() {
      var c = E("button", { type: "button", cls: "ltl-k" }), oz = false;
      function ch() { var w = W[s.i]; c.innerHTML = ""; c.appendChild(E("small", { text: (s.i + 1) + " / " + W.length })); c.appendChild(E("b", { text: oz ? w[1] : w[0] })); if (w[2] && !oz) c.appendChild(E("span", { text: w[2] })); c.appendChild(E("i", { text: oz ? "bosing — asl so‘z" : "bosing — tarjimasi" })); }
      c.addEventListener("click", function () { oz = !oz; ch(); });
      var b = E("div", { cls: "lq-top" }, [E("button", { type: "button", cls: "btn ghost sm", text: "◀", onclick: function () { s.i = (s.i - 1 + W.length) % W.length; oz = false; ch(); } }),
        E("button", { type: "button", cls: "btn sm", text: "🔊 Tinglash", onclick: function () { gapir(W[s.i][0]); } }), E("button", { type: "button", cls: "btn ghost sm", text: "🐢 Sekin", onclick: function () { gapir(W[s.i][0], 1); } }),
        E("button", { type: "button", cls: "btn ghost sm", text: "▶", onclick: function () { s.i = (s.i + 1) % W.length; oz = false; ch(); } })]);
      box.appendChild(c); box.appendChild(b); ch();
    }
    function tozala(t) { return String(t).toLowerCase().replace(/[.,!?;:'’"«»—–-]/g, " ").replace(/ё/g, "е").replace(/\s+/g, " ").trim(); }
    function diktant() {
      var Q = U.shuf(W).slice(0, Math.min(8, W.length)), k = 0, ball = 0;
      function sav() {
        box.innerHTML = "";
        if (k >= Q.length) { api.done(ball / Q.length * 100, ball + " / " + Q.length + " so‘z to‘g‘ri yozildi."); box.appendChild(E("p", { cls: "ls-msg ok", text: "Diktant yakunlandi: " + ball + " / " + Q.length })); return; }
        var w = Q[k], inp = E("input", { type: "text", "aria-label": "Eshitgan so‘zingiz", autocomplete: "off", spellcheck: "false", lang: lang });
        box.appendChild(E("p", { cls: "small muted", text: "So‘z " + (k + 1) + " / " + Q.length + " · tarjimasi: «" + w[1] + "»" }));
        box.appendChild(E("div", { cls: "lq-top" }, [E("button", { type: "button", cls: "btn sm", text: "🔊 Tinglash", onclick: function () { gapir(w[0]); } }), E("button", { type: "button", cls: "btn ghost sm", text: "🐢 Sekin", onclick: function () { gapir(w[0], 1); } })]));
        var tk = E("button", { type: "button", cls: "btn sm", text: "Tekshirish" });
        box.appendChild(E("div", { cls: "lq-top" }, [inp, tk]));
        function tek() { var ok = tozala(inp.value) === tozala(w[0]); if (ok) ball++; msg.className = "ls-msg " + (ok ? "ok" : "bad"); msg.textContent = (ok ? "✅ To‘g‘ri: " : "❌ To‘g‘ri yozilishi: ") + w[0]; k++; setTimeout(sav, 1100); }
        tk.addEventListener("click", tek); inp.addEventListener("keydown", function (e) { if (e.key === "Enter") tek(); });
        setTimeout(function () { gapir(w[0]); inp.focus(); }, 200);
      }
      sav();
    }
    function talaffuz() {
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { box.appendChild(E("p", { cls: "note", text: "Bu brauzerda nutqni tanish ishlamaydi (Chrome’da ishlaydi). Kartochkalar va diktant rejimidan foydalaning." })); return; }
      var w = W[s.i], out = E("p", { cls: "lx-q" });
      box.appendChild(E("div", { cls: "ltl-k" }, [E("b", { text: w[0] }), E("span", { text: w[1] })]));
      var mic = E("button", { type: "button", cls: "btn", text: "🎙 Gapiring" });
      box.appendChild(E("div", { cls: "lq-top" }, [E("button", { type: "button", cls: "btn ghost sm", text: "🔊 Namuna", onclick: function () { gapir(w[0]); } }), mic, E("button", { type: "button", cls: "btn ghost sm", text: "Keyingi so‘z ▶", onclick: function () { s.i = (s.i + 1) % W.length; bosh(); } })]));
      box.appendChild(out);
      mic.addEventListener("click", function () {
        var r = new SR(); r.lang = lang; r.maxAlternatives = 3; out.textContent = "Tinglanmoqda…";
        r.onresult = function (e) { var L = Array.prototype.map.call(e.results[0], function (a) { return a.transcript; }), ok = L.some(function (t) { return tozala(t) === tozala(w[0]); }); out.textContent = "Siz aytdingiz: «" + L[0] + "»"; msg.className = "ls-msg " + (ok ? "ok" : "bad"); msg.textContent = ok ? "✅ Talaffuz to‘g‘ri tanildi!" : "Yana bir bor, aniqroq talaffuz qiling."; };
        r.onerror = function (e) { out.textContent = "Mikrofon xatosi: " + e.error + " (mikrofonga ruxsat bering)."; };
        r.start();
      });
    }
    if (sp && sp.getVoices && !sp.getVoices().length) sp.addEventListener && sp.addEventListener("voiceschanged", function () {});
    bosh();
  };

  /* ===================== Kompas va azimut ===================== */
  S.kompas = function (el, p, api) {
    var NY = p.nishonlar || [["🗼", "Minora", 40], ["🌉", "Ko‘prik", 115], ["🌳", "Yolg‘iz daraxt", 205], ["🏠", "Uy", 290]];
    var s = { a: 0, t: 0, ok: {}, tes: false };
    var sv = U.svgBox(320, 320, "lkp-sv"), ctl = E("div", { cls: "lz-top" }), info = E("div", { cls: "lx-info", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lz-g" }, [sv, E("div", {}, [ctl, info])]));
    ctl.appendChild(E("p", { cls: "ls-sav", text: "Kompas shimolga yo‘naltirilgan. Ko‘zlash chizig‘ini nishonga to‘g‘rilang va azimutni qayd eting. Azimut — shimol yo‘nalishidan soat mili bo‘yicha nishongacha bo‘lgan burchak (0°–360°)." }));
    var sel = E("select", { "aria-label": "Nishon" }); NY.forEach(function (n, i) { sel.appendChild(E("option", { value: i, text: n[0] + " " + n[1] })); }); sel.addEventListener("change", function () { s.t = +sel.value; chiz(); });
    ctl.appendChild(E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: "Nishon" }), sel]));
    var r = rng({ l: "Ko‘zlash yo‘nalishi", min: 0, max: 359, q: 1, v: 0, u: "°" }, function (v) { s.a = v; chiz(); }); ctl.appendChild(r);
    var qb = E("button", { type: "button", cls: "btn sm", text: "📍 Azimutni qayd etish" }); ctl.appendChild(qb);
    qb.addEventListener("click", function () {
      var n = NY[s.t], d = Math.abs(((s.a - n[2]) + 540) % 360 - 180);
      info.innerHTML = "";
      if (d <= 4) { s.ok[s.t] = 1; info.appendChild(E("p", { cls: "ls-msg ok", text: "✅ «" + n[1] + "» ga azimut " + s.a + "°. Teskari azimut: " + ((s.a + 180) % 360) + "° (qaytish yo‘nalishi)." })); bip(800, 0.06); }
      else { info.appendChild(E("p", { cls: "ls-msg bad", text: "Ko‘zlash chizig‘i nishonga to‘g‘ri kelmadi (farq " + Math.round(d) + "°). Aniqroq to‘g‘rilang." })); bip(200, 0.1); }
      var n2 = Object.keys(s.ok).length;
      info.appendChild(E("p", { cls: "small muted", text: "Aniqlangan: " + n2 + " / " + NY.length }));
      if (n2 === NY.length && !s.tes) teskari();
    });
    function teskari() {
      s.tes = true; var n = NY[0], inp = E("input", { type: "number", min: 0, max: 359, "aria-label": "Teskari azimut" }), b = E("button", { type: "button", cls: "btn sm", text: "Javob" });
      info.appendChild(E("p", { cls: "lx-q", text: "Yakuniy savol: «" + n[1] + "» ga azimut " + n[2] + "°. Undan qaytish uchun qaysi azimut bo‘yicha yurasiz?" }));
      info.appendChild(E("div", { cls: "lq-top" }, [inp, b]));
      b.addEventListener("click", function () { var ok = +inp.value === (n[2] + 180) % 360; info.appendChild(E("p", { cls: "ls-msg " + (ok ? "ok" : "bad"), text: ok ? "✅ To‘g‘ri: teskari azimut = azimut ± 180°." : "Teskari azimut = azimut + 180° (agar 360° dan oshsa, 360° ayiriladi). To‘g‘ri javob: " + (n[2] + 180) % 360 + "°." })); api.done(ok ? 100 : 75, "Barcha nishonlarga azimut aniqlandi."); b.disabled = true; });
    }
    function chiz() {
      sv.innerHTML = "";
      sv.appendChild(V("circle", { cx: 160, cy: 160, r: 150, fill: "#eef3e6", stroke: "#9bb08a" }));
      NY.forEach(function (n, i) { var a = (n[2] - 90) * Math.PI / 180; sv.appendChild(V("text", { x: 160 + 128 * Math.cos(a), y: 160 + 128 * Math.sin(a), "text-anchor": "middle", "dominant-baseline": "central", "font-size": i === s.t ? 30 : 22, opacity: i === s.t ? 1 : 0.55, text: n[0] })); });
      sv.appendChild(V("circle", { cx: 160, cy: 160, r: 92, fill: "#fff", stroke: "#334", "stroke-width": 3 }));
      for (var d = 0; d < 360; d += 10) { var a = (d - 90) * Math.PI / 180, r1 = d % 30 === 0 ? 76 : 82; sv.appendChild(V("line", { x1: 160 + r1 * Math.cos(a), y1: 160 + r1 * Math.sin(a), x2: 160 + 90 * Math.cos(a), y2: 160 + 90 * Math.sin(a), stroke: "#334", "stroke-width": d % 30 === 0 ? 2 : 1 })); if (d % 30 === 0) sv.appendChild(V("text", { x: 160 + 64 * Math.cos(a), y: 160 + 64 * Math.sin(a) + 4, "text-anchor": "middle", "font-size": 10, fill: "#334", text: String(d) })); }
      [["Shimol", 0], ["Sharq", 90], ["Janub", 180], ["G‘arb", 270]].forEach(function (k) { var a = (k[1] - 90) * Math.PI / 180; sv.appendChild(V("text", { x: 160 + 104 * Math.cos(a), y: 160 + 104 * Math.sin(a) + 4, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: k[1] === 0 ? "#c0392b" : "#334", text: k[0] })); });
      sv.appendChild(V("path", { d: "M160,100 L168,160 L160,220 L152,160 Z", fill: "#bbb" })); sv.appendChild(V("path", { d: "M160,100 L168,160 L152,160 Z", fill: "#c0392b" }));
      var aa = (s.a - 90) * Math.PI / 180;
      sv.appendChild(V("line", { x1: 160, y1: 160, x2: 160 + 150 * Math.cos(aa), y2: 160 + 150 * Math.sin(aa), stroke: "#1f5fa6", "stroke-width": 2.5, "stroke-dasharray": "8 5" }));
      sv.appendChild(V("circle", { cx: 160, cy: 160, r: 5, fill: "#334" }));
    }
    chiz();
  };

  /* ===================== Tikuv mashinasi: chok tarangligi ===================== */
  S.chok = function (el, p, api) {
    var MT = { y: { n: "Yupqa mato (shifon, ipak)", T: [3, 4], L: [1.5, 2.5], ig: [60, 75] }, o: { n: "O‘rta mato (chit, bo‘z, paxta)", T: [4, 5], L: [2.5, 3], ig: [80, 90] }, q: { n: "Qalin mato (jinsi, drap)", T: [5, 6], L: [3, 4], ig: [100, 110] } };
    var s = { m: "o", T: 2, L: 2, ig: 70, ok: {} };
    var ctl = E("div", { cls: "lz-top" }), sv = U.svgBox(420, 240, "lch-sv"), info = E("div", { cls: "lx-info", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [sv, info]), ctl]));
    ctl.appendChild(seg([["y", "Yupqa"], ["o", "O‘rta"], ["q", "Qalin"]], "o", function (v) { s.m = v; ch(); }));
    ctl.appendChild(rng({ l: "Ustki ip tarangligi", min: 0, max: 9, q: 0.5, v: s.T, u: "" }, function (v) { s.T = v; ch(); }));
    ctl.appendChild(rng({ l: "Chok (bahya) uzunligi", min: 1, max: 5, q: 0.5, v: s.L, u: "mm" }, function (v) { s.L = v; ch(); }));
    var ig = E("select", { "aria-label": "Igna raqami" }); [60, 70, 75, 80, 90, 100, 110].forEach(function (n) { ig.appendChild(E("option", { value: n, text: "Igna № " + n })); }); ig.value = s.ig; ig.addEventListener("change", function () { s.ig = +ig.value; ch(); });
    ctl.appendChild(E("label", { cls: "ls-rng" }, [E("span", { cls: "ls-rl", text: "Igna raqami" }), ig]));
    var tb = E("button", { type: "button", cls: "btn sm", text: "🧵 Sinov chokini tikish" }); ctl.appendChild(tb);
    var vz = U.vazifalar(ctl, p.vazifalar || [{ m: "Yupqa mato uchun sifatli chok sozlang.", f: "s.ok.y" }, { m: "O‘rta mato uchun sifatli chok sozlang.", f: "s.ok.o" }, { m: "Qalin mato uchun sifatli chok sozlang.", f: "s.ok.q" }], api);
    function ch(tekshir) {
      var m = MT[s.m], bal = s.T < m.T[0] ? -1 : s.T > m.T[1] ? 1 : 0;
      sv.innerHTML = "";
      sv.appendChild(V("text", { x: 10, y: 18, "font-size": 12, fill: "#334", text: "Kesim (yon tomondan): " + m.n }));
      var th = s.m === "y" ? 8 : s.m === "o" ? 14 : 22;
      sv.appendChild(V("rect", { x: 20, y: 70 - th, width: 380, height: th, fill: "#e6d3b3", stroke: "#8a7350" }));
      sv.appendChild(V("rect", { x: 20, y: 70, width: 380, height: th, fill: "#d9c39b", stroke: "#8a7350" }));
      var st = s.L * 14, yI = bal === 0 ? 70 : bal > 0 ? 70 - th - 3 : 70 + th + 3, d1 = "M20," + (70 - th - 2), d2 = "M20," + (70 + th + 2);
      for (var x = 20; x < 400; x += st) { var xm = Math.min(400, x + st); d1 += " L" + x + "," + (70 - th - 2) + " L" + x + "," + yI + " L" + x + "," + (70 - th - 2) + " L" + xm + "," + (70 - th - 2); d2 += " L" + x + "," + (70 + th + 2) + " L" + x + "," + yI + " L" + x + "," + (70 + th + 2) + " L" + xm + "," + (70 + th + 2); }
      if (bal < 0) { d2 = "M20," + (70 + th + 2); for (x = 20; x < 400; x += st) d2 += " Q" + (x + st / 2) + "," + (70 + th + 16) + " " + Math.min(400, x + st) + "," + (70 + th + 2); }
      sv.appendChild(V("path", { d: d1, fill: "none", stroke: "#1f5fa6", "stroke-width": 2.2 }));
      sv.appendChild(V("path", { d: d2, fill: "none", stroke: "#c0392b", "stroke-width": 2.2 }));
      for (x = 20; x < 400; x += st) sv.appendChild(V("circle", { cx: x, cy: yI, r: 2.6, fill: "#222" }));
      sv.appendChild(V("text", { x: 10, y: 140, "font-size": 12, fill: "#334", text: "Ustdan ko‘rinish" }));
      var yy = 175, burish = bal > 0 && s.T - m.T[1] >= 1.5;
      sv.appendChild(V("path", { d: burish ? "M20,165 Q60,155 100,165 T180,165 T260,165 T340,165 T400,165 V200 Q360,210 320,200 T240,200 T160,200 T80,200 T20,200 Z" : "M20,155 H400 V200 H20 Z", fill: "#f1e3c8", stroke: "#8a7350" }));
      for (x = 24; x < 396; x += st) { sv.appendChild(V("line", { x1: x, y1: yy, x2: Math.min(396, x + st - 3), y2: yy, stroke: "#1f5fa6", "stroke-width": 2.4 })); if (bal > 0) sv.appendChild(V("circle", { cx: x + st - 1.5, cy: yy, r: 2.2, fill: "#c0392b" })); }
      sv.appendChild(V("text", { x: 400, y: 230, "text-anchor": "end", "font-size": 11, fill: "#1f5fa6", text: "ko‘k — ustki ip, qizil — g‘altak (pastki) ip" }));
      if (!tekshir) { info.innerHTML = ""; info.appendChild(E("p", { cls: "muted", text: "Sozlab bo‘lgach «Sinov chokini tikish» tugmasini bosing." })); vz.check(s); return; }
      var M = [];
      if (bal > 0) M.push("Ustki ip juda tarang: pastki ip yuzaga chiqib, nuqta-nuqta ko‘rinadi" + (burish ? ", mato burishib qoladi" : "") + ". Taranglikni kamaytiring.");
      if (bal < 0) M.push("Ustki ip bo‘sh: ip mato ostida halqa (petlya) hosil qiladi. Taranglikni oshiring.");
      if (s.L < m.L[0]) M.push("Chok juda mayda — bu mato uchun " + fx(m.L[0], 1) + "–" + fx(m.L[1], 1) + " mm tavsiya etiladi.");
      if (s.L > m.L[1]) M.push("Chok juda yirik — bu mato uchun " + fx(m.L[0], 1) + "–" + fx(m.L[1], 1) + " mm tavsiya etiladi.");
      if (s.ig < m.ig[0] || s.ig > m.ig[1]) M.push("Igna raqami mos emas: bu mato uchun № " + m.ig[0] + "–" + m.ig[1] + ". Yo‘g‘on igna yupqa matoni teshadi, ingichka igna qalin matoda sinadi.");
      info.innerHTML = "";
      if (!M.length) { s.ok[s.m] = 1; info.appendChild(E("p", { cls: "ls-msg ok", text: "✅ Chok muvozanatli: iplar mato qatlamlari orasida chalishadi, ikki tomondan bir xil ko‘rinadi." })); bip(800, 0.06); }
      else { info.appendChild(E("p", { cls: "ls-msg bad", text: "Chokda kamchiliklar bor:" })); var ul = E("ul"); M.forEach(function (t) { ul.appendChild(E("li", { text: t })); }); info.appendChild(ul); }
      vz.check(s);
    }
    tb.addEventListener("click", function () { ch(true); });
    ch();
  };

  /* ===================== Retsept (kalkulyatsiya kartasi) ===================== */
  S.retsept = function (el, p, api) {
    var T = p.taomlar || [], s = { t: 0, n: 10 }, savol = null;
    if (!T.length) return;
    var ctl = E("div", { cls: "lq-top" }), tw = E("div", { cls: "tbl-w" }), q = E("div", { cls: "lx-info" });
    var sel = E("select", { "aria-label": "Taom" }); T.forEach(function (t, i) { sel.appendChild(E("option", { value: i, text: t.nomi })); }); sel.addEventListener("change", function () { s.t = +sel.value; ch(); yangiSavol(); });
    var pr = E("input", { type: "number", min: 1, max: 500, value: s.n, "aria-label": "Porsiyalar soni", cls: "ls-num" }); pr.addEventListener("input", function () { s.n = Math.max(1, +pr.value || 1); ch(); });
    ctl.appendChild(sel); ctl.appendChild(E("label", { cls: "chk" }, ["Porsiya: ", pr]));
    var pb = E("button", { type: "button", cls: "btn ghost sm", text: "🖨 Chop etish" }); ctl.appendChild(pb);
    el.appendChild(ctl); el.appendChild(tw); el.appendChild(q);
    function ch() {
      var t = T[s.t], k = s.n / t.porsiya, jb = 0, jn = 0;
      var h = "<table><thead><tr><th>Mahsulot</th><th class=n>Brutto, g</th><th class=n>Netto, g</th><th class=n>Chiqindi</th></tr></thead><tbody>";
      t.tarkib.forEach(function (r) { var b = r[1] * k, n = r[2] * k; jb += b; jn += n; h += "<tr><td>" + esc(r[0]) + "</td><td class=n>" + num(b, b >= 100 ? 0 : 1) + "</td><td class=n>" + num(n, n >= 100 ? 0 : 1) + "</td><td class=n>" + (r[1] ? Math.round((1 - r[2] / r[1]) * 100) : 0) + "%</td></tr>"; });
      h += '<tr class="jami"><td>Jami</td><td class=n>' + num(jb, 0) + "</td><td class=n>" + num(jn, 0) + "</td><td></td></tr></tbody></table>";
      tw.innerHTML = h;
      var izoh = t.chiqish ? "<p class='small'>Bir porsiya chiqishi: " + t.chiqish + " g · " + s.n + " porsiya: " + num(t.chiqish * s.n / 1000, 2) + " kg.</p>" : "";
      tw.insertAdjacentHTML("beforeend", izoh + (p.izoh ? "<p class='small muted'>" + p.izoh + "</p>" : ""));
    }
    function yangiSavol() {
      var t = T[s.t], i = Math.floor(Math.random() * t.tarkib.length), n = [25, 30, 40, 50, 60, 75, 120][Math.floor(Math.random() * 7)];
      savol = { i: i, n: n, j: t.tarkib[i][1] * n / t.porsiya };
      q.innerHTML = ""; var inp = E("input", { type: "number", "aria-label": "Javob (gramm)", cls: "ls-num" }), b = E("button", { type: "button", cls: "btn sm", text: "Tekshirish" });
      q.appendChild(E("p", { cls: "lx-q", text: "Hisoblang: «" + t.nomi + "» ning " + n + " porsiyasi uchun «" + t.tarkib[i][0] + "» (brutto) qancha gramm kerak? (Jadvaldagi porsiya sonini o‘zgartirmasdan, " + t.porsiya + " porsiya me’yoridan hisoblang.)" }));
      q.appendChild(E("div", { cls: "lq-top" }, [inp, E("span", { text: "g" }), b]));
      b.addEventListener("click", function () { var ok = Math.abs(+inp.value - savol.j) <= Math.max(1, savol.j * 0.01); q.appendChild(E("p", { cls: "ls-msg " + (ok ? "ok" : "bad"), text: ok ? "✅ To‘g‘ri: " + num(savol.j, 0) + " g. Formula: me’yor ÷ " + t.porsiya + " × " + n + "." : "To‘g‘ri javob: " + num(savol.j, 0) + " g (me’yor ÷ " + t.porsiya + " × " + n + ")." })); api.done(ok ? 100 : 50, ok ? "Kalkulyatsiya to‘g‘ri bajarildi." : "Formulani takrorlang va yana urinib ko‘ring (↻ Qaytadan)."); b.disabled = true; });
    }
    pb.addEventListener("click", function () { var w = window.open("", "_blank"); if (!w) return; w.document.write("<meta charset=utf-8><title>Kalkulyatsiya</title><style>body{font:13pt sans-serif;color:#000}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:4px 8px}td.n,th.n{text-align:right}</style><h2>" + esc(T[s.t].nomi) + " — " + s.n + " porsiya</h2>" + tw.innerHTML); w.document.close(); w.focus(); w.print(); });
    ch(); yangiSavol();
  };

  /* ===================== Yubka asos chizmasi (qolip) ===================== */
  S.qolip = function (el, p, api) {
    var s = { St: 36, Sb: 50, Di: 60, Pt: 0.5, Pb: 1, Bb: 18, n: 0 };
    var ctl = E("div", { cls: "lz-top" }), sv = U.svgBox(420, 380, "lql-sv"), out = E("div", { cls: "lk-out" });
    el.appendChild(E("p", { cls: "ls-sav", text: "To‘g‘ri yubka asos chizmasi (o‘quv modeli). O‘lchamlarni kiriting — chizma va hisob-kitob avtomatik yangilanadi. O‘lchamlar yarim aylana bo‘yicha (sm)." }));
    el.appendChild(E("div", { cls: "lz-g" }, [sv, E("div", {}, [ctl, out])]));
    [["St", "Bel aylanasining yarmi (St)", 28, 50, 0.5], ["Sb", "Son aylanasining yarmi (Sb)", 40, 66, 0.5], ["Di", "Yubka uzunligi (Di)", 40, 100, 1], ["Bb", "Bel–son chizig‘i masofasi", 15, 22, 0.5], ["Pt", "Belga erkinlik qo‘shimchasi (Pt)", 0, 2, 0.5], ["Pb", "Songa erkinlik qo‘shimchasi (Pb)", 0, 3, 0.5]]
      .forEach(function (k) { ctl.appendChild(rng({ l: k[1], min: k[2], max: k[3], q: k[4], v: s[k[0]], u: "sm" }, function (v) { s[k[0]] = v; s.n++; ch(); })); });
    function ch() {
      var K = s.Sb + s.Pb, Or = K / 2 - 1, Ol = K / 2 + 1, Sig = K - (s.St + s.Pt), yon = Sig * 0.5, orq = Sig * 0.35, old = Sig * 0.15;
      var sc = Math.min(380 / K, 340 / (s.Di + 4)), ox = 20, oy = 20, X = function (v) { return ox + v * sc; }, Y = function (v) { return oy + v * sc; };
      sv.innerHTML = "";
      sv.appendChild(V("rect", { x: X(0), y: Y(0), width: K * sc, height: s.Di * sc, fill: "none", stroke: "#bbb", "stroke-dasharray": "4 3" }));
      sv.appendChild(V("line", { x1: X(0), y1: Y(s.Bb), x2: X(K), y2: Y(s.Bb), stroke: "#999", "stroke-dasharray": "6 3" }));
      sv.appendChild(V("text", { x: X(K) - 4, y: Y(s.Bb) - 4, "text-anchor": "end", "font-size": 10, fill: "#666", text: "son chizig‘i" }));
      var yx = Or;
      var d = "M" + X(0) + "," + Y(0) + " L" + X(yx - yon / 2) + "," + Y(-0.5 + 0.5) + " Q" + X(yx - 0.2) + "," + Y(s.Bb * 0.45) + " " + X(yx) + "," + Y(s.Bb) + " L" + X(yx) + "," + Y(s.Di);
      d += " M" + X(K) + "," + Y(0) + " L" + X(yx + yon / 2) + "," + Y(0) + " Q" + X(yx + 0.2) + "," + Y(s.Bb * 0.45) + " " + X(yx) + "," + Y(s.Bb);
      sv.appendChild(V("path", { d: d, fill: "none", stroke: "#222", "stroke-width": 2 }));
      sv.appendChild(V("path", { d: "M" + X(0) + "," + Y(0) + " V" + Y(s.Di) + " H" + X(K) + " V" + Y(0), fill: "none", stroke: "#222", "stroke-width": 2 }));
      var ox1 = Or / 2, ox2 = Or + Ol / 2;
      sv.appendChild(V("path", { d: "M" + X(ox1 - orq / 2) + "," + Y(0) + " L" + X(ox1) + "," + Y(14) + " L" + X(ox1 + orq / 2) + "," + Y(0), fill: "none", stroke: "#b5541b", "stroke-width": 1.8 }));
      sv.appendChild(V("path", { d: "M" + X(ox2 - old / 2) + "," + Y(0) + " L" + X(ox2) + "," + Y(9) + " L" + X(ox2 + old / 2) + "," + Y(0), fill: "none", stroke: "#b5541b", "stroke-width": 1.8 }));
      sv.appendChild(V("text", { x: X(Or / 2), y: Y(s.Di / 2 + 4), "text-anchor": "middle", "font-size": 13, fill: "#334", text: "ORQA BO‘LAK" }));
      sv.appendChild(V("text", { x: X(Or + Ol / 2), y: Y(s.Di / 2 + 4), "text-anchor": "middle", "font-size": 13, fill: "#334", text: "OLD BO‘LAK" }));
      sv.appendChild(V("text", { x: X(K / 2), y: Y(s.Di) + 14, "text-anchor": "middle", "font-size": 10, fill: "#666", text: "Kenglik Sb + Pb = " + fx(K, 1) + " sm · uzunlik " + s.Di + " sm" }));
      qator(out, [["Chizma kengligi Sb + Pb", fx(K, 1) + " sm"], ["Orqa bo‘lak kengligi (Sb+Pb)/2 − 1", fx(Or, 1) + " sm"], ["Old bo‘lak kengligi (Sb+Pb)/2 + 1", fx(Ol, 1) + " sm"], ["Vitochkalar yig‘indisi (Sb+Pb) − (St+Pt)", fx(Sig, 1) + " sm"],
        ["Yon chokka (50%)", fx(yon, 1) + " sm"], ["Orqa vitochkaga (35%), uzunligi ~14 sm", fx(orq, 1) + " sm"], ["Old vitochkaga (15%), uzunligi ~9 sm", fx(old, 1) + " sm"]], 3);
      if (Sig < 0) out.appendChild(E("p", { cls: "ls-msg bad", text: "Bel o‘lchami son o‘lchamidan katta bo‘lib qoldi — o‘lchamlarni tekshiring." }));
      out.appendChild(E("p", { cls: "small muted", text: "Vitochkalarni taqsimlash usullaridan biri ko‘rsatilgan; amaliy mashg‘ulotda o‘qituvchi tavsiya qilgan konstruksiyalash tizimidan foydalaning." }));
      if (s.n >= 3 && !s.tug) { s.tug = 1; api.done(100, "Asos chizmasini o‘lchamlar bo‘yicha hisobladingiz."); }
    }
    ch();
  };

  /* ===================== To'quv turlari ===================== */
  S.mato = function (el, p, api) {
    var TQ = {
      polotno: ["Polotno (1/1)", function (i, j) { return (i + j) % 2 === 0; }, "Eng oddiy va mustahkam to‘quv: tanda va arqoq iplari bittadan navbatlashadi. Ikki tomoni bir xil. Chit, bo‘z, mitqol, batist, polotno."],
      sarja: ["Sarja (2/1)", function (i, j) { return (i + j) % 3 !== 2; }, "Mato yuzida qiya (diagonal) chiziqlar hosil bo‘ladi. Yumshoq, egiluvchan, kam g‘ijimlanadi. Jinsi (denim), gabardin, kostyumbop gazlamalar."],
      sarja22: ["Sarja (2/2)", function (i, j) { return (i + j) % 4 < 2; }, "Ikki tomonlama sarja: diagonal ikkala tomonda ko‘rinadi. Kostyum va paltobop matolar, sharflar."],
      atlas: ["Atlas (5/2)", function (i, j) { return ((i * 2 + j) % 5) !== 0; }, "Uzun chopqilar (bir ip 4 ta ip ustidan o‘tadi) mato yuzini silliq va yaltiroq qiladi. Atlas, satin, astar matolari."],
      panama: ["Panama (2/2)", function (i, j) { return (Math.floor(i / 2) + Math.floor(j / 2)) % 2 === 0; }, "Polotnoning ikkitalik varianti: shaxmat naqshli, g‘ovak, havo o‘tkazuvchan. Kanva, rogojka, yozgi matolar."]
    };
    var s = { t: "polotno" }, ball = 0, n = 0, Q = 6;
    var rj = seg([["o", "O‘rganish"], ["s", "Sinov: to‘quvni aniqlang"]], "o", function (v) { if (v === "s") sinov(); else org(); });
    el.appendChild(E("div", { cls: "lq-top" }, [rj]));
    var box = E("div", {}); el.appendChild(box);
    function chiz(fn, k) {
      var N = 12, c = 24, sv = U.svgBox(N * c, N * c, "lmt-w");
      for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
        var up = fn(i, j), x = i * c, y = j * c;
        sv.appendChild(V("rect", { x: x, y: y, width: c, height: c, fill: up ? "#2f4a6d" : "#f1c27d" }));
        if (up) sv.appendChild(V("rect", { x: x + 6, y: y + 1, width: c - 12, height: c - 2, rx: 5, fill: "#466a96" }));
        else sv.appendChild(V("rect", { x: x + 1, y: y + 6, width: c - 2, height: c - 12, rx: 5, fill: "#f7d9a8" }));
      }
      return sv;
    }
    function org() {
      box.innerHTML = "";
      var w = E("div", {}), inf = E("div", { cls: "lx-info" });
      box.appendChild(seg(Object.keys(TQ).map(function (k) { return [k, TQ[k][0]]; }), s.t, function (v) { s.t = v; up(); }));
      box.appendChild(E("div", { cls: "lz-g" }, [w, inf]));
      function up() { w.innerHTML = ""; w.appendChild(chiz(TQ[s.t][1])); inf.innerHTML = ""; inf.appendChild(E("h4", { text: TQ[s.t][0] })); inf.appendChild(E("p", { text: TQ[s.t][2] })); inf.appendChild(E("p", { cls: "small muted", text: "Ko‘k — tanda (bo‘ylama) ipi ustda, sariq — arqoq (ko‘ndalang) ipi ustda." })); }
      up();
    }
    function sinov() {
      ball = 0; n = 0; sav();
      function sav() {
        box.innerHTML = "";
        if (n >= Q) { api.done(ball / Q * 100, ball + " / " + Q + " to‘quv to‘g‘ri aniqlandi."); box.appendChild(E("p", { cls: "ls-msg ok", text: "Natija: " + ball + " / " + Q })); return; }
        var K = Object.keys(TQ), t = K[Math.floor(Math.random() * K.length)], sh = Math.floor(Math.random() * 3);
        box.appendChild(E("p", { cls: "small muted", text: "Savol " + (n + 1) + " / " + Q + " · to‘g‘ri: " + ball }));
        box.appendChild(chiz(function (i, j) { return TQ[t][1](i + sh, j); }));
        var vb = E("div", { cls: "lt-v" });
        U.shuf(K).forEach(function (k) { var b = E("button", { type: "button", cls: "lt-b", text: TQ[k][0] }); b.addEventListener("click", function () { var ok = k === t || (TQ[k][0] === TQ[t][0]); if (ok) ball++; Array.prototype.forEach.call(vb.children, function (c) { c.disabled = true; }); b.classList.add(ok ? "ok" : "no"); n++; setTimeout(sav, 900); }); vb.appendChild(b); });
        box.appendChild(vb);
      }
    }
    org();
  };

  /* ===================== Interval taymer (jismoniy tarbiya) ===================== */
  S.taymer = function (el, p, api) {
    var PR = p.rejimlar || [["Tabata", 20, 10, 8], ["Isinish", 30, 15, 6], ["Plank", 40, 20, 4], ["Yugurish intervali", 60, 60, 5]];
    var s = { i: 0, run: false, faza: "ish", qol: 0, r: 1 }, tm;
    var disp = E("div", { cls: "lty-d" }), ctl = E("div", { cls: "lq-top" });
    el.appendChild(ctl); el.appendChild(disp);
    ctl.appendChild(seg(PR.map(function (r, i) { return [String(i), r[0] + " " + r[1] + "/" + r[2] + "×" + r[3]]; }), "0", function (v) { s.i = +v; stop(); }));
    var b = E("button", { type: "button", cls: "btn", text: "▶ Boshlash" }); ctl.appendChild(b);
    b.addEventListener("click", function () { if (s.run) stop(); else start(); });
    function chiz() {
      var r = PR[s.i];
      disp.className = "lty-d " + (s.run ? s.faza : "");
      disp.innerHTML = "";
      disp.appendChild(E("small", { text: s.run ? (s.faza === "ish" ? "MASHQ" : "DAM OLISH") : r[0] }));
      disp.appendChild(E("b", { text: String(s.run ? s.qol : r[1]) }));
      disp.appendChild(E("span", { text: "Raund " + (s.run ? s.r : 1) + " / " + r[3] }));
    }
    function start() { var r = PR[s.i]; s.run = true; s.faza = "ish"; s.qol = r[1]; s.r = 1; b.textContent = "■ To‘xtatish"; bip(880, 0.2); chiz(); tm = setInterval(tik, 1000); }
    function stop() { s.run = false; clearInterval(tm); b.textContent = "▶ Boshlash"; chiz(); }
    function tik() {
      if (!el.isConnected) return clearInterval(tm);
      var r = PR[s.i]; s.qol--;
      if (s.qol <= 3 && s.qol > 0) bip(600, 0.06);
      if (s.qol <= 0) {
        if (s.faza === "ish") { if (s.r >= r[3]) { stop(); bip(1200, 0.4); api.done(100, r[0] + " mashg‘uloti to‘liq bajarildi!"); return; } s.faza = "dam"; s.qol = r[2]; bip(440, 0.25); }
        else { s.faza = "ish"; s.qol = r[1]; s.r++; bip(880, 0.25); }
      }
      chiz();
    }
    chiz();
  };
})();
