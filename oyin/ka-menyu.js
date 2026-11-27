/*! Kuvonch Academy — bosh menyudagi «Fanlar» ochiladigan paneli (tashqariga bosilsa yoki Esc bosilsa yopiladi) */
(function () {
  "use strict";
  var D = document;
  function all() { return Array.prototype.slice.call(D.querySelectorAll("details.kdd")); }
  function place(d) {
    var s = d.querySelector("summary"), p = d.querySelector(".kdd-p"); if (!s || !p) return;
    var r = s.getBoundingClientRect(), w = Math.min(560, innerWidth - 20);
    p.style.width = w + "px";
    p.style.left = Math.max(10, Math.min(r.left, innerWidth - w - 10)) + "px";
    p.style.top = Math.round(r.bottom + 8) + "px";
  }
  D.addEventListener("toggle", function (e) { var d = e.target; if (d && d.classList && d.classList.contains("kdd") && d.open) { all().forEach(function (o) { if (o !== d) o.open = false; }); place(d); } }, true);
  D.addEventListener("click", function (e) { all().forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; }); });
  D.addEventListener("keydown", function (e) { if (e.key === "Escape") all().forEach(function (d) { d.open = false; }); });
  addEventListener("resize", function () { all().forEach(function (d) { if (d.open) place(d); }); });
  addEventListener("scroll", function () { all().forEach(function (d) { if (d.open) d.open = false; }); }, { passive: true });
})();
