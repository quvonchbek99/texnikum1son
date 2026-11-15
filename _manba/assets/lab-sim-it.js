/* Virtual laboratoriya simulyatorlari (3-qism): informatika, tarmoq, dasturlash, xavfsizlik, grafika, dizayn, chizmachilik */
(function () {
  "use strict";
  var S = window.t1LabSim, U = S && S._; if (!U) return;
  var E = U.E, V = U.V, fx = U.fx, num = U.num, rng = U.rng, seg = U.seg, bip = U.bip;
  function qator(out, L, as) { out.innerHTML = ""; L.forEach(function (r, i) { out.appendChild(E("div", { cls: "lk-r" + (i === (as || 0) ? " as" : "") }, [E("span", { text: r[0] }), E("b", { text: r[1] })])); }); }

  /* ===================== Mantiqiy elementlar va ikkilik sanoq ===================== */
  S.mantiq = function (el, p, api) {
    var G = { "VA": [function (a, b) { return a & b; }, "&", 0], "YOKI": [function (a, b) { return a | b; }, "1", 0], "EMAS": [function (a) { return a ? 0 : 1; }, "1", 1, 1], "VA-EMAS": [function (a, b) { return (a & b) ? 0 : 1; }, "&", 1], "YOKI-EMAS": [function (a, b) { return (a | b) ? 0 : 1; }, "1", 1], "XOR": [function (a, b) { return a ^ b; }, "=1", 0] };
    var s = { g: "VA", A: 0, B: 0, out: 0, n: 0, bits: [0, 0, 0, 0, 0, 0, 0, 0], maq: p.son || (10 + Math.floor(Math.random() * 90)) };
    var rj = seg([["g", "Mantiqiy elementlar"], ["b", "Ikkilik sanoq"]], "g", function (v) { pg.hidden = v !== "g"; pb.hidden = v !== "b"; });
    el.appendChild(E("div", { cls: "lq-top" }, [rj]));
    var pg = E("div", {}), pb = E("div", { hidden: true }); el.appendChild(pg); el.appendChild(pb);
    pg.appendChild(seg(Object.keys(G).map(function (k) { return [k, k]; }), "VA", function (v) { s.g = v; chiz(); }));
    var sv = U.svgBox(360, 170, "lmt-sv"), tb = E("div", { cls: "tbl-w" });
    pg.appendChild(E("div", { cls: "lz-g" }, [sv, tb]));
    var ib = E("div", { cls: "lq-top" }), ba = E("button", { type: "button", cls: "btn ghost sm" }), bb = E("button", { type: "button", cls: "btn ghost sm" });
    ba.addEventListener("click", function () { s.A ^= 1; chiz(); }); bb.addEventListener("click", function () { s.B ^= 1; chiz(); });
    ib.appendChild(ba); ib.appendChild(bb); pg.appendChild(ib);
    var bitw = E("div", { cls: "lmt-bits" }), bo = E("div", { cls: "lk-out" });
    pb.appendChild(E("p", { cls: "ls-sav", html: "Bitlarni bosib yoqing/o‘chiring. Vazifa: ikkilik sanoq sistemasida <b>" + s.maq + "</b> sonini tering." }));
    pb.appendChild(bitw); pb.appendChild(bo);
    s.bits.forEach(function (b, i) {
      var w = 1 << (7 - i), bt = E("button", { type: "button", cls: "lmt-bit" }, [E("b", { text: "0" }), E("small", { text: String(w) })]);
      bt.addEventListener("click", function () { s.bits[i] ^= 1; bitlar(); }); bitw.appendChild(bt);
    });
    var vz = U.vazifalar(el, p.vazifalar || [
      { m: "VA elementining chiqishini 1 qiling.", f: "s.g=='VA' && s.out==1" },
      { m: "YOKI-EMAS elementida chiqish 1 bo‘ladigan kirishlarni toping.", f: "s.g=='YOKI-EMAS' && s.out==1" },
      { m: "XOR (istisno qiluvchi YOKI) elementida chiqish 1 bo‘lsin.", f: "s.g=='XOR' && s.out==1" },
      { m: "Ikkilik sanoqda " + s.maq + " sonini tering.", f: "s.n==" + s.maq }
    ], api);
    function chiz() {
      var g = G[s.g], bir = g[3]; s.out = bir ? g[0](s.A) : g[0](s.A, s.B);
      ba.textContent = "A = " + s.A; bb.textContent = "B = " + s.B; bb.hidden = !!bir;
      sv.innerHTML = "";
      var on = "#e67e22", off = "#99a";
      sv.appendChild(V("line", { x1: 40, y1: bir ? 85 : 60, x2: 140, y2: bir ? 85 : 60, stroke: s.A ? on : off, "stroke-width": 4 }));
      if (!bir) sv.appendChild(V("line", { x1: 40, y1: 110, x2: 140, y2: 110, stroke: s.B ? on : off, "stroke-width": 4 }));
      sv.appendChild(V("rect", { x: 140, y: 35, width: 80, height: 100, rx: 4, fill: "#fff", stroke: "#334", "stroke-width": 2.5 }));
      sv.appendChild(V("text", { x: 180, y: 92, "text-anchor": "middle", "font-size": 26, "font-weight": 700, fill: "#334", text: g[1] }));
      var x0 = 220; if (g[2]) { sv.appendChild(V("circle", { cx: 227, cy: 85, r: 7, fill: "#fff", stroke: "#334", "stroke-width": 2.5 })); x0 = 234; }
      sv.appendChild(V("line", { x1: x0, y1: 85, x2: 300, y2: 85, stroke: s.out ? on : off, "stroke-width": 4 }));
      sv.appendChild(V("circle", { cx: 318, cy: 85, r: 16, fill: s.out ? "#ffd34d" : "#eee", stroke: "#334", "stroke-width": 2 }));
      sv.appendChild(V("text", { x: 28, y: bir ? 90 : 65, "text-anchor": "middle", "font-size": 15, fill: "#334", text: "A" }));
      if (!bir) sv.appendChild(V("text", { x: 28, y: 115, "text-anchor": "middle", "font-size": 15, fill: "#334", text: "B" }));
      sv.appendChild(V("text", { x: 318, y: 125, "text-anchor": "middle", "font-size": 13, fill: "#334", text: "Y = " + s.out }));
      var rows = bir ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
      var h = "<table><thead><tr><th>A</th>" + (bir ? "" : "<th>B</th>") + "<th>Y</th></tr></thead><tbody>";
      rows.forEach(function (r) { var y = bir ? g[0](r[0]) : g[0](r[0], r[1]), cur = r[0] === s.A && (bir || r[1] === s.B); h += "<tr" + (cur ? ' class="jami"' : "") + "><td>" + r[0] + "</td>" + (bir ? "" : "<td>" + r[1] + "</td>") + "<td><b>" + y + "</b></td></tr>"; });
      tb.innerHTML = h + "</tbody></table>";
      vz.check(s);
    }
    function bitlar() {
      s.n = s.bits.reduce(function (a, b, i) { return a + (b << (7 - i)); }, 0);
      Array.prototype.forEach.call(bitw.children, function (c, i) { c.classList.toggle("on", !!s.bits[i]); c.firstChild.textContent = String(s.bits[i]); });
      qator(bo, [["O‘nlik", String(s.n)], ["Ikkilik", s.bits.join("")], ["O‘n oltilik", s.n.toString(16).toUpperCase()], ["Sakkizlik", s.n.toString(8)]]);
      vz.check(s);
    }
    chiz(); bitlar();
  };

  /* ===================== Kompyuter tarmog'i: IP, maska, shlyuz, ping ===================== */
  S.tarmoq = function (el, p, api) {
    var PC = [{ n: "PC1", ip: "192.168.1.10", m: 24, gw: "", lan: 1 }, { n: "PC2", ip: "192.168.10.20", m: 24, gw: "", lan: 1 }, { n: "PC3", ip: "192.168.2.30", m: 24, gw: "", lan: 2 }];
    var RT = { 1: "192.168.1.1", 2: "192.168.2.1" }, s = { ok12: false, ok13: false };
    var sv = U.svgBox(520, 220, "ltm-sv"), term = E("pre", { cls: "log ltm-t", text: "Ping natijalari shu yerda chiqadi." }), cfg = E("div", { cls: "ltm-cfg" });
    el.appendChild(E("p", { cls: "ls-sav", text: "PC1 va PC2 bitta kommutatorga (LAN 1), PC3 esa ikkinchi kommutatorga (LAN 2) ulangan. Tarmoqlar orasida marshrutizator turibdi: LAN 1 tomoni 192.168.1.1/24, LAN 2 tomoni 192.168.2.1/24." }));
    el.appendChild(sv); el.appendChild(cfg);
    var bt = E("div", { cls: "lq-top" });
    var b12 = E("button", { type: "button", cls: "btn sm", text: "PC1 → PC2: ping" }), b13 = E("button", { type: "button", cls: "btn sm", text: "PC1 → PC3: ping" });
    b12.addEventListener("click", function () { ping(0, 1); }); b13.addEventListener("click", function () { ping(0, 2); });
    bt.appendChild(b12); bt.appendChild(b13); el.appendChild(bt); el.appendChild(term);
    var vz = U.vazifalar(el, p.vazifalar || [{ m: "PC1 dan PC2 ga ping muvaffaqiyatli o‘tsin (bitta tarmoq manzillari).", f: "s.ok12" }, { m: "PC1 dan PC3 ga (boshqa tarmoq) ping o‘tsin — asosiy shlyuzlarni sozlang.", f: "s.ok13" }], api);
    PC.forEach(function (c) {
      var ip = E("input", { type: "text", value: c.ip, "aria-label": c.n + " IP", spellcheck: "false" }), gw = E("input", { type: "text", value: c.gw, placeholder: "masalan 192.168.1.1", "aria-label": c.n + " shlyuz", spellcheck: "false" });
      var m = E("select", { "aria-label": c.n + " maska" }); [[24, "255.255.255.0 (/24)"], [16, "255.255.0.0 (/16)"], [8, "255.0.0.0 (/8)"]].forEach(function (o) { m.appendChild(E("option", { value: o[0], text: o[1] })); });
      ip.addEventListener("input", function () { c.ip = ip.value.trim(); chiz(); }); gw.addEventListener("input", function () { c.gw = gw.value.trim(); }); m.addEventListener("change", function () { c.m = +m.value; });
      cfg.appendChild(E("div", { cls: "card ltm-pc" }, [E("b", { text: "🖥️ " + c.n + " (LAN " + c.lan + ")" }), E("label", { cls: "f" }, [E("span", { text: "IP manzil" }), ip]), E("label", { cls: "f" }, [E("span", { text: "Tarmoq maskasi" }), m]), E("label", { cls: "f" }, [E("span", { text: "Asosiy shlyuz" }), gw])]));
    });
    function n32(ip) { var a = String(ip).split("."); if (a.length !== 4) return null; var r = 0; for (var i = 0; i < 4; i++) { if (!/^\d{1,3}$/.test(a[i]) || +a[i] > 255) return null; r = r * 256 + +a[i]; } return r; }
    function net(ip, m) { var x = n32(ip); return x == null ? null : Math.floor(x / Math.pow(2, 32 - m)); }
    function bir(a, b, m) { var x = net(a, m), y = net(b, m); return x != null && x === y; }
    function chiz(yol) {
      sv.innerHTML = "";
      var P = { PC1: [60, 60], PC2: [60, 170], SW1: [170, 115], R: [280, 115], SW2: [390, 115], PC3: [470, 115] };
      [["PC1", "SW1"], ["PC2", "SW1"], ["SW1", "R"], ["R", "SW2"], ["SW2", "PC3"]].forEach(function (l) { sv.appendChild(V("line", { x1: P[l[0]][0], y1: P[l[0]][1], x2: P[l[1]][0], y2: P[l[1]][1], stroke: "#99a", "stroke-width": 3 })); });
      if (yol) { var d = "M" + yol.map(function (k) { return P[k].join(","); }).join(" L"); sv.appendChild(V("path", { d: d, stroke: "#e67e22", "stroke-width": 4, fill: "none", "stroke-dasharray": "6 6", cls: "ltm-yol" })); }
      [["PC1", "🖥️", PC[0].ip], ["PC2", "🖥️", PC[1].ip], ["SW1", "🔀", "Kommutator 1"], ["R", "📡", "Marshrutizator"], ["SW2", "🔀", "Kommutator 2"], ["PC3", "🖥️", PC[2].ip]].forEach(function (d) {
        sv.appendChild(V("circle", { cx: P[d[0]][0], cy: P[d[0]][1], r: 24, fill: "#fff", stroke: "#334", "stroke-width": 2 }));
        sv.appendChild(V("text", { x: P[d[0]][0], y: P[d[0]][1] + 1, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 22, text: d[1] }));
        sv.appendChild(V("text", { x: P[d[0]][0], y: P[d[0]][1] + 40, "text-anchor": "middle", "font-size": 11, fill: "#334", text: d[2] }));
      });
      sv.appendChild(V("text", { x: 280, y: 70, "text-anchor": "middle", "font-size": 10, fill: "#556", text: "1.1 | 2.1" }));
    }
    function ping(i, j) {
      var A = PC[i], B = PC[j], L = ["> ping " + B.ip], ok = false, yol = null, sabab = "";
      if (n32(A.ip) == null) sabab = A.n + ": IP manzil noto‘g‘ri yozilgan (4 ta 0–255 son, nuqta bilan).";
      else if (n32(B.ip) == null) sabab = B.n + ": IP manzil noto‘g‘ri.";
      else if (A.ip === B.ip || PC.some(function (c) { return c !== A && c.ip === A.ip; })) sabab = "IP manzillar to‘qnashuvi: tarmoqda bir xil manzilli ikki qurilma bo‘lmasligi kerak.";
      else if (A.ip === RT[A.lan] || B.ip === RT[B.lan]) sabab = "Kompyuterga marshrutizator manzili berilgan — boshqa manzil tanlang.";
      else if (bir(A.ip, B.ip, A.m)) {
        if (A.lan === B.lan && bir(B.ip, A.ip, B.m)) { ok = true; yol = [A.n, "SW1", B.n]; }
        else if (A.lan !== B.lan) sabab = A.n + " maskasiga ko‘ra " + B.n + " shu tarmoqda deb hisoblanadi, lekin u boshqa kommutatorda — paket shlyuzga yuborilmaydi.";
        else sabab = B.n + " maskasi tufayli javob qaytmaydi.";
      } else {
        if (!A.gw) sabab = A.n + " uchun " + B.ip + " boshqa tarmoqda, lekin asosiy shlyuz ko‘rsatilmagan.";
        else if (A.gw !== RT[A.lan]) sabab = A.n + " shlyuzi noto‘g‘ri: LAN " + A.lan + " uchun shlyuz marshrutizatorning shu tomondagi manzili bo‘lishi kerak.";
        else if (!bir(A.ip, A.gw, A.m)) sabab = A.n + " manzili shlyuz bilan bir tarmoqda emas.";
        else if (!bir(B.ip, RT[B.lan], 24)) sabab = B.n + " manzili LAN " + B.lan + " tarmog‘iga (" + RT[B.lan].replace(/\.1$/, ".0") + "/24) mos emas — marshrutizator paketni yetkaza olmaydi.";
        else if (B.gw !== RT[B.lan]) sabab = "So‘rov " + B.n + " ga yetdi, lekin " + B.n + " da shlyuz to‘g‘ri sozlanmagan — javob qaytmaydi.";
        else { ok = true; yol = A.lan === B.lan ? [A.n, "SW1", B.n] : [A.n, "SW1", "R", "SW2", B.n]; }
      }
      chiz(yol);
      if (ok) { for (var k = 0; k < 4; k++) L.push("Javob " + B.ip + " dan: baytlar=32 vaqt=" + (yol.length > 3 ? 2 + k % 2 : 1) + "ms TTL=" + (yol.length > 3 ? 127 : 128)); L.push("Paketlar: yuborildi = 4, qabul qilindi = 4, yo‘qotildi = 0 (0%)"); bip(880, 0.06); }
      else { for (k = 0; k < 4; k++) L.push("So‘rov vaqti tugadi."); L.push("Paketlar: yuborildi = 4, qabul qilindi = 0, yo‘qotildi = 4 (100%)"); L.push(""); L.push("Sabab: " + sabab); bip(200, 0.12); }
      term.textContent = L.join("\n");
      if (ok && j === 1) s.ok12 = true; if (ok && j === 2) s.ok13 = true;
      vz.check(s);
    }
    chiz();
  };

  /* ===================== Kod muharriri (JavaScript / HTML) ===================== */
  S.kod = function (el, p, api) {
    var M = p.mashqlar || [], k = 0, otdi = {}, til = p.til || "js";
    var sel = E("select", { "aria-label": "Mashq" }); M.forEach(function (m, i) { sel.appendChild(E("option", { value: i, text: (i + 1) + ". " + m.n })); });
    var task = E("p", { cls: "ls-sav" }), ta = E("textarea", { cls: "lkd-ta", spellcheck: "false", rows: 12, "aria-label": "Kod" }), run = E("button", { type: "button", cls: "btn sm", text: "▶ Ishga tushirish" }), rs = E("button", { type: "button", cls: "btn ghost sm", text: "↺ Boshlang‘ich kod" });
    var out = E("pre", { cls: "log lkd-o" }), fr = E("iframe", { cls: "lkd-f", sandbox: "allow-scripts", title: "Natija" }), msg = E("p", { cls: "ls-msg", "aria-live": "polite" });
    el.appendChild(E("div", { cls: "lq-top" }, [sel, run, rs]));
    el.appendChild(task);
    el.appendChild(E("div", { cls: "lkd-g" }, [ta, til === "html" ? fr : out]));
    el.appendChild(msg);
    sel.addEventListener("change", function () { k = +sel.value; yukla(); });
    rs.addEventListener("click", function () { ta.value = M[k].kod || ""; });
    ta.addEventListener("keydown", function (e) { if (e.key === "Tab") { e.preventDefault(); var a = ta.selectionStart; ta.value = ta.value.slice(0, a) + "  " + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = a + 2; } });
    var tok = 0, tm;
    window.addEventListener("message", function (e) {
      if (!e.data || e.data.t1kod !== tok) return;
      clearTimeout(tm); var txt = e.data.L.join("\n"); out.textContent = txt || "(chiqish bo‘sh)";
      if (e.data.err) out.textContent += (txt ? "\n" : "") + "Xato: " + e.data.err;
      tekshir(txt, e.data.err);
    });
    function yukla() { task.textContent = M[k].m; ta.value = M[k].kod || ""; out.textContent = ""; msg.textContent = ""; msg.className = "ls-msg"; if (til === "html") fr.srcdoc = ""; }
    function tekshir(txt, err) {
      var m = M[k], ok = false;
      if (til === "js") ok = !err && m.kutilgan != null && String(txt).trim().replace(/\s+\n/g, "\n") === String(m.kutilgan).trim();
      else ok = (m.tekshir || []).every(function (r) { return new RegExp(r, "i").test(ta.value); });
      if (ok) { msg.className = "ls-msg ok"; msg.textContent = "✅ To‘g‘ri! Mashq bajarildi."; otdi[k] = 1; bip(880, 0.06); }
      else { msg.className = "ls-msg bad"; msg.textContent = til === "js" ? "Natija kutilgandan farq qiladi. Kutilgan chiqish: " + m.kutilgan : "Hali talablar to‘liq bajarilmadi: " + (m.izoh || "topshiriqni qayta o‘qing."); }
      var n = Object.keys(otdi).length; if (ok) api.done(n / M.length * 100, n + " / " + M.length + " mashq bajarildi.");
    }
    run.addEventListener("click", function () {
      if (til === "html") { fr.srcdoc = ta.value; tekshir(""); return; }
      tok = Math.random(); out.textContent = "…";
      var f = document.createElement("iframe"); f.setAttribute("sandbox", "allow-scripts"); f.style.display = "none";
      var kod = JSON.stringify(ta.value), t = JSON.stringify(tok);
      f.srcdoc = "<script>var L=[],f=function(){return Array.prototype.map.call(arguments,function(a){return typeof a==='object'?JSON.stringify(a):String(a)}).join(' ')};console.log=function(){L.push(f.apply(null,arguments))};var alert=function(m){L.push(String(m))};var err=null;try{(new Function(" + kod.replace(/<\/script/gi, "<\\/script") + "))()}catch(e){err=e.message}parent.postMessage({t1kod:" + t + ",L:L,err:err},'*');<\/script>";
      document.body.appendChild(f);
      tm = setTimeout(function () { out.textContent = "⏱ Kod 3 soniyada tugamadi (cheksiz sikl bo‘lishi mumkin) — to‘xtatildi."; f.remove(); }, 3000);
      setTimeout(function () { if (f.isConnected) f.remove(); }, 3500);
    });
    if (M.length) yukla();
  };

  /* ===================== Parol mustahkamligi ===================== */
  S.parol = function (el, p, api) {
    var LUG = ["123456", "12345678", "123456789", "qwerty", "password", "parol", "111111", "000000", "abc123", "admin", "iloveyou", "qwerty123", "1q2w3e", "toshkent", "uzbekistan", "salom", "parol123"];
    var inp = E("input", { type: "text", "aria-label": "Parol", autocomplete: "off", spellcheck: "false", placeholder: "Sinov parolini yozing" }), out = E("div", { cls: "lk-out" }), ch = E("ul", { cls: "lpw-c" }), bar = E("div", { cls: "prog lpw-b" }, [E("i")]);
    el.appendChild(E("p", { cls: "note", text: "Bu yerga haqiqiy parolingizni yozmang — o‘xshash sinov parolidan foydalaning. Matn hech qayerga yuborilmaydi, faqat shu sahifada hisoblanadi." }));
    el.appendChild(E("label", { cls: "f" }, [E("span", { text: "Parol" }), inp])); el.appendChild(bar);
    el.appendChild(E("div", { cls: "lz-g" }, [ch, out]));
    var s = { E: 0 };
    var vz = U.vazifalar(el, p.vazifalar || [{ m: "Kamida 12 belgili, lug‘atda yo‘q va 60 bitdan kuchli parol tuzing.", f: "s.E>=60 && s.len>=12 && !s.lug" }, { m: "4 turdagi belgining hammasi (kichik, katta harf, raqam, maxsus belgi) ishtirok etsin.", f: "s.tur==4 && s.E>=60" }], api);
    function vaqt(sek) {
      if (sek < 1) return "bir zumda"; var L = [[31536e6, "ming yil"], [31536e3, "yil"], [86400, "kun"], [3600, "soat"], [60, "daqiqa"], [1, "soniya"]];
      for (var i = 0; i < L.length; i++) if (sek >= L[i][0]) { var v = sek / L[i][0]; return (v > 1e6 ? "milliondan ortiq " : Math.round(v) + " ") + L[i][1]; }
    }
    function hisob() {
      var v = inp.value, pool = 0, t = 0;
      var c = [[/[a-z]/, 26, "kichik lotin harflari"], [/[A-Z]/, 26, "katta harflar"], [/[0-9]/, 10, "raqamlar"], [/[^A-Za-z0-9]/, 33, "maxsus belgilar (!@#…)"]];
      ch.innerHTML = "";
      c.forEach(function (x) { var b = x[0].test(v); if (b) { pool += x[1]; t++; } ch.appendChild(E("li", { cls: b ? "ok" : "", text: (b ? "✓ " : "✗ ") + x[2] })); });
      var len = v.length, en = len ? len * Math.log2(pool || 1) : 0, lug = LUG.indexOf(v.toLowerCase()) >= 0 || LUG.some(function (w) { return w.length > 4 && v.toLowerCase().indexOf(w) >= 0; });
      var takror = /(.)\1\1/.test(v), ketma = /(0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(v);
      if (lug) en = Math.min(en, 10); if (takror) en *= 0.8; if (ketma) en *= 0.8;
      ch.appendChild(E("li", { cls: len >= 12 ? "ok" : "", text: (len >= 12 ? "✓ " : "✗ ") + "uzunligi kamida 12 belgi (hozir " + len + ")" }));
      ch.appendChild(E("li", { cls: lug ? "" : "ok", text: (lug ? "✗ " : "✓ ") + "keng tarqalgan parollar ro‘yxatida yo‘q" }));
      if (takror || ketma) ch.appendChild(E("li", { text: "✗ takroriy yoki ketma-ket belgilar bor (aaa, 1234…)" }));
      s.E = en; s.len = len; s.lug = lug; s.tur = t;
      var sek = Math.pow(2, en) / 1e10, d = en < 28 ? ["Juda kuchsiz", "#b3261e"] : en < 36 ? ["Kuchsiz", "#d35400"] : en < 60 ? ["O‘rtacha", "#d4a017"] : en < 80 ? ["Kuchli", "#1f7a4a"] : ["Juda kuchli", "#0b5d3b"];
      bar.firstChild.style.width = Math.min(100, en / 100 * 100) + "%"; bar.firstChild.style.background = d[1];
      qator(out, [["Baho", d[0]], ["Entropiya ≈ uzunlik × log₂(belgilar soni)", fx(en, 0) + " bit"], ["Belgilar to‘plami", pool + " ta"], ["Sekundiga 10 mlrd urinishda topish vaqti", vaqt(sek)]]);
      vz.check(s);
    }
    inp.addEventListener("input", hisob); hisob();
  };

  /* ===================== Rastr va vektor grafika ===================== */
  S.piksel = function (el, p, api) {
    var s = { z: 1, r: 32, k: {} };
    var ctl = E("div", { cls: "lq-top" }), g = E("div", { cls: "lpx-g" }), vs = U.svgBox(100, 100, "lpx-v"), rc = E("canvas", { cls: "lpx-r", width: 300, height: 300 }), out = E("div", { cls: "lk-out" });
    el.appendChild(ctl);
    g.appendChild(E("figure", {}, [vs, E("figcaption", { text: "Vektor (SVG): formulalar bilan chiziladi" })]));
    g.appendChild(E("figure", {}, [rc, E("figcaption", { text: "Rastr (BMP/PNG/JPG): piksellar to‘ri" })]));
    el.appendChild(g); el.appendChild(out);
    ctl.appendChild(rng({ l: "Kattalashtirish", min: 1, max: 16, q: 1, v: 1, u: "×" }, function (v) { s.z = v; s.k.z = v >= 8; ch(); }));
    ctl.appendChild(rng({ l: "Rastr o‘lchami", min: 8, max: 256, q: 8, v: 32, u: "px" }, function (v) { s.r = v; s.k.r = 1; ch(); }));
    var off = document.createElement("canvas");
    function shakl(x, k) {
      x.fillStyle = "#fff"; x.fillRect(0, 0, 100 * k, 100 * k);
      x.fillStyle = "#1f5fa6"; x.beginPath(); x.arc(38 * k, 40 * k, 24 * k, 0, 7); x.fill();
      x.fillStyle = "#e67e22"; x.beginPath(); x.moveTo(70 * k, 50 * k); x.lineTo(92 * k, 88 * k); x.lineTo(48 * k, 88 * k); x.closePath(); x.fill();
      x.fillStyle = "#222"; x.font = "bold " + 22 * k + "px sans-serif"; x.fillText("Aa", 16 * k, 88 * k);
    }
    function ch() {
      var w = 100 / s.z, o = 50 - w / 2;
      vs.setAttribute("viewBox", o + " " + o + " " + w + " " + w);
      vs.innerHTML = '<rect x="0" y="0" width="100" height="100" fill="#fff"/><circle cx="38" cy="40" r="24" fill="#1f5fa6"/><path d="M70 50 L92 88 L48 88 Z" fill="#e67e22"/><text x="16" y="88" font-size="22" font-weight="700" font-family="sans-serif" fill="#222">Aa</text>';
      off.width = s.r; off.height = s.r; var ox = off.getContext("2d"); shakl(ox, s.r / 100);
      var x = rc.getContext("2d"); x.imageSmoothingEnabled = false; x.fillStyle = "#fff"; x.fillRect(0, 0, 300, 300);
      var sw = s.r / s.z, so = (s.r - sw) / 2; x.drawImage(off, so, so, sw, sw, 0, 0, 300, 300);
      qator(out, [["Rastr fayl hajmi (24 bit, siqilmagan)", num(s.r * s.r * 3 / 1024, 1) + " KB"], ["Vektor fayl hajmi (taxminan)", "0,3 KB"], ["Rastr: kattalashtirilganda", s.z > 2 ? "piksellar (zinapoya) ko‘rinadi" : "hali silliq ko‘rinadi"], ["Vektor: kattalashtirilganda", "sifat yo‘qolmaydi"]]);
      if (s.k.z && s.k.r && !s.tug) { s.tug = 1; api.done(100, "Rastr va vektor tasvirning farqini o‘rgandingiz."); }
    }
    ch();
  };

  /* ===================== Animatsiya: kadr chastotasi va silliqlik ===================== */
  S.animatsiya = function (el, p, api) {
    var EZ = { "linear": function (t) { return t; }, "ease-in": function (t) { return t * t; }, "ease-out": function (t) { return 1 - (1 - t) * (1 - t); }, "ease-in-out": function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }, "bounce": function (t) { var n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; } };
    var s = { fps: 12, ez: "linear", piyoz: true, t0: performance.now(), k: {} };
    var cv = U.canvas(600, 220), out = E("div", { cls: "lk-out" }), ctl = E("div", { cls: "lq-top" });
    el.appendChild(ctl); el.appendChild(cv); el.appendChild(out);
    ctl.appendChild(E("span", { cls: "small", text: "Kadr chastotasi:" }));
    ctl.appendChild(seg([[6, "6 fps"], [12, "12 fps"], [24, "24 fps"], [30, "30 fps"], [60, "60 fps"]], 12, function (v) { s.fps = +v; s.k[v] = 1; }));
    var ez = E("select", { "aria-label": "Harakat egri chizig‘i" }); Object.keys(EZ).forEach(function (k) { ez.appendChild(E("option", { value: k, text: { linear: "Tekis (linear)", "ease-in": "Tezlashuvchi (ease-in)", "ease-out": "Sekinlashuvchi (ease-out)", "ease-in-out": "Silliq (ease-in-out)", bounce: "Sakrash (bounce)" }[k] })); });
    ez.addEventListener("change", function () { s.ez = ez.value; s.k.e = 1; }); ctl.appendChild(ez);
    var pz = E("input", { type: "checkbox", checked: true }); pz.addEventListener("change", function () { s.piyoz = pz.checked; }); ctl.appendChild(E("label", { cls: "chk" }, [pz, "Piyoz po‘sti (barcha kadrlar)"]));
    function loop(now) {
      if (!el.isConnected) return;
      var D = 2, T = ((now - s.t0) / 1000) % (D + 0.6), x = cv.x, W = cv.W, H = cv.H, n = Math.round(D * s.fps);
      var f = Math.min(n, Math.floor(Math.min(T, D) * s.fps)), pos = function (i) { return 40 + EZ[s.ez](i / n) * (W - 80); };
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H); x.strokeStyle = "#ddd"; x.beginPath(); x.moveTo(20, H - 40); x.lineTo(W - 20, H - 40); x.stroke();
      if (s.piyoz) for (var i = 0; i <= n; i++) { x.fillStyle = "rgba(31,95,166,.12)"; x.beginPath(); x.arc(pos(i), H / 2 - 10, 22, 0, 7); x.fill(); x.fillStyle = "#99a"; if (n <= 30) x.fillRect(pos(i) - 1, H - 46, 2, 12); }
      x.fillStyle = "#b5541b"; x.beginPath(); x.arc(pos(f), H / 2 - 10, 22, 0, 7); x.fill();
      x.fillStyle = "#334"; x.font = "13px sans-serif"; x.fillText("Kadr " + f + " / " + n, 20, 22); x.fillText("Kalit kadrlar: 0-kadr va " + n + "-kadr; oraliq kadrlar (tvining) avtomatik hisoblanadi", 20, H - 12);
      requestAnimationFrame(loop);
    }
    function info() {
      qator(out, [["2 soniyadagi kadrlar soni", String(2 * s.fps)], ["Bir kadr davomiyligi", fx(1000 / s.fps, 1) + " ms"], ["Qo‘llanilishi", s.fps <= 12 ? "an’anaviy qo‘l animatsiyasi (ikki marta takrorlangan kadr)" : s.fps <= 24 ? "kino standarti (24 fps)" : s.fps <= 30 ? "televideniye, video (25/30 fps)" : "o‘yinlar, silliq UI animatsiyalari (60 fps)"]]);
      if (!s.tug && Object.keys(s.k).length >= 3) { s.tug = true; api.done(100, "Kadr chastotasi va harakat egri chiziqlarini o‘rgandingiz."); }
    }
    ctl.addEventListener("click", function () { setTimeout(info, 0); }); ez.addEventListener("change", info);
    info(); requestAnimationFrame(loop);
  };

  /* ===================== Proyeksion chizmachilik: detal va uning 3 ko'rinishi ===================== */
  S.proyeksiya = function (el, p, api) {
    var N = 4, Hm = 3;
    var NAM = p.namunalar || [
      { n: "Zinapoya", h: [[1, 2, 3, 0], [1, 2, 3, 0], [0, 0, 0, 0], [0, 0, 0, 0]] },
      { n: "L-detal", h: [[2, 1, 1, 0], [2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0]] },
      { n: "Ko‘prikcha", h: [[2, 2, 2, 0], [1, 0, 1, 0], [1, 0, 1, 0], [0, 0, 0, 0]] },
      { n: "T-detal", h: [[1, 3, 1, 0], [0, 3, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]] }
    ];
    var s = { h: [[1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], mos: {} };
    var tgt = p.maqsadlar || [1, 2];
    el.appendChild(E("p", { cls: "ls-sav", text: "«Ustdan ko‘rinish» to‘ridagi kataklarni bosing — har bosishda shu joydagi kublar ustuni 1 taga oshadi (3 dan keyin 0). Detalning izometriyasi va uchta ko‘rinishi avtomatik chiziladi. Ko‘rinishlar Yevropa usulida joylashgan: bosh ko‘rinish — yuqorida chapda, chapdan ko‘rinish — uning o‘ng tomonida, ustdan ko‘rinish — uning ostida." }));
    var nb = E("div", { cls: "lq-top" }, [E("span", { cls: "small", text: "Namuna:" })]);
    NAM.forEach(function (n, ni) { if (tgt.indexOf(ni) >= 0) return; var b = E("button", { type: "button", cls: "btn ghost sm", text: n.n }); b.addEventListener("click", function () { s.h = n.h.map(function (r) { return r.slice(); }); ch(); }); nb.appendChild(b); });
    var tz = E("button", { type: "button", cls: "btn ghost sm", text: "Tozalash" }); tz.addEventListener("click", function () { s.h = s.h.map(function (r) { return r.map(function () { return 0; }); }); ch(); }); nb.appendChild(tz);
    el.appendChild(nb);
    var iso = U.svgBox(300, 260, "lpj-iso"), vF = U.svgBox(130, 110), vL = U.svgBox(130, 110), vT = U.svgBox(130, 130, "lpj-top");
    var g = E("div", { cls: "lpj-g" }, [
      E("figure", { cls: "lpj-iso-f" }, [iso, E("figcaption", { text: "Izometriya" })]),
      E("div", { cls: "lpj-v" }, [E("figure", {}, [vF, E("figcaption", { text: "Bosh ko‘rinish (old)" })]), E("figure", {}, [vL, E("figcaption", { text: "Chapdan ko‘rinish" })]), E("figure", {}, [vT, E("figcaption", { text: "Ustdan ko‘rinish (bosib tahrirlang)" })])])
    ]);
    el.appendChild(g);
    var tw = E("div", { cls: "lpj-t" }); el.appendChild(tw);
    var vz = U.vazifalar(el, tgt.map(function (i) { return { m: "Uchta ko‘rinishi berilgan «" + NAM[i].n + "» detaliga mos detal yasang (namuna tugmasini bosmasdan).", f: function (st) { return st.mos[i]; } }; }), api);
    function kor(h) {
      var F = [], L = [], T = [];
      for (var x = 0; x < N; x++) { F[x] = 0; for (var y = 0; y < N; y++) F[x] = Math.max(F[x], h[y][x]); }
      for (y = 0; y < N; y++) { L[y] = 0; for (x = 0; x < N; x++) L[y] = Math.max(L[y], h[y][x]); }
      for (y = 0; y < N; y++) { T[y] = []; for (x = 0; x < N; x++) T[y][x] = h[y][x] > 0 ? 1 : 0; }
      return JSON.stringify([F, L, T]);
    }
    function ustun(svg, vals, flip, c) {
      svg.innerHTML = ""; var k = 26, ox = 13, oy = 100;
      svg.appendChild(V("line", { x1: 4, y1: oy, x2: 126, y2: oy, stroke: "#bbb" }));
      vals.forEach(function (v, i) { var ii = flip ? N - 1 - i : i; for (var z = 0; z < v; z++) svg.appendChild(V("rect", { x: ox + ii * k, y: oy - (z + 1) * k, width: k, height: k, fill: c || "#fff", stroke: "#222", "stroke-width": 1.6 })); });
    }
    function ch() {
      var h = s.h; iso.innerHTML = "";
      var k = 22, cx = 150, cy = 70, c30 = Math.cos(Math.PI / 6), s30 = 0.5;
      function P(x, y, z) { return [cx + (x - y) * k * c30, cy + (x + y) * k * s30 - z * k]; }
      function poly(pts, f) { iso.appendChild(V("polygon", { points: pts.map(function (q) { return q.join(","); }).join(" "), fill: f, stroke: "#222", "stroke-width": 1.1, "stroke-linejoin": "round" })); }
      for (var x0 = 0; x0 <= N; x0++) { var a = P(x0, 0, 0), b = P(x0, N, 0); iso.appendChild(V("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#e5e5e5" })); a = P(0, x0, 0); b = P(N, x0, 0); iso.appendChild(V("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#e5e5e5" })); }
      var L = []; for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) for (var z = 0; z < h[y][x]; z++) L.push([x, y, z]);
      L.sort(function (p1, p2) { return (p1[0] + p1[1]) - (p2[0] + p2[1]) || p1[2] - p2[2]; });
      L.forEach(function (q) {
        var x = q[0], y = q[1], z = q[2];
        poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], "#f3efe6");
        poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], "#c9b99a");
        poly([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], "#a8987a");
      });
      var F = [], Lf = [];
      for (x = 0; x < N; x++) { F[x] = 0; for (y = 0; y < N; y++) F[x] = Math.max(F[x], h[y][x]); }
      for (y = 0; y < N; y++) { Lf[y] = 0; for (x = 0; x < N; x++) Lf[y] = Math.max(Lf[y], h[y][x]); }
      ustun(vF, F, true); ustun(vL, Lf, false);
      vT.innerHTML = ""; var kk = 28, o = 9;
      for (y = 0; y < N; y++) for (x = 0; x < N; x++) (function (x, y) {
        var sx = N - 1 - x, r = V("rect", { x: o + sx * kk, y: o + y * kk, width: kk, height: kk, fill: h[y][x] ? "#e8dcc4" : "#fff", stroke: h[y][x] ? "#222" : "#ccc", "stroke-width": h[y][x] ? 1.6 : 1, cls: "lpj-c", tabindex: "0", role: "button", "aria-label": "Katak " + (x + 1) + "," + (y + 1) + ": " + h[y][x] });
        function bos() { s.h[y][x] = (s.h[y][x] + 1) % (Hm + 1); ch(); }
        r.addEventListener("click", bos); r.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bos(); } });
        vT.appendChild(r);
        if (h[y][x]) vT.appendChild(V("text", { x: o + sx * kk + kk / 2, y: o + y * kk + kk / 2 + 4, "text-anchor": "middle", "font-size": 11, fill: "#556", "pointer-events": "none", text: String(h[y][x]) }));
      })(x, y);
      var men = kor(h);
      tw.innerHTML = "";
      tgt.forEach(function (i) {
        var n = NAM[i], tv = JSON.parse(kor(n.h)), ok = men === kor(n.h);
        if (ok) s.mos[i] = 1;
        var a = U.svgBox(130, 110), b = U.svgBox(130, 110), c = U.svgBox(130, 130);
        ustun(a, tv[0], true, "#eee"); ustun(b, tv[1], false, "#eee");
        tv[2].forEach(function (row, yy) { row.forEach(function (v, xx) { c.appendChild(V("rect", { x: 9 + (N - 1 - xx) * 28, y: 9 + yy * 28, width: 28, height: 28, fill: v ? "#eee" : "#fff", stroke: v ? "#222" : "#ddd" })); }); });
        tw.appendChild(E("div", { cls: "card lpj-tg" + (ok ? " ok" : "") }, [E("b", { text: "Maqsad: «" + n.n + "» " + (ok ? "✓ mos keldi" : "") }), E("div", { cls: "lpj-tv" }, [a, b, c])]));
      });
      vz.check(s);
    }
    ch();
  };

  /* ===================== Rangshunoslik: RGB, CMY, rang doirasi ===================== */
  S.rang = function (el, p, api) {
    var DO = p.doira || [["Sariq", "#ffe600"], ["Sariq-to‘q sariq", "#ffbb00"], ["To‘q sariq", "#ff8a00"], ["Qizil-to‘q sariq", "#ff5a1f"], ["Qizil", "#e5231b"], ["Qizil-binafsha", "#c2185b"], ["Binafsha", "#7b1fa2"], ["Ko‘k-binafsha", "#4527a0"], ["Ko‘k", "#1e4fc2"], ["Ko‘k-yashil", "#00897b"], ["Yashil", "#43a047"], ["Sariq-yashil", "#9ccc2a"]];
    var R = (p.rejimlar || ["rgb", "cmy", "doira"]), s = { r: 255, g: 120, b: 0, c: 0, m: 60, y: 100, sel: -1, rj: R[0] };
    var NOM = { rgb: "RGB — yorug‘lik (ekran)", cmy: "CMY — bo‘yoq (chop etish)", doira: "Rang doirasi va uyg‘unlik" };
    el.appendChild(E("div", { cls: "lq-top" }, [seg(R.map(function (r) { return [r, NOM[r]]; }), s.rj, function (v) { s.rj = v; bosh(); })]));
    var box = E("div", {}); el.appendChild(box);
    var vz = U.vazifalar(el, p.vazifalar || [
      R.indexOf("rgb") >= 0 ? { m: "RGB rejimida sariq rang hosil qiling (qizil + yashil nur).", f: "s.r>=220 && s.g>=220 && s.b<=40" } : null,
      R.indexOf("cmy") >= 0 ? { m: "CMY rejimida yashil rang hosil qiling (havorang + sariq bo‘yoq).", f: "s.c>=80 && s.y>=80 && s.m<=20" } : null,
      R.indexOf("doira") >= 0 ? { m: "Rang doirasida «Qizil»ni tanlab, uning komplementar (qarama-qarshi) rangini ko‘ring.", f: "s.sel==4" } : null
    ].filter(Boolean), api);
    function hex(r, g, b) { return "#" + [r, g, b].map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join("").toUpperCase(); }
    function bosh() {
      box.innerHTML = "";
      if (s.rj === "rgb" || s.rj === "cmy") {
        var rgb = s.rj === "rgb", sv = U.svgBox(260, 230, "lr-sv"), sw = E("div", { cls: "lr-sw" }), out = E("div", { cls: "lk-out" }), c = E("div", { cls: "lz-top" });
        box.appendChild(E("div", { cls: "lz-g" }, [E("div", {}, [sv]), E("div", {}, [c, sw, out])]));
        var K = rgb ? [["r", "Qizil (R)", 255], ["g", "Yashil (G)", 255], ["b", "Ko‘k (B)", 255]] : [["c", "Havorang (C)", 100], ["m", "Pushti (M)", 100], ["y", "Sariq (Y)", 100]];
        K.forEach(function (k) { c.appendChild(rng({ l: k[1], min: 0, max: k[2], q: 1, v: s[k[0]], u: rgb ? "" : "%" }, function (v) { s[k[0]] = v; up(); })); });
        function up() {
          var r, g, b;
          if (rgb) { r = s.r; g = s.g; b = s.b; } else { r = 255 * (1 - s.c / 100); g = 255 * (1 - s.m / 100); b = 255 * (1 - s.y / 100); }
          sv.innerHTML = "";
          sv.appendChild(V("rect", { x: 0, y: 0, width: 260, height: 230, rx: 10, fill: rgb ? "#000" : "#fff", stroke: "#ccc" }));
          var C = rgb ? [[95, 85, "rgb(" + s.r + ",0,0)"], [165, 85, "rgb(0," + s.g + ",0)"], [130, 145, "rgb(0,0," + s.b + ")"]] : [[95, 85, "rgb(" + Math.round(255 * (1 - s.c / 100)) + ",255,255)"], [165, 85, "rgb(255," + Math.round(255 * (1 - s.m / 100)) + ",255)"], [130, 145, "rgb(255,255," + Math.round(255 * (1 - s.y / 100)) + ")"]];
          C.forEach(function (q) { sv.appendChild(V("circle", { cx: q[0], cy: q[1], r: 58, fill: q[2], style: "mix-blend-mode:" + (rgb ? "screen" : "multiply") })); });
          sw.style.background = "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
          qator(out, [["Natija rangi", hex(r, g, b)], ["RGB", Math.round(r) + ", " + Math.round(g) + ", " + Math.round(b)], ["Aralashtirish turi", rgb ? "Additiv (nurlar qo‘shiladi: R+G+B = oq)" : "Subtraktiv (bo‘yoqlar yutadi: C+M+Y ≈ qora)"]]);
          vz.check(s);
        }
        up();
      } else {
        var w = U.svgBox(300, 300, "lr-do"), inf = E("div", { cls: "lx-info", "aria-live": "polite" });
        box.appendChild(E("div", { cls: "lz-g" }, [w, inf]));
        inf.appendChild(E("p", { cls: "muted", text: "Doiradagi rangni bosing — komplementar, triada va analog ranglar ko‘rsatiladi." }));
        DO.forEach(function (d, i) {
          var a0 = (i * 30 - 105) * Math.PI / 180, a1 = (i * 30 - 75) * Math.PI / 180, r0 = 70, r1 = 140, c = 150;
          var pth = "M" + (c + r0 * Math.cos(a0)) + "," + (c + r0 * Math.sin(a0)) + " L" + (c + r1 * Math.cos(a0)) + "," + (c + r1 * Math.sin(a0)) + " A" + r1 + "," + r1 + " 0 0 1 " + (c + r1 * Math.cos(a1)) + "," + (c + r1 * Math.sin(a1)) + " L" + (c + r0 * Math.cos(a1)) + "," + (c + r0 * Math.sin(a1)) + " A" + r0 + "," + r0 + " 0 0 0 " + (c + r0 * Math.cos(a0)) + "," + (c + r0 * Math.sin(a0)) + " Z";
          var e = V("path", { d: pth, fill: d[1], stroke: "#fff", "stroke-width": 2, cls: "lr-s", tabindex: "0", role: "button", "aria-label": d[0] });
          e.addEventListener("click", function () { tanla(i); }); e.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); tanla(i); } });
          w.appendChild(e);
        });
        var mk = V("g", {}); w.appendChild(mk);
        function tanla(i) {
          s.sel = i; mk.innerHTML = "";
          var D = function (k) { return DO[(i + k + 12) % 12]; };
          [0, 6].forEach(function (k) { var a = ((i + k) * 30 - 90) * Math.PI / 180; mk.appendChild(V("circle", { cx: 150 + 105 * Math.cos(a), cy: 150 + 105 * Math.sin(a), r: 9, fill: "#fff", stroke: "#222", "stroke-width": 2.5 })); });
          var a1 = (i * 30 - 90) * Math.PI / 180, a2 = ((i + 6) * 30 - 90) * Math.PI / 180;
          mk.appendChild(V("line", { x1: 150 + 105 * Math.cos(a1), y1: 150 + 105 * Math.sin(a1), x2: 150 + 105 * Math.cos(a2), y2: 150 + 105 * Math.sin(a2), stroke: "#222", "stroke-width": 2, "stroke-dasharray": "5 4" }));
          inf.innerHTML = "";
          function qat(n, L) { var r = E("div", { cls: "lr-q" }, [E("small", { text: n })]); L.forEach(function (d) { r.appendChild(E("span", { cls: "lr-c", title: d[0], style: "background:" + d[1] }, [E("i", { text: d[0] })])); }); inf.appendChild(r); }
          inf.appendChild(E("h4", { text: DO[i][0] }));
          qat("Komplementar (qarama-qarshi)", [DO[i], D(6)]);
          qat("Triada", [DO[i], D(4), D(8)]);
          qat("Analog (qo‘shni)", [D(-1), DO[i], D(1)]);
          qat("Ajratilgan komplementar", [DO[i], D(5), D(7)]);
          inf.appendChild(E("p", { cls: "small", text: p.izoh || "Komplementar ranglar yonma-yon qo‘yilsa bir-birini kuchaytiradi, aralashtirilsa esa bir-birini neytrallaydi (kulrang tus beradi)." }));
          vz.check(s);
        }
      }
    }
    bosh();
  };
})();
