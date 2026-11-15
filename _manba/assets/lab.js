/* Toshkent tuman 1-son texnikumi e-bazasi — Virtual laboratoriya
   Xona (jihozlar stollarda) · jihoz pasporti · slaydlar · virtual ishlatish (lab-sim.js) · sinov · xavfsizlik.
   Ma'lumot: sahifadagi <script id="lab-json"> (generator: _manba/build.py, manba: _manba/lab/*.json). */
(function () {
  "use strict";
  var box = document.getElementById("lab"), src = document.getElementById("lab-json");
  if (!box || !src) return;
  var L = JSON.parse(src.textContent);
  var SIM = window.t1LabSim || {};
  var J = L.jihozlar || [], SL = L.sim || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var JI = {}; J.forEach(function (j) { JI[j.id] = j; });
  var SI = {}; SL.forEach(function (s) { SI[s.id] = s; });

  /* ---------- Natijalar (shu brauzerda) ---------- */
  var KEY = "t1.lab." + L.id, P = { k: {}, s: {}, t: 0 };
  try { var o = JSON.parse(ls(KEY) || "null"); if (o) { P.k = o.k || {}; P.s = o.s || {}; P.t = o.t || 0; } } catch (e) {}
  function save() { ls(KEY, JSON.stringify(P)); holat(); }
  function holat() {
    var k = J.filter(function (j) { return P.k[j.id]; }).length, s = SL.filter(function (x) { return P.s[x.id]; }).length;
    var jami = J.length + SL.length + 1, bor = k + s + (P.t >= 70 ? 1 : 0);
    var el = $(".lab-hol", box); if (!el) return;
    el.innerHTML = '<span>Tanishildi: <b>' + k + "/" + J.length + "</b></span>" + (SL.length ? '<span>Virtual ishlatish: <b>' + s + "/" + SL.length + "</b></span>" : "") +
      '<span>Sinov: <b>' + (P.t ? P.t + "%" : "—") + "</b></span>" + '<span class="lab-pr" title="Umumiy natija"><i style="width:' + Math.round(bor / jami * 100) + '%"></i></span>';
    $$(".lx-j", box).forEach(function (b) { b.classList.toggle("ok", !!P.k[b.getAttribute("data-j")]); });
    $$(".lsim-k", box).forEach(function (b) { b.classList.toggle("ok", !!P.s[b.getAttribute("data-s")]); });
  }

  /* ---------- Qism: tablar ---------- */
  var tabsBox = $("[data-tabs]", box);
  function panel(id) { return $('[data-p="' + id + '"]', box); }
  function go(id) { if (tabsBox && tabsBox.t1Show) tabsBox.t1Show(id, true); var t = $(".tabs", box); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }

  /* ---------- 1. Xona ---------- */
  function zonalar() {
    var Z = [], ZI = {};
    J.forEach(function (j, i) {
      var z = j.zona || (Math.floor(i / 3) + 1) + "-ish o‘rni";
      if (!ZI[z]) { ZI[z] = { nom: z, L: [] }; Z.push(ZI[z]); }
      ZI[z].L.push(j);
    });
    return Z;
  }
  function xona() {
    var p = panel("xona"); if (!p) return;
    var h = '<div class="lx" data-xona="' + esc(L.xona || "sinf") + '"><div class="lx-devor">' +
      '<button type="button" class="lx-plakat" data-go="xavf"><span class="lx-pe">⚠️</span><span>Xavfsizlik<br>qoidalari</span></button>' +
      '<button type="button" class="lx-doska" data-go="slayd"><b>' + esc(L.nomi) + '</b><span>' + J.length + " ta jihoz" + (SL.length ? " · " + SL.length + " ta virtual mashq" : "") + '</span><small>▶ Slaydlarni ochish</small></button>' +
      (SL.length ? '<button type="button" class="lx-monitor" data-go="ishlat"><span class="lx-me">🖥️</span><span>Virtual<br>ishlatish</span></button>' : '<button type="button" class="lx-monitor" data-go="sinov"><span class="lx-me">📝</span><span>Sinov</span></button>') +
      '</div><div class="lx-pol">';
    zonalar().forEach(function (z) {
      h += '<div class="lx-stol"><span class="lx-sn">' + esc(z.nom) + '</span><div class="lx-ust">';
      z.L.forEach(function (j) {
        h += '<button type="button" class="lx-j" data-j="' + esc(j.id) + '" title="' + esc(j.nomi) + '"><span class="lx-e" aria-hidden="true">' + esc(j.e || "🔧") + '</span><span class="lx-n">' + esc(j.nomi) + '</span><i class="lx-ok" aria-label="tanishildi">✓</i></button>';
      });
      h += "</div></div>";
    });
    h += '</div></div><p class="small muted lx-iz">Jihozni bosing — pasporti ochiladi: vazifasi, tuzilishi, ishlatish tartibi va xavfsizlik qoidalari.' + (SL.length ? " «Virtual ishlatish» bo‘limida jihozlarni ekranda ishlatib ko‘ring." : "") + "</p>";
    var w = document.createElement("div"); w.innerHTML = h;
    p.insertBefore(w, p.firstChild);
    $$(".lx-j", w).forEach(function (b) { b.addEventListener("click", function () { pasport(b.getAttribute("data-j")); }); });
    $$("[data-go]", w).forEach(function (b) { b.addEventListener("click", function () { go(b.getAttribute("data-go")); }); });
  }

  /* ---------- Jihoz pasporti (oyna) ---------- */
  var dlg;
  function pasport(id) {
    var j = JI[id]; if (!j) return;
    if (!dlg) {
      dlg = document.createElement("dialog"); dlg.className = "lab-dlg";
      dlg.innerHTML = '<div class="dh"><span class="lab-de"></span><h3></h3><button type="button" class="btn ghost sm" data-x aria-label="Yopish">✕</button></div><div class="db"></div>';
      document.body.appendChild(dlg);
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
      $("[data-x]", dlg).addEventListener("click", function () { dlg.close(); });
    }
    var i = J.indexOf(j), oldin = J[(i - 1 + J.length) % J.length], keyin = J[(i + 1) % J.length];
    $(".lab-de", dlg).textContent = j.e || "🔧"; $("h3", dlg).textContent = j.nomi;
    var h = '<div class="lab-pas">';
    if (j.vazifa) h += '<p class="lab-vz">' + esc(j.vazifa) + "</p>";
    if (j.tuzilish && j.tuzilish.length) h += '<h4>Tuzilishi</h4><ol class="lab-tz">' + j.tuzilish.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>";
    if (j.ishlatish && j.ishlatish.length) h += '<h4>Ishlatish tartibi</h4><ol class="lab-is">' + j.ishlatish.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>";
    if (j.texnik) h += '<h4>Texnik ko‘rsatkichlar</h4><div class="kv">' + Object.keys(j.texnik).map(function (k) { return "<div>" + esc(k) + "</div><div>" + esc(j.texnik[k]) + "</div>"; }).join("") + "</div>";
    if (j.xavfsizlik && j.xavfsizlik.length) h += '<div class="note bad lab-xv"><b>Xavfsizlik</b><ul>' + j.xavfsizlik.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
    h += '<div class="lab-da">';
    if (j.sim && SI[j.sim]) h += '<button type="button" class="btn sm" data-sim="' + esc(j.sim) + '">▶ Virtual ishlatish</button>';
    h += '<a class="btn ghost sm" target="_blank" rel="noopener" href="https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(j.q || j.nomi) + '">🔍 Haqiqiy rasmlari</a>';
    h += '<span class="sp"></span><button type="button" class="btn ghost sm" data-j="' + esc(oldin.id) + '" aria-label="Oldingi jihoz">◀</button><button type="button" class="btn ghost sm" data-j="' + esc(keyin.id) + '" aria-label="Keyingi jihoz">▶</button></div></div>';
    var db = $(".db", dlg); db.innerHTML = h; db.scrollTop = 0;
    $$("[data-j]", db).forEach(function (b) { b.addEventListener("click", function () { pasport(b.getAttribute("data-j")); }); });
    var sb = $("[data-sim]", db); if (sb) sb.addEventListener("click", function () { dlg.close(); go("ishlat"); ochSim(sb.getAttribute("data-sim")); });
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    if (!P.k[j.id]) { P.k[j.id] = 1; save(); }
  }

  /* ---------- 2. Slaydlar ---------- */
  function slaydlar() {
    var S = [];
    S.push({ k: "titul", h: L.nomi, p: (L.fanlar_nomi || []).join(" · "), m: L.tavsif || "" });
    S.push({ k: "panjara", h: "Laboratoriya jihozlari", L: J.map(function (j) { return [j.e || "🔧", j.nomi]; }) });
    J.forEach(function (j) {
      S.push({ k: "jihoz", e: j.e, h: j.nomi, p: j.vazifa, L: (j.tuzilish || []).slice(0, 7), lt: "Tuzilishi" });
      if (j.ishlatish && j.ishlatish.length) S.push({ k: "jihoz", e: j.e, h: j.nomi + ": ishlatish tartibi", L: j.ishlatish.slice(0, 7), lt: "", nl: 1 });
    });
    (L.slaydlar || []).forEach(function (s) { S.push({ k: "matn", e: s.e, h: s.s, p: s.p, L: s.m || [] }); });
    if (L.xavfsizlik && L.xavfsizlik.length) S.push({ k: "matn", e: "⚠️", h: "Xavfsizlik qoidalari", L: L.xavfsizlik.slice(0, 8), xv: 1 });
    S.push({ k: "matn", e: "❓", h: "Mustahkamlash uchun savollar", L: shuf(J).slice(0, 5).map(function (j) { return "«" + j.nomi + "» qanday vazifani bajaradi va qanday qismlardan iborat?"; }), nl: 1 });
    return S;
  }
  function slaydHTML(s, n, N) {
    var h = '<div class="lsl lsl-' + s.k + (s.xv ? " xv" : "") + '">';
    if (s.k === "titul") {
      h += '<div class="lsl-tt"><small>' + esc(L.texnikum || "Toshkent tuman 1-son texnikumi") + " · Virtual laboratoriya</small><h2>" + esc(s.h) + "</h2>" + (s.p ? "<p>" + esc(s.p) + "</p>" : "") + (s.m ? '<p class="lsl-m">' + esc(s.m) + "</p>" : "") + "</div>";
    } else if (s.k === "panjara") {
      h += "<h2>" + esc(s.h) + '</h2><div class="lsl-g">' + s.L.map(function (x) { return '<div><span>' + esc(x[0]) + "</span>" + esc(x[1]) + "</div>"; }).join("") + "</div>";
    } else {
      h += '<div class="lsl-h">' + (s.e ? '<span class="lsl-e">' + esc(s.e) + "</span>" : "") + "<h2>" + esc(s.h) + "</h2></div>";
      if (s.p) h += '<p class="lsl-p">' + esc(s.p) + "</p>";
      if (s.L && s.L.length) h += (s.lt ? '<h3>' + esc(s.lt) + "</h3>" : "") + "<" + (s.nl ? "ol" : "ul") + ">" + s.L.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</" + (s.nl ? "ol" : "ul") + ">";
    }
    return h + '<span class="lsl-n">' + n + " / " + N + "</span></div>";
  }
  function slaydPanel() {
    var p = panel("slayd"); if (!p) return;
    var S = slaydlar(), i = 0;
    p.innerHTML = '<div class="ls"><div class="ls-st" tabindex="0" aria-live="polite"></div><div class="ls-bar">' +
      '<button type="button" class="btn ghost sm" data-a="-1" aria-label="Oldingi slayd">◀</button><span class="ls-no"></span><button type="button" class="btn ghost sm" data-a="1" aria-label="Keyingi slayd">▶</button>' +
      '<span class="sp"></span><button type="button" class="btn ghost sm" data-fs>⛶ To‘liq ekran</button><button type="button" class="btn ghost sm" data-pr>🖨 Chop etish</button></div>' +
      '<p class="small muted">Darsda proyektor yoki aqlli doskada ko‘rsating: ← → tugmalari, ekranni surish yoki bosish bilan o‘tiladi. Slaydlar jihozlar pasportidan avtomatik tuziladi.</p></div>';
    var st = $(".ls-st", p), no = $(".ls-no", p);
    function show(k) { i = (k + S.length) % S.length; st.innerHTML = slaydHTML(S[i], i + 1, S.length); no.textContent = (i + 1) + " / " + S.length; }
    $$("[data-a]", p).forEach(function (b) { b.addEventListener("click", function () { show(i + +b.getAttribute("data-a")); }); });
    st.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); show(i + 1); } if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); show(i - 1); } });
    var x0 = null;
    st.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    st.addEventListener("touchend", function (e) { if (x0 == null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) show(i + (d < 0 ? 1 : -1)); x0 = null; });
    st.addEventListener("click", function (e) { var r = st.getBoundingClientRect(); show(i + (e.clientX - r.left < r.width / 3 ? -1 : 1)); });
    $("[data-fs]", p).addEventListener("click", function () {
      var f = st.requestFullscreen || st.webkitRequestFullscreen;
      if (document.fullscreenElement) document.exitFullscreen(); else if (f) { f.call(st); st.focus(); }
    });
    $("[data-pr]", p).addEventListener("click", function () { chop(S.map(function (s, k) { return slaydHTML(s, k + 1, S.length); }).join(""), "ls-chop"); });
    show(0);
  }

  /* ---------- Chop etish (oq-qora) ---------- */
  function chop(html, cls) {
    var c = document.getElementById("chop"); if (c) c.remove();
    c = document.createElement("div"); c.id = "chop"; c.className = cls || ""; c.innerHTML = '<div class="lab-chop-h">' + esc(L.texnikum || "Toshkent tuman 1-son texnikumi") + " · " + esc(L.nomi) + "</div>" + html;
    document.body.appendChild(c); document.body.classList.add("chop-rejim");
    var tz = function () { document.body.classList.remove("chop-rejim"); c.remove(); window.removeEventListener("afterprint", tz); };
    window.addEventListener("afterprint", tz);
    setTimeout(function () { window.print(); setTimeout(function () { if (document.body.classList.contains("chop-rejim") && !window.matchMedia("print").matches) tz(); }, 1500); }, 60);
  }

  /* ---------- 3. Virtual ishlatish ---------- */
  var TUR = { tartib: "Ketma-ketlik", moslash: "Moslashtirish", tanlash: "Vaziyatli masala", qurilma: "Qurilmani ishlatish", kalkulyator: "Hisob-kitob", sxema: "Sxema bilan tanishish" };
  function ishlatPanel() {
    var p = panel("ishlat"); if (!p) return;
    if (!SL.length) { p.innerHTML = '<div class="empty"><p><b>Bu laboratoriyada virtual mashqlar hali yo‘q.</b></p><p class="muted small">Jihozlar pasporti va slaydlardan foydalaning.</p></div>'; return; }
    p.innerHTML = '<div class="lsim-l grid g3"></div><div class="lsim-box" hidden><div class="lsim-h"><button type="button" class="btn ghost sm" data-orq>◀ Mashqlar ro‘yxati</button><h3></h3><button type="button" class="btn ghost sm" data-qayta>↻ Qaytadan</button></div><p class="lsim-iz muted small"></p><div class="lsim-in"></div></div>';
    var l = $(".lsim-l", p);
    SL.forEach(function (s, k) {
      var b = document.createElement("button"); b.type = "button"; b.className = "card lsim-k"; b.setAttribute("data-s", s.id);
      b.innerHTML = '<span class="lsim-e">' + esc(s.e || "▶") + '</span><span class="lsim-t"><small>' + esc(s.turi || TUR[s.tur] || "Virtual simulyator") + "</small><b>" + esc(s.nomi) + "</b>" + (s.izoh ? '<span class="muted small">' + esc(s.izoh) + "</span>" : "") + '</span><i class="lx-ok">✓</i>';
      b.addEventListener("click", function () { ochSim(s.id); });
      l.appendChild(b);
    });
    $("[data-orq]", p).addEventListener("click", function () { yopSim(); });
    $("[data-qayta]", p).addEventListener("click", function () { if (joriy) ochSim(joriy, true); });
  }
  var joriy = null;
  function ochSim(id, qayta) {
    var s = SI[id], p = panel("ishlat"); if (!s || !p) return;
    joriy = id;
    var bx = $(".lsim-box", p), inn = $(".lsim-in", p);
    $(".lsim-l", p).hidden = true; bx.hidden = false;
    $("h3", bx).textContent = (s.e ? s.e + " " : "") + s.nomi;
    $(".lsim-iz", bx).textContent = s.izoh || "";
    inn.innerHTML = ""; inn.className = "lsim-in lsim-" + s.tur;
    var f = SIM[s.tur];
    if (!f) { inn.innerHTML = '<p class="note bad">Bu simulyator turi topilmadi: ' + esc(s.tur) + "</p>"; return; }
    try {
      f(inn, s.p || {}, {
        lab: L, sim: s,
        done: function (ball, matn) { ball = Math.max(0, Math.min(100, Math.round(ball == null ? 100 : ball))); if ((P.s[id] || 0) < ball) { P.s[id] = ball; save(); } natija(inn, ball, matn); }
      });
    } catch (e) { inn.innerHTML = '<p class="note bad">Simulyatorni ochishda xato: ' + esc(e.message) + "</p>"; if (window.console) console.error(e); }
    if (!qayta) bx.scrollIntoView({ behavior: "smooth", block: "start" });
    try { history.replaceState(null, "", "#sim-" + id); } catch (e) {}
  }
  function natija(inn, ball, matn) {
    var n = $(".lsim-nat", inn); if (n) n.remove();
    n = document.createElement("div"); n.className = "note " + (ball >= 70 ? "ok" : "") + " lsim-nat";
    n.innerHTML = "<b>" + (ball >= 90 ? "🏆 A’lo! " : ball >= 70 ? "✅ Yaxshi! " : "🙂 Yana bir bor urinib ko‘ring. ") + "Natija: " + ball + "%</b>" + (matn ? "<br>" + esc(matn) : "");
    inn.appendChild(n);
    var t = SL.indexOf(SI[joriy]) + 1;
    if (t > 0 && t < SL.length) { var b = document.createElement("button"); b.type = "button"; b.className = "btn sm"; b.style.marginTop = "8px"; b.textContent = "Keyingi mashq ▶"; var nx = SL[t].id; b.addEventListener("click", function () { ochSim(nx); }); n.appendChild(document.createElement("br")); n.appendChild(b); }
  }
  function yopSim() { var p = panel("ishlat"); joriy = null; $(".lsim-in", p).innerHTML = ""; $(".lsim-box", p).hidden = true; $(".lsim-l", p).hidden = false; try { history.replaceState(null, "", "#ishlat"); } catch (e) {} }

  /* ---------- 4. Sinov (jihozlar pasportidan avtomatik + qo'shimcha savollar) ---------- */
  function savollar() {
    var Q = [];
    var nom = function (j) { return j.nomi; };
    J.forEach(function (j) {
      if (j.vazifa && J.length >= 3) {
        var v = j.vazifa.replace(new RegExp(j.nomi.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "…");
        var alt = shuf(J.filter(function (x) { return x !== j; })).slice(0, 3);
        Q.push({ s: "Ta’rif qaysi jihozga tegishli?\n«" + v + "»", v: shuf([j].concat(alt)).map(nom), t: j.nomi });
      }
      if (j.tuzilish && j.tuzilish.length && J.length >= 3) {
        var q = j.tuzilish[Math.floor(Math.random() * j.tuzilish.length)], qn = q.toLowerCase().split(/[ (—–-]/)[0];
        var al = shuf(J.filter(function (x) { return x !== j && !(x.tuzilish || []).some(function (t) { return t.toLowerCase().indexOf(qn) >= 0; }); })).slice(0, 3);
        if (al.length >= 2) Q.push({ s: "«" + q + "» qaysi jihozning qismi?", v: shuf([j].concat(al)).map(nom), t: j.nomi });
      }
    });
    Q = shuf(Q).slice(0, 8);
    (L.test || []).forEach(function (t) { Q.push({ s: t.s, v: t.v.slice(), t: t.v[t.t], i: t.i }); });
    return shuf(Q).slice(0, 12).map(function (q) { if (!q.mix) q.v = shuf(q.v); return q; });
  }
  function sinovPanel() {
    var p = panel("sinov"); if (!p) return;
    var Q, i, ball;
    function bosh() {
      Q = savollar(); i = 0; ball = 0;
      if (!Q.length) { p.innerHTML = '<div class="empty"><p><b>Sinov uchun savollar yetarli emas.</b></p></div>'; return; }
      sav();
    }
    function sav() {
      var q = Q[i];
      p.innerHTML = '<div class="card lt"><div class="lt-h"><span class="tag">Savol ' + (i + 1) + " / " + Q.length + '</span><span class="muted small">To‘g‘ri: ' + ball + '</span></div><p class="lt-s">' + esc(q.s).replace(/\n/g, "<br>") + '</p><div class="lt-v">' +
        q.v.map(function (v, k) { return '<button type="button" class="lt-b" data-k="' + k + '"><span>' + "ABCDEF"[k] + "</span>" + esc(v) + "</button>"; }).join("") + '</div><div class="lt-i"></div></div>';
      $$(".lt-b", p).forEach(function (b) {
        b.addEventListener("click", function () {
          var v = q.v[+b.getAttribute("data-k")], ok = v === q.t;
          if (ok) ball++;
          $$(".lt-b", p).forEach(function (x) { x.disabled = true; var vv = q.v[+x.getAttribute("data-k")]; if (vv === q.t) x.classList.add("ok"); else if (x === b) x.classList.add("no"); });
          var inf = $(".lt-i", p);
          inf.innerHTML = '<p class="' + (ok ? "lt-ok" : "lt-no") + '"><b>' + (ok ? "To‘g‘ri!" : "Noto‘g‘ri.") + "</b> " + (ok ? "" : "To‘g‘ri javob: " + esc(q.t) + ". ") + (q.i ? esc(q.i) : "") + "</p>";
          var nb = document.createElement("button"); nb.type = "button"; nb.className = "btn sm"; nb.textContent = i + 1 < Q.length ? "Keyingi savol ▶" : "Natijani ko‘rish";
          nb.addEventListener("click", function () { i++; if (i < Q.length) sav(); else yakun(); });
          inf.appendChild(nb); nb.focus();
        });
      });
    }
    function yakun() {
      var f = Math.round(ball / Q.length * 100);
      if (f > P.t) { P.t = f; save(); }
      p.innerHTML = '<div class="card lt lt-y"><div class="lt-ball">' + f + '%</div><p><b>' + ball + " / " + Q.length + " to‘g‘ri javob.</b> " + (f >= 86 ? "A’lo natija!" : f >= 71 ? "Yaxshi natija." : f >= 56 ? "Qoniqarli. Jihozlar pasportini yana bir bor ko‘rib chiqing." : "Jihozlar pasporti va slaydlarni takrorlab, qayta urinib ko‘ring.") +
        '</p><p class="muted small">Eng yaxshi natija: ' + P.t + '% (shu qurilmada saqlanadi). Savollar har safar yangidan aralashtiriladi.</p><button type="button" class="btn sm" data-q>↻ Qayta topshirish</button></div>';
      $("[data-q]", p).addEventListener("click", bosh);
    }
    p.innerHTML = '<div class="card lt"><h3>Bilimingizni sinang</h3><p class="muted">Savollar shu laboratoriya jihozlarining vazifasi va tuzilishi bo‘yicha avtomatik tuziladi' + ((L.test || []).length ? " va o‘qituvchi savollari bilan to‘ldiriladi" : "") + '. 70% va undan yuqori — laboratoriya «o‘zlashtirildi».</p><button type="button" class="btn" data-b>Sinovni boshlash</button></div>';
    $("[data-b]", p).addEventListener("click", bosh);
  }

  /* ---------- 5. Xavfsizlik ---------- */
  function xavfPanel() {
    var p = panel("xavf"); if (!p) return;
    var h = "";
    if (L.xavfsizlik && L.xavfsizlik.length) h += '<div class="card lxv"><h3>⚠️ Laboratoriyada umumiy xavfsizlik qoidalari</h3><ol>' + L.xavfsizlik.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol></div>";
    var jx = J.filter(function (j) { return j.xavfsizlik && j.xavfsizlik.length; });
    if (jx.length) h += '<h3 style="margin-top:22px">Jihozlar bo‘yicha</h3><div class="grid g2">' + jx.map(function (j) { return '<div class="card lxv"><h4>' + esc((j.e || "") + " " + j.nomi) + "</h4><ul>" + j.xavfsizlik.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>";
    h += '<div class="toolbar" style="margin-top:16px"><button type="button" class="btn ghost sm" data-pr>🖨 Xavfsizlik yo‘riqnomasini chop etish</button></div>';
    p.innerHTML = h || '<div class="empty"><p>Xavfsizlik qoidalari kiritilmagan.</p></div>';
    var b = $("[data-pr]", p); if (b) b.addEventListener("click", function () { chop('<h1>Xavfsizlik yo‘riqnomasi</h1>' + p.innerHTML.replace(/<div class="toolbar"[\s\S]*$/, ""), "lab-chop"); });
  }

  /* ---------- Jihozlar ro'yxatini chop etish ---------- */
  var pb = $("[data-pasport-chop]", box);
  if (pb) pb.addEventListener("click", function () { var l = $(".lab-royxat", box); $$("details", l).forEach(function (d) { d.open = true; }); chop("<h1>Jihozlar pasporti</h1>" + l.innerHTML, "lab-chop"); });

  xona(); slaydPanel(); ishlatPanel(); sinovPanel(); xavfPanel(); holat();
  var h = location.hash.slice(1);
  if (/^sim-/.test(h) && SI[h.slice(4)]) { go("ishlat"); ochSim(h.slice(4)); }
  else if (/^j-/.test(h) && JI[h.slice(2)]) pasport(h.slice(2));
  window.t1Lab = { L: L, ochSim: ochSim, pasport: pasport };
})();
