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
  var CACHE = null, cur = null;

  function sem0() { var s = new URLSearchParams(location.search).get("sem"); return SEMS.indexOf(s) >= 0 ? s : (root.getAttribute("data-def") || SEMS[0]); }
  function reset() {
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
    pr.then(function () { return dinamik(s); })["catch"](function (e) { console.warn("[fan]", e); });
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
    }
    F.getDocs(F.query(F.collection(B.db, "t1_materiallar", m.id, "hujjatlar"), F.orderBy("tartib"))).then(function (qs) {
      var by = {};
      qs.forEach(function (d) { var x = d.data(); x.id = d.id; if (x.turi === "rtr") return; var p = TUR2P[x.turi] || "fayllar"; (by[p] = by[p] || []).push(x); });
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
