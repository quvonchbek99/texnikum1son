/* Fan sahifasi: tayyor materiallar (RTR) + o'qituvchilar kabinet orqali joylagan materiallar (Firestore). */
(function () {
  "use strict";
  var root = document.getElementById("fan"); if (!root) return;
  var ROOT = (window.t1 && t1.ROOT) || "";
  var Y = root.getAttribute("data-y"), FN = root.getAttribute("data-f"), FAN = root.getAttribute("data-fan"), YN = root.getAttribute("data-yn");
  var PLAN = JSON.parse(root.getAttribute("data-plan") || "{}"), RTR = JSON.parse(root.getAttribute("data-rtr") || "{}");
  var SEMS = Object.keys(PLAN);
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var PANELS = ["tmr", "xarita", "maruza", "amaliy", "mustaqil", "nazorat", "glossariy", "oum", "fayllar"];
  var TUR2P = { tmr: "tmr", xarita: "xarita", maruza: "maruza", amaliy: "amaliy", mustaqil: "mustaqil", nazorat: "nazorat", glossariy: "glossariy", oum: "oum", dastur: "oum", taqdimot: "fayllar", media: "fayllar", boshqa: "fayllar" };
  var TURNOM = { tmr: "TMR", xarita: "Texnologik xarita", maruza: "Ma’ruza", amaliy: "Amaliy ish", mustaqil: "Mustaqil ish", nazorat: "Nazorat", glossariy: "Glossariy", oum: "O‘UM", dastur: "Ishchi dastur", taqdimot: "Taqdimot", media: "Media", boshqa: "Boshqa" };
  var EMPTY = {};
  PANELS.forEach(function (p) { var el = root.querySelector('[data-p="' + p + '"]'); if (el) EMPTY[p] = el.innerHTML; });
  var CACHE = null, cur = null, GEN = {};

  function sem0() { var s = new URLSearchParams(location.search).get("sem"); return SEMS.indexOf(s) >= 0 ? s : (root.getAttribute("data-def") || SEMS[0]); }
  function reset() {
    GEN = {}; window.t1Majmua = [];
    PANELS.forEach(function (p) { var el = root.querySelector('[data-p="' + p + '"]'); if (el) el.innerHTML = EMPTY[p]; var c = root.querySelector('[data-t="' + p + '"] .cnt'); if (c) c.textContent = ""; });
  }
  function hours(s) {
    var p = PLAN[s] || {}, h = root.querySelector("[data-soat]");
    if (h) h.innerHTML = "<b>" + s + "-semestr:</b> jami " + p.jami + " soat" + (p.auditoriya ? " · auditoriya " + p.auditoriya + " soat (" + (p.auditoriya / 2) + " ta dars) · mustaqil ta’lim " + (p.jami - p.auditoriya) + " soat" : " · auditoriya/mustaqil taqsimoti kasb-emis’dan aniqlanadi");
  }
  function show(s) {
    if (s === cur) return; cur = s; reset(); hours(s);
    var st = RTR[s];
    var pr = st ? fetch(st.json).then(function (r) { return r.json(); }).then(function (D) {
      t1RTR.render(D, { root: root, base: st.base, paket: st.paket, plan: PLAN[s], fan: FAN, yonalish: YN, manba: st.manba });
    }) : Promise.resolve();
    pr.then(function () { return Promise.all([dinamik(s), agent(s)]); })["catch"](function (e) { console.warn("[fan]", e); });
  }
  document.addEventListener("t1-sem", function (e) { show(e.detail); });
  show(sem0());

  /* ---------- O'qituvchilar joylagan materiallar ---------- */
  function getAll() {
    if (CACHE) return CACHE;
    CACHE = t1Bulut.load().then(function (B) {
      var F = B.F;
      return F.getDocs(F.query(F.collection(B.db, "t1_materiallar"), F.where("yonalish", "==", Y), F.where("fan", "==", FN), F.where("holat", "==", "joylangan")))
        .then(function (qs) { var a = []; qs.forEach(function (d) { var x = d.data(); x.id = d.id; a.push(x); }); return { B: B, list: a }; });
    })["catch"](function (e) { console.info("[fan] bulut materiallari olinmadi:", e && e.message); return { list: [] }; });
    return CACHE;
  }
  function slot(p, title) {
    var el = root.querySelector('[data-p="' + p + '"]'); if (!el) return null;
    if (el.querySelector(".empty")) el.innerHTML = "";
    var w = document.createElement("div"); w.className = "dyn";
    if (title) w.innerHTML = '<h3 style="margin-top:18px">' + title + "</h3>";
    el.appendChild(w); return w;
  }
  function bump(p, n) { var c = root.querySelector('[data-t="' + p + '"] .cnt'); if (c) c.textContent = (+c.textContent || 0) + n; }
  function dinamik(s) {
    if (!window.t1Bulut) return;
    return getAll().then(function (R) {
      var L = R.list.filter(function (m) { return String(m.sem) === String(s); });
      L.sort(function (a, b) { return ((b.yangilandi && b.yangilandi.seconds) || 0) - ((a.yangilandi && a.yangilandi.seconds) || 0); });
      L.forEach(function (m) { if (m.rtr && !RTR[s]) rtrDin(R.B, m, s); else oddiy(R.B, m, s); });
    });
  }
  function rtrDin(B, m, s) {
    var F = B.F;
    F.getDocs(F.query(F.collection(B.db, "t1_materiallar", m.id, "hujjatlar"), F.where("turi", "==", "rtr"))).then(function (qs) {
      var meta = null, T = [];
      qs.forEach(function (d) { var x = d.data(); var j = JSON.parse(x.json || "{}"); if (x.qism === "meta") meta = j; else T.push([x.tartib || 0, j]); });
      if (!meta) return;
      meta.topics = T.sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; });
      t1RTR.render(meta, { root: root, base: "t1media:", plan: PLAN[s], fan: FAN, yonalish: YN, manba: "o‘qituvchi joylagan raqamli resurs (" + (m.oqituvchi || "") + ")" });
      mediaYechish(B, m.media || {});
    });
  }
  function mediaYechish(B, map) {
    var els = root.querySelectorAll('img[src^="t1media:"], video[src^="t1media:"]');
    Array.prototype.forEach.call(els, function (el) {
      var k = el.getAttribute("src").slice(8), id = map[k];
      if (!id) { (el.closest("figure") || el).remove(); return; }
      if (el.tagName === "VIDEO") {
        var f = document.createElement("iframe"); f.src = DRIVE.preview(id); f.loading = "lazy"; f.allow = "autoplay; fullscreen";
        f.style.cssText = "width:100%;aspect-ratio:16/9;border:0;border-radius:10px;background:#000"; el.replaceWith(f);
      } else el.src = DRIVE.rasm(id);
    });
  }
  function oddiy(B, m, s) {
    var F = B.F, kim = esc(m.oqituvchi || "o‘qituvchi");
    if ((m.tmr || []).length) {
      var sum = m.tmr.reduce(function (a, r) { return a + (+r.soat || 0); }, 0), aud = (PLAN[s] || {}).auditoriya;
      var w = slot("tmr", "TMR — " + kim);
      w.innerHTML += (aud ? '<p class="note ' + (aud === sum ? "ok" : "bad") + '">' + (aud === sum ? "✓ " : "✗ ") + "TMR jami " + sum + " soat, o‘quv rejada auditoriya " + aud + " soat.</p>" : "") +
        '<div class="tbl-w"><table><thead><tr><th class=n>№</th><th>Mavzu</th><th>Turi</th><th class=n>Soat</th><th>Reja sanasi</th><th>O‘tilgan sana</th></tr></thead><tbody>' +
        m.tmr.map(function (r, i) { return "<tr><td class=n>" + (i + 1) + "</td><td>" + esc(r.mavzu) + "</td><td>" + esc(r.tur || "") + "</td><td class=n>" + esc(r.soat) + "</td><td></td><td></td></tr>"; }).join("") +
        '<tr class="jami"><td></td><td>Jami</td><td></td><td class=n>' + sum + "</td><td></td><td></td></tr></tbody></table></div>";
      bump("tmr", m.tmr.length);
      genQosh(s, { tur: "tmr", sarlavha: "TMR — " + (m.oqituvchi || "o‘qituvchi"), html: w.innerHTML.replace(/<h3[^>]*>.*?<\/h3>/, "") });
    }
    F.getDocs(F.query(F.collection(B.db, "t1_materiallar", m.id, "hujjatlar"), F.orderBy("tartib"))).then(function (qs) {
      var by = {};
      qs.forEach(function (d) { var x = d.data(); x.id = d.id; if (x.turi === "rtr") return; var p = TUR2P[x.turi] || "fayllar"; (by[p] = by[p] || []).push(x); });
      Object.keys(by).forEach(function (p) { by[p].forEach(function (x) { if (x.html) genQosh(s, { tur: x.turi, dars: x.dars, sarlavha: x.sarlavha || x.nom, B: B, mid: m.id, xid: x.id }); }); });
      Object.keys(by).forEach(function (p) {
        var w = slot(p, "O‘qituvchi joylagan: " + kim);
        by[p].forEach(function (x) {
          var d = document.createElement("details"); d.className = "mv";
          d.innerHTML = '<summary><span class="no">' + (x.dars ? esc(x.dars) + "-dars" : esc(TURNOM[x.turi] || "")) + "</span><span>" + esc(x.sarlavha || x.nom) + "</span>" +
            (x.ai ? ' <span class="tag w">AI qoralama</span>' : "") + '</summary><div class="ic doc"><p class="muted small">Yuklanmoqda…</p></div>';
          var ic = d.querySelector(".ic"), done = false;
          d.addEventListener("toggle", function () {
            if (!d.open || done) return; done = true;
            var tasks = [x.html ? F.getDoc(F.doc(B.db, "t1_materiallar", m.id, "matnlar", x.id)) : Promise.resolve(null), purify()];
            Promise.all(tasks).then(function (r) {
              var h = r[0] && r[0].exists() ? r[0].data().html : "";
              ic.innerHTML = (h ? window.DOMPurify.sanitize(h) + (x.qisqartirilgan ? '<p class="note">Matn juda uzun — to‘liq variantini «Asl faylni ko‘rish» orqali oching.</p>' : "") : '<p class="muted">Bu fayl matn ko‘rinishida chiqmaydi — «Asl faylni ko‘rish» tugmasini bosing.</p>') +
                '<div class="toolbar no-print" style="margin-top:12px">' + (x.drive_id ? '<button class="btn sm" data-ko>Asl faylni ko‘rish</button><a class="btn sm ghost" href="' + DRIVE.yukla(x.drive_id) + '" target="_blank" rel="noopener">Yuklab olish (' + esc((x.ext || "").toUpperCase()) + ", " + kb(x.hajm) + ")</a>" : "") +
                (h ? '<button class="btn sm ghost" data-pr>Chop etish</button><button class="btn sm ghost" data-wd>Word (.doc)</button>' : "") + "</div>";
              var ko = ic.querySelector("[data-ko]"), pr = ic.querySelector("[data-pr]"), wd = ic.querySelector("[data-wd]");
              if (ko) ko.addEventListener("click", function () { DRIVE.oyna(x.drive_id, x.sarlavha || x.nom); });
              if (pr) pr.addEventListener("click", function () { t1RTR.chop("<h2>" + esc(x.sarlavha || x.nom) + "</h2>" + window.DOMPurify.sanitize(h)); });
              if (wd) wd.addEventListener("click", function () { t1RTR.word("<h2>" + esc(x.sarlavha || x.nom) + "</h2>" + window.DOMPurify.sanitize(h), x.sarlavha || x.nom); });
            })["catch"](function (e) { ic.innerHTML = '<p class="note bad">Ochib bo‘lmadi: ' + esc(t1Bulut.uzXato(e)) + "</p>"; });
          });
          w.appendChild(d);
        });
        bump(p, by[p].length);
      });
    });
  }

  /* ---------- Kuvi agent bo'laklagan katta majmualar (agent/index.json → agent/m/<id>.json, fayl/<id>.pdf) ---------- */
  var A2P = { tmr: "tmr", xarita: "xarita", maruza: "maruza", amaliy: "amaliy", mustaqil: "mustaqil", nazorat: "nazorat", glossariy: "glossariy",
    titul: "oum", annotatsiya: "oum", dastur: "oum", adabiyot: "oum", boshqa: "fayllar" };
  var ANOM = { tmr: "TMR", xarita: "Texnologik xarita", maruza: "Ma’ruza", amaliy: "Amaliy ish", mustaqil: "Mustaqil ta’lim", nazorat: "Nazorat",
    glossariy: "Glossariy", titul: "Titul", annotatsiya: "Annotatsiya", dastur: "Ishchi dastur", adabiyot: "Adabiyotlar", boshqa: "Boshqa" };
  var AIDX = null;
  function agent(s) {
    if (!AIDX) AIDX = fetch(ROOT + "agent/index.json?t=" + Math.floor(Date.now() / 300000)).then(function (r) { return r.ok ? r.json() : {}; })["catch"](function () { return {}; });
    return AIDX.then(function (idx) {
      var L = (idx[Y + "|" + FN] || []).filter(function (x) { return !x.sem || String(x.sem) === String(s); });
      return Promise.all(L.map(function (x) { return fetch(ROOT + "agent/m/" + x.id + ".json").then(function (r) { return r.json(); })["catch"](function () { return null; }); }));
    }).then(function (MS) {
      MS.filter(Boolean).forEach(function (m) { if (String(cur) === String(s)) majmua(m); });
    });
  }
  function bet(q) { return q.bet_bosh === q.bet_oxir ? q.bet_bosh + "-bet" : q.bet_bosh + "–" + q.bet_oxir + "-bet"; }
  function majmua(m) {
    var pdf = ROOT + m.pdf, kim = esc(m.oqituvchi || "o‘qituvchi"), by = {};
    (window.t1Majmua = window.t1Majmua || []).push({ id: m.id, nom: m.nom, pdf: pdf, k: ROOT + "agent/k/" + m.id + ".json", betlar: m.betlar, qismlar: m.qismlar });
    document.dispatchEvent(new CustomEvent("t1-majmua"));
    m.qismlar.forEach(function (q) { var p = A2P[q.turi] || "fayllar"; (by[p] = by[p] || []).push(q); });
    Object.keys(by).forEach(function (p) {
      var w = slot(p, "Majmuadan: " + esc(m.nom) + ' <span class="muted small">— ' + kim + "</span>");
      if (!w) return;
      by[p].forEach(function (q) {
        var d = document.createElement("details"); d.className = "mv";
        d.innerHTML = '<summary><span class="no">' + (q.dars ? esc(q.dars) + "-dars" : esc(ANOM[q.turi] || "")) + "</span><span>" + esc(q.sarlavha || ANOM[q.turi]) + '</span> <span class="tag">' + bet(q) + '</span></summary><div class="ic"></div>';
        var ic = d.querySelector(".ic"), done = false;
        d.addEventListener("toggle", function () { if (d.open && !done) { done = true; t1PDF.ichki(ic, pdf, { bosh: q.bet_bosh, oxir: q.bet_oxir, sarlavha: q.sarlavha, nom: m.nom + " — " + (q.sarlavha || ANOM[q.turi]) }); } });
        w.appendChild(d);
      });
      bump(p, by[p].length);
    });
    // O'UM: to'liq majmua + PDF yig'uvchi
    var el = root.querySelector('[data-p="oum"]'); if (!el) return;
    if (el.querySelector(".empty")) el.innerHTML = "";
    var box = document.createElement("div"); box.className = "yig no-print";
    var turlar = Object.keys(ANOM).filter(function (t) { return m.qismlar.some(function (q) { return q.turi === t; }); });
    box.innerHTML = '<div class="yig-h"><h3>To‘liq majmua: ' + esc(m.nom) + "</h3><p class=\"small muted\">" + m.betlar + " bet · " + kim + " · " + esc(m.sana || "") +
      '. Butun majmuani oching yoki kerakli qismlarni belgilab, bitta PDF yoki alohida fayllar (ZIP) qilib oling.</p></div>' +
      '<div class="toolbar"><button type="button" class="btn" data-och>Majmuani ochish</button><a class="btn ghost" href="' + pdf + '" download>To‘liq PDF (' + Math.max(1, Math.round((m.hajm || 0) / 1048576)) + " MB)</a>" +
      (m.drive_id ? '<a class="btn ghost" target="_blank" rel="noopener" href="https://drive.google.com/file/d/' + encodeURIComponent(m.drive_id) + '/view">Asl fayl (Drive)</a>' : "") + "</div>" +
      '<fieldset><legend>Qismlar</legend><div class="yig-tz"><button type="button" class="kv-l" data-qa="1">Hammasi</button><button type="button" class="kv-l" data-qa="0">Tozalash</button></div>' +
      turlar.map(function (t) {
        var Q = m.qismlar.filter(function (q) { return q.turi === t; });
        return '<details class="yig-m"><summary><label><input type="checkbox" data-qt="' + t + '" checked> <b>' + ANOM[t] + '</b></label> <span class="muted small">(' + Q.length + ")</span></summary><div class=\"yig-ml\">" +
          Q.map(function (q) { return '<label class="yig-c"><input type="checkbox" data-qi="' + q.id + '" data-qt-of="' + t + '" checked> ' + (q.dars ? '<span class="no">' + q.dars + "-dars</span> " : "") + esc(q.sarlavha) + ' <span class="muted small">' + bet(q) + "</span></label>"; }).join("") + "</div></details>";
      }).join("") + "</fieldset>" +
      '<fieldset class="yig-r"><legend>Qanday chiqarilsin</legend><label class="yig-c"><input type="radio" name="agc' + m.id + '" value="bir" checked> Bitta PDF</label><label class="yig-c"><input type="radio" name="agc' + m.id + '" value="tur"> Turlar bo‘yicha alohida PDF (ZIP)</label><label class="yig-c"><input type="radio" name="agc' + m.id + '" value="har"> Har qism alohida PDF (ZIP)</label></fieldset>' +
      '<p class="small" data-as></p><div class="toolbar"><button type="button" class="btn" data-aw>Yuklab olish</button></div>';
    el.insertBefore(box, el.firstChild);
    var $$ = function (q) { return Array.prototype.slice.call(box.querySelectorAll(q)); };
    function tanl() { var ids = $$("[data-qi]:checked").map(function (c) { return c.getAttribute("data-qi"); }); return m.qismlar.filter(function (q) { return ids.indexOf(q.id) >= 0; }); }
    function rej() { return (box.querySelector('[name="agc' + m.id + '"]:checked') || {}).value || "bir"; }
    function yangila() {
      $$("[data-qt]").forEach(function (g) { var D = $$('[data-qt-of="' + g.getAttribute("data-qt") + '"]'), c = D.filter(function (x) { return x.checked; }).length; g.checked = c === D.length && c > 0; g.indeterminate = c > 0 && c < D.length; });
      var T = tanl(), n = T.reduce(function (a, q) { return a + q.bet_oxir - q.bet_bosh + 1; }, 0);
      box.querySelector("[data-as]").innerHTML = "Tanlandi: <b>" + T.length + "</b> / " + m.qismlar.length + " ta qism, <b>" + n + "</b> bet.";
      box.querySelector("[data-aw]").textContent = rej() === "bir" ? "PDF yuklab olish" : "ZIP yuklab olish";
    }
    box.addEventListener("change", function (e) { var t = e.target; if (t.hasAttribute("data-qt")) $$('[data-qt-of="' + t.getAttribute("data-qt") + '"]').forEach(function (x) { x.checked = t.checked; }); yangila(); });
    $$("[data-qa]").forEach(function (b) { b.addEventListener("click", function () { var v = b.getAttribute("data-qa") === "1"; $$("[data-qi]").forEach(function (c) { c.checked = v; }); yangila(); }); });
    $$("summary label").forEach(function (l) { l.addEventListener("click", function (e) { e.stopPropagation(); }); });
    box.querySelector("[data-och]").addEventListener("click", function () { t1PDF.och(pdf, { sarlavha: m.nom, nom: m.nom }); });
    box.querySelector("[data-aw]").addEventListener("click", function () {
      var T = tanl(), b = this, eski = b.textContent, r = rej();
      if (!T.length) { alert("Kamida bitta qismni belgilang."); return; }
      b.disabled = true; var pr = function (p) { b.textContent = "Yuklanmoqda " + Math.round(p * 100) + "%"; };
      var ish;
      if (r === "bir") ish = t1PDF.kes(pdf, T.map(function (q) { return [q.bet_bosh, q.bet_oxir]; }), pr).then(function (by) { t1PDF.saqla(by, m.nom + (T.length < m.qismlar.length ? " (tanlangan qismlar)" : "")); });
      else {
        var guruh = [];
        if (r === "har") T.forEach(function (q, i) { guruh.push({ nom: (i < 9 ? "0" : "") + (i + 1) + " " + (ANOM[q.turi] || q.turi) + (q.dars ? " " + q.dars + "-dars" : "") + " - " + (q.sarlavha || ""), o: [[q.bet_bosh, q.bet_oxir]] }); });
        else turlar.forEach(function (t) { var Q = T.filter(function (q) { return q.turi === t; }); if (Q.length) guruh.push({ nom: (guruh.length < 9 ? "0" : "") + (guruh.length + 1) + " " + ANOM[t], o: Q.map(function (q) { return [q.bet_bosh, q.bet_oxir]; }) }); });
        var out = [];
        ish = guruh.reduce(function (p, g) { return p.then(function () { return t1PDF.kes(pdf, g.o, pr).then(function (by) { out.push({ nom: g.nom, bytes: by }); b.textContent = "Tayyorlanmoqda " + out.length + "/" + guruh.length; }); }); }, Promise.resolve())
          .then(function () { return t1PDF.zip(out, m.nom + (r === "har" ? " - qismlar" : " - turlar")); });
      }
      ish["catch"](function (e) { alert("Tayyorlanmadi: " + (e && e.message || e)); }).then(function () { b.disabled = false; b.textContent = eski; yangila(); });
    });
    yangila();
  }

  /* ---------- O'qituvchi hujjatlaridan majmua yig'ish (RTR bo'lmagan materiallar) ---------- */
  var GTUR = ["dastur", "tmr", "xarita", "maruza", "amaliy", "mustaqil", "nazorat", "glossariy", "oum", "boshqa"];
  var gT = 0;
  function genQosh(s, d) { (GEN[s] = GEN[s] || []).push(d); clearTimeout(gT); gT = setTimeout(function () { if (String(cur) === String(s)) genUI(s); }, 300); }
  function genUI(s) {
    var L = (GEN[s] || []).slice().sort(function (a, b) { return GTUR.indexOf(a.tur) - GTUR.indexOf(b.tur) || (+a.dars || 0) - (+b.dars || 0); });
    var el = root.querySelector('[data-p="oum"]'); if (!el || !L.length) return;
    if (el.querySelector(".empty")) el.innerHTML = "";
    var box = el.querySelector(".yig[data-gen]");
    if (!box) { box = document.createElement("div"); box.className = "yig no-print"; box.setAttribute("data-gen", ""); el.insertBefore(box, el.firstChild); }
    var turlar = GTUR.filter(function (t) { return L.some(function (d) { return d.tur === t; }); });
    box.innerHTML = '<div class="yig-h"><h3>Majmuani yig‘ish — o‘qituvchilar joylagan hujjatlardan</h3><p class="small muted">Kerakli hujjatlarni (mavzu/dars bo‘yicha) belgilang: bitta umumiy majmua yoki har biri alohida fayl.</p></div>' +
      '<fieldset><legend>Hujjatlar</legend><div class="yig-tz"><button type="button" class="kv-l" data-ga="1">Hammasi</button><button type="button" class="kv-l" data-ga="0">Tozalash</button></div>' +
      turlar.map(function (t) {
        var D = L.filter(function (d) { return d.tur === t; });
        return '<details class="yig-m" open><summary><label><input type="checkbox" data-gt="' + t + '" checked> <b>' + esc(TURNOM[t] || t) + '</b></label> <span class="muted small">(' + D.length + ")</span></summary><div class=\"yig-ml\">" +
          D.map(function (d) { return '<label class="yig-c"><input type="checkbox" data-gi="' + L.indexOf(d) + '" data-gt-of="' + t + '" checked> ' + (d.dars ? '<span class="no">' + esc(d.dars) + "-dars</span> " : "") + esc(d.sarlavha) + "</label>"; }).join("") + "</div></details>";
      }).join("") + "</fieldset>" +
      '<fieldset class="yig-r"><legend>Qanday chiqarilsin</legend><label class="yig-c"><input type="radio" name="genc" value="bir" checked> Bitta umumiy hujjat</label><label class="yig-c"><input type="radio" name="genc" value="tur"> Turlar bo‘yicha alohida fayllar (ZIP)</label><label class="yig-c"><input type="radio" name="genc" value="har"> Har hujjat alohida fayl (ZIP)</label></fieldset>' +
      '<p class="small" data-gs></p><div class="toolbar"><button type="button" class="btn" data-gw>Yuklab olish</button><button type="button" class="btn ghost" data-gp>Chop etish / PDF</button></div>';
    var $$ = function (q) { return Array.prototype.slice.call(box.querySelectorAll(q)); };
    function tanl() { return $$("[data-gi]:checked").map(function (c) { return L[+c.getAttribute("data-gi")]; }); }
    function rej() { return (box.querySelector('[name="genc"]:checked') || {}).value || "bir"; }
    function yangila() {
      $$("[data-gt]").forEach(function (g) { var D = $$('[data-gt-of="' + g.getAttribute("data-gt") + '"]'), c = D.filter(function (x) { return x.checked; }).length; g.checked = c === D.length && c > 0; g.indeterminate = c > 0 && c < D.length; });
      box.querySelector("[data-gs]").innerHTML = "Tanlandi: <b>" + tanl().length + "</b> / " + L.length + " ta hujjat.";
      box.querySelector("[data-gw]").textContent = rej() === "bir" ? "Word (.doc) yuklab olish" : "ZIP yuklab olish";
    }
    box.addEventListener("change", function (e) { var t = e.target; if (t.hasAttribute("data-gt")) $$('[data-gt-of="' + t.getAttribute("data-gt") + '"]').forEach(function (x) { x.checked = t.checked; }); yangila(); });
    $$("[data-ga]").forEach(function (b) { b.addEventListener("click", function () { var v = b.getAttribute("data-ga") === "1"; $$("[data-gi]").forEach(function (c) { c.checked = v; }); yangila(); }); });
    $$("summary label").forEach(function (l) { l.addEventListener("click", function (e) { e.stopPropagation(); }); });
    function matn(d) {
      if (d.html) return Promise.resolve(d.html);
      return Promise.all([d.B.F.getDoc(d.B.F.doc(d.B.db, "t1_materiallar", d.mid, "matnlar", d.xid)), purify()]).then(function (r) { d.html = r[0].exists() ? window.DOMPurify.sanitize(r[0].data().html || "") : ""; return d.html; });
    }
    function yig(list) { return Promise.all(list.map(matn)).then(function (hs) { return list.map(function (d, i) { return { d: d, h: hs[i] }; }).filter(function (x) { return x.h; }); }); }
    function bitta(X) {
      var h = '<div class="titul" style="text-align:center;padding:30mm 0 20mm"><p>Toshkent tuman 1-son texnikumi</p><h1 style="font-size:26pt">' + esc(FAN) + "</h1><p>fanidan</p><h2>O‘QUV-USLUBIY MAJMUA</h2><p>" + esc(YN) + "</p><p>" + esc(cur) + "-semestr</p><p>2026</p></div>", oldT = "", n = 0;
      X.forEach(function (x) { if (x.d.tur !== oldT) { oldT = x.d.tur; n++; h += '<h2 class="yb">' + n + ". " + esc(TURNOM[oldT] || oldT) + "</h2>"; } h += "<h3>" + (x.d.dars ? esc(x.d.dars) + "-dars. " : "") + esc(x.d.sarlavha) + "</h3>" + x.h; });
      return h;
    }
    function ish(btn, fn) {
      var L2 = tanl(); if (!L2.length) { alert("Kamida bitta hujjatni belgilang."); return; }
      var eski = btn.textContent; btn.disabled = true; btn.textContent = "Tayyorlanmoqda…";
      yig(L2).then(fn)["catch"](function (e) { alert("Tayyorlanmadi: " + (window.t1Bulut ? t1Bulut.uzXato(e) : e)); }).then(function () { btn.disabled = false; btn.textContent = eski; });
    }
    box.querySelector("[data-gp]").addEventListener("click", function () { ish(this, function (X) { t1RTR.chop(bitta(X)); }); });
    box.querySelector("[data-gw]").addEventListener("click", function () {
      var r = rej(), nom = FAN + " — O‘UM";
      ish(this, function (X) {
        if (r === "bir") { t1RTR.word(bitta(X), nom); return; }
        var parts = [];
        if (r === "har") X.forEach(function (x, i) { parts.push({ nom: (i < 9 ? "0" : "") + (i + 1) + " " + (TURNOM[x.d.tur] || x.d.tur) + (x.d.dars ? " " + x.d.dars + "-dars" : "") + " — " + x.d.sarlavha, html: "<h1>" + esc(x.d.sarlavha) + "</h1>" + x.h }); });
        else GTUR.forEach(function (t) { var Y = X.filter(function (x) { return x.d.tur === t; }); if (Y.length) parts.push({ nom: (parts.length < 9 ? "0" : "") + (parts.length + 1) + " " + (TURNOM[t] || t), html: "<h1>" + esc(TURNOM[t] || t) + "</h1><p>" + esc(FAN) + "</p>" + Y.map(function (x) { return "<h3>" + (x.d.dars ? esc(x.d.dars) + "-dars. " : "") + esc(x.d.sarlavha) + "</h3>" + x.h; }).join("") }); });
        return t1RTR.zipla(parts, nom + (r === "har" ? " — hujjatlar" : " — turlar bo‘yicha"));
      });
    });
    yangila();
  }
  function kb(n) { n = +n || 0; return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; }
  var PUR = null;
  function purify() {
    if (window.DOMPurify) return Promise.resolve();
    if (!PUR) PUR = new Promise(function (ok, no) { var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
    return PUR;
  }
  /* Google Drive havolalari (fayllar texnikum Drive papkasida, "havolasi borlar ko'ra oladi" rejimida) */
  var DRIVE = {
    preview: function (id) { return "https://drive.google.com/file/d/" + encodeURIComponent(id) + "/preview"; },
    yukla: function (id) { return "https://drive.google.com/uc?export=download&id=" + encodeURIComponent(id); },
    rasm: function (id) { return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(id) + "&sz=w1600"; },
    oyna: function (id, nom) {
      var d = document.getElementById("drive-oyna");
      if (!d) {
        d = document.createElement("dialog"); d.id = "drive-oyna";
        d.innerHTML = '<div class="dh"><h3></h3><a class="btn sm ghost" target="_blank" rel="noopener">Yangi oynada</a><button class="btn sm" value="x">Yopish</button></div><iframe style="width:100%;height:75vh;border:0" allow="autoplay; fullscreen"></iframe>';
        d.querySelector("button").addEventListener("click", function () { d.close(); d.querySelector("iframe").src = "about:blank"; });
        document.body.appendChild(d);
      }
      d.querySelector("h3").textContent = nom || "Fayl";
      d.querySelector("a").href = "https://drive.google.com/file/d/" + encodeURIComponent(id) + "/view";
      d.querySelector("iframe").src = DRIVE.preview(id);
      if (d.showModal) d.showModal(); else window.open(d.querySelector("a").href, "_blank");
    }
  };
  window.t1Drive = DRIVE;
})();
