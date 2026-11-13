/* Fanlar katalogi (bosh sahifa): qidiruv, fan turi va mutaxassislik filtri, «material bor» belgisi.
   URL: ?q=so'z &t=kasbiy|umumtalim &y=mutaxassislik_id &m=1 */
(function () {
  "use strict";
  var fq = document.getElementById("fq"); if (!fq) return;
  var ROOT = document.body.getAttribute("data-root") || "";
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function norm(s) { return String(s || "").toLowerCase().replace(/[ʻʼ‘’`´'"«»“”]/g, "").replace(/\s+/g, " ").trim(); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var seg = $$(".seg [data-tf]"), fy = document.getElementById("fy"), fm = document.getElementById("fm");
  var soni = document.getElementById("fsoni"), bosh = document.getElementById("fbosh"), mav = document.getElementById("fmav");
  var cards = $$(".fk"), blocks = $$(".ys"), secs = $$(".fsek");
  var S = { q: "", t: "", y: "", m: false }, MAV = null, MAT = {};

  var Q = new URLSearchParams(location.search);
  S.q = Q.get("q") || ""; S.t = /^(kasbiy|umumtalim)$/.test(Q.get("t") || "") ? Q.get("t") : "";
  S.y = Q.get("y") || ""; S.m = Q.get("m") === "1";
  if (S.y && !fy.querySelector('option[value="' + S.y.replace(/"/g, "") + '"]')) S.y = "";
  fq.value = S.q; fy.value = S.y; fm.checked = S.m;

  cards.forEach(function (c) { if (!c.querySelector("[data-mat]").hidden) MAT[c.getAttribute("data-k")] = 1; });

  function url() {
    var p = new URLSearchParams();
    if (S.q) p.set("q", S.q); if (S.t) p.set("t", S.t); if (S.y) p.set("y", S.y); if (S.m) p.set("m", "1");
    var f = new URLSearchParams(location.search).get("fasl"); if (f) p.set("fasl", f);
    var s = p.toString();
    try { history.replaceState(null, "", location.pathname + (s ? "?" + s : "")); } catch (e) {}
  }
  function go() {
    var ws = norm(S.q).split(" ").filter(Boolean), n = 0;
    seg.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-tf") === S.t ? "true" : "false"); });
    cards.forEach(function (c) {
      var t = c.getAttribute("data-t"), blk = c.closest(".ys"), yid = blk ? blk.getAttribute("data-y") : "";
      var ok = (!S.t || t === S.t) && (!S.y || t === "umumtalim" || yid === S.y) && (!S.m || MAT[c.getAttribute("data-k")]);
      if (ok && ws.length) { var h = c.getAttribute("data-n"); ok = ws.every(function (w) { return h.indexOf(w) >= 0; }); }
      c.hidden = !ok; if (ok) n++;
    });
    blocks.forEach(function (b) { b.hidden = !b.querySelector(".fk:not([hidden])"); });
    secs.forEach(function (s) { s.hidden = !s.querySelector(".fk:not([hidden])"); });
    bosh.hidden = n > 0;
    soni.textContent = (S.q || S.t || S.y || S.m) ? n + " ta fan topildi" : n + " ta fan";
    mavzular(ws);
    url();
  }
  function mavzular(ws) {
    var box = mav.querySelector(".q-res");
    if (!ws.length || S.q.length < 3) { mav.hidden = true; return; }
    if (!MAV) {
      MAV = [];
      fetch(ROOT + "data/qidiruv.json").then(function (r) { return r.json(); }).then(function (d) {
        MAV = d.filter(function (x) { return x.k === "m"; }).map(function (x) { x.n = norm(x.t + " " + (x.s || "")); return x; }); go();
      })["catch"](function () {});
      return;
    }
    var r = MAV.filter(function (x) { return ws.every(function (w) { return x.n.indexOf(w) >= 0; }); }).slice(0, 8);
    mav.hidden = !r.length;
    box.innerHTML = r.map(function (x) { return '<a href="' + ROOT + x.u + '"><b>' + esc(x.t) + "</b><small>" + esc(x.s || "") + "</small></a>"; }).join("");
  }
  var tm = 0;
  fq.addEventListener("input", function () { clearTimeout(tm); tm = setTimeout(function () { S.q = fq.value.trim(); go(); }, 120); });
  seg.forEach(function (b) { b.addEventListener("click", function () { S.t = b.getAttribute("data-tf"); go(); }); });
  fy.addEventListener("change", function () { S.y = fy.value; go(); });
  fm.addEventListener("change", function () { S.m = fm.checked; go(); });
  document.getElementById("ftoz").addEventListener("click", function () { S = { q: "", t: "", y: "", m: false }; fq.value = ""; fy.value = ""; fm.checked = false; go(); fq.focus(); });
  go();

  // O'qituvchilar kabinet orqali joylagan materiallar (Firestore) — fon rejimida belgilanadi
  function bulut() {
    if (!window.t1Bulut) return;
    t1Bulut.load().then(function (B) {
      var F = B.F;
      return F.getDocs(F.query(F.collection(B.db, "t1_materiallar"), F.where("holat", "==", "joylangan")));
    }).then(function (qs) {
      qs.forEach(function (d) {
        var x = d.data(), k = x.yonalish + "|" + x.fan; MAT[k] = 1;
        $$('.fk[data-k="' + k.replace(/"/g, "") + '"] [data-mat]').forEach(function (t) { t.hidden = false; });
      });
      if (S.m) go();
    })["catch"](function () {});
  }
  if ("requestIdleCallback" in window) requestIdleCallback(bulut, { timeout: 2500 }); else setTimeout(bulut, 1200);
})();
