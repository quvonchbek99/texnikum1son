/* Yo'nalish sahifasi: o'qituvchilar joylagan materiallari bor fanlarni belgilaydi (sahifa ochilgach, fon rejimida). */
(function () {
  "use strict";
  var el = document.getElementById("yon"); if (!el || !window.t1Bulut) return;
  var Y = el.getAttribute("data-y");
  function go() {
    t1Bulut.load().then(function (B) {
      var F = B.F;
      return F.getDocs(F.query(F.collection(B.db, "t1_materiallar"), F.where("yonalish", "==", Y), F.where("holat", "==", "joylangan")));
    }).then(function (qs) {
      qs.forEach(function (d) {
        var x = d.data();
        Array.prototype.forEach.call(document.querySelectorAll('[data-sem-p="' + x.sem + '"] [data-mat="' + x.fan + '"]'), function (c) { c.outerHTML = '<span class="tag ok">material bor</span>'; });
      });
    })["catch"](function () {});
  }
  if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 1200);
})();
